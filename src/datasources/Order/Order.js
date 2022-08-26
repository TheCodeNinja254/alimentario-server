const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { County, Order, OrderSpecification, Cart } = require("../../models");
const { redis } = require("../../Redis");

class OrdersAPI extends RESTDataSource {
  constructor() {
    super();
    this.signInError = "Please sign in";
  }

  /**
   * Get counties in db for the public web-app
   * @Returns: object with counties, count and query status
   * */
  async getCounties(args) {
    const { countryId } = args;
    try {
      const counties = await County.findAll({
        attributes: [`id`, `countyName`],
        where: { countryId },
        order: [[`countyName`, `ASC`]],
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not fetch counties",
          actualError: "Could not fetch counties",
          customerMessage:
            "Nothing to show here right now. Please come back later as we work to resolve this.",
        });
        return {
          status: false,
          message:
            "Nothing to show here right now. Items you add to your cart will appear here.",
        };
      });

      const countiesList =
        counties && Array.isArray(counties) && counties.length > 0
          ? counties.map((county) => OrdersAPI.countiesReducer(county))
          : [];

      return {
        status: true,
        message: "",
        countiesList,
      };
    } catch (e) {
      /*
       * Create a log instance with the error
       * */
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
          "An error occurred. This is temporary and should resolve in a short time. " +
          "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });

      return {
        status: false,
        message: e.message,
      };
    }
  }

  async addOrder(args) {
    const {
      input: { cartItemsList, amountDue, deliveryLocationId, orderType },
    } = args;

    if (!this.context.session.customerDetails) {
      throw new Error(this.signInError);
    }

    const paymentId = 1;

    // Authentication Check
    // To add to cart, a customer must be logged in. This will ensure we maintain the cart across sessions and devices.
    const {
      customerDetails: { username, bearerToken },
    } = this.context.session;
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      throw new Error(this.signInError);
    }

    try {
      await Order.create({
        amountDue,
        deliveryLocationId,
        orderType,
        paymentId,
        addedBy: username,
      })
        .then((res) => {
          if (Array.isArray(cartItemsList) && cartItemsList.length > 0) {
            cartItemsList.map(async (item) => {
              await OrderSpecification.create({
                orderId: res.id,
                productId: item.productId,
                productQuantity: item.quantity,
                orderSpecification: item.customerSpecification,
                addedBy: username,
              });
            });
          }
        })
        .then(() => {
          cartItemsList.map(async (cartItem) => {
            await Cart.destroy({
              where: {
                id: cartItem.id,
              },
            }).catch((err) => {
              Logger.log("error", "Error: ", {
                fullError: err,
                customError: "Could not delete cart item",
                actualError: "Could not delete cart item",
                customerMessage:
                  "We are unable to remove the item from the cart.",
              });
            });
          });
        })
        .then(() => {
          return {
            status: true,
            message: "Order created successfully",
          };
        })
        .catch((err) => {
          Logger.log("error", "Error: ", {
            fullError: err,
            customError: "Could not create order",
            actualError: "Could not create order",
            customerMessage:
              "We are unable to add the order. Please try again later!",
          });
          return {
            status: false,
            message: "We are unable to add the order. Please try again later!",
          };
        });
    } catch (e) {
      /*
       * Create a log instance with the error
       * */
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
          "An error occurred. This is temporary and should resolve in a short time. " +
          "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });

      return {
        status: false,
        message: e.message,
      };
    }
  }

  static countiesReducer(county) {
    return {
      id: county.id,
      countyName: county.countyName,
    };
  }
}

module.exports = OrdersAPI;
