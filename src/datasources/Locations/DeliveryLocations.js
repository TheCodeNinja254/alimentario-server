const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { DeliveryLocations, Country, County, Locale } = require("../../models");
const { redis } = require("../../Redis");

class DeliveryLocationsAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /**
   * Get delivery locations in db for the public web-app
   * @Returns: object with locales, count and query status
   * */
  async getDeliveryLocations() {
    const {
      customerDetails: { username },
    } = this.context.session;

    try {
      const locales = await DeliveryLocations.findAll({
        attributes: [
          `id`,
          `countryId`,
          `countyId`,
          `localeId`,
          `deliveryPreciseLocation`,
          `deliveryAdditionalNotes`,
          `alternativePhoneNumber`,
        ],
        where: { addedBy: username },
        order: [[`id`, `DESC`]],
        include: [
          {
            model: Country,
            attributes: [`countryName`, `countyFlagUri`],
            required: true,
          },
          {
            model: County,
            attributes: [`countyName`],
            required: true,
          },
          {
            model: Locale,
            attributes: [`localeName`],
            required: true,
          },
        ],
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not fetch locales",
          actualError: "Could not fetch locales",
          customerMessage:
            "Nothing to show here right now. Please come back later as we work to resolve this.",
        });
        return {
          status: false,
          message:
            "Nothing to show here right now. Items you add to your cart will appear here.",
        };
      });

      const locationsList =
        locales && Array.isArray(locales) && locales.length > 0
          ? locales.map((locale) =>
              DeliveryLocationsAPI.deliveryLocationsReducer(locale)
            )
          : [];

      return {
        status: true,
        message: "",
        locationsList,
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

  async addDeliveryLocation(args) {
    const {
      input: {
        countyId,
        localeId,
        deliveryPreciseLocation,
        deliveryAdditionalNotes,
        alternativePhoneNumber,
      },
    } = args;

    if (!this.context.session.userDetails) {
      throw new Error(this.signInError);
    }

    const countryId = 1;

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
      await DeliveryLocations.create({
        countryId,
        countyId,
        localeId,
        deliveryPreciseLocation,
        deliveryAdditionalNotes,
        alternativePhoneNumber,
        addedBy: username,
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not add to locales list",
          actualError: "Could not add to locales list",
          customerMessage:
            "We are unable to add the locale at the moment. Please try again later!",
        });
        return {
          status: false,
          message:
            "We are unable to add the county at the moment. Please try again later!",
        };
      });

      return {
        status: true,
        message: "Preferred delivery location added successfully",
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

  async removeDeliveryLocation(args) {
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
      return await DeliveryLocations.destroy({
        where: {
          id,
        },
      })
        .then((count) => {
          if (!count) {
            return {
              status: false,
              message: "Previous preferred location could not be deleted",
            };
          }
          return {
            status: true,
            message: "Previous preferred location removed from your list.",
          };
        })
        .catch((err) => {
          Logger.log("error", "Error: ", {
            fullError: err,
            customError: "Locale could not be deleted",
            actualError: "Locale could not be deleted",
            customerMessage:
              "Locale could not be deleted. Please try again later!",
          });
          return {
            status: false,
            message:
              "Previous preferred location could not be deleted. Please try again later!",
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
          "An error occurred. The locale could not be created, please try again later!",
      });

      return {
        status: false,
        message: e.message,
      };
    }
  }

  static deliveryLocationsReducer(locale) {
    return {
      id: locale.id,
      countryId: locale.countryId,
      countyId: locale.countyId,
      localeId: locale.localeId,
      deliveryPreciseLocation: locale.deliveryPreciseLocation,
      deliveryAdditionalNotes: locale.deliveryAdditionalNotes,
      alternativePhoneNumber: locale.alternativePhoneNumber,
      countryName: locale.Country.countryName,
      countyFlagUri: locale.Country.countyFlagUri,
      countyName: locale.County.localeName,
      localeName: locale.Locale.localeName,
    };
  }
}

module.exports = DeliveryLocationsAPI;
