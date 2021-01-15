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
import moment from "moment";
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';

const historyCard = (props) => {
  if(props && props.node && props.node.properties){
    const properties = (props.node.properties).map((prop, idx) => {
      return (
        <Panel>
          <Panel.Heading className="custom-accordion">
             <Panel.Title toggle> <strong>{prop.key}</strong> : {'' + prop.value}</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body className='cardwrap'>
              <p><strong>Last Updated By:</strong> {prop.sot}</p>
              <p><strong>Last Updated (time):</strong> {moment(prop.timestamp).format('dddd, MMMM Do, YYYY h:mm:ss A')}</p>
              <p><strong>Transaction Id:</strong> {(prop['tx-id']) ? prop['tx-id'] : 'N/A'}</p>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      );
    });

    //TODO handle no relationships and no attributes

    const relationships = (props.node['related-to']).map((prop, idx) => {
        return (
          <p key={idx}><strong>{prop['node-type']}:</strong> {prop.url} {prop['relationship-label']} (added by {prop.sot} on {moment(prop.timestamp).format('dddd, MMMM Do, YYYY h:mm:ss A')})</p>
        );
      });

    return (
      <Col className={""+(props.split ? 'col-lg-4' : 'col-lg-12')}>
        <div className='card model-card'>
          <div className='card-header'>
            <h4 className='card-title'>{props.node.primaryHeader}</h4>
          </div>
          <div className='card-header'>
            {props.node.secondaryHeader}
          </div>
          <div className='card-content model-card-content'>
            {properties}
          </div>
          <div className='card-footer'>
             <Panel>
               <Panel.Heading>
                 <Panel.Toggle>
                   <button type='button' className='btn btn-outline-primary'>
                     Relationships
                     </button>
                 </Panel.Toggle>
               </Panel.Heading>
               <Panel.Collapse>
                 <Panel.Body className='cardwrap'>
                   {relationships}
                 </Panel.Body>
               </Panel.Collapse>
             </Panel>
          </div>
        </div>
      </Col>
    );
  }else{
    return(
        <Col className={""+(props.split ? 'col-lg-4' : 'col-lg-12')}>
                <div className='card model-card'>
                  <div className='card-header'>
                    <h4 className='card-title'>No State Found</h4>
                  </div>
                  <div className='card-content model-card-content'>
                    No State was found at the provided timestamp. Please try another timestamp.
                  </div>
                </div>
        </Col>
    );
  }
};

export default historyCard;

