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
import { connect } from 'react-redux';

import commonApi from 'utils/CommonAPIService.js';
import deepDiffMapper from 'utils/DiffUtil.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';

import HistoryGallery from './components/HistoryGallery.jsx';
import HistoryCard from './components/HistoryCard.jsx';
import NodeDiffCard from './components/NodeDiffCard.jsx';
import AnimationControls from './components/AnimationControls.jsx';
import moment from "moment";
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Pagination from 'react-js-pagination';
import { HistoryConstants } from './HistoryConstants';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import ReactBootstrapSlider from 'react-bootstrap-slider';

let INVLIST = GlobalExtConstants.INVLIST;
/**
 * This class is used to handle any url interactions for models.
 * When a user selects a inventory item in browse or special search,
 * this model class should be used to handle the url + params and query
 * the proxy server.
 */

class History extends Component {

  elements = [];
  pageTitle = '';
  nodeType = '';
  nodeResults = '';
  payload = {start : atob(this.props.match.params.nodeUriEnc)};

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
                  activePage: 1,
                  totalResults: 0,
                  enableBusyFeedback: true,
                  enableBusyRecentFeedback: true,
                  enableBusyHistoryStateFeedback: true,
                  enableBusyDiffFeedback: true,
                  data: [],
                  nodes: [],
                  nodeCurrentState: null,
                  nodeHistoryState: null,
                  showHistoryModal: false,
                  splitScreenCard: false,
                  entries: [],
                  filteredEntries: [],
                  isLifeCycle: false,
                  isState: false,
                  currentStateHistoryValue: parseInt(this.props.match.params.epochTime),
                  stepEpochStateTime: 1000,
                  maxEpochStartTime: Math.round(new Date().getTime()),
                  minEpochStartTime: parseInt(this.props.match.params.epochTime) - 259200000,
                  nodeDiff: null,
                  showSlider: false,
                  sliderTickArray: null,
                  showTicks: INVLIST.showTicks,
                  selectedHistoryStateFormatted: moment(parseInt(this.props.match.params.epochTime)).format('dddd, MMMM Do, YYYY h:mm:ss A'),
                  nodeDisplay: (this.props.match.params.nodeType).toUpperCase(),// + ' : ' + (atob(this.props.match.params.nodeUriEnc)).split(this.props.match.params.nodeType + '\/').pop(),
                  nodeName: (this.props.match.params.nodeType).toUpperCase(),
                  historyErrMsg: null,
                  changesErrMsg: null,
                  lifecycleErrMsg: null,
                  currentErrMsg: null
                };
                console.log('minEpochStateTime: '+this.state.minEpochStateTime);
                console.log('maxEpochStartTime: '+this.state.maxEpochStartTime);
                console.log('stepEpochStateTime: '+this.state.stepEpochStateTime);
                console.log('currentStateHistoryValue: '+this.state.currentStateHistoryValue);

  }
  resultsMessage = '';
  componentDidMount = () => {
    console.log('[History.jsx] componentDidMount props available are', JSON.stringify(this.props));
    if(INVLIST.isHistoryEnabled){
        this.beforefetchInventoryData();
    }
  };
  componentWillUnmount  = () => {
    console.log('[History.jsx] componentWillUnMount');
  }
  getUnixSecondsFromMs = (ms) => {
    return ms/1000;
  }
  beforefetchInventoryData = (param) => {
    if (param) {
      this.setState(
        { enableBusyFeedback: true, activePage: 1, totalResults: 0},
        function () { this.fetchInventoryData(param); }.bind(this)
      );
    } else {
      this.fetchInventoryData();
    }
  };
    initState = () =>{
        this.setState({
              activePage: 1,
              totalResults: 0,
              enableBusyFeedback: true,
              enableBusyRecentFeedback: true,
              enableBusyHistoryStateFeedback: true,
              enableBusyDiffFeedback: true,
              data: [],
              nodes: [],
              nodeCurrentState: null,
              nodeHistoryState: null,
              showHistoryModal: false,
              splitScreenCard: false,
              entries: [],
              filteredEntries: [],
              isLifeCycle: false,
              isState: false,
              stepEpochStateTime: 1000,
              maxEpochStartTime: Math.round(new Date().getTime()),
              minEpochStartTime: parseInt(this.props.match.params.epochTime) - 259200000,
              nodeDiff: null,
              showSlider: false,
              sliderTickArray: null,
              showTicks: INVLIST.showTicks,
              nodeDisplay: (this.props.match.params.nodeType).toUpperCase(),// + ' : ' + (atob(this.props.match.params.nodeUriEnc)).split(this.props.match.params.nodeType + '\/').pop(),
              nodeName: (this.props.match.params.nodeType).toUpperCase(),
              historyErrMsg: null,
              changesErrMsg: null,
              lifecycleErrMsg: null,
              currentErrMsg: null
            });
      }
  getSettings = () => {
    const settings = {
          'NODESERVER': INVLIST.NODESERVER,
          'PROXY': INVLIST.PROXY,
          'PREFIX': INVLIST.PREFIX,
          'VERSION': INVLIST.VERSION,
          'USESTUBS': INVLIST.useStubs
        };
    return settings;
  }
  fetchInventoryData = (param) => {
    console.log('fetchInventoryData', param);
    this.resultsMessage = '';
    let settings = this.getSettings();
    const inventory = INVLIST.INVENTORYLIST;
    let url = '';
    console.log('[History.jsx] fetchInventoryData nodeUriEnc= ', atob(this.props.match.params.nodeUriEnc));
    let pageName = "History";
    this.nodeResults = '';
    switch(this.props.match.params.type){
        case('nodeState'):
            this.setState({splitScreenCard: true, isState: true, showState: true});
            this.getCurrentStateCall(settings);
            this.pageTitle = "State of "+ this.state.nodeDisplay +" at "+ moment(parseInt(this.props.match.params.epochTime)).format('dddd, MMMM Do, YYYY h:mm:ss A');
            break;
        case('nodeLifeCycleSince'):            
            this.setState({splitScreenCard: false, isLifeCycle: true, showLifeCycle: true});
            this.getCurrentStateCall(settings);
            this.commonApiServiceCall(settings, null);
            this.pageTitle = "Network element state(s) of "+  this.state.nodeDisplay;
            break;
        case('nodeLifeCycle'):
            this.setState({splitScreenCard: false, isLifeCycle: true, showLifeCycle: true});
            this.getCurrentStateCall(settings);
            this.commonApiServiceCall(settings, null);
            this.pageTitle = "Network element state(s) of "+  this.state.nodeDisplay;            
            break;
        default:
            this.pageTitle = "History";
            this.setState({splitScreenCard: false, isLifeCycle: true, showLifeCycle: true});
            this.getCurrentStateCall(settings);
            this.commonApiServiceCall(settings, null);
    }
    console.log('[History.jsx] active page', this.state.activePage);
  };
  generateEntries = (properties, relationships, actions) =>{
    let tempEntries = [];
    if(properties){
        for (var i = 0; i < properties.length; i++) {
            properties[i].displayTimestamp =  moment(properties[i].timestamp).format('dddd, MMMM Do, YYYY h:mm:ss A');
            properties[i].timeRank = properties[i].timestamp;
            properties[i].type = "attribute";
            properties[i].header = "Attribute: " + properties[i].key;
            if(properties[i].value !== null && properties[i].value !== 'null'){
                properties[i].action = "Updated";
                properties[i].body   = "Updated to value: " + properties[i].value;
            }else{
                properties[i].action = "Deleted";
                properties[i].body   = "Removed";
            }
            properties[i]['tx-id'] = (properties[i]['tx-id']) ? properties[i]['tx-id'] : 'N/A';
            tempEntries.push(properties[i]);
        }
    }
    if(actions){
        for (var k = 0; k < actions.length; k++) {
            actions[k].displayTimestamp =  moment(actions[k].timestamp).format('dddd, MMMM Do, YYYY h:mm:ss A');
            actions[k].timeRank = actions[k].timestamp;
            actions[k].type = "action";
            actions[k].header = "Action: " + actions[k].action;
            if(actions[k].action === 'CREATED'){
                actions[k].action = "Created";
                actions[k].body   = "Network Element Created";
            }else if(actions[k].action === 'DELETED'){
                actions[k].action = "Deleted";
                actions[k].body   = "Network Element Removed";
            }
            actions[k]['tx-id'] = (actions[k]['tx-id']) ? actions[k]['tx-id'] : 'N/A';
            tempEntries.push(actions[k]);
        }
    }
    if(relationships){
        for (var j = 0; j < relationships.length; j++) {
            if(relationships[j].timestamp){
                relationships[j].dbStartTime = relationships[j].timestamp;
                relationships[j].displayTimestamp =  moment(relationships[j].dbStartTime).format('dddd, MMMM Do, YYYY h:mm:ss A');
                relationships[j].timeRank = relationships[j].dbStartTime;
                relationships[j].type   = "relationship";
                relationships[j].header = "Relationship added";
                relationships[j].body   = "The relationship with label " + relationships[j]['relationship-label'] + " was added from this node to the "+ relationships[j]['node-type'] +" at " + relationships[j].url;
                relationships[j].action = "Added";
                relationships[j]['tx-id'] = (relationships[j]['tx-id']) ? relationships[j]['tx-id'] : 'N/A';
                let additions = JSON.parse(JSON.stringify(relationships[j]));
                tempEntries.push(additions);
            }
            if(relationships[j]['end-timestamp']){
                 relationships[j].dbEndTime = relationships[j]['end-timestamp'];
                 relationships[j].sot = relationships[j]['end-sot'];
                 relationships[j].displayTimestamp =  moment(relationships[j].dbEndTime).format('dddd, MMMM Do, YYYY h:mm:ss A');
                 relationships[j].timeRank = relationships[j].dbEndTime;
                 relationships[j].header = "Relationship removed";
                 relationships[j].body   = "The " + relationships[j]['node-type'] +" : " + relationships[j].url + " relationship with label " + relationships[j]['relationship-label'] + " was removed from this node.";
                 relationships[j].type   = "relationship";
                 relationships[j].action = "Deleted";
                 relationships[j]['tx-id'] = (relationships[j]['tx-id']) ? relationships[j]['tx-id'] : 'N/A';
                 let deletions = JSON.parse(JSON.stringify(relationships[j]));
                 tempEntries.push(deletions);
            }
        }
    }

    let tempEntriesSorted = tempEntries.sort(function(a, b) {
                                                       var compareA = a.timeRank;
                                                       var compareB = b.timeRank;
                                                       if(compareA > compareB) return -1;
                                                       if(compareA < compareB) return 1;
                                                       return 0;
                                                      });

    this.setState({
                totalResults : tempEntriesSorted.length,
                entries : tempEntriesSorted,
                filteredEntries: tempEntriesSorted
              });

  }
  triggerHistoryStateCall = (nodeUri, epochTime) =>{
     //get url for historical call
     let settings = this.getSettings();
     window.scrollTo(0, 400);
      this.setState({
                     enableBusyHistoryStateFeedback : true,
                     enableBusyDiffFeedback: true
                   });
     this.getHistoryStateCall(settings, null, null, epochTime);
  }
  generateDiffArray = (arr) => {
    let tempArray = {};
    tempArray['properties'] = [];
    tempArray['related-to'] = [];

    for (var i = 0; i < arr.properties.length; i++ ){
        tempArray['properties'][arr.properties[i].key] = arr.properties[i];
    }
    for (var j = 0; j < arr['related-to'].length; j++ ){
        //TODO use id if it is coming
        tempArray['related-to'][arr['related-to'][j].url] = arr['related-to'][j];
    }
    return tempArray;
  }
  getCurrentStateCall = (settings,url,param) =>{
      this.setState({currentErrMsg:null});
      commonApi(settings, "query?format=state", 'PUT', this.payload, 'currentNodeState', null, 'history-traversal')
      .then(res => {
        let node = atob(this.props.match.params.nodeUriEnc).split(res.data.results[0]['node-type'] + '\/').pop();
        res.data.results[0].primaryHeader = 'Current state of ' + this.state.nodeName + ' - ' + node;
        res.data.results[0].secondaryHeader = atob(this.props.match.params.nodeUriEnc);
        this.setState(
        {
          nodeCurrentState : res.data.results[0],
          enableBusyRecentFeedback: false,
          nodeDisplay :node
        });
        if(this.props.match.params.type === 'nodeState'){
            this.getHistoryStateCall(settings, null);
        }
        console.log('After recent node service call ......',this.state);
        console.log('[History.jsx] recent node results : ',  res.data.results[0]);
        }, error=>{
          this.triggerError(error, "current");
        }).catch(error => {
          this.triggerError(error, 'current');
        });
  };
  getHistoryStateCall = (settings, url, param, timeStamp) =>{
      let ts = this.state.currentStateHistoryValue;
      if(timeStamp){
        ts = parseInt(timeStamp);
      }
      if(this.state.showTicks){
        this.setState({changesErrMsg:null});
        commonApi(settings, "query?format=changes", 'PUT', this.payload, 'historicalNodeStateChanges', null, 'history-traversal')
        .then(res => {
          let tickTempArray = [];
          for(var j = 0; j <  res.data.results.length; j++ ){
              for(var k = 0; k < res.data.results[j].changes.length; k++){
                  if(!tickTempArray.includes(res.data.results[j].changes[k])){
                      tickTempArray.push(res.data.results[j].changes[k]);
                  }
              }
          }
          let tickArray = tickTempArray.sort(function(a, b) {
                                                                 var compareA = a;
                                                                 var compareB = b;
                                                                 if(compareA < compareB) return -1;
                                                                 if(compareA > compareB) return 1;
                                                                 return 0;
                                                                });
          console.log("tick array: " + tickArray);
          this.setState({showSlider:true, sliderTickArray: tickArray});
        }, error=>{
          this.triggerError(error, "changes");
        }).catch(error => {
          this.triggerError(error, 'changes');
        });
      }else{
        this.setState({showSlider:true});
      }
      this.setState({historyErrMsg:null});
      commonApi(settings, "query?format=state&startTs=" + ts + "&endTs=" + ts, 'PUT', this.payload, 'historicalNodeState', null, 'history-traversal')
      .then(res => {
         let node = atob(this.props.match.params.nodeUriEnc).split(res.data.results[0]['node-type'] + '\/').pop();
         res.data.results[0].primaryHeader = 'Historical state of '+ this.state.nodeName + ' - ' + node + ' as of ' + moment(parseInt(this.props.match.params.epochTime)).format('dddd, MMMM Do, YYYY h:mm:ss A');
         res.data.results[0].secondaryHeader = atob(this.props.match.params.nodeUriEnc);
        this.setState(
        {
          showState: true,
          splitScreenCard: true,
          nodeHistoryState :  res.data.results[0],
          enableBusyHistoryStateFeedback: false
        });
        console.log('After historical node state service call ......',this.state);
        console.log('[History.jsx] historical node state results : ',  res.data.results[0]);
        if(this.state.nodeHistoryState != null && this.state.nodeCurrentState != null){
                    let nodeDiffHistoryArr = this.generateDiffArray(this.state.nodeHistoryState);
                    let nodeDiffCurrentArr = this.generateDiffArray(this.state.nodeCurrentState);
                    var result = deepDiffMapper.map(nodeDiffHistoryArr, nodeDiffCurrentArr);
                    console.log("diff map" + result);
                    this.setState({ nodeDiff: result, enableBusyDiffFeedback: false });
                }else{
                    this.setState({ enableBusyDiffFeedback: false });
         }
      }, error=>{
          this.triggerError(error, "historic");
      }).catch(error => {
          this.triggerError(error, 'historic');
      });

  };

  commonApiServiceCall = (settings,url,param) =>{
    let path = "query?format=lifecycle";
    let stubPath = "nodeLifeCycle";
    if(this.props.match.params.type === "nodeLifeCycleSince"){
        path += "&startTs=" + parseInt(this.props.match.params.epochTime);
        stubPath += "Since";
    }
    this.setState({lifecycleErrMsg:null});
    commonApi(settings, path, 'PUT', this.payload, stubPath, null, 'history-traversal')
      .then(res => {
        // Call dispatcher to update state
        console.log('once before service call ......',this.state);
        let resp =  res.data.results[0];
        this.resultsMessage = '';
        let totalResults = 0;
        if(resp && resp.properties.length + resp['related-to'].length > 0){
            if(this.props.match.params.type === "nodeState"){
                totalResults = 1;
            }else{
                //wait to generate entries to set this
                totalResults = 0;
            }
        }
        this.setState(
          {
            totalResults : totalResults,
            enableBusyFeedback:false,
          });
        if(resp){
            this.generateEntries(resp.properties, resp['related-to'], resp['node-actions']);
        }
        console.log('After service call ......',this.state);
        console.log('[History.jsx] results : ', resp);
      }, error=>{
        this.triggerError(error, 'lifecycle');
      }).catch(error => {
        this.triggerError(error, 'lifecycle');
      });
  };
  triggerError = (error, type) => {
      console.error('[History.jsx] error : ', JSON.stringify(error));
    	let errMsg = '';
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
    	//Suppress 404's because that is just no results
        if(error.response && error.response.status === 404){
           errMsg = '';
        }
    	if(type === 'lifecycle'){
    	     this.setState({
                    lifecycleErrMsg: errMsg,
                    enableBusyFeedback: false,
                    totalResults: 0
                  });
    	}else if (type === 'changes'){
    	     this.setState({
    	            showSlider:true,
    	            changesErrMsg: errMsg
    	     });
    	}else if (type === 'historic'){
    	    console.log('[History.jsx] historical node state error : ', error);
            this.setState(
            {
              showState: true,
              splitScreenCard: true,
              nodeHistoryState : null,
              enableBusyHistoryStateFeedback:false,
              enableBusyDiffFeedback:false,
              historyErrMsg: errMsg
            });
    	}else if (type === 'current'){
            this.setState(
            {
              nodeCurrentState : null,
              currentErrMsg: errMsg,
              enableBusyRecentFeedback:false
            });
    	}else{
    	    console.log('[History.jsx] triggerError method called without a type.' );
    	}
    }

  componentWillReceiveProps(nextProps) {
    console.log('[History.jsx] componentWillReceiveProps');
    console.log('[History.jsx] next nodeUri:', atob(nextProps.match.params.nodeUriEnc));
    console.log('[History.jsx] this nodeUri:', atob(this.props.match.params.nodeUriEnc));

    if (nextProps.match.params.nodeUriEnc
            && nextProps.match.params.type
            && nextProps.match.params.epochTime
            && ((nextProps.match.params.nodeUriEnc !== this.props.match.params.nodeUriEnc) ||
                (nextProps.match.params.type !== this.props.match.params.type) ||
                (nextProps.match.params.epochTime !== this.props.match.params.epochTime))
    ) {
      this.initState();
      this.props = nextProps;
      this.beforefetchInventoryData();
    }
  };

  handlePageChange = (pageNumber) => {
    console.log('[History.jsx] HandelPageChange active page is', pageNumber);
    this.setState(
      { activePage: pageNumber, enableBusyFeedback: true },
      function () { this.beforefetchInventoryData(); }.bind(this)
    );
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

  stateHistoryFormat = (event) =>{
     this.setState({ currentStateHistoryValue: event.target.value, selectedHistoryStateFormatted: moment(event.target.value).format('dddd, MMMM Do, YYYY h:mm:ss A')});
  };
  changeHistoryState = () =>{
    console.log('minEpochStateTime: ' + this.state.minEpochStateTime);
    console.log('maxEpochStartTime: ' + this.state.maxEpochStartTime);
    console.log('stepEpochStateTime: ' + this.state.stepEpochStateTime);
    console.log('currentStateHistoryValue: ' + this.state.currentStateHistoryValue);
    console.log("Calling the route again with a new timestamp");
    this.props.history.push('/history/' + this.props.match.params.type + '/' + this.props.match.params.nodeType + '/' + this.props.match.params.nodeUriEnc + '/' + this.state.currentStateHistoryValue);
  }
  filterList = (event) =>{
     var updatedList = this.state.entries;
     updatedList = updatedList.filter((entry) =>{
       return JSON.stringify(entry).toLowerCase().search(
         event.target.value.toLowerCase()) !== -1;
     });
     this.setState({filteredEntries: updatedList, totalResults: updatedList.length});
   }

   setHistoricStateValues = (currValue) =>{
     this.setState({currentStateHistoryValue: currValue, selectedHistoryStateFormatted: moment(currValue).format('dddd, MMMM Do, YYYY h:mm:ss A')});
   }

   navigateHistory = (time) =>{
     this.props.history.push('/history/' + this.props.match.params.type + '/' + this.props.match.params.nodeType + '/' + this.props.match.params.nodeUriEnc + '/' + time);
   }

   setStateValue = (key, value) =>{
      this.setState((state) => { key : value });
   }
   getStateValue = (stateVar) => {
     return this.state[stateVar];
   }

  render() {
    console.log('[History Props] render: ', JSON.stringify(this.props) + 'elements : ', this.elements);
    console.log('[History nodeUri] render: ', atob(this.props.match.params.nodeUriEnc));
    if(INVLIST.isHistoryEnabled){
        return (
          <div>
          <header className='addPadding jumbotron my-4'>
            <h1 className='display-2'>Network Element History</h1>
            <p className='lead'>
              On this page you have the ability to view a network element in its current and historic state.
              The attributes are clickable to view extended information about who and when they were last updated.
              {this.props.match.params.type === "nodeLifeCycle" || this.props.match.params.type === "nodeLifeCycleSince"
              ? 'The table at the bottom of the page shows a list of all updates made on the network element (it is filterable).\n' +
                'Click an update in that table to rebuild the historic state at the time of the update.\n' +
                'A difference will be displayed between the current state and the historic state in the center.' : ''}
            </p>
          </header>
          <Grid fluid={true} className='addPadding'>
            <Row>
              <Col className='col-lg-12'>
                    <div className='card d3-model-card'>
                      <div className='card-header model-card-header'>
                        <h2>{this.pageTitle}</h2>
                      </div>
                      <Row className={this.state.changesErrMsg ? 'show' : 'hidden'} >
                        <div className='addPaddingTop alert alert-danger' role="alert">
                            An error occurred while trying to get the state changes, please try again later. If this issue persists, please contact the system administrator. {this.state.changesErrMsg}
                        </div>
                      </Row>
                      { (this.state.isState && this.state.showSlider && this.state.showTicks) && (
                      <div className='card-header'>
                        <Row className='show-grid'>
                           <Col md={3}>
                               <ReactBootstrapSlider
                                     value={this.state.currentStateHistoryValue}
                                     change={this.stateHistoryFormat}
                                     slideStop={this.stateHistoryFormat}
                                     step={ 1 }
                                     ticks={ this.state.sliderTickArray }
                                     ticks_snap_bounds={ 10000 }
                                     orientation="horizontal" />
                                   <p>{this.state.selectedHistoryStateFormatted}</p>
                                   <button type='button' className='btn btn-outline-primary' onClick={this.changeHistoryState}>Refresh</button>
                           </Col>
                           <AnimationControls playControlsDisabled={true} get={this.getStateValue} set={this.setStateValue} tickArray={this.state.sliderTickArray} currentValue={this.state.currentStateHistoryValue} setValueState={this.setHistoricStateValues} setNavigate={this.navigateHistory} />
                        </Row>
                      </div>)}
                      { (this.state.isState && this.state.showSlider && !this.state.showTicks) && (
                      <div className='card-header'>
                        <Row className='show-grid'>
                           <Col md={12}>
                                <ReactBootstrapSlider
                                      value={this.state.currentStateHistoryValue}
                                      change={this.stateHistoryFormat}
                                      slideStop={this.stateHistoryFormat}
                                      step={this.state.stepEpochStateTime}
                                      max={this.state.maxEpochStartTime}
                                      min={this.state.minEpochStartTime}
                                      orientation="horizontal" />
                                   <p>{this.state.selectedHistoryStateFormatted}</p>
                                   <button type='button' className='btn btn-outline-primary' onClick={this.changeHistoryState}>Refresh</button>
                           </Col>
                        </Row>
                      </div>)}
                      <div className='card-content model-card-content'>
                        <div>
                              <Row className='show-grid'>
                                <Col md={12}>
                                  <Spinner loading={this.state.enableBusyHistoryStateFeedback && this.state.showState}>
                                    {this.state.showState && !this.historyErrMsg && (<HistoryCard split={this.state.splitScreenCard} node={this.state.nodeHistoryState}/>)}
                                    <Row className={this.state.historyErrMsg ? 'show' : 'hidden'} >
                                      <div className='addPaddingTop alert alert-danger' role="alert">
                                          An error occurred while trying to get the historic state, please try again later. If this issue persists, please contact the system administrator. {this.state.historyErrMsg}
                                      </div>
                                    </Row>
                                  </Spinner>
                                  <Spinner loading={this.state.showState && this.state.enableBusyDiffFeedback}>
                                    {this.state.showState && (<NodeDiffCard diff={this.state.nodeDiff}/>)}
                                  </Spinner>
                                  <Spinner loading={this.state.enableBusyRecentFeedback}>
                                    { !this.currentErrMsg && (<HistoryCard split={this.state.splitScreenCard} node={this.state.nodeCurrentState}/>)}
                                    <Row className={this.state.currentErrMsg ? 'show' : 'hidden'} >
                                      <div className='addPaddingTop alert alert-danger' role="alert">
                                          An error occurred while trying to get the current state, please try again later. If this issue persists, please contact the system administrator. {this.state.currentErrMsg}
                                      </div>
                                    </Row>
                                  </Spinner>
                                  <hr />
                                  <span className='resultMessage'>{this.resultsMessage}</span>
                                </Col>
                              </Row>
                        </div>
                      </div>
                      <div className='card-footer'>
                         <strong>Tip:</strong> <em>Click any attribute to view more details</em>
                      </div>
                   </div>
              </Col>
            </Row>
            <Row>
                <div className={'addPaddingTop alert alert-danger ' + (this.state.lifecycleErrMsg ? 'show' : 'hidden')} role="alert">
                    An error occurred while trying to get the list of updates on the current node, please try again later. If this issue persists, please contact the system administrator. {this.state.lifecycleErrMsg}
                </div>
            {this.state.showLifeCycle && !this.state.lifecycleErrMsg && (
               <Col className='col-lg-12'>
                     <div className='card d3-model-card'>
                       <div className='card-header model-card-header'>
                         <h2 className={this.props.match.params.type === "nodeLifeCycle" ? 'show' : 'hidden'}>All Updates on {this.state.nodeDisplay}</h2>
                         <h2 className={this.props.match.params.type === "nodeLifeCycleSince" ? 'show' : 'hidden'}>All Updates on {this.state.nodeDisplay} Since {this.state.selectedHistoryStateFormatted}</h2>
                       </div>
                       <div className='card-header'>
                            <p><strong>Tip:</strong> <em>Click any update to view the state of the node at that point in time</em></p>
                            <div>
                              <h5>Total Results: <strong>{this.state.totalResults}</strong></h5>
                            </div>
                            <div>
                                <form>
                                    <fieldset className="form-group">
                                        <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList}/>
                                    </fieldset>
                                </form>
                            </div>
                       </div>
                       <div className='card-content model-card-content'>
                            <Spinner loading={this.state.enableBusyFeedback}>
                              <div>
                                  <HistoryGallery nodeId={atob(this.props.match.params.nodeUriEnc)} entries={this.state.filteredEntries} triggerState={this.triggerHistoryStateCall}/>
                              </div>
                            </Spinner>
                       </div>
                     </div>
                </Col> )}
              </Row>
          </Grid>
          </div>
        );
     }else{
        return(<p>History Not Enabled for this instance, please check config.</p>)
     }
   }
}

export default History;
