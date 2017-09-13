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
import React from "react";
import TestUtils from "react-dom/lib/ReactTestUtils";
import {Provider} from "react-redux";
import {expect} from "chai";
import {moment} from "moment";
import store from "app/AppStore.js";
import DateRangeSelector from "generic-components/dateRangeSelector/DateRangeSelector.jsx";
import DateRangeSelectorActions from "generic-components/dateRangeSelector/DateRangeSelectorActions.js";
import {
	dateRangeSelectorActionTypes,
	TODAY,
	YESTERDAY,
	LAST_WEEK,
	LAST_MONTH,
	CUSTOM,
	ICON_CLASS_CALENDAR,
	ICON_CLASS_DOWN_CARET,
	ERROR_UNKNOWN_PERIOD} from "generic-components/dateRangeSelector/DateRangeSelectorConstants.js";
import reducer from "generic-components/dateRangeSelector/DateRangeSelectorReducer.js";
import {dateRangeActionTypes, DATE_PICKER_PLACEHOLDER} from "generic-components/dateRange/DateRangeConstants.js";
import {MESSAGE_LEVEL_DANGER} from "utils/GlobalConstants.js";

describe("Date Range Selector Test Suite", function() {

	beforeEach(function () {
		this.component = TestUtils.renderIntoDocument( <Provider store={store}><DateRangeSelector /></Provider>);
	});

	// test structure
	it("Date Range Selector - Validate selector button", function () {
		var moment = require('moment');
		let currentDate = moment(new Date()).format(DATE_PICKER_PLACEHOLDER);
		let button = TestUtils.findRenderedDOMComponentWithTag(this.component, 'button');
		expect(button).exists;
		expect(button.childNodes.length).to.equal(3);
		expect(button.childNodes[0].className).to.have.string(ICON_CLASS_CALENDAR);
		expect(button.childNodes[1].innerHTML).to.have.string(currentDate + ' - ' + currentDate);
		expect(button.childNodes[2].className).to.have.string(ICON_CLASS_DOWN_CARET);
	});

	it("Date Range Selector - Validate quick pick options", function () {
		let button = TestUtils.findRenderedDOMComponentWithTag(this.component, 'button');
		TestUtils.Simulate.click(button);

		let popoverMenu = document.body.getElementsByClassName('popover-content');
		// TODO - need to figure out how to get the popover menu (above doesn't work)
	});

	// test reducer
	it("Date Range Selector Reducer ... Vaidate DATE_RANGE_CHANGE event)", function() {
		var moment = require('moment');
		const initialState = {
			startDate: moment(new Date('07/20/2016')),
			endDate: moment(new Date('07/09/2016')),
			period: CUSTOM,
			periodErrText: 'some error text',
			periodErrSev: 'some error severity'
		};
		const rangeChangeAction = {
			type: dateRangeActionTypes.DATE_RANGE_CHANGE,
			data: {
				dateRange: {
					startDate: moment(new Date('05/04/2016')),
					endDate: moment(new Date('06/05/2016'))
				},
				errorMsg: ''
			}};
		const newState = reducer(initialState, rangeChangeAction);
		expect(newState.startDate).to.exist;
		expect(newState.startDate.toDate().getTime()).to.equal(new Date('05/04/2016').getTime());
		expect(newState.endDate).to.exist;
		expect(newState.endDate.toDate().getTime()).to.equal(new Date('06/05/2016').getTime());
		expect(newState.period).to.equal(CUSTOM);
		expect(newState.periodErrText).to.equal('');
		expect(newState.periodErrSev).to.equal('');
	});
	it("Date Range Selector Reducer ... Vaidate INVALID_DATE_RANGE event)", function() {
		var moment = require('moment');
		const initialState = {};
		const rangeChangeAction = {
			type: dateRangeActionTypes.INVALID_DATE_RANGE,
			data: {
				dateRange: {
					startDate: moment(new Date('07/04/2016')),
					endDate: moment(new Date('06/05/2016'))
				},
				errorMsg: 'some eror message'
			}};
		const newState = reducer(initialState, rangeChangeAction);
		expect(newState.startDate).to.exist;
		expect(newState.startDate.toDate().getTime()).to.equal(new Date('07/04/2016').getTime());
		expect(newState.endDate).to.exist;
		expect(newState.endDate.toDate().getTime()).to.equal(new Date('06/05/2016').getTime());
		expect(newState.period).to.not.exist;
		expect(newState.periodErrText).to.equal('some eror message');
		expect(newState.periodErrSev).to.equal(MESSAGE_LEVEL_DANGER);
	});
	it("Date Range Selector Reducer ... Vaidate PERIOD_CHANGE event)", function() {
		var moment = require('moment');
		const initialState = {
			startDate: moment(new Date('07/20/2016')),
			endDate: moment(new Date('07/09/2016')),
			period: CUSTOM,
			periodErrText: 'some error text',
			periodErrSev: 'some error severity'
		};
		const rangeChangeAction = {
			type: dateRangeSelectorActionTypes.EVENT_PERIOD_CHANGE,
			data: {
				dateRange: {
					startDate: moment(new Date('07/04/2016')),
					endDate: moment(new Date('07/05/2016'))
				},
				period: YESTERDAY
			}
		};
		const newState = reducer(initialState, rangeChangeAction);
		expect(newState.startDate).to.exist;
		expect(newState.startDate.toDate().getTime()).to.equal(new Date('07/04/2016').getTime());
		expect(newState.endDate).to.exist;
		expect(newState.endDate.toDate().getTime()).to.equal(new Date('07/05/2016').getTime());
		expect(newState.period).to.equal(YESTERDAY);
		expect(newState.periodErrText).to.equal('');
		expect(newState.periodErrSev).to.equal('');
	});

	// test Actions
	it("Date Range Selector Action - test EVENT_PERIOD_CHANGE (period = Today)", function() {
		var moment = require('moment');
		const startDate = moment(new Date());
		const endDate = moment(new Date());
		const period = TODAY;

		const results = DateRangeSelectorActions.onPeriodChange(startDate, endDate, period);

		const expectedStartTime = moment(new Date());
		setTime(expectedStartTime, 0, 0, 0);
		const expectedEndTime = moment(new Date());
		setTime(expectedEndTime, 23, 59, 59);
		const expectedAction = buildExpectedPeriodChangeAction(expectedStartTime, expectedEndTime, TODAY);

		expect(results.type).to.equal(expectedAction.type);
		validateDates(results.data.dateRange.startDate, expectedAction.data.dateRange.startDate);
		validateDates(results.data.dateRange.endDate, expectedAction.data.dateRange.endDate);
		expect(results.data.period).to.equal(expectedAction.data.period);
	});
	it("Date Range Selector Action - test EVENT_PERIOD_CHANGE (period = Yesterday)", function() {
		var moment = require('moment');
		const startDate = moment(new Date());
		const endDate = moment(new Date());
		const period = YESTERDAY;

		const results = DateRangeSelectorActions.onPeriodChange(startDate, endDate, period);

		const expectedStartTime = moment(new Date()).subtract(1, 'days');
		setTime(expectedStartTime, 0, 0, 0);
		const expectedEndTime = moment(new Date());
		setTime(expectedEndTime, 23, 59, 59);
		const expectedAction = buildExpectedPeriodChangeAction(expectedStartTime, expectedEndTime, YESTERDAY);

		expect(results.type).to.equal(expectedAction.type);
		validateDates(results.data.dateRange.startDate, expectedAction.data.dateRange.startDate);
		validateDates(results.data.dateRange.endDate, expectedAction.data.dateRange.endDate);
		expect(results.data.period).to.equal(expectedAction.data.period);
	});
	it("Date Range Selector Action - test EVENT_PERIOD_CHANGE (period = Last Week)", function() {
		var moment = require('moment');
		const startDate = moment(new Date());
		const endDate = moment(new Date());
		const period = LAST_WEEK;

		const results = DateRangeSelectorActions.onPeriodChange(startDate, endDate, period);

		const expectedStartTime = moment(new Date()).subtract(7, 'days');
		setTime(expectedStartTime, 0, 0, 0);
		const expectedEndTime = moment(new Date());
		setTime(expectedEndTime, 23, 59, 59);
		const expectedAction = buildExpectedPeriodChangeAction(expectedStartTime, expectedEndTime, LAST_WEEK);

		expect(results.type).to.equal(expectedAction.type);
		validateDates(results.data.dateRange.startDate, expectedAction.data.dateRange.startDate);
		validateDates(results.data.dateRange.endDate, expectedAction.data.dateRange.endDate);
		expect(results.data.period).to.equal(expectedAction.data.period);
	});
	it("Date Range Selector Action - test EVENT_PERIOD_CHANGE (period = Last Month)", function() {
		var moment = require('moment');
		const startDate = moment(new Date());
		const endDate = moment(new Date());
		const period = LAST_MONTH;

		const results = DateRangeSelectorActions.onPeriodChange(startDate, endDate, period);

		const expectedStartTime = moment(new Date()).subtract(1, 'months');
		setTime(expectedStartTime, 0, 0, 0);
		const expectedEndTime = moment(new Date());
		setTime(expectedEndTime, 23, 59, 59);
		const expectedAction = buildExpectedPeriodChangeAction(expectedStartTime, expectedEndTime, LAST_MONTH);

		expect(results.type).to.equal(expectedAction.type);
		validateDates(results.data.dateRange.startDate, expectedAction.data.dateRange.startDate);
		validateDates(results.data.dateRange.endDate, expectedAction.data.dateRange.endDate);
		expect(results.data.period).to.equal(expectedAction.data.period);
	});
	it("Date Range Selector Action - test EVENT_PERIOD_CHANGE (period = Custom)", function() {
		var moment = require('moment');
		const startDate = moment(new Date()).subtract(3, 'months');
		const endDate = moment(new Date()).add(6, 'days');
		const period = CUSTOM;

		const results = DateRangeSelectorActions.onPeriodChange(startDate, endDate, period);

		setTime(startDate, 0, 0, 0);
		setTime(endDate, 23, 59, 59);
		const expectedAction = buildExpectedPeriodChangeAction(startDate, endDate, CUSTOM);

		expect(results.type).to.equal(expectedAction.type);
		validateDates(results.data.dateRange.startDate, expectedAction.data.dateRange.startDate);
		validateDates(results.data.dateRange.endDate, expectedAction.data.dateRange.endDate);
		expect(results.data.period).to.equal(expectedAction.data.period);
	});
	it("Date Range Selector Action - test EVENT_PERIOD_CHANGE (period = Unknown)", function() {
		var moment = require('moment');
		const startDate = moment(new Date()).subtract(3, 'months');
		const endDate = moment(new Date()).add(6, 'days');
		const period = 'Some Unknown Period';

		const results = DateRangeSelectorActions.onPeriodChange(startDate, endDate, period);

		let expectedErrorMsg = ERROR_UNKNOWN_PERIOD + ': ' + period;
		const expectedAction = buildExpectedUnknownPeriodAction(startDate, endDate, period, expectedErrorMsg);

		expect(results.type).to.deep.equal(expectedAction.type);
		validateDates(results.data.dateRange.startDate, expectedAction.data.dateRange.startDate);
		validateDates(results.data.dateRange.endDate, expectedAction.data.dateRange.endDate);
		expect(results.data.period).to.equal(expectedAction.data.period);
	});

	// TODO - need tests to confirm DateRangeSelectorActions.onPeriodChange is called when clicking any of the 'quick link' periods


	// helper functions
	function setTime(moment, hours, minutes, seconds) {
		moment.toDate();
		moment.hour(hours);
		moment.minute(minutes);
		moment.second(seconds);
	}

	function validateDates(actualDate, expectedDates) {
		expect(actualDate.toDate().getYear()).to.equal(expectedDates.toDate().getYear());
		expect(actualDate.toDate().getMonth()).to.equal(expectedDates.toDate().getMonth());
		expect(actualDate.toDate().getDay()).to.equal(expectedDates.toDate().getDay());
		expect(actualDate.toDate().getHours()).to.equal(expectedDates.toDate().getHours());
		expect(actualDate.toDate().getMinutes()).to.equal(expectedDates.toDate().getMinutes());
	}

	function buildExpectedPeriodChangeAction(start, end, period) {
		return {
			type: dateRangeSelectorActionTypes.EVENT_PERIOD_CHANGE,
			data: {
				dateRange: {
					startDate: start,
					endDate: end
				},
				period: period
			}
		};
	}

	function buildExpectedUnknownPeriodAction(start, end, period, errorMsg) {
		return {
			type: dateRangeSelectorActionTypes.EVENT_PERIOD_ERROR,
			data: {
				dateRange: {
					startDate: start,
					endDate: end
				},
				period: period,
				errorMsg: errorMsg
			}
		};
	}
});
