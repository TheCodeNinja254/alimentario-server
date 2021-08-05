/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 */

const { RESTDataSource } = require("apollo-datasource-rest");
const https = require("https");
const addMinutes = require("date-fns/addMinutes");
const config = require("dotenv").config();
const convertKeys = require("../../utils/convertKeys");
const headersConfig = require("../../utils/headersConfig");
const Logger = require("../../utils/logging");
const ErrorHandler = require("../../utils/errorHandler");

const configValues = config.parsed;

class GetOAuthTokenAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = configValues.HOME_APIGEE_ENDPOINT;
  }

  willSendRequest(request) {
    headersConfig.prototype.homeOauthToken(request);
  }

  static isHomeTokenValid(homeToken) {
    if (!homeToken || !homeToken.accessToken || !homeToken.expirationTime) {
      return false;
    }

    return homeToken.expirationTime > Date.now();
  }

  async getOauthToken() {
    const oauth = "oauth2";
    const { homeToken } = this.context.session;
    if (!GetOAuthTokenAPI.isHomeTokenValid(homeToken)) {
      const response = await this.post(
        `${oauth}/v3/generate?grant_type=client_credentials`,
        {},
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      );
      const { accessToken, expiresIn } = convertKeys(response);
      const dateNow = Date.now();
      if (expiresIn) {
        // convert to mins and subtract 1 minute for margin - genius
        const tokenValidationTimeInMinutes = Math.trunc(
          parseInt(expiresIn, 10) / 60 - 1
        );
        const tokenExpirationTime = addMinutes(
          dateNow,
          tokenValidationTimeInMinutes
        );
        Logger.log("info", `Success`, {
          message: "Request Successful",
          request: "getOAuthTokenHome",
          // response, // Uncomment for debugging only
          tokenExpirationTime,
          url: `${this.baseURL}/${oauth}/v3/generate?grant_type=client_credentials`,
        });
        this.context.session.homeToken = {
          accessToken,
          expirationTime: tokenExpirationTime.getTime(),
        };
        return true;
      } else {
        Logger.log("error", "Error: ", {
          fullError: ErrorHandler("No token found"),
          customError: ErrorHandler("No token found"),
          actualError: ErrorHandler("No token found"),
          customerMessage: ErrorHandler("No token found"),
        });
        throw new Error(ErrorHandler("No token found"));
      }
    }
    return true;
  }
}

module.exports = GetOAuthTokenAPI;
