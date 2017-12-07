/**
 * Created by salmaat on 7/13/2017.
 */
import CryptoJS from 'crypto-js';

var key = 'key2017';

function encrypt(text) {
  var encrypted = CryptoJS.AES.encrypt(text, key);
  return encrypted.toString().split('/').join('*');
}

function decrypt(text) {
  var decrypted = CryptoJS.AES.decrypt(text.split('*').join('/'), key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}


module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};
