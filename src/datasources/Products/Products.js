const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { Product } = require("../../models");

class ProductsAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /**
   * Get products for the mail public web-app
   * @Expects: pagination parameters, Password
   * @Returns: object with products, count and query status
   * */
  async getDisplayProducts() {
    try {
      /*
       * Get products from the database
       * */
      const products = await Product.findAll({
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
          `productCategory`,
        ],
        order: [[`createdAt`, `DESC`]],
        where: {
          productStatus: 1,
        },
      });

      /*
       * In the event we go nothing from the database
       * */
      if (!products) {
        Logger.log("error", "Error: ", {
          fullError: "Could not fetch products",
          customError: "Could not fetch products",
          actualError: "Could not fetch products from the database.",
          customerMessage:
            "Nothing to show here right now. Please come back later as we work to resolve this.",
        });
        return {
          status: false,
          message:
            "Nothing to show here right now. Please come back later as we work to resolve this.",
        };
      }

      const productsList =
        products && Array.isArray(products) && products.length > 0
          ? products.map((product) => ProductsAPI.productsReducer(product))
          : [];

      return {
        status: true,
        message: "",
        productsList,
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
   * Map products
   * */
  static productsReducer(product) {
    return {
      id: product.id,
      productName: product.productName,
      productDescription: product.productDescription,
      productPicMain: product.productPicMain,
      productPicTwo: product.productPicTwo,
      productPicThree: product.productPicThree,
      productPicFour: product.productPicFour,
      productUnitOfMeasure: product.productUnitOfMeasure,
      productInstructionsLink: product.productInstructionsLink,
      productVideoLink: product.productVideoLink,
      stockStatus: product.stockStatus,
      productPrice: product.productPrice,
      productStatus: product.productStatus,
      expiryDate: product.expiryDate,
      productCategory: product.productCategory,
    };
  }
}

module.exports = ProductsAPI;
