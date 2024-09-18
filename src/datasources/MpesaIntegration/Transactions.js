const { RESTDataSource } = require("apollo-datasource-rest");
const moment = require("moment");
const https = require("https");
const headersConfig = require("../../utils/headersConfig");
const GetOAuthTokenAPI = require("./Auth");
const { decrypt } = require("../../utils/encryptDecrypt");
const formatPhoneNumber = require("../../utils/normalizePhoneNumber");

class MpesaTransactions extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.MPESA_INTEGRATION_URL;
  }

  // override function for setting custom fetch headers. Intercepts below async/await functions
  willSendRequest(request) {
    request.accessToken = this.context.session.mpesaToken.accessToken;
    headersConfig.prototype.mpesaTransactionsHeaders(request);
  }

  // OAUTH2 initialization and setup
  async getOAuthToken() {
    const getOAuthTokenInit = new GetOAuthTokenAPI();
    getOAuthTokenInit.initialize(this);
    await getOAuthTokenInit.getOauthToken();
    return null;
  }

  async lipaNaMpesaOnline(args) {
    const { amount, phoneNumber, paymentCorrelationId } = args;
    // decryption
    const phoneNumberDecrypted = decrypt(phoneNumber) || 0;
    const amountDecrypted = Number(decrypt(amount)) || 0;

    // env values
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
        `/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amountDecrypted,
          PartyA: formatPhoneNumber(phoneNumberDecrypted),
          PartyB: shortcode,
          PhoneNumber: formatPhoneNumber(phoneNumberDecrypted),
          CallBackURL: `${process.env.CALLBACK_URL}:${process.env.CALLBACK_PORTAL_PORT}/mpesa/${paymentCorrelationId}`,
          AccountReference: process.env.ACCOUNT_REFERENCE, // Max of 12
          TransactionDesc: 'Toasted',
        },
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MpesaTransactions;
