/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
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
 */
import React from 'react';
import { PropTypes } from 'prop-types';
import i18n from 'utils/i18n/i18n.js';
import classNames from 'classnames';
import Select from 'generic-components/input/SelectInput.jsx';

export const other = {OTHER: 'Other'};

class InputOptions extends React.Component {
		
		static propTypes = {
				values: PropTypes.arrayOf(PropTypes.shape({
						enum: PropTypes.string,
						title: PropTypes.string
				})),
				isEnabledOther: PropTypes.bool,
				title: PropTypes.string,
				selectedValue: PropTypes.string,
				multiSelectedEnum: PropTypes.array,
				selectedEnum: PropTypes.string,
				otherValue: PropTypes.string,
				onEnumChange: PropTypes.func,
				onOtherChange: PropTypes.func,
				isRequired: PropTypes.bool,
				isMultiSelect: PropTypes.bool
		};
		
		
		static contextTypes = {
				isReadOnlyMode: PropTypes.bool
		};
		
		state = {
				otherInputDisabled: !this.props.otherValue
		};
		
		oldProps = {
				selectedEnum: '',
				otherValue: '',
				multiSelectedEnum: []
		};
		
		render() {
				let {label, isRequired, values, otherValue, onOtherChange, isMultiSelect, onBlur, multiSelectedEnum, selectedEnum, hasError, validations, children} = this.props;
				
				let currentMultiSelectedEnum = [];
				let currentSelectedEnum = '';
				let {otherInputDisabled} = this.state;
				if (isMultiSelect) {
						currentMultiSelectedEnum = multiSelectedEnum;
						if (!otherInputDisabled) {
								currentSelectedEnum =
										multiSelectedEnum ? multiSelectedEnum.toString() : undefined;
						}
				}
				else {
						currentSelectedEnum = selectedEnum;
				}
				
				let isReadOnlyMode = this.context.isReadOnlyMode;
				
				return (
						<div
								className={classNames('form-group', {'required' : validations.required , 'has-error' : hasError})}>
								<label className='control-label'>{label}</label>
								{isMultiSelect && otherInputDisabled ?
								 <Select
										 ref='_myInput'
										 value={currentMultiSelectedEnum}
										 className='options-input'
										 clearable={false}
										 required={isRequired}
										 disabled={isReadOnlyMode || Boolean(this.props.disabled)}
										 onBlur={() => onBlur()}
										 onMultiSelectChanged={value => this.multiSelectEnumChanged(value)}
										 options={this.renderMultiSelectOptions(values)}
										 multi/> :
								 <div className={classNames('input-options',{'has-error' : hasError})}>
										 <select
												 ref={'_myInput'}
												 label={label}
												 className='form-control input-options-select'
												 value={currentSelectedEnum}
												 style={{'width' : otherInputDisabled ? '100%' : '95px'}}
												 onBlur={() => onBlur()}
												 disabled={isReadOnlyMode || Boolean(this.props.disabled)}
												 onChange={ value => this.enumChanged(value)}
												 type='select'>
												 {values &&
												 values.length &&
												 values.map(val => this.renderOptions(val))}
												 {onOtherChange && <option key='other'
												                           value={other.OTHER}>{i18n(
														 other.OTHER)}</option>}
												 {children}
										 </select>
										
										 {!otherInputDisabled && <div className='input-options-separator'/>}
										 <input
												 className='form-control input-options-other'
												 placeholder={i18n('other')}
												 ref='_otherValue'
												 style={{'display' : otherInputDisabled ? 'none' : 'block'}}
												 disabled={isReadOnlyMode || Boolean(this.props.disabled)}
												 value={otherValue || ''}
												 onBlur={() => onBlur()}
												 onChange={() => this.changedOtherInput()}/>
								 </div>
								}
						</div>
				);
		}
		
		renderOptions(val) {
				return (
						<option key={val.enum} value={val.enum}>{val.title}</option>
				);
		}
		
		
		renderMultiSelectOptions(values) {
				let {onOtherChange} = this.props;
				let optionsList = [];
				if (onOtherChange) {
						optionsList = values.map(option => {
								return {
										label: option.title,
										value: option.enum,
								};
						}).concat([{
								label: i18n(other.OTHER),
								value: i18n(other.OTHER),
						}]);
				}
				else {
						optionsList = values.map(option => {
								return {
										label: option.title,
										value: option.enum,
								};
						});
				}
				if (optionsList.length > 0 && optionsList[0].value === '') {
						optionsList.shift();
				}
				return optionsList;
		}
		
		getValue() {
				let res = '';
				let {isMultiSelect} = this.props;
				let {otherInputDisabled} = this.state;
				
				if (otherInputDisabled) {
						res =
								isMultiSelect
										? this.refs._myInput.getValue()
										: this.refs._myInput.value;
				} else {
						res = this.refs._otherValue.value;
				}
				return res;
		}
		
		enumChanged() {
				let enumValue = this.refs._myInput.value;
				let {onEnumChange, isMultiSelect, onChange} = this.props;
				this.setState({
						otherInputDisabled: enumValue !== other.OTHER
				});
				if (onEnumChange) {
						onEnumChange(isMultiSelect ? [enumValue] : enumValue);
				}
				
				if (onChange) {
						onChange(enumValue);
				}
				
		}
		
		multiSelectEnumChanged(enumValue) {
				let {onEnumChange} = this.props;
				let selectedValues = enumValue.map(enumVal => {
						return enumVal.value;
				});
				
				if (this.state.otherInputDisabled === false) {
						selectedValues.shift();
				}
				else if (selectedValues.includes(i18n(other.OTHER))) {
						selectedValues = [i18n(other.OTHER)];
				}
				
				this.setState({
						otherInputDisabled: !selectedValues.includes(i18n(other.OTHER))
				});
				onEnumChange(selectedValues);
		}
		
		changedOtherInput() {
				let {onOtherChange} = this.props;
				onOtherChange(this.refs._otherValue.value);
		}
		
		componentDidUpdate() {
				let {otherValue, selectedEnum, onInputChange, multiSelectedEnum} = this.props;
				if (this.oldProps.otherValue !== otherValue
						|| this.oldProps.selectedEnum !== selectedEnum
						|| this.oldProps.multiSelectedEnum !== multiSelectedEnum) {
						this.oldProps = {
								otherValue,
								selectedEnum,
								multiSelectedEnum
						};
						onInputChange();
				}
		}
		
}

export default InputOptions;
