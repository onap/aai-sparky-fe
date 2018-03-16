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
import {FilterBarConstants} from 'filter-bar-utils';

import {BASE_URL} from 'app/networking/NetworkConstants.js';
import keyMirror from 'utils/KeyMirror.js';

// Message Levels
export const MESSAGE_LEVEL_SUCCESS = 'success';
export const MESSAGE_LEVEL_WARNING = 'warning';
export const MESSAGE_LEVEL_DANGER = 'danger';

export const COLOR_BLUE = '#009fdb';

// HTTP Status Codes
export const STATUS_CODE_1XX_INFORMATIONAL = 100;
export const STATUS_CODE_2XX_SUCCESS = 200;
export const STATUS_CODE_204_NO_CONTENT = 204;
export const STATUS_CODE_3XX_REDIRECTION = 300;
export const STATUS_CODE_4XX_CLIENT_ERROR = 400;
export const STATUS_CODE_5XX_SERVER_ERROR = 500;

export const filterBarActionTypes = keyMirror(FilterBarConstants.FILTER_BAR_ACTION_TYPES);

export const UNIFIED_FILTERS_URL = BASE_URL + '/rest/search/unifiedFilterRequest';