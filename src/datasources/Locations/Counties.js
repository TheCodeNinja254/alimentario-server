const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const { County } = require("../../models");
const { redis } = require("../../Redis");

class CountiesAPI extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
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
          ? counties.map((county) => CountiesAPI.countiesReducer(county))
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

  async addCounty(args) {
    const {
      input: { countyName, countryId },
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
      await County.create({
        countyName,
        countryId,
        addedBy: username,
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not add to county list",
          actualError: "Could not add to county list",
          customerMessage:
            "We are unable to add the county at the moment. Please try again later!",
        });
        return {
          status: false,
          message:
            "We are unable to add the county at the moment. Please try again later!",
        };
      });

      return {
        status: true,
        message: "County added successfully",
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

  async removeCounty(args) {
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
      return await County.destroy({
        where: {
          id,
        },
      })
        .then((count) => {
          if (!count) {
            return {
              status: false,
              message: "County could not be deleted",
            };
          }
          return {
            status: true,
            message: "County could not be deleted",
          };
        })
        .catch((err) => {
          Logger.log("error", "Error: ", {
            fullError: err,
            customError: "county could not be deleted",
            actualError: "county could not be deleted",
            customerMessage:
              "county could not be deleted. Please try again later!",
          });
          return {
            status: false,
            message: "County could not be deleted. Please try again later!",
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

module.exports = CountiesAPI;
