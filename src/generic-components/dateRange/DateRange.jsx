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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import DatePicker from 'react-datepicker';
import Moment from 'moment-timezone';
import i18n from 'utils/i18n/i18n';
import {
  LABEL_START_DATE,
  LABEL_END_DATE,
  DATE_PICKER_PLACEHOLDER
} from 'generic-components/dateRange/DateRangeConstants';
import DateRangeActions from 'generic-components/dateRange/DateRangeActions';

let mapStateToProps = ({dataIntegrity: {dateRangeData}}) => {
  let {dateRangeStart, dateRangeEnd, dateRangeError} = dateRangeData;

  return {
    dateRangeStart,
    dateRangeEnd,
    dateRangeError
  };
};

let mapActionToProps = (dispatch) => {
  return {
    startDateChange: (startDate, endDate) => {
      dispatch(DateRangeActions.onStartDateChange(startDate, endDate));
    },
    endDateChange: (endDate, startDate) => {
      dispatch(DateRangeActions.onEndDateChange(startDate, endDate));
    }
  };
};

export class DateRange extends Component {
  static propTypes = {
    dateRangeStart: React.PropTypes.instanceOf(Moment),
    dateRangeEnd: React.PropTypes.instanceOf(Moment),
    dateRangeError: React.PropTypes.string
  };

  render() {
    let {startDateChange, endDateChange,
          dateRangeStart, dateRangeEnd} = this.props;

    return (
      <div className='date-range'>
    <span className='date-input'>
     <label>{i18n(LABEL_START_DATE) }: </label>
     <DatePicker
       className='start-date-picker'
       selected={dateRangeStart}
       onChange={(dateValue) => startDateChange(dateValue, dateRangeEnd) }
       placeholderText={i18n(DATE_PICKER_PLACEHOLDER) }
       showYearDropdown/>
    </span>
    <span className='date-input'>
     <label>{i18n(LABEL_END_DATE) }: </label>
     <DatePicker
       className='end-date-picker'
       selected={dateRangeEnd}
       onChange={(dateValue) => endDateChange(dateValue, dateRangeStart) }
       placeholderText={i18n(DATE_PICKER_PLACEHOLDER) }
       showYearDropdown/>
    </span>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(DateRange);
