/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2021 AT&T Intellectual Property. All rights reserved.
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

import React from 'react';
import BrowseCard from 'app/browse/BrowseCard.jsx';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';

const browseGallery = (props) => {
	
	// Build all the BrowseCards
	const cards = props.invList.map((item) => {
		return (
			<BrowseCard
				key={item.item}
				browseItem={item.item}
				browseName={item.detail.display}
				browseModel={item.detail.modelPath}
				browseIcon={item.detail.icon}
				browsePath={item.detail.apiPath} 
				browseDesc={props.descriptionList[0][item.detail.modelPath]}/>
		);
	});
	// Return jsx to caller
	return (
		<Grid>
			<Row className='show-grid'>
				{cards}
			</Row>
		</Grid>
	);
};

export default browseGallery;
