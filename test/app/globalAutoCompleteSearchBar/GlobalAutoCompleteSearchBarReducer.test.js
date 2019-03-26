import i18n from 'utils/i18n/i18n';
import GlobalAutoCompleteSearchBarReducer from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarReducer.js';
import {
  globalAutoCompleteSearchBarActionTypes,
  NO_MATCHES_FOUND
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';
import {
  MESSAGE_LEVEL_WARNING,
  MESSAGE_LEVEL_DANGER
} from 'utils/GlobalConstants.js';

describe('GlobalAutoCompleteSearchBarReducerTests', () => {
  it('Action Type: SUGGESTION_FOUND', () => {
    const suggestions = [
      {
        entityType: 'some entity type',
        value: 'selected value'
      },
      {
        entityType: 'some entity type',
        value: 'other selected value'
      }
    ];
    const errMsg = 'some error message';
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
      data: {
        suggestions: suggestions,
        errorMsg: errMsg
      }
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      suggestions: suggestions,
      cachedSuggestions: suggestions,
      feedbackMsgText: errMsg,
      feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
    });
  });

  it('Action Type: SUGGESTION_NOT_FOUND', () => {
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND,
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      suggestions: [{ text: i18n(NO_MATCHES_FOUND)}],
      cachedSuggestions: [{ entityType: i18n(NO_MATCHES_FOUND)}],
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: CLEAR_SUGGESTIONS_TEXT_FIELD', () => {
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD,
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      suggestions: [],
      cachedSuggestions: [],
      value: '',
      feedbackMsgText: '',
      feedbackMsgSeverity: '',
      clearSearchText: false
    });
  });

  it('Action Type: CLEAR_SUGGESTIONS', () => {
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS,
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      suggestions: []
    });
  });

  it('Action Type: SUGGESTION_CHANGED', () => {
    const suggestionText = 'some suggestion text';
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
      data: suggestionText
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      value: suggestionText,
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: SUGGESTION_CLICKED', () => {
    const suggestion = {
      entityType: 'some entity type',
      value: 'selected value'
    };
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CLICKED,
      data: {
        selectedSuggestion: suggestion
      }
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      selectedSuggestion: suggestion,
      performPrepareVisualization: true,
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: NETWORK_ERROR', () => {
    const errMsg = 'some error message';
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR,
      data: {
        errorMsg: errMsg
      }
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      suggestions: [],
      cachedSuggestions: [],
      feedbackMsgText: errMsg,
      feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
    });
  });

  it('Action Type: SEARCH_WARNING_EVENT', () => {
    const errMsg = 'some error message';
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT,
      data: {
        errorMsg: errMsg
      }
    };
    let state = {};
    state = GlobalAutoCompleteSearchBarReducer(state, action);
    expect(state).toEqual({
      suggestions: [],
      cachedSuggestions: [],
      feedbackMsgText: errMsg,
      feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
    });
  });
})
