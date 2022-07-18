const { RESTDataSource } = require("apollo-datasource-rest");
const { redis } = require("../../Redis/index");
const Logger = require("../../utils/logging");

class AuthenticationSessions extends RESTDataSource {
  async getSignedInCustomer() {
    if (!this.context.session.customerDetails.username) {
      // its easier for the client to check this
      // in other cases, would have thrown an Authentication error
      return null;
    }

    const { bearerToken } = this.context.session.customerDetails;

    /*
     *
     * Check for login status from the Redis InMemory database
     * Should @return === 1 for valid records fetch,
     * Should @return === 0 for no records matching the session
     * */
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      return null;
    }

    const {
      customerDetails: { username },
    } = this.context.session;
    try {
      const { customerDetails } = this.context.session;

      return {
        user: AuthenticationSessions.customerSessionReducer(customerDetails),
      };
    } catch (e) {
      /*
       * Message to customer
       * */
      const customerMessage = "Sorry, we were unable to get your details";

      /*
       * Create a log instance
       * */
      Logger.log("error", "Error: ", {
        fullError: e,
        request: "getSignedInUser",
        technicalMessage: `Unable to get details for user id (${username})`,
        customerMessage,
      });

      throw new Error(customerMessage);
    }
  }

  async getSignedInUser() {
    if (!this.context.session.userDetails.username) {
      // its easier for the client to check this
      // in other cases, would have thrown an Authentication error
      return null;
    }

    const { bearerToken } = this.context.session.userDetails;

    /*
     *
     * Check for login status from the Redis InMemory database
     * Should @return === 1 for valid records fetch,
     * Should @return === 0 for no records matching the session
     * */
    const signInStatus = await redis.get(bearerToken, (err, reply) => reply);
    if (Number(signInStatus) === 0) {
      return null;
    }

    const {
      userDetails: { username },
    } = this.context.session;
    try {
      const { userDetails } = this.context.session;

      return {
        user: AuthenticationSessions.userSessionReducer(userDetails),
      };
    } catch (e) {
      /*
       * Message to customer
       * */
      const customerMessage = "Sorry, we were unable to get your details";

      /*
       * Create a log instance
       * */
      Logger.log("error", "Error: ", {
        fullError: e,
        request: "getSignedInUser",
        technicalMessage: `Unable to get details for user id (${username})`,
        customerMessage,
      });

      throw new Error(customerMessage);
    }
  }

  static customerSessionReducer(customerDetails) {
    return {
      username: customerDetails.username,
      customerStatus: customerDetails.customerStatus,
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      msisdn: customerDetails.msisdn,
      businessId: customerDetails.businessId,
      emailAddress: customerDetails.emailAddress,
      verificationStatus: customerDetails.verificationStatus,
      bearerToken: customerDetails.bearerToken,
    };
  }

  static userSessionReducer(userDetails) {
    return {
      username: userDetails.username,
      customerStatus: userDetails.customerStatus,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      msisdn: userDetails.msisdn,
      userRole: userDetails.userRole,
      emailAddress: userDetails.emailAddress,
      verificationStatus: userDetails.verificationStatus,
      bearerToken: userDetails.bearerToken,
    };
  }
}

module.exports = AuthenticationSessions;
