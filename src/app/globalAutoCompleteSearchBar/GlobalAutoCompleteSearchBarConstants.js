/*
 * ============LICENSE_START===================================================
 * SPARKY (AAI UI service)
 * ============================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ============================================================================
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
 * ============LICENSE_END=====================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */


import keyMirror from 'utils/KeyMirror.js';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

export const globalAutoCompleteSearchBarActionTypes = keyMirror({
  SUGGESTION_FOUND: null,
  SUGGESTION_CHANGED: null,
  SUGGESTION_NOT_FOUND: null,
  CLEAR_SUGGESTIONS_TEXT_FIELD: null,
  CLEAR_SUGGESTIONS: null,
  SUGGESTION_CLICKED: null,
  NETWORK_ERROR: null,
  SEARCH_WARNING_EVENT: null,
  SEARCH_INVALID_TERMS: null
});

export const GLOBAL_SEARCH_URL = BASE_URL + '/rest/search/querysearch/';

export const NO_MATCHES_FOUND = 'No Matches Found';
export const ERROR_INVALID_SEARCH_TERMS = 'Invalid search terms';
export const SEARCH_DEBOUNCE_TIME = 300;

export const ICON_CLASS_SEARCH = 'fa fa-search fa-lg';
export const ICON_CLASS_CLEAR = 'fa fa-times fa-lg';
export const SEARCH_SELECTED_NODE_PATH = '/visualization/prepareVisualization';



