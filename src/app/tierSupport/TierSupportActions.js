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

import {tierSupportActionTypes,
  TS_BACKEND_SEARCH_SELECTED_NODE_URL} from 'app/tierSupport/TierSupportConstants.js';
import {
  POST,
  POST_HEADER,
  ERROR_RETRIEVING_DATA,
  NO_RESULTS_FOUND
} from 'app/networking/NetworkConstants.js';
import networkCall from 'app/networking/NetworkCalls.js';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {
  STATUS_CODE_204_NO_CONTENT,
  STATUS_CODE_3XX_REDIRECTION,
  STATUS_CODE_5XX_SERVER_ERROR
} from 'utils/GlobalConstants.js';

function createOnNodeDetailsChangeEvent(newDetails) {
  return {
    type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
    data: newDetails
  };
}

function createSplitPaneResizeEvent(initialLoad) {
  return {
    type: tierSupportActionTypes.SPLIT_PANE_RESIZE,
    data: initialLoad
  };
}

function createOnNodeMenuSelectEvent(selectedMenu) {
  return {
    type: tierSupportActionTypes.TS_GRAPH_NODE_MENU_SELECTED,
    data: selectedMenu
  };
}

export function onNodeDetailsChange(newDetails) {
  return dispatch => {
    dispatch(createOnNodeDetailsChangeEvent(newDetails));
  };
}

export function splitPaneResize(initialLoad) {
  return dispatch => {
    dispatch(createSplitPaneResizeEvent(initialLoad));
  };
}

export function onNodeMenuChange(selectedMenu) {
  return dispatch => {
    dispatch(createOnNodeMenuSelectEvent(selectedMenu));
  };
}

function createNodeDetailsFoundEvent(nodeDetails) {
  return {
    type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
    data: nodeDetails
  };
}

function createSelectedNodeDetails(nodeDetails) {
  var selectedNodeDetail;
  for(let i = 0; i < nodeDetails.nodes.length; i++) {
    if(nodeDetails.nodes[i].nodeMeta.className === 'selectedSearchedNodeClass') {
      selectedNodeDetail = nodeDetails.nodes[i];
      break;
    }
  }
  return {
    type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
    data: selectedNodeDetail
  };
}

function noNodeDetailsFoundEvent(errorText) {
  return {
    type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
    data: {errorMsg: errorText}
  };
}

function getInvalidSelectedNodeSearchEvent(errorText) {
  return {
    type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR,
    data: {value: errorText, errorMsg: ERROR_RETRIEVING_DATA}
  };
}

export function clearVIData() {
  return {
    type: tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA
  };
}

function setBusyFeedback(){
  return {
    type: tierSupportActionTypes.TIER_SUPPORT_ACTIVATE_BUSY_FEEDBACK
  };
}

function disableBusyFeedback(){
  return {
    type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK
  };
}

export function fetchSelectedNodeElement(fetchRequestCallback) {
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
      (responseJson) => {
        if (responseJson.nodes.length > 0) {
          dispatch(createNodeDetailsFoundEvent(responseJson));
          dispatch(createSelectedNodeDetails(responseJson));
        } else {
          dispatch(noNodeDetailsFoundEvent(NO_RESULTS_FOUND));
        }
      }
    ).then(
      () => {
        dispatch(disableBusyFeedback());
      }
    ).catch(
      (errorCode) => {
        dispatch(disableBusyFeedback());
        if (errorCode.message >= STATUS_CODE_5XX_SERVER_ERROR) {
          dispatch(getInvalidSelectedNodeSearchEvent(ERROR_RETRIEVING_DATA));
        } else {
          // TODO - assuming 204 status, but should include additional
          // statuses in the future with proper messaging in order to return
          // better messaging
          dispatch(noNodeDetailsFoundEvent(NO_RESULTS_FOUND));
        }
      }
    );
  };
}

export function querySelectedNodeElement(
  searchHashId, selectedNodeFetchRequest) {
  let payload = {
    hashId: searchHashId
  };

  if (selectedNodeFetchRequest === undefined) {
    let postBody = JSON.stringify(payload);
    selectedNodeFetchRequest =
      () => networkCall.fetchRequestObj(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST,
        POST_HEADER, postBody);
  }

  return dispatch => {
    dispatch(setBusyFeedback());
    dispatch(fetchSelectedNodeElement(selectedNodeFetchRequest));
  };
}

export function setNotificationText(msgText, msgSeverity) {
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
