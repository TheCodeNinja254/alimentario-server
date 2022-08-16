const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { Product, Cart } = require("../../models");

class CartAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
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
        attributes: [`customerSpecification`, `createdAt`, `quantity`],
        where: {
          addedBy: username,
        },
        include: {
          model: Product,
          attributes: [
            `id`,
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
      });

      /*
       * In the event we go nothing from the database
       * */
      if (!cartItems) {
        Logger.log("error", "Error: ", {
          fullError: "Could not fetch products in cart",
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
      }

      const cartItemsList =
        cartItems && Array.isArray(cartItems) && cartItems.length > 0
          ? cartItems.map((cartItem) => CartAPI.cartReducer(cartItem))
          : [];

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
    try {
      /*
       * Get products in cart from the database
       * */
      const {
        customerDetails: { username },
      } = this.context.session;
      const cartCreate = await Cart.create({
        productId,
        quantity,
        customerSpecification,
        addedBy: username,
      });

      /*
       * In the event we go nothing from the database
       * */
      if (!cartCreate) {
        Logger.log("error", "Error: ", {
          fullError: "Could not add to cart",
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
      }

      console.log(cartCreate);

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

  /*
   * Map products in cart
   * */
  static cartReducer(cartItem) {
    return {
      id: cartItem.Product.id,
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
