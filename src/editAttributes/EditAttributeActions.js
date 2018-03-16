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
import NetworkCalls from './networking/NetworkCalls.js';
import {
  POST,
  BACKEND_POST_HEADER,
  CREDENTIALS
} from './networking/NetworkConstants.js';
import {
  createEditEntityAttributeRequestObject
} from './networking/NetworkUtils.js';
import {
  setAttributesActionTypes,
  EDIT_ENTITY_ATTRIBUTES_URL,
  RESPONSE_CODE_SUCCESS,
  RESPONSE_CODE_NOT_AUTHORIZED,
  RESPONSE_MESSAGE_SUCCESS,
  RESPONSE_MESSAGE_NOT_AUTHORIZED,
  RESPONSE_MESSAGE_FAILURE,
  RESPONSE_MESSAGE_NETWORK_ERROR
} from './EditAttributeConstants.js';

function errorReturnedEvent(errorMsg) {
  return {
    type: setAttributesActionTypes.SET_ATTRIBUTE_ERROR,
    data: {errorMsg: errorMsg}
  };
}

function successReturnedEvent() {
  return {
    type: setAttributesActionTypes.SET_ATTRIBUTE_SUCCESS,
    data: {successMsg: RESPONSE_MESSAGE_SUCCESS}
  };
}

function clearFeedbackMessageEvent() {
  return {
    type: setAttributesActionTypes.CLEAR_FEEDBACK_MESSAGE,
    data: {}
  };
}

export function clearFeebackMessage() {
  return dispatch => {
    dispatch(clearFeedbackMessageEvent());
  };
}

export function requestEditEntityAttributes(entityURI, entityAttributes) {

  let postBody = JSON.stringify(
    createEditEntityAttributeRequestObject(entityURI, entityAttributes));
  return dispatch => {
    return NetworkCalls.fetchRequest(EDIT_ENTITY_ATTRIBUTES_URL,
        CREDENTIALS, POST, BACKEND_POST_HEADER, postBody).then(
      (responseJson) => {
        if (responseJson) {
          if (responseJson.resultCode === RESPONSE_CODE_SUCCESS) {
            dispatch(successReturnedEvent());
          } else if (responseJson.resultCode === RESPONSE_CODE_NOT_AUTHORIZED) {
            dispatch(errorReturnedEvent(RESPONSE_MESSAGE_NOT_AUTHORIZED));
          } else {
            dispatch(errorReturnedEvent(RESPONSE_MESSAGE_FAILURE));
          }
        }
      }
    ).catch(
      () => {
        dispatch(errorReturnedEvent(RESPONSE_MESSAGE_NETWORK_ERROR));
      }
    );
  };
}
