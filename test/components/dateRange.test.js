/*
 * ============LICENSE_START=======================================================
 * SPARKY (AAI UI service)
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ================================================================================
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
 * ============LICENSE_END=========================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

import React from 'react';
import TestUtils from 'react-dom/lib/ReactTestUtils';
import {Provider} from 'react-redux';
import {expect} from 'chai';
import i18n from 'utils/i18n/i18n';

import store from 'app/AppStore.js';
import DateRange from 'generic-components/dateRange/DateRange.jsx';
import {
	dateRangeActionTypes,
	LABEL_START_DATE,
	LABEL_END_DATE,
	DATE_PICKER_PLACEHOLDER,
	IS_AFTER_END_DATE,
	IS_BEFORE_START_DATE,
	END_DATE,
	START_DATE} from 'generic-components/dateRange/DateRangeConstants.js';
import DateRangeActions from 'generic-components/dateRange/DateRangeActions.js';
import reducer from 'generic-components/dateRange/DateRangeReducer.js';
import sinon from 'sinon';

import { moment } from 'moment';

describe('Core Date Range suite', function() {

  beforeEach(function() {
    this.component = TestUtils.renderIntoDocument(<Provider store={store}><DateRange /></Provider>);
  });

	// test structure
  it('Date Range - Validate start & end lables', function() {
    let labels = TestUtils.scryRenderedDOMComponentsWithTag(this.component, 'label');
    expect(labels.length).to.equal(2);
    expect(labels[0].textContent).to.equal(LABEL_START_DATE + ': ');
    expect(labels[1].textContent).to.equal(LABEL_END_DATE + ': ');
  });

  it('Date Range - Start Date Picker exists', function() {
    let datePicker = TestUtils.findRenderedDOMComponentWithClass(this.component, 'start-date-picker');
    expect(datePicker).to.exist;
    expect(datePicker.type).to.equal('text');
    expect(datePicker.placeholder).to.equal(DATE_PICKER_PLACEHOLDER);
  });

  it('Date Range - End Date Picker exists', function() {
    let datePicker = TestUtils.findRenderedDOMComponentWithClass(this.component, 'end-date-picker');
    expect(datePicker).to.exist;
    expect(datePicker.type).to.equal('text');
    expect(datePicker.placeholder).to.equal(DATE_PICKER_PLACEHOLDER);
  });

	// Reducer Tests
  it('Date Range Reducer ... set start date (no initial dates)', function() {
    var moment = require('moment');
    const initialState = {};
    const dateChangeAction = {type: dateRangeActionTypes.DATE_RANGE_CHANGE, data: {dateRange: {startDate: moment(new Date('05/04/2016'))}, errorMsg: ''}};
    const newState = reducer(initialState, dateChangeAction);
    expect(newState.dateRangeStart).to.exist;
    expect(newState.dateRangeStart.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
    expect(newState.dateRangeEnd).to.not.exist;
    expect(newState.dateRangeError).to.equal('');
  });
  it('Date Range Reducer ... update start date (no end date)', function() {
    var moment = require('moment');
    const initialStartDate = new Date('05/01/2016');
    const initialState = {dateRange: {startDate: moment(initialStartDate)}};
    const dateChangeAction = {type: dateRangeActionTypes.DATE_RANGE_CHANGE, data: {dateRange: {startDate: moment(new Date('05/04/2016'))}, errorMsg: ''}};
    const newState = reducer(initialState, dateChangeAction);
    expect(newState.dateRangeStart).to.exist;
    expect(newState.dateRangeStart.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
    expect(newState.dateRangeEnd).to.not.exist;
    expect(newState.dateRangeError).to.equal('');
  });
  it('Date Range Reducer - set end date (no start date)', function() {
    var moment = require('moment');
    const  initialState = {};
    const dateChangeAction = {type: dateRangeActionTypes.DATE_RANGE_CHANGE, data: {dateRange: {endDate: moment(new Date('05/04/2016'))}, errorMsg: ''}};
    const newState = reducer(initialState, dateChangeAction);
    expect(newState.dateRangeEnd).to.exist;
    expect(newState.dateRangeEnd.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
    expect(newState.dateRangeStart).to.not.exist;
    expect(newState.dateRangeError).to.equal('');
  });
  it('Date Range Reducer - update end date (no start date)', function() {
    var moment = require('moment');
    const initialEndDate = new Date('05/01/2016');
    const initialState = {dateRange: {endDate: moment(initialEndDate)}};
    const dateChangeAction = {type: dateRangeActionTypes.DATE_RANGE_CHANGE, data: {dateRange: {endDate: moment(new Date('05/04/2016'))}, errorMsg: ''}};
    const newState = reducer(initialState, dateChangeAction);
    expect(newState.dateRangeEnd).to.exist;
    expect(newState.dateRangeEnd.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
    expect(newState.dateRangeStart).to.not.exist;
    expect(newState.dateRangeError).to.equal('');
  });
  it('Date Range Reducer - set end date with initial start date', function() {
    var moment = require('moment');
    const initialStartDate = new Date('05/01/2016');
    const initialState = {dateRange: {startDate: moment(initialStartDate)}};
    const dateChangeAction = {type: dateRangeActionTypes.DATE_RANGE_CHANGE, data: {dateRange: {startDate: moment(new Date('05/01/2016')), endDate: moment(new Date('05/04/2016'))}, errorMsg: ''}};
    const newState = reducer(initialState, dateChangeAction);
    expect(newState.dateRangeStart).to.exist;
    expect(newState.dateRangeStart.toDate().getTime()).to.equal(new Date('05/01/2016').getTime());
    expect(newState.dateRangeEnd).to.exist;
    expect(newState.dateRangeEnd.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
    expect(newState.dateRangeError).to.equal('');
  });
  it('Date Range Reducer - set start date with initial end date', function() {
    var moment = require('moment');
    const initialEndDate = new Date('05/04/2016');
    const initialState = {dateRange: {endDate: moment(initialEndDate)}};
    const dateChangeAction = {type: dateRangeActionTypes.DATE_RANGE_CHANGE, data: {dateRange: {startDate: moment(new Date('05/01/2016')), endDate: moment(new Date('05/04/2016'))}, errorMsg: ''}};
    const newState = reducer(initialState, dateChangeAction);
    expect(newState.dateRangeStart).to.exist;
    expect(newState.dateRangeStart.toDate().getTime()).to.equal(new Date('05/01/2016').getTime());
    expect(newState.dateRangeEnd).to.exist;
    expect(newState.dateRangeEnd.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
    expect(newState.dateRangeError).to.equal('');
  });
  it('Date Range Reducer - verify INVALID_DATE_RANGE event', function() {
    var moment = require('moment');
    const errMsg = 'Some error message';
    const initialEndDate = new Date('05/01/2016');
    const initialStartDate = new Date('05/02/2016');
    const initialState = {startDate: moment(initialStartDate), endDate: moment(initialEndDate)};
    const invalidRangeAction = {type: dateRangeActionTypes.INVALID_DATE_RANGE, data: {dateRange: {startDate: moment(initialStartDate), endDate: moment(initialEndDate)}, errorMsg: errMsg}};
    const newState = reducer(initialState, invalidRangeAction);
    expect(newState.endDate.toDate().getTime()).to.equal(new Date('05/01/2016').getTime());
    expect(newState.startDate.toDate().getTime()).to.equal(new Date('05/02/2016').getTime());
    expect(newState.dateRangeError).to.equal(errMsg);
  });

	// test Actions
  it('Date Range Action - valid start date change', function() {
    var moment = require('moment');
    const startDate = moment(new Date('07/19/2016'));
    const endDate = moment(new Date('07/20/2016'));
    const expectedAction = {
      type: dateRangeActionTypes.DATE_RANGE_CHANGE,
      data: {
        dateRange: {
          startDate: startDate,
          endDate: endDate
        },
      }

    };
    const results = DateRangeActions.onStartDateChange(startDate, endDate);

    expect(results.type).to.equal(expectedAction.type);
    expect(results.data.dateRange.startDate).to.equal(expectedAction.data.dateRange.startDate);
    expect(results.data.dateRange.endDate).to.equal(expectedAction.data.dateRange.endDate);
  });
  it('Date Range Action - valid end date change', function() {
    var moment = require('moment');
    const startDate = moment(new Date('07/19/2016'));
    const endDate = moment(new Date('07/20/2016'));
    const expectedAction = {
      type: dateRangeActionTypes.DATE_RANGE_CHANGE,
      data: {
        dateRange: {
          startDate: startDate,
          endDate: endDate
        },
      }

    };
    const results = DateRangeActions.onEndDateChange(startDate, endDate);

    expect(results.type).to.equal(expectedAction.type);
    expect(results.data.dateRange.startDate).to.equal(expectedAction.data.dateRange.startDate);
    expect(results.data.dateRange.endDate).to.equal(expectedAction.data.dateRange.endDate);
  });
  it('Date Range Action - end date before start date', function() {
    var moment = require('moment');
    const startDate = moment(new Date('07/21/2016'));
    const endDate = moment(new Date('07/20/2016'));
    const errorMsg = i18n(END_DATE) + ': ' +
			moment(new Date(endDate)).format(DATE_PICKER_PLACEHOLDER) +
			' ' + i18n(IS_BEFORE_START_DATE);
    const expectedAction = {
      type: dateRangeActionTypes.INVALID_DATE_RANGE,
      data: {
        dateRange: {
          startDate: startDate,
          endDate: endDate
        },
        errorMsg: errorMsg
      }

    };
    const results = DateRangeActions.onEndDateChange(startDate, endDate);

    expect(results.type).to.equal(expectedAction.type);
    expect(results.data.dateRange.startDate).to.equal(expectedAction.data.dateRange.startDate);
    expect(results.data.dateRange.endDate).to.equal(expectedAction.data.dateRange.endDate);
    expect(results.data.errorMsg).to.equal(expectedAction.data.errorMsg);
  });
  it('Date Range Action - start date after date', function() {
    var moment = require('moment');
    const startDate = moment(new Date('07/21/2016'));
    const endDate = moment(new Date('07/20/2016'));
    const errorMsg = i18n(START_DATE) + ': ' +
			moment(new Date(startDate)).format(DATE_PICKER_PLACEHOLDER) +
			' ' + i18n(IS_AFTER_END_DATE);
    const expectedAction = {
      type: dateRangeActionTypes.INVALID_DATE_RANGE,
      data: {
        dateRange: {
          startDate: startDate,
          endDate: endDate
        },
        errorMsg: errorMsg
      }

    };
    const results = DateRangeActions.onStartDateChange(startDate, endDate);

    expect(results.type).to.equal(expectedAction.type);
    expect(results.data.dateRange.startDate).to.equal(expectedAction.data.dateRange.startDate);
    expect(results.data.dateRange.endDate).to.equal(expectedAction.data.dateRange.endDate);
    expect(results.data.errorMsg).to.equal(expectedAction.data.errorMsg);
  });
  it('Date Range Action - confirm onStartDateChange action called on startDate change', function() {
    const spy = sinon.spy(DateRangeActions, 'onStartDateChange');
    let startDatePicker = TestUtils.findRenderedDOMComponentWithClass(this.component, 'start-date-picker');
    startDatePicker.value = '05/09/2016';
    TestUtils.Simulate.change(startDatePicker);
    expect(DateRangeActions.onStartDateChange.calledOnce).to.be.true;
    DateRangeActions.onStartDateChange.restore();
  });
  it('Date Range Action - confirm onEndDateChange action called on endDate change', function() {
    const spy = sinon.spy(DateRangeActions, 'onEndDateChange');
    let endDatePicker = TestUtils.findRenderedDOMComponentWithClass(this.component, 'end-date-picker');
    endDatePicker.value = '05/09/2016';
    TestUtils.Simulate.change(endDatePicker);
    expect(DateRangeActions.onEndDateChange.calledOnce).to.be.true;
    DateRangeActions.onEndDateChange.restore();
  });
});
