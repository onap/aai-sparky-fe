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

export const filterBarActionTypes = keyMirror({
  SET_FILTERS: null,
  SET_FILTER_VALUES: null,
  CLEAR_FILTERS: null,
  FILTER_VALUE_CHANGE: null,
  NEW_SELECTIONS: null,
  SET_NON_CONVERTED_VALUES: null,
  SET_CONVERTED_VALUES: null,
  SET_UNIFIED_VALUES: null
});

export const UNIFIED_FILTERS_URL = BASE_URL + '/rest/search/unifiedFilterRequest';

export const DISCOVER_FILTERS_ERROR_MSG = 'There was an error retrieving the' +
  ' list of available filters';

export const FILTER_BAR_TITLE = 'FILTER BY';
export const DATE_TIME_ZONE = 'Z';

export const FILTER_TYPE_ENUM = {
  LIST: 'dropDown',
  DATE: 'date'
};

export const FILTER_ATTRIBUTE_DEFAULT_VALUE = 'defaultValue';
export const FILTER_ATTRIBUTE_CONTROLS = 'controls';
export const FILTER_ATTRIBUTE_CODE = 'code';
export const FILTER_ATTRIBUTE_VALUES = 'values';
export const FILTER_ATTRIBUTE_TO = 'to';
export const FILTER_ATTRIBUTE_FROM = 'from';
