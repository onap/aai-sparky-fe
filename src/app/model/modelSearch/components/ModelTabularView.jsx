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

import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, customFilter } from 'react-bootstrap-table2-filter';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Label from 'react-bootstrap/lib/Label';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import {ExportExcel} from 'utils/ExportExcel.js';
let buildAttrList = ExportExcel.buildAttrList;

let INVLIST = GlobalExtConstants.INVLIST;

  class RelationshipList extends Component {

	
	constructor(props) {
	  super(props);
	  this.props = props;
	  this.relationships = null;
	  this.relativesArray = [];
	  this.state = {
		  filteron:false

	  }
	}
	render() {


	  let navigateByoq = null;
	  this.nodeDisplay = this.props.nodeType + ' : ' + (this.props.nodeUrl).split(this.props.nodeType + '\/').pop();
	  this.historyClick = () => {
		this.props.openHistoryModal(this.nodeDisplay, this.props.nodeUrl,this.props.nodeType);
	  }
	  this.filter = (e) =>{
			let filterValue = e.target.value;
			this.returnFilterList(filterValue);
			this.setState({filteron:true});
	  }
	  this.returnFilterList = (filterValue) =>{
	  if (this.props.nodeRelatives && this.props.nodeRelatives.length > 0) {
		this.relationships = null;	
		this.relationships = this.props.nodeRelatives.sort(function(a, b) {
													   var compareA = (a['node-type'] + (a.url).split(a['node-type']+'\/').pop()).toLowerCase();
													   var compareB = (b['node-type'] + (b.url).split(a['node-type']+'\/').pop()).toLowerCase();
													   if(compareA < compareB) return -1;
													   if(compareA > compareB) return 1;
													   return 0;
													  }).map((relative, idx) => {
													  if (this.relativesArray.includes(relative['node-type']) === false) this.relativesArray.push(relative['node-type']);
													  if(filterValue === '' || filterValue === ':' || relative['node-type'].toLowerCase().search(filterValue.toLowerCase()) != -1 || (decodeURI((relative.url).split(relative['node-type']+'\/').pop())).replace(/%2F/g,'/').toLowerCase().search(filterValue.toLowerCase()) != -1){
		  return (
		  	<li key={idx + '' +relative.id}>
			  <Link
				key={idx}
				to={{
				  pathname: '/model/' + relative['node-type'] + '/' + relative.id + '/'+ this.props.enableRealTime,
				  uri: relative.url,
				  historyStackString: this.props.historyStackString
				}}>
						{relative['node-type']}: {(decodeURI((relative.url).split(relative['node-type']+'\/').pop())).replace(/%2F/g,'/')}</Link> <Label bsStyle='default'>{relative['relationship-label'].slice(33)}</Label>
					</li>			
		  );
				}
		});
	  }
		}		
		if(!this.state.filteron){
			this.returnFilterList('');
		}		
		let relativesArray = (this.relativesArray.length > 0) ? this.relativesArray.join('&') : this.relativesArray;
		var propKey = '';
			var requiredParams = buildAttrList(this.props.nodeType,[],'mandatory');
			var aliasColumnFilters = (this.props.aliasColumnList && this.props.aliasColumnList[this.props.nodeType])?this.props.aliasColumnList[this.props.nodeType][0]:[];
      Object.keys(this.props.nodeProps).map((prop, idx) => {      
	      for(var a in requiredParams){
					let alias='';
					if(aliasColumnFilters && aliasColumnFilters[requiredParams[a].value]){
						alias=requiredParams[a].value;
						requiredParams[a].value=aliasColumnFilters[requiredParams[a].value];						
					}
	        if(requiredParams[a].value === prop){
						let tag= (alias!='')? alias: prop;
	          if(propKey === ''){
	            propKey =  tag + ':' + btoa(this.props.nodeProps[prop].toString());
	          }else{
	            propKey = propKey + ';' + tag + ':' + btoa(this.props.nodeProps[prop].toString());
	          }        
	        }
	      }
	    });
	    let editModalIcon = <a className={this.props.isWriteAllowed ? 'show' : 'hidden'} onClick={e => {this.props.openEditNodeModal(this.props.nodeUrl)}}><i style={{cursor: 'pointer'}} className="pull-right fa fa-pencil-square-o" aria-hidden="true"></i></a>;
	    let pathNameStr = (relativesArray.length>0) ? '/customDsl/' + this.props.nodeType + '/' + propKey + '/' + relativesArray : '/customDsl/' + this.props.nodeType + '/' + propKey;
	    navigateByoq = <Link
	                    to={{
	                      pathname: pathNameStr
	                     }}>
	                     <button type='button' className='btn btn-primary pull-right'>>>BYOQ</button>
	                   </Link>;
	  let relationships = [];
	  if(this.relationships){
	  	for(var n=0 ; n < this.relationships.length ; n++){
		  if(this.relationships[n]){
			relationships.push(this.relationships[n]);
		  }
		}
	  }	
	  if (this.props.nodeRelatives && this.props.nodeRelatives.length > 0) {
		return (
		  <div>
			<div style={{float: 'left'}}>
				<table className='relationshipTable table-striped table-hover table-bordered table-sm'>
					<thead>
						<tr className='table-header-view'>
							<th titlename='Relationships'>
								Relationships
								<div>
									<input
										key='input'
										type='text'
										placeholder='Enter Relationship...'  
										onChange={(e) => this.filter(e)}      
					  />
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
					<tr>
						<td>
							<ul>
								{relationships}
							</ul>
						</td>
					</tr>
					</tbody>
				</table>
			</div>
			<div style={{float: 'left', margin: '10px'}}>
				{ INVLIST.isHistoryEnabled && (<button type='button' className='btn btn-primary pull-right' onClick={this.historyClick}>
					History
				  </button>)}
			</div>
			<div style={{float: 'left',margin: '10px'}}>
				{navigateByoq}
			</div>
			<div style={{float: 'left',margin: '10px'}}>
            	{editModalIcon}
            </div>
		  </div>
		)
	  } else {
		return (
		  <div>
		  	<div style={{float: 'left', margin: '10px'}}>
				<button type='button' className='btn btn-outline-disabled'>
				  No relationships
				</button>
			</div>
			<div style={{float: 'left', margin: '10px'}}>
				{ INVLIST.isHistoryEnabled && (<button type='button' className='btn btn-primary' onClick={this.historyClick}>
				  History
				</button>)}
			</div>
			<div style={{float: 'left', margin: '10px'}}>
				{navigateByoq}
		  	</div>
		  	<div style={{float: 'left',margin: '10px'}}>
            	{editModalIcon}
            </div>
		  </div>
		);
	  }
	}
  }

export default RelationshipList;
//export default AttributeFilter;
