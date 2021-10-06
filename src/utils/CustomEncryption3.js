/*
 * Copyright (c) 2020.
 * Safaricom PLC
 * Systems, URLs, Databases and content in this document maybe proprietary to Safaricom PLC. Use or reproduction may require written permission from Safaricom PLC
 *
 * @Author: Fredrick Mbugua/FMMBUGUA
 */

// // const { JWE } = require('node-jose');
// // const { encode, decode } = require('./base64');
//
// const jose = (privateKey, publicKey) => {
//   async function encrypt(raw) {
//     if (!raw) throw new Error('Missing raw data.');
//     const buffer = Buffer.from(JSON.stringify(raw));
//     const encrypted = await JWE.createEncrypt(publicKey)
//       .update(buffer).final();
//     return encode(encrypted);
//   }
//   async function decrypt(encrypted) {
//     if (!encrypted) throw new Error('Missing encrypted data.');
//     const decoded = decode(encrypted);
//     const { payload } = await JWE.createDecrypt(privateKey)
//       .decrypt(decoded);
//     return JSON.parse(payload);
//   }
//   return { encrypt, decrypt };
// };
// module.exports = jose;