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
import { connect } from 'react-redux';
import Filter from 'generic-components/filter/Filter.jsx';
import OutputToggle from 'generic-components/OutputToggle.jsx';
import {ExportExcel} from 'utils/ExportExcel.js';
import commonApi from 'utils/CommonAPIService.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';
import ModelGallery from './components/ModelGallery.jsx';
import DatePicker from 'react-datepicker';
import moment from "moment";
import ModelBreadcrumb from './components/ModelBreadcrumb.jsx';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Pagination from 'react-js-pagination';
import { ModelConstants } from './ModelConstants';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import DownloadRangeModel from 'generic-components/DownloadRangeModel.jsx';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

let INVLIST = GlobalExtConstants.INVLIST;
let DOWNLOAD_ALL = GlobalExtConstants.DOWNLOAD_ALL;
let generateExcels = ExportExcel.generateExcels;
let buildAttrList = ExportExcel.buildAttrList;
let DOWNLOAD_TOOLTIP = GlobalExtConstants.DOWNLOAD_TOOLTIP;
let ENVIRONMENT = GlobalExtConstants.ENVIRONMENT;
let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
let filterTypeList = GlobalExtConstants.FILTER_TYPES;
let TABULAR_FILTER_TYPE = GlobalExtConstants.TABULAR_FILTER_TYPE;
let URI_DELIMITCHAR = GlobalExtConstants.URI_DELIMITCHAR;
/*const mapStateToProps = ({extensibility: {extModelReducer} }) => {
      let {inventoryData} = extModelReducer;
  return {
        inventoryData
      };
};*/

 const mapStateToProps = (state) => {
  return {
    currState: state.modelReducer
  };
};

const mapActionToProps = (dispatch) => {
  return {
    onInventoryDataReceived: (data) => {
      dispatch({ type: 'UPDATE_INVENTORY_DATA', data: data });
    }
  };
};

/**
 * This class is used to handle any url interactions for models.
 * When a user selects a inventory item in browse or special search,
 * this model class should be used to handle the url + params and query
 * the proxy server.
 */

export class model extends Component {

