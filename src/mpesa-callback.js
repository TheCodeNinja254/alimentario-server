const express = require('express');
const bodyParser = require('body-parser');
const mpesaCallbackRoute = require('./routes/mpesa-callback-handler');

const app = express();

app.use(bodyParser.json());
app.use('/mpesa', mpesaCallbackRoute);

app.listen(process.env.CALLBACK_PORTAL_PORT, () => {
  console.log(`Server running on port: ${process.env.CALLBACK_PORTAL_PORT}`);
});
