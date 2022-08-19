const { RESTDataSource } = require("apollo-datasource-rest");
const uuid = require("uuid/v4");
const { redis } = require("../../Redis/index");
const Logger = require("../../utils/logging");
const { Customer } = require("../../models");
const { decrypt } = require("../../utils/encryptDecrypt");
const errorHandler = require("../../utils/errorHandler");

class CustomerAccountAPI extends RESTDataSource {
  constructor() {
    super();
    this.info = "";
  }

  async customerAccountCreation(args) {
    const {
      input: { firstName, lastName, password },
    } = args;

    // encrypted values
    let {
      input: { msisdn, emailAddress },
    } = args;

    // decrypt
    emailAddress = decrypt(emailAddress);
    msisdn = decrypt(msisdn);

    // constants not passed from the App
    const verificationStatus = 1;
    const verificationTime = new Date();
    const verificationToken = uuid();

    // to be initialized as default.
    const businessId = 0;
    const status = 1;

    // create username from emailAddress
    const username = emailAddress.match(/^([^@]*)@/)[1];

    try {
      /*
       * Create customer account
       * */
      const customer = await Customer.create({
        username,
        firstName,
        lastName,
        password,
        msisdn,
        status,
        businessId,
        emailAddress,
        verificationStatus,
        verificationTime,
        verificationToken,
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not create customer account",
          actualError: "Could not create customer account",
          customerMessage:
            "We are unable to add to your cart at the moment. Please try again later!",
        });
        return {
          status: false,
          message:
            errorHandler(err.message) ||
            "Account creation failed. Please try again later",
        };
      });

      if (customer.status === false) {
        return {
          status: false,
          message: customer.message,
        };
      }
      /**
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
        username,
        customerStatus: status,
        firstName,
        lastName,
        msisdn,
        businessId,
        emailAddress,
        verificationStatus,
        bearerToken,
        associatedBusiness: {
          businessName: null,
          registeredAddress: null,
          businessLocationLatitude: null,
          businessLocationLongitude: null,
          businessType: null,
          primaryEmailAddress: null,
          primaryContact: null,
          preferredCreditPeriod: null,
        },
      };

      /*
       * Return the Schema object
       * */
      return {
        status: true,
        message: "Account creation successful",
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

module.exports = CustomerAccountAPI;
