const { RESTDataSource } = require("apollo-datasource-rest");
const uuid = require("uuid/v4");
const { redis } = require("../../Redis/index");
const Logger = require("../../utils/logging");
const Customer = require("../../models/Customer");

class CustomerAuthentication extends RESTDataSource {
  constructor() {
    super();
    this.info = "";
  }

  // eslint-disable-next-line no-unused-vars
  async customerAuthentication(args) {
    // const { email, password } = args;
    const email = "m.mwangi.fredrick";
    const password = "trial";

    try {
      /*
       * Get customer from the database
       * */
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

      /*
       * In the event we go nothing from the database
       * */
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

      /*
       * Create a @bearerToken for the loggedIn user.
       * This will be stored in the InMemmory cache, Redis. The token is to be invalidated upon logout.
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

      this.context.session.customerDetails = {
        username: email,
        customerStatus: customer.status,
        firstName,
        lastName,
        msisdn,
        businessId,
        emailAddress,
        verificationStatus,
        bearerToken,
      };

      /*
       * Return the Schema object
       * */
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

module.exports = CustomerAuthentication;
