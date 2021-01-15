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
import ModelRelationships from './ModelRelationships.jsx';
import { Link } from 'react-router-dom';
import {ExportExcel} from 'utils/ExportExcel.js';
let buildAttrList = ExportExcel.buildAttrList;

const modelCard = (props) => {

  var propKey = '';
  var navigateQueryBuilder = '';
  var editModalIcon = '';
  var requiredParams = buildAttrList(props.nodeType,[],'mandatory');
  const properties = Object.keys(props.nodeProps).map((prop, idx) => {
    let description='';
    for(var a in requiredParams){
      if(requiredParams[a].value === prop){
        description=requiredParams[a].description;
        if(propKey === ''){
          propKey = prop + ':' + btoa('<pre>' + props.nodeProps[prop].toString() + '</pre>');
        }else{
          propKey = propKey + ';' + prop + ':' + btoa('<pre>' + props.nodeProps[prop].toString() + '</pre>');
        }
      }
    }
    return (
      <p className='pre-wrap-text' key={idx}><strong title={description}>{prop}:</strong> {props.nodeProps[prop].toString()}</p>
    );
  });
  let pathNameStr = '/customDslBuilder/' + props.nodeType + '/' + propKey;
  editModalIcon = <a className={props.isWriteAllowed ? 'show' : 'hidden'} onClick={e => {props.openEditNodeModal(props.nodeUrl)}}><i style={{cursor: 'pointer'}} className="pull-right fa fa-pencil-square-o" aria-hidden="true"></i></a>;
  navigateQueryBuilder = <Link
                  to={{
                    pathname: pathNameStr
                   }}>
                   <i className={'icon-misc-operationsL pull-right'} role="img"></i>
                   </Link>;
  return (
    <div className='card model-card'>
      <div className='card-header'>
        <h4 className='card-title'>{props['nodeType']}{editModalIcon}{navigateQueryBuilder}</h4>
      </div>
      <div className='card-header'>
        {props.nodeUrl}
      </div>
      <div className='card-content model-card-content'>
        {properties}
      </div>
      <div className='card-footer'>
        <ModelRelationships historyStackString={props.historyStackString} relatives={props} openHistoryModal={props.openHistoryModal} />
      </div>
    </div>
  );
};

export default modelCard;
