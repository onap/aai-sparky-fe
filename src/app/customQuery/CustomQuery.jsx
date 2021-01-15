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

import Select from 'react-select';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';
import Label from 'react-bootstrap/lib/Label';
import Collapse from 'react-bootstrap/lib/Collapse';
import moment from "moment";
import DatePicker from 'react-datepicker';
import Modal from 'react-bootstrap/lib/Modal';
import {ExportExcel} from 'utils/ExportExcel.js';
import commonApi from 'utils/CommonAPIService.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';
import ModelGallery from 'app/model/modelSearch/components/ModelGallery.jsx';
import ModelCard from 'app/model/modelSearch/components/ModelCard.jsx';
import OutputToggle from 'generic-components/OutputToggle.jsx';
import Pagination from 'react-js-pagination';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import {Visualization} from 'generic-components/OutputVisualization.jsx';
import DownloadRangeModel from 'generic-components/DownloadRangeModel.jsx';



let PAGINATION_CONSTANT = GlobalExtConstants.PAGINATION_CONSTANT;
let INVLIST = GlobalExtConstants.INVLIST;
let CUSTOMQUERYLIST = GlobalExtConstants.CUSTOMQUERYLIST;
let generateExcels = ExportExcel.generateExcels;
let DOWNLOAD_ALL = GlobalExtConstants.DOWNLOAD_ALL;
let DOWNLOAD_TOOLTIP = GlobalExtConstants.DOWNLOAD_TOOLTIP;


let dropdownList = null;
let header = null;

const inputClasses = ['form-control'];

