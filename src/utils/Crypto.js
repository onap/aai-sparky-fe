/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */
/**
 * Created by salmaat on 7/13/2017.
 */
import CryptoJS from 'crypto-js';

const key = 'key2017';

function encrypt(text) {
  var encrypted = CryptoJS.AES.encrypt(text, key);
  return encrypted.toString().split('/').join('*');
}

function decrypt(text) {
  var decrypted = CryptoJS.AES.decrypt(text.split('*').join('/'), key);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

function encode(phrase) {
  return CryptoJS.enc.Utf16.parse(phrase);
}

function decode(encodedPhrase) {
  return CryptoJS.enc.Utf16.stringify(encodedPhrase);
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt,
  encode: encode,
  decode: decode
};
