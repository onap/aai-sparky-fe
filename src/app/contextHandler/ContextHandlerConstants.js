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

export const contextHandlerActionTypes = keyMirror({
  SINGLE_SUGGESTION_FOUND: null,
  INVALID_SUGGESTION_FOUND: null
});

export const EXTERNAL_REQ_ENTITY_SEARCH_URL = BASE_URL + '/rest/search/externalRequestEntitySearch';
export const WRONG_EXTERNAL_REQUEST_MESSAGE = 'External parameter request is incorrect';
export const WRONG_RESULT = 'Invalid result for the requested external params.';




