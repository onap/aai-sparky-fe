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
import ReactDOM from 'react-dom';
import Tabs from 'react-bootstrap/lib/Tabs.js';
import Overlay from 'react-bootstrap/lib/Overlay.js';
import Tooltip from 'react-bootstrap/lib/Tooltip.js';

import i18n from 'utils/i18n/i18n.js';

export default
class ValidationTab extends React.Component {
		
		static propTypes = {
				children: React.PropTypes.node
		};
		
		state = {
				invalidTabs: []
		};
		
		cloneTab(element) {
				const {invalidTabs} = this.state;
				return React.cloneElement(
						element,
						{
								key: element.props.eventKey,
								tabClassName: invalidTabs.indexOf(element.props.eventKey) > -1
										? 'invalid-tab'
										: 'valid-tab',
								onValidationStateChange: (
										eventKey, isValid) => this.validTabStateChanged(eventKey, isValid)
						}
				);
		}
		
		validTabStateChanged(eventKey, isValid) {
				let {invalidTabs} = this.state;
				let invalidTabIndex = invalidTabs.indexOf(eventKey);
				if (isValid && invalidTabIndex > -1) {
						this.setState({
								invalidTabs: invalidTabs.filter(
										otherEventKey => eventKey !== otherEventKey)
						});
				} else if (!isValid && invalidTabIndex === -1) {
						this.setState({invalidTabs: [...invalidTabs, eventKey]});
				}
		}
		
		showTabsError() {
				const {invalidTabs} = this.state;
				return invalidTabs.length >
						0 &&
						(invalidTabs.length > 1 || invalidTabs[0] !== this.props.activeKey);
		}
		
		render() {
				return (
						<div>
								<Tabs {...this.props} ref='tabsList'>
										{this.props.children.map(element => this.cloneTab(element))}
								</Tabs>
								<Overlay
										animation={false}
										show={this.showTabsError()}
										placement='bottom'
										target={() => {
						let target = ReactDOM.findDOMNode(this.refs.tabsList).querySelector('ul > li.invalid-tab:not(.active):nth-of-type(n)');
						return target && target.offsetParent ? target : undefined;
					}
					}
										container={this}>
										<Tooltip
												id='error-some-tabs-contain-errors'
												className='validation-error-message'>
												{i18n('One or more tabs are invalid')}
										</Tooltip>
								</Overlay>
						</div>
				);
		}
}
