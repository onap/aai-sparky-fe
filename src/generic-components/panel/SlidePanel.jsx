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
import FontAwesome from 'react-fontawesome';
import ReactDOM from 'react-dom';

class SlidePanel extends React.Component {
		
		static PropTypes = {
				direction: React.PropTypes.string.isRequired,
				className: React.PropTypes.string,
				title: React.PropTypes.string,
				isOpen: React.PropTypes.bool
		};
		
		static defaultProps = {
				title: '',
				className: '',
				isOpen: true
		};
		
		state = {
				isOpen: this.props.isOpen,
				direction: this.props.direction,
				width: 0,
				arrowWidth: 0
		};
		
		componentDidMount() {
				this.setSliderPosition();
		}
		
		componentDidUpdate() {
				this.setSliderPosition();
		}
		
		render() {
				
				let {children, className} = this.props;
				let {isOpen} = this.state;
				
				return (
						<div className={ `slide-panel ${className}`}>
								{this.renderHeader(isOpen)}
								<div
										className={'slide-panel-content ' + (isOpen ? 'opened' : 'closed')}>{children}</div>
						</div>
				);
		}
		
		renderHeader(isOpen) {
				let {direction: initialDirection, title} = this.props;
				let {direction: currentDirection} = this.state;
				
				let iconName = currentDirection ===
				               'right'
						? 'angle-double-right collapse-double-icon'
						: 'angle-double-left collapse-double-icon';
				
				let awestyle = {padding: '5px'};
				
				if (!isOpen && initialDirection === 'right') {
						awestyle.marginLeft = '-1px';
				}
				return (
						<div className='slide-panel-header'>
								{ initialDirection === 'left' &&
								<span className='slide-panel-header-title'>{title}</span>}
								<FontAwesome
										ref='arrowIcon'
										style={awestyle}
										onClick={this.handleClick}
										className='pull-right'
										name={iconName}
										size='2x'/>
								{ initialDirection === 'right' &&
								<span className='slide-panel-header-title'>{title}</span>}
						</div>
				);
		}
		
		handleClick = () => {
				this.setState({
						isOpen: !this.state.isOpen,
						direction: this.state.direction === 'left' ? 'right' : 'left'
				});
		}
		
		setSliderPosition = () => {
				
				let el = ReactDOM.findDOMNode(this);
				let {style} = el;
				
				let {direction: initialDirection} = this.props;
				let arrowIconSize = Math.floor(ReactDOM.findDOMNode(this.refs.arrowIcon)
				                                       .getBoundingClientRect().width) * 2;
				if (!this.state.isOpen) {
						if (this.props.direction === 'left') {
								style.left = arrowIconSize - el.getBoundingClientRect().width + 'px';
						}
						if (initialDirection === 'right') {
								style.right = arrowIconSize - el.getBoundingClientRect().width + 'px';
						}
				}
				else {
						if (initialDirection === 'left') {
								style.left = '0px';
						}
						
						if (this.props.direction === 'right') {
								style.right = '0px';
						}
				}
		}
		
}

export default SlidePanel;
