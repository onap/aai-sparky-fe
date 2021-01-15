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
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ModelCard from './ModelCard.jsx';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import BootstrapTable from 'react-bootstrap-table-next';
import {ExportExcel} from 'utils/ExportExcel.js';
import filterFactory, { textFilter, customFilter } from 'react-bootstrap-table2-filter';
//import overlayFactory from 'react-bootstrap-table2-overlay';
import OutputVisualization from 'generic-components/OutputVisualization.jsx';
import RelationshipList from './ModelTabularView.jsx';
import PropTypes from 'prop-types';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import commonApi from 'utils/CommonAPIService.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import {GeneralCommonFunctions} from 'utils/GeneralCommonFunctions.js';
import Spinner from 'utils/SpinnerContainer.jsx';

let INVLIST = GlobalExtConstants.INVLIST;
let ENVIRONMENT = GlobalExtConstants.ENVIRONMENT;

/**
 * This function will take all of the node objects and turn them into
 * a ui grid of ModelCard components. This function is essentially a container
 * for the ModelCards
 * @param props
 * @returns {*}
 */
class AttributeFilter extends Component {
  
  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.getValue = this.getValue.bind(this);
    this.props = props;
    this.state = {
      filterText: '',
      isPageChange: this.props.isPageChange,
      columnValue : ''
    };
  }
  getValue = () => {
    return this.input.value;
  }
  setPlaceHolder = () => {
    let filterText = '';
    if(filterText === ''){
      filterText = 'Enter ' + this.props.column.text;
    }
    return filterText;
  }
  setFilterValue = () =>{
    let filterText = '';
    var columnFilter = this.props.columnFilterList[this.props.nodeType][0];
    for(var i=0;i<columnFilter.length;i++){
      if(columnFilter[i][this.props.column.text] != undefined){
        filterText = columnFilter[i][this.props.column.text];        
      }
    }    
    return filterText;
  }
  filter = () => {
    let txt=this.props.column.text;
    let obj = {};
    obj[txt] = this.getValue();
    var columnFilterList = this.props.columnFilterList;
    var columnFilter = columnFilterList[this.props.nodeType][0];    
   for(var i=0;i<columnFilter.length;i++){
      if(columnFilter[i][txt] != undefined){
        columnFilter[i][txt] = this.getValue();
        columnFilterList[this.props.nodeType] = [];
        columnFilterList[this.props.nodeType].push(columnFilter);
        this.props.handleOnFilter(columnFilterList,this.props.nodeType,this.props.columns,this.getValue(),this.props.aliasColumnList);        
        this.props.onFilter(this.getValue());      
      }
    }
  }
  render() {
    return (
      <div>
        
          <input
          key="input"
          ref={ node => this.input = node }
          type="text"
            placeholder={this.setPlaceHolder()}
           // value={this.setFilterValue}
            onChange={this.filter}
          />
        
      </div>
    )
  }
}

