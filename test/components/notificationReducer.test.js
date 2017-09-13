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
import { expect } from 'chai';
import NotificationConstants from 'generic-components/notifications/NotificationConstants.js';
import reducer from 'generic-components/notifications/NotificationReducer.js';

describe("Notification reducer test suite", function() {
	const initialState = {
		title: '',
		msg: '',
		timeout: 0
	};

	it("NOTIFY_INFO event", function() {
		const action = {
			type: NotificationConstants.NOTIFY_INFO,
			data: {
				title: 'some title',
				msg: 'some message',
				timeout: 1
			}
		}
		const newState = reducer(initialState, action);

		expect(newState.type).to.equal('default');
		expect(newState.title).to.equal('some title');
		expect(newState.msg).to.equal('some message');
		expect(newState.timeout).to.equal(1);
	});

	it("NOTIFY_ERROR event", function() {
		const action = {
			type: NotificationConstants.NOTIFY_ERROR,
			data: {
				title: 'some title',
				msg: 'some message',
				timeout: 1
			}
		}
		const newState = reducer(initialState, action);

		expect(newState.type).to.equal('error');
		expect(newState.title).to.equal('some title');
		expect(newState.msg).to.equal('some message');
		expect(newState.timeout).to.equal(1);
	});

	it("NOTIFY_WARNING event", function() {
		const action = {
			type: NotificationConstants.NOTIFY_WARNING,
			data: {
				title: 'some title',
				msg: 'some message',
				timeout: 1
			}
		}
		const newState = reducer(initialState, action);

		expect(newState.type).to.equal('warning');
		expect(newState.title).to.equal('some title');
		expect(newState.msg).to.equal('some message');
		expect(newState.timeout).to.equal(1);
	});

	it("NOTIFY_SUCCESS event", function() {
		const action = {
			type: NotificationConstants.NOTIFY_SUCCESS,
			data: {
				title: 'some title',
				msg: 'some message',
				timeout: 1
			}
		}
		const newState = reducer(initialState, action);

		expect(newState.type).to.equal('success');
		expect(newState.title).to.equal('some title');
		expect(newState.msg).to.equal('some message');
		expect(newState.timeout).to.equal(1);
	});

	it("NOTIFY_CLOSE event", function() {
		const action = {
			type: NotificationConstants.NOTIFY_CLOSE
		}
		const newState = reducer(initialState, action);

		expect(newState).to.be.null;
	});
});
