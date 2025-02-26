const express = require("express");

const router = express.Router();
const { Payment } = require("../models");
const Logger = require("../utils/logging"); // Import the Payment model

router.post('/:paymentCorrelationId', async (req, res) => {
  const { paymentCorrelationId } = req.params;
  const callbackData = req.body;

  const {
    MerchantRequestID,
    CheckoutRequestID,
    ResultCode,
    ResultDesc,
    CallbackMetadata,
  } = callbackData.Body.stkCallback;

  if (ResultCode === 0) {
    const amount = CallbackMetadata.Item.find((item) => item.Name === 'Amount').Value;
    const transactionId = CallbackMetadata.Item.find((item) => item.Name === 'MpesaReceiptNumber').Value;
    const transactionDate = CallbackMetadata.Item.find((item) => item.Name === 'TransactionDate').Value;
    const phoneNumber = CallbackMetadata.Item.find((item) => item.Name === 'PhoneNumber').Value;
    const mpesaReceiptNumber = CallbackMetadata.Item.find((item) => item.Name === 'MpesaReceiptNumber').Value;

    try {
      await Payment.create({
        paymentMethod: 'M-PESA',
        amountPaid: Number(amount),
        orderId: null, // If you have the orderId, set it here
        transactionId,
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID, // correlation_id
        mpesaReceiptNumber,
        transactionDate,
        phoneNumber,
        paymentCorrelationId,
        resultCode: ResultCode, // Store ResultCode
        resultDesc: ResultDesc, // Store ResultDesc
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not add to payments",
          actualError: "Could not add to payments",
          customerMessage:
              "We are unable to add to your payments at the moment. Please try again later!",
        });
        res.status(500).json({ error: 'Error recording payment' });
      });

      Logger.log("info", "Success: ", {
        fullError: req.body,
        customError: req.body,
        actualError: req.body,
        paymentCorrelationId,
        customerMessage:
            "Payment recorded successfully",
      });

      res.status(200).json({ message: 'Payment recorded successfully' });
    } catch (error) {
      Logger.log("error", "Error: ", {
        fullError: error,
        customError: error,
        actualError: error,
        paymentCorrelationId,
        customerMessage:
            "Nothing to show here right now. Please come back later as we work to resolve this. ID: TryCatchResultCode0",
      });

      res.status(500).json({ error: 'Error recording payment' });
    }
  } else {
    try {
      // Save failed transaction details
      await Payment.create({
        paymentMethod: 'M-PESA',
        amountPaid: 0, // Failed transactions may not have an amount
        orderId: null, // If applicable, store orderId
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        paymentCorrelationId,
        resultCode: ResultCode, // Store failure ResultCode
        resultDesc: ResultDesc, // Store failure ResultDesc
      }).catch((err) => {
        Logger.log("error", "Error: ", {
          fullError: err,
          customError: "Could not add to payments",
          actualError: "Could not add to payments",
          customerMessage:
            "We are unable to add to your payments at the moment. Please try again later!",
        });
        res.status(500).json({ error: 'Error recording payment' });
      });

      Logger.log("error", "Error: ", {
        request: req.params,
        fullError: req.body,
        customError: req.body,
        actualError: req.body,
        paymentCorrelationId,
        customerMessage:
            "Payment failed. Please try again later!",
      });

      res.status(400).json({ message: 'Transaction failed or canceled', description: ResultDesc });
    } catch (error) {
      Logger.log("error", "Error: ", {
        request: req.params,
        fullError: req.body,
        customError: req.body,
        actualError: req.body,
        paymentCorrelationId,
        customerMessage:
            "Payment failed. Please try again later!",
      });
      res.status(500).json({ error: 'Error recording failed payment' });
    }
  }
});

module.exports = router;
