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
import {
  POST,
  POST_HEADER,
} from 'app/networking/NetworkConstants.js';

import {ANALYTICS_URL} from 'app/analytics/AnalyticsConstants.js';
let fetch = require('node-fetch');

export function getStoreAnalyticsPayload() {
  var documentBody  = document.body.getElementsByTagName('*');
  return documentBody[0].innerHTML.replace('\s+', '');
}

function getAnalyticsPostBody(payload){
  return {
    page: '',
    function: '',
    action : payload
  };
}

export function postAnalyticsData(payload){

  return () => {
    fetch(ANALYTICS_URL, {
      method: POST,
      headers: POST_HEADER,
      body: JSON.stringify(getAnalyticsPostBody(payload))
    });
    
  };
  
}

