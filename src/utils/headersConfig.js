const _ = require("lodash");
const configValues = require("dotenv").config().parsed;
// const uuid = require("uuid/v4");
// const moment = require("moment");

const commonHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

class HeadersConfig {
  mpesaOAuthTokenHeaders(request) {
    const headers = {
      Authorization: this.basicAuthHeader(
        `${configValues.CONSUMER_KEY}:${configValues.CONSUMER_SECRET}`,
      ),
    };

    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  mpesaTransactionsHeaders(request) {
    const headers = {
      Authorization: `Bearer ${request.accessToken}`,
    };

    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  basicAuthHeader(credentials) {
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  }
}

module.exports = HeadersConfig;
