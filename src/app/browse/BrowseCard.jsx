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
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';

const BrowseCard = (props) => (
<Link to={'/model/' + props.browseModel}>
  <Col lg={2} md={3} sm={4}>
    <div className='card' title={props.browseDesc}>
      <div className='card-content browse-card-content'>
        <i className={props.browseIcon} aria-hidden='true'> </i>
        <div className='card-block'>
          <h3 className='card-title'>
            {props.browseName}
          </h3>
        </div>
      </div>
      <div className='card-footer'>
          <button type='button' className='btn btn-outline-primary'>Browse</button>
      </div>
    </div>
  </Col>
  </Link>
);

export default BrowseCard;
