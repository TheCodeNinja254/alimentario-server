const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const https = require("https");
const http = require("http");
const mpesaCallbackRoute = require('./routes/mpesa-callback-handler');

const app = express();

app.use(bodyParser.json());
app.use(process.env.MPESA_CALLBACK_BASE_PATH, mpesaCallbackRoute);

let xServer;

if (process.env.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync("/opt/ssl/privkey.pem"),
    cert: fs.readFileSync("/opt/ssl/fullchain.pem"),
  };

  // Start HTTPS server with Express app in production
  xServer = https.createServer(options, app).listen(process.env.CALLBACK_PORTAL_PORT || 4000);
} else {
  // Start HTTP server with Express app in non-production
  xServer = http.createServer(app).listen(process.env.CALLBACK_PORTAL_PORT || 4000);
}

// Log the server URL
console.log(`🚀 Server ready at http${process.env.NODE_ENV === 'production' ? 's' : ''}://desafio.co.ke:${process.env.CALLBACK_PORTAL_PORT || 4000}`);

module.exports = xServer;
