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
import React, {Component} from 'react';
import NodeVisualElementConstants from './NodeVisualElementConstants';

class SVGShape extends Component {
		
		static propTypes = {
				shapeType: React.PropTypes.string.isRequired,
				shapeAttributes: React.PropTypes.object.isRequired,
				shapeClass: React.PropTypes.object.isRequired,
				textValue: React.PropTypes.string
		};
		
		static defaultProps = {
				shapeType: '',
				shapeAttributes: {},
				shapeClass: {},
				textValue: ''
		};
		
		render() {
				let {shapeType, shapeAttributes, shapeClass, textValue} = this.props;
				
				switch (shapeType) {
						case NodeVisualElementConstants.SVG_CIRCLE:
								return <circle {...shapeAttributes} className={shapeClass}/>;
						
						case NodeVisualElementConstants.SVG_LINELINE:
								return <line {...shapeAttributes} className={shapeClass}/>;
						
						case NodeVisualElementConstants.TEXT:
								return <text {...shapeAttributes}
										className={shapeClass}>{textValue}</text>;
						
						default:
								return undefined;
				}
		}
}

export default SVGShape;
