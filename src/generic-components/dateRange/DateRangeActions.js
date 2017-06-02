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

import i18n from 'utils/i18n/i18n';
import moment from 'moment';

import {
  dateRangeActionTypes,
  DATE_PICKER_PLACEHOLDER,
  START_DATE,
  END_DATE,
  IS_AFTER_END_DATE,
  IS_BEFORE_START_DATE
} from 'generic-components/dateRange/DateRangeConstants';

function buildInvalidDateRangeAction(startDate, endDate, errorMessage) {
  return {
    type: dateRangeActionTypes.INVALID_DATE_RANGE,
    data: {
      dateRange: {
        startDate: startDate,
        endDate: endDate
      },
      errorMsg: errorMessage
    }
  };
}

function buildDateRangeAction(startDate, endDate) {
  return {
    type: dateRangeActionTypes.DATE_RANGE_CHANGE,
    data: {
      dateRange: {
        startDate: startDate,
        endDate: endDate
      }
    }
  };
}

export default {
  onStartDateChange(startDate, endDate) {
    if (endDate && endDate.isBefore(startDate)) {
      var errorMessage = i18n(START_DATE) +
        ': ' +
        moment(new Date(startDate)).format(DATE_PICKER_PLACEHOLDER) +
        ' ' +
        i18n(IS_AFTER_END_DATE);
      return buildInvalidDateRangeAction(startDate, endDate, errorMessage);
    } else {
      return buildDateRangeAction(startDate, endDate);
    }
  },
  onEndDateChange(startDate, endDate) {
    if (startDate && startDate.isAfter(endDate)) {
      var errorMessage = i18n(END_DATE) +
        ': ' +
        moment(new Date(endDate)).format(DATE_PICKER_PLACEHOLDER) +
        ' ' +
        i18n(IS_BEFORE_START_DATE);
      return buildInvalidDateRangeAction(startDate, endDate, errorMessage);
    } else {
      return buildDateRangeAction(startDate, endDate);
    }
  }
};
