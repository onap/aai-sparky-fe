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
import {getTSUIElasticSearchQueryString} from 'app/networking/NetworkUtil.js';
import networkCall from 'app/networking/NetworkCalls.js';
import {
  POST,
  POST_HEADER,
  ERROR_RETRIEVING_DATA
} from 'app/networking/NetworkConstants.js';

import {
  globalAutoCompleteSearchBarActionTypes,
  ERROR_INVALID_SEARCH_TERMS,
  GLOBAL_SEARCH_URL
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';


function createSuggestionFoundEvent({suggestions}) {
  return {
    type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
    data: {suggestions}
  };
}

function createSuggestionNotFoundEvent() {
  return {
    type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND
  };
}

function createSuggestionChangedEvent(value) {
  return {
    type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
    data: value
  };
}

function getInvalidQueryEvent(value) {
  return {
    type: globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR,
    data: {value: value, errorMsg: ERROR_RETRIEVING_DATA}
  };
}

function getSearchBarWarningMessageEvent(message) {
  return {
    type: globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT,
    data: {errorMsg: message}
  };
}
export function getInvalidSearchInputEvent(value) {
  return getSearchBarWarningMessageEvent(
    ERROR_INVALID_SEARCH_TERMS + ': ' + value);
}


function fetchView(selectedSuggestion) {
  return {
    type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CLICKED,
    data: {selectedSuggestion: selectedSuggestion}
  };
}


export function populateView(
  searchRequestObject, keyWord, selectedNodeFetchRequest) {
  return dispatch => {
    dispatch(fetchView(searchRequestObject));
  };
}


export function fetchRequestedValues(fetchRequestCallback, keyWord) {
  return dispatch => {
    return fetchRequestCallback().then(
      (responseJson) => responseJson.suggestions
    ).then(
      (filteredResults)=> {
        if (filteredResults.length > 0) {
          dispatch(createSuggestionFoundEvent({suggestions: filteredResults}));
        } else {
          dispatch(createSuggestionNotFoundEvent());
        }
      }
    ).catch(
      () => {
        dispatch(getInvalidQueryEvent(keyWord));
      }
    );
  };
}

export function queryRequestedValues(keyWord, requestedFetchRequest) {
  if (requestedFetchRequest === undefined) {
    let postBody = JSON.stringify(getTSUIElasticSearchQueryString(keyWord));
    requestedFetchRequest =
      () => networkCall.fetchRequest(GLOBAL_SEARCH_URL, POST, POST_HEADER,
        postBody);
  }
  return dispatch => {
    return dispatch(fetchRequestedValues(requestedFetchRequest, keyWord), keyWord);
  };
}

export function clearSuggestionsTextField() {
  return dispatch => {
    dispatch(
      {type: globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD});
  };
}

export function onSuggestionsChange(event, value) {
  return dispatch => {
    dispatch(createSuggestionChangedEvent(value));
    //Only fetch values if the enter key is used.
    if (event.keyCode === 13) {
      let postBody = JSON.stringify(getTSUIElasticSearchQueryString(value));
      return dispatch(fetchRequestedValues(
        () => networkCall.fetchRequest(GLOBAL_SEARCH_URL, POST, POST_HEADER,
          postBody), value));
    }
  };
}

export function onSuggestionsClearRequested() {
  return dispatch => {
    dispatch({type: globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS});
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
