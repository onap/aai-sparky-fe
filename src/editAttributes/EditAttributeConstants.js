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
import {
  BASE_URL
} from './networking/NetworkConstants.js';

export const SET_ATTRIBUTE_TITLE = 'A&AI';
export const ATTRIBUTE_MODIFICATION = 'ATTRIBUTE MODIFICATION';



export const EDIT_ENTITY_ATTRIBUTES_URL = BASE_URL + '/editEntity/editAttributes';

export const RESPONSE_CODE_SUCCESS = 200;
export const RESPONSE_CODE_NOT_AUTHORIZED = 403;

export const RESPONSE_MESSAGE_SUCCESS = 'Success';
export const RESPONSE_MESSAGE_NOT_AUTHORIZED = 'User not authorized';
export const RESPONSE_MESSAGE_FAILURE = 'Failed to update entity';
export const RESPONSE_MESSAGE_NETWORK_ERROR = 'Network error';

export const setAttributesActionTypes = keyMirror({
  SET_ATTRIBUTE_ERROR: null,
  SET_ATTRIBUTE_SUCCESS: null,
  CLEAR_FEEDBACK_MESSAGE: null
});
