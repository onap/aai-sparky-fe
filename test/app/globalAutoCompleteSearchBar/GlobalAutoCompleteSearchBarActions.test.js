import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {globalAutoCompleteSearchBarActionTypes} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants';
import {globalInlineMessageBarActionTypes} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants';
import {
  getInvalidSearchInputEvent,
  populateView,
  fetchRequestedValues,
  queryRequestedValues,
  clearSuggestionsTextField,
  onSuggestionsChange,
  onSuggestionsClearRequested,
  setNotificationText
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions';
import {ERROR_RETRIEVING_DATA} from 'app/networking/NetworkConstants';
import * as networkUtil from 'app/networking/NetworkUtil';
import networkCall from 'app/networking/NetworkCalls';

const mockStore = configureMockStore([thunk]);

describe('globalAutoCompleteSearchBarActions', () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  describe('getInvalidSearchInputEvent', () => {
    it('emits SEARCH_WARNING_EVENT action with payload', () => {
      // Given
      const searchInput = "TestInput";
      const expectedErrorMsg = "Invalid search terms: " + searchInput;
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT,
          data: {errorMsg: expectedErrorMsg}
        }
      ];

      // When
      store.dispatch(getInvalidSearchInputEvent(searchInput));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('populateView', () => {
    it('emits SUGGESTION_CLICKED action with payload', () => {
      // Given
      const suggestions = "Suggestions";
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CLICKED,
          data: {selectedSuggestion: suggestions}
        }
      ];

      // When
      store.dispatch(populateView(suggestions, null, null));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('fetchRequestedValues', () => {
    const keyword = "KeyWord";

    it('emits SUGGESTION_FOUND action with payload when suggestions present and not empty', async () => {
      // Given
      const suggestions = "Suggestions";
      const promise = () => new Promise(function(resolve) {
        resolve({suggestions: suggestions});
      });
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
          data: {suggestions: suggestions}
        }
      ];

      // When
      await store.dispatch(fetchRequestedValues(promise, keyword));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });


    it('emits SUGGESTION_NOT_FOUND action when suggestions present but empty', async () => {
      // Given
      const promise = () => new Promise(function(resolve) {
        resolve({suggestions: {}});
      });
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND
        }
      ];

      // When
      await store.dispatch(fetchRequestedValues(promise, keyword));

      //Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits NETWORK_ERROR action with payload when suggestions not present', async () => {
      // Given
      const promise = () => new Promise(function(resolve) {
        resolve({});
      });
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR,
          data: {
            value: keyword,
            errorMsg: ERROR_RETRIEVING_DATA
          }
        }
      ];

      // When
      await store.dispatch(fetchRequestedValues(promise, keyword));

      //Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('queryRequestedValues', () => {
    const keyword = "KeyWord";

    it('emits SUGGESTION_FOUND action with payload when fetch request defined and suggestion found', async () => {
      // Given
      const suggestions = "Suggestions";
      const promise = () => new Promise(function(resolve) {
        resolve({suggestions: suggestions});
      });
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
          data: {suggestions: suggestions}
        }
      ];

      // When
      await store.dispatch(queryRequestedValues(keyword, promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits SUGGESTION_NOT_FOUND action when fetch request defined and suggestion not found', async () => {
      // Given
      const promise = () => new Promise(function(resolve) {
        resolve({suggestions: {}});
      });
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND
        }
      ];

      // When
      await store.dispatch(queryRequestedValues(keyword, promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits NETWORK_ERROR action with payload when fetch request defined and network error', async () => {
      // Given
      const promise = () => new Promise(function(resolve) {
        resolve({});
      });
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR,
          data: {
            value: keyword,
            errorMsg: ERROR_RETRIEVING_DATA
          }
        }
      ];

      // When
      await store.dispatch(queryRequestedValues(keyword, promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits SUGGESTION_FOUND action with payload when fetch request undefined and suggestion found ', async () => {
      // Given
      const suggestions = "Suggestions";
      const promise = new Promise(function(resolve) {
        resolve({suggestions: suggestions});
      });
      networkUtil.getTSUIElasticSearchQueryString = jest.fn();
      networkCall.fetchRequest = jest.fn(() => promise);
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
          data: {suggestions: suggestions}
        }
      ];

      // When
      await store.dispatch(queryRequestedValues(keyword, undefined));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits SUGGESTION_NOT_FOUND action when fetch request undefined and suggestion not found', async () => {
      // Given
      const promise = new Promise(function(resolve) {
        resolve({suggestions: {}});
      });
      networkUtil.getTSUIElasticSearchQueryString = jest.fn();
      networkCall.fetchRequest = jest.fn(() => promise);
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND
        }
      ];

      // When
      await store.dispatch(queryRequestedValues(keyword, undefined));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits NETWORK_ERROR action with payload when fetch request undefined and network error ', async () => {
      // Given
      const promise = new Promise(function(resolve) {
        resolve({});
      });
      networkUtil.getTSUIElasticSearchQueryString = jest.fn();
      networkCall.fetchRequest = jest.fn(() => promise);
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR,
          data: {
            value: keyword,
            errorMsg: ERROR_RETRIEVING_DATA
          }
        }
      ];

      // When
      await store.dispatch(queryRequestedValues(keyword, undefined));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('clearSuggestionsTextField', () => {
    it('emits CLEAR_SUGGESTIONS_TEXT_FIELD action', () => {
      // Given
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD,
        }
      ];

      // When
      store.dispatch(clearSuggestionsTextField());

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  describe('onSuggestionsChange', () => {
    const value = "value";
    const enterKeyCode = {keyCode: 13};

    it('emits only SUGGESTION_CHANGED action with payload when keyCode other than Enter Key', () => {
      // Given
      const notEnterKeyCode = {keyCode: 14};
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
          data: value
        }
      ];

      // When
      store.dispatch(onSuggestionsChange(notEnterKeyCode, value));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with payloads when Enter Key and suggestion found', async () => {
      // Given
      const suggestions = "Suggestions";
      const promise = new Promise(function(resolve) {
        resolve({suggestions: suggestions});
      });
      networkUtil.getTSUIElasticSearchQueryString = jest.fn();
      networkCall.fetchRequest = jest.fn(() => promise);
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
          data: value
        },
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
          data: {suggestions: suggestions}
        }
      ];

      // When
      await store.dispatch(onSuggestionsChange(enterKeyCode, value));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with payloads when Enter Key and suggestion not found', async () => {
      // Given
      const promise = new Promise(function(resolve) {
        resolve({suggestions: {}});
      });
      networkUtil.getTSUIElasticSearchQueryString = jest.fn();
      networkCall.fetchRequest = jest.fn(() => promise);
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
          data: value
        },
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND
        }
      ];

      // When
      await store.dispatch(onSuggestionsChange(enterKeyCode, value));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with payloads when Enter Key and network error', async () => {
      // Given
      const promise = new Promise(function(resolve) {
        resolve({});
      });
      networkUtil.getTSUIElasticSearchQueryString = jest.fn();
      networkCall.fetchRequest = jest.fn(() => promise);
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
          data: value
        },
        {
          type: globalAutoCompleteSearchBarActionTypes.NETWORK_ERROR,
          data: {
            value: value,
            errorMsg: ERROR_RETRIEVING_DATA
          }
        }
      ];

      // When
      await store.dispatch(onSuggestionsChange(enterKeyCode, value));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('onSuggestionsClearRequested', () => {
    it('emits CLEAR_SUGGESTIONS action', () => {
      // Given
      const expectedActions = [
        {
          type: globalAutoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS,
        }
      ];

      // When
      store.dispatch(onSuggestionsClearRequested());

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    })
  });

  describe('setNotificationText', () => {
    const msgSeverity = "msgSeverity";

    it('emits SET_GLOBAL_MESSAGE action with payload when msgText is not blank', () => {
      // Given
      const msgText = "msgText";
      const expectedActions = [
        {
          type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
          data: {
            msgText: msgText,
            msgSeverity: msgSeverity
          }
        }
      ];

      // When
      store.dispatch(setNotificationText(msgText, msgSeverity));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits CLEAR_GLOBAL_MESSAGE action when msgText is blank', () => {
      // Given
      const msgText = "";
      const expectedActions = [
        {
          type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
        }
      ];

      // When
      store.dispatch(setNotificationText(msgText, msgSeverity));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
