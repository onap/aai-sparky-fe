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
  tierSupportActionTypes
} from 'app/tierSupport/TierSupportConstants.js';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';

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

export function clearVIData() {
  return {
    type: tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA
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
