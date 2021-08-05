/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 */

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
    // First we ensure the OAuth2 Token is set
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new Error("No token found");
    }

    // try {
      // Now we can get list of regions
      //   const apiUrl = `${this.baseURL}/v1/4ghome/region-list`;
      const apiUrl = `${this.baseURL}/v1/4ghome/regions`;
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
          response.body.content &&
          Array.isArray(response.body.content) &&
          response.body.content.length > 0
            ? response.body.content.map((region) =>
                LocationsAPI.regionsReducer(region)
              )
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
    // } catch (e) {
    //   const customerMessage = `Sorry, we were unable to get regions`;
    //   Logger.log("error", "Error: ", {
    //     fullError: e,
    //     request: "getRegions",
    //     technicalMessage: `Unable to get regions`,
    //     customerMessage,
    //   });
    //   throw new Error(customerMessage);
    // }
  }

  // eslint-disable-next-line consistent-return
  async getEstates(args) {
    // initialize variables

    const { zoneId, pageSize, pageNo } = args;

    // First we ensure the OAuth2 Token is set
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new Error("No token found");
    }

    try {
      const apiUrl = `${this.baseURL}/v1/4ghome/estates-zone/${zoneId}?pageSize=${pageSize}&pageNo=${pageNo}`;
      // Now we can get list of estates
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
        header: { responseCode },
      } = response;
      logMessages(response, "getEstates", apiUrl);
      let getEstatesStatus = false;
      if (responseCode === 200) {
        getEstatesStatus = true;
        const getEstatesCount = response.body.totalElements;
        const estates =
          response.body.content &&
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
          request: "getRegions",
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
        request: "getRegions",
        technicalMessage: `Unable to get estates list`,
        customerMessage,
      });
      throw new Error(customerMessage);
    }
  }

  // eslint-disable-next-line consistent-return
  async getZones(args) {
    // initialize variables
    const { regionId } = args;

    // First we ensure the OAuth2 Token is set
    await this.getHomeToken();
    const { homeToken } = this.context.session;
    if (!homeToken) {
      throw new Error("No token found");
    }

    try {
      // Now we can get list of regions
      const apiUrl = `${this.baseURL}/v1/4ghome/zones-region/${regionId}`;
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
      logMessages(response, "getZones", apiUrl);
      let getZonesStatus = false;
      if (responseCode === 200) {
        getZonesStatus = true;
        const zones =
          response.body &&
          Array.isArray(response.body) &&
          response.body.length > 0
            ? response.body.map((zone) => LocationsAPI.zonesReducer(zone))
            : [];
        return {
          getZonesStatus,
          zones,
        };
      } else {
        Logger.log("error", "Error: ", {
          fullError: response,
          request: "getZones",
          technicalMessage: `Unable to get zones`,
          customerMessage,
        });
        return {
          getZonesStatus,
          customerMessage,
        };
      }
    } catch (e) {
      const customerMessage = `Sorry, we were unable to get zones`;
      Logger.log("error", "Error: ", {
        fullError: e,
        request: "getZones",
        technicalMessage: `Unable to get zones`,
        customerMessage,
      });
      throw new Error(customerMessage);
    }
  }

  static regionsReducer(regions) {
    return {
      regionId: regions.id,
      regionName: regions.regionName,
    };
  }

  static estatesReducer(estate) {
    return {
      estateId: estate.id,
      estateName: `${estate.id} - ${estate.estateName}`,
      regionId: estate.regionId,
      status: estate.status,
      contractorAgencyId: estate.contractorAgencyId,
      oltName: estate.oltName,
      noOfHouses: estate.noOfHouses,
      occupancy: estate.occupancy,
      coordinates: estate.coordinates,
      houseNumbers: estate.houseNumbers,
      zoneId: estate.zoneId,
      tierNumber: estate.tierNumber,
      createdBy: estate.createdBy,
      createdAt: estate.createdAt,
      updatedAt: estate.updatedAt,
      deletedAt: estate.deletedAt,
    };
  }

  static zonesReducer(zone) {
    return {
      id: zone.id,
      zoneName: zone.zoneName,
      assignedDealerId: zone.dealerCode,
      status: zone.activeStatus,
      createdAt: zone.createdAt,
    };
  }
}

module.exports = LocationsAPI;
