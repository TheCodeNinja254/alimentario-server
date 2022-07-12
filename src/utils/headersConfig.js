const _ = require("lodash");
const configValues = require("dotenv").config().parsed;
const uuid = require("uuid/v4");
const moment = require("moment");

// Some of the headers that are commonly used
const commonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

class HeadersConfig {
  // Generate headers for getting the bearer token
  homeOauthToken(request) {
    const headers = {
      Authorization: this.basicAuthHeader(
        `${configValues.CONSUMER_KEY}:${configValues.CONSUMER_SECRET}`
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

  locationHeaders(request) {
    const headers = {
      Authorization: `Bearer ${request.accessToken}`,
      "X-Correlation-ConversationID": uuid(),
      "X-Source-System": "discovery-portal",
      "x-app": "web-portal",
      "Accept-Encoding": "application/json",
    };

    // Add common headers
    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    // Add custom headers
    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  leadHeaders(request) {
    const headers = {
      "Authorization": `Bearer ${request.accessToken}`,
      "X-Correlation-ConversationID": uuid(),
      "X-Source-System": "web-portal",
      "X-App": "web-portal",
      "X-MessageID": "v7I5m/coazTYvz7gzXt1Hg|eKJEoNjhNNlurtAFScipaw|4EzkycIrr5VezD6x3Eyess",
      "X-Msisdn": request.msisdn,
    };

    // Add common headers
    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    // Add custom headers
    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  userManagementHeaders(request) {
    const headers = {
      Authorization: `Bearer ${request.accessToken}`,
      "Accept-Encoding": "application/json",
      "Accept-Language": "EN",
      "X-Source-CountryCode": "KE",
      "X-Source-Operator": "Safaricom",
      "X-Source-Division": "",
      "X-Source-System": "mysafaricom-android",
      "X-Source-Timestamp": moment("YYYY-MM-DD HH:MM:SS"),
      "X-Correlation-ConversationID": uuid(),
      "X-DeviceInfo": "safasdfasdfas8df7asdfasd",
      "X-DeviceId": "asdfasdfasiudfsdfhasdfhjkas",
      "X-DeviceToken": "asdfasdfasiudfsdfhasdfhjkas",
      "X-MSISDN": "0715109743",
      "X-App": "mysafaricom-android",
      "X-Version": "v1",
      "X-MessageID": "DNW5gSR9AovUyb9oflO4EgQWrTa2Jawg5A9YDMRjOSU=",
    };

    // Add common headers
    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    // Add custom headers
    _.forOwn(headers, (header, name) => {
      request.headers.set(name, header);
    });
  }

  // Generate headers for apigee home api's
  authenticationHeaders(request) {
    const headers = {
      Authorization: `Bearer ${request.accessToken}`,
      "x-correlation-conversationid": uuid(),
      "X-DeviceToken": "RkryFvlHygp4juhk",
      "X-App": "home-xprome-portal",
      "X-Source-System": "home-xprome-portal",
    };

    // Add common headers
    _.forOwn(commonHeaders, (header, name) => {
      request.headers.set(name, header);
    });

    // Add custom headers
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
