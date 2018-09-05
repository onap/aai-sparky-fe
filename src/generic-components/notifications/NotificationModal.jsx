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
/**
	* NotificationModal options:
	*
	* show: whether to show notification or not,
	* type: the type of the notification. valid values are: 'default', 'error',
	* 'warning', 'success' msg: the notification content. could be a string or
	* node (React component) title: the notification title timeout: timeout for
	* the notification to fade out. if timeout == 0 then the notification is
	* rendered until the user closes it
	*
	*/
import React, {Component, PropTypes} from 'react';
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';
import Button from 'react-bootstrap/lib/Button.js';

import i18n from 'utils/i18n/i18n.js';
import Modal from 'generic-components/modal/Modal.jsx';
import NotificationConstants from './NotificationConstants.js';

let typeClass = {
		'default': 'primary',
		error: 'danger',
		warning: 'warning',
		success: 'success'
};

const mapActionsToProps = (dispatch) => {
		return {
				onCloseClick: () => dispatch({type: NotificationConstants.NOTIFY_CLOSE})
		};
};

const mapStateToProps = ({notification}) => {
		
		let show = notification !== null && notification.title !== 'Conflict';
		let mapResult = {show};
		if (show) {
				mapResult = {show, ...notification};
		}
		
		return mapResult;
};

class NotificationModal extends Component {
		
		static propTypes = {
				show: PropTypes.bool,
				type: PropTypes.oneOf(['default', 'error', 'warning', 'success']),
				msg: PropTypes.node,
				title: PropTypes.string,
				timeout: PropTypes.number
		};
		
		static defaultProps = {
				show: false,
				type: 'default',
				title: '',
				msg: '',
				timeout: 0
		};
		
		state = {type: undefined};
		
		componentWillReceiveProps(nextProps) {
				if (this.props.show !== nextProps.show && nextProps.show === false) {
						this.setState({type: this.props.type});
				}
				else {
						this.setState({type: undefined});
				}
		}
		
		componentDidUpdate() {
				if (this.props.timeout) {
						setTimeout(this.props.onCloseClick, this.props.timeout);
				}
		}
		
		render() {
				let {title, type, msg, show} = this.props;
				if (!show) {
						type = this.state.type;
				}
				return (
						<Modal show={this.props.show}
						       className={`notification-modal ${typeClass[type]}`}>
								<Modal.Header>
										<Modal.Title>{title}</Modal.Title>
								</Modal.Header>
								<Modal.Body>{msg}</Modal.Body>
								<Modal.Footer>
										<Button bsStyle={typeClass[type]}
										        onClick={this.props.onCloseClick}>{i18n('OK')}</Button>
								</Modal.Footer>
						</Modal>
				);
		}
}

export default connect(mapStateToProps, mapActionsToProps)(NotificationModal);
