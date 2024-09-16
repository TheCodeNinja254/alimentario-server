const { RESTDataSource } = require("apollo-datasource-rest");
const moment = require("moment");
const https = require("https");
const headersConfig = require("../../utils/headersConfig");
const GetOAuthTokenAPI = require("./Auth");

class MpesaTransactions extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.MPESA_INTEGRATION_URL;
  }

  // override function for setting custom fetch headers. Intercepts below async/await functions
  willSendRequest(request) {
    request.accessToken = this.context.session.mpesaToken.accessToken;
    request.username = this.context.session.username;
    headersConfig.prototype.mpesaTransactionsHeaders(request);
  }

  // OAUTH2 initialization and setup
  async getOAuthToken() {
    const getOAuthTokenInit = new GetOAuthTokenAPI();
    getOAuthTokenInit.initialize(this);
    await getOAuthTokenInit.getOauthToken();
    return null;
  }

  async lipaNaMpesaOnline(amount, phoneNumber, accountReference, transactionDesc) {
    const shortcode = process.env.SHORTCODE;
    const passkey = process.env.LNM_PASSKEY;
    const timestamp = moment().format('YYYYMMDDHHmmss');

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // Check OATH2 Token
    await this.getOAuthToken();
    const { mpesaToken } = this.context.session;
    if (!mpesaToken) {
      throw new Error(
        "No token found",
      );
    }

    try {
      const response = await this.post(
        '/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: process.env.CALLBACK_URL,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc,
        },
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      );
      console.log('STK Push response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error initiating STK Push:', error);
      throw error;
    }
  }
}

module.exports = MpesaTransactions;
