const { RESTDataSource } = require("apollo-datasource-rest");
const https = require("https");
const config = require("dotenv").config();
const logMessages = require("../logMessages/index");
const headersConfig = require("../../utils/headersConfig");
const Logger = require("../../utils/logging");
const GetOAuthToken = require("../Authentication");

const configValues = config.parsed;

class CustomersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = configValues.HOME_APIGEE_ENDPOINT;
    this.noTokenError =
      "Sorry, we are experiencing a system issue, kindly try again later or reach us on Twitter @Safaricom_Care";
  }

  willSendRequest(request) {
    request.accessToken = this.context.session.homeToken.accessToken;
    headersConfig.prototype.leadHeaders(request);
  }

  async getHomeToken() {
    const getHomeToken = new GetOAuthToken();
    getHomeToken.initialize(this);
    await getHomeToken.getOauthToken();
    return null;
  }

  async createLead(args) {
    const {
      input: {
        firstName,
        middleName,
        lastName,
        sponsorMsisdn,
        sponsorAlternativeMsisdn,
        emailAddress,
        productId,
        preferredDate,
        preferredTimePeriod,
        passedEstateId,
        areaName,
        streetName,
        houseNumber,
        doctypeId,
        documentNumber,
        productType,
        addOns,
      },
    } = args;

    // First we get the AccessToken
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new this.noTokenError();
    }

    try {
      const apiUrl = `${this.baseURL}/v1/xprome/leadRegistration`;
      const response = await this.post(
        apiUrl,
        {
          firstName,
          middleName,
          lastName,
          sponsorMsisdn: sponsorMsisdn,
          sponsorAlternativeMsisdn: sponsorAlternativeMsisdn || "",
          emailAddress: emailAddress,
          productId,
          preferredDate,
          preferredTimePeriod,
          estateId: passedEstateId,
          areaName: areaName || "",
          streetName: streetName || "",
          houseNumber: houseNumber || "",
          doctypeId: doctypeId || 1,
          documentNumber: documentNumber || "233232110",
          productType,
          addOns,
        },
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      );
      const {
        header: { responseCode, customerMessage, responseMessage },
      } = response;
      logMessages(response, "createLead", apiUrl);
      let status = false;
      if (responseCode === 200) {
        const {
          body: { streetName, crqNumber },
        } = response;

        status = true;
        Logger.log("info", "Success: ", {
          message: "Lead Registration Successful",
          request: "createLead",
          technicalMessage: responseMessage,
          customerMessage,
        });
        return {
          status,
          message: customerMessage,
          estateName: streetName,
          preferredDate,
          preferredTimePeriod,
          crqNumber,
        };
      } else {
        Logger.log("error", "Error: ", {
          message: "Lead Registration Failed",
          request: "createLead",
          fullError: response, // specific error message from the MS
          technicalMessage: responseMessage,
          customerMessage,
        });
        return new Error(
          // customerMessage,
          "Sorry, we are unable to register your request at the moment, Kindly try again or reach us on Twitter @Safaricom_Care"
        );
      }
    } catch (e) {
      console.log(e); // For Debugging
      Logger.log("error", "Error: ", {
        message: "Lead Registration Failed",
        request: "createLead",
        fullError: e,
        technicalMessage: e,
        customerMessage:
          "Sorry, we are unable to register your request at the moment, Kindly try again or reach us on Twitter @Safaricom_Care",
      });

      throw new Error(
        // customerMessage,
        "Sorry, we are unable to register your request at the moment, Kindly try again or reach us on Twitter @Safaricom_Care"
      );
    }
  }

  async checkLeadDetails(args) {
    // initialize variables
    const {
      input: { uniqueIdentity },
    } = args;

    // First we ensure the OAuth2 Token is set
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new Error(this.noTokenError);
    }

    try {
      const apiUrl = `${this.baseURL}/v1/xprome/getLead`;
      // Now we can get list of estates
      const response = await this.get(
        apiUrl,
        { id: uniqueIdentity },
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      );
      const {
        header: { responseCode, responseMessage, customerMessage },
      } = response;
      logMessages(response, "checkLeadDetails", apiUrl);
      let getLeadStatus = false;
      if (responseCode === 200) {
        const {
          body: {
            streetName,
            preferredDate,
            preferredTimePeriod,
            firstName,
            lastName,
          },
        } = response;

        Logger.log("info", "Success: ", {
          fullError: responseMessage,
          request: "checkLeadDetails",
          technicalMessage: response,
          customerMessage,
        });

        getLeadStatus = true;
        return {
          getLeadStatus,
          message: "Lead retrieved successfully",
          firstName,
          lastName,
          estateName: streetName,
          preferredDate,
          preferredTimePeriod,
          crqNumber,
        };
      } else {
        const customerMessage = `Sorry, we are unable to show your request status, Kindly try again or reach us on Twitter @Safaricom_Care`;
        Logger.log("error", "Error: ", {
          fullError: responseMessage,
          request: "checkLeadDetails",
          technicalMessage: response,
          customerMessage,
        });
        return {
          getLeadStatus,
          message: customerMessage,
        };
      }
    } catch (e) {
      const customerMessage = `Sorry, we are unable to show your request status, Kindly try again or reach us on Twitter @Safaricom_Care`;
      Logger.log("error", "Error: ", {
        fullError: e,
        request: "checkLeadDetails",
        technicalMessage: e,
        customerMessage,
      });
      throw new Error(customerMessage);
    }
  }

  static leadReducer(lead) {
    return {
      tId: lead.tId,
      firstName: lead.firstName,
      middleName: lead.middleName,
      lastName: lead.lastName,
      sponsorMsisdn: lead.sponsorMsisdn,
      sponsorAlternativeMsisdn: lead.sponsorMsisdn,
      emailAddress: lead.emailAddress,
      productId: lead.productId,
      preferredDate: lead.preferredDate,
      preferredTimePeriod: lead.preferredDate,
      estateId: lead.estateId,
      streetName: lead.streetName,
      houseNumber: lead.houseNumber,
      doctypeId: lead.doctypeId,
      documentNumber: lead.documentNumber,
      productType: lead.productType,
      crqNumber: lead.crqNumber,
      crqStatus: lead.crqStatus,
      areaName: lead.areaNAme,
    };
  }
}

module.exports = CustomersAPI;
