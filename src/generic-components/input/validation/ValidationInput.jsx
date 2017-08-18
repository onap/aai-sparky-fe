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
/**
	* Used for inputs on a validation form.
	* All properties will be passed on to the input element.
	*
	* The following properties can be set for OOB validations and callbacks:
	- required: Boolean:  Should be set to true if the input must have a value
	- numeric: Boolean : Should be set to true id the input should be an integer
	- onChange : Function :  Will be called to validate the value if the default validations are not sufficient, should return a boolean value
	indicating whether the value is valid
	- didUpdateCallback :Function: Will be called after the state has been updated and the component has rerendered. This can be used if
	there are dependencies between inputs in a form.
	*
	* The following properties of the state can be set to determine
	* the state of the input from outside components:
	- isValid : Boolean - whether the value is valid
	- value : value for the input field,
	- disabled : Boolean,
	- required : Boolean - whether the input value must be filled out.
	*/
import React from 'react';
import ReactDOM from 'react-dom';
import Validator from 'validator';
import Input from 'react-bootstrap/lib/Input.js';
import Overlay from 'react-bootstrap/lib/Overlay.js';
import Tooltip from 'react-bootstrap/lib/Tooltip.js';
import isEqual from 'lodash/lang/isEqual.js';
import i18n from 'utils/i18n/i18n.js';

import InputOptions  from '../inputOptions/InputOptions.jsx';

const globalValidationFunctions = {
		required: value => value !== '',
		maxLength: (value, length) => Validator.isLength(value, {max: length}),
		minLength: (value, length) => Validator.isLength(value, {min: length}),
		pattern: (value, pattern) => Validator.matches(value, pattern),
		numeric: value => Validator.isNumeric(value),
		maxValue: (value, maxValue) => value < maxValue,
		alphanumeric: value => Validator.isAlphanumeric(value),
		alphanumericWithSpaces: value => Validator.isAlphanumeric(
				value.replace(/ /g, '')),
		validateName: value => Validator.isAlphanumeric(
				value.replace(/\s|\.|\_|\-/g, ''), 'en-US'),
		validateVendorName: value => Validator.isAlphanumeric(
				value.replace(/[\x7F-\xFF]|\s/g, ''), 'en-US'),
		freeEnglishText: value => Validator.isAlphanumeric(
				value.replace(/\s|\.|\_|\-|\,|\(|\)|\?/g, ''), 'en-US'),
		email: value => Validator.isEmail(value),
		ip: value => Validator.isIP(value),
		url: value => Validator.isURL(value)
};

const globalValidationMessagingFunctions = {
		required: () => i18n('Field is required'),
		maxLength: (value, maxLength) => i18n(
				'Field value has exceeded it\'s limit, {maxLength}. current length: {length}',
				{
						length: value.length,
						maxLength
				}),
		minLength: (value, minLength) => i18n(
				'Field value should contain at least {minLength} characters.', {minLength}),
		pattern: (value, pattern) => i18n(
				'Field value should match the pattern: {pattern}.', {pattern}),
		numeric: () => i18n('Field value should contain numbers only.'),
		maxValue: (value, maxValue) => i18n(
				'Field value should be less then: {maxValue}.', {maxValue}),
		alphanumeric: () => i18n(
				'Field value should contain letters or digits only.'),
		alphanumericWithSpaces: () => i18n(
				'Field value should contain letters, digits or spaces only.'),
		validateName: ()=> i18n(
				'Field value should contain English letters, digits , spaces, underscores, dashes and dots only.'),
		validateVendorName: ()=> i18n(
				'Field value should contain English letters digits and spaces only.'),
		freeEnglishText: ()=> i18n(
				'Field value should contain  English letters, digits , spaces, underscores, dashes and dots only.'),
		email: () => i18n('Field value should be a valid email address.'),
		ip: () => i18n('Field value should be a valid ip address.'),
		url: () => i18n('Field value should be a valid url address.'),
		general: () => i18n('Field value is invalid.')
};

class ValidationInput extends React.Component {
		
		static contextTypes = {
				validationParent: React.PropTypes.any,
				isReadOnlyMode: React.PropTypes.bool
		};
		
		static defaultProps = {
				onChange: null,
				disabled: null,
				didUpdateCallback: null,
				validations: {},
				value: ''
		};
		
		static propTypes = {
				onChange: React.PropTypes.func,
				disabled: React.PropTypes.bool,
				didUpdateCallback: React.PropTypes.func,
				validations: React.PropTypes.object
		};
		
		
		state = {
				isValid: true,
				style: null,
				value: this.props.value,
				error: {},
				previousErrorMessage: '',
				wasInvalid: false
		};
		
		componentWillReceiveProps({value: nextValue, validations: nextValidaions}) {
				if (this.state.wasInvalid) {
						const {validations, value} = this.props;
						if (value !== nextValue || !isEqual(validations, nextValidaions)) {
								this.validate(nextValue, nextValidaions);
						}
				} else if (this.props.value !== nextValue) {
						this.setState({value: nextValue});
				}
		}
		
