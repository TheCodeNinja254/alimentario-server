const express = require("express");

const router = express.Router();
const Payment = require('../models/Definitions/Payment'); // Import the Payment model

// Callback handler to insert payment into the database
router.post('/mpesa/callback', async (req, res) => {
  const callbackData = req.body;

  // Extract data from callback
  const {
    MerchantRequestID,
    CheckoutRequestID,
    ResultCode,
    ResultDesc,
    CallbackMetadata,
  } = callbackData.Body.stkCallback;

  // Only proceed if the transaction was successful (ResultCode 0 means success)
  if (ResultCode === 0) {
    const amount = CallbackMetadata.Item.find((item) => item.Name === 'Amount').Value;
    const transactionId = CallbackMetadata.Item.find((item) => item.Name === 'MpesaReceiptNumber').Value;
    const transactionDate = CallbackMetadata.Item.find((item) => item.Name === 'TransactionDate').Value;
    const phoneNumber = CallbackMetadata.Item.find((item) => item.Name === 'PhoneNumber').Value;
    const mpesaReceiptNumber = CallbackMetadata.Item.find((item) => item.Name === 'MpesaReceiptNumber').Value;

    try {
      // Insert into the database, correlating the request by MerchantRequestID or CheckoutRequestID
      await Payment.create({
        paymentMethod: 'M-PESA',
        amountPaid: amount,
        orderId: null, // If you have the orderId, set it here
        transactionId,
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID, // correlation_id
        mpesaReceiptNumber,
        transactionDate,
        phoneNumber,
      });

      res.status(200).json({ message: 'Payment recorded successfully' });
    } catch (error) {
      console.error('Error saving payment:', error);
      res.status(500).json({ error: 'Error recording payment' });
    }
  } else {
    res.status(400).json({ message: 'Transaction failed or canceled', description: ResultDesc });
  }
});
