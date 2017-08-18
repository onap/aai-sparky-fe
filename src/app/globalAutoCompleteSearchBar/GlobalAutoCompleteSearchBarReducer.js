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
import i18n from 'utils/i18n/i18n';

import {
  globalAutoCompleteSearchBarActionTypes,
  NO_MATCHES_FOUND
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';
import {
  MESSAGE_LEVEL_WARNING,
  MESSAGE_LEVEL_DANGER
} from 'utils/GlobalConstants.js';

export default (state = {}, action) => {
  switch (action.type) {
    case globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND:
      return {
        ...state,
        suggestions: action.data.suggestions,
        cachedSuggestions: action.data.suggestions,
        feedbackMsgText: action.data.errorMsg,
        feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
      };
    case globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND:
      return {
        ...state,
        suggestions: [{ text: i18n(NO_MATCHES_FOUND)}],
        cachedSuggestions: [{
          entityType: i18n(NO_MATCHES_FOUND)
        }],
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
    case globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD:
      return {
        ...state,
        suggestions: [],
        cachedSuggestions: [],
        value: '',
        feedbackMsgText: '',
        feedbackMsgSeverity: '',
        clearSearchText: false
      };
    case globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      };
    case globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED:
      return {
        ...state,
        value: action.data,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
    case globalAutoCompleteSearchBarActionTypes.SUGGESTION_CLICKED:
      return {
        ...state,
        selectedSuggestion: action.data.selectedSuggestion,
        performPrepareVisualization: true,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
    case globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR:
      return {
        ...state,
        suggestions: [],
        cachedSuggestions: [],
        feedbackMsgText: action.data.errorMsg,
        feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
      };
    case globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT:
      return {
        ...state,
        suggestions: [],
        cachedSuggestions: [],
        feedbackMsgText: action.data.errorMsg,
        feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
      };
  }
  return state;
};
