const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { Product, Cart } = require("../../models");
const { redis } = require("../../Redis");

class CartAPI extends RESTDataSource {
  constructor() {
    super();
    this.signInError = "Please sign in";
  }

  /**
   * Get products in cart for the mail public web-app
   * @Expects: pagination parameters, Password
   * @Returns: object with products, count and query status
   * */
  async getCartItems() {
    try {
      /*
       * Get products in cart from the database
       * */
      const {
        customerDetails: { username },
      } = this.context.session;
      const cartItems = await Cart.findAll({
        attributes: [`id`, `customerSpecification`, `createdAt`, `quantity`],
        where: {
          addedBy: username,
        },
        order: [[`createdAt`, `DESC`]],
        include: {
          model: Product,
          attributes: [
            `productName`,
            `productDescription`,
            `productPicMain`,
            `productPicTwo`,
            `productPicThree`,
            `productPicFour`,
            `productUnitOfMeasure`,
            `productInstructionsLink`,
            `productVideoLink`,
            `stockStatus`,
            `productPrice`,
            `productStatus`,
            `expiryDate`,
          ],
          required: true,
          where: {
            productStatus: 1,
          },
        },
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not fetch products in cart",
          actualError: "Could not fetch products from the database.",
          customerMessage:
            "Nothing to show here right now. Please come back later as we work to resolve this.",
        });
        return {
          status: false,
          message:
            "Nothing to show here right now. Items you add to your cart will appear here.",
        };
      });

      console.log(JSON.stringify(cartItems));

      const cartItemsList =
        cartItems && Array.isArray(cartItems) && cartItems.length > 0
          ? cartItems.map((cartItem) => CartAPI.cartReducer(cartItem))
          : [];

      console.log(cartItemsList);

      return {
        status: true,
        message: "",
        cartItemsList,
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

  async addToCart(args) {
    const {
      input: { productId, quantity, customerSpecification },
    } = args;

    if (!this.context.session.customerDetails) {
      throw new Error(this.signInError);
    }

    // Authentication Check
    // To add to cart, a customer must be logged in. This will ensure we maintain the cart across sessions and devices.
    const { bearerToken } = this.context.session.customerDetails;
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      throw new Error(this.signInError);
    }

    try {
      /*
       * Get products in cart from the database
       * */
      const {
        customerDetails: { username },
      } = this.context.session;
      await Cart.create({
        productId,
        quantity,
        customerSpecification,
        addedBy: username,
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not add to cart",
          actualError: "Could not add to cart",
          customerMessage:
            "We are unable to add to your cart at the moment. Please try again later!",
        });
        return {
          status: false,
          message:
            "We are unable to add to your cart at the moment. Please try again later!",
        };
      });

      return {
        status: true,
        message: "Added to cart successfully",
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

  async removeCartItem(args) {
    const { id } = args;

    if (!this.context.session.customerDetails) {
      throw new Error(this.signInError);
    }

    // Authentication Check
    // To add to cart, a customer must be logged in. This will ensure we maintain the cart across sessions and devices.
    const { bearerToken } = this.context.session.customerDetails;
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      throw new Error(this.signInError);
    }

    try {
      /*
       * Get products in cart from the database
       * */
      const {
        customerDetails: { username },
      } = this.context.session;
      return await Cart.destroy({
        where: {
          id,
          addedBy: username,
        },
      })
        .then((count) => {
          if (!count) {
            return {
              status: false,
              message: "Item could not be removed from the cart",
            };
          }
          return {
            status: true,
            message: "Item deleted from the cart successfully",
          };
        })
        .catch((err) => {
          Logger.log("error", "Error: ", {
            fullError: err,
            customError: "Could not add to cart",
            actualError: "Could not add to cart",
            customerMessage:
              "We are unable to add to your cart at the moment. Please try again later!",
          });
          return {
            status: false,
            message:
              "We are unable to add to your cart at the moment. Please try again later!",
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

  /*
   * Map products in cart
   *
   * Something about this Many to many is off. To be revisited
   * */
  static cartReducer(cartItem) {
    return {
      id: cartItem.id,
      productName: cartItem.Product.productName,
      productDescription: cartItem.Product.productDescription,
      productPicMain: cartItem.Product.productPicMain,
      productPicTwo: cartItem.Product.productPicTwo,
      productPicThree: cartItem.Product.productPicThree,
      productPicFour: cartItem.Product.productPicFour,
      productUnitOfMeasure: cartItem.Product.productUnitOfMeasure,
      productInstructionsLink: cartItem.Product.productInstructionsLink,
      productVideoLink: cartItem.Product.productVideoLink,
      stockStatus: cartItem.Product.stockStatus,
      productPrice: cartItem.Product.productPrice,
      productStatus: cartItem.Product.productStatus,
      expiryDate: cartItem.Product.expiryDate,
      customerSpecification: cartItem.customerSpecification,
      createdAt: cartItem.createdAt,
      quantity: cartItem.quantity,
    };
  }
}

module.exports = CartAPI;
