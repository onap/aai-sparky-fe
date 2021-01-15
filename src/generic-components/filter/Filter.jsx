/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

import React, {Component} from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import AddFilters from './components/AddFilters.jsx';
import ClearFilter from './components/ClearFilter.jsx';
import RunFilterQuery from './components/RunFilterQuery.jsx';
import SelectFilter from './components/SelectFilter.jsx';
import FilterTypes from './components/FilterTypes.jsx';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'APERTURE_SERVICE'));

class Filter extends Component {
  constructor(props){
    super(props);
    APERTURE_SERVICE=JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'APERTURE_SERVICE'));
  };
  state = {
    filterList: this.props.filterList,
    filterSelected: this.props.nodeType,
    filterDisplay: 'Select Filter' ,
    filterTypeDisplay: 'Filter Type',
    errorMsg: '',
    showFilter:(this.props.filterMessage && this.props.filterMessage.length > 0) ? true : false,
    filterMessage:this.props.filterMessage,
    filterValue:'',
    filterSelectedList:this.props.filterSelectedList,
    isRunEnable:this.props.isRunEnable,
    enableRealTime:JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'ENABLE_ANALYSIS'))
  };    
  componentDidMount(){
    console.log('Filter component  mount');    
  };
  componentWillReceiveProps(){
    console.log('filter component  componentWillReceiveProps');
    this.setState({
      filterDisplay:this.props.filterDisplay,
      filterTypeDisplay:this.props.filterTypeDisplay,
      errorMsg:(this.props.errorMsg) ? this.props.errorMsg : '',
      filterSelected:this.props.nodeType,
      showFilter:(this.props.filterMessage && this.props.filterMessage.length > 0) ? true : false,
      filterMessage: this.props.filterMessage,
      filterValue:'',
      filterSelectedList:this.props.filterSelectedList,
      enableRealTime:JSON.parse(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'ENABLE_ANALYSIS'))
    });
  }
  renderFilterMessage = (props) => {
    console.log('Filter render Filter Message>>>>>',props.showFilter);
    if(props.showFilter){          
    	const filters = props.filterSelectedList.map( (filterMsg,index) =>{
        let filterType=(this.state.enableRealTime && filterMsg.type ==='=')? 'CONTAINS' : filterMsg.type;     
        return (
          <div className = 'badgeFilter' key={index}>
           <span><b>{filterMsg.id}</b>&nbsp;<i>{filterType}</i>&nbsp;{filterMsg.value}</span>
            <button type='button' className='close' aria-label='Close' onClick={() => this.onRemoveFilters(filterMsg.id.trim(),filterMsg.value.trim(),filterMsg.type)}>
               <span aria-hidden='true'>&times;</span>
            </button>
          </div>
        );
      });
      console.log('render Filter Message>>>>>before return ');
      return(
        <Row className='show-grid topBottomMargin'>
            <Col md={12} className='removeLeftPadding'>
                { filters }        
            </Col> 
        </Row>
      );
      console.log('Filter render Filter Message>>>>>After return ');    
    }    
  };    
  renderError = (props) => {
    if(props.errorMsg) {
      return(
        <Row className='show-grid topBottomMargin'>
          <span className='label badge-pill label-danger topBottomMargin'><strong>Error </strong>: {this.state.errorMsg}</span>
        </Row>
      );
    }
  };
  filterClearAllButtonSelectedHandler = () => {
    console.log('clear all called');
    if(this.state.isRunEnable || this.state.filterMessage.length === 0){
      this.setState(
        {
          filterDisplay: 'Select Filter',
          filterTypeDisplay: 'Filter Type',
          errorMsg: '',
          filterMessage: [],
          filterValue:'',
          filterSelectedList:[]
        }
      );
    }else{
      var tempState = this.state;
      tempState.filterMessage = [];
      tempState.filterSelectedList = [];
      tempState.filterValue = ''; 
      tempState.errorMsg = '';
      tempState.filterDisplay = 'Select Filter';
      tempState.filterTypeDisplay = 'Filter Type';
      this.setState(tempState,function(){this.props.loadInventory(tempState);});
    }
    
  };
  filterAddButtonSelectedHandler = () => {
    console.log('add Filter called');
    var found = this.isContaining(this.state.filterDisplay, this.state.filterSelectedList);
    console.log('filterAddButtonSelectedHandler>>>>>found',found);
    this.errorMsg = null;
    let filterDisplayState = true;
    if(this.state.enableRealTime){
      if(this.state.filterTypeDisplay !== 'Filter Type'){
        filterDisplayState = true;
      }else{
        filterDisplayState = false;
      }
    }
    if (this.state.filterDisplay !== 'Select Filter' && filterDisplayState && this.state.filterValue && !found){
      console.log('filterAddButtonSelectedHandler>>>>>inside',this.state.filterValue);
      var tempState = this.state;
      if(this.state.enableRealTime){
        tempState.filterMessage.push(this.state.filterDisplay + this.state.filterTypeDisplay +this.state.filterValue);
        tempState.filterSelectedList.push({'id' : this.state.filterDisplay, 'value' : this.state.filterValue,'type': this.state.filterTypeDisplay});
      }else{
        tempState.filterMessage.push(this.state.filterDisplay + '=' +this.state.filterValue);
        tempState.filterSelectedList.push({'id' : this.state.filterDisplay, 'value' : this.state.filterValue,'type': '='});
      }
      tempState.filterDisplay = 'Select Filter';
      tempState.filterTypeDisplay = 'Filter Type';
      tempState.filterValue = '';
      tempState.showFilter = true;  
      tempState.errorMsg = '';               
      console.log('filterAddButtonSelectedHandler>>>>>tempState',tempState);            
      if(this.state.isRunEnable) {
        this.setState(tempState); 
      }else{
        this.setState(tempState,function(){this.props.loadInventory(tempState);});
      }
    }else{
      console.log('filterAddButtonSelectedHandler>>>>>Else',this.state.filterDisplay);
      console.log('filterAddButtonSelectedHandlerfilterTypeDisplay>>>>>Else',this.state.filterTypeDisplay);
      console.log('this.state.filterValue>>>>>>>>>>>>>>',this.state.filterValue);
      if(found){
        this.setState({errorMsg: 'Please remove the current filter for this field before trying to add another.'});
      }else if ( this.state.filterDisplay === 'Select Filter'){
        this.setState({errorMsg: 'Please select a filter.'});
      }else if (this.state.enableRealTime && this.state.filterTypeDisplay === 'Filter Type'){
        this.setState({errorMsg: 'Please select a filter type.'});
      }else{
        this.setState({errorMsg: 'Please validate your filter, there seems to be an issue.'});
      }
    }
  };
  isContaining(nameKey, listArray){
    var found = false;    
    if(listArray) {  
    listArray.map((lists) => {      
      if(lists.id === nameKey){
        console.log('foundName key in list',lists.id);      
        found = true;
      }
    });    
    }  
    return found;
  };
  onTargetMenuSelect = (listName) => {
    console.log('onTargetMenuSelect',listName);
    this.setState({filterDisplay:listName,errorMsg:''});
  };
  onTargetMenuOfFilterTypes = (listName) => {
    console.log('onTargetMenuOfFilterTypes',listName);
    this.setState({filterTypeDisplay:listName,errorMsg:''});
  }
  onInputDataChange = (event) =>{
    console.log('inputtext',event.target.value);
    this.setState({filterValue:event.target.value});
  };
  onRemoveFilters = (filter,filterText,filterType) => {
    console.log('onRemoveFilters',this.state.filterSelectedList);
    var found = this.isContaining(filter, this.state.filterSelectedList);
    console.log('onRemoveFilters.....found',found);
    if(found){
      const filterList = this.state.filterSelectedList.filter(function(el) {
        console.log('el.id',el.id);
        return el.id !== filter;
      });
      console.log('onRemoveFilters.....filterList',filterList);
      let message = filter + filterType + filterText;
      const filterMsgList = this.state.filterMessage.filter((el) =>{
        return el !== message;
      }); 
      console.log('onRemoveFilters.....filterMsgList',filterMsgList);
      if(this.state.isRunEnable) {
        this.setState({filterSelectedList:filterList,filterValue:'',filterMessage:filterMsgList,errorMsg:''}); 
      }else{
        var tempState = this.state;
        tempState.filterMessage = filterMsgList;
        tempState.filterSelectedList = filterList;
        tempState.filterValue = ''; 
        tempState.errorMsg = ''; 
        this.setState(tempState,function(){this.props.loadInventory(tempState);});
      }          
    }
  };
  render(){
    let filterTags ='';
    if(APERTURE_SERVICE && this.state.enableRealTime){
      console.log('before passing Filter>*',this.state);
      filterTags= <Col md={(this.state.isRunEnable) ? 2 : 2} className='removeLeftPadding'>
                    <FilterTypes param={this.state}
                      filterList={this.props.filterList} 
                      onMenuSelect={this.onTargetMenuOfFilterTypes} />
                  </Col>                      
    }
    return(
        <div id='filterPane' className={this.props.isFilterEnable ? 'show' : 'hidden'}>
            <Grid className='custom-container'>
                <Row className='show-grid topBottomMargin'>
                    <Col md={(this.state.isRunEnable) ? 3 : 2} className='removeLeftPadding'>
                        <SelectFilter param={this.state} 
                            filterList={this.props.filterList} 
                            onMenuSelect={this.onTargetMenuSelect} />
                    </Col>
                    {filterTags}                  
                    <Col md={(this.state.isRunEnable) ? 7 : 8}>
                        <input type='text' size='36' 
                            onBlur={(event) => this.onInputDataChange(event)} 
                            placeholder='Please Enter Filter text' 
                            value={this.state.filterValue}
                            onChange={(event) => this.onInputDataChange(event)} />
                        <AddFilters param={this.state} 
                            addHandler={this.filterAddButtonSelectedHandler} />
                        <ClearFilter param={this.state} clearAllHandler={this.filterClearAllButtonSelectedHandler} />
                        <RunFilterQuery param={this.state} />
                    </Col>
                </Row>
                {
                    this.renderError(this.state)
                }
                {
                    this.renderFilterMessage(this.state)
                }
            </Grid>
        </div>
    );
  }
}
export default Filter;
