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

import {combineReducers} from 'redux';
import ForceDirectedGraph from 'generic-components/graph/ForceDirectedGraph.jsx';
import {aaiActionTypes} from 'app/MainScreenWrapperConstants.js';
import {
  tierSupportActionTypes, TSUI_GRAPH_MENU_NODE_DETAILS
} from 'app/tierSupport/TierSupportConstants.js';
import SelectedNodeDetailsReducer from 'app/tierSupport/selectedNodeDetails/SelectedNodeDetailsReducer.js';
import GlobalAutoCompleteSearchBarReducer from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarReducer.js';
import LaunchInContextReducer from 'app/tierSupport/launchExternalResource/LaunchExternalResourceReducer.js';
import {
  MESSAGE_LEVEL_DANGER, MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';

export default combineReducers({
  selectedNodeDetails: SelectedNodeDetailsReducer,
  launchExternalResourceReducer: LaunchInContextReducer,
  globalAutoCompleteSearchBar: GlobalAutoCompleteSearchBarReducer,
  tierSupportReducer: (state = {}, action) => {
    switch (action.type) {
      case tierSupportActionTypes.TS_NODE_SEARCH_RESULTS:
        let graphData = ForceDirectedGraph.generateNewProps(action.data.nodes, action.data.links,
          action.data.graphMeta);

        return {
          ...state,
          forceDirectedGraphRawData: graphData,
          feedbackMsgText: '',
          feedbackMsgSeverity: ''
        };
      case tierSupportActionTypes.TS_GRAPH_NODE_MENU_SELECTED:
        return {
          ...state, graphNodeSelectedMenu: action.data
        };
      case tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS:
        let emptyNodesAndLinksNoResults = ForceDirectedGraph.generateNewProps([], [], {});
        return {
          ...state,
          forceDirectedGraphRawData: emptyNodesAndLinksNoResults,
          graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS,
          feedbackMsgText: action.data.errorMsg,
          feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
        };
      case tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR:
        let emptyNodesAndLinksNetworkError = ForceDirectedGraph.generateNewProps([], [], {});
        return {
          ...state,
          forceDirectedGraphRawData: emptyNodesAndLinksNetworkError,
          graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS,
          feedbackMsgText: action.data.errorMsg,
          feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
        };
      case tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA:
        let emptyNodesAndLinksClearData = ForceDirectedGraph.generateNewProps([], [], {});
        return {
          ...state,
          forceDirectedGraphRawData: emptyNodesAndLinksClearData,
          graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS,
          feedbackMsgText: '',
          feedbackMsgSeverity: ''
        };
      case tierSupportActionTypes.TS_GRAPH_NODE_SELECTED:
        return {
          ...state,
          nodeData: action.data
        };
      case tierSupportActionTypes.TIER_SUPPORT_ACTIVATE_BUSY_FEEDBACK:
        return {
          ...state,
          enableBusyFeedback: true
        };
      case tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK:
        return {
          ...state,
          enableBusyFeedback: false
        };  
      case globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT:
        let emptyNodesAndLinksWarningEvent = ForceDirectedGraph.generateNewProps([], [], {});
        return {
          ...state,
          forceDirectedGraphRawData: emptyNodesAndLinksWarningEvent,
          graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS
        };
      case aaiActionTypes.AAI_WINDOW_RESIZE:
      case tierSupportActionTypes.SPLIT_PANE_RESIZE:
        let splitPaneLeftSideElement = document.getElementsByClassName('Pane1');
        if (splitPaneLeftSideElement.length > 0) {
          let width = splitPaneLeftSideElement[0].offsetWidth;

          return {
            ...state, windowWidth: width, windowHeight: splitPaneLeftSideElement[0].offsetHeight
          };
        } else {
          return state;
        }
    }

    return state;
  }
});