class ModelGallery extends Component {
  constructor(props){
    super(props);
    this.props = props;
    this.state = {
      rerender: false,
      expanded: [],
      columnFilterList : {},
      columnsList: {},
      aliasColumnList: {},
      nodeType: '',
      disableFilter: true,
      showEditNodeModal: false,
      focusedNode: null,
      isEditSuccess: false,
      isWriteAllowed: sessionStorage.getItem(ENVIRONMENT + 'roles') && sessionStorage.getItem(ENVIRONMENT + 'roles').indexOf('ui_write') > -1,
      editInputFields: []
    }
  }
  componentWillMount() {
    console.log('Model gallery component will mount****');
  }
  componentWillUnmount() {
    console.log('Model Gallery component will unmount****');
  }
  handleOnExpand = (row, isExpand, rowIndex, e) => {
    console.log('handleOnExpand single Row...',row.id);
    if (isExpand) {
      this.setState(() => ({
        expanded: [...this.state.expanded,row.id]
      }));
    } else {
      this.setState(() => ({
        expanded: this.state.expanded.filter(x => x !== row.id)
      }),function () { this.forceUpdate(); }.bind(this));
      
    }
  }
  handleOnExpandAll = (isExpand, rows, e) => {
    console.log('handleOnExpandAll to expand all rows');
    var expandArr = [];    
    if (isExpand) {
      for(var r=0; r < rows.length; r++){
        expandArr.push(rows[r].id);
      }     
    }
    this.setState(() => ({
      expanded: expandArr
    }),function () { this.forceUpdate(); }.bind(this));
    
  } 
  handleOnFilter = (colFilterList,nodeType,columns,value,aliasColumnList) =>{
    console.log('handleOnFilter to Re-render',colFilterList);
    var applyState = true;
    if(value === ''){
      Object.keys(colFilterList).forEach(function(pkey){
        var filterList = colFilterList[pkey][0];
        for(var j in filterList){
          Object.keys(filterList[j]).forEach(function(key){         
            if(filterList[j][key] !== ''){
              applyState = false;
            }
          });
        }        
      });
    }else{
      applyState = false;
    }  
    this.setState({columnFilterList : colFilterList,rerender:true,columnsList : columns,nodeType: nodeType, disableFilter: applyState,aliasColumnList: aliasColumnList});    
  } 
  generateRegexForDsl= (nodeType) =>{
    var nodePatternwithProp = nodeType+"\\*\\{.*?\\}\\(.*?\\)[\\,|\\>|\\]|\\)]|"+nodeType+"\\*\\(.*?\\)\\{.*?\\}[\\,|\\>|\\]|\\)]|"+nodeType+"\\{.*?\\}\\(.*?\\)[\\,|\\>|\\]|\\)]|"+nodeType+"\\(.*?\\)\\{.*?\\}[\\,|\\>|\\]|\\)]|"+nodeType+"\\{.*?\\}[\\,|\\>|\\]|\\)]|"+nodeType+"\\*\\{.*?\\}[\\,|\\>|\\]|\\)]";
		return nodePatternwithProp;
  }
  /* Start Edit Node Modal Functions */
  closeEditNodeModal = () =>{
    this.setState({editErrMsg: null, editInfoMsg: null, showEditNodeModal:false});
  }
  submitEditNodeModal = () =>{
    var payload = {"operations": []};
    const settings = {
      'NODESERVER': INVLIST.NODESERVER,
      'PROXY': INVLIST.PROXY,
      'PREFIX': INVLIST.PREFIX,
      'VERSION': INVLIST.VERSION,
      'USESTUBS': INVLIST.useStubs,
      'APERTURE': INVLIST.APERTURE,
      'APERTURE_SERVICENAME':INVLIST.APERTURE_SERVICENAME
    };
    let delimiter = '\/';
    let start = 3;
    if((this.state.focusedNode.url).indexOf("/aperture/v") > -1){
        start = 4;
    }
    let tokens = (this.state.focusedNode.url).split(delimiter).slice(start);
    let patchURL = tokens.join(delimiter);
    var entry = {
                    "action": "patch",
                    "uri": patchURL,
                    "body": {}
                };
    let path = "bulk/single-transaction";
    this.setState({editErrMsg: null, isPatchLoading: true});
    for(var key in this.state.editInputFields){
        if(this.state.editInputFields[key].isEdited){
            if(this.state.editInputFields[key].newValue !== ""){
                entry.body[key] =  encodeURI(this.state.editInputFields[key].newValue);
            }else{
                entry.body[key] = null;
            }
        }
    }
    payload.operations.push(entry);
    console.log('ModelGallery: settings:' + JSON.stringify(settings));
    console.log('ModelGallery: path:' + path);
    console.log('ModelGallery: payload:' + JSON.stringify(payload));
    commonApi(settings, path, 'POST', payload, 'SingleTransactionEdit', null, null, null, true)
    .then(res => {
    	    console.log('ModelGallery: Response', Object.keys(res.data));
            if(res.status === 201 || res.status === 200){
                if(res.data["operation-responses"] && res.data["operation-responses"][0] && res.data["operation-responses"][0]["response-status-code"] === 200 ){
                    this.setState({isEditSuccess: true, isPatchLoading: false, showEditNodeModal:false});
                    GeneralCommonFunctions.scrollTo("editSuccessMessage");
                }else{
                    this.triggerError(res.data);
                }
            }else{
               this.triggerError(res.data);
            }
    	}, error=>{
    		this.triggerError(error);
    	}).catch(error => {
    		this.triggerError(error);
    });
  }
  triggerError = (error) => {
     console.error('[ModelGallery.jsx] error : ', JSON.stringify(error));
     let errMsg = this.renderErrorMsg(error);
     this.setState({
           isPatchLoading: false,
           isEditSuccess: false,
           editErrMsg: errMsg
       });
  };
  renderErrorMsg = (error) =>{
      let errMsg='';
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('[ModeGallery.jsx] error :', error.response);
            if(error.response.status){
                errMsg += " Code: " + error.response.status;
            }
            if(error.response.data){
                errMsg += " - " + JSON.stringify(error.response.data);
            }
        } else if (error["requestError"]){
            errMsg += JSON.stringify(error["requestError"]);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            errMsg += " - Request was made but no response received";
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            errMsg += " - Unknown error occurred " + error.message;
        }
       return errMsg;
  }
  openEditNodeModal = (nodeKey) => {
    console.log("ModelGallery :: openEditNodeModal called with " + nodeKey);
    var focusedNode = null;
    for (var i = 0; i < this.props.nodes.length && !focusedNode; i++){
        if(nodeKey === this.props.nodes[i].url){
            focusedNode = this.props.nodes[i];
            break;
        }
    }
    var editInputFields = [];
    if(focusedNode){
        var nodeType = focusedNode['node-type'];
        focusedNode.allowedEditProps = [];
        //call to check what props can be modified in oxm here;
        focusedNode.allowedEditProps = GeneralCommonFunctions.getEditableAttributes(nodeType);
        if(focusedNode.allowedEditProps.length > 0){
            for (var key in focusedNode.allowedEditProps){
                var attr = focusedNode.allowedEditProps[key];
                editInputFields[attr] = {};
                editInputFields[attr].isEdited = false;
                if(focusedNode.properties[attr]){
                    editInputFields[attr].oldValue = focusedNode.properties[attr];
                    editInputFields[attr].newValue = focusedNode.properties[attr];
                }else{
                    editInputFields[attr].oldValue = "";
                    editInputFields[attr].newValue = "";
                }
            }
        }else{
            this.setState({editInfoMsg: "This element cannot be edited, please contact an administrator if you need the ability to edit the attributes on this element."});
        }
    }else{
        //could not find the node, this shouldn't happen
        console.log("ModelGallery :: openEditNodeModal could not find " + nodeKey + " in this.props.nodes. This shouldn't happen.");
    }

    this.setState({showEditNodeModal:true, isEditSuccess: false, focusedNode: focusedNode, editInputFields: editInputFields});
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    var editInputFields = this.state.editInputFields;
    if(target.type === 'text'){
        editInputFields[name].newValue = value;
    }else if(target.type === 'checkbox'){
        if(!value){
            editInputFields[name].newValue =  editInputFields[name].oldValue,
            editInputFields[name].isEdited = value
        }else{
            editInputFields[name].isEdited = value
        }
    }
    this.setState({
              editInputFields: editInputFields
            });
  }
  /* End Edit Node Modal Functions */
  render(){
    let cards = null;
    let tableColumns = [];
    let tableValues = [];
    let rowIndexValue = 0;
    let svgWidth = window.outerWidth * 0.8;
    let nodesList=[];
    let tableColumnsList={};
    let tableDataList={};
    let columnFilter = [];
    let columnFilterList = (this.state.rerender) ? this.state.columnFilterList : {};
    let aliasColumnList=(this.state.rerender) ? this.state.aliasColumnList: {};
    let aliasRegex=/\'(\s)as(\s)\'|\'as\'/ig;
    console.log('Model gallery this.props>>>',this.props);
    console.log('columnFilterList while rendering:',columnFilterList);
    this.onTableFilterClick = (nodeType) => {
      this.setState({rerender:false},function(){this.props.isTableFilterApply(this.state.columnFilterList,nodeType,this.state.columnsList,this.state.aliasColumnList);}.bind(this))
    }
    const expandRows = {
      parentClassName: 'parent-expand-bar',
      onlyOneExpanding: true,
      renderer: (row, rowIndex) => (                    
        <div>
            <RelationshipList node={this.props.nodes[parseInt(row.id.split('_')[0])]}
                key={this.props.nodes[parseInt(row.id.split('_')[0])].id}
                nodeId={this.props.nodes[parseInt(row.id.split('_')[0])].id}
                nodeType={this.props.nodes[parseInt(row.id.split('_')[0])]['node-type']}
                nodeProps={this.props.nodes[parseInt(row.id.split('_')[0])].properties}
                nodeRelatives={this.props.nodes[parseInt(row.id.split('_')[0])]['related-to']}
                nodeUrl={this.props.nodes[parseInt(row.id.split('_')[0])].url}
                historyStackString={this.props.historyStackString}
                openHistoryModal={this.props.openHistoryModal}
                openEditNodeModal={this.openEditNodeModal}
                isWriteAllowed={this.state.isWriteAllowed}
                rowIndex={parseInt(row.id.split('_')[0])}
		enableRealTime={this.props.enableRealTime}
                aliasColumnList={this.props.tableFilterAliasColumns}
          />
        </div>
      ),
      showExpandColumn: true,
      expandByColumnOnly: true,     
      onExpandAll: this.handleOnExpandAll,
      expanded: this.state.expanded,
      onExpand: this.handleOnExpand

    };
    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        //row index is usefull when single node type exist, for multiple node type use row id
        rowIndexValue = parseInt(row.id.split('_')[0]);        
      },
      onMouseEnter: (e, row, rowIndex) => {
        //row index is usefull when single node type exist, for multiple node type use row id
        rowIndexValue = parseInt(row.id.split('_')[0]);
      }
    };
    let aliasColumns=[]
    
    if(this.props.nodes && this.props.nodes[0] && this.props.nodes[0]['node-type'] && this.props.viewName === "CellLayout" ){
        for(var n=0; n<this.props.nodes.length; n++){
          let nodeType = this.props.nodes[n]['node-type'];
          let nodeTypeProperties =[];
          let aliasProperties=[];
          let plainNodes ='';
          let dslQuery = this.props.dslQuery + ',';
          if(this.props.dslQuery){
            var nodePatternwithProp = this.generateRegexForDsl(nodeType);
            var nodeRegularExp = new RegExp(nodePatternwithProp, 'g');
            plainNodes = dslQuery.match(nodeRegularExp);
            console.log('plainNodes model Gallery>>>>>*',plainNodes);
            if(plainNodes){
              let propertiesPattern ="\\{.*?\\}"; 
              var propRegularExp = new RegExp(propertiesPattern, 'g');
              let nodeTypeProp = plainNodes[0].match(propRegularExp);
              nodeTypeProp = nodeTypeProp[0].slice(1,-1).split(',');//.replace(/\'/g,'').toLowerCase().split(',');
              for(var s=0;s<nodeTypeProp.length;s++){
                let nodeTypePropes=nodeTypeProp[s].match(aliasRegex);
                let alias='';
                let nprop='';
                if(nodeTypePropes){
                  let nodeTypeSplit=nodeTypeProp[s].split(aliasRegex);
                  nprop=nodeTypeSplit[0].replace(/\'/g,'');                  
                  alias=nodeTypeSplit[nodeTypeSplit.length-1].replace(/\'/g,'');                 
                }else{
                  nprop=nodeTypeProp[s].replace(/\'/g,'').toLowerCase();
                } 
                aliasProperties.push(alias);
                nodeTypeProperties.push(nprop);
              }             
            }  
          }
          if(nodesList.indexOf(nodeType) === -1){
            tableColumns=[];
            tableValues=[];
            nodesList.push(nodeType);            
            let tableColumnsBuilt = ExportExcel.buildAttrList(nodeType,[],'required');
            if(this.props.dslQuery && plainNodes){
              for(var z=0;z<tableColumnsBuilt.length;z++){ 
                let index= nodeTypeProperties.indexOf(tableColumnsBuilt[z].value.toLowerCase());         
                if(index !== -1){
                  if(aliasProperties[index] !==''){
                    let objAlias = {};
                    objAlias[aliasProperties[index]]=nodeTypeProperties[index];
                    aliasColumns.push(objAlias);
                    tableColumnsBuilt[z].value=aliasProperties[index];                   
                  }
                  tableColumns.push(tableColumnsBuilt[z]);                                    
                }
              }
            }else{
              tableColumns=tableColumnsBuilt;
            }
            console.log('after condition table columns>>>>',tableColumns);
            tableColumns.push({value:'id'});
            if(!columnFilterList[nodeType]){             
              columnFilterList[nodeType] = [];
              columnFilter = [];
              for(var j = 0; j < tableColumns.length; j++){
                let txt = tableColumns[j].value;
                //if(!this.state.reRender && (!columnFilter[j] || (columnFilter[j] && columnFilter[j][txt] === undefined))){                
                  let obj = {};
                  obj[txt] = '';
                  obj['description'] = tableColumns[j].description;
                  columnFilter.push(obj);
                //}              
              }
              columnFilterList[nodeType].push(columnFilter); 
            }
            if(!aliasColumnList[nodeType]){   
              aliasColumnList[nodeType]=[]; 
              aliasColumnList[nodeType].push(aliasColumns);      
            }                 
            for(var j = 0; j < tableColumns.length; j++){                                         
              if(j === tableColumns.length-1){
                tableColumns[j].dataField = 'id';
                tableColumns[j].hidden = true;
                tableColumns[j].text = tableColumns[j].value;
              }else{
                tableColumns[j].dataField = tableColumns[j].value;
                tableColumns[j].text = tableColumns[j].value;
                tableColumns[j].headerAttrs= { title:tableColumns[j].description};
                tableColumns[j].ref=tableColumns[j].value;
                tableColumns[j].filter = customFilter();
                tableColumns[j].filterRenderer = (onFilter, column) => <AttributeFilter handleOnFilter= {this.handleOnFilter} onFilter={ onFilter } column={ column } isPageChange={this.props.isPageNumberChange} nodeType={nodeType} columnFilterList={columnFilterList} columns={tableColumnsList} aliasColumnList={aliasColumnList}/>;
              }
            }
            tableColumnsList[nodeType] = tableColumns;
            tableDataList[nodeType] = [];            
            for(var m=0; m<this.props.nodes.length; m++){
              let nodeTypeForData = this.props.nodes[m]['node-type'];
              if(nodeTypeForData === nodeType){
                let propertiesOfNode = this.props.nodes[m].properties; 
                propertiesOfNode.id = m + '_' + nodeType + '_id';         
                tableValues.push(propertiesOfNode);     
                tableDataList[nodeType].push(tableValues);  
              }
            }
          }                 
        }
    }else{
      cards = this.props.nodes.map(node => {
        return (
           <Col key={node.id} lg={3} md={3} sm={6} xs={12}>
                <ModelCard
                  key={node.id}
                  nodeId={node.id}
                  nodeType={node['node-type']}
                  nodeProps={node.properties}
                  nodeRelatives={node['related-to']}
                  nodeUrl={node.url}
                  historyStackString={this.props.historyStackString}
                  openHistoryModal={this.props.openHistoryModal}
                  openEditNodeModal={this.openEditNodeModal}
                  isWriteAllowed={this.state.isWriteAllowed}
                  enableRealTime={this.props.enableRealTime}
                  aliasColumnList={this.props.tableFilterAliasColumns}/>
            </Col>
        );
      });
    }
    let tabs=nodesList.map((nodeType,index) => {
      return(
        <Tab eventKey={nodeType} title={nodeType} key={nodeType}>
          <BootstrapTable
              id={nodeType}
              keyField='id'
              data={tableDataList[nodeType][0]}
              columns={tableColumnsList[nodeType]}
              filter={filterFactory()}
              bordered={true}
              columnFilter={true}
              headerClasses='table-header-view'
              expandRow={expandRows}
              rowEvents={rowEvents}
              bootstrap4 striped hover condensed
          />
        </Tab>
      )
    });
    return (
      <div>
       <div className={'addPaddingTop alert alert-success ' +(this.state.isEditSuccess ? 'show' : 'hidden')} id="editSuccessMessage" role="alert">
         Update made successfully to {this.state.focusedNode ? this.state.focusedNode.url : ""}. If you wish, you may check your update using a real-time mode query, it may take some time to reflect in analysis mode.
       </div>
	   <div className='static-modal'>
	   		<Modal show={this.state.showEditNodeModal} onHide={this.closeEditNodeModal}>
	   			<Modal.Header>
	   				<Modal.Title>Edit Element</Modal.Title>
	   			</Modal.Header>
	   			<Modal.Body>
	   			    <Spinner loading={this.state.isPatchLoading}>
	   			        <div className={'addPaddingTop alert alert-danger ' +(this.state.editErrMsg && this.state.editErrMsg !== '' ? 'show' : 'hidden')} id="editErrorMessage" role="alert">
                          An error occurred in editing the element. Please see details {this.state.editErrMsg}
                        </div>
                        <div className={'addPaddingTop alert alert-info ' +(this.state.editInfoMsg && this.state.editInfoMsg !== '' ? 'show' : 'hidden')} id="editNotAllowedMessage" role="alert">
                          {this.state.editInfoMsg}
                        </div>
	   			        <form>
	   			        {this.state.focusedNode && Object.keys(this.state.editInputFields).length > 0 && (this.state.focusedNode.allowedEditProps).sort().map((attr) => {
                            return <div class="form-group row">
                                       <div className="col-sm-3">
                                            <label for={attr} class="col-form-label">{attr}</label>
                                       </div>
                                       <div class="col-sm-1">
                                            <div className="checkbox">
                                               <input type="checkbox" name={attr} checked={this.state.editInputFields[attr].isEdited} onChange={this.handleInputChange.bind(this)} />
                                            </div>
                                       </div>
                                       <div class="col-sm-8">
                                         <input type="text" class="form-control" id={attr} name={attr} disabled={!this.state.editInputFields[attr].isEdited} onChange={this.handleInputChange.bind(this)} value={this.state.editInputFields[attr].newValue}/>
                                       </div>
                                     </div>;

                         })
                        }
                        </form>
                    </Spinner>
	   			</Modal.Body>
	   			<Modal.Footer>
	   				<Button onClick={this.closeEditNodeModal}>Close</Button>
	   				<Button className={this.state.editInfoMsg && this.state.editInfoMsg !== '' ? 'hidden' : ''} onClick={this.submitEditNodeModal}>Submit</Button>
	   			</Modal.Footer>
	   		</Modal>
       </div>
      {(() => {
              if (this.props.viewName === "CellLayout" && tableValues.length > 0) {
                if(nodesList.length > 1){
                  if(this.props.isTableFilterApply){
                    return (
                      <div className="addPaddingSide">
                        <button type='button' className={(this.state.disableFilter)? 'btn btn-outline-secondary' : 'btn btn-primary'} disabled={this.state.disableFilter} onClick={() => {this.onTableFilterClick(nodesList)}} style={{float: 'right', margin: '2px'}}>Apply Filters (All)</button>
                        <Tabs defaultActiveKey={nodesList[0]} id="multipleTabularView">
                          {tabs}
                        </Tabs>
                      </div>
                    )
                  }else{
                    return (
                      <div className="addPaddingSide">
                        <Tabs defaultActiveKey={nodesList[0]} id="multipleTabularView">
                          {tabs}
                        </Tabs>
                      </div>
                    )
                  }                
                }else{
                  if(this.props.isTableFilterApply){
                    return(
                      <div className="addPaddingSide">
                        <button type='button' className={(this.state.disableFilter)? 'btn btn-outline-secondary' : 'btn btn-primary'} disabled={this.state.disableFilter} onClick={() => {this.onTableFilterClick(this.state.nodeType)}} style={{float: 'right', margin: '10px'}}>Apply Filters (All)</button>
                        <BootstrapTable
                          id='modelGallery'
                          keyField='id'
                          data={ tableValues }
                          columns={ tableColumns }
                          filter={ filterFactory() }
                          bordered={ true }
                          columnFilter={ true }
                          headerClasses='table-header-view'
                          expandRow={ expandRows }
                          rowEvents={ rowEvents }
                          bootstrap4 striped hover condensed
                        />
                      </div>
                    )
                  }else{
                    return (
                      <div className="addPaddingSide">
                        <BootstrapTable
                          id='modelGallery'
                          keyField='id'
                          data={ tableValues }
                          columns={ tableColumns }
                          filter={ filterFactory() }
                          bordered={ true }
                          columnFilter={ true }
                          headerClasses='table-header-view'
                          expandRow={ expandRows }
                          rowEvents={ rowEvents }
                          bootstrap4 striped hover condensed
                        />
                      </div>
                    )
                  }                  
                }
              } else if (this.props.viewName === "CardLayout") {
                return (
                  <Grid fluid={true}>
                          <Row className='show-grid'>
                            {cards}
                          </Row>
                  </Grid>
                )
            }
           })()}
            <div className={this.props.viewName === "VisualLayout" ? 'show' : 'hidden'}>
                <OutputVisualization identifier="currentState" width={svgWidth} height="1200" overflow="scroll"/>
            </div>
      </div>
    );
  } 
};

export default ModelGallery;
