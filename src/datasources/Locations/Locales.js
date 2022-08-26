const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { Locale } = require("../../models");
const { redis } = require("../../Redis");

class LocalesAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
    this.signInError = "Please sign in";
  }

  /**
   * Get locales in db for the public web-app
   * @Returns: object with locales, count and query status
   * */
  async getLocales(args) {
    const { countyId } = args;
    try {
      const locales = await Locale.findAll({
        attributes: [`id`, `localeName`],
        where: { countyId },
        order: [[`localeName`, `ASC`]],
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

      const localesList =
        locales && Array.isArray(locales) && locales.length > 0
          ? locales.map((locale) => LocalesAPI.localesReducer(locale))
          : [];

      return {
        status: true,
        message: "",
        localesList,
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

  async addLocale(args) {
    const {
      input: { localeName, countyId },
    } = args;

    if (!this.context.session.userDetails) {
      throw new Error(this.signInError);
    }

    // Authentication Check
    // To add to cart, a customer must be logged in. This will ensure we maintain the cart across sessions and devices.
    const {
      userDetails: { username, bearerToken },
    } = this.context.session;
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      throw new Error(this.signInError);
    }

    try {
      await Locale.create({
        localeName,
        countyId,
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
        message: "Locale added successfully",
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

  async removeLocale(args) {
    const { id } = args;

    if (!this.context.session.userDetails) {
      throw new Error(this.signInError);
    }

    // Authentication Check
    // To add to cart, a customer must be logged in. This will ensure we maintain the cart across sessions and devices.
    const { bearerToken } = this.context.session.userDetails;
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      throw new Error(this.signInError);
    }

    try {
      return await Locale.destroy({
        where: {
          id,
        },
      })
        .then((count) => {
          if (!count) {
            return {
              status: false,
              message: "Locale could not be deleted",
            };
          }
          return {
            status: true,
            message: "Locale could not be deleted",
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
            message: "Locale could not be deleted. Please try again later!",
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

  static localesReducer(locale) {
    return {
      id: locale.id,
      localeName: locale.localeName,
    };
  }
}

module.exports = LocalesAPI;
