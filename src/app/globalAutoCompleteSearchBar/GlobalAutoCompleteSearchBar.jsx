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
import {connect} from 'react-redux';
import React, {Component} from 'react';
import  AutoCompleteSearchBar from 'generic-components/autoCompleteSearchBar/AutoCompleteSearchBar.jsx';
import {postAnalyticsData} from 'app/analytics/AnalyticsActions.js';
import {getClearGlobalMessageEvent} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {
  queryRequestedValues,
  clearSuggestionsTextField,
  onSuggestionsChange,
  onSuggestionsClearRequested,
  getInvalidSearchInputEvent,
  setNotificationText
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions.js';

let mapActionToProps = (dispatch) => {
  return {
    onSuggestionsFetchRequested: ({value}) => dispatch(
      queryRequestedValues(value)),
    onClearSuggestionsTextFieldRequested: () => {
      dispatch(getClearGlobalMessageEvent());
      dispatch(clearSuggestionsTextField());
    },
    onInputChange: (event, {newValue}) => {
      dispatch(getClearGlobalMessageEvent());
      dispatch(onSuggestionsChange(event, newValue));
    },
    onSuggestionsClearRequested: () => dispatch(onSuggestionsClearRequested()),
    dispatchAnalytics: () => dispatch(
      postAnalyticsData(document.documentElement.outerHTML.replace('\s+', ''))),
    onInvalidSearch: (searchText) => {
      dispatch(getInvalidSearchInputEvent(searchText));
    },
    onMessageStateChange: (msgText, msgSeverity) => {
      dispatch(setNotificationText(msgText, msgSeverity));
    }
  };
};

let mapStateToProps = ({globalAutoCompleteSearchBarReducer}) => {
  let {
        value = '',
        suggestions = [],
        cachedSuggestions = [],
        suggestionName = 'text',
        clearSearchText = false,
        feedbackMsgText = '',
        feedbackMsgSeverity = ''
      } = globalAutoCompleteSearchBarReducer;
  
  return {
    value,
    suggestions,
    cachedSuggestions,
    suggestionName,
    clearSearchText,
    feedbackMsgText,
    feedbackMsgSeverity
  };
};

export class GlobalAutoCompleteSearchBar extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.clearSearchText) {
      this.props.onClearSuggestionsTextFieldRequested();
    }
    
    if (nextProps.feedbackMsgText !== this.props.feedbackMsgText) {
      this.props.onMessageStateChange(nextProps.feedbackMsgText,
        nextProps.feedbackMsgSeverity);
    }
  }
  
  render() {
    return (
      <AutoCompleteSearchBar {...this.props} />
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(
  GlobalAutoCompleteSearchBar);
