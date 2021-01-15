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
import ModelRelationships from './ModelRelationships.jsx';
import Col from 'react-bootstrap/lib/Col';

const modelNodeCard = (props) => {

  console.log('[Model Node Card] props : ', props);
  const properties = Object.keys(props.nodeProps).map( (prop, idx) => {
    return (
      <p key={idx}><strong> {prop} : </strong> { props.nodeProps[prop].toString()} </p>
    );
  });

  return (
    <Col lg={8} md={8} sm={10}>
      <div className='card model-card'>
        <div className='card-header'>
          Node {props.nodeId}
        </div>
        <div className='card-content model-card-content'>
          {properties}
        </div>
      </div>
      <ModelRelationships relatives={props}/>
    </Col>
  );
};

export default modelNodeCard;


