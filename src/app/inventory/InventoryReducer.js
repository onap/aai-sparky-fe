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
import {InventoryActionTypes} from './InventoryConstants.js';

export default(state = {}, action) => {
  
  switch (action.type) {
    case InventoryActionTypes.TOPOGRAPHIC_QUERY_SUCCESS:
      return {
        ...state,
        mapPlotPoints: action.data.plotPoints
      };
      break;
    
    case InventoryActionTypes.COUNT_BY_ENTITY_SUCCESS:
      return {
        ...state,
        countByType: action.data.countByType
      };
      break;
    
    case InventoryActionTypes.COUNT_BY_DATE_SUCCESS:
      return {
        ...state,
        countByDate: action.data.countByDate
      };
      break;
    
    case InventoryActionTypes.TOPOGRAPHIC_QUERY_FAILED:
    case InventoryActionTypes.COUNT_BY_ENTITY_FAILED:
    case InventoryActionTypes.COUNT_BY_DATE_FAILED:
      return {
        ...state,
        feedbackMsgSeverity: action.data.severity,
        feedbackMsgText: action.data.message
      };
      break;
    
    default:
      break;
  }
  
  return state;
};
