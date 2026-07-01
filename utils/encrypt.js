// cryptoUtils.js
const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.KEY_ENCRYPT;

// Función para cifrar
function encryptData(data) {
  const plainText = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
  return encrypted;
}

// Función para descifrar
function decryptData(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

module.exports = { encryptData, decryptData };
