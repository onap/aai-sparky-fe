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

export const dateRangeSelectorActionTypes = keyMirror({
  EVENT_PERIOD_CHANGE: null,
  EVENT_PERIOD_ERROR: null,
});

// labels
export const LABEL_TODAY = 'Today';
export const LABEL_YESTERDAY = 'Since Yesterday';
export const LABEL_LAST_WEEK = 'Since Last Week';
export const LABEL_LAST_MONTH = 'Since Last Month';
export const LABEL_CUSTOM_SEARCH = 'Custom';
export const SEARCH_BUTTON_TEXT = 'Search';

// Periods
export const TODAY = 'today';
export const YESTERDAY = 'yesterday';
export const LAST_WEEK = 'lastWeek';
export const LAST_MONTH = 'lastMonth';
export const CUSTOM = 'custom';

// classes
export const ICON_CLASS_CALENDAR = 'fa fa-calendar fa-lg';
export const ICON_CLASS_DOWN_CARET = 'fa fa-caret-down fa-lg';

// errors
export const ERROR_UNKNOWN_PERIOD = 'The specified period is unknown';
