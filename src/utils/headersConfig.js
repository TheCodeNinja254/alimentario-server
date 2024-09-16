const _ = require("lodash");
const configValues = require("dotenv").config().parsed;
// const uuid = require("uuid/v4");
// const moment = require("moment");

// Some of the headers that are commonly used
const commonHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
};

class HeadersConfig {
  // Generate headers for getting the bearer token
  mpesaOAuthTokenHeaders(request) {
    const headers = {
      Authorization: this.basicAuthHeader(
        `${configValues.CONSUMER_KEY}:${configValues.CONSUMER_SECRET}`,
      ),
    };

    // Account balance request needs common headers
    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    // Headers specific to Authentication Token
    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  mpesaTransactionsHeaders(request) {
    const headers = {
      Authorization: `Bearer ${request.accessToken}}`,
    };

    // Account balance request needs common headers
    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    // Headers specific to Authentication Token
    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  // Helper function to generate a basic auth given username:password
  basicAuthHeader(credentials) {
    return `Basic ${Buffer.from(credentials).toString("base64")}`;
  }
}

module.exports = HeadersConfig;