  elements = [];
  filterQuery = '';
  pageTitle = '';
  nodeType = '';
  historyStackString = '';
  typeOfCall = true;
  nodeResults = '';
  downloadTooltip = DOWNLOAD_TOOLTIP;
  downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
  downloadRangeTooltip= 'Downloads Results By Custom Range Selection';
  initialFilterSelectedList = [];
  initialFilterMessage = [];
  initialNonDisplay = true;
  constructor(props) {
    console.log(props);
    APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
    super(props);
    var filterSelectedList = [];
    var seletedFilter = [];
    var filterMessage = [];
    var nonDisplay = true;
    var enableToggle= JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'ENABLE_ANALYSIS'));
    TABULAR_FILTER_TYPE=(APERTURE_SERVICE && enableToggle)?'CONTAINS':'='; 
    if (this.props.match.params.type) {
      seletedFilter = this.props.match.params.type.split(';');
      seletedFilter.map((param) => {
        console.log('param', param);
        console.log('param.indexOf(=)', param.indexOf('='));
        if (param.indexOf(URI_DELIMITCHAR+'='+URI_DELIMITCHAR) !== -1) {
          let id = param.split(URI_DELIMITCHAR+'='+URI_DELIMITCHAR)[0];
          let value = param.split(URI_DELIMITCHAR+'='+URI_DELIMITCHAR)[1];
          filterSelectedList.push({ 'id': id, 'value': value, 'type':'='});
          filterMessage.push(id+'='+value);
          enableToggle=false;
        }else{
          for(var x in  filterTypeList){
            if (param.indexOf(URI_DELIMITCHAR+filterTypeList[x]+URI_DELIMITCHAR) !== -1) {
              let paramArray=param.split(URI_DELIMITCHAR+filterTypeList[x]+URI_DELIMITCHAR); 
              let id = paramArray[0];
              let value = paramArray[1];
              filterSelectedList.push({ 'id': id, 'value': value, 'type': filterTypeList[x]});
              filterMessage.push(id+filterTypeList[x]+value);
              enableToggle=true;
            }
          }          
        }
      });
    }
    if (this.props.match.params.nodeId) {
      nonDisplay = false;
    }
    if(this.props.match.params.page==='false'){
      enableToggle=false;
    }
    if(!this.props.location.historyStackString){
        this.props.location.historyStackString = this.props.location.pathname + ',,Origin||';
    }else{
        this.historyStackString = this.props.location.historyStackString;
    }
    this.state = {
      activePage: 1,
      totalResults: 0,
      enableBusyFeedback: true,
      data: [],
      filterList: [],
      nodes: [],
      filterSelected: (this.props.match.params.type) ? this.props.match.params.type.split(';')[0] : '',
      filterDisplay: 'Select Filter',
      filterTypeDisplay: 'Filter Type',
      filterMessage: filterMessage,
      filterSelectedList: filterSelectedList,
      isRunEnable: false,
      isFilterEnable: nonDisplay,
      isPaginationEnable: nonDisplay,
      showHistoryModal: false,
      nodeDisplay: 'test',
      startDate: moment(),
      historyType: 'nodeState',
      enableCalendar: true,
      focusedNodeUri: 0,
      viewName: localStorage.getItem(GlobalExtConstants.ENVIRONMENT + '_' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId') + '_viewPreference')  || 'CardLayout',
      errorResults: false,
      errorMessage: '',
      showResults: false,
      resetColumnFilters: true,
      defaultViewName: localStorage.getItem(GlobalExtConstants.ENVIRONMENT + '_' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId') + '_viewPreference')  || 'CardLayout',
      isPageNumberChange: false,
      totalPages: 0,
      pageRange: 1,
      showDownloadResultsModal: false,
      errorDownloadResults:false,
      downloadErrorMsg: '',      
      enableModelBusyFeedback:false,
      downloadCount:DOWNLOAD_ALL,
      enableRealTime: enableToggle
    };
    this.baseState=this.state;
  }
  resultsMessage = '';
  componentDidMount = () => {
    console.log('[Model.jsx] componentDidMount props available are', JSON.stringify(this.props));
    if (this.state.isFilterEnable) {
      this.populateFilteringOptions();
    }
    this.initialFilterSelectedList = this.state.filterSelectedList;
    this.initialFilterMessage = this.state.filterMessage;
    this.initialNonDisplay = this.state.isFilterEnable;
    this.beforefetchInventoryData();
  };
  handleDateChange = (newDate) =>{
    this.setState({ startDate: moment(+newDate) });
    console.log('[Model.jsx] handleDateChange date is ', this.state.startDate);
    console.log('[Model.jsx] handleDateChange date is in millis ', +this.state.startDate);
  }
  openHistory = (nodeDisplay, nodeUri, nodeType) => { // open modal
    console.log('history >> showModal');
    let historyNodeUri = (nodeUri)?nodeUri.replace('/aperture/','/'):nodeUri;//replace always first occurence
    if(nodeDisplay){
       this.setState({
          nodeDisplay: nodeDisplay,
          focusedNodeUri: historyNodeUri,
          focusedNodeType: nodeType,
          showHistoryModal:true
       });
    }else{
        this.setState({
 	      showHistoryModal:true
        });
    }
  }
  closeHistory = () => {
	this.setState({
		showHistoryModal: false
	});
  }
  submitHistory = () => {
    //do some logic in history
    console.log("submitting history");
    let epochStartTime = (this.state.startDate).unix();
    this.props.history.push('/history/' + this.state.historyType+'/' + this.nodeType + '/' + btoa(this.state.focusedNodeUri) + '/' + epochStartTime * 1000);
  }
  setHistoryType(event) {
    console.log(event.target.value);
    let enableCalendar = false;
    if(event.target.value === 'nodeLifeCycle'){
        enableCalendar = false;
    }else{
        enableCalendar = true;
    }
    this.setState({
    		historyType: event.target.value,
    		enableCalendar: enableCalendar
    });
    console.log(this.state.enableCalendar);
  }
  setViewName(event) {
    console.log(event.currentTarget.value);
    this.setState({
    		viewName: event.currentTarget.value
    });
  }
  setDefaultViewName = (event) =>{
    let ENVIRONMENT = GlobalExtConstants.ENVIRONMENT;
    let layout =  event.target.value;

    if(sessionStorage.getItem(ENVIRONMENT + 'userId')) {
      if (event.target.checked) {
        localStorage.setItem(ENVIRONMENT + '_' + sessionStorage.getItem(ENVIRONMENT + 'userId') + '_viewPreference', layout);
      } else {
        localStorage.removeItem(ENVIRONMENT + '_' + sessionStorage.getItem(ENVIRONMENT + 'userId') + '_viewPreference');
      }
    }

    this.setState({
      defaultViewName: event.target.value
    });
    this.baseState.viewName=event.target.value;
    this.baseState.defaultViewName=event.target.value;
  }
  componentWillUnmount  = () => {
    console.log('[Model.jsx] componentWillUnMount');
    this.props.onInventoryDataReceived([]);
  }
  beforefetchInventoryData = (param) => {
    this.typeOfCall = true;
    if (param) {
      this.props.onInventoryDataReceived([]);
      this.formFilterQuery(param.filterMessage);
      this.setState(
        { enableBusyFeedback: true, activePage: 1, totalResults: 0, totalPages: 0,filterMessage: param.filterMessage, filterSelectedList: param.filterSelectedList},
        function () { this.fetchInventoryData(param); }.bind(this)
      );
    } else {
      this.formFilterQuery(this.state.filterMessage);
      this.fetchInventoryData();
    }
  };

  formFilterQuery = (filterMessage) => {
    let filterQuery = filterMessage.join('&');
    this.filterQuery = (filterMessage.length > 0) ? '&' + filterQuery : '';
  };

  fetchInventoryData = (param) => {
    console.log('fetchInventoryData', param);
    this.resultsMessage = '';    
    const inventory = INVLIST.INVENTORYLIST;
    let url = '';
    console.log('[Model.jsx] fetchInventoryData nodeId= ', this.props.match.params.nodeId);
    if (this.props.match.params.type !== undefined && this.props.match.params.type !== null) {
      this.nodeType = this.props.match.params.type;
    }
    console.log('[Model.jsx] nodeType: ' + this.nodeType);
    let pageName = this.nodeType.split(';')[0].replace(/\s/g, '').toUpperCase();
    console.log('[Model.jsx] pageName: ' + pageName);
    if (inventory[pageName] && inventory[pageName].display) {
      this.pageTitle = inventory[pageName].display;
    } else {
      this.pageTitle = pageName;
    }
    var nonRelationshipState = false;
    if (this.props.match.params.nodeId) {
      this.setUri(this.props.location.uri);
      this.setBreadcrumb(this.props.location.uri);
      url = sessionStorage.getItem(ENVIRONMENT + 'URI');
      if(this.state.enableRealTime){
        let versionPattern="^"+INVLIST.VERSION+"\\/";
        var versionRegularExp = new RegExp(versionPattern, 'g');
        let matchVersion = url.match(versionRegularExp,'g');
        if(!matchVersion){
          url= INVLIST.VERSION+'/'+url;
        } 
      } 
    } else {
      url = inventory[pageName].apiPath;
      this.setBreadcrumb(url);
      nonRelationshipState=true;
    }
    console.log('[Model.jsx] active page', this.state.activePage);
    console.log('this.state.filterSelectedList', this.state.filterSelectedList);
    console.log('filterQuery', this.filterQuery);
    //Aperture with Diff Filter types Operater  
    this.nodeResults = '';
    var method = 'GET';
    var payload = {};
    const settings = {
      'NODESERVER': INVLIST.NODESERVER,
      'PROXY': INVLIST.PROXY,
      'PREFIX': INVLIST.PREFIX,
      'VERSION': INVLIST.VERSION,
      'USESTUBS': INVLIST.useStubs,
      'APERTURE': INVLIST.APERTURE,
      'APERTURE_SERVICENAME':INVLIST.APERTURE_SERVICENAME
    };
    if(this.state.enableRealTime){
      settings['ISAPERTURE'] = (nonRelationshipState)? true : false;
    }else{
      if(!(this.state.enableRealTime && nonRelationshipState)){
        url = (url)?url.replace(INVLIST.VERSION+'/',''):url;
      }
    } 
    if(this.state.enableRealTime && nonRelationshipState){
      var filterList=this.state.filterSelectedList;
      var filters = [];
      for(var k in filterList){
        if(filterList.hasOwnProperty(k)){
          let filter ={}
          filter['filter']= filterList[k].type;
          filter['key'] = filterList[k].id;
          filter['value'] = filterList[k].value;
          filters.push(filter);
        }
      }
      method= 'POST';
      payload['node-type'] = url.split('/')[1];
      payload['filter-version'] = 'v1';
      payload['filters'] = filters;
    }else{
      payload = null;
    }
    
    var path = '?format=simple&resultIndex=' + this.state.activePage + '&resultSize=';      
    if(this.typeOfCall){  
      path = path + ModelConstants.RESULTS_PER_PAGE;
      url=(this.state.enableRealTime && nonRelationshipState)? path: url + path + this.filterQuery;
      this.commonApiServiceCall(settings,url,param,method,payload);
    }else{
      let pagerange=this.state.pageRange.toString();
      pagerange=pagerange.split('-');
      if(pagerange.length > 1){
        path = '?format=simple&resultIndex=' + parseInt(pagerange[0]) + '&resultSize='+ ModelConstants.RESULTS_PER_PAGE + '&resultRangeEnd=' + parseInt(pagerange[1]);
      }else{
        path = '?format=simple&resultIndex=' + 1 + '&resultSize=' + parseInt(pagerange);
      }
      url=(this.state.enableRealTime && nonRelationshipState)? path: url + path + this.filterQuery; 
      this.commonApiServiceCallForAllData(settings,url,method,payload);
    }
  };
  commonApiServiceCall = (settings,url,param,method,payload) =>{
    
    commonApi(settings, url, method, payload, 'modelDefault')
      .then(res => {
        // Call dispatcher to update state
        console.log('once before service call ......',this.state);
        this.resultsMessage = '';
        var totalResults = parseInt(res.headers['total-results']); 
        let downloadCount = DOWNLOAD_ALL;   
        if(totalResults > DOWNLOAD_ALL){
          this.downloadAllTooltip = DOWNLOAD_ALL + ' results out of '+ totalResults +' will be downloaded, please filter results further to obtain full report';
        }else{
          this.downloadAllTooltip = (totalResults === 1) ? 'Downloads ' + totalResults + ' Results' : 'Downloads all ' + totalResults + ' Results'
          downloadCount= totalResults;
        }   
        this.setState(
          {
            nodes : res.data.results,
            totalResults : res.headers['total-results'],
            totalPages: res.headers['total-results'],
            enableBusyFeedback:false,
            showResults: true,
            errorResults: false,
            downloadCount: downloadCount,
            filterSelectedList:(param)?param.filterSelectedList:this.state.filterSelectedList
          },function(){this.props.onInventoryDataReceived(res.data.results);});
                       
        console.log('After service call ......',this.state);
        console.log('[Model.jsx] results : ', res);
        }, error=>{
       	   this.triggerError(error);
        }).catch(error => {
           this.triggerError(error);
      });
  };
  commonApiServiceCallForAllData = (settings,url,method,payload) => {

    commonApi(settings, url,method, payload, 'modelDefault')
      .then(res => {
        // Call dispatcher to update state        
        console.log('once before service call ......',this.state);
        this.resultsMessage = '';
        this.nodeResults = res.data.results;
        let totalResults = parseInt(res.headers['total-results']);
        let totalPages = parseInt(res.headers['total-pages']);
        this.setState({totalPages:totalPages,errorDownloadResults:false,downloadErrorMsg:''},() => {this.getAllExcels()});
        console.log('[Model.jsx] results : ', res);
      }).catch(error => {
        console.log('[Model.jsx] error : ', error);
        this.nodeResults = '';
        let errMsg = this.renderErrorMsg(error);      
        this.setState({ enableBusyFeedback: false,errorDownloadResults:true,downloadErrorMsg:errMsg,enableModelBusyFeedback:false});       
      });     
  };

   triggerError = (error) => {
      console.error('[Model.jsx] error : ', JSON.stringify(error));
      this.props.onInventoryDataReceived([]);
      this.resultsMessage = 'No Results Found';
      this.downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
      this.nodeResults = '';
      this.setState({
            enableBusyFeedback: false,
            totalResults: 0,
            totalPages: 0,
          	showResults: false,
          	errorResults: true
        });
      let errMsg = this.renderErrorMsg(error);
      //Suppress Error Message when 404 results not found occur
      if(error.response && error.response.status === 404){
        this.setState({errorMessage:'', errorResults:false});
      }else{
            this.setState({errorMessage:errMsg});
      }
    };
    renderErrorMsg = (error) =>{
      let errMsg='';
       if (error.response) {
         // The request was made and the server responded with a status code
         // that falls out of the range of 2xx
         console.log(error.response.data);
         console.log(error.response.status);
         console.log(error.response.headers);
         if(error.response.status){
             errMsg += " Code: " + error.response.status;
         }
    	 if(error.response.data){
             errMsg += " - " + JSON.stringify(error.response.data);
         }
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
      
       console.log(error.config);
       return errMsg;
    }

  componentWillReceiveProps(nextProps) {
    console.log('[Model.jsx] componentWillReceiveProps');
    console.log('[Model.jsx] next nodeId:', nextProps.match.params.nodeId);
    console.log('[Model.jsx] this nodeId:', this.props.match.params.nodeId);

    if(nextProps.match.params.nodeId !== undefined && this.props.match.params.nodeId !== undefined){
      if (nextProps.match.params.nodeId && nextProps.match.params.nodeId
        !== this.props.match.params.nodeId) {
        this.props = nextProps;
        this.beforefetchInventoryData();
      }
    }
  };

  setUri(uri) {
    let delimiter = '\/';
    let start = 3;
    let tokens = uri.split(delimiter).slice(start);
    let result = tokens.join(delimiter);
    sessionStorage.setItem(ENVIRONMENT + 'URI', result);
  };

  setBreadcrumb(uri){
      var nodeType = this.nodeType.split(';')[0];
      var display = nodeType + ': ' + (uri).split(nodeType+'\/').pop();
      var hsEntry = this.props.location.pathname + ',' + uri +  ','+ display + '||';
      console.log("History Stack String: " + this.props.location.historyStackString);
       if(this.historyStackString.indexOf(hsEntry) > -1){
          var tempHistoryStack = this.historyStackString.split(hsEntry)[0];
          var tempHistoryStackFormat = tempHistoryStack.replace(hsEntry, "");
          this.historyStackString = tempHistoryStackFormat;
       }
      this.historyStackString += hsEntry;
      this.props.location.historyStackString = this.historyStackString;
      console.log('[Model.jsx] historyStack in model' + this.historyStackString);
  }

  handlePageChange = (pageNumber) => {
    console.log('[Model.jsx] HandelPageChange active page is', pageNumber);
    this.props.onInventoryDataReceived([]);
    this.setState(
      { activePage: pageNumber, enableBusyFeedback: true, resetColumnFilters: false, isPageNumberChange: true},
      function () { this.beforefetchInventoryData(); }.bind(this)
    );
  };
  openDownloadRange = () =>{    
      this.setState({
        showDownloadResultsModal: true,
        errorDownloadResults: false,
        downloadErrorMsg:''});    
  }
  closeDownloadResults = () =>{
    this.setState({
      showDownloadResultsModal: false,
      enableModelBusyFeedback: false
		});   
  }
  getAllExcels = (pageRange,rangeState) =>{
    console.log('getAllExcels>>>>>>>>>>>*',pageRange);
    if(pageRange){
      this.typeOfCall=false;
      let rangeModelState=(rangeState)? rangeState: false;
      this.setState(
        { pageRange: pageRange,enableBusyFeedback: true, enableModelBusyFeedback:true,showDownloadResultsModal:rangeModelState},
        function () { this.fetchInventoryData(); }.bind(this)
      );
    }else{
      this.setState(
        {errorDownloadResults: false, showDownloadResultsModal: false, downloadErrorMsg:'', enableBusyFeedback: false, enableModelBusyFeedback:false},
        function () { generateExcels(this.nodeResults);this.nodeResults='';this.typeOfCall = true;}.bind(this)
      );
    }     
  };
  
  populateFilteringOptions = () => {
    let tempState = this.state;
    tempState.filterList = buildAttrList(this.state.filterSelected, tempState.filterList);
    this.setState(tempState);
  };

  // HELPER FUNCTIONS
  isContaining = (nameKey, listArray) => {
    let found = false;
    listArray.map((lists) => {
      if (lists.id === nameKey) {
        found = true;
      }
    });
    return found;
  };
  isTableFilterApply = (columnFilterList,nodeType,columnsList) => {
    console.log('Model js ....columnFilterList:',columnFilterList);
    console.log('Model js .... nodeType:',nodeType);
    var columnFilter = columnFilterList[nodeType][0];
    console.log('model js columnFilter:',columnFilter);    
    var columns = columnsList[nodeType];
    var applyState = false;
    var filterSelectedList = [];
    var filterMessage = [];
    
    for(var i=0;i<columnFilter.length;i++){
      var colFilterValue = columnFilter[i][columns[i].value];      
      if(colFilterValue != ""){        
        filterSelectedList.push({ 'id': columns[i].value, 'value': colFilterValue, 'type': TABULAR_FILTER_TYPE});
        let filterMsg = columns[i].value + TABULAR_FILTER_TYPE + colFilterValue;
        filterMessage.push(filterMsg); 
        applyState = true;         
      }
    }
    console.log('isTableFilterApply filterSelectedList>>>>>',filterSelectedList);
    console.log('isTableFilterApply filterMessage>>>>>>>>>>',filterMessage); 
        
    if(applyState){  
      var tempState = this.state;
      var state = true;
      var stateFilterSelectedList = tempState.filterSelectedList;
        var id = 'id';
        var value = 'value';
        if(stateFilterSelectedList.length > 0){
          for(var j in filterSelectedList){
            state = true;
            for(var k in stateFilterSelectedList){
              if(stateFilterSelectedList[k][id] === filterSelectedList[j][id]){ 
                state =false;                              
                tempState.filterSelectedList[k] = { 'id':filterSelectedList[j][id], 'value': filterSelectedList[j][value], 'type': TABULAR_FILTER_TYPE};
              }
            }
            if(state){
              tempState.filterSelectedList.push({ 'id':filterSelectedList[j][id], 'value': filterSelectedList[j][value],  'type': TABULAR_FILTER_TYPE});
            }            
          }
          stateFilterSelectedList = tempState.filterSelectedList;
          for(var k in stateFilterSelectedList){
            tempState.filterMessage[k] = stateFilterSelectedList[k][id] + TABULAR_FILTER_TYPE + stateFilterSelectedList[k][value]
          }
        }else{
          tempState.filterSelectedList = filterSelectedList;
          tempState.filterMessage = filterMessage;
        }

        console.log('isTableFilterApply  tempState:',tempState);
        this.beforefetchInventoryData(tempState);
    }
  };
  prepareModelGalleryElement = () =>{
    let modelGalleryElement='';
    if(this.state.isFilterEnable){
      modelGalleryElement = <ModelGallery nodes={this.props.currState.inventoryData}
                                  viewName={this.state.viewName}
                                  historyStackString={this.props.location.historyStackString}
                                  openHistoryModal={this.openHistory}
                                  isPageNumberChange={this.state.isPageNumberChange}
                                  resetColumnInd={this.state.resetColumnFilters}
                                  isTableFilterApply={this.isTableFilterApply}
                                  enableRealTime={this.state.enableRealTime}
                                />;
    }else{
      modelGalleryElement = <ModelGallery nodes={this.props.currState.inventoryData}
                                  viewName={this.state.viewName}
                                  historyStackString={this.props.location.historyStackString}
                                  openHistoryModal={this.openHistory}
                                  isPageNumberChange={this.state.isPageNumberChange}
                                  resetColumnInd={this.state.resetColumnFilters}
                                  enableRealTime={this.state.enableRealTime}
                                />;
    }
    return modelGalleryElement;
  }
  prepareDownloadRangeModel = () =>{
  
    let downloadRangeModel =(this.state.showDownloadResultsModal)? <DownloadRangeModel 
              showDownloadResultsModal={this.state.showDownloadResultsModal}
              totalPages={this.state.totalPages}
              totalResults={this.state.totalResults}
              triggerDownload={this.getAllExcels}
              errorDownloadResults={this.state.errorDownloadResults}
              downloadErrorMsg={this.state.downloadErrorMsg}
              triggerClose={this.closeDownloadResults}
              enableModelBusyFeedback={this.state.enableModelBusyFeedback}
          /> : '';
    return downloadRangeModel;
  }
  toggleRealTimeAnalysisCallback=(checked)=>{
    console.log('toggleRealTimeAnalysisCallback>>>>',checked);
    sessionStorage.setItem(ENVIRONMENT + 'ENABLE_ANALYSIS', !checked);
    TABULAR_FILTER_TYPE=(APERTURE_SERVICE && !checked)?'CONTAINS':'=';
    this.baseState.enableRealTime = !checked;
    this.baseState.filterMessage = [];
    this.baseState.filterSelectedList = [];
    this.setState({...this.baseState},()=>{this.beforefetchInventoryData(this.state)});
  }
  render() {
    console.log('[Model Props] render: ', JSON.stringify(this.props) + 'elements : ', this.elements);
    console.log('[Model nodeId] render: ', this.props.match.params.nodeId);
    console.log('[Model nodeId] render this.state: ', this.state);
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
    const modelGalleryElement = this.prepareModelGalleryElement();
    let downloadRangeModel = this.prepareDownloadRangeModel();
    return (
      <div>
        {toggelRealtimeAnalysis}
        <Grid fluid={true} className='model-container'>
          <Row className='show-grid'>
            <Col md={12}>
              <h1>{this.pageTitle}</h1>
              <Filter key='browseSearch'
                nodeType={this.state.filterSelected}
                filterList={this.state.filterList}
                filterDisplay={this.state.filterDisplay}
                filterTypeDisplay={this.state.filterTypeDisplay}
                isRunEnable={this.state.isRunEnable}
                filterMessage={this.state.filterMessage}
                loadInventory={this.beforefetchInventoryData}
                filterSelectedList={this.state.filterSelectedList}
                isFilterEnable={this.state.isFilterEnable} 
                enableRealTime={this.state.enableRealTime}/>
            </Col>
          </Row>
          <Spinner loading={this.state.enableBusyFeedback}>
            <Row className='show-grid'>
              <Col md={8} className={this.state.isPaginationEnable && this.state.showResults ? 'show' : 'hidden'}>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={ModelConstants.RESULTS_PER_PAGE}
                  totalItemsCount={this.state.totalResults}
                  pageRangeDisplayed={ModelConstants.PAGE_RANGE_DISPLAY}
                  onChange={this.handlePageChange} />
              </Col>
              <Col md={2} className={this.state.isPaginationEnable && this.state.showResults ? 'text-right' : 'text-left'}>
                <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{this.downloadAllTooltip}</Tooltip>}>
                  <span className='d-inline-block' style={{display: 'inline-block'}}>
                    <Button bsSize='small' onClick={() => {this.getAllExcels(this.state.downloadCount)}}>
                      Download XLSX <i className='icon-documents-downloadablefile'></i>
                    </Button>
                  </span>
                </OverlayTrigger>
              </Col>
              <Col md={2} className={this.state.isPaginationEnable && this.state.showResults ? 'text-right' : 'text-left'}>
                <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{this.downloadRangeTooltip}</Tooltip>}>
                  <span className='d-inline-block' style={{display: 'inline-block'}}>
                    <Button bsSize='small' onClick={this.openDownloadRange}>
                      Download XLSX (Range)<i className='icon-documents-downloadablefile'></i>
                    </Button>
                  </span>
                </OverlayTrigger>
              </Col>
            </Row>
            <Row className='show-grid'>
                <ModelBreadcrumb historyStackString={this.props.location.historyStackString}/>
            </Row>
            <Row>
              <div className={'addPaddingTop alert alert-danger ' +(this.state.errorResults ? 'show' : 'hidden')} role="alert">
                  An error occurred, please try again later. If this issue persists, please contact the system administrator. {this.state.errorMessage}
              </div>
            </Row>
            <Row className='show-grid'>
              { this.state.showResults && <div className='addPaddingTop'>
                  <OutputToggle scope={this} visualDisabled={true}/>
                </div>
              }
            </Row>  
            <Row className={'show-grid ' + this.state.showResults ? 'show' : 'hidden'}>
              <Col md={12}>
                <hr />
                <h5>Total Results: <strong>{this.state.totalResults}</strong></h5>
                <span className='resultMessage'>{this.resultsMessage}</span>
              </Col>
            </Row>
            <Row className='show-grid'>
              {           
                modelGalleryElement            
              }         
            </Row>
            <Row className='show-grid'>
              <Col md={12} className={this.state.isPaginationEnable && this.state.showResults ? 'show' : 'hidden'}>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={ModelConstants.RESULTS_PER_PAGE}
                  totalItemsCount={this.state.totalResults}
                  pageRangeDisplayed={ModelConstants.PAGE_RANGE_DISPLAY}
                  onChange={this.handlePageChange} />
              </Col>
            </Row>
            <div className='static-modal'>
                <Modal show={this.state.showHistoryModal} onHide={this.closeHistory}>
                  <Modal.Header>
                    <Modal.Title>Retrieve {this.state.nodeDisplay} History</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                              <div className="radio">
                                <label>
                                  <input type="radio" value="nodeState"
                                                checked={this.state.historyType === 'nodeState'}
                                                onChange={(e) => this.setHistoryType(e)} />
                                  View state at
                                </label>
                              </div>
                              <div className="radio">
                                <label>
                                  <input type="radio"  value="nodeLifeCycleSince"
                                                checked={this.state.historyType === 'nodeLifeCycleSince'}
                                                onChange={(e) => this.setHistoryType(e)} />
                                  View updates since
                                </label>
                              </div>
                              <div className="radio">
                                <label>
                                  <input type="radio" value="nodeLifeCycle"
                                                checked={this.state.historyType === 'nodeLifeCycle'}
                                                onChange={(e) => this.setHistoryType(e)} />
                                  View all updates
                                </label>
                              </div>
                            </form>
                    <div className={this.state.enableCalendar ? 'show' : 'hidden'}>
                        <DatePicker
                            inline
                                  selected={this.state.startDate}
                                  onChange={(newDate) => this.handleDateChange(newDate)}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  timeIntervals={15}
                                  dateFormat="MMMM D, YYYY h:mm a"
                                  timeCaption="time"
                              />
                          </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button onClick={this.closeHistory}>Close</Button>
                    <Button onClick={this.submitHistory}>Submit</Button>
                  </Modal.Footer>
                </Modal>
            </div>
          </Spinner>
          <Spinner loading={this.state.enableModelBusyFeedback}>
            {downloadRangeModel}
          </Spinner>
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapActionToProps)(model);
