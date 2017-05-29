/*
 * ============LICENSE_START=======================================================
 * SPARKY (AAI UI service)
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ================================================================================
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
 * ============LICENSE_END=========================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

import {expect, deep} from "chai";
import React from "react";
import {Provider} from "react-redux";
import sinon from "sinon";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {storeCreator} from "app/AppStore.js";
import {
	autoCompleteSearchBarActionTypes,
	TS_BACKEND_SEARCH_SELECTED_NODE_URL,
	ERROR_INVALID_SEARCH_TERMS,
	TIER_SUPPORT_NETWORK_ERROR
} from "app/tierSupport/autoCompleteSearchBar/AutoCompleteSearchBarConstants.js";
import {
	searchResultsFound,
	clearSuggestionsTextField,
	onSuggestionsChange,
	onSuggestionsClearRequested,
	getInvalidSearchInputEvent,
	fetchRequestedValues,
	fetchSelectedNodeElement,
	queryRequestedValues
} from "app/tierSupport/autoCompleteSearchBar/AutoCompleteSearchBarActions.js";
import {tierSupportActionTypes, TSUI_SEARCH_URL} from "app/tierSupport/TierSupportConstants.js";
import {TABLE_DATA} from "app/tierSupport/selectedNodeDetails/SelectedNodeDetailsConstants.js";
import {getDynamicTSUISearchURL} from "app/tierSupport/TierSupportActions.js";
import * as networkCall from "app/networking/NetworkCalls.js";
import {POST,
	POST_HEADER,
	ERROR_RETRIEVING_DATA} from "app/networking/NetworkConstants.js";
import autoCompleteSearchBarTestConstants from "./autoCompleteSearchBarTestConstants";

const middlewares = [thunk]; // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares);


describe('Core AutoCompleteSearchBar suite', function() {

	describe('AutoCompleteSearchBar - Actions test ', function() {

		function createState(currentScreen, tierSupport) {
			return {
				currentScreen: currentScreen,
				tierSupport: tierSupport
			};
		}

		it('Expect CLEAR_SUGGESTIONS_TEXT_FIELD action being passed When clearSuggestionsTextField is dispatched.', function(){
			const store = mockStore({});
			function clearSuggestionsTextFieldSuccess() {
				return {
					type: autoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD
				}
			}

			store.dispatch(clearSuggestionsTextField());
			expect(store.getActions()[0]).to.deep.equal(clearSuggestionsTextFieldSuccess());
		});

		it('Expect CLEAR_SUGGESTIONS action being passed When onSuggestionsClearRequested is dispatched.', function() {
			const store = mockStore({});
			function onSuggestionsClearRequestedSuccess() {
				return {
					type: autoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS
				}
			}

			store.dispatch(onSuggestionsClearRequested());
			expect(store.getActions()[0]).to.deep.equal(onSuggestionsClearRequestedSuccess());

		});

		it('Expect TS_NODE_SEARCH_INVALID_TERMS action being passed When getInvalidSearchInputEvent is dispatched.', function(){
			const store = mockStore({});
			const value = 'test';

			function onGetInvalidSearchInputEvent(){
				return{
					type: tierSupportActionTypes.TS_NODE_SEARCH_INVALID_TERMS,
					data: {value: value, errorMsg: ERROR_INVALID_SEARCH_TERMS}
				}
			}

			store.dispatch(getInvalidSearchInputEvent(value));
			expect(store.getActions()[0]).to.deep.equal(onGetInvalidSearchInputEvent());

		});

	});

	it('Expect SUGGESTION_CHANGED action being passed When onSuggestionsChangeSuccess is dispatched with tab key.', function() {
		const store = mockStore({});
		const value = 'test';

		function onSuggestionsChangeSuccess() {
			return {
				type: autoCompleteSearchBarActionTypes.SUGGESTION_CHANGED,
				data: value
			}
		}

		var event = {
			keyCode: 9
		};

		store.dispatch(onSuggestionsChange(event, value));
		expect(store.getActions()[0]).to.deep.equal(onSuggestionsChangeSuccess());

	});

	it('Expect SUGGESTION_CHANGED action being passed When onSuggestionsChange is dispatched with enter key.', function() {
		const store = mockStore({});
		const value = 'test';

		function onSuggestionsChangeSucessfull() {
			return {type: autoCompleteSearchBarActionTypes.SUGGESTION_CHANGED, data: value};
		}

		var event = {
			keyCode: 13
		};

		store.dispatch(onSuggestionsChange(event, value));
		expect(store.getActions()[0]).to.deep.equal(onSuggestionsChangeSucessfull());
	});

	it('Expect fetchRequest being called once and SUGGESTION_FOUND action being when passed fetchRequestedValues is dispatched, and a valid response is sent in mock', done => {
		const store = mockStore({});
		const value = 'test';

		let mockNetwork = sinon.mock(networkCall);
		mockNetwork.expects('fetchRequest').once().withArgs(TSUI_SEARCH_URL, POST, POST_HEADER, value).returns(Promise.resolve(autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1));
		store.dispatch(fetchRequestedValues(() => networkCall.fetchRequest(TSUI_SEARCH_URL, POST, POST_HEADER, value)));
		mockNetwork.verify();
		mockNetwork.restore();

		function onCreateSuggestionFoundEvent() {
			return {
				type: autoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
				data: {suggestions : autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits }
			};
		}

		setTimeout(() => expect(store.getActions()[0]).to.deep.equal(onCreateSuggestionFoundEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
		setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);


	});

	it('Expect fetchRequest being called once and SUGGESTION_NOT_FOUND action being when passed fetchRequestedValues is dispatched, and a valid response with no hits is sent in mock', done => {
		const store = mockStore({});
		const value = 'test';

		let mockNetwork = sinon.mock(networkCall);
		mockNetwork.expects('fetchRequest').once().withArgs(TSUI_SEARCH_URL, POST, POST_HEADER, value).returns(Promise.resolve(autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithOutHits));
		store.dispatch(fetchRequestedValues(() => networkCall.fetchRequest(TSUI_SEARCH_URL, POST, POST_HEADER, value)));
		mockNetwork.verify();
		mockNetwork.restore();
		function onCreateSuggestionNotFoundEvent() {
			return {
				type: autoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND
			};
		}

		setTimeout(() => expect(store.getActions()[0]).to.deep.equal(onCreateSuggestionNotFoundEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
		setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
	});

	it('Expect fetchRequest being called once and TIER_SUPPORT_NETWORK_ERROR action being when passed fetchRequestedValues is dispatched, and network error is sent in mock', done => {
		const store = mockStore({});
		const value = 'test';

		let mockNetwork = sinon.mock(networkCall);
		mockNetwork.expects('fetchRequest').once().withArgs(TSUI_SEARCH_URL, POST, POST_HEADER, value).returns(Promise.resolve(autoCompleteSearchBarTestConstants.networkError));
		store.dispatch(fetchRequestedValues(() => networkCall.fetchRequest(TSUI_SEARCH_URL, POST, POST_HEADER, value)));
		mockNetwork.verify();
		mockNetwork.restore();

		function onGetInvalidQueryEvent() {
			return {
				type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR,
				data: {value: value, errorMsg: ERROR_RETRIEVING_DATA}
			};
		}

		setTimeout(() => {
			expect(store.getActions()[0].type.toString()).to.equal(tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR.toString()), autoCompleteSearchBarTestConstants.mockRequestTimeOut
		});
		setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
	});

	it('Expect fetchRequest being called once and SUGGESTION_FOUND action being when passed queryRequestedValues is dispatched, and network error is sent in mock', done => {
		const store = mockStore({});
		const value = 'test';

		let mockNetwork = sinon.mock(networkCall);
		mockNetwork.expects('fetchRequest').once().withArgs(TSUI_SEARCH_URL, POST, POST_HEADER, value).returns(Promise.resolve(autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1));
		store.dispatch(fetchRequestedValues(() => networkCall.fetchRequest(TSUI_SEARCH_URL, POST, POST_HEADER, value)));
		mockNetwork.verify();
		mockNetwork.restore();

		function onCreateSuggestionFoundEvent() {
			return {
				type: autoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
				data: {suggestions : autoCompleteSearchBarTestConstants.validResponseJsonForRequestFromFetchWithHitsType1.hits.hits }
			};
		}

		setTimeout(() => expect(store.getActions()[0]).to.deep.equal(onCreateSuggestionFoundEvent()), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
		setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
	});

	it('Expect TIER_SUPPORT_NETWORK_ERROR action being passed when clearSuggestionsTextField is dispatched with no mock, and network error is sent in mock', done => {
		const store = mockStore({});
		const value = 'test';

		store.dispatch(clearSuggestionsTextField());

		function onClearSuggestionsTextField() {
			return {type: autoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD};
		}

		setTimeout(() => expect(store.getActions()[0]).to.deep.equal(onClearSuggestionsTextField()), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
		setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
	});

	it('Expect CLEAR_SUGGESTIONS action being passed when onSuggestionsClearRequested is dispatched with no mock, and network error is sent in mock', done => {
		const store = mockStore({});
		const value = 'test';

		store.dispatch(onSuggestionsClearRequested());

		function onSuggestionsClearRequestedExpected() {
			return{type: autoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS};
		}

		setTimeout(() => expect(store.getActions()[0]).to.deep.equal(onSuggestionsClearRequestedExpected()), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
		setTimeout(() => done(), autoCompleteSearchBarTestConstants.mockRequestTimeOut);
	});
});
