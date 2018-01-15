/*
 * ============LICENSE_START===================================================
 * SPARKY (AAI UI service)
 * ============================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ============================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=====================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

import {tierSupportActionTypes} from 'app/tierSupport/TierSupportConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';
import {isEmpty} from 'lodash';

export default (state = {}, action) => {
  switch (action.type) {
    case tierSupportActionTypes.TS_NODE_SEARCH_RESULTS:
      if(!isEmpty(action.data.nodes)){
        for (const node of action.data.nodes) {
          if (node.nodeMeta.searchTarget === true) {
            let externalResourcePayload = {};
            if(!isEmpty(node.externalResourcePayload)){
              externalResourcePayload = node.externalResourcePayload;
            }
            return {
              ...state,
              externalResourcePayload: externalResourcePayload
            };
          }
        }
      }
      return {
        ...state,
        externalResourcePayload: {}
      };

    case tierSupportActionTypes.TS_GRAPH_NODE_SELECTED:
      let externalResourcePayload;
      if(action.data.externalResourcePayload){
        externalResourcePayload = action.data.externalResourcePayload;
      } else {
        externalResourcePayload = {};
      }
      return {
        ...state,
        externalResourcePayload: externalResourcePayload
      };

    case globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT:
    case tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR:
    case tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA:
    case tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS:
      return {
        ...state,
        externalResourcePayload: {}
      };
  }
  return state;
};
