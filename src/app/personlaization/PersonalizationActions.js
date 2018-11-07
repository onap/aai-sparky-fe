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
    GET
  } from 'app/networking/NetworkConstants.js';
import networkCall from 'app/networking/NetworkCalls.js';
import {
  GET_PERSONALIZED_VALUES_URL, 
  PERSONALIZATION_FAILED_MESSAGE,
  personalizationActionTypes
} from 'app/personlaization/PersonalizationConstans.js';
import {
  getSetGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';

import {  
  STATUS_CODE_5XX_SERVER_ERROR,
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js';


function createPersonalizedValuesEvent(payload) {

  let event = {
    type: personalizationActionTypes.PERSONALIZATION_PAYLOAD_FOUND,
    data: payload
  };
  return event;
}

function fetchPersonalizedValues(fetchRequestCallback) {
  return dispatch => {
    return fetchRequestCallback().then(
      (response) => {
        if (response.status >= STATUS_CODE_5XX_SERVER_ERROR) {
          dispatch(getSetGlobalMessageEvent(PERSONALIZATION_FAILED_MESSAGE , MESSAGE_LEVEL_WARNING));
        } else {
          // assume 200 status
          return response.json();
        }
      }
    ).then(
      (results)=> {
        dispatch(createPersonalizedValuesEvent(results));
      }
    ).catch(
      () => {
        dispatch(getSetGlobalMessageEvent(PERSONALIZATION_FAILED_MESSAGE , MESSAGE_LEVEL_WARNING));
      }
    );
  };
}

export function getPersonalizationDetails(){
  let personalizationFetchRequest =
    () => networkCall.getRequest(GET_PERSONALIZED_VALUES_URL, GET);
    
  return dispatch => {
    dispatch(fetchPersonalizedValues(personalizationFetchRequest));
  };
}