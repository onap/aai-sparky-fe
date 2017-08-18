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
import React from 'react';
import Tab from 'react-bootstrap/lib/Tab.js';

export default
class ValidationTab extends React.Component {
		
		static propTypes = {
				children: React.PropTypes.node,
				eventKey: React.PropTypes.any.isRequired,
				onValidationStateChange: React.PropTypes.func //This property is assigned
		                                                // dynamically via
		                                                // React.cloneElement. lookup
		                                                // ValidationTabs.jsx.
		                                                // therefore it cannot be
		                                                // stated as required!
		};
		
		constructor(props) {
				super(props);
				this.validationComponents = [];
		}
		
		static childContextTypes = {
				validationParent: React.PropTypes.any
		};
		
		static contextTypes = {
				validationParent: React.PropTypes.any
		};
		
		getChildContext() {
				return {validationParent: this};
		}
		
		state = {
				isValid: true,
				notifyParent: false
		};
		
		componentDidMount() {
				let validationParent = this.context.validationParent;
				if (validationParent) {
						validationParent.register(this);
				}
		}
		
		componentWillUnmount() {
				let validationParent = this.context.validationParent;
				if (validationParent) {
						validationParent.unregister(this);
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
		
		notifyValidStateChangedToParent(isValid) {
				
				let validationParent = this.context.validationParent;
				if (validationParent) {
						validationParent.childValidStateChanged(this, isValid);
				}
		}
		
		childValidStateChanged(validationComponent, isValid) {
				
				const currentValidState = this.state.isValid;
				if (isValid !== currentValidState) {
						let filteredValidationComponents = this.validationComponents.filter(
								otherValidationComponent => validationComponent !==
								otherValidationComponent);
						let newValidState = isValid &&
								filteredValidationComponents.every(otherValidationComponent => {
										return otherValidationComponent.isValid();
								});
						this.setState({isValid: newValidState, notifyParent: true});
				}
		}
		
		validate() {
				let isValid = true;
				this.validationComponents.forEach(validationComponent => {
						const isValidationComponentValid = validationComponent.validate().isValid;
						isValid = isValidationComponentValid && isValid;
				});
				this.setState({isValid, notifyParent: false});
				return {isValid};
		}
		
		componentDidUpdate(prevProps, prevState) {
				if (prevState.isValid !== this.state.isValid) {
						if (this.state.notifyParent) {
								this.notifyValidStateChangedToParent(this.state.isValid);
						}
						this.props.onValidationStateChange(this.props.eventKey,
								this.state.isValid);
				}
		}
		
		isValid() {
				return this.state.isValid;
		}
		
		render() {
				let {children, ...tabProps} = this.props;
				return (
						<Tab {...tabProps}>{children}</Tab>
				);
		}
}
