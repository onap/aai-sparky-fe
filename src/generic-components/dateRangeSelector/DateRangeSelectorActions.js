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

import {
  dateRangeSelectorActionTypes,
  ERROR_UNKNOWN_PERIOD,
  TODAY,
  YESTERDAY,
  LAST_WEEK,
  LAST_MONTH,
  CUSTOM
} from 'generic-components/dateRangeSelector/DateRangeSelectorConstants.js';

function buildPeriodChangeAction(startMoment, endMoment, period) {
  return {
    type: dateRangeSelectorActionTypes.EVENT_PERIOD_CHANGE,
    data: {
      dateRange: {
        startDate: startMoment,
        endDate: endMoment
      },
      period: period
    }
  };
}

function buildUnknownPeriodAction(startMoment, endMoment, period, errorMsg) {
  return {
    type: dateRangeSelectorActionTypes.EVENT_PERIOD_ERROR,
    data: {
      dateRange: {
        startDate: startMoment,
        endDate: endMoment
      },
      period: period,
      errorMsg: errorMsg
    }
  };
}

export default {
  onPeriodChange(startMoment, endMoment, period) {
    var moment = require('moment');
    let startPeriod = moment(new Date());
    let endPeriod = moment(new Date());
    let unknownPeriod = false;

    switch (period) {
      case TODAY:
        // already have today's date set
        break;
      case YESTERDAY:
        startPeriod = moment(startPeriod).subtract(1, 'days');
        break;
      case LAST_WEEK:
        startPeriod = moment(startPeriod).subtract(7, 'days');
        break;
      case LAST_MONTH:
        startPeriod = moment(startPeriod).subtract(1, 'months');
        break;
      case CUSTOM:
        startPeriod = startMoment;
        endPeriod = endMoment;
        break;
      default:
        unknownPeriod = true;
        break;
    }

    if (unknownPeriod) {
      let errorMsg = ERROR_UNKNOWN_PERIOD + ': ' + period;
      return buildUnknownPeriodAction(startMoment, endMoment, period, errorMsg);
    } else {
      /*
       Temp fix until we support time ...
       - set start date time to 00:00:00
       - set end date time to 23:59:59
       this is to ensure we cover an entire day
       (ex: start day May 26, end day May 26 ... expect to cover
          0:00:00 to 23:59:59 for that day)
       */
      startPeriod.toDate();
      startPeriod.hour(0);
      startPeriod.minute(0);
      startPeriod.second(0);

      endPeriod.toDate();
      endPeriod.hour(23);
      endPeriod.minute(59);
      endPeriod.second(59);

      return buildPeriodChangeAction(startPeriod, endPeriod, period);
    }

  }
};
