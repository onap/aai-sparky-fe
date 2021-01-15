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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Label from 'react-bootstrap/lib/Label';
import Panel from 'react-bootstrap/lib/Panel';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import {ExportExcel} from 'utils/ExportExcel.js';
let buildAttrList = ExportExcel.buildAttrList;

let INVLIST = GlobalExtConstants.INVLIST;

class ModelRelationships extends Component {
  constructor(props){
      console.log(props);
      super(props);
      this.props = props;
  }

  render(){
  console.log('[ModelRelationships.jsx] props : ', this.props);
  let relationships = null;
  let navigateByoq = null;
  let relativesArray = [];
  this.nodeDisplay = this.props.relatives.nodeType + ' : ' + (this.props.relatives.nodeUrl).split(this.props.relatives.nodeType + '\/').pop();
  this.historyClick = () => {
    this.props.openHistoryModal(this.nodeDisplay, this.props.relatives.nodeUrl,this.props.relatives.nodeType);
  }

  if (this.props.relatives.nodeRelatives && this.props.relatives.nodeRelatives.length > 0) {
    relationships = this.props.relatives.nodeRelatives.sort(function(a, b) {
                                                   var compareA = (a['node-type'] + (a.url).split(a['node-type']+'\/').pop()).toLowerCase();
                                                   var compareB = (b['node-type'] + (b.url).split(a['node-type']+'\/').pop()).toLowerCase();
                                                   if(compareA < compareB) return -1;
                                                   if(compareA > compareB) return 1;
                                                   return 0;
                                                  }).map((relative, idx) => {
                                                  if (relativesArray.includes(relative['node-type']) === false) relativesArray.push(relative['node-type']);
      return (
        <div>
          <Link
            key={idx}
            to={{
              pathname: '/model/' + relative['node-type'] + '/' + relative.id + '/'+  this.props.relatives.enableRealTime,
              uri: relative.url,
              historyStackString: this.props.historyStackString
            }}>
            {relative['node-type']}: {(decodeURI((relative.url).split(relative['node-type']+'\/').pop())).replace(/%2F/g,'/')}</Link> <Label bsStyle='default'>{relative['relationship-label'].slice(33)}</Label>
        </div>
      );
    });
  }
    relativesArray = relativesArray.join('&');
    var propKey = '';
    var requiredParams = buildAttrList(this.props.relatives.nodeType,[],'mandatory');
    var aliasColumnFilters = (this.props.relatives.aliasColumnList && this.props.relatives.aliasColumnList[this.props.relatives.nodeType])?this.props.relatives.aliasColumnList[this.props.relatives.nodeType][0]:[];
    console.log('requiredParams>>>>>>>>>>>>',requiredParams);
    Object.keys(this.props.relatives.nodeProps).map((prop, idx) => {           
      for(var a in requiredParams){        
        let alias='';
        if(aliasColumnFilters && aliasColumnFilters[requiredParams[a].value]){
          alias=requiredParams[a].value;
          requiredParams[a].value=aliasColumnFilters[requiredParams[a].value];          
        }
        if(requiredParams[a].value === prop){
          let tag= (alias!='')? alias: prop;
          if(propKey === ''){
            propKey = tag + ':' + btoa('<pre>' + this.props.relatives.nodeProps[prop].toString() + '</pre>');
          }else{
            propKey = propKey + ';' + tag + ':' + btoa('<pre>' + this.props.relatives.nodeProps[prop].toString() + '</pre>');
          }        
        }
      }
    });
    let pathNameStr = (relativesArray.length>0) ? '/customDsl/' + this.props.relatives.nodeType + '/' + propKey + '/' + relativesArray : '/customDsl/' + this.props.relatives.nodeType + '/' + propKey;
    navigateByoq = <Link
                    to={{
                      pathname: pathNameStr
                     }}>
                     <button type='button' className='btn btn-primary pull-right'>>>BYOQ</button>
                   </Link>;
  if (this.props.relatives.nodeRelatives && this.props.relatives.nodeRelatives.length > 0) {
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Toggle>
            <button type='button' className='btn btn-outline-primary'>
              Relationships
              </button>
          </Panel.Toggle>
            { INVLIST.isHistoryEnabled && (<button type='button' className='btn btn-outline-primary' onClick={this.historyClick}>
              History
            </button>)}
            {navigateByoq}
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body className='cardwrap'>
            {relationships}
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  } else {
    return (
      <div>
        <button type='button' className='btn btn-outline-disabled'>
          No relationships
        </button>
        { INVLIST.isHistoryEnabled && (<button type='button' className='btn btn-outline-primary' onClick={this.historyClick}>
          History
        </button>)}
        {navigateByoq}
      </div>
    );
  }
}
};

export default ModelRelationships;
