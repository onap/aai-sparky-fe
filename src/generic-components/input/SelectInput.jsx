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

/**
	* The HTML structure here is aligned with bootstrap HTML structure for form
	* elements. In this way we have proper styling and it is aligned with other
	* form elements on screen.
	*
	* Select and MultiSelect options:
	*
	* label - the label to be shown which paired with the input
	*
	* all other "react-select" props - as documented on
	* http://jedwatson.github.io/react-select/
	* or
	* https://github.com/JedWatson/react-select
	*/
import React, {Component} from 'react';
import Select from 'react-select';

class SelectInput extends Component {
		
		inputValue = [];
		
		render() {
				let {label, value, ...other} = this.props;
				return (
						<div className='validation-input-wrapper dropdown-multi-select'>
								<div className='form-group'>
										{label && <label className='control-label'>{label}</label>}
										<Select ref='_myInput'
										        onChange={value => this.onSelectChanged(value)} {...other}
										        value={value}/>
								</div>
						</div>
				);
		}
		
		getValue() {
				return this.inputValue && this.inputValue.length ? this.inputValue : '';
		}
		
		onSelectChanged(value) {
				this.props.onMultiSelectChanged(value);
		}
		
		componentDidMount() {
				let {value} = this.props;
				this.inputValue = value ? value : [];
		}
		
		componentDidUpdate() {
				if (this.inputValue !== this.props.value) {
						this.inputValue = this.props.value;
				}
		}
}

export default SelectInput;
