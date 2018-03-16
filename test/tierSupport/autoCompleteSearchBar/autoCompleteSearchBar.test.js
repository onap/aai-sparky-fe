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
import {expect, deep} from 'chai';
import React from 'react';
import {Provider} from 'react-redux';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {storeCreator} from 'app/AppStore.js';
import TestUtils from 'react-dom/test-utils';
import {
	autoCompleteSearchBarActionTypes,
	ERROR_INVALID_SEARCH_TERMS,
	TS_BACKEND_SEARCH_SELECTED_NODE_URL,
	NO_MATCHES_FOUND
} from 'generic-components/autoCompleteSearchBar/AutoCompleteSearchBarConstants.js';
import {AutoCompleteSearchBar} from 'generic-components/autoCompleteSearchBar/AutoCompleteSearchBar.jsx';
import {ERROR_RETRIEVING_DATA, POST, POST_HEADER} from 'app/networking/NetworkConstants.js';
import {tierSupportActionTypes, TSUI_SEARCH_URL} from 'app/tierSupport/TierSupportConstants.js';

import {mount, shallow} from 'enzyme';
import i18n from 'utils/i18n/i18n';
import {
	queryRequestedValues,
	clearSuggestionsTextField,
	onSuggestionsChange,
	onSuggestionsClearRequested,
	querySelectedNodeElement,
	getInvalidSearchInputEvent
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions.js';
import * as networkCall from 'app/networking/NetworkCalls.js';
import autoCompleteSearchBarTestConstants from './autoCompleteSearchBarTestConstants';

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);


