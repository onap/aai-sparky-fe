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

import {aaiActionTypes} from './MainScreenWrapperConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';
import {
  contextHandlerActionTypes
} from 'app/contextHandler/ContextHandlerConstants.js';

export default (state = {}, action) => {
  switch (action.type) {
    case aaiActionTypes.AAI_SHOW_MENU:
      return {
        ...state,
        showMenu: action.data.showMenu,
        toggleButtonActive: action.data.showMenu // if showing menu, then toggle
                                               // is active
      };
    case aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED:
      let obj = {...state};
      obj['extensibleViewNetworkCallbackData'] = {};
      obj['extensibleViewNetworkCallbackData'][action.data.paramName] =  action.data.viewData;
      // If there are some current viewData that need to be kept:
      for(var vData in action.data.curViewData) {
        obj['extensibleViewNetworkCallbackData'][vData] = action.data.curViewData[vData];
      }
      return obj;
    case aaiActionTypes.EXTENSIBLE_VIEW_NETWORK_CALLBACK_CLEAR_DATA:
      return {
        ...state,
        extensibleViewNetworkCallbackData : {}
      };
    case globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT:
      return {
        ...state,
        extensibleViewNetworkCallbackData: {clearView: true}
      };
    case contextHandlerActionTypes.SINGLE_SUGGESTION_FOUND:
      return {
        ...state,
        externalRequestFound: action.data
      };

    case aaiActionTypes.SET_SECONDARY_TITLE:
      return {
        ...state,
        secondaryTitle: action.data
      };
    case contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_FOUND:
      return {
        ...state,
        subscriptionPayload: action.data,
        subscriptionEnabled: true
      };
    case contextHandlerActionTypes.SUBSCRIPTION_PAYLOAD_EMPTY:
      return {
        ...state,
        subscriptionEnabled: false
      };
  }
  return state;
};

