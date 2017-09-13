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
import {BUTTON_TOGGLED} from 'generic-components/toggleButtonGroup/ToggleButtonGroupConstants.js';
import reducer from 'generic-components/toggleButtonGroup/ToggleButtonGroupReducer.js';

describe("Toggle Button Group reducer test suite", function() {
	const initialState = {
		selectedButton: ''
	};

	it("BUTTON_TOGGLED event", function () {
		const action = {
			type: BUTTON_TOGGLED,
			data: {
				button: 'some button name'
			}
		}
		const newState = reducer(initialState, action);

		expect(newState.selectedButton).to.equal('some button name');
	});
});
