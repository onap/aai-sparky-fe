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
import moment from 'moment-timezone';

import Button from 'react-bootstrap/lib/Button.js';
import MenuItem from 'react-bootstrap/lib/MenuItem.js';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger.js';
import Popover from 'react-bootstrap/lib/Popover.js';

import DateRange from 'generic-components/dateRange/DateRange.jsx';
import {DATE_PICKER_PLACEHOLDER} from 'generic-components/dateRange/DateRangeConstants.js';
import DateRangeActions from 'generic-components/dateRange/DateRangeActions.js';
import {
  TODAY,
  YESTERDAY,
  LAST_WEEK,
  LAST_MONTH,
  CUSTOM,
  LABEL_TODAY,
  LABEL_YESTERDAY,
  LABEL_LAST_WEEK,
  LABEL_LAST_MONTH,
  LABEL_CUSTOM_SEARCH,
  SEARCH_BUTTON_TEXT,
  ICON_CLASS_CALENDAR,
  ICON_CLASS_DOWN_CARET
} from 'generic-components/dateRangeSelector/DateRangeSelectorConstants.js';
import DateRangeSelectorActions from 'generic-components/dateRangeSelector/DateRangeSelectorActions.js';
import InlineMessage from 'generic-components/InlineMessage/InlineMessage.jsx';

import i18n from 'utils/i18n/i18n';

let currentDayWithTimeZone = moment(new Date()).tz(moment.tz.guess());
let mapStateToProps = ({dataIntegrity: {dateRangeSelectorData}}) => {

  let {
        startDate = currentDayWithTimeZone,
        endDate = currentDayWithTimeZone,
        period = TODAY,
        periodErrText,
        periodErrSev
      } = dateRangeSelectorData;

  return {
    startDate,
    endDate,
    period,
    periodErrText,
    periodErrSev
  };
};

let mapActionToProps = (dispatch) => {
  return {
    onNewDateSelection: (startMoment, endMoment, period) => {
      let periodChangeAction = DateRangeSelectorActions.onPeriodChange(
        startMoment, endMoment, period);
      // notify all listeners that the period has changed
      dispatch(periodChangeAction);
      // update the DateRange component with the newly selected dates
      dispatch(DateRangeActions.onStartDateChange(
        periodChangeAction.data.dateRange.startDate,
        periodChangeAction.data.dateRange.endDate));
    }
  };
};

export class DateRangeSelector extends Component {
  static propTypes = {
    startDate: React.PropTypes.instanceOf(moment),
    endDate: React.PropTypes.instanceOf(moment),
    period: React.PropTypes.string,
    periodErrText: React.PropTypes.string,
    periodErrSev: React.PropTypes.string
  };

  newDateSelection(period) {
    this.props.onNewDateSelection(this.props.startDate, this.props.endDate,
      period);
    this.refs.dateRangePopover.hide();
  }

  componentDidMount() {
    let {startDate, endDate, period, onNewDateSelection} = this.props;
    // whenever the DateRangeSelector is first mounted, want it
    // initialized to today's date
    startDate = currentDayWithTimeZone;
    endDate = currentDayWithTimeZone;
    onNewDateSelection(startDate, endDate, period);
  }

  render() {
    let {period, periodErrSev, periodErrText} = this.props;
    let displayDateRange = (this.props.startDate).format(
        DATE_PICKER_PLACEHOLDER) + ' - ' +
      (this.props.endDate).format(DATE_PICKER_PLACEHOLDER);
    return (
      <div className='dateRangeSelector'>
        <OverlayTrigger trigger='click' ref='dateRangePopover'
                        placement='bottom' overlay={
     <Popover id='dateRangeSelectorPopover'>
      <MenuItem active={period === TODAY ? true : false} onSelect={() =>
       this.newDateSelection(TODAY)}>{i18n(LABEL_TODAY)}</MenuItem>
      <MenuItem active={period === YESTERDAY ? true : false} onSelect={() =>
       this.newDateSelection(YESTERDAY)}>{i18n(LABEL_YESTERDAY)}</MenuItem>
      <MenuItem active={period === LAST_WEEK ? true : false} onSelect={() =>
       this.newDateSelection(LAST_WEEK)}>{i18n(LABEL_LAST_WEEK)}</MenuItem>
      <MenuItem active={period === LAST_MONTH ? true : false} onSelect={() =>
       this.newDateSelection(LAST_MONTH)}>{i18n(LABEL_LAST_MONTH)}</MenuItem>
      <OverlayTrigger trigger='click' placement='right' overlay={
       <Popover id='customSearchPopover'>
        <InlineMessage level={periodErrSev} messageTxt={periodErrText} />
        <DateRange />
        <Button className='dateRangeSearchButton' bsSize='xsmall'
          bsStyle='primary'
          disabled={periodErrText !== '' ? true : false}
          onClick={() => this.newDateSelection(CUSTOM)}>
          {i18n(SEARCH_BUTTON_TEXT)}
        </Button>
       </Popover>
      }>
       <MenuItem active={period === CUSTOM ? true : false} >
          {i18n(LABEL_CUSTOM_SEARCH)}
       </MenuItem>
      </OverlayTrigger>
     </Popover>}>
          <Button className='dateRangeSelectorSearchButton' bsStyle='default'>
            <i className={ICON_CLASS_CALENDAR} aria-hidden='true'></i>
            <span>{displayDateRange} </span>
            <i className={ICON_CLASS_DOWN_CARET} aria-hidden='true'></i>
          </Button>
        </OverlayTrigger>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(DateRangeSelector);
