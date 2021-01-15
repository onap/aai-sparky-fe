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
import keyMirror from 'utils/KeyMirror.js';

export const autoCompleteSearchBarActionTypes = keyMirror({
  SUGGESTION_FOUND: null,
  SUGGESTION_CHANGED: null,
  SUGGESTION_NOT_FOUND: null,
  CLEAR_SUGGESTIONS_TEXT_FIELD: null,
  CLEAR_SUGGESTIONS: null
});

export const NO_MATCHES_FOUND = 'No Matches Found';
export const SEARCH_PLACEHOLDER_TEXT = 'Search Network';
export const ERROR_INVALID_SEARCH_TERMS = 'Invalid search terms';
export const SEARCH_DEBOUNCE_TIME = 300;

export const ICON_CLASS_SEARCH = 'fa fa-search fa-lg';
export const ICON_CLASS_CLEAR = 'fa fa-times fa-lg';
export const ICON_CLASS_HELP = 'fa fa-question-circle fa-lg';
