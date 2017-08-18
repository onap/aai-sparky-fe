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
import keyMirror from 'utils/KeyMirror.js';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

export const tierSupportActionTypes = keyMirror({
  TIER_SUPPORT_NETWORK_ERROR: null,
  TS_NODE_SEARCH: null,
  TS_NODE_SEARCH_RESULTS: null,
  TS_NODE_SEARCH_NO_RESULTS: null,
  TS_GRAPH_DATA_RESULTS: null,
  TS_GRAPH_NODE_SELECTED: null,
  TS_GRAPH_NODE_MENU_SELECTED: null,
  SPLIT_PANE_RESIZE: null,
  TIER_SUPPORT_CLEAR_DATA: null
});

export const TSUI_NODE_DETAILS_INITIAL_WIDTH = 300;
export const TSUI_NODE_DETAILS_MIN_WIDTH = 200;
export const TSUI_SEARCH_URL = BASE_URL + '/search/viuiSearch/';

export const TSUI_TITLE = 'View & Inspect';
export const TSUI_GRAPH_MENU_NODE_DETAILS = 'NODE_DETAILS';
export const SEARCH_SELECTED_NODE_PATH = '/visualization/prepareVisualization';
export const TS_BACKEND_SEARCH_SELECTED_NODE_URL = BASE_URL +
  SEARCH_SELECTED_NODE_PATH;
