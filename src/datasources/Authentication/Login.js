const { RESTDataSource } = require("apollo-datasource-rest");
const Logger = require("../../utils/logging");
const connection = require("../DatabaseConnection");

class UserAuthentication extends RESTDataSource {
  constructor() {
    super();
  }

  static isHomeTokenValid(homeToken) {
    if (!homeToken || !homeToken.accessToken || !homeToken.expirationTime) {
      return false;
    }

    return homeToken.expirationTime > Date.now();
  }

  async userAuthentication(args) {
    const { username, password } = args;

    try {
      connection.query(
        `SELECT * FROM tbl_users WHERE username = ${username} AND password = ${password}`,
        (err, res) => {
          if (err) {
            Logger.log("error", "Error: ", {
              fullError: err,
              customError: err.sqlMessage,
              actualError: err.sqlMessage,
              customerMessage:
                "An error occurred. This is temporary and should resolve in a short time. If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
            });

            throw new Error(
              `An error occurred. This is temporary and should resolve in a short time. If the error persists, reach out to @Desafio_Alimentario_Care on twitter.`
            );
          }
          console.log(res);
        }
      );
    } catch (e) {
      Logger.log("error", "Error: ", {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
          "An error occurred. This is temporary and should resolve in a short time. If the error persists, reach out to @Desafio_Alimentario_Care on twitter.",
      });
    }
  }
}

module.exports = UserAuthentication;
