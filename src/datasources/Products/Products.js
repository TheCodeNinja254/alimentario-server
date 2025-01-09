const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { Product } = require("../../models");

class ProductsAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /**
   * Get products for the main public web-app
   * @Expects: pagination parameters
   * @Returns: object with products, count and query status
   * */
  async getDisplayProducts(args) {
    const { productCategory, productFamily } = args;

    try {
      /**
       * Get products from the database
       * */

      /**
       * Get products from the DB that match a given
       * product category, family and product status = 1 (Still on sale)
       *  */
      let filters = {
        productStatus: 1,
        productCategory,
        productFamily,
      };

      /**
       * Get all products relevant to a specific product family and
       * product status = 1 meaning the product is still on sale
       *  */
      if (productCategory === 0) {
        filters = {
          productStatus: 1,
          productFamily,
        };
      }

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
          `tag`,
          `productFamily`,
          `vendor`,
          `originCountry`,
        ],
        order: [[`popularity`, `DESC`]],
        where: filters,
      });

      /**
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

      const productsList = products && Array.isArray(products) && products.length > 0
        ? products.map((product) => ProductsAPI.productsReducer(product))
        : [];

      return {
        status: true,
        message: "",
        productsList,
      };
    } catch (e) {
      /**
       * Create a log instance with the error
       * */
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

  /**
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
      tag: product.tag,
      productFamily: product.productFamily,
      originCountry: product.originCountry,
      vendor: product.vendor,
    };
  }
}

module.exports = ProductsAPI;