		render() {
				let {isMultiSelect, onOtherChange, type} = this.props;
				
				let groupClasses = this.props.groupClassName || '';
				if (this.props.validations.required) {
						groupClasses += ' required';
				}
				let isReadOnlyMode = this.context.isReadOnlyMode;
				
				return (
						<div className='validation-input-wrapper'>
								{
										!isMultiSelect && !onOtherChange && type !== 'select'
										&& <Input
												{...this.props}
												groupClassName={groupClasses}
												ref={'_myInput'}
												value={this.state.value}
												disabled={isReadOnlyMode || Boolean(this.props.disabled)}
												bsStyle={this.state.style}
												onChange={() => this.changedInput()}
												onBlur={() => this.blurInput()}>
												{this.props.children}
										</Input>
								}
								{
										(isMultiSelect || onOtherChange || type === 'select')
										&& <InputOptions onInputChange={() => this.changedInput()}
										                 onBlur={() => this.blurInput()}
										                 hasError={!this.state.isValid}
										                 ref={'_myInput'} {...this.props} />
								}
								{this.renderOverlay()}
						</div>
				);
		}
		
		renderOverlay() {
				let position = 'right';
				if (this.props.type === 'text'
						|| this.props.type === 'email'
						|| this.props.type === 'number'
						|| this.props.type === 'password'
				
				) {
						position = 'bottom';
				}
				
				let validationMessage = this.state.error.message ||
						this.state.previousErrorMessage;
				return (
						<Overlay
								show={!this.state.isValid}
								placement={position}
								target={() => {let target = ReactDOM.findDOMNode(this.refs._myInput); return target.offsetParent ? target : undefined;}}
								container={this}>
								<Tooltip
										id={`error-${validationMessage.replace(' ','-')}`}
										className='validation-error-message'>
										{validationMessage}
								</Tooltip>
						</Overlay>
				);
		}
		
		componentDidMount() {
				if (this.context.validationParent) {
						this.context.validationParent.register(this);
				}
		}
		
		componentDidUpdate(prevProps, prevState) {
				if (this.context.validationParent) {
						if (prevState.isValid !== this.state.isValid) {
								this.context.validationParent.childValidStateChanged(this,
										this.state.isValid);
						}
				}
				if (this.props.didUpdateCallback) {
						this.props.didUpdateCallback();
				}
				
		}
		
		componentWillUnmount() {
				if (this.context.validationParent) {
						this.context.validationParent.unregister(this);
				}
		}
		
		/***
			* Adding same method as the actual input component
			* @returns {*}
			*/
		getValue() {
				if (this.props.type === 'checkbox') {
						return this.refs._myInput.getChecked();
				}
				return this.refs._myInput.getValue();
		}
		
		resetValue() {
				this.setState({value: this.props.value});
		}
		
		
		/***
			* internal method that validated the value. includes callback to the
			* onChange method
			* @param value
			* @param validations - map containing validation id and the limitation
			*   describing the validation.
			* @returns {object}
			*/
		validateValue = (value, validations) => {
				let {customValidationFunction} = validations;
				let error = {};
				let isValid = true;
				for (let validation in validations) {
						if ('customValidationFunction' !== validation) {
								if (validations[validation]) {
										if (!globalValidationFunctions[validation](value,
														validations[validation])) {
												error.id = validation;
												error.message =
														globalValidationMessagingFunctions[validation](value,
																validations[validation]);
												isValid = false;
												break;
										}
								}
						} else {
								let customValidationResult = customValidationFunction(value);
								
								if (customValidationResult !== true) {
										error.id = 'custom';
										isValid = false;
										if (typeof customValidationResult === 'string') {//custom validation error message supplied.
												error.message = customValidationResult;
										} else {
												error.message = globalValidationMessagingFunctions.general();
										}
										break;
								}
								
								
						}
				}
				
				return {
						isValid,
						error
				};
		};
		
		/***
			* Internal method that handles the change event of the input. validates and
			* updates the state.
			*/
		changedInput() {
				
				let {isValid, error} = this.state.wasInvalid ? this.validate() : this.state;
				let onChange = this.props.onChange;
				if (onChange) {
						onChange(this.getValue(), isValid, error);
				}
		};
		
		blurInput() {
				if (!this.state.wasInvalid) {
						this.setState({wasInvalid: true});
				}
				
				let {isValid, error} = !this.state.wasInvalid
						? this.validate()
						: this.state;
				let onBlur = this.props.onBlur;
				if (onBlur) {
						onBlur(this.getValue(), isValid, error);
				}
		};
		
		validate(value = this.getValue(), validations = this.props.validations) {
				let validationStatus = this.validateValue(value, validations);
				let {isValid, error} = validationStatus;
				let _style = isValid ? null : 'error';
				this.setState({
						isValid,
						error,
						value,
						previousErrorMessage: this.state.error.message || '',
						style: _style,
						wasInvalid: !isValid || this.state.wasInvalid
				});
				
				return validationStatus;
		}
		
		isValid() {
				return this.state.isValid;
		}
		
}
export default ValidationInput;
