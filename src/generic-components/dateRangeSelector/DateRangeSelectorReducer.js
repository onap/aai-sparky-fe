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

import {dateRangeActionTypes} from 'generic-components/dateRange/DateRangeConstants.js';
import {dateRangeSelectorActionTypes} from 'generic-components/dateRangeSelector/DateRangeSelectorConstants.js';
import {MESSAGE_LEVEL_DANGER} from 'utils/GlobalConstants.js';

export default (state = {}, action) => {

  switch (action.type) {

    case dateRangeActionTypes.DATE_RANGE_CHANGE:
      return {
        ...state,
        startDate: action.data.dateRange.startDate,
        endDate: action.data.dateRange.endDate,
        periodErrText: '',
        periodErrSev: ''
      };

    case dateRangeActionTypes.INVALID_DATE_RANGE:
      return {
        ...state,
        startDate: action.data.dateRange.startDate,
        endDate: action.data.dateRange.endDate,
        periodErrText: action.data.errorMsg,
        periodErrSev: MESSAGE_LEVEL_DANGER
      };

    case dateRangeSelectorActionTypes.EVENT_PERIOD_CHANGE:
      return {
        ...state,
        startDate: action.data.dateRange.startDate,
        endDate: action.data.dateRange.endDate,
        period: action.data.period,
        periodErrText: '',
        periodErrSev: ''
      };
  }
  return state;
};
