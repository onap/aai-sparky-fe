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

import React, {Component} from 'react';
import Filter from 'generic-components/filter/Filter.jsx';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Panel from 'react-bootstrap/lib/Panel';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

let INVLIST = GlobalExtConstants.INVLIST;
let OXM = GlobalExtConstants.OXM;

let invList = null;
let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'APERTURE_SERVICE'));

class SpecializedSearch extends Component {

  state = {
    data: [],
    filterList: [],
    filterSelected: '',
    filterDisplay: 'Select Filter',
    filterTypeDisplay: 'Filter Type',
    errorMsg: '',
    showFilter:false,
    filterMessage:[],
    filterValue:'',
    filterSelectedList:[],
    isRunEnable:true,
    enableRealTime: JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'ENABLE_ANALYSIS'))
  };

  constructor(){
    super();
    APERTURE_SERVICE=JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'APERTURE_SERVICE'));
  }
  componentDidMount(){

    if(this.state.filterSelected === ''){
      const invKeys = Object.keys(INVLIST.INVENTORYLIST);
      invKeys.sort().map((item,i) => {
        if(i === 0 && this.state.filterSelected === ''){
          this.setState(
            { filterSelected: INVLIST.INVENTORYLIST[item].modelPath,filterDisplay:'Select Filter',filterTypeDisplay:'Filter Type'},
            function(){this.populateFilteringOptions();}.bind(this));        
        }
      });
    }
  };
  isContaining(nameKey, listArray){
    var found = false;    
    listArray.map((lists) => {      
      if(lists.id === nameKey){
        console.log('foundName key in list',lists.id);      
        found = true;
      }
    });    
    return found;
  };
  radioButtonSelectedHandler(event) {
    console.log('radio button clicked');
    this.setState(
      { filterSelected: event.target.value,filterList:[],filterSelectedList:[],filterDisplay:'Select Filter',filterTypeDisplay:'Filter Type',filterMessage:[]},
      function(){this.populateFilteringOptions();}.bind(this)
    );
  };
  camelToDash = (str) => {
    return (str.replace(/\W+/g, '-')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2')).toLowerCase();
  }
  populateFilteringOptions = () => {

    let result = JSON.parse(OXM);
    let arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
    console.log('arrayOfTypes ', arrayOfTypes);
    let foundIndex = -1;    
    let searchParam = this.state.filterSelected;
    if(['PSERVER', 'COMPLEX', 'CLOUDREGION', 'NETWORKPROFILE', 'VIRTUALDATACENTER'].indexOf(this.state.filterSelected.toUpperCase()) === -1){
      searchParam = this.state.filterSelected.substring(0, this.state.filterSelected.length - 1);
    }
    if('CHASSIES'.indexOf(this.state.filterSelected.toUpperCase()) !== -1){
      searchParam = this.state.filterSelected.substring(0, this.state.filterSelected.length - 2) + 's';
    }else if(this.state.filterSelected.substr(this.state.filterSelected.length - 3) === 'ies'){
      searchParam = this.state.filterSelected.substring(0, this.state.filterSelected.length - 3) + 'y';
    }else if('COMPLEXES'.indexOf(this.state.filterSelected.toUpperCase()) !== -1){
      searchParam = this.state.filterSelected.substring(0, this.state.filterSelected.length - 2);
    }
    if(searchParam === 'PINTERFACE'){
      searchParam = 'pInterface';
    }
    if(this.state.filterSelected.toUpperCase() === 'LINESOFBUSINESS'){
      searchParam = 'lineOfBusiness';
    }
    console.log('searchParam Node type',searchParam);
    for (var i = 0; i < arrayOfTypes.length && foundIndex === -1; i++) {
      if (arrayOfTypes[i]['xml-root-element'][0]['$']['name'] === this.camelToDash(searchParam)) {
        console.log(arrayOfTypes[i]);
        foundIndex = i;
      }
    }
    var tempState = this.state;
    tempState.filterList = [];
    if(foundIndex !== -1){
      tempState.errorMsg = '';    
      //build the filter list
      if (arrayOfTypes[foundIndex]['java-attributes']) {
        let elementLength = 0;
        if (arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element']) {
          elementLength = arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'].length;
        }
        for (var j = 0; j < elementLength; j++) {
          let isPrimitive = JSON.stringify(arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['type']).indexOf('java.lang') > -1;
          if(isPrimitive) { //add to the list
            let node = {value: arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name']};
            tempState.filterList.push(node);
          }
        }
      }

      //sort the filter list
      tempState.filterList = tempState.filterList.sort(function(filter1, filter2) {
        if ( filter1.value < filter2.value ){
          return -1;
        }else if( filter1.value > filter2.value ){
          return 1;
        }else{
          return 0;
        }
      });
    }
    this.setState(tempState);
    console.log('tempState.filterList ' + JSON.stringify(tempState.filterList));
  };
  initialUpdateOfFilter = (filter) => {
    this.setState(
      { filterSelected: filter,filterDisplay:'Select Filter',filterTypeDisplay:'Filter Type'},
      function(){this.populateFilteringOptions();}.bind(this)
    );
  };
  toggleRealTimeAnalysisCallback=(checked)=>{
    console.log('toggleRealTimeAnalysisCallback>>>>',checked);
    sessionStorage.setItem(GlobalExtConstants.ENVIRONMENT + 'ENABLE_ANALYSIS', !checked);
    
    this.setState({ enableRealTime: !checked, 
                    filterList:[], 
                    filterSelectedList:[], 
                    filterDisplay:'Select Filter', 
                    filterTypeDisplay:'Filter Type', 
                    filterMessage:[],
                    errorMsg: "",                    
                    filterMessage: [],
                    filterValue: "",
                    isRunEnable: true,
                    showFilter: false},function(){this.populateFilteringOptions();}.bind(this));
  }
  render(){
    var toggelRealtimeAnalysis = '';
	  if(APERTURE_SERVICE){		
		  toggelRealtimeAnalysis = <div className='toggleSwitch'><BootstrapSwitchButton
									checked={!this.state.enableRealTime}
									onlabel='Real Time'
									onstyle='danger'
									offlabel='Analysis'
									offstyle='success'
									style='w-100 mx-3'
									onChange={(checked) => {
										this.toggleRealTimeAnalysisCallback(checked);
									}}
								/></div>             
	 }
    let pagetitle = '';
    if(this.state.filterSelected !== ''){
      pagetitle = INVLIST.INVENTORYLIST[this.state.filterSelected.replace(/\s/g,'').toUpperCase()].display;
    }
    const invKeys = Object.keys(INVLIST.INVENTORYLIST);
    invList = invKeys.sort().map((item,i) => {
      let checkedStatus = INVLIST.INVENTORYLIST[item].modelPath === this.state.filterSelected;
      if(i === 0 && this.state.filterSelected === ''){
        checkedStatus = true;        
      }
      let selectedClass = 'leftNavSelection';
      if(checkedStatus){
        selectedClass = 'leftNavSelected ';
      }
      return (
        <div key={INVLIST.INVENTORYLIST[item].display} className={'form-row ' + selectedClass}>
        <label role='radio' className='radio'>
              <input type='radio' name='optionsRadios' className='optionsRadios'
                value={INVLIST.INVENTORYLIST[item].modelPath} 
                checked={checkedStatus} 
                onChange={(event)=> this.radioButtonSelectedHandler(event)}/>
            <i className='skin'></i>
            <span>{INVLIST.INVENTORYLIST[item].display}</span>
        </label>
        </div>
      );
    });

    return(
      <div>
          {toggelRealtimeAnalysis}
          <div id='specialSearch'>
                <header className='addPadding jumbotron my-4'>
                    <h1 className='display-2'>Network Element Specialized Search</h1>
                    <p className='lead'>
                      On this page you have the ability to build a set of query criteria per network element type and run a query. Simply choose the network element type from the radio buttons, build your filters, and run.
                    </p>
                </header>
          </div>
            <div className='addPadding'>
                <Row className='show-grid' style={{margin: '0px'}}>
                  <Col md={3} className='leftNavSelection'>
                    <header>List of Network Element Types</header>
                    <form id='filters'  name='myForm'>
                      <fieldset role='radiogroup' aria-labelledby='radiolabel1' className='leftNavSelection'>
                        {invList}
                      </fieldset>
                    </form>
                  </Col>
                  <Col md={9} className='mainSectionSelection'>
                    <Panel bsStyle='primary'>
                      <Panel.Heading>
                        <Panel.Title componentClass='h3'>Filter Section : {pagetitle} </Panel.Title>
                      </Panel.Heading>
                      <Panel.Body>
                        <Filter key='specializedSearch'
                          nodeType={this.state.filterSelected}
                          filterList={this.state.filterList}
                          filterDisplay={this.state.filterDisplay}
                          filterTypeDisplay={this.state.filterTypeDisplay}
                          isRunEnable={this.state.isRunEnable}
                          filterMessage={this.state.filterMessage}
                          filterSelectedList={this.state.filterSelectedList}
                          isFilterEnable={true} 
                          errorMsg={this.state.errorMsg}
                          enableRealTime={this.state.enableRealTime}/>     
                      </Panel.Body>
                    </Panel>                    
                  </Col>
                </Row>
              </div>
          </div>
    );
  }
}
export default SpecializedSearch;
