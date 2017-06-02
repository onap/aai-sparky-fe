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

import React, {Component} from 'react';

import TempCreateAttributes from './TempCreateAttributes.js';

class Link extends Component {
		
		static propTypes = {
				x1: React.PropTypes.number,
				y1: React.PropTypes.number,
				x2: React.PropTypes.number,
				y2: React.PropTypes.number,
				linkAttributes: React.PropTypes.object
		};
		
		static defaultProps = {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0,
				linkAttributes: {}
		};
		
		render() {
				let {x1, y1, x2, y2, linkAttributes} = this.props;
				
				let combinedAttributes = {
						...linkAttributes,
						x1: x1,
						y1: y1,
						x2: x2,
						y2: y2
				};
				
				return (
						<line {...combinedAttributes}
								style={TempCreateAttributes.createLineStyle()}/>
				);
		}
}

export default Link;
