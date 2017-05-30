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

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import ButtonGroup from 'react-bootstrap/lib/ButtonGroup.js';
import Button from 'react-bootstrap/lib/Button.js';

import ToggleButtonGroupActions from 'generic-components/toggleButtonGroup/ToggleButtonGroupActions.js';

let mapActionToProps = (dispatch) => {
		return {
				onButtonToggle: (buttonName) => {
						dispatch(ToggleButtonGroupActions.onToggle({button: buttonName}));
				}
		};
};

let mapStateToProps = ({toggleButtonGroupData}) => {
		
		let {selectedButton} = toggleButtonGroupData;
		
		return {
				selectedButton
		};
};

class ToggleButtonGroup extends Component {
		
		static propTypes = {
				buttonDefinitions: PropTypes.object.isRequired
		};
		
		onButtonSelect(buttonName) {
				this.props.onButtonToggle(buttonName);
		}
		
		render() {
				let {selectedButton, buttonDefinitions} = this.props;
				let buttonListElements = [];
				Object.keys(buttonDefinitions).map(function (item) {
						buttonListElements.push(
								<Button id={item} active={selectedButton === item ? true : false}
								        onClick={() => this.onButtonSelect(item)}>
										<i className={buttonDefinitions[item]} aria-hidden='true'></i>
								</Button>
						);
				}.bind(this));
				
				return (
						<ButtonGroup bsClass='btn-group displayOptionButtons'>
								{buttonListElements}
						</ButtonGroup>
				);
		}
}
export default connect(mapStateToProps, mapActionToProps)(ToggleButtonGroup);
