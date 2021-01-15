/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
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

const topologyDiffCard = (props) => {
  let showNoNodesMessage = true;
  if(props && props.node){
    const properties =  Object.entries(props.node).map((prop, idx) => {
        if (prop){
                    showNoNodesMessage = false;
                    let showNoRelationshipsMessage = true;
                    let showNoAttributesMessage = true;
                    let propWorkaround = prop;
                    if(prop.data){
                        propWorkaround = prop.data;
                    }
                    let tempProp = propWorkaround[1];
                    let attributeProperties = '';
                    let relationships = '';
                    if(tempProp.properties){
                        attributeProperties =  Object.entries(tempProp.properties).map((property, idx) => {
                          let attrProp = property[1];
                          if(attrProp && attrProp.value && attrProp.value.type !== 'unchanged'){
                            showNoAttributesMessage = false;
                            return (
                              <div>
                                  <p><strong>Attribute:</strong> {attrProp.key.data} ({attrProp.value.type})</p>
                              </div>
                            );
                          }else if (attrProp && attrProp.type){
                             showNoAttributesMessage = false;
                             return (
                               <div>
                                   <p><strong>Attribute:</strong> {attrProp.data.key} ({attrProp.type})</p>
                               </div>
                             );
                          }
                        });
                    }
                    if(tempProp['related-to'] || tempProp.data['related-to']){
                        let rel = null;
                        let topLevelType = null;
                        if(tempProp['related-to']){
                            rel = tempProp['related-to'];
                        }else if (tempProp.data['related-to']) {
                            rel = tempProp.data['related-to'];
                            topLevelType = tempProp.type;
                        }
                        relationships =  Object.entries(rel).map((property, idx) => {
                                let relationProp = property[1];
                                if(relationProp && relationProp.type && relationProp.type.type &&  relationProp.type.type !== "unchanged"){
                                    return ('');
                                }else if(relationProp && relationProp.type && !relationProp.type.type && relationProp.url && relationProp.url.data){
                                    showNoRelationshipsMessage = false;
                                    return (
                                      <div>
                                        <p><strong>Relationship</strong>: {relationProp['relationship-label'].data} {relationProp['node-type'].data} {relationProp.url.data} ({relationProp.type})</p>
                                      </div>
                                    );
                                }else if (relationProp && relationProp.type && relationProp.data){
                                     showNoRelationshipsMessage = false;
                                       return (
                                         <div>
                                           <p><strong>Relationship</strong>: {relationProp.data['relationship-label']} {relationProp.data['node-type']} {relationProp.data.url} ({relationProp.type})</p>
                                         </div>
                                       );
                                }else if (topLevelType){
                                    showNoRelationshipsMessage = false;
                                    return (
                                              <div>
                                                <p><strong>Relationship</strong>: {relationProp['relationship-label']} {relationProp['node-type']} {relationProp.url} ({topLevelType})</p>
                                              </div>
                                            );
                                }
                        });
                    }
                       return (
                             <Panel>
                                <Panel.Heading className="custom-accordion">
                                   <Panel.Title toggle><strong>Node:</strong> {prop[0]} <p className={tempProp.type ? 'show' : 'hidden'}>({tempProp.type})</p></Panel.Title>
                                </Panel.Heading>
                                <Panel.Collapse>
                                  <Panel.Body className='cardwrap'>
                                    {attributeProperties}
                                    <div className={showNoAttributesMessage ? 'show' : 'hidden'}><p><strong>No Attribute differences, current.</strong></p></div>
                                    {relationships}
                                    <div className={showNoRelationshipsMessage ? 'show' : 'hidden'}><p><strong>No Relationship differences, current.</strong></p></div>
                                  </Panel.Body>
                                </Panel.Collapse>
                             </Panel>
                       );
              }else{
                  <div>
                      <p><strong>Node changes in the topology states</strong></p>
                  </div>
              }
        });

    return (
      <Col className='col-lg-12'>
        <div className='card model-card'>
          <div className='card-header'>
            <h4 className='card-title'>Changes from Historic to Current State</h4>
          </div>
          <div className='card-header'></div>
          <div className='card-content model-card-content'>
              {properties}
          </div>
        </div>
      </Col>
    );
  }else{
    return(
        <Col className='col-lg-12'>
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

export default topologyDiffCard;

