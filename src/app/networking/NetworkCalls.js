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

import {BASE_URL} from 'app/networking/NetworkConstants.js';

function fetchRequest(URL, POST, POST_HEADER, BODY) {
  return fetch(URL, {
    credentials: 'same-origin',
    method: POST,
    headers: POST_HEADER,
    body: BODY
  }).then(
    (response) => response.json()
  );
}

const fetchConfigurableViewRequest = (queryData) => {
  const URL = `${BASE_URL}${queryData.api}`;
  return fetch(URL, {
    credentials: 'same-origin',
    method: queryData.method,
    headers: queryData.headers,
    body: JSON.stringify(queryData.componentDataDescriptor)
  });
};

function fetchRequestObj(URL, POST, POST_HEADER, BODY) {
  return fetch(URL, {
    credentials: 'same-origin',
    method: POST,
    headers: POST_HEADER,
    body: BODY
  });
}

function getRequest(URL, GET) {
  return fetch(URL, {
    credentials: 'same-origin',
    method: GET
  });
}

const genericRequest = (url, relativeURL, httpMethodType) => {
  let URL;
  if(relativeURL){
    URL = BASE_URL.concat(url);
  } else {
    URL = url;
  }
  switch(httpMethodType){
    case 'GET':
      return fetch(URL, {
        credentials: 'same-origin',
        method: 'GET'
      }).then(
        (response) => response.json()
      );
  }
};

module.exports = {
  fetchRequest: fetchRequest,
  fetchRequestObj: fetchRequestObj,
  getRequest: getRequest,
  fetchConfigurableViewRequest: fetchConfigurableViewRequest,
  genericRequest: genericRequest
};
