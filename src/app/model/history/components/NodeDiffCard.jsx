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

const nodeDiffCard = (props) => {
  let showNoPropsMessage = true;
  let showNoRelationshipsMessage = true;
  if(props && props.diff && props.diff.properties){
    const properties =  Object.entries(props.diff.properties).map((property, idx) => {
      let prop = property[1];
      if(prop && prop.value && prop.value.type !== 'unchanged'){
        showNoPropsMessage = false;
        return (
          <div>
              <p><strong>Attribute:</strong> {prop.key.data} ({prop.value.type})</p>
          </div>
        );
      }else if (prop && prop.type){
        showNoPropsMessage = false;
         return (
           <div>
               <p><strong>Attribute:</strong> {prop.data.key} ({prop.type})</p>
           </div>
         );
      }
    });

    //TODO handle no relationships and no attributes

    const relationships =  Object.entries(props.diff['related-to']).map((property, idx) => {
        let prop = property[1];
        if(prop && prop.type && prop.type.type){
            return ('');
        }else if(prop && prop.type && !prop.data){
            showNoRelationshipsMessage = false;
            return (
              <div>
                <p><strong>Relationship</strong>: {prop['relationship-label'].data} {prop['node-type'].data} {prop.url.data} ({prop.type})</p>
              </div>
            );
        }else if (prop && prop.type && prop.data){
             showNoRelationshipsMessage = false;
               return (
                 <div>
                   <p><strong>Relationship</strong>: {prop.data['relationship-label']} {prop.data['node-type']} {prop.data.url} ({prop.type})</p>
                 </div>
               );
        }
      });

    return (
      <Col className='col-lg-4'>
        <div className='card model-card'>
          <div className='card-header'>
            <h4 className='card-title'>Changes from Historic to Current State</h4>
          </div>
          <div className='card-header'></div>
          <div className='card-content model-card-content'>
              {properties}
              <div className={showNoPropsMessage ? 'show' : 'hidden'}><p><strong>No Attribute differences, current.</strong></p></div>
              {relationships}
              <div className={showNoRelationshipsMessage ? 'show' : 'hidden'}><p><strong>No Relationship differences, current.</strong></p></div>
          </div>
        </div>
      </Col>
    );
  }else{
    return(
        <Col className='col-lg-4'>
                <div className='card model-card'>
                  <div className='card-header'>
                    <h4 className='card-title'>Unable to pull diff</h4>
                  </div>
                  <div className='card-header'></div>
                  <div className='card-content model-card-content'>
                      Diff unable to be calculated currently, choose a different timeframe.
                  </div>
                </div>
        </Col>
    );
  }
};

export default nodeDiffCard;

