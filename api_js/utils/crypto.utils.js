var CryptoJS = require("crypto-js");

const key = "cledesecurite";

module.exports = {
    encrypt: function(data) {
      var encryptData = CryptoJS.AES.encrypt(data, key).toString();
      return encryptData
    },
    decrypt: function(data) {
      if(data != undefined){
        var decryptData  = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
        return decryptData;
      }else{
        var decryptData = null
        return decryptData;
      }
    }
  }