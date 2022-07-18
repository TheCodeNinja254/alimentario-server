const { RESTDataSource } = require("apollo-datasource-rest");
const uuid = require("uuid/v4");
const { redis } = require("../../Redis/index");
const Logger = require("../../utils/logging");
const User = require("../../models/User");

class SystemUserAuthentication extends RESTDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  /**
   * System user authentication
   * @Expects: Username, Password
   * @Returns: Status, Message and user Object
   * */
  async userAuthentication(args) {
    const { email, password } = args;

    try {
      /*
       * Get user from the database
       * */
      const user = await User.findOne({
        attributes: [
          `id`,
          `username`,
          `firstName`,
          `lastName`,
          `msisdn`,
          `userRole`,
          `status`,
          `emailAddress`,
          `verificationStatus`,
        ],
        where: {
          username: email,
          password,
          status: 1,
        },
      });

      /*
       * In the event we go nothing from the database
       * */
      if (!user) {
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
        userRole,
        emailAddress,
        verificationStatus,
      } = user;

      /*
       * Create a @bearerToken for the loggedIn user.
       * This will be stored in the inMemmory cache, Redis. The token is to be invalidated upon logout.
       * */
      const bearerToken = uuid();

      /*
       * Create session on Redis
       * This will allow for complete validation & invalidation upon logout
       * */
      await redis.set(bearerToken, Number(1));

      /*
       * Create session cookie
       * */

      this.context.session.userDetails = {
        username: email,
        customerStatus: user.status,
        firstName,
        lastName,
        msisdn,
        userRole,
        emailAddress,
        verificationStatus,
        bearerToken,
      };

      /*
       * Return the Schema object
       * */
      return {
        status: true,
        message: user.firstName,
        username: email,
        firstName,
        lastName,
        msisdn,
        customerStatus: user.status,
        userRole,
        emailAddress,
        verificationStatus,
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
        role: "",
      };
    }
  }
}

module.exports = SystemUserAuthentication;
