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
import Modal from 'react-bootstrap/lib/Modal';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Tabs from 'react-bootstrap/lib/Tabs';
import Button from 'react-bootstrap/lib/Button';
import Tab from 'react-bootstrap/lib/Tab';
import BootstrapTable from 'react-bootstrap-table-next';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';


class InfoToggle extends Component {
  constructor(props){
      console.log(props);
      super(props);
      this.props = props;
      this.state = {
                     showInfoModal: false
                   };
  }
  openInfoModal = () =>{
        this.setState({showInfoModal:true});
  }
  closeInfoModal = () =>{
        this.setState({showInfoModal:false});
  }
  getReferenceJson = (reference) =>{
    return require('app/assets/configuration/' + GlobalExtConstants.PATHNAME + '/reference/' + reference + '.json');
  }
  render(){
    let tableColumnsList = [];
    let tableDataList = [];
    let types = this.getReferenceJson('types');
    types.map(type => {
         tableColumnsList[type] = [];
         tableDataList[type] = this.getReferenceJson(type);
         for(var key in tableDataList[type][0]){
            var isHidden = key === 'id';
            tableColumnsList[type].push({dataField: key, text: key, hidden: isHidden });
         }
    });
    let tabs=types.map((nodeType,index) => {
      return(
        <Tab eventKey={nodeType} title={nodeType}>
          <BootstrapTable
              id={nodeType}
              keyField='id'
              data={tableDataList[nodeType]}
              columns={tableColumnsList[nodeType]}
              bordered={ true }
              headerClasses='table-header-view'
              bootstrap4 striped hover condensed
          />
        </Tab>
      )
    });
      if (!GlobalExtConstants.INVLIST.IS_ONAP){
            return (
            <div>
              <div className='static-modal'>
                               		<Modal show={this.state.showInfoModal} onHide={this.closeInfoModal}>
                               			<Modal.Header>
                               				<Modal.Title>Information</Modal.Title>
                               			</Modal.Header>
                               			<Modal.Body>
                                            <Tabs defaultActiveKey={types[0]} id="multipleTabularView">
                                              {tabs}
                                            </Tabs>
                               			</Modal.Body>
                               			<Modal.Footer>
                               				<Button onClick={this.closeInfoModal}>Close</Button>
                               			</Modal.Footer>
                               		</Modal>
              </div>
              <div className='col-xs-1'>
                  <i className='dsl-hint icon-documents-manual' onClick={this.openInfoModal} ></i>
                  <pre>Info</pre>
              </div>
            </div>);
      }else{
            return (<span></span>);
      }
  }
};

export default InfoToggle;
