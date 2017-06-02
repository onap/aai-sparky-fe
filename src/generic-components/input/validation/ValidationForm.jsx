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
	* ValidationForm should be used in order to have a form that handles it's
	* internal validation state. All ValidationInputs inside the form are checked
	* for validity and the styling and submit buttons are updated accordingly.
	*
	* The properties that ahould be given to the form:
	* labledButtons - whether or not use icons only as the form default buttons or
	* use buttons with labels onSubmit - function for click on the submit button
	* onReset - function for click on the reset button
	*/
import React from 'react';
import ValidationButtons from './ValidationButtons.jsx';

class ValidationForm extends React.Component {
		
		static childContextTypes = {
				validationParent: React.PropTypes.any,
				isReadOnlyMode: React.PropTypes.bool
		};
		
		static defaultProps = {
				hasButtons: true,
				onSubmit: null,
				onReset: null,
				labledButtons: true,
				onValidChange: null,
				isValid: true
		};
		
		static propTypes = {
				isValid: React.PropTypes.bool,
				hasButtons: React.PropTypes.bool,
				onSubmit: React.PropTypes.func,
				onReset: React.PropTypes.func,
				labledButtons: React.PropTypes.bool,
				onValidChange: React.PropTypes.func
		};
		
		state = {
				isValid: this.props.isValid
		};
		
		constructor(props) {
				super(props);
				this.validationComponents = [];
		}
		
		render() {
				var buttons = (this.props.hasButtons) ?
				              <ValidationButtons labledButtons={this.props.labledButtons}
				                                 ref='buttons'
				                                 isReadOnlyMode={this.props.isReadOnlyMode}/>
						: null;
				return (
						<form {...this.props} onSubmit={event => this.handleFormSubmit(event)}>
								<div className='validation-form-content'>{this.props.children}</div>
								{buttons}
						</form>
				);
		}
		
		handleFormSubmit(event) {
				event.preventDefault();
				let isFormValid = true;
				this.validationComponents.forEach(validationComponent => {
						const isInputValid = validationComponent.validate().isValid;
						isFormValid = isInputValid && isFormValid;
				});
				if (isFormValid && this.props.onSubmit) {
						this.props.onSubmit(event);
				} else if (!isFormValid) {
						this.setState({isValid: false});
				}
		};
		
		componentDidUpdate(prevProps, prevState) {
				// only handling this programatically if the validation of the form is done
				// outside of the view (example with a form that is dependent on the state
				// of other forms)
				if (prevProps.isValid !== this.props.isValid) {
						if (this.props.hasButtons) {
								this.refs.buttons.setState({isValid: this.state.isValid});
						}
				} else if (this.state.isValid !== prevState.isValid) {
						if (this.props.hasButtons) {
								this.refs.buttons.setState({isValid: this.state.isValid});
						}
						// callback in case form is part of bigger picture in view
						if (this.props.onValidChange) {
								this.props.onValidChange(this.state.isValid);
						}
				}
		}
		
		componentDidMount() {
				if (this.props.hasButtons) {
						this.refs.buttons.setState({isValid: this.state.isValid});
				}
		}
		
		
		getChildContext() {
				return {
						validationParent: this,
						isReadOnlyMode: this.props.isReadOnlyMode
				};
		}
		
		
		/***
			* Used by ValidationInput in order to let the (parent) form know
			* the valid state. If there is a change in the state of the form,
			* the buttons will be updated.
			*
			* @param validationComponent
			* @param isValid
			*/
		childValidStateChanged(validationComponent, isValid) {
				if (isValid !== this.state.isValid) {
						let oldState = this.state.isValid;
						let newState = isValid &&
								this.validationComponents.filter(
										otherValidationComponent => validationComponent !==
										otherValidationComponent).every(otherValidationComponent => {
										return otherValidationComponent.isValid();
								});
						
						if (oldState !== newState) {
								this.setState({isValid: newState});
						}
				}
		}
		
		register(validationComponent) {
				this.validationComponents.push(validationComponent);
		}
		
		unregister(validationComponent) {
				this.childValidStateChanged(validationComponent, true);
				this.validationComponents =
						this.validationComponents.filter(
								otherValidationComponent => validationComponent !==
								otherValidationComponent);
		}
}


export default ValidationForm;
