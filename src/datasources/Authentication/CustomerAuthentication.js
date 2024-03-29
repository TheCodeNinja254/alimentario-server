const { RESTDataSource } = require("apollo-datasource-rest");
const uuid = require("uuid/v4");
const { redis } = require("../../Redis/index");
const Logger = require("../../utils/logging");
const { Customer, WholesaleBusiness } = require("../../models");

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
        include: {
          model: WholesaleBusiness,
          required: false,
          where: {
            businessStatus: 1,
          },
        },
      });

      // console.log(customer.WholesaleBusiness);

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
       * This will be stored in the InMemory cache, Redis. The token is to be invalidated upon logout.
       * */
      const bearerToken = uuid();

      /**
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
        associatedBusiness: {
          businessName: customer.WholesaleBusiness?.businessName,
          registeredAddress: customer.WholesaleBusiness?.businessName,
          businessLocationLatitude: customer.WholesaleBusiness?.businessName,
          businessLocationLongitude: customer.WholesaleBusiness?.businessName,
          businessType: customer.WholesaleBusiness?.businessName,
          primaryEmailAddress: customer.WholesaleBusiness?.businessName,
          primaryContact: customer.WholesaleBusiness?.businessName,
          preferredCreditPeriod: customer.WholesaleBusiness?.businessName,
        },
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
        associatedBusiness: {
          businessName: customer.WholesaleBusiness?.businessName,
          registeredAddress: customer.WholesaleBusiness?.businessName,
          businessLocationLatitude: customer.WholesaleBusiness?.businessName,
          businessLocationLongitude: customer.WholesaleBusiness?.businessName,
          businessType: customer.WholesaleBusiness?.businessName,
          primaryEmailAddress: customer.WholesaleBusiness?.businessName,
          primaryContact: customer.WholesaleBusiness?.businessName,
          preferredCreditPeriod: customer.WholesaleBusiness?.businessName,
        },
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

  async signOut() {
    const { bearerToken } = this.context.session.customerDetails;
    if (await redis.set(bearerToken, Number(0))) {
      delete this.context.session.customerDetails;

      return {
        status: true,
        message: "Logout Successful",
      };
    }
    return {
      status: false,
      message: "Session invalidation failed",
    };
  }
}

module.exports = CustomerAuthentication;
