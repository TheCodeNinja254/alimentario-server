const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const Customer = require("../../models/Customer");

class UserAuthentication extends RESTDataSource {
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
    // const { username, password } = args;
    const username = "m.mwangi.fredrick";
    const password = "trial";

    try {
      const customer = await Customer.findOne({
        where: {
          username,
          password,
        },
      });

      console.log(customer);

      if (!customer) {
        return {
          status: false,
          message:
            "Invalid credentials. Please provide valid credentials to continue.",
          role: "",
        };
      }

      return {
        status: true,
        message: customer.firstName,
        role: "",
      };
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
          "An error occurred. This is temporary and should resolve in a short time. If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
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