describe('Core AutoCompleteSearchBar suite', function() {

  describe('AutoCompleteSearchBar - View test ', function() {
    let wrapper = undefined;

    beforeEach(() => {
      wrapper = mount(
				<AutoCompleteSearchBar
			onSuggestionsFetchRequested={() => {}}
			value=''
			suggestions={[]}
			cachedSuggestions={[]}
			feedbackMsgText=''
			feedbackMsgSeverity=''
				/>
			);
    });

    function createState(currentScreen, tierSupport) {
      return {
        currentScreen: currentScreen,
        tierSupport: tierSupport
      };
    }



    it('Test flow - test onNewSearch() success test: Expect tierSupportActionTypes.TS_NODE_SEARCH_RESULTS action being passed When the selected node is found in the main database and e', done => {
      const mStore = mockStore({});
      let mockNetwork = sinon.mock(networkCall);
      mockNetwork.expects('fetchRequest').once().withArgs(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword).returns(Promise.resolve(autoCompleteSearchBarTestConstants.validResponseJsonForNodeSearchFromFetchWithHits));
      let mockedNetworkFetchRequest = () => networkCall.fetchRequest(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword);
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeyword,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        cachedSuggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        onNewSearch: (searchRequestObject, value) => {
          if (Object.keys(searchRequestObject).length === 0) {
            mStore.dispatch(getInvalidSearchInputEvent(autoCompleteSearchBarTestConstants.nodeSearchKeyword));
          } else {
            mStore.dispatch(querySelectedNodeElement(searchRequestObject, autoCompleteSearchBarTestConstants.nodeSearchKeyword, mockedNetworkFetchRequest));
          }
        }

      });

      function onSucessfullNodeDetailsFoundEvent(){
        return {
          type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
          data: autoCompleteSearchBarTestConstants.validResponseJsonForNodeSearchFromFetchWithHits
        };
      }
      wrapper.find('.auto-complete-search-button').simulate('click');
      mockNetwork.verify();
      mockNetwork.restore();
      setTimeout(() => expect(mStore.getActions()[0]).to.deep.equal(onSucessfullNodeDetailsFoundEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
      setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
    });

    it('Test flow - test onNewSearch() failure test: Expect tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS action being passed When the selected node is not found in the main database and e', done => {

      const mStore = mockStore({});
      let mockNetwork = sinon.mock(networkCall);
      mockNetwork.expects('fetchRequest').once().withArgs(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword).returns(Promise.resolve(autoCompleteSearchBarTestConstants.inValidResponseJsonForNodeSearchFromFetchWithHits));
      let mockedNetworkFetchRequest = () => networkCall.fetchRequest(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword);
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeyword,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        cachedSuggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        onNewSearch: (searchRequestObject, value) => {
          if (Object.keys(searchRequestObject).length === 0) {
            mStore.dispatch(getInvalidSearchInputEvent(autoCompleteSearchBarTestConstants.nodeSearchKeyword));
          } else {
            mStore.dispatch(querySelectedNodeElement(searchRequestObject, autoCompleteSearchBarTestConstants.nodeSearchKeyword, mockedNetworkFetchRequest));
          }
        }

      });

      function onNofullNodeDetailsFoundEvent(){
        return {
          type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
          data: {searchTag: autoCompleteSearchBarTestConstants.nodeSearchKeyword}
        };
      }
      wrapper.find('.auto-complete-search-button').simulate('click');
      mockNetwork.verify();
      mockNetwork.restore();
      setTimeout(() => {
        expect(mStore.getActions()[0]).to.deep.equal(onNofullNodeDetailsFoundEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut;
      });
      setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
    });

    it('Test flow - test onNewSearch() failure: Expect tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR action being passed When Network fails', done => {
      const mStore = mockStore({});
      let mockNetwork = sinon.mock(networkCall);
      mockNetwork.expects('fetchRequest').once().withArgs(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword).returns(Promise.resolve(autoCompleteSearchBarTestConstants.networkError));
      let mockedNetworkFetchRequest = () => networkCall.fetchRequest(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword);
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeyword,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        cachedSuggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        onNewSearch: (searchRequestObject, value) => {
          if (Object.keys(searchRequestObject).length === 0) {
            mStore.dispatch(getInvalidSearchInputEvent(autoCompleteSearchBarTestConstants.nodeSearchKeyword));
          } else {
            mStore.dispatch(querySelectedNodeElement(searchRequestObject, autoCompleteSearchBarTestConstants.nodeSearchKeyword, mockedNetworkFetchRequest));
          }
        }

      });

      function onInvalidSelectedNodeSearchEvent(){
        return {
          type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR,
          data: {value: autoCompleteSearchBarTestConstants.nodeSearchKeyword, errorMsg: ERROR_RETRIEVING_DATA}
        };
      }
      wrapper.find('.auto-complete-search-button').simulate('click');
      mockNetwork.verify();
      mockNetwork.restore();
      setTimeout(() => {
        expect(mStore.getActions()[0]).to.deep.equal(onInvalidSelectedNodeSearchEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut;
      });
      setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
    });


    it('Test flow - test onNewSearch() failure: Expect tierSupportActionTypes.TS_NODE_SEARCH_INVALID_TERMS action being passed When no cached suggestions are found', done => {
      const mStore = mockStore({});
      let mockNetwork = sinon.mock(networkCall);
      mockNetwork.expects('fetchRequest').never().withArgs(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword).returns(Promise.resolve(autoCompleteSearchBarTestConstants.networkError));
      let mockedNetworkFetchRequest = () => networkCall.fetchRequest(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword);
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeyword,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        cachedSuggestions: [],
        onNewSearch: (searchRequestObject, value) => {
          if (Object.keys(searchRequestObject).length === 0) {
            mStore.dispatch(getInvalidSearchInputEvent(autoCompleteSearchBarTestConstants.nodeSearchKeyword));
          } else {
            mStore.dispatch(querySelectedNodeElement(searchRequestObject, autoCompleteSearchBarTestConstants.nodeSearchKeyword, mockedNetworkFetchRequest));
          }
        }

      });

      function onInvalidSearchInputEvent(){
        return {
          type: tierSupportActionTypes.TS_NODE_SEARCH_INVALID_TERMS,
          data: {value: autoCompleteSearchBarTestConstants.nodeSearchKeyword, errorMsg: ERROR_INVALID_SEARCH_TERMS}
        };
      }
      wrapper.find('.auto-complete-search-button').simulate('click');
      mockNetwork.verify();
      mockNetwork.restore();
      setTimeout(() => {
        expect(mStore.getActions()[0]).to.deep.equal(onInvalidSearchInputEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut;
      });
      setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
    });

    it('Test flow - test onNewSearch() failure: Expect no matches found When no cached suggestions does not have the node searched for', done => {
      const mStore = mockStore({});
      let mockNetwork = sinon.mock(networkCall);
      mockNetwork.expects('fetchRequest').never().withArgs(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword).returns(Promise.resolve(autoCompleteSearchBarTestConstants.networkError));
      let mockedNetworkFetchRequest = () => networkCall.fetchRequest(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword);
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeyword,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        cachedSuggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType2.hits.hits,
        onNewSearch: (searchRequestObject, value) => {
          if (Object.keys(searchRequestObject).length === 0) {
            mStore.dispatch(getInvalidSearchInputEvent(autoCompleteSearchBarTestConstants.nodeSearchKeyword));
          } else {
            mStore.dispatch(querySelectedNodeElement(searchRequestObject, autoCompleteSearchBarTestConstants.nodeSearchKeyword, mockedNetworkFetchRequest));
          }
        }

      });

      function onInvalidSearchInputEvent(){
        return {
          type: tierSupportActionTypes.TS_NODE_SEARCH_INVALID_TERMS,
          data: {value: autoCompleteSearchBarTestConstants.nodeSearchKeyword, errorMsg: ERROR_INVALID_SEARCH_TERMS}
        };
      }
      wrapper.find('.auto-complete-search-button').simulate('click');
      mockNetwork.verify();
      mockNetwork.restore();
      setTimeout(() => {
        expect(mStore.getActions()[0]).to.deep.equal(onInvalidSearchInputEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut;
      });
      setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
    });

    it('Test flow - test onNewSearch() failure: Expect no node search When no matches are found in lookup search', done => {
      const mStore = mockStore({});
      let mockNetwork = sinon.mock(networkCall);
      mockNetwork.expects('fetchRequest').never().withArgs(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword).returns(Promise.resolve(autoCompleteSearchBarTestConstants.networkError));
      let mockedNetworkFetchRequest = () => networkCall.fetchRequest(TS_BACKEND_SEARCH_SELECTED_NODE_URL, POST, POST_HEADER, autoCompleteSearchBarTestConstants.nodeSearchKeyword);
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.multipleNodeSearchKeyword,
        suggestions: [{_source:{ entityType:i18n(NO_MATCHES_FOUND),searchTags:''}}],
        cachedSuggestions: [{_source:{ entityType:i18n(NO_MATCHES_FOUND),searchTags:''}}],
        onNewSearch: (searchRequestObject, value) => {
          if (Object.keys(searchRequestObject).length === 0) {
            mStore.dispatch(getInvalidSearchInputEvent(autoCompleteSearchBarTestConstants.nodeSearchKeyword));
          } else {
            mStore.dispatch(querySelectedNodeElement(searchRequestObject, autoCompleteSearchBarTestConstants.nodeSearchKeyword, mockedNetworkFetchRequest));
          }
        }

      });

      function onInvalidSearchInputEvent(){
        return {
          type: tierSupportActionTypes.TS_NODE_SEARCH_INVALID_TERMS,
          data: {value: autoCompleteSearchBarTestConstants.nodeSearchKeyword, errorMsg: ERROR_INVALID_SEARCH_TERMS}
        };

      }
      wrapper.find('.react-autosuggest__input').simulate('focus');
      wrapper.find('.auto-complete-search-button').simulate('click');
      mockNetwork.verify();
      mockNetwork.restore();
      setTimeout(() => {
        expect(mStore.getActions()[0]).to.deep.equal(onInvalidSearchInputEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut;
      });
      setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
    });

    it('Expect the list to be populated when a the auto suggest input box is focused', function() {
      const mStore = mockStore({});
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeywordWithOutEqualSign,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,
        cachedSuggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits,

      });
      wrapper.find('.react-autosuggest__input').simulate('focus');
      expect(wrapper.find('Item').children()).to.have.length(6);
    });

    it('Expect small list to be populated when a the auto suggest input box is focused', function() {
      const mStore = mockStore({});
      wrapper.setProps({
        value: autoCompleteSearchBarTestConstants.nodeSearchKeyword,
        suggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType2.hits.hits,
        cachedSuggestions: autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType2.hits.hits,

      });
      wrapper.find('.react-autosuggest__input').simulate('focus');
      expect(wrapper.find('Item').children()).to.have.length(3);
    });
  });
});
