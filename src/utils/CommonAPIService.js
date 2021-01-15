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

import axios from 'axios';
import {GlobalExtConstants} from './GlobalExtConstants.js';

const commonApi = (settings, path, httpMethodType, reqPayload, stubPath, overrideDomain, specialCase, additionalHeaders, noProxy) => {
  let BASE_URL = GlobalExtConstants.BASE_URL;
  const proxyConfig = {
  //enter proxy details here for local
    proxy : {
      host: '',
      port: ''
    }
  };

  let SWITCH_URL = '';
  let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'APERTURE_SERVICE'));
  if(overrideDomain){
    SWITCH_URL = overrideDomain + '/';
    if(settings.ISTABULAR){
      SWITCH_URL+= settings.TABULAR + '/'
      + settings.PREFIX + '/'
      + settings.APERTURE + '/'
      + settings.TABULARVERSION + '/'
      + path;
    }else{
      SWITCH_URL+= path;
    }
  }else if(APERTURE_SERVICE && (settings.ISAPERTURE !== undefined)){
    let baseURL = (settings.NODESERVER) ? 'https://'+ settings.NODESERVER : BASE_URL;
    SWITCH_URL = baseURL + '/';
    if(!noProxy){
        SWITCH_URL += settings.PROXY + '/';
    }
    SWITCH_URL += settings.PREFIX + '/'
    + settings.APERTURE + '/';
    if(settings.ISAPERTURE && settings.APERTURE_SERVICENAME !== undefined){
      SWITCH_URL += settings.VERSION + '/'
      + settings.APERTURE_SERVICENAME;
    }else if(settings.ISAPERTURE){
      SWITCH_URL += settings.VERSION + '/';
    }
    SWITCH_URL += path;    
  }else if(settings.NODESERVER){
    SWITCH_URL = 'https://'
      + settings.NODESERVER + '/';
      if(!noProxy){
          SWITCH_URL += settings.PROXY + '/';
      }
      SWITCH_URL += settings.PREFIX + '/';
      if(specialCase){
         SWITCH_URL += specialCase + '/';
      }
     SWITCH_URL += settings.VERSION + '/'
     + path;
  }else{
    SWITCH_URL = BASE_URL + '/';
      if(!noProxy){
          SWITCH_URL += settings.PROXY + '/';
      }
      SWITCH_URL += settings.PREFIX + '/';
    if(specialCase){
       SWITCH_URL += specialCase + '/';
    }
    SWITCH_URL += settings.VERSION + '/'
         + path;
  }
  console.log('Making call to the backend >>>>>>>>>>>', SWITCH_URL);

  var headers = {'Content-Type' : 'application/json','Access-Control-Allow-Origin' : '*','X-FromAppId':'AAI-UI', 'X-TransactionId' : 'AAI-UI', 'Accept':'application/json'};
  if(additionalHeaders){
    for(var i = 0; i < additionalHeaders.length; i++){
        if(additionalHeaders[i].name && additionalHeaders[i].value){
            headers[additionalHeaders[i].name] = additionalHeaders[i].value;
        }else{
            console.log("CommonAPIService :: Additional headers passed in are not in teh proper format: "+ JSON.stringify(additionalHeaders));
        }
    }
  }
  console.log("HEADER VALUES: "+ headers);
  if(settings.USESTUBS){
    return new Promise((resolve, reject) => {
          var responseObj = {};
          responseObj.data = require('app/assets/stubs/' + stubPath + '.json');
          responseObj.status = 200;
          responseObj.headers = [];
          if(responseObj.data && responseObj.data.results){
            responseObj.headers['total-results'] =  Object.keys(responseObj.data.results).length;
            resolve(responseObj);
          }else if(responseObj.data && ['BYOQPersonalQueries','BYOQCommunityQueries','BYOQPublicQueries','ConvertQueryToTree','SingleTransactionEdit'].indexOf(stubPath) > -1 ){
            resolve(responseObj);
          }else if(responseObj.data){
            responseObj.headers['total-results'] =  0;
            reject(responseObj.data);
          }else{
            reject('Error');
          }
      })
  }else if (['PUT','PATCH','DELETE','POST'].indexOf(httpMethodType) > -1 && reqPayload !== null) {
    return axios({ method: httpMethodType,
      url: SWITCH_URL,
      data: reqPayload,
      headers: headers });
  }else{
    if(settings.NODESERVER){
        return axios.get(SWITCH_URL, proxyConfig);
    }else{
        return axios.get(SWITCH_URL);
    }
  }
};

export default commonApi;
