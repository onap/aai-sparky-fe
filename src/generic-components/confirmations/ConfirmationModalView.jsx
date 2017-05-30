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

import React from 'react';
import Button from 'react-bootstrap/lib/Button.js';

import i18n from 'utils/i18n/i18n.js';
import Modal from 'generic-components/modal/Modal.jsx';

let typeClass = {
		'default': 'primary',
		error: 'danger',
		warning: 'warning',
		success: 'success'
};


class ConfirmationModalView extends React.Component {
		
		static propTypes = {
				show: React.PropTypes.bool,
				type: React.PropTypes.oneOf(['default', 'error', 'warning', 'success']),
				msg: React.PropTypes.node,
				title: React.PropTypes.string,
				confirmationDetails: React.PropTypes.object
		};
		
		static defaultProps = {
				show: false,
				type: 'warning',
				title: 'Warning',
				msg: ''
		};
		
		render() {
				let {title, type, msg, show} = this.props;
				
				return (
						<Modal show={show} className={`notification-modal ${typeClass[type]}`}
						       bsSize='small'>
								<Modal.Header>
										<Modal.Title>{title}</Modal.Title>
								</Modal.Header>
								<Modal.Body>{msg}</Modal.Body>
								<Modal.Footer>
										<Button bsStyle={typeClass[type]}
										        onClick={() => this.props.onDeclined(this.props.confirmationDetails)}>{i18n(
												'Cancel')}</Button>
										<Button bsStyle={typeClass[type]}
										        onClick={() => this.props.onConfirmed(this.props.confirmationDetails)}>{i18n(
												'Delete')}</Button>
								</Modal.Footer>
						</Modal>
				);
		};
}

export default ConfirmationModalView;
