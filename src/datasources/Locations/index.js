const { RESTDataSource } = require("apollo-datasource-rest");
const https = require("https");
const config = require("dotenv").config();
const logMessages = require("../logMessages/index");
const headersConfig = require("../../utils/headersConfig");
const Logger = require("../../utils/logging");
const GetOAuthToken = require("../Authentication");

const configValues = config.parsed;

class LocationsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = configValues.HOME_APIGEE_ENDPOINT;
  }

  willSendRequest(request) {
    request.accessToken = this.context.session.homeToken.accessToken;
    headersConfig.prototype.locationHeaders(request);
  }

  async getHomeToken() {
    const getHomeToken = new GetOAuthToken();
    getHomeToken.initialize(this);
    await getHomeToken.getOauthToken();
    return null;
  }

  // eslint-disable-next-line consistent-return
  async getRegions() {
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new Error("No token found");
    }

    const apiUrl = `${this.baseURL}/v1/xprome/get-lead-regions/all`;
    const response = await this.get(
      apiUrl,
      {},
      {
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    );
    const {
      header: { responseCode, customerMessage },
    } = response;
    logMessages(response, "getRegions", apiUrl);
    let getRegionsStatus = false;
    if (responseCode === 200) {
      getRegionsStatus = true;
      const regions =
        response.body &&
        Array.isArray(response.body) &&
        response.body.length > 0
          ? response.body.map((region) => LocationsAPI.regionsReducer(region))
          : [];
      return {
        getRegionsStatus,
        regions,
      };
    } else {
      Logger.log("error", "Error: ", {
        fullError: response,
        request: "getRegions",
        technicalMessage: `Unable to get regions`,
        customerMessage,
      });
      return {
        getRegionsStatus,
        customerMessage,
      };
    }
  }

  // eslint-disable-next-line consistent-return
  async getEstates(args) {
    // initialize variables

    const { regionId, pageSize, pageNo } = args;

    // First we ensure the OAuth2 Token is set
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new Error("No token found");
    }

    try {
      const apiUrl = `${this.baseURL}/v1/xprome/estates`;
      // Now we can get list of estates
      const response = await this.post(
        apiUrl,
        // { pageNumber: pageNo, pageSize,  regionId },
        {
          pageNumber: 0,
          pageSize,
          regionId,
        },
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      );
      const {
        header: { responseCode },
      } = response;
      logMessages(response, "getEstates", apiUrl);
      let getEstatesStatus = false;
      if (responseCode === 200) {
        getEstatesStatus = true;
        const getEstatesCount = response.body.content.length;
        const estates =
          response.body &&
          Array.isArray(response.body.content) &&
          response.body.content.length > 0
            ? response.body.content.map((estate) =>
                LocationsAPI.estatesReducer(estate)
              )
            : [];
        return {
          getEstatesStatus,
          getEstatesCount,
          estates,
        };
      } else {
        const customerMessage = `Sorry, we were unable to get estates list`;
        Logger.log("error", "Error: ", {
          fullError: response,
          request: "getEstates",
          technicalMessage: `Unable to get estates list`,
          customerMessage,
        });
        return {
          getEstatesStatus,
          customerMessage,
        };
      }
    } catch (e) {
      const customerMessage = `Sorry, we were unable to get estates list`;
      Logger.log("error", "Error: ", {
        fullError: e,
        request: "getEstates",
        technicalMessage: `Unable to get estates list`,
        customerMessage,
      });
      throw new Error(customerMessage);
    }
  }

  static regionsReducer(regions) {
    return {
      regionId: regions.id,
      regionName: regions.regionName,
      status: regions.status,
      createdAt: regions.createdAt,
    };
  }

  static estatesReducer(estate) {
    return {
      estateId: estate.estateId,
      estateName: estate.estateName,
      regionId: estate.regionId,
    };
  }
}

module.exports = LocationsAPI;
