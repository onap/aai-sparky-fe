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

export const dateRangeActionTypes = keyMirror({
  DATE_RANGE_CHANGE: null,
  INVALID_DATE_RANGE: null
});

export const LABEL_START_DATE = 'Start Date';
export const LABEL_END_DATE = 'End Date';
export const DATE_PICKER_PLACEHOLDER = 'MM/DD/YYYY';
export const START_DATE = 'Start date';
export const END_DATE = 'End date';

export const IS_AFTER_END_DATE = 'is after end date';
export const IS_BEFORE_START_DATE = 'is before start date';
