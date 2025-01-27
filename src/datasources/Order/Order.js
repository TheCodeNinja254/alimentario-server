const { RESTDataSource } = require("apollo-datasource-rest");
const { Sequelize } = require("sequelize");
const uuid = require("uuid/v4");
const Logger = require("../../utils/logging");
const {
  County, Order, OrderSpecification, Cart,
} = require("../../models");
const { redis } = require("../../Redis");
const sequelize = require("../../Database/connection");
const {
  selectOrdersCountQuery,
  selectOrdersWithoutStatusQuery,
  selectOrderSpecificationsQuery,
  selectPendingOrdersQuery,
  selectClosedOrdersQuery,
  selectPendingOrdersCountQuery,
  selectClosedOrdersCountQuery,
  selectOrdersCountQueryAdminView,
  selectClosedOrdersCountQueryAdminView,
  selectPendingOrdersQueryAdminView,
  selectClosedOrdersQueryAdminView,
  selectOrdersWithoutStatusQueryAdminView,
} = require("../../Database/queryStrings");

class OrdersAPI extends RESTDataSource {
  constructor() {
    super();
    this.signInError = "Please sign in";
  }

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

      const countiesList = counties && Array.isArray(counties) && counties.length > 0
        ? counties.map((county) => OrdersAPI.countiesReducer(county))
        : [];

      return {
        status: true,
        message: "",
        countiesList,
      };
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
                    "An error occurred. This is temporary and should resolve in a short time. "
                    + "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });

