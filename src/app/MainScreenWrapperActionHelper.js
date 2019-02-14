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
  BASE_URL,
  ERROR_RETRIEVING_DATA
} from 'app/networking/NetworkConstants.js';
import {
  MESSAGE_LEVEL_DANGER
} from 'utils/GlobalConstants.js';
import {fetchRequestObj} from 'app/networking/NetworkCalls.js';

import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {aaiActionTypes} from 'app/MainScreenWrapperConstants.js';

function createWindowSizeChangeEvent() {
  return {
    type: aaiActionTypes.AAI_WINDOW_RESIZE
  };
}

function createShowMenuEvent(show) {
  return {
    type: aaiActionTypes.AAI_SHOW_MENU,
    data: {
      showMenu: show
    }
  };
}

export function windowResize() {
  return dispatch => {
    dispatch(createWindowSizeChangeEvent());
  };
}

export function showMainMenu(show) {
  return dispatch => {
    dispatch(createShowMenuEvent(show));
  };
}

function createOverlayDataFoundEvent(overlayData, paramName, curData, responseEventKey) {
  return {
    type: responseEventKey,
    data: {
      paramName: paramName,
      overlayData: overlayData,
      curData: curData
    }
  };
}

function overlayViewData(dataFetchRequest, paramName, curData, responseEventKey) {
  return async dispatch => {
    await dataFetchRequest().then(
      (response) => {
        return response.json();
      }
    ).then(
      (responseJson) => {
        dispatch(createOverlayDataFoundEvent(responseJson, paramName, curData, responseEventKey));
      }).catch(
      () => {
        dispatch(getSetGlobalMessageEvent(ERROR_RETRIEVING_DATA, MESSAGE_LEVEL_DANGER));
        dispatch(createOverlayDataFoundEvent({}, paramName, curData, responseEventKey));
      });
  };
}

export function overlayNetworkCallback(urlApi, postBody, paramName, curData, responseEventKey) {
  let dataFetchRequest =
    () => fetchRequestObj(BASE_URL + urlApi, POST,
      POST_HEADER, JSON.stringify(postBody));


  return dispatch => {
    dispatch(overlayViewData(dataFetchRequest, paramName, curData, responseEventKey));
  };
}

function createViewDataFoundEvent(viewData, paramName, curViewData) {
  var obj = {};
  obj['data'] = {};
  obj['data']['paramName'] = paramName;
  obj['data']['viewData'] = viewData;
  obj['data']['curViewData'] = curViewData;
  obj['type'] = aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED;

  return obj;
}

function extensibleViewData(dataFetchRequest, paramName, curViewData) {
  return dispatch => dataFetchRequest().then(
      (response) => {
        return response.json();
      }
    ).then(
      (responseJson) => {
        dispatch(createViewDataFoundEvent(responseJson, paramName, curViewData));
      }).catch(
      () => {
        dispatch(getSetGlobalMessageEvent(ERROR_RETRIEVING_DATA, MESSAGE_LEVEL_DANGER));
        dispatch(createViewDataFoundEvent({}, paramName, curViewData));
        //To-do: If need to send a flag later on to the view, add a function to have the flag
      });
}

export function extensibleViewNetworkCallback(urlApi, postBody, paramName, curViewData) {

  let dataFetchRequest =
    () => fetchRequestObj(BASE_URL + urlApi, POST,
      POST_HEADER, postBody);

  return async dispatch => {
    await dispatch(extensibleViewData(dataFetchRequest, paramName, curViewData));
  };
}

export function extensibleViewMessageCallback(msgText, msgSeverity) {
  if (msgText.length > 0) {
    return dispatch => {
      dispatch(
        getSetGlobalMessageEvent(msgText, msgSeverity));
    };
  } else {
    return dispatch => {
      dispatch(getClearGlobalMessageEvent());
    };
  }
}

export function clearExtensibleViewData() {
  return {
    type: aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_CLEAR_DATA,
    data: {}
  };
}

export function setSecondaryTitle(title) {
  return {
    type: aaiActionTypes.SET_SECONDARY_TITLE,
    data: title
  };
}
