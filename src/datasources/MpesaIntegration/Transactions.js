const { RESTDataSource } = require("apollo-datasource-rest");
const moment = require("moment");
const https = require("https");
const headersConfig = require("../../utils/headersConfig");
const GetOAuthTokenAPI = require("./Auth");
const { decrypt } = require("../../utils/encryptDecrypt");
const Logger = require("../../utils/logging");
const formatPhoneNumber = require("../../utils/normalizePhoneNumber");
const { Payment } = require("../../models");

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

  // STK Push
  async lipaNaMpesaOnline(args) {
    const { amount, phoneNumber, paymentCorrelationId } = args;

    // decryption
    const phoneNumberDecrypted = decrypt(phoneNumber) || 0;
    const amountDecrypted = Number(decrypt(amount)) || 0;

    // env values
    const shortcode = process.env.SHORTCODE;
    const tillNumber = process.env.LIPA_NA_MPESA_TILL;
    const passkey = process.env.LNM_PASSKEY;
    const timestamp = moment().format('YYYYMMDDHHmmss');

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    // Check OATH2 Token - MPESA
    await this.getOAuthToken();
    const { mpesaToken } = this.context.session;

    if (!mpesaToken) {
      throw new Error(
        "No token found",
      );
    }

    const callbackURL = `${process.env.CALLBACK_URL}:${process.env.CALLBACK_PORTAL_PORT}/igw-pay-preprocess-desfio/${paymentCorrelationId}`;

    try {
      const response = await this.post(
        `/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: process.env.LIPA_NA_MPESA_TRANSACTION_TYPE,
          Amount: amountDecrypted,
          PartyA: formatPhoneNumber(phoneNumberDecrypted),
          PartyB: tillNumber,
          PhoneNumber: formatPhoneNumber(phoneNumberDecrypted),
          CallBackURL: callbackURL,
          AccountReference: process.env.ACCOUNT_REFERENCE, // Max of 12
          TransactionDesc: 'Toasted',
        },
        {
          agent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      );

      const { ResponseDescription, CustomerMessage } = response;

      if (response && response.ResponseCode === '0') {
        return {
          status: true,
          responseMessage: ResponseDescription,
          customerMessageExtended: CustomerMessage,
          customerMessage: "An STK Push (Pop-up) has been sent to your phone. Enter a your M-PESA PIN to complete the transaction.",
        };
      }
      Logger.log('error', 'Could not initiate STK Push: ', {
        fullError: ResponseDescription,
        customError: 'Could not initiate STK Push',
        actualError: ResponseDescription,
        customerMessage: CustomerMessage,
      });

      return {
        status: false,
        responseMessage: ResponseDescription,
        customerMessageExtended: CustomerMessage,
        customerMessage:
            "An error occurred. We could not send an STK Push (Pop-up) to your phone. "
            + "Use Lipa Na M-PESA, (Buy Goods Instructions provided below)",
      };
    } catch (error) {
      Logger.log('error', 'Could not initiate STK Push ', {
        fullError: error,
        customError: 'Could not initiate STK Push',
        actualError: error,
        customerMessage: 'Could not initiate STK Push',
      });

      return {
        status: false,
        responseMessage: error.message,
        customerMessageExtended: error.message,
        customerMessage:
            "An error occurred. We could not send an STK Push (Pop-up) to your phone. "
            + "Use Lipa Na M-PESA, (Buy Goods Instructions provided below)",
      };
    }
  }

  async checkPaymentStatus(args) {
    const { paymentCorrelationId } = args;

    try {
      const payment = await Payment.findOne({
        attributes: ['id', 'paymentMethod', 'amountPaid', 'resultCode', 'resultDesc', 'mpesaReceiptNumber', 'transactionDate'],
        where: { paymentCorrelationId },
      }).catch((err) => {
        Logger.log('error', 'Error fetching payment status: ', {
          fullError: err,
          customError: 'Could not fetch payment status',
          actualError: err,
          customerMessage: 'Unable to fetch payment status at this time. Please try again later.',
        });

        return {
          pollingComplete: true,
          status: false,
          message: 'Unable to fetch payment status at this time. Please try again later.',
        };
      });

      if (payment && payment.dataValues) {
        /**
         * Return the payment status and other relevant info
        * */
        if (payment.resultCode === 0 || payment.resultCode === "0") {
          return {
            pollingComplete: true,
            status: true,
            message: 'Payment status retrieved successfully.',
            paymentDetails: {
              id: payment.id,
              paymentMethod: payment.paymentMethod,
              amountPaid: payment.amountPaid,
              resultCode: payment.resultCode,
              resultDesc: payment.resultDesc,
              mpesaReceiptNumber: payment.mpesaReceiptNumber,
              transactionDate: payment.transactionDate,
            },
          };
        } else {
          /**
           * A case where STK was sent to customer but something
           * happened and the transaction did not complete the transaction.
           * */
          return {
            pollingComplete: true,
            status: false,
            message:
                payment.resultDesc === 'Request cancelled by user'
                  ? "Did you cancel the request? Did it timeout? You can click the Retry button to give it another try."
                  : payment.resultDesc,
          };
        }
      } else if (payment && !payment.status) {
        return {
          pollingComplete: true,
          status: false,
          message: payment.message,
        };
      } else {
        return {
          pollingComplete: false,
          status: false,
          message: 'Payment not found.',
        };
      }
    } catch (e) {
      // Log the error and return a friendly message to the user
      Logger.log('error', 'Error checking payment status: ', {
        fullError: e,
        customError: e,
        actualError: e,
        customerMessage:
            'An error occurred while fetching the payment status. Please try again later.',
      });

      return {
        pollingComplete: true,
        status: false,
        message: e.message || 'An unexpected error occurred.',
      };
    }
  }
}

module.exports = MpesaTransactions;
