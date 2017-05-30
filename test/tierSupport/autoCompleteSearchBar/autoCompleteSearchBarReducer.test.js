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

import {expect} from 'chai';
import React from 'react';
import {Provider} from 'react-redux';
import TestUtils from 'react-dom/lib/ReactTestUtils';
import {tierSupportActionTypes} from 'app/tierSupport/TierSupportConstants.js';
import reducer from 'app/tierSupport/autoCompleteSearchBar/AutoCompleteSearchBarReducer.js';
import {MESSAGE_LEVEL_WARNING, MESSAGE_LEVEL_DANGER} from 'utils/GlobalConstants.js';
import {
    autoCompleteSearchBarActionTypes,
    NO_MATCHES_FOUND,
    ERROR_INVALID_SEARCH_TERMS} from 'app/tierSupport/autoCompleteSearchBar/AutoCompleteSearchBarConstants.js';
import {
    ERROR_RETRIEVING_DATA} from 'app/networking/NetworkConstants.js';

describe('AutoCompleteSearchBar - Reducer test ', function() {

    const testSuggestionData = [
        {_source:{ entityType: 'vserver',searchTags:'testing'}},
        {_source:{ entityType: 'vserver',searchTags:'someTag'}},
        {_source:{ entityType: 'vserver',searchTags:'test2'}}];

    it('AutoCompleteSearchBar reducer - Suggestion not found', function() {
        const feedbackMsgText = '';
        const suggestions = [];
        const action = {type: autoCompleteSearchBarActionTypes.SUGGESTION_NOT_FOUND};
        const initialState = {
            suggestions: suggestions
        };

        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.have.deep.property('[0]._source.entityType', 'No Matches Found');
    });

    it('AutoCompleteSearchBar reducer - Suggestion found', function() {
        const feedbackMsgText = '';
        const action =
            {
                type: autoCompleteSearchBarActionTypes.SUGGESTION_FOUND,
                data: {
                    suggestions: testSuggestionData
                }
            };
        const initialState = {
            suggestions: []
        };

        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.have.deep.property('[0]._source.searchTags', 'testing');
        expect(newState.suggestions).to.have.deep.property('[1]._source.searchTags', 'someTag');
        expect(newState.suggestions).to.have.deep.property('[2]._source.searchTags', 'test2');
    });

    it('AutoCompleteSearchBar reducer - Clear Suggestion field', function() {
        const feedbackMsgText = '';
        const action = {type: autoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS_TEXT_FIELD, value: 'test'};
        const initialState = {
            suggestions: testSuggestionData
        };

        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.be.empty;
        expect(newState.value).to.equal('');
    });

    it('AutoCompleteSearchBar reducer - Clear Suggestions', function() {
        const feedbackMsgText = '';
        const action = {type: autoCompleteSearchBarActionTypes.CLEAR_SUGGESTIONS, value: 'test'};
        const initialState = {
            suggestions: testSuggestionData
        };

        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.be.empty;
    });

    it('AutoCompleteSearchBar reducer - Suggestions changed', function() {
        const feedbackMsgText = '';
        const action = {type: autoCompleteSearchBarActionTypes.SUGGESTION_CHANGED, value: 'test'};
        const initialState = {
            suggestions: testSuggestionData
        };

        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.have.deep.property('[0]._source.searchTags', 'testing');
        expect(newState.suggestions).to.have.deep.property('[1]._source.searchTags', 'someTag');
        expect(newState.suggestions).to.have.deep.property('[2]._source.searchTags', 'test2');
    });

    it('AutoCompleteSearchBar reducer - Network error', function() {
        const feedbackMsgText = '';
        const feedbackMsgSeverity = '';
        const action = {type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR, data: {value: 'test', errorMsg: ERROR_RETRIEVING_DATA}};
        const initialState = {
            suggestions: testSuggestionData
        };

        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.be.empty;
        expect(newState.feedbackMsgText).to.equal(ERROR_RETRIEVING_DATA);
        expect(newState.feedbackMsgSeverity).to.equal(MESSAGE_LEVEL_DANGER);
    });

    it('AutoCompleteSearchBar reducer - TS_NODE_SEARCH_INVALID_TERMS', function(){
        const feedbackMsgText = ERROR_INVALID_SEARCH_TERMS;
        const action = {type: tierSupportActionTypes.TS_NODE_SEARCH_INVALID_TERMS, data: {value: 'test', errorMsg: ERROR_INVALID_SEARCH_TERMS}};
        const initialState = {
            suggestions: testSuggestionData
        };
        const newState = reducer(initialState, action);
        expect(newState.suggestions).to.be.empty;
        expect(newState.cachedSuggestions).to.be.empty;
        expect(newState.feedbackMsgText).to.equal(ERROR_INVALID_SEARCH_TERMS);
        expect(newState.feedbackMsgSeverity).to.equal(MESSAGE_LEVEL_WARNING);
    });

});
