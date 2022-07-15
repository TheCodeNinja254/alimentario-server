const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const User = require("../../models/User");
const Product = require("../../models/Product");

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

  async userAuthentication(args) {
    // const { username, password } = args;
    const username = "m.mwangi.fredrick";
    const password = "trial";

    await connection.connect();
    try {
// add
      const user = await User.create({
        username: "fredrick"
      })

      // join || union
      User.findAll({where: {username: "fredrick"}, include: [{model: Product, as: "Products" }]})

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
