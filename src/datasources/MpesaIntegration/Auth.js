const { RESTDataSource } = require('apollo-datasource-rest');
const https = require('https');
const addMinutes = require('date-fns/addMinutes');
const config = require('dotenv').config();
const convertKeys = require("../../utils/convertKeys");
const Logger = require("../../utils/logging");
const headersConfig = require('../../utils/headersConfig');
const ErrorHandler = require("../../utils/errorHandler");

const configValues = config.parsed;

class GetOAuthTokenAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = configValues.MPESA_INTEGRATION_URL;
  }

  willSendRequest(request) {
    headersConfig.prototype.mpesaOAuthTokenHeaders(request);
  }

  static isMPESATokenValid(mpesaToken) {
    if (!mpesaToken || !mpesaToken.accessToken || !mpesaToken.expirationTime) {
      return false;
    }

    return mpesaToken.expirationTime > Date.now();
  }

  async getOauthToken() {
    const { mpesaToken } = this.context.session;
    if (!GetOAuthTokenAPI.isMPESATokenValid(mpesaToken)) {
      const response = await this.get(
        `/oauth/v1/generate?grant_type=client_credentials`,
        {},
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      );

      const { accessToken, expiresIn } = convertKeys(response);
      const dateNow = Date.now();
      if (expiresIn) {
        // convert to mins and subtract 1 minute for margin - genius
        const tokenValidationTimeInMinutes = Math.trunc(parseInt(expiresIn, 10) / 60 - 1);
        const tokenExpirationTime = addMinutes(dateNow, tokenValidationTimeInMinutes);
        Logger.log(
          'info',
          `Success`,
          {
            message: "Request Successful",
            request: 'getOAuthTokenHome',
            // response, // Uncomment for debugging only
            tokenExpirationTime,
            url: `/oauth/v1/generate?grant_type=client_credentials`,
          },
        );
        this.context.session.mpesaToken = {
          accessToken,
          expirationTime: tokenExpirationTime.getTime(),
        };
        return true;
      } else {
        Logger.log(
          'error',
          'Error: ',
          {
            fullError: ErrorHandler("No token found"),
            customError: ErrorHandler("No token found"),
            actualError: ErrorHandler("No token found"),
            customerMessage: ErrorHandler("No token found"),
          },
        );
        throw new Error(
          ErrorHandler("No token found"),
        );
      }
    }
    return true;
  }
}

module.exports = GetOAuthTokenAPI;
