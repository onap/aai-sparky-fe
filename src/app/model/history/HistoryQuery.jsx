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

import moment from "moment";
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import * as d3 from "d3";
import 'd3-selection-multi';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import HistoryCard from './components/HistoryCard.jsx';
import NodeDiffCard from './components/NodeDiffCard.jsx';
import AnimationControls from './components/AnimationControls.jsx';
import TopologyDiffCard from './components/TopologyDiffCard.jsx';
import OutputVisualization, {Visualization} from 'generic-components/OutputVisualization.jsx';



let INVLIST = GlobalExtConstants.INVLIST;

/**
 * This class is to show visualizations of queries and show a historical state
 */

class HistoryQuery extends Component {

  svgWidth = window.outerWidth * 0.8;
  elements = [];
  pageTitle = '';
  nodeType = '';
  nodeResults = '';

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
                      totalResults: 0,
                      enableBusyRecentFeedback: true,
                      enableBusyHistoryStateFeedback: true,
                      enableBusyDiffFeedback: true,
                      data: [],
                      nodes: [],
                      payload: ((this.props.match.params.type == 'cq') ? atob(this.props.match.params.payloadEnc) : { "dsl" : atob(this.props.match.params.payloadEnc)}),
                      topologyCurrentState: null,
                      topologyHistoryState: null,
                      currentStateHistoryValue: parseInt(this.props.match.params.epochTime),
                      stepEpochStateTime: 1000,
                      maxEpochStartTime: Math.round(new Date().getTime()),
                      minEpochStartTime: parseInt(this.props.match.params.epochTime) - 259200000,
                      nodeDiff: null,
                      selectedHistoryStateFormatted: moment(parseInt(this.props.match.params.epochTime)).format('dddd, MMMM Do, YYYY h:mm:ss A'),
                      queryDisplay: ((this.props.match.params.type == 'cq') ?  JSON.parse(atob(this.props.match.params.payloadEnc)).query : atob(this.props.match.params.payloadEnc)),
                      currentGraphNodes: [],
                      currentGraphLinks: [],
                      historicGraphNodes: [],
                      historicGraphLinks: [],
                      selectedNodeHistoryState: null,
                      selectedNodeCurrentState: null,
                      showNodeModal: false,
                      showTopologyDiffModal: false,
                      nodeDisplay: '',
                      totalDiff: null,
                      showSlider: false,
                      sliderTickArray: null,
                      showTicks: INVLIST.showTicks,
                      rawMappedCurrentState: null,
                      rawMappedHistoricState: null,
                      isPlaying: false,
                      isPaused: false,
                      isStopped: false,
                      intervalId: null,
                      diffOverlayOn: false,
                      currentErrMsg: null,
                      historicErrMsg: null

                    };
     console.log('minEpochStateTime: '+this.state.minEpochStateTime);
     console.log('maxEpochStartTime: '+this.state.maxEpochStartTime);
     console.log('stepEpochStateTime: '+this.state.stepEpochStateTime);
     console.log('currentStateHistoryValue: '+this.state.currentStateHistoryValue);
  }
  resultsMessage = '';
  componentDidMount = () => {
     console.log('[HistoryQuery.jsx] componentDidMount props available are', JSON.stringify(this.props));
     if(INVLIST.isHistoryEnabled){
        this.getCurrentStateCall(this.getSettings());
     }
  };

  componentWillUnmount  = () => {
    console.log('[History.jsx] componentWillUnMount');
  }
  beforefetchInventoryData = (param) => {
    if (param) {
      this.setState({});
    } else {
      this.fetchInventoryData();
    }
  };
  initState = () =>{
              this.setState({
                    totalResults: 0,
                    enableBusyRecentFeedback: true,
                    enableBusyHistoryStateFeedback: true,
                    enableBusyDiffFeedback: true,
                    data: [],
                    nodes: [],
                    payload : ((this.props.match.params.type == 'cq') ? atob(this.props.match.params.payloadEnc) : { "dsl" : atob(this.props.match.params.payloadEnc)}),
                    topologyHistoryState: null,
                    topologyCurrentState: null,
                    stepEpochStateTime: 1000,
                    maxEpochStartTime: Math.round(new Date().getTime()),
                    minEpochStartTime: parseInt(this.props.match.params.epochTime) - 259200000,
                    nodeDiff: null,
                    queryDisplay: ((this.props.match.params.type == 'cq') ?  JSON.parse(atob(this.props.match.params.payloadEnc)).query : atob(this.props.match.params.payloadEnc)),
                    currentGraphNodes: [],
                    currentGraphLinks: [],
                    historicGraphNodes: [],
                    historicGraphLinks: [],
                    selectedNodeHistoryState: null,
                    selectedNodeCurrentState: null,
                    showNodeModal: false,
                    showTopologyDiffModal: false,
                    nodeDisplay: '',
                    totalDiff: null,
                    showSlider: false,
                    sliderTickArray: null,
                    rawMappedCurrentState: null,
                    rawMappedHistoricState: null,
                    showTicks: INVLIST.showTicks,
                    diffOverlayOn: false,
                    currentErrMsg: null,
                    historicErrMsg: null
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
  };

  generateDiffArray = (arr) => {
    let tempArray = {};
    tempArray['properties'] = [];
    tempArray['related-to'] = [];

    for (var i = 0; i < arr.properties.length; i++ ){
        if(arr.properties[i].key !== "length"){
            tempArray['properties'][arr.properties[i].key] = arr.properties[i];
        }else{
            tempArray['properties']["LENGTH"] = arr.properties[i];
        }
    }
    for (var j = 0; j < arr['related-to'].length; j++ ){
        tempArray['related-to'][arr['related-to'][j].url] = arr['related-to'][j];
    }
    return tempArray;
  }

  getCurrentStateCall = (settings,url,param) =>{
      let path = "";
      let stubPath = "";
      if(this.props.match.params.type == 'cq'){
        path = 'query';
        stubPath = 'currentCQState';
      }else{
        path = 'dsl';
        stubPath = "currentBYOQState";
      }
      this.setState({currentErrMsg:null});
      commonApi(settings, path + '?format=state', 'PUT', this.state.payload, stubPath, null, 'history-traversal')
      .then(res => {
        this.getHistoryStateCall(this.getSettings());
        Visualization.chart('currentState', this.state.currentGraphNodes, this.state.currentGraphLinks, res.data, this);
        this.setState(
        {
          topologyCurrentState : res.data,
          enableBusyRecentFeedback: false
        });
        console.log('After recent node service call ......',this.state);
        console.log('[HistoryQuery.jsx] recent node results : ',  res.data);
      }, error=>{
       	this.triggerError(error, "current");
      }).catch(error => {
        this.triggerError(error, "current");
      });
  };
  triggerError = (error, type) => {
    console.error('[HistoryQuery.jsx] error : ', JSON.stringify(error));
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
  	if(type === 'current'){
  	     this.setState({
                  topologyCurrentState : null,
                  currentErrMsg: errMsg,
                  enableBusyRecentFeedback:false
                });
  	}else if (type === 'historic'){
  	     if(this.state.isPlaying){
  	         this.setState({
  	                isPlaying: false,
                    isStopped: true,
                    isPaused: false });
  	     }else{
  	        this.setState({
                 topologyHistoryState : null,
                 nodeDiff: null,
                 enableBusyDiffFeedback: false,
                 enableBusyHistoryStateFeedback:false,
                 historicErrMsg: errMsg
               });
         }
  	}else{
  	    console.log('[HistoryQuery.jsx] tiggerError method called without a type.' );
  	}
  }
  getHistoryStateCall = (settings, url, param, timeStamp) =>{
      let path = "";
      let stubPath = "";
      let stubChangesPath = "";
      if(this.props.match.params.type == 'cq'){
        path = 'query';
        stubPath = 'historicalCQState';
        stubChangesPath = 'historicalCQChanges';
      }else{
        path = 'dsl';
        stubPath = 'historicalBYOQState';
        stubChangesPath = 'historicalBYOQChanges';
      }
      let ts = this.state.currentStateHistoryValue;
      if(timeStamp){
        ts = parseInt(timeStamp);
      }
      this.setState({historicErrMsg:null});
      commonApi(settings, path + "?format=state" + "&startTs=" + ts + "&endTs=" + ts, 'PUT', this.state.payload, stubPath, null, 'history-traversal')
      .then(res => {
        Visualization.chart('historicState', this.state.historicGraphNodes, this.state.historicGraphLinks, res.data, this);
        this.setState(
        {
          topologyHistoryState :  res.data,
          enableBusyHistoryStateFeedback: false
        });
        console.log('After historical node state service call ......',this.state);
        console.log('[HistoryQuery.jsx] historical node state results : ',  res.data);
        if(this.state.topologyHistoryState != null && this.state.topologyCurrentState != null){
                    let topologyDiffHistoryArr = [];
                    let topologyDiffCurrentArr = [];
                    let tempNodeCurrentState = [];
                    let tempNodeHistoricState = [];
                    for( var i = 0; i < this.state.topologyHistoryState.results.length; i++ ){
                        topologyDiffHistoryArr[this.state.topologyHistoryState.results[i].url] = this.generateDiffArray(this.state.topologyHistoryState.results[i]);
                        tempNodeHistoricState[this.state.topologyHistoryState.results[i].url] = this.state.topologyHistoryState.results[i];
                    }
                    for( var j = 0; j < this.state.topologyCurrentState.results.length; j++ ){
                        topologyDiffCurrentArr[this.state.topologyCurrentState.results[j].url] = this.generateDiffArray(this.state.topologyCurrentState.results[j]);
                        tempNodeCurrentState[this.state.topologyCurrentState.results[j].url] = this.state.topologyCurrentState.results[j];
                    }
                    var result = deepDiffMapper.map(topologyDiffHistoryArr, topologyDiffCurrentArr);
                    console.log("diff map" + result);
                    this.setState({ totalDiff: result, enableBusyDiffFeedback: false, rawMappedCurrentState: tempNodeCurrentState, rawMappedHistoricState: tempNodeHistoricState});
                }else{
                    this.setState({ enableBusyDiffFeedback: false });
         }
      }, error=>{
       	this.triggerError(error, "historic");
      }).catch(error => {
        this.triggerError(error, "historic");
      });
      if(this.state.showTicks){
            commonApi(settings, path + "?format=changes", 'PUT', this.state.payload, stubChangesPath, null, 'history-traversal')
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
                             }).catch(error => {
                               console.log('[HistoryQuery.jsx] historical node changes error : ', error);
                               this.setState({showSlider:false});
                        });
      }else{
            this.setState({showSlider:true});
      }
  };

