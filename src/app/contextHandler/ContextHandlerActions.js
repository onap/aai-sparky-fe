/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017 Amdocs
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
 *
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */

import {
  POST,
  POST_HEADER,
  GET
} from 'app/networking/NetworkConstants.js';
import networkCall from 'app/networking/NetworkCalls.js';
import {EXTERNAL_REQ_ENTITY_SEARCH_URL,
WRONG_EXTERNAL_REQUEST_MESSAGE,
  WRONG_RESULT,
  ZERO_RESULT,
  MULTIPLE_RESULT,
  FAILED_REQUEST,
  SUBSCRIPTION_FAILED_MESSAGE,
  SUBSCRIPTION_PAYLOAD_URL
} from 'app/contextHandler/ContextHandlerConstants';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';

import {  STATUS_CODE_204_NO_CONTENT,
  STATUS_CODE_3XX_REDIRECTION,
  MESSAGE_LEVEL_DANGER,
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js';


import {
  contextHandlerActionTypes
} from 'app/contextHandler/ContextHandlerConstants.js';

function getExternalParamValues(urlParams) {
  var pairs = decodeURIComponent(urlParams).replace('?','').replace(/\r\n|\n/,'').split('&');

  var externalparamObject = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    externalparamObject[pair[0]] = pair[1] || '';
  });
  return externalparamObject;

}

function createSubscriptionPayloadEvent(payload) {

  let event = undefined;

  if (payload.subscriptionEnabled) {
    event = {
      type: contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_FOUND,
      data: payload
    };
  } else {
    event = {
      type: contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_EMPTY,
      data: {}
    };
  }

  return event;
}

function fetchSubscriptionPayload(fetchRequestCallback) {
  return dispatch => {
    return fetchRequestCallback().then(
      (response) => {
        if (response.status >= STATUS_CODE_3XX_REDIRECTION) {
          return Promise.reject(new Error(response.status));
        } else {
          // assume 200 status
          return response.json();
        }
      }
    ).then(
      (results)=> {
        dispatch(createSubscriptionPayloadEvent(results));
      }
    ).catch(
      () => {
        dispatch(getSetGlobalMessageEvent(SUBSCRIPTION_FAILED_MESSAGE , MESSAGE_LEVEL_WARNING));
      }
    );
  };
}

export function getSubscriptionPayload() {
  let externalfetchRequest =
    () => networkCall.getRequest(SUBSCRIPTION_PAYLOAD_URL, GET);
  return dispatch => {
    dispatch(fetchSubscriptionPayload(externalfetchRequest));
  };
}

function validateExternalParams(externalURLParams) {
  if(externalURLParams.view && externalURLParams.entityId && externalURLParams.entityType) {
    return true;
  }
  return false;

}

function createSuggestionFoundEvent(suggestion) {
  return {
    type: contextHandlerActionTypes.SINGLE_SUGGESTION_FOUND,
    data: suggestion
  };
}


function fetchDataForExternalRequest(fetchRequestCallback) {
  return dispatch => {
    return fetchRequestCallback().then(
      (response) => {
        if (response.status === STATUS_CODE_204_NO_CONTENT || response.status >= STATUS_CODE_3XX_REDIRECTION) {
          return Promise.reject(new Error(response.status));
        } else {
          // assume 200 status
          return response.json();
        }
      }
    ).then(
      (results)=> {
        if (results.suggestions !== undefined) {
          if( results.suggestions.length === 1) {
            dispatch(getClearGlobalMessageEvent());
            dispatch(createSuggestionFoundEvent({suggestion: results.suggestions[0]}));
          } else if(results.totalFound === 0 ) {
            dispatch(getSetGlobalMessageEvent(ZERO_RESULT, MESSAGE_LEVEL_DANGER));
          } else {
            dispatch(getSetGlobalMessageEvent(MULTIPLE_RESULT, MESSAGE_LEVEL_DANGER));          }
        } else {
          dispatch(getSetGlobalMessageEvent(WRONG_RESULT, MESSAGE_LEVEL_DANGER));
        }
      }
    ).catch(
      () => {
        dispatch(getSetGlobalMessageEvent(FAILED_REQUEST , MESSAGE_LEVEL_DANGER));
      }
    );
  };
}

function validateAndFetchExternalParams(externalParams) {
  if(!validateExternalParams(externalParams)) {
    return dispatch => {
      dispatch(
        getSetGlobalMessageEvent(WRONG_EXTERNAL_REQUEST_MESSAGE, MESSAGE_LEVEL_DANGER));
    };
  } else {
    let postBody = JSON.stringify(externalParams);
    let externalfetchRequest =
      () => networkCall.fetchRequestObj(EXTERNAL_REQ_ENTITY_SEARCH_URL, POST,
        POST_HEADER, postBody);
    return dispatch => {
      dispatch(fetchDataForExternalRequest(externalfetchRequest));
    };
  }
}
export function externalUrlRequest(urlParams) {
  let externalURLParams = getExternalParamValues(urlParams);
  return dispatch => {
    dispatch(
      validateAndFetchExternalParams(externalURLParams));
  };
}
export function externalMessageRequest(jsonParams) {
  return dispatch => {
    dispatch(
      validateAndFetchExternalParams(jsonParams));
  };

}

