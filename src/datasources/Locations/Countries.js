const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { Country } = require("../../models");
const { redis } = require("../../Redis");

class CountriesAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /**
   * Get countries in db for the public web-app
   * @Returns: object with countries, count and query status
   * */
  async getCountries() {
    try {
      const countries = await Country.findAll({
        attributes: [`id`, `countryName`, `countyFlagUri`],
        order: [[`countryName`, `ASC`]],
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not fetch countries",
          actualError: "Could not fetch countries",
          customerMessage:
            "Nothing to show here right now. Please come back later as we work to resolve this.",
        });
        return {
          status: false,
          message:
            "Nothing to show here right now. Items you add to your cart will appear here.",
        };
      });

      const countriesList =
        countries && Array.isArray(countries) && countries.length > 0
          ? countries.map((country) => CountriesAPI.countriesReducer(country))
          : [];

      return {
        status: true,
        message: "",
        countriesList,
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

  async addCountry(args) {
    const {
      input: { countryName },
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
      await Country.create({
        countryName,
        countryFlagUri: "",
        addedBy: username,
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not add to country list",
          actualError: "Could not add to country list",
          customerMessage:
            "We are unable to add the country at the moment. Please try again later!",
        });
        return {
          status: false,
          message:
            "We are unable to add the country at the moment. Please try again later!",
        };
      });

      return {
        status: true,
        message: "Added country successfully",
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

  async removeCountry(args) {
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
      return await Country.destroy({
        where: {
          id,
        },
      })
        .then((count) => {
          if (!count) {
            return {
              status: false,
              message: "Country could not be deleted",
            };
          }
          return {
            status: true,
            message: "Country could not be deleted",
          };
        })
        .catch((err) => {
          Logger.log("error", "Error: ", {
            fullError: err,
            customError: "Country could not be deleted",
            actualError: "Country could not be deleted",
            customerMessage:
              "Country could not be deleted. Please try again later!",
          });
          return {
            status: false,
            message: "Country could not be deleted. Please try again later!",
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
  static countriesReducer(country) {
    return {
      id: country.id,
      countryName: country.countryName,
      country: country.countryFlagUri,
    };
  }
}

module.exports = CountriesAPI;