componentWillReceiveProps(nextProps) {
    console.log('[History.jsx] componentWillReceiveProps');
    console.log('[History.jsx] next payloadEnc:', atob(nextProps.match.params.payloadEnc));
    console.log('[History.jsx] this payloadEnc:', atob(this.props.match.params.payloadEnc));

    if (nextProps.match.params.payloadEnc
            && nextProps.match.params.type
            && nextProps.match.params.epochTime
            && ((nextProps.match.params.payloadEnc !== this.props.match.params.payloadEnc) ||
                (nextProps.match.params.type !== this.props.match.params.type) ||
                (nextProps.match.params.epochTime !== this.props.match.params.epochTime))
    ) {
      this.props = nextProps;
      this.initState();
      this.getCurrentStateCall(this.getSettings());
    }
  };

  handlePageChange = (pageNumber) => {
    console.log('[History.jsx] HandelPageChange active page is', pageNumber);
    this.setState({});
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
    this.props.history.push('/historyQuery/'  + this.props.match.params.type + '/' + this.props.match.params.payloadEnc + '/' + this.state.currentStateHistoryValue);
  }

  viewTopologyComp = () =>{
    this.setState({
        	showTopologyDiffModal: true
    });
  }

  resetGraph = () =>{
        Visualization.chart('currentState', this.state.currentGraphNodes, this.state.currentGraphLinks, this.state.topologyCurrentState, this);
        Visualization.chart('historicState', this.state.historicGraphNodes, this.state.historicGraphLinks, this.state.topologyHistoryState, this);
  }

  addOverlay = (elementType, key, modificationType) =>{
    let chartToOverlay = 'currentState';
    let color = '';
    let modIcon = '';
    if (modificationType === "deleted"){
        chartToOverlay = "historicState";
    }
    switch (modificationType){
        case 'deleted':
            color = 'red';
            modIcon = '-';
            break;
        case 'created':
            color = 'green';
            modIcon = '+';
            break;
        case 'modified':
            color = 'orange';
            modIcon = '*';
            break;
        default:
            console.log("hit default " + modificationType);
    }
    if(key){
        key = (((decodeURIComponent(key)).replace(new RegExp('\/', 'g'),'-')).replace(new RegExp(':', 'g'),'-')).replace(new RegExp('\\.', 'g'),'-');
    }else{
        key='';
    }
    console.log("adding overlay item for - element type: " + elementType + " key: " + key + " modificationType: " + modificationType );
    let elementKey = elementType + chartToOverlay + key;
    let element = d3.select("#" + elementKey);

    if(elementType === "line"){
        element.attrs({ 'stroke': color, 'stroke-opacity': .6, 'stroke-width': '3px'});
    }
    if(elementType === "nodeIcon"){
        element.classed("nodeIcon-" + modificationType, true);
        let elementKeyNode = 'node' + chartToOverlay + key;
        let elementNode = d3.select("#" + elementKeyNode);
        elementNode.append("text")
                         .attr("dy", 10)
                         .attr("dx", 35)
                         .attr('font-size', 25)
                         .text(modIcon);
    }
    //Need to also add to historicGraph for modifications in addition to current
    if(modificationType === 'modified'){
       let elementKeyMod = elementType + 'historicState' + key;
       let elementMod = d3.select("#" + elementKeyMod);
       elementMod.classed("nodeIcon-" + modificationType, true);

       let elementKeyModNode =  'nodehistoricState' + key;
       let elementModNode = d3.select("#" + elementKeyModNode);
       elementModNode.append("text")
                        .attr("dy", 10)
                        .attr("dx", 35)
                        .attr('font-size', 25)
                        .text(modIcon);
    }
  }

  viewTopologyCompVisual = () =>{
    if(this.state.diffOverlayOn){
        this.setState({ diffOverlayOn: false});
        this.resetGraph();
    }else if(this.state.totalDiff){
        this.setState({ diffOverlayOn: true});
        const properties =  Object.entries(this.state.totalDiff).forEach((prop) => {
            if (prop){
                        let propWorkaround = prop;
                        if(prop.data){
                            propWorkaround = prop.data;
                        }
                        let tempProp = propWorkaround[1];
                        let attributeProperties = '';
                        let relationships = '';
                        let topLevelType = tempProp.type;
                        let alreadyHighlighted = false;
                        if(topLevelType){
                            this.addOverlay('nodeIcon', propWorkaround[0], topLevelType);
                            //set this to not mark as modified when it is added new
                            alreadyHighlighted = true;
                        }
                        if(!topLevelType && tempProp.properties){
                            for (var key in tempProp.properties) {
                                    if (tempProp.properties.hasOwnProperty(key)) {
                                       let property = tempProp.properties[key];
                                       if(property && ((property.value && property.value.type !== 'unchanged') || property.type)){
                                         this.addOverlay('nodeIcon', propWorkaround[0], 'modified');
                                         break;
                                       }
                                    }
                            }
                        }
                        if(tempProp['related-to'] || tempProp.data['related-to']){
                            let rel = null;
                            let topLevelType = null;
                            if(tempProp['related-to']){
                                rel = tempProp['related-to'];
                            }else if (tempProp.data['related-to']) {
                                rel = tempProp.data['related-to'];
                                topLevelType = tempProp.type;
                            }
                            relationships =  Object.entries(rel).forEach((property) => {
                                    let relationProp = property[1];
                                    if(relationProp && relationProp.type && relationProp.type.type &&  relationProp.type.type !== "unchanged"){
                                        //do nothing since we only care about additions and deletions on relationships, should not be considered modified
                                        console.log("relationship considered modified: id: " + relationProp.id + " type: "+ relationProp.type + " mod type: " + relationProp.type.type)
                                    }else if(relationProp && relationProp.type && !relationProp.type.type && relationProp.url && relationProp.url.data){
                                        if(!alreadyHighlighted){
                                            this.addOverlay('nodeIcon', propWorkaround[0], 'modified');
                                        }
                                        this.addOverlay('line', relationProp.id.data, relationProp.type);
                                    }else if (relationProp && relationProp.type && relationProp.data){
                                        if(!alreadyHighlighted){
                                            this.addOverlay('nodeIcon', propWorkaround[0], 'modified');
                                        }
                                        this.addOverlay('line', relationProp.data.id, relationProp.type);
                                    }else if (topLevelType){
                                        if(!alreadyHighlighted){
                                            this.addOverlay('nodeIcon', propWorkaround[0], 'modified');
                                        }
                                        this.addOverlay('line', relationProp.id, topLevelType);
                                    }
                            });
                        }
                  }else{
                      //No changes, do nothing
                  }
            });

      }else{
        // do nothing if no diff
      }
  }

  closeTopologyDiffModal = () => {
    this.setState({
    	showTopologyDiffModal: false
    });
  }
  openNodeModal(nodeDisplay, nodeUri, nodeType){ // open modal
                 console.log('history >> showModal');
                 this.setState({ nodeDiff: this.state.totalDiff[nodeUri]});
                 nodeDisplay = "State Comparison of " + nodeUri;
                 if(!this.state.rawMappedHistoricState[nodeUri]){
                    this.state.rawMappedHistoricState[nodeUri] = {};
                 }
                 if(!this.state.rawMappedCurrentState[nodeUri]){
                    this.state.rawMappedCurrentState[nodeUri] = {};
                 }
                 this.state.rawMappedHistoricState[nodeUri].primaryHeader = "Historic State of " + nodeDisplay;
                 this.state.rawMappedCurrentState[nodeUri].primaryHeader = "Current State of " + nodeDisplay;
                 if(nodeDisplay){
                    this.setState({
                       nodeDisplay: nodeDisplay,
                       selectedNodeHistoryState: this.state.rawMappedHistoricState[nodeUri],
                       selectedNodeCurrentState: this.state.rawMappedCurrentState[nodeUri],
                       focusedNodeUri: nodeUri,
                       focusedNodeType: nodeType,
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

  getStateIndex = () =>{
    return this.state.sliderTickArray.indexOf(this.state.currentStateHistoryValue);
  }

  navigateAnimation = (index, command) => {
     if(!command){
        this.setState({isPlaying:false, isStopped: false, isPaused: true, currentStateHistoryValue: this.state.sliderTickArray[index], selectedHistoryStateFormatted: moment(this.state.sliderTickArray[index]).format('dddd, MMMM Do, YYYY h:mm:ss A')});
     }else if (command === 'play'){
        this.setState({currentStateHistoryValue: this.state.sliderTickArray[index], selectedHistoryStateFormatted: moment(this.state.sliderTickArray[index]).format('dddd, MMMM Do, YYYY h:mm:ss A')});
     }
     this.props.history.push('/historyQuery/'  + this.props.match.params.type + '/' + this.props.match.params.payloadEnc + '/' + this.state.sliderTickArray[index]);
  }

  play = () =>{
    if(this.state.isPlaying){
        if(!this.state.enableBusyHistoryStateFeedback){
            var index = Math.min(this.state.sliderTickArray.length - 1, this.getStateIndex() + 1);
            if(this.state.sliderTickArray.length > this.getStateIndex() + 1){
                    this.navigateAnimation(this.getStateIndex() + 1, 'play');

            }else{
                 this.setState({isPlaying:false, isStopped: true, isPaused: false});
            }
        }
    }else{
         clearInterval(this.state.intervalId);
    }
  }

  animationControl = (controlType) => {
    console.log("Control was hit: " + controlType);
    switch(controlType){
        case 'play':
            if(!this.state.isPlaying){
                this.setState({isPlaying:true, isStopped: false, isPaused: false, intervalId: setInterval(this.play, INVLIST.animationIntervalMs)});
            }
            break;
        case 'pause':
            if(this.state.isPlaying){
                clearInterval(this.state.intervalId);
                this.setState({isPlaying:false, isPaused: true});
            }
            break;
        case 'stop':
            if(this.state.isPlaying || this.state.isPaused){
                clearInterval(this.state.intervalId);
                this.setState({isPlaying:false, isStopped: true, isPaused: false});
            }
            break;
        case 'skipForwardStep':
            var index = Math.min(this.state.sliderTickArray.length - 1, this.getStateIndex() + 1);
            this.navigateAnimation(index);
            break;
        case 'skipBackwardStep':
            var index = Math.max(0, this.getStateIndex() - 1);
            this.navigateAnimation(index);
            break;
        case 'skipForwardLast':
            this.navigateAnimation(this.state.sliderTickArray.length - 1);
            break;
        case 'skipBackwardEpoch':
            this.navigateAnimation(0);
            break;
        default:
            this.setState({isPlaying:false, isStopped: false, isPaused: false});
            break;
    }
  }
  // START: These functions are for the animation controls
  setHistoricStateValues = (currValue) =>{
    this.setState({currentStateHistoryValue: currValue, selectedHistoryStateFormatted: moment(currValue).format('dddd, MMMM Do, YYYY h:mm:ss A')});
  }

  navigateHistory = (time) =>{
    this.props.history.push('/historyQuery/'  + this.props.match.params.type + '/' + this.props.match.params.payloadEnc + '/' + time);
  }

  setStateValue = (key, value) =>{
     this.setState((state) => { key : value });
  }
  getStateValue = (stateVar) => {
    return this.state[stateVar];
  }
  clear = (interval) =>{
    clearInterval(interval);
  }
  // END

  render() {
        if(INVLIST.isHistoryEnabled){
            return (
               <div>
                <header className='addPadding jumbotron my-4'>
                            <h1 className='display-2'>History Visualization</h1>
                            <p className='lead'>
                              On this page you have the ability to view a series of network elements in their current and historic state.
                              Zooming and panning are enabled in the graphs. You can use the scrollwheel to zoom and click+drag to pan.
                              If a node is single clicked you can drag the elements to reposition them. Double-clicking a node will
                              show the comparison between the two nodes in a pop-up modal. Animation controls are provided to seemlessly transition between states.
                              You can view the graph difference in a visual form by clicking View Visual Comparison.
                            </p>
                </header>
                <Grid fluid={true} className="addPadding">
                  <Row className={this.state.currentErrMsg ? 'show' : 'hidden'} >
                    <div className='addPaddingTop alert alert-danger' role="alert">
                        An error occurred while trying to get current information, please try again later. If this issue persists, please contact the system administrator. {this.state.currentErrMsg}
                    </div>
                  </Row>
                  <Row className={!this.state.currentErrMsg ? 'show' : 'hidden'} >
                    <Col className='col-lg-12'>
                          <div className='card d3-history-query-card'>
                            <div className='card-header history-query-card-header'>
                              <h2><strong>Current State</strong> of <em>{this.state.queryDisplay}</em></h2>
                            </div>
                            <div className={'card-header ' + (this.state.topologyHistoryState ? '' : 'hidden')}>
                                 <button type='button' className='btn btn-outline-primary' onClick={this.viewTopologyCompVisual}>Toggle Visual Comparison</button>
                            </div>
                            <div className='history-query-card-content'>
                               {!this.state.topologyCurrentState || (this.state.topologyCurrentState.results && this.state.topologyCurrentState.results.length === 0) && (<div className='addPaddingTop'><p>No current state for this query</p></div>)}
                               <OutputVisualization identifier="currentState" width={this.svgWidth}  height="600" overflow="scroll"/>
                            </div>
                            <div className='card-footer'>
                               <strong>Tip:</strong> <em>Click and drag network elements to reposition them, double-click nodes to see the node detail comparison. In addition: The graph supports pinch zoom or scrollwheel for zooming. Panning can be done by single-click and drag.</em>
                            </div>
                          </div>
                    </Col>
                  </Row>
                  <Row className={this.state.historicErrMsg ? 'show' : 'hidden'} >
                    <div className='addPaddingTop alert alert-danger' role="alert">
                       An error occurred, while trying to get historic information, please try again later. If this issue persists, please contact the system administrator. {this.state.historicErrMsg}
                    </div>
                  </Row>
                   <Row className={!this.state.historicErrMsg ? 'show' : 'hidden'}>
                        <Col className='col-lg-12'>
                              <div className='card d3-history-query-card'>
                                <div className='card-header history-query-card-header'>
                                  <h2><strong>Historical State</strong> of <em>{this.state.queryDisplay}</em> at {moment(parseInt(this.props.match.params.epochTime)).format('dddd, MMMM Do, YYYY h:mm:ss A')}</h2>
                                </div>
                                    <div className='card-header'>
                                       { (this.state.showSlider && this.state.showTicks) && (<Row className='show-grid'>
                                                                                                <Col md={3}>
                                                                                                    <ReactBootstrapSlider
                                                                                                    value={this.state.currentStateHistoryValue}
                                                                                                    change={this.stateHistoryFormat}
                                                                                                    slideStop={this.stateHistoryFormat}
                                                                                                    step={ 1 }
                                                                                                    ticks={ this.state.sliderTickArray }
                                                                                                    ticks_snap_bounds={ 10000 }
                                                                                                    orientation="horizontal" />
                                                                                                </Col>
                                                                                                <Col md={8}>
                                                                                                    <i className='icon-controls-skipbackstartover animationControlIcon'  onClick={() => this.animationControl('skipBackwardEpoch')} role="img"></i>
                                                                                                    <i className='icon-controls-rewind animationControlIcon'  onClick={() => this.animationControl('skipBackwardStep')} role="img"></i>
                                                                                                    <i className={'icon-controls-pointer ' + (this.state.isPlaying ? 'animationPlayingIcon' : 'animationControlIcon')}  onClick={() => this.animationControl('play')} role="img"></i>
                                                                                                    <i className={'icon-controls-pause ' + (this.state.isPaused ? 'animationPausedIcon' : 'animationControlIcon')}  onClick={() => this.animationControl('pause')} role="img"></i>
                                                                                                    <i className={'icon-controls-stop ' + (this.state.isStopped ? 'animationStoppedIcon' : 'animationControlIcon')}   onClick={() => this.animationControl('stop')} role="img"></i>
                                                                                                    <i className='icon-controls-fastforward animationControlIcon'  onClick={() => this.animationControl('skipForwardStep')} role="img"></i>
                                                                                                    <i className='icon-controls-skipforward animationControlIcon'  onClick={() => this.animationControl('skipForwardLast')} role="img"></i>
                                                                                                </Col>
                                                                                               </Row>
                                                                                                      )}
                                       { (this.state.showSlider && !this.state.showTicks) && (<ReactBootstrapSlider
                                                                                                value={this.state.currentStateHistoryValue}
                                                                                                change={this.stateHistoryFormat}
                                                                                                slideStop={this.stateHistoryFormat}
                                                                                                step={this.state.stepEpochStateTime}
                                                                                                max={this.state.maxEpochStartTime}
                                                                                                min={this.state.minEpochStartTime}
                                                                                                orientation="horizontal" />)}

                                                                    <p>{this.state.selectedHistoryStateFormatted}</p>
                                                                    <button type='button' className='btn btn-outline-primary' onClick={this.changeHistoryState}>Refresh</button>
                                    </div>
                                    <div className='history-query-card-content' >
                                      {!this.state.topologyHistoryState || (this.state.topologyHistoryState.results && this.state.topologyHistoryState.results.length  === 0) && (<div className="addPaddingTop"><p>No state during this time period</p></div>)}
                                      <OutputVisualization identifier="historicState" width={this.svgWidth}  height="600" overflow="scroll"/>
                                    </div>
                                    <div className={'card-footer ' + (this.state.topologyHistoryState ? '' : 'hidden')}>
                                      <strong>Tip:</strong> <em>Click and drag network elements to reposition them, double-click nodes to see the node detail comparison. In addition: The graph supports pinch zoom or scrollwheel for zooming. Panning can be done by single-click and drag.</em>
                                    </div>
                                </div>

                        </Col>
                   </Row>
                </Grid>
                <div className='static-modal'>
                          		<Modal show={this.state.showNodeModal} onHide={this.closeNodeModal} dialogClassName="modal-override">
                          			<Modal.Header>
                          				<Modal.Title>Retrieve {this.state.nodeDisplay} History</Modal.Title>
                          			</Modal.Header>
                          			<Modal.Body>
                                        <Grid fluid={true}>
                                              <Row className='show-grid'>
                                                <Col md={4}>
                                                    <HistoryCard node={this.state.selectedNodeHistoryState}/>
                                                </Col>
                                                <NodeDiffCard diff={this.state.nodeDiff}/>
                                                <Col md={4}>
                                                    <HistoryCard node={this.state.selectedNodeCurrentState}/>
                                                </Col>
                                              </Row>
                                        </Grid>
                          			</Modal.Body>
                          			<Modal.Footer>
                          				<Button onClick={this.closeNodeModal}>Close</Button>
                          			</Modal.Footer>
                          		</Modal>
                </div>
                <div className='static-modal'>
                                  		<Modal show={this.state.showTopologyDiffModal} onHide={this.closeTopologyDiffModal}>
                                  			<Modal.Header>
                                  				<Modal.Title>Retrieve Topology History</Modal.Title>
                                  			</Modal.Header>
                                  			<Modal.Body>
                                                <Grid fluid={true}>
                                                      <Row className='show-grid'>
                                                        <Col md={12}>
                                                            <TopologyDiffCard node={this.state.totalDiff}/>
                                                        </Col>
                                                      </Row>
                                                </Grid>
                                  			</Modal.Body>
                                  			<Modal.Footer>
                                  				<Button onClick={this.closeTopologyDiffModal}>Close</Button>
                                  			</Modal.Footer>
                                  		</Modal>
                        </div>
              </div>
            );
        }else{
            return(<p>History Not Enabled for this instance, please check config.</p>)
        }
  }
}

export default HistoryQuery;