class CustomQuery extends Component {
  nodeResults = '';
  typeOfCall = true;
  downloadTooltip = DOWNLOAD_TOOLTIP;
  downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
  downloadRangeTooltip= 'Download Results By Custom Range Selection';
  historyStackString = '';
  state = {
    queryPlaceHolder: 'Please Select a Query',
    placeholder: 'Please Select a Query',
    reqPropPlaceholder: 'Please Enter Required Query or Property',
    optionalPropPlaceholder: 'Please Enter Optional Query or Property',
    displayReqProps: 'hidden',
    startNode: '',
    reqProps: '',
    optionalProps: '',
    disableInputs: true,
    query: '',
    showText: false,
    description: '',
    additionalInfo: '',
    displayDescription: 'hidden',
    customQueryOptions: null,
    formIsValid: false,
    nodes: [],
    displayNodes: 'hidden',
    multipleNodes: '',
    isLoading: false,
    isInitialLoad: true,
    activePage: 1,
    totalResults: 0,
    showPagination: false,
    showResults: false,
    errorResults:false,
    errorMessage: '',
    noResults: false,
    displayOptionalProps: 'hidden',
    showHistoryModal:false,
    startDate: moment(),
    currentPayload: null,
    viewName: localStorage.getItem(GlobalExtConstants.ENVIRONMENT + '_' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId') + '_viewPreference')  || 'CardLayout',
    res: null,
    visualAddition: false,
    nodeDisplay: '',
    showNodeModal: false,
    focusedNode: {},
    historyType: 'cq',
    focusedNodeUri: 0,
    focusedNodeType: '',
    historyParams: '',
    showModelOptions: false,
    enableCalendar: true,
    resetColumnFilters: true,
    isPageNumberChange: false,
    totalPages: 0,
    pageRange: 1,
    showDownloadResultsModal: false,
    errorDownloadResults:false,
    downloadErrorMsg: '',      
    enableModelBusyFeedback:false,
    downloadCount:DOWNLOAD_ALL,
    defaultViewName: localStorage.getItem(GlobalExtConstants.ENVIRONMENT + '_' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId') + '_viewPreference')  || 'CardLayout'
  }

  componentWillMount () {
    console.log('componentWillMount');
    sessionStorage.setItem(GlobalExtConstants.ENVIRONMENT + 'ENABLE_ANALYSIS', false);
    if(!this.props.location.historyStackString){
      this.props.location.historyStackString = this.props.location.pathname + ',,Origin||';
    }else{
      this.historyStackString = this.props.location.historyStackString;
    }
    let queryList = Object.values(CUSTOMQUERYLIST.CUSTOMQUERYLIST);
    dropdownList = queryList.sort(function (filter1, filter2) {
      if (filter1.value < filter2.value) {
        return -1;
      } else if (filter1.value > filter2.value) {
        return 1;
      } else {
        return 0;
      }
    });
  };
  onInputChangeHandler (){
    console.log('onInputChangeHandler of select-Clear');
    this.setState({ 
        placeholder: 'Please Select A Query',
        queryPlaceHolder: 'Please Select A Query', query: '',
        reqPropPlaceholder: 'Please Enter Required Query or Property',
        optionalPropPlaceholder: 'Please Enter Optional Query or Property',
        startNode: '',
        reqProps: '', 
        optionalProps: '',
        disableInputs: true,
        displayDescription: 'hidden',
        nodes: [],
        displayNodes: 'hidden',
        multipleNodes: '',
        isLoading: false,
        displayOptionalProps: 'hidden',
        formIsValid: false,
        showPagination: false,
        showResults: false,
        errorResults: false,
        errorMessage: '',
        noResults: false,
        isInitialLoad: true
      });
  }

  updateSelectedHandler = (selectedOption) => {

    const value = selectedOption === null ? 'Please Select A Query' : selectedOption.value
    if(selectedOption){
      console.log('updateSelectedHandler.reqPropPlaceholder: ' + selectedOption.reqPropPlaceholder);
      console.log('updateSelectedHandler.value: ' + selectedOption.value);
      this.setState({ placeholder: selectedOption.placeholder });
      this.setState({ displayReqProps: selectedOption.reqPropPlaceholder ? 'show' : 'hidden' });
      this.setState({ displayOptionalProps: selectedOption.optionalPropPlaceholder ? 'show' : 'hidden'});
      this.setState({ reqPropPlaceholder: selectedOption.reqPropPlaceholder });
      this.setState({ optionalPropPlaceholder: selectedOption.optionalPropPlaceholder});
      this.setState({ disableInputs: false });
      this.setState({ query: value });
      this.setState({ description: selectedOption.description.summary });
      this.setState({ additionalInfo: selectedOption.description.additionalInfo });
      this.setState({ displayDescription: 'show' });
      this.setState({ startNode: ''});
      this.setState({ reqProps: ''});
      this.setState({ optionalProps: ''});
      this.setState({ queryPlaceHolder: value});
    }else{
       /*this.setState({ queryPlaceHolder: value, query: '',
          reqPropPlaceholder: this.state.reqPropPlaceholder,optionalPropPlaceholder: this.state.optionalPropPlaceholder,
          startNode: '',reqProps: '', optionalProps: ''});*/
          this.onInputChangeHandler();
    }    
  }
  checkValidity() {
    let isValid = true;
    isValid = this.state.startNode.trim().length > 1 && isValid;
    if (this.state.reqPropPlaceholder) {
      console.log('Checking if reqProps is on state...');
      isValid = this.state.reqProps.length > 1 && isValid;
    }
    return isValid;
  }

  inputChangeHandler = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log('inputChangeHandler.value: ' + value);
    console.log('inputChangeHandler.name: ' + name);
    let formIsValid = null;
    this.setState(
      { [name]: value },
      function () {
        console.log('startNode:' + this.state.startNode);
        console.log('reqProps:' + this.state.reqProps);
        formIsValid = this.checkValidity();
        console.log('formIsValid:' + formIsValid);
        this.setState({ formIsValid: formIsValid });
      });
  }

  onAdditem = (event) => {
    //window.alert('onAddItem clicked');
    event.preventDefault();
    this.nodeResults = '';
    this.typeOfCall = true;
    this.formQueryString();
  };
  formPayload = () => {
    var startNode = this.state.startNode;
    startNode.trim();
    console.log('startNode.trim().length: ' + startNode.trim().length);
    var queryName = this.state.query;
    var reqProps = this.state.reqProps;
    var optionalProps = this.state.optionalProps;
    console.log('start Node: ' + startNode);
    console.log('query name: ' + queryName);
    console.log('req props: ' + reqProps);
    console.log('Optional props: ' + optionalProps);
    let payload = null;

    if(queryName === 'node-fromURI'){
        payload = {
            start: startNode
        };
    } else if ( reqProps === '' && optionalProps === '' ){
      payload = {
        start: startNode,
        query: 'query/' + queryName
      };
    } else if(reqProps !== ''){
      reqProps = '?' + reqProps;
      payload = {
        start: startNode,
        query: 'query/' + queryName + reqProps
      };
    }
    if(optionalProps !== ''){
      if(reqProps === ''){
        optionalProps = '?' + optionalProps;
      }else{
        optionalProps = reqProps + optionalProps;
      }
      payload = {
        start: startNode,
        query: 'query/' + queryName + optionalProps
      };
    }
    return payload
  }
  formQueryString = () =>{
    let payload = this.formPayload();

    console.log('payload>>>>>' + payload.toString());
    const settings = {
      'NODESERVER': INVLIST.NODESERVER,
      'PROXY': INVLIST.PROXY,
      'PREFIX': INVLIST.PREFIX,
      'VERSION': INVLIST.VERSION,
      'USESTUBS': INVLIST.useStubs

    };
    let queryStr = '';
    if(this.typeOfCall){
      queryStr = 'query?format=simple&resultIndex='
                   + this.state.activePage + '&resultSize=' + PAGINATION_CONSTANT.RESULTS_PER_PAGE;
      this.setState({isLoading: true,nodes: [], currentPayload:payload});
    }else{
      let pagerange=this.state.pageRange.toString();
      pagerange=pagerange.split('-');
      if(pagerange.length > 1){
        queryStr = 'query?format=simple&resultIndex=' + parseInt(pagerange[0]) + '&resultSize=' + PAGINATION_CONSTANT.RESULTS_PER_PAGE + '&resultRangeEnd=' + parseInt(pagerange[1]);
      }else{
        queryStr = 'query?format=simple&resultIndex=1&resultSize=' + parseInt(pagerange);
      }
      this.setState({enableModelBusyFeedback: true, currentPayload:payload});
    }
        this.getNodes(settings, queryStr, 'PUT', payload);
  }


  getNodes(settings, path, httpMethodType, payload) {
    commonApi(settings, path, httpMethodType, payload, 'CQDefault')
      .then(res => {
        console.log(Object.keys(res.data));
        this.processData(res);
        if(this.state.nodes.length > 0 && this.state.visualAddition){
            Visualization.chart('currentState' , [], [], this.state.res.data, this);
        }
        console.log('res:' + res);
      }, error => {
          console.log(JSON.stringify(error));
          if(this.typeOfCall){
            this.triggerError(error);
          }else{
            let errMsg = this.renderErrorMsg(error);
            this.setState({ isLoading: false,errorDownloadResults:true,downloadErrorMsg:errMsg,enableModelBusyFeedback:false});       
             }          
      }).catch(error =>
      {
        console.log(JSON.stringify(error));        
        if(this.typeOfCall){
					this.triggerError(error);
				}else{
					let errMsg = this.renderErrorMsg(error);
					this.setState({ isLoading: false,errorDownloadResults:true,downloadErrorMsg:errMsg,enableModelBusyFeedback:false});       
     		}
      });

    this.isEnabled = [];
  }

  triggerError = (error) =>{
    // this.processData('');
     this.setState({isLoading: false,
       totalResults: 0,
       showPagination: false,
       showResults: false,
       isInitialLoad: false,
       errorResults:true,
       noResults: true
     });
     this.downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
     let errMsg = this.renderErrorMsg(error);
     this.setState({errorMessage:errMsg});     
  }
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

  processData(resp) {
    //data = CustomQueryResponse;
    console.log( 'in Custom Query component file DATA: ' + JSON.stringify(resp.data));
    if(this.typeOfCall){
      if(resp.data && resp.data.results) {
        this.setState(
          { res: resp,
            nodes: resp.data.results},
          function () {
            console.log('how many nodes? ', this.state.nodes.length);
            this.setState({ multipleNodes: this.state.nodes.length > 1 ? 'col-lg-3 col-xl-3' : '' });
          });
      }
      let totalResults = 0;
      let downloadCount = DOWNLOAD_ALL;  
      if(resp.headers){
          totalResults = parseInt(resp.headers['total-results']);
          if(totalResults > DOWNLOAD_ALL){
            this.downloadAllTooltip = DOWNLOAD_ALL + ' results out of '+ totalResults +' Results will be downloaded, please filter results further to obtain full report';
          }else{          
            this.downloadAllTooltip = (totalResults === 1) ?'Downloads ' + totalResults + ' Results' : 'Downloads all ' + totalResults + ' Results' ;
            downloadCount= totalResults;
          } 
          this.setState({isLoading: false,
            totalResults: totalResults,
            totalPages: parseInt(resp.headers['total-pages']),
            showResults: resp.headers['total-results'] > 0 ? true : false,
            showPagination: resp.headers['total-results'] > 0 ? true : false,
            isInitialLoad: false,
            noResults: resp.headers['total-results'] && resp.headers['total-results'] > 0 ? false : true,
            errorResults: !resp.headers['total-results'],
            downloadCount: downloadCount
          });        
        }

        this.setState({ displayNodes: 'show', viewName: this.state.defaultViewName });
    }else{
      if(resp.data && resp.data.results) {
        this.nodeResults = resp.data.results;
        let totalResults = 0;
        let totalPages = 0;
        if(resp.headers){
            totalResults = parseInt(resp.headers['total-results']);
            totalPages = parseInt(resp.headers['total-pages']);
        }                
        this.setState({isLoading: false,totalPages:totalPages,errorDownloadResults:false,downloadErrorMsg:''},() => {this.getAllExcels()});
      }else{
        this.nodeResults = '';
        this.setState({isLoading: false,errorDownloadResults:true,downloadErrorMsg:error+'',enableModelBusyFeedback:false});
      }
    }
  }

  nodeOnClick(event, uri, id, nodeType) {
    event.preventDefault();
    let delimiter = '\/';
    let start = 3;
    let tokens = uri.split(delimiter).slice(start);
    let result = tokens.join(delimiter);
    sessionStorage.setItem(GlobalExtConstants.ENVIRONMENT + 'URI', result);
    console.log(['/model/' + nodeType + '/' + id + '/' + '1']);
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
        { pageRange: pageRange,enableModelBusyFeedback:true,showDownloadResultsModal:rangeModelState},
        function () { this.formQueryString(); }.bind(this)
      );
    }else{
      this.setState(
        {errorDownloadResults: false, showDownloadResultsModal: false, downloadErrorMsg:'', isLoading: false, enableModelBusyFeedback:false},
        function () { generateExcels(this.nodeResults);this.nodeResults='';this.typeOfCall = true;}.bind(this)
      );      
    }   
  }
  getExcels = () =>{
    this.typeOfCall = true;
    generateExcels(this.state.nodes);
  }

    handlePageChange = (pageNumber) => {
    console.log('[CustomQuery.jsx] HandelPageChange active page is', pageNumber);
    this.typeOfCall = true;
    this.setState(
      { activePage: pageNumber, isLoading: true, nodes: [], resetColumnFilters: false, isPageNumberChange: true },
      function () { this.formQueryString(); }.bind(this)
    );
  };
  openHistory = (nodeDisplay, nodeUri, nodeType) => { // open modal from Card
    console.log('history >> showModal',nodeDisplay);
    
    if(nodeType){
      this.setState({
        nodeDisplay: nodeDisplay,
        showHistoryModal: true,
        showModelOptions:true,
        enableCalendar:true,
        historyType:(this.state.historyType === 'cq') ? 'nodeState' : this.state.historyType,
        focusedNodeUri: nodeUri,
        focusedNodeType: nodeType,
      });
    }else{
      let payload = this.formPayload();
    this.setState({
        showHistoryModal:true,
        showModelOptions:false,
        focusedNodeUri: JSON.stringify(payload),
        focusedNodeType: nodeType,
        enableCalendar:true,
		historyType :'cq'
    });
  }
    }
  closeHistory = () => {
  	this.setState({
  		showHistoryModal: false,
		enableCalendar:true,
		historyType :'nodeState'
  	});
  }

  setViewName(event) {
    console.log(event.currentTarget.value);
    this.setState({
    		viewName: event.currentTarget.value
    });
  }

  setDefaultViewName(event) {
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
  }

  submitHistory = () => {
    console.log("submitting history");
    let paramToPassThrough = '';
    if(this.state.focusedNodeType){
      paramToPassThrough = '/history/' + this.state.historyType +'/' + this.state.focusedNodeType + '/' + btoa(this.state.focusedNodeUri);
    }else{
      paramToPassThrough = '/historyQuery/' + this.state.historyType + '/' + btoa(this.state.focusedNodeUri);     
    }
    let epochStartTime = (this.state.startDate).unix();
    this.props.history.push(paramToPassThrough + '/' + epochStartTime * 1000);
  }

  handleDateChange = (newDate) =>{
    this.setState({ startDate: moment(+newDate) });
    console.log('[CustomQuery.jsx] handleDateChange date is ', this.state.startDate);
    console.log('[CustomQuery.jsx] handleDateChange date is in millis ', +this.state.startDate);
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
  openNodeModal(nodeDisplay, nodeUri, nodeType){ // open modal
                 console.log('customquery >> showModal');
                 nodeDisplay = "Node Details of " + nodeUri;
                 let node = null;
                 let found = false;
                 for(var j = 0; j < this.state.nodes.length && !found; j++){
                    if(this.state.nodes[j].url === nodeUri){
                        node = this.state.nodes[j];
                        found = true;
                    }
                 }
                 if(nodeDisplay && found){
                    this.setState({
                       nodeDisplay: nodeDisplay,
                       focusedNode: node,
                       showNodeModal:true
                    });
                 }else{
                     this.setState({
                     showNodeModal:true
                     });
                 }
  }

  closeNodeModal = () => {
    this.setState({
    	showNodeModal: false
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.nodes.length > 0 && !this.state.visualAddition){
        Visualization.chart('currentState', [], [], this.state.res.data, this);
        this.setState({
                    showPagination: this.state.nodes.length > 0 ? true : false,
            		visualAddition: true
        });
    }
  }
  prepareDownloadRangeModel = () =>{
    let downloadRangeModel = (this.state.showDownloadResultsModal)?<DownloadRangeModel 
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
  render() {
    let simple = 'Enter Start Node Location => network/generic-vnfs/generic-vnf/a642ad94-9a84-4418-9358-c1ee860315e2';
    let advanced = 'Enter Start Node Location => /cloud-infrastructure/cloud-regions/cloud-region/cloudowner1/cloudregion1';
    let downloadRangeModel = this.prepareDownloadRangeModel();
    if (this.state.displayValidationError) {
      inputClasses.push('invalid');
    }
    let styling = inputClasses.join(' ');
    console.log('styling:' + styling);
    let nodes = '';
    let classes = `${this.state.displayNodes} container-fluid`;
    const modelGalleryElement = <ModelGallery
                nodes={this.state.nodes} 
                viewName={this.state.viewName}
                historyStackString={this.props.location.historyStackString} 
                openHistoryModal={this.openHistory}
                isPageNumberChange={this.state.isPageNumberChange}
                resetColumnInd={this.state.resetColumnFilters}
                enableRealTime={false}/>;
    if (this.state.nodes.length > 0) {
      console.log('nodes exist');
      nodes =
        <div>
          <hr />          
          {modelGalleryElement}
        </div >;
    }

    return (
      <div>
        <header className='addPadding jumbotron my-4'>
          <h1 className='display-2'>Welcome to Custom Queries!</h1>
          <p className='lead'>
            On this page you can choose from the many different
            predefined custom queries has to offer. Simply
            choose the query name and provide the location of the
            start node.<br />
            If prompted please also enter the values in required
            properties field as some queries require these values
            to execute.<br />
            Check the Help Section on the right for examples.
          </p>
        </header>
        <div className='static-modal'>
           <Modal show={this.state.showHistoryModal} onHide={this.closeHistory}>
           	<Modal.Header>
           		<Modal.Title>Retrieve {(this.state.focusedNodeType) ? this.state.focusedNodeType: 'Custom Query '} History</Modal.Title>
           	</Modal.Header>
           	<Modal.Body>
             		<form className={this.state.showModelOptions ? 'show' : 'hidden'}>
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
        <div className='static-modal'>
                         		<Modal show={this.state.showNodeModal} onHide={this.closeNodeModal} dialogClassName="modal-override">
                         			<Modal.Header>
                         				<Modal.Title>Retrieve {this.state.nodeDisplay}</Modal.Title>
                         			</Modal.Header>
                         			<Modal.Body>
                                       <Grid fluid={true}>
                                             <Row className='show-grid'>
                                               <Col lg={12} md={12} sm={12} xs={12}>
                                                   <ModelCard
                                                               key={this.state.focusedNode.id}
                                                               nodeId={this.state.focusedNode.id}
                                                               nodeType={this.state.focusedNode['node-type']}
                                                               nodeProps={this.state.focusedNode.properties}
                                                               nodeRelatives={this.state.focusedNode['related-to']}
                                                               nodeUrl={this.state.focusedNode.url}
                                                               historyStackString={this.props.location.historyStackString}
                                                               openHistoryModal={this.openHistory}
                                                               enableRealTime={false}/>
                                               </Col>
                                             </Row>
                                       </Grid>
                         			</Modal.Body>
                         			<Modal.Footer>
                         				<Button onClick={this.closeNodeModal}>Close</Button>
                         			</Modal.Footer>
                         		</Modal>
               </div>
        <div className='addPadding'>
          <div className='row addPaddingTop'>
            <Col md={8}>
              <form style={{ margin: 0 }} onSubmit={this.onAdditem} id='customQueryForm' name='customQueryForm'>
                <div className='form-group'>
                  <label>Query:</label><br />
                  <div id='customQueryText'>
                    <Select
                      className='dropdown-item'
                      autosize={true}
                      placeholder={this.state.queryPlaceHolder}
                      value={this.state.query}
                      onChange={this.updateSelectedHandler}
                      options={dropdownList} />
                  </div>
                </div>
                <div className={this.state.displayDescription} id='customQueryDescription'>
                  <Label bsStyle='info'>Description</Label>
                  <p><br />{this.state.description}</p>
                  <a onClick={() => this.setState({ showText: !this.state.showText })}
                      className={this.state.additionalInfo==='' ? 'hidden' : 'show'}>See more</a><br />
                  <Collapse in={this.state.showText}>
                    <div>
                      <span>
                        {this.state.additionalInfo.split('\n').map(info => {
                          return <div>{info}</div>;
                        })}
                      </span>
                    </div>
                  </Collapse>
                </div>
                <div className='form-group addPaddingTop' id='startNodeText'>
                  <label htmlFor='StartNode'>Enter Start Node Location (full uri path): </label>
                  <input type='text'
                    id='startNode'
                    className={styling}
                    name='startNode'
                    placeholder={this.state.placeholder}
                    onChange={this.inputChangeHandler}
                    disabled={this.state.disableInputs}
                    value={this.state.startNode} />
                </div>
                <div className={this.state.displayReqProps} id='reqPropsText'>
                  <label htmlFor={'reqProps'}>Required Properties</label>
                  <input type='text'
                    id='reqProps'
                    className={styling}
                    name='reqProps'
                    placeholder={this.state.reqPropPlaceholder}
                    onChange={this.inputChangeHandler}
                    disabled={this.state.disableInputs} 
                    value={this.state.reqProps}/>
                </div>
                <div className={this.state.displayOptionalProps}>
                  <label htmlFor={'optionalProps'}>Optional Properties</label>
                  <input type='text'
                         id='optionalProps'
                         className={styling}
                         name='optionalProps'
                         placeholder={this.state.optionalPropPlaceholder}
                         onChange={this.inputChangeHandler}
                         disabled={this.state.disableInputs}
                         value={this.state.optionalProps} />
                </div>
                <div className='row addPaddingTop'>
                  <Col sm={12}>
                    <button className='btn btn-primary btn-md' disabled={!this.state.formIsValid}>Submit</button>
                    { INVLIST.isHistoryEnabled && (<button className='btn btn-outline-secondary' type='button' onClick={this.openHistory} disabled={!this.state.formIsValid}>History</button>)}
                  </Col>
                </div>
              </form>
            </Col>
            <Col md={4}>
              <PanelGroup accordion id='rb-accordion'>
                <Panel eventKey='1'>
                  <Panel.Heading>
                    <Panel.Title toggle>+ Simple Query</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body collapsible className='cardwrap'>
                    <p>
                      Please specify a Query from the Dropdown Menu.<br />
                      <br />
                      Please enter exact location of the Starting Node Path
                      <br /> <br />
                      Submit
                      <br /> <br />
                      Examples: <br />
                      Query => complex-fromVnf<br />
                      Enter Starting Node => /network/pnfs/pnf/pnf-name1<br /> <br />
                      {simple}<br /><br />
                      *Simple Query requires no other values to be passed other than the start node path
                    </p>
                  </Panel.Body>
                </Panel>
                <Panel eventKey='2'>
                  <Panel.Heading>
                    <Panel.Title toggle>+ Advanced Queries with Properties</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <p className='cardwrap'>
                      Please specify a Query from the Dropdown Menu.<br />
                      <br />
                      Please enter exact location of the Starting Node Path<br /> <br />
                      Please enter required query parameter - if applicable<br /> <br />
                      Please enter optional query parameter - if applicable<br /> <br />
                      Example: <br />
                      Query => vlantag-fromVlanidouter<br /> <br />
                      {advanced}<br /> <br />
                      Required Properties: vlanIdOuter=203<br /> <br />
                      Optional Properties: vlanIdInner=103
                    </p>
                  </Panel.Body>
                </Panel>
              </PanelGroup>
            </Col>
          </div>
        </div>

        <div className='addPaddingTop'>
          <div className='container-fluid model-container custom-query-result'>
          <Spinner loading={this.state.isLoading}>
            <Row className={this.state.isInitialLoad ? 'hidden' : 'show'}>
              <Col md={12}>
                <h2>
                  <span className='badge badge-dark'>{this.state.query}</span> Results
                </h2>
                <br/>
                <h5>Total Results: <strong>{this.state.totalResults}</strong></h5>
              </Col>
            </Row>
            { this.state.showResults && <div className='addPaddingTop'>
                <OutputToggle scope={this} visualDisabled={this.state.totalResults > PAGINATION_CONSTANT}/>
            </div> }
            <Row className={this.state.showResults ? 'show' : 'hidden'}>
		      <Col md={8}  className={this.state.showPagination ? 'show' : 'hidden'}>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={PAGINATION_CONSTANT.RESULTS_PER_PAGE}
                  totalItemsCount={this.state.totalResults}
                  pageRangeDisplayed={PAGINATION_CONSTANT.PAGE_RANGE_DISPLAY}
                  onChange={this.handlePageChange} />
              </Col>
              <Col md={2} className='text-right'>
                <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{this.downloadAllTooltip}</Tooltip>}>
                  <span className="d-inline-block" style={{display: 'inline-block'}}>
                    <Button bsSize='small' onClick={()=>{this.getAllExcels(this.state.downloadCount)}}>
                      Download XLSX <i className='icon-documents-downloadablefile'></i>
                </Button>
                  </span>
                </OverlayTrigger>
              </Col>
              <Col md={2} className='text-right'>
                <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{this.downloadRangeTooltip}</Tooltip>}>
                  <span className="d-inline-block" style={{display: 'inline-block'}}>
                    <Button bsSize='small' onClick={this.openDownloadRange}>
                      Download XLSX (Range) <i className='icon-documents-downloadablefile'></i>
                    </Button>
                  </span>
               </OverlayTrigger>
              </Col>
	          </Row>
              <div className={'addPaddingTop alert alert-danger ' +(this.state.errorResults ? 'show' : 'hidden')} role="alert">
                An error occurred, please try again later. If this issue persists, please contact the system administrator. {this.state.errorMessage}
              </div>
           	  <Row className={'addPaddingTop ' + (this.state.noResults ? 'show' : 'hidden')}>
           	  	<Col md={12}>
           	  		<h2>No Results Found</h2>
           	  	</Col>
           	  </Row>
	          <Row className={this.state.isInitialLoad ? 'hidden' : 'show'}>              
              <div className={this.state.isLoading ? 'hidden' : 'show'}>
                <div className='col align-self-center'>
                  <div className={classes}>
                    {nodes}
                  </div>
                </div>
              </div>
	          </Row>
	          <Row className={this.state.showPagination ? 'show' : 'hidden'}>
		          <Col md={12}>
                <Pagination
                  activePage={this.state.activePage}
                  itemsCountPerPage={PAGINATION_CONSTANT.RESULTS_PER_PAGE}
                  totalItemsCount={this.state.totalResults}
                  pageRangeDisplayed={PAGINATION_CONSTANT.PAGE_RANGE_DISPLAY}
                  onChange={this.handlePageChange} />
              </Col>
            </Row>
            </Spinner>
            <Spinner loading={this.state.enableModelBusyFeedback}>
              {downloadRangeModel}
            </Spinner>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomQuery;