      return {
        status: false,
        message: e.message,
      };
    }
  }

  async addOrder(args) {
    const {
      input: {
        cartItemsList, amountDue, deliveryLocationId, orderType, isPreorder,
        preferredDeliveryTime,
      },
    } = args;

    if (!this.context.session.customerDetails) {
      throw new Error(this.signInError);
    }

    const paymentId = uuid(); // this will then become paymentCorrelationId

    /**
     * The @paymentCorrelationId (above referred to as the paymentId) is associated to an order,
     * it is sent to a callback URL as part of the URL-Slug, the last part
     * The callback processor picks it and updates the payments table with the
     * payment information indicating the paymentCorrelationId on the payments table
     * */

    const {
      customerDetails: { username, bearerToken },
    } = this.context.session;

    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      throw new Error(this.signInError);
    }

    let result = {
      status: false,
      message: "We are unable to create your order. We regret this and will fix shortly. Please try again later!",
    };

    try {
      await Order.create({
        amountDue,
        deliveryLocationId,
        orderType,
        paymentId, // creates the correlation id in the database here.
        isPreorder,
        preferredDeliveryTime,
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
                customerMessage: "We are unable to remove the item from the cart.",
              });
            });
          });
        })
        .then(() => {
          result = {
            status: true,
            paymentCorrelationId: paymentId,
            message: "Good job! Your order is made. We will prepare the sumptuous meal and bring it to you in a time. "
                            + "You can proceed to track your order. Thank you for shopping with Desafio.",
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
          result = {
            status: false,
            paymentCorrelationId: '',
            message: "We are unable to create your order. We regret this and will fix shortly. Please try again later!",
          };
        });

      return result;
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
                    "An error occurred. This is temporary and should resolve in a short time. "
                    + "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });

      return {
        status: false,
        paymentCorrelationId: '',
        message: e.message,
      };
    }
  }

  async getMyOrders(args) {
    const { pageSize, orderStatus } = args;

    if (!this.context.session.customerDetails) {
      // throw new Error(this.signInError);
      return {
        status: false,
        message: "User not signed in",
      };
    }

    const {
      customerDetails: { username, bearerToken },
    } = this.context.session;

    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      // throw new Error(this.signInError);
      return {
        status: false,
        message: "User not signed in",
      };
    }

    try {
      let result = {
        status: false,
        message: "No orders to show",
        myOrders: [],
      };

      const selectOrdersQuery = (_username, _pageSize) => {
        switch (orderStatus) {
          case 'pending':
            return selectPendingOrdersQuery(_username, _pageSize);
          case 'closed':
            return selectClosedOrdersQuery(_username, _pageSize);
          default:
            return selectOrdersWithoutStatusQuery(_username, _pageSize);
        }
      };

      const selectCountQuery = (_username) => {
        switch (orderStatus) {
          case 'pending':
            return selectPendingOrdersCountQuery(_username);
          case 'closed':
            return selectClosedOrdersCountQuery(_username);
          default:
            return selectOrdersCountQuery(_username);
        }
      };

      const orders = await sequelize.query(selectOrdersQuery(username, pageSize), {
        type: Sequelize.QueryTypes.SELECT,
      });

      if (orders && orders.length > 0) {
        const ordersCount = await sequelize.query(selectCountQuery(username), { type: Sequelize.QueryTypes.SELECT });

        const ordersMap = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const order of orders) {
          const { orderId } = order;

          if (!ordersMap[orderId]) {
            ordersMap[orderId] = {
              orderId: order.orderId,
              paymentId: order.paymentId,
              amountDue: order.amountDue,
              deliveryLocationId: order.deliveryLocationId,
              orderStatus: order.orderStatus,
              orderType: order.orderType,
              addedBy: order.addedBy,
              updatedBy: order.updatedBy,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              countryId: order.countryId,
              countyId: order.countyId,
              localeId: order.localeId,
              deliveryLocation: {
                id: order.deliveryLocationId,
                deliveryLocation: order.deliveryLocation,
                deliveryPreciseLocation: order.deliveryPreciseLocation,
                latitude: order.deliveryLocationLatitude,
                longitude: order.deliveryLocationLongitude,
                additionalNotes: order.deliveryAdditionalNotes,
                alternativePhoneNumber: order.alternativePhoneNumber,
                countryName: order.countryName,
                countyName: order.countyName,
                localeName: order.localeName,
              },
              specifications: [],
            };
          }

          // eslint-disable-next-line no-await-in-loop
          const specifications = await sequelize.query(selectOrderSpecificationsQuery(orderId), { type: Sequelize.QueryTypes.SELECT });

          ordersMap[orderId].specifications.push(...specifications);
        }

        const ordersArray = Object.values(ordersMap);

        result = {
          status: true,
          message: "Orders fetched successfully!",
          myOrders: {
            currentSelection: pageSize,
            totalElements: ordersCount[0].orderCount || 0,
            content: ordersArray.reverse(),
          },
        };
        return result;
      } else {
        return result;
      }
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage: "An error occurred. This is temporary and should resolve in a short time. "
                    + "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });

      return {
        status: false,
        message: e.message,
      };
    }
  }

  async getOrders(args) {
    const { pageSize, orderStatus } = args;

    if (!this.context.session.userDetails) {
      // throw new Error(this.signInError);
      return {
        status: false,
        message: "User not signed in",
      };
    }

    const {
      userDetails: { username, bearerToken },
    } = this.context.session;

    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      // throw new Error(this.signInError);
      return {
        status: false,
        message: "User not signed in",
      };
    }

    try {
      let result = {
        status: false,
        message: "No orders to show",
        orders: [],
      };

      const selectOrdersQuery = (_pageSize) => {
        switch (orderStatus) {
          case 'pending':
            return selectPendingOrdersQueryAdminView(_pageSize);
          case 'closed':
            return selectClosedOrdersQueryAdminView(_pageSize);
          default:
            return selectOrdersWithoutStatusQueryAdminView(_pageSize);
        }
      };

      const selectCountQueryAdminView = () => {
        switch (orderStatus) {
          case 'pending':
            return selectOrdersCountQueryAdminView();
          case 'closed':
            return selectClosedOrdersCountQueryAdminView();
          default:
            return selectOrdersCountQueryAdminView();
        }
      };

      const orders = await sequelize.query(selectOrdersQuery(username, pageSize), {
        type: Sequelize.QueryTypes.SELECT,
      });

      if (orders && orders.length > 0) {
        const ordersCount = await sequelize.query(selectCountQueryAdminView(), { type: Sequelize.QueryTypes.SELECT });

        const ordersMap = {};

        // eslint-disable-next-line no-restricted-syntax
        for (const order of orders) {
          const { orderId } = order;

          if (!ordersMap[orderId]) {
            ordersMap[orderId] = {
              orderId: order.orderId,
              paymentId: order.paymentId,
              amountDue: order.amountDue,
              deliveryLocationId: order.deliveryLocationId,
              orderStatus: order.orderStatus,
              orderType: order.orderType,
              addedBy: order.addedBy,
              updatedBy: order.updatedBy,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              countryId: order.countryId,
              countyId: order.countyId,
              localeId: order.localeId,
              firstName: order.firstName,
              lastName: order.lastName,
              username: order.username,
              emailAddress: order.emailAddress,
              msisdn: order.msisdn,
              deliveryLocation: {
                id: order.deliveryLocationId,
                deliveryLocation: order.deliveryLocation,
                deliveryPreciseLocation: order.deliveryPreciseLocation,
                latitude: order.deliveryLocationLatitude,
                longitude: order.deliveryLocationLongitude,
                additionalNotes: order.deliveryAdditionalNotes,
                alternativePhoneNumber: order.alternativePhoneNumber,
                countryName: order.countryName,
                countyName: order.countyName,
                localeName: order.localeName,
              },
              specifications: [],
            };
          }

          // eslint-disable-next-line no-await-in-loop
          const specifications = await sequelize.query(selectOrderSpecificationsQuery(orderId), { type: Sequelize.QueryTypes.SELECT });

          ordersMap[orderId].specifications.push(...specifications);
        }

        const ordersArray = Object.values(ordersMap);

        result = {
          status: true,
          message: "Orders fetched successfully!",
          orders: {
            currentSelection: pageSize,
            totalElements: ordersCount[0].orderCount || 0,
            content: ordersArray.reverse(),
          },
        };
        return result;
      } else {
        return result;
      }
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage: "An error occurred. This is temporary and should resolve in a short time. "
          + "If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
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
