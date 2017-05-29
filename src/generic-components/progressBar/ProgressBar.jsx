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

class ProgressBar extends React.Component {
		static propTypes = {
				label: React.PropTypes.string,
				now: React.PropTypes.string.isRequired
		}
		
		render() {
				let {label, now} = this.props;
				
				return (
						<div className='progress-bar-view'>
								<div className='progress-bar-outside'>
										<div style={{width: now + '%'}} className='progress-bar-inside'></div>
								</div>
								<div className='progress-bar-view-label'>{label}</div>
						</div>
				);
		}
}

export default ProgressBar;
