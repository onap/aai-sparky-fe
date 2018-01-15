/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017 Amdocs
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
 *
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */


import keyMirror from 'utils/KeyMirror.js';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

export const contextHandlerActionTypes = keyMirror({
  SINGLE_SUGGESTION_FOUND: null,
  INVALID_SUGGESTION_FOUND: null,
  SUBSCRIPTION_PAYLOAD_EMPTY: null,
  SUBSCRIPTION_PAYLOAD_FOUND: null
});

export const EXTERNAL_REQ_ENTITY_SEARCH_URL = BASE_URL + '/rest/search/externalRequestEntitySearch';
export const WRONG_EXTERNAL_REQUEST_MESSAGE = 'A parameter in the request is incorrect';
export const WRONG_RESULT = 'Invalid result for the request.';
export const FAILED_REQUEST = 'Failed to pull result for the request.';
export const ZERO_RESULT = 'No result has been found for this request.';
export const MULTIPLE_RESULT = 'Multiple results were found for this request so none got selected.';
export const SUBSCRIPTION_FAILED_MESSAGE = 'Failed to fetch subscription payload.';
export const SUBSCRIPTION_PAYLOAD_URL = BASE_URL + '/subscription/getsubscription';





