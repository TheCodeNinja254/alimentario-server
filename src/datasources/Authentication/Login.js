const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const Customer = require("../../models/Customer");

class UserAuthentication extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  // static isHomeTokenValid(homeToken) {
  //   if (!homeToken || !homeToken.accessToken || !homeToken.expirationTime) {
  //     return false;
  //   }
  //
  //   return homeToken.expirationTime > Date.now();
  // }

  async customerAuthentication(args) {
    const { email, password } = args;

    try {
      const customer = await Customer.findOne({
        attributes: [
          `id`,
          `firstName`,
          `lastName`,
          `msisdn`,
          `status`,
          `businessId`,
          `emailAddress`,
          `verificationStatus`,
        ],
        where: {
          username: email,
          password,
          status: 1,
        },
      });

      if (!customer) {
        Logger.log("error", "Error: ", {
          fullError: "Login failed",
          customError: "Login failed",
          actualError: "Login failed, invalid credentials",
          customerMessage:
            "Invalid credentials. Please provide valid credentials to continue.",
        });
        return {
          status: false,
          message:
            "Invalid credentials. Please provide valid credentials to continue.",
        };
      }

      const {
        firstName,
        lastName,
        msisdn,
        businessId,
        emailAddress,
        verificationStatus,
      } = customer;

      return {
        status: true,
        message: customer.firstName,
        username: email,
        firstName,
        lastName,
        msisdn,
        customerStatus: customer.status,
        businessId,
        emailAddress,
        verificationStatus,
      };
    } catch (e) {
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
        role: "",
      };
    }
  }
}

module.exports = UserAuthentication;
