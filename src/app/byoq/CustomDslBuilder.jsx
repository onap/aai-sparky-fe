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
import commonApi from 'utils/CommonAPIService.js';
import {GeneralCommonFunctions} from 'utils/GeneralCommonFunctions.js';
import Modal from 'react-bootstrap/lib/Modal';
import Grid from 'react-bootstrap/lib/Grid';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import FilterTypes from 'generic-components/filter/components/FilterTypes.jsx';
import PathFilterDslBuilder from './PathFilterDslBuilder.jsx';
import CustomDSLSaveLoad from 'app/byoq/CustomDSLSaveLoad.jsx';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import * as d3 from "d3";
import 'd3-selection-multi';


let EDGERULES = GlobalExtConstants.EDGERULES;
let OXM = GlobalExtConstants.OXM;
let INVLIST = GlobalExtConstants.INVLIST;
let ENVIRONMENT = GlobalExtConstants.ENVIRONMENT;
let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));


let nodeTypes = [];
let properties = null;
let traverseRulesDsl = [];

const settings = {
	'NODESERVER': INVLIST.NODESERVER,
	'PROXY': INVLIST.PROXY,
  	'PREFIX': INVLIST.PREFIX,
  	'VERSION': INVLIST.VERSION,
    'APERTURE': INVLIST.APERTURE,
    'USESTUBS': INVLIST.useStubs
};
class CustomDslBuilder extends Component {
	constructor(props) {
		console.log('props>>>>',props);
        super(props);
        this.saveLoadComponent = React.createRef();
        APERTURE_SERVICE=JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
		this.state = {edgeRules : null,
		              connectableNodes:[],
		              showNodeModal: false,
		              enableModalFeedback: false,
		              showEditNodeModal: false,
		              treemap: null,
		              root: null,
		              svg: null,
		              duration: null,
		              g: null,
		              selectedNode: null,
		              traverseToNodes:[],
		              traverseToNodeAttributes: [],
		              nodeDetails: [],
		              dslQuery: '',
		              editModel:'',
		              showEditModal: false,
		              zoomFit: null,
		              autoZoomEnabled: true,
		              aggregateObjects: false,
		              init: true,
		              filterTypeDisplay: 'Filter Type',
                      selectedfilterType:[],
                      oxmMapping: null,
                      initialRootEdit: true,
		              showPathFilterDslBuilder: false,
                      pathFilterNodeType: '',
                      pathFilterNodeName:'',
                      pathFIlterAttrDetails: [],
                      dslPathBuilder:'',
                      dslPathTree:'',
                      loadedQueries: [],
                      queryDescription: '',
                      queryName: '',
                      category:'',
                      queryId:'',
                      treeLoadErrMsg: '',
                      isEditEnable:false,
                      pathFilterIndex:0,
                      isDataSteward: sessionStorage.getItem(ENVIRONMENT + 'roles') && sessionStorage.getItem(ENVIRONMENT + 'roles').indexOf('data_steward_ui_view') > -1,
                      isPublicChecked: sessionStorage.getItem(ENVIRONMENT + 'roles') && sessionStorage.getItem(ENVIRONMENT + 'roles').indexOf('data_steward_ui_view') > -1,
		      enableRealTime: JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'ENABLE_ANALYSIS'))
                    }
            this.baseState=this.state;
  }
  componentDidMount () {
    console.log('componentDidMount',JSON.stringify(this.props));
    //this.buildSQLStatementsFromSchema();
    this.processEdgeRules(EDGERULES);
    if(this.props.match.params.type && this.props.match.params.propId) {
        this.build(this.props.match.params.type, this.props.match.params.propId);
    }
  }
  initialize = () =>{
    this.setState({enableModalFeedback: true}, function () {
                                                  //console.log("EnableModalFeedback: " + this.state.enableModalFeedback);
                                                  setTimeout(() => {this.postSpinner()},1);
                                              });
  }

  postSpinner = () => {

    var nodeDetails = [];
    var node = null;
    console.log('initializing');
    var id = GeneralCommonFunctions.generateID();
    var nodeTypes = GeneralCommonFunctions.getNodeTypes();
    for (var i = 0; i < nodeTypes.length; i++) {
    	    node = nodeTypes[i] + id;
    	    var attributes = GeneralCommonFunctions.getFilteringOptions(nodeTypes[i]);
    	    if(!nodeDetails[node] && Object.keys(attributes).length > 0){
                nodeDetails[node] = {};
                nodeDetails[node].nodeType = nodeTypes[i];
                nodeDetails[node].isSelected = false;
                nodeDetails[node].attrDetails = attributes;
                nodeDetails[node].parentContainer = GeneralCommonFunctions.populateContainer(nodeTypes[i]);
            }
    }
    let nodesSorted = nodeDetails.sort(function (filter1, filter2) {
    	if (filter1.nodeType < filter2.nodeType) {
    		return -1;
    	} else if (filter1.nodeType > filter2.nodeType) {
    		return 1;
    	} else {
    		return 0;
    	}
    });
    //console.log('Node Types List' + JSON.stringify(nodesSorted));
    nodeDetails = nodesSorted;
    this.setState({nodeDetails: nodeDetails, showNodeModal: true, enableModalFeedback: false});
  }
  processEdgeRules = (data) => {
  	this.setState({
  		edgeRules: data.rules
  	},()=>{this.baseState=this.state});
  }
  closeNodeModal = () =>{
    this.setState({
    	showNodeModal: false,
    	enableModalFeedback: false,
    	traverseToNodes: [],
    	selectedNode: null
    });
  }
  closeEditNodeModal = () =>{
    this.setState({
    	showEditNodeModal: false,
        selectedNode: null,
        showPathFilterDslBuilder: false
    });
  }
  closePathNodeModal = () =>{
    console.log('closePathNodeModal>>>>>>>');
    this.setState({
    	showPathFilterDslBuilder: false,
        pathFilterNodeType: '',
        pathFilterNodeName:'',
        pathFIlterAttrDetails: []
    });
  }
  submitPathNodeModal = (dslQuery,nodetype,dslQueryTree,isEditEnable,pathFilterIndex) =>{
    console.log('CustomDSLBuilder  submitPathNodeModel>>>>>dslQuery ###',dslQuery);
    console.log(isEditEnable+'<<submitPathNodeModal this.state.nodeDetails>>>>',this.state.nodeDetails)  
    var nodeDetails = this.state.nodeDetails;
    if(!nodeDetails[nodetype].dslPath){
        nodeDetails[nodetype].dslPath=[];
        nodeDetails[nodetype].dslPathTree=[];
    }
    if(isEditEnable){        
        nodeDetails[nodetype].dslPath[pathFilterIndex]=dslQuery;
        nodeDetails[nodetype].dslPathTree[pathFilterIndex]=dslQueryTree;
        console.log('nodeDetails on edit>>>>>>>>>',nodeDetails);
    }else{        
        nodeDetails[nodetype].dslPath.push(dslQuery);
        nodeDetails[nodetype].dslPathTree.push(dslQueryTree);
    }    
    this.setState({ nodeDetails: nodeDetails },()=>{this.closePathNodeModal()});    
  }
 editPathNodeModal = (key,path,tree,indx) =>{
    console.log('editPathNodeModal>>>>>>>>>###',indx);
    let attrDetails=this.state.nodeDetails[key].attrDetails; 
    let nodeType=this.state.nodeDetails[key].nodeType;
    this.setState({showPathFilterDslBuilder: true,pathFilterNodeType: key,pathFilterNodeName:nodeType,pathFIlterAttrDetails: '',dslPathBuilder: path,dslPathTree:tree,isEditEnable:true,pathFilterIndex:indx}); 
 }
 deletePathNodeModal = (key,path,tree,index) =>{
    console.log(index+'<<deletePathNodeModal>>>>>',key);
    var nodeDetails = this.state.nodeDetails;
    nodeDetails[key].dslPath.splice(index,1);
    nodeDetails[key].dslPathTree.splice(index,1);
    this.setState({ nodeDetails: nodeDetails });
 }
  onNodeCheckbox(e) {
      var nodeDetails = this.state.nodeDetails;
      if (e.target.checked) {
        nodeDetails[e.target.value].isSelected = true;
        this.selectAll(e.target.value);
      }else {
        nodeDetails[e.target.value].isSelected = false;
        this.deselectAll(e.target.value);
      }
      // update the state with the new array of traverse to nodes
      this.setState({ nodeDetails: nodeDetails });
  }
  onNodeRadio(e) {
      var nodeDetails = this.state.nodeDetails;
      if (e.target.checked) {
        nodeDetails[e.target.value].isSelected = true;
        this.selectAll(e.target.value);
      }
      for (var key in nodeDetails) {
          if(key != e.target.value && nodeDetails[key].isSelected ){
            nodeDetails[key].isSelected = false;
            this.deselectAll(key);
          }
      }
      // update the state with the new array of traverse to nodes
      this.setState({ nodeDetails: nodeDetails });
  }
  onAutoZoomCheckbox(e) {
      var cbValue = false;
      if (e.target.checked) {
        cbValue = true;
      }else {
        cbValue = false;
      }
      this.setState({ autoZoomEnabled: cbValue });
  }
  onAggregateCheckbox(e) {
      var cbValue = false;
      if (e.target.checked) {
        cbValue = true;
      }else {
        cbValue = false;
      }
      this.setState({ aggregateObjects: cbValue });
  }
  onAttributeCheckbox(e){
        let splitVal = e.target.value.split("|");
        let nodeKey = splitVal[0];
        let attrValue = splitVal[1];
        let nodeDetails = this.state.nodeDetails;
        let node = nodeDetails[nodeKey];
        let attribute = null;
        if(!node.attrDetails){
            node.attrDetails = [];
        }
        if(!node.attrDetails[attrValue]){
            node.attrDetails[attrValue] = {};
            node.attrDetails[attrValue].isSelected = true;
            node.attrDetails[attrValue].filterValue = [];
            node.attrDetails[attrValue].filterType = [];
            node.attrDetails[attrValue].dslPath = [];
            node.attrDetails[attrValue].dslPathTree = [];
        }

        // check if the check box is checked or unchecked
        if (e.target.checked) {
          // add the value of the checkbox to nodes array
          node.attrDetails[attrValue].isSelected = true;
          node.attrDetails[attrValue].filterType[0]='EQ';
        } else {
          // or remove the value from the unchecked checkbox from the array
          node.attrDetails[attrValue].isSelected = false;
          //node.attrDetails[attrValue].filterType = [''];
          //node.attrDetails[attrValue].filterValue = [''];
        }
        nodeDetails[nodeKey] = node;
        // update the state with the new array of traverse to nodes
        this.setState({ nodeDetails: nodeDetails });
  }
  onFilterValueChange(e, nodeKey, attrKey, indx){
        let nodeDetails = this.state.nodeDetails;
        let node = nodeDetails[nodeKey];
        if(!node.attrDetails){
            node.attrDetails = [];
        }
        if(!node.attrDetails[attrKey]){
            node.attrDetails[attrKey] = {};
            node.attrDetails[attrKey].isSelected = true;
            node.attrDetails[attrKey].filterValue = [];
            node.attrDetails[attrKey].filterType = [];
            node.attrDetails[attrValue].dslPath = [];
            node.attrDetails[attrValue].dslPathTree = [];
        }
        // add the value of the checkbox to nodes array
        //node.attrDetails[attrKey].filterValue.push(e.target.value);
        let filterValArr=node.attrDetails[attrKey].filterValue;
        filterValArr[indx]=e.target.value;
        node.attrDetails[attrKey].filterValue=filterValArr;
        nodeDetails[nodeKey] = node;
        // update the state with the new array of traverse to nodes
        this.setState({ nodeDetails: nodeDetails });
  }
  submitNodeModal = () =>{
    if(this.state.selectedNode){
        var d = this.state.selectedNode;
        for(var node in this.state.nodeDetails){
            if(this.state.nodeDetails[node].isSelected){
                var newNodeObj = {
                          	type: 'node',
                            name: this.state.nodeDetails[node].nodeType,
                            details: {}
                          };
                 //Creates new Node
                 Object.assign(newNodeObj.details, this.state.nodeDetails[node]);
                 var newNode = d3.hierarchy(newNodeObj);
                 newNode.depth = d.depth + 1;
                 newNode.height = d.height - 1;
                 newNode.parent = d;
                 newNode.id = node;
                 if(!d.children){
                    d.children = [];
                 }
                if(newNodeObj.details){
                   var selectedAttributeCount = 0;
                   for (var key in newNodeObj.details.attrDetails){
                        if (newNodeObj.details.attrDetails[key].isSelected){
                            selectedAttributeCount++;
                        }
                        if(selectedAttributeCount === Object.keys(newNodeObj.details.attrDetails).length){
                           newNodeObj.details.includeInOutput = true;
                        }
                   }
                }
                 d.children.push(newNode);
                 this.setState({ nodeDetails: [] });
        }
      }
      this.update(this, d);
      this.setState({
          	showNodeModal: false,
          	enableModalFeedback: false,
          	traverseToNodes: [],
          	selectedNode: null
       });
    }else{
        var nodeType = "";
        var attrDetails = null;
        var dslPath =[];
        var dslPathTree=[];
        for (var key in this.state.nodeDetails) {
            if(this.state.nodeDetails[key].isSelected){
              nodeType = this.state.nodeDetails[key].nodeType;
              attrDetails = this.state.nodeDetails[key].attrDetails;
              dslPath =this.state.nodeDetails[key].dslPath;
              dslPathTree=this.state.nodeDetails[key].dslPathTree;
            }
        }
       this.build(nodeType, null, attrDetails,null,dslPath,dslPathTree);
       this.setState({ nodeDetails: [], showNodeModal: false, enableModalFeedback:false, traverseToNodes: [], selectedNode: null });
    }
  }
  submitEditNodeModal  = () =>{
    this.update(this, this.state.selectedNode);
    this.setState({showEditNodeModal: false,showPathFilterDslBuilder:false});
  }
  populateEdgeRules = (nodeType) => {
        let  nodeDetails=GeneralCommonFunctions.populateEdgeRules(nodeType,this.state.edgeRules);
  	    this.setState({
        	nodeDetails: nodeDetails
        });
  }
 
  buildOXMAttributesAndReturn = (nodeType) =>{
    var oxmArray = [];
    var result = JSON.parse(OXM);
    var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
    for (var i = 0; i < arrayOfTypes.length; i++) {
        var propertiesDsl = [];
        for (var j = 0; j < arrayOfTypes[i]['java-attributes'][0]['xml-element'].length; j++) {
            let property =  arrayOfTypes[i]['java-attributes'][0]['xml-element'][j]['$']['name'];
            let type = arrayOfTypes[i]['java-attributes'][0]['xml-element'][j]['$']['type'];
            if (type === 'java.lang.String' || type === 'java.lang.Boolean') {
                propertiesDsl[property] = {};
                propertiesDsl[property].isSelected = false;
                propertiesDsl[property].attributeName = property;
                propertiesDsl[property].filterValue = [''];
                propertiesDsl[property].filterType = [''];
                propertiesDsl[property].dslPath = [];
                propertiesDsl[property].dslPathTree = [];
            }
        }
        let sortedPropertiesDsl = propertiesDsl.sort(function (filter1, filter2) {
        	if (filter1.attributeName < filter2.attributeName) {
        		return -1;
        	} else if (filter1.attributeName > filter2.attributeName) {
        		return 1;
        	} else {
        		return 0;
        	}
        });
        oxmArray[GeneralCommonFunctions.camelToDash(arrayOfTypes[i]['xml-root-element'][0]['$']['name'])] = sortedPropertiesDsl;
    }
    this.setState({oxmMapping: oxmArray});
    return oxmArray[nodeType];
  }

  runDSL = () => {
    console.log("running DSL");
    let paramToPassThrough = '';
    if(this.state.aggregateObjects){
        paramToPassThrough = '/customDsl/built-aggregate/' + btoa('<pre>' + this.state.dslQuery + '</pre>');
    }else{
        paramToPassThrough = '/customDsl/built/' + btoa('<pre>' + this.state.dslQuery + '</pre>');
    }
    this.props.history.push(paramToPassThrough);
  }
  submitEditAndRunDSL = () =>{
    this.setState({ dslQuery: this.state.editModel }, () => this.runDSL());
  }
  showEditDSLModal = () => {
    console.log("enabling DSL edit modal");
    this.setState({ editModel: this.state.dslQuery, showEditModal: true });
  }
  closeEditDSLModal = () => {
    console.log("closing DSL edit modal");
    this.setState({ showEditModal: false });
  }
  bindEdits = (e) => {
    this.setState({ editModel: e.target.value });
  }
  populateDSL = (tree, isInit) =>{
        var DSL = '';
        var treeArray = '';
        var treeArrayLength = 0;
        if(isInit){
            treeArray = tree;
            treeArrayLength = 1;
        }else{
            treeArray = tree.children;
            treeArrayLength = tree.children.length;
        }
        for(var k = 0; treeArray && k < treeArrayLength; k++){
            if(k === 0 && treeArrayLength > 1){
                DSL += '[';
            }
            var node = '';
            if(isInit){
                node = tree;
            }else{
                node = treeArray[k];
            }
            if(node.data){
                console.log('Node data while rendering DSl path>>',JSON.stringify(node.data));
                DSL += node.data.name;
                let propState=false;
                if(node.data.details){
                    var tempAttributeString = '';
                    var selectedAttributeCount = 0;
                    for (var key in node.data.details.attrDetails){
                        if (node.data.details.attrDetails[key].isSelected){
                            selectedAttributeCount++;
                            let aliasWithProp=node.data.details.attrDetails[key].attributeName;
                            if(node.data.details.attrDetails[key].alias){
                                aliasWithProp= aliasWithProp+'\' as \''+node.data.details.attrDetails[key].alias;
                            }
                            if(selectedAttributeCount === 1){
                                tempAttributeString += '{\'' + aliasWithProp +'\'';
                                propState=true;
                            }else{
                                tempAttributeString += ',\'' + aliasWithProp + '\'';
                            }
                        }
                    }
                    if(selectedAttributeCount === Object.keys(node.data.details.attrDetails).length){
                        DSL+= '*';
                    }
                    if((selectedAttributeCount < Object.keys(node.data.details.attrDetails).length) && propState){
                        DSL += tempAttributeString + '}';
                    }                    
                    for (var key in node.data.details.attrDetails){
                        if(node.data.details.attrDetails[key].filterValue && node.data.details.attrDetails[key].filterValue[0] !==''){
                            DSL += '(\'' + node.data.details.attrDetails[key].attributeName + '\',';
                            let dslValues='';
                            for(var indx=0; indx<node.data.details.attrDetails[key].filterValue.length; indx++){                            
                                dslValues=(indx>0) ? dslValues+',':dslValues;
                                if(this.state.enableRealTime && node.data.details.attrDetails[key].filterType && node.data.details.attrDetails[key].filterType[indx]){
                                    dslValues += node.data.details.attrDetails[key].filterType[indx]+'(\''+ node.data.details.attrDetails[key].filterValue[indx] + '\')';                                    
                                }else{
                                    dslValues +='\''+node.data.details.attrDetails[key].filterValue[indx] + '\'';                                    
                                }                      
                                if(node.data.details.attrDetails[key].filterValue.length-1 ===  indx){
                                    dslValues +=')';
                                }
                            }                        
                            DSL += dslValues;
                        }
                    }
                    if(node.data.details.dslPath && node.data.details.dslPath.length>0){
                        for(var n in node.data.details.dslPath){
                            DSL += node.data.details.dslPath[n];
                        }                        
                    }
                }
            }
            if(node.children){
                DSL+= '>' + this.populateDSL(node);
            }
            if(k !==  treeArrayLength - 1){
                DSL += ',';
            }
            if(k === treeArrayLength - 1 && treeArrayLength > 1){
                DSL += ']';
            }
        }
        return DSL;
  }
  update = (base, source, isInit) => {

        // Assigns the x and y position for the nodes
        var treeData = base.state.treemap(base.state.root);

        var DSL = base.populateDSL(treeData, true);
        console.log(JSON.stringify("DSL :" + DSL));

        this.setState({ dslQuery: DSL });

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        var list1 = d3.selectAll(".fa")
            .filter(".fa-plus")
            .style("display", "block");

        // Normalize for fixed-depth.
        nodes.forEach(function(d){ d.y = d.depth * 100});
        // ****************** Nodes section ***************************

        // Update the nodes...
        var node = base.state.g.selectAll('g.node')
            .data(nodes, function(d) {return d.id });

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
              return "translate(" + source.y0 + "," + source.x0 + ")";
          })
         // .on('click', click)
          .on('dblclick', doubleClick);

        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style("fill", "lightsteelblue");
        nodeEnter.append("svg:foreignObject")
                .attr("width", 20)
                .attr("height", 25)
                .attr("y", -14)
                .attr("x", -10)
            .append("xhtml:span")
        	     .attr("class", function (d) {
        	                    let icon = '';
        	                    if(!INVLIST.IS_ONAP){
        	                        icon = 'icon-datanetwork-serverL';
        	                    }else{
        	                        icon = 'browse-fa fa fa-server';
        	                    }
        	                    if(d.data.details && d.data.details.parentContainer){
        	                        var iconKey = ((d.data.details.parentContainer).replace(/-/g, '')).toUpperCase();
        	                        if(INVLIST.INVENTORYLIST[iconKey] && INVLIST.INVENTORYLIST[iconKey].icon){
        	                            return INVLIST.INVENTORYLIST[iconKey].icon;
        	                        }else{
        	                            return icon;
        	                        }
        	                    }else{
        	                        return icon;
        	                    }
        	      })
                 .style("font-size", function (d) {
                                     if (!INVLIST.IS_ONAP){
                                        return "20px";
                                     } else {
                                        return "16px";
                                     }
                 })
                 .attr("id", function (d) {return "nodeIcon" + d.id})
                 .style("color", '#387dff')
                 .style("display", "block")
                 .style("padding-top",function(d){
                                      if (!INVLIST.IS_ONAP){
                                        return "0px";
                                      } else {
                                        return "8px";
                                      }
                 });

        nodeEnter.append("svg:foreignObject")
                .attr("width", 6)
                .attr("height", 6)
                .attr("y", 10)
                .attr("x", -10)
                .on('click', function (d) {
                    if(d.data.details.isRootNode){
                        d = null;
                        base.resetBuilder();
                    }else{
                        for(var i = 0; d.parent.children && i < d.parent.children.length; i++){
                            if (d.parent.children.length > 1 && d.data.name === d.parent.children[i].data.name){
                                d.parent.children.splice(i, 1);
                            }else if (d.parent.children.length === 1 && d.data.name === d.parent.children[i].data.name){
                                d.parent.children = null;
                            }
                        }
                        base.update(base, d);
                    }
                })
            .append("xhtml:span")
        	     .attr("class", "fa fa-minus")
        	     .style("padding-top", "1px")
                 .style("font-size", function (d){ return "5px";})
                 .attr("id", function (d) {return "nodeDelete" + d.data.id})
                 .style("color", '#387dff')
                 .style("display", function (d) {return "block";});
        nodeEnter.append("svg:foreignObject")
                         .attr("width", 6)
                         .attr("height", 6)
                         .attr("y", 10)
                         .attr("x", 5)
                         .on('click', function (d) { base.setState({enableModalFeedback: true}, function () {setTimeout(() => {add(d)},1);})})
                     .append("xhtml:span")
                 	      .attr("class", "fa fa-plus")
                 	      .style("padding-top", "1px")
                          .style("font-size", function (d){ return "5px";})
                          .attr("id", function (d) {return "nodeAdd" + d.data.id})
                          .style("color", '#387dff');
        nodeEnter.append("svg:foreignObject")
                                 .attr("width", 6)
                                 .attr("height", 6)
                                 .attr("y", -17)
                                 .attr("x", -10)
                                 .on('click', function (d) { edit(d)})
                             .append("xhtml:span")
                         	      .attr("class", "fa fa-pencil-square")
                         	      .style("padding-top", "1px")
                                  .style("font-size", function (d){ return "5px";})
                                  .attr("id", function (d) {return "nodeEdit" + d.data.id})
                                  .style("color", '#387dff');
        // Add labels for the nodes
        nodeEnter.append("svg:foreignObject")
                  .attr("width", 60)
                  .attr("height", 40)
                  .attr("y", -10)
                  .attr("x", -75)
                  .append("xhtml:span")
                  .append('text')
                    .attr("dy", ".35em")
                    .attr("x", function(d) {
                        return d.children ? -13 : 13;
                    })
                    .text(function(d) { return d.data.name; })
                    .style("float","right")
                    .style("color", '#000000');

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);
        var postNodeDrawnCallBack = function (d){
          if(!isInit && base.state.autoZoomEnabled || d.data.details.isRootNode){
             base.state.zoomFit();
          }
        }
        // Transition to the proper position for the node
        nodeUpdate.transition()
          .duration(base.state.duration)
          .attr("transform", function(d) {
              return "translate(" + d.y + "," + d.x + ")"
           }).on("end", postNodeDrawnCallBack);

        // Update the node attributes and style
        nodeUpdate.select('circle.node')
          .attr('r', 11)
          .style("fill", "lightsteelblue")
          .attr('cursor', 'pointer');


        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
            .duration(base.state.duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
          .attr('r', 1e-6);

        // On exit reduce the opacity of text labels
        nodeExit.select('text')
          .style('fill-opacity', 1e-6);

        // ****************** links section ***************************

        // Update the links...
        var link = base.state.g.selectAll('path.link')
            .data(links, function(d) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
              var o = {x: source.x0, y: source.y0}
              return diagonal(o, o)
            });

        // UPDATE
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(base.state.duration)
            .attr('d', function(d){ return diagonal(d, d.parent) });

        // Remove any exiting links
        var linkExit = link.exit().transition()
            .duration(base.state.duration)
            .attr('d', function(d) {
              var o = {x: source.x, y: source.y}
              return diagonal(o, o)
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d){
          d.x0 = d.x;
          d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
          var path = 'M ' + s.y + ' ' + s.x + ' C ' + ((s.y + d.y) / 2) + ' ' + s.x + ' ' +  (s.y + d.y) / 2 + ' ' + d.x + ' ' + d.y + ' ' + d.x;
          return path
        }
        base.state.svg.on("dblclick.zoom", null);
        // Toggle children on click.
        function add(d){
            base.populateEdgeRules(d.data.name,base.state.edgeRules);
            if(!d.children){
              d.children = [];
              d.data.children = [];
            }
            base.setState({
              selectedNode: d,
              showNodeModal: true,
              enableModalFeedback: false
            });

        }
        function edit(d){
            console.log("object editing: " + d);
            var nodeDetails = base.state.nodeDetails;
            //set up node details to have the node to edit
            if(d.data.details.isRootNode && base.props.match.params.type){
                var attributes = GeneralCommonFunctions.getFilteringOptions(d.data.details.nodeType);
                if(Object.keys(attributes).length > 0){
                    nodeDetails[0] = {};
                    nodeDetails[0].isRootNode = true;
                    nodeDetails[0].nodeType = base.props.match.params.type;
                    nodeDetails[0].isSelected = true;
                    nodeDetails[0].attrDetails = attributes;
                    if(base.state.initialRootEdit){
                        for (var key in nodeDetails[0].attrDetails) {
                            nodeDetails[0].attrDetails[key].isSelected = true;
                        }
                    }
                    nodeDetails[0].parentContainer = GeneralCommonFunctions.populateContainer(base.props.match.params.type);
                    for (var key in d.data.details.attrDetails) {
                        nodeDetails[0].attrDetails[key] = d.data.details.attrDetails[key];
                        if(base.state.initialRootEdit){
                            nodeDetails[0].attrDetails[key].filterType = [];
                            nodeDetails[0].attrDetails[key].filterType.push('EQ');
                        }
                    }
                }
                d.data.details = nodeDetails[0];
                base.setState({
                  initialRootEdit: false
                });
            }else{
                nodeDetails[0] = d.data.details;
            }
            base.setState({
              selectedNode: d,
              showEditNodeModal: true,
              showPathFilterDslBuilder: false
            });
        }
        function doubleClick(d) {
            edit(d);
        }
      }
  selectAll = (nodeKey) =>{
    var nodeDetails = this.state.nodeDetails;
    for (var key in nodeDetails[nodeKey].attrDetails) {
        nodeDetails[nodeKey].attrDetails[key].isSelected = true;
    }
    this.setState({nodeDetails: nodeDetails});
  }
  deselectAll = (nodeKey) =>{
    var nodeDetails = this.state.nodeDetails;
    for (var key in nodeDetails[nodeKey].attrDetails) {
        nodeDetails[nodeKey].attrDetails[key].isSelected = false;
    }
    this.setState({nodeDetails: nodeDetails});
  }
  build = (type, propID, attrDetails, preBuiltTree,dslPath,dslPathTree) =>{
    var selected = null;
    var treeData;
    if(!preBuiltTree && type && (propID || attrDetails)){
        let nodeType =  type;
        treeData = {
            "name": nodeType,
            "id": nodeType,
            "children": [],
            "details":{},
            "dslPath":[],
            "dslPathTree":[]
        }
        treeData.details.includeInOutput = true;
        treeData.details.isSelected = true;
        treeData.details.isRootNode = true;
        treeData.details.nodeType = nodeType;
        if(attrDetails){
            treeData.details.attrDetails = attrDetails;
        } else{
            treeData.details.attrDetails = {};
        }        
        if(dslPath && dslPath.length>0 && dslPathTree && dslPathTree.length>0){
            treeData.details.dslPath=dslPath;
            treeData.details.dslPathTree=dslPathTree;
        }
        if(propID){
            let propIds = (propID) ? propID.split(';') : '';
            let propertyValue = '';
            for(var i  in propIds){
            	let propValue = propIds[i].split(':');
            	console.log(propValue[0] + '....' + propValue[1]);
            	treeData.details.attrDetails[propValue[0]] = {};
                treeData.details.attrDetails[propValue[0]].filterValue=[];
                treeData.details.attrDetails[propValue[0]].filterValue.push(atob(propValue[1]).replace('<pre>','').replace('</pre>',''));
                treeData.details.attrDetails[propValue[0]].attributeName = propValue[0];
                treeData.details.attrDetails[propValue[0]].isSelected = true;
            }
        }
    }else if (preBuiltTree){
        treeData = preBuiltTree;
        if(treeData.details && treeData.details.dslPathTree && treeData.details.dslPathTree.length>0){
            for(var x=0;x<treeData.details.dslPathTree.length;x++){
                treeData.details.dslPath.push(GeneralCommonFunctions.populatePathDSL(treeData.details.dslPathTree[x],true,true,this.state.enableRealTime));
            }
        }
        if(treeData.children && treeData.children.length>0){
            for(var x=0;x<treeData.children.length;x++){               
               treeData.children[x]=this.updateDslPathValueOnExtract(treeData.children[x]);
            }
        }
    }

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#DSLBuilder");
    // Set the dimensions and margins of the diagram

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
           width = +svg.attr("width") - margin.right - margin.left,
           height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("transform", "translate("
              + margin.left + "," + margin.top + ")");

    var duration = 750,
        root;

    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height - 200, width]);

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", d3.event.transform)
    }
    //add zoom capabilities
    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    function zoomFit() {
      var bounds = g.node().getBBox();
      var parent = g.node().parentElement;
      if(bounds && parent){
        var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
            fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
        var width = bounds.width,
            height = bounds.height;
        var midX = bounds.x + width / 2,
            midY = bounds.y + height / 2;
        if (width == 0 || height == 0) return; // nothing to fit
        var scale = Math.min((0.95 / Math.max(width / fullWidth, height / fullHeight)), 4);
        var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        var transform = d3.zoomIdentity
            .translate(300, translate[1])
            .scale(scale);
        svg.transition().duration(350)
          .call(zoom_handler.transform, transform);
     }

    }

    //Set Default zoom
    svg.call(zoom_handler)
    .call(zoom_handler.transform, d3.zoomIdentity.translate(80, -1000).scale(4));
    this.setState({
            init: false,
        	svg: svg,
        	g: g,
        	treemap: treemap,
        	root: root,
        	duration: duration,
        	zoomFit: zoomFit
        }, ()=>{this.update(this, root, true);})

    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d.children.forEach(collapse)
        d.children = null
      }
    }
  }
  
  updateDslPathValueOnExtract=(treeDataChildren)=>{                   
    if(treeDataChildren.details && treeDataChildren.details.dslPathTree && treeDataChildren.details.dslPathTree.length>0){
        for(var x=0;x<treeDataChildren.details.dslPathTree.length;x++){
            let dsl=GeneralCommonFunctions.populatePathDSL(treeDataChildren.details.dslPathTree[x],true,true,this.state.enableRealTime);
            treeDataChildren.details.dslPath.push(dsl);         
        }
    }
    if(treeDataChildren && treeDataChildren.children && treeDataChildren.children.length>0){
        for(var x=0;x<treeDataChildren.children.length;x++){
            treeDataChildren.children[x]=this.updateDslPathValueOnExtract(treeDataChildren.children[x]);
        }
    } 
    return treeDataChildren;   
  }
  onTargetMenuOfFilterTypes=(listname,id)=>{
    console.log(listname+'onTargetMenuOfFilterTypes',id);
    let keysOfArray=id.split('#');
    let nodekey=keysOfArray[0];
    let attrKey=keysOfArray[1];
    let indx=parseInt(keysOfArray[2]);
    let nodeDetails = this.state.nodeDetails;
    let node = nodeDetails[nodekey];
    if(!node.attrDetails){
        node.attrDetails = [];
    }
    if(!node.attrDetails[attrKey]){
        node.attrDetails[attrKey] = {};
        node.attrDetails[attrKey].isSelected = true;
        node.attrDetails[attrKey].filterValue = [];
        node.attrDetails[attrKey].filterType = [];   
    }else{
        let filterTypes=node.attrDetails[attrKey].filterType;
        filterTypes[indx]=listname;
        node.attrDetails[attrKey].filterType=filterTypes;
    }    
    nodeDetails[nodekey] = node;
    // update the state with the new array of traverse to nodes
    this.setState({ nodeDetails: nodeDetails });
  };
  filterTags = (key,property,state) =>{
    let filterTags ='';
    let filters='';
    state=true;//always enable, in future if wants to disable remove this line
    if(APERTURE_SERVICE && this.state.enableRealTime){
        let nodeDetails = this.state.nodeDetails;
        let node = nodeDetails[key];
        filterTags= Object.keys(Object.keys(node.attrDetails[property].filterType)).map((indx) =>{
                    let selectedFilter=(node.attrDetails[property].filterType[indx]!=='')?node.attrDetails[property].filterType[indx]:this.state.filterTypeDisplay;
                    return <div style={{margin:'0px 0px 0px 5px'}}>
                        <label>                                       
                            <FilterTypes param={this.state}
                            selectedFilter={selectedFilter}
                            id={key+'#'+property+'#'+indx}
                            onMenuSelect={this.onTargetMenuOfFilterTypes} 
                            state={!state}/>
                        </label>
                        </div>                        
                    });
        filters= <Col md={4} className='removeLeftPadding'>{filterTags}</Col>;                
    }
    return filters;
  };
  addOrTemplate=(nodeKey,attrKey,indx)=>{
    let nodeDetails = this.state.nodeDetails;
    let node = nodeDetails[nodeKey];
    node.attrDetails[attrKey].filterValue.push('');
    node.attrDetails[attrKey].filterType.push('EQ');
    nodeDetails[nodeKey] = node;
    // update the state with the new array of traverse to nodes
    this.setState({ nodeDetails: nodeDetails });    
  };
  deleteOrTemplate=(nodeKey,attrKey,index)=>{
    let nodeDetails = this.state.nodeDetails;
    let node = nodeDetails[nodeKey];
    let filterValuesArray=node.attrDetails[attrKey].filterValue;
    let filterTypeArray=node.attrDetails[attrKey].filterType;
    filterValuesArray.splice(index,1);
    filterTypeArray.splice(index,1);
    node.attrDetails[attrKey].filterValue=filterValuesArray;
    node.attrDetails[attrKey].filterType=filterTypeArray;
    nodeDetails[nodeKey] = node;
    this.setState({ nodeDetails: nodeDetails });
  }
  toggleRealTimeAnalysisCallback=(checked)=>{
    console.log('toggleRealTimeAnalysisCallback>>>>',checked);
    sessionStorage.setItem(ENVIRONMENT + 'ENABLE_ANALYSIS', !checked);
    this.baseState.enableRealTime=!checked;
    this.baseState.init= true;
    this.setState({...this.baseState},()=>{document.getElementById("DSLBuilder").innerHTML='';});
  }
  renderPathFilterBuilder=(key,dslPath,dslPathTree)=>{
    console.log('renderPathFilterBuilder>>>>',key);
    let attrDetails=this.state.nodeDetails[key].attrDetails; 
    let nodeType=this.state.nodeDetails[key].nodeType; 
    this.setState({showPathFilterDslBuilder: true,pathFilterNodeType: key,pathFilterNodeName:nodeType,pathFIlterAttrDetails: attrDetails,dslPathBuilder: dslPath,dslPathTree:dslPathTree,isEditEnable:false});
  }
  /* Load Functions */
  getAndPopulateTreeFromDSL = (dslQuery) =>{
      var treeObject = [];
      var payload = {dsl: dslQuery};
      settings['ISAPERTURE'] = true;
      commonApi(settings, 'dsl/convert-query-to-tree', 'PUT', payload, 'ConvertQueryToTree')
                          		.then(res => {
                          			console.log('res:' + res.data, 'load');
                          			if(res.status === 200 || res.status === 404){
                          			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201 && res.data.status !== 404)){
                          			        this.triggerError(res.data, 'treeLoad');
                          			    }else{
                          			        treeObject = res.data;
                          			        this.setState({
                                               enableTreeLoadBusyFeedback:false,
                                               treeLoadErrMsg: null
                                               });
                                            console.log("TREE OBJECT: " + JSON.stringify(treeObject));
                                            //clear the svg
                                            if(this.state.svg){
                                              this.state.svg.selectAll("*").remove();
                                            }
                                            //set the init state
                                            this.setState({init: true, dslQuery: '', initialRootEdit: false, nodeDetails: [], selectedNode: null });
                                            var initNode = this.extractNodeDetails(treeObject.children[0], true);
                                            if(!this.state.treeLoadErrMsg || this.state.treeLoadErrMsg === ''){
                                                console.log(JSON.stringify(initNode));
                                                this.build(null, null, null, initNode);
                                                setTimeout(() => { this.state.zoomFit() }, 600);
                                                //scroll to the hidden static modal since svg offsetTop doesnt work for DSLBuilder id
                                                GeneralCommonFunctions.scrollTo('customDslBuilderModel');
                                            }else{
                                                this.triggerError(null, 'invalidQuery');
                                            }
                                        }
                                    }else{
                                      this.triggerError(res.data, 'treeLoad');
                                    }
                          		}, error=>{
                          		    if(error.response.status === 404){
                          		        this.setState({enableTreeLoadBusyFeedback:false});
                          		    }else{
                          		        this.triggerError(error.response.data, 'treeLoad');
                          		    }
                          		}).catch(error => {
                          		    this.triggerError(error, 'treeLoad');
                                })

  };
  resetBuilder = () => {
        if(this.state.svg){
  	        this.state.svg.selectAll("*").remove();
  	    }
        this.setState({
                    init: true,
                    dslQuery: '',
                    queryName:'',
                    queryDescription:'',
                    initialRootEdit: false,
                    nodeDetails: [],
                    selectedNode: null,
          	        treeLoadErrMsg: '',
          	        enableTreeLoadBusyFeedback: false,
          	        aggregateObjects: false
                    });
  }
  triggerError = (error, type) => {
    console.error('[CustomDslBuilder.jsx] error : ', JSON.stringify(error));
  	let errMsg = '';
  	if(error && error.status && error.message){
  	    errMsg += "Error Occurred: " + error.status + ' - ' +error.message;
  	}else{
  	    errMsg += "Error Occurred: " + JSON.stringify(error);
  	}
  	console.log(errMsg);
  	if(type === 'treeLoad' || type === 'invalidQuery'){
  	    this.resetBuilder();
  	    var errorMessage = errMsg;
  	    if(type === 'invalidQuery'){
  	         errorMessage = 'The loaded query uses DSL syntax not supported by the DSL Builder,'
                            + ' please only load queries compatible with the builder. For more'
                            + ' information on this error, please contact an administrator.';
  	    }
        this.setState({treeLoadErrMsg: errorMessage});
        GeneralCommonFunctions.scrollTo('treeLoadErrorMessage');
    }else{
        console.log('[CustomDslBuilder.jsx] :: triggerError invoked with invalid type : ' + type);
    }
  }
  validLoadableDSL = (dslQuery) => {
    var valid = false;
    dslQuery = dslQuery.replace(/\s/g, '');
    valid = dslQuery.indexOf(']>') === -1 && !(new RegExp("LIMIT[0-9]+$").test(dslQuery));
    return valid;
  }
  loadCallback = (name, description, category, dslQuery, isAggregate, type, queryId, id, templateDetails, makeCall) =>{
    var decodedDslQuery = atob(dslQuery).replace('<pre>','').replace('</pre>','');
    if(this.validLoadableDSL(decodedDslQuery)){
        if(name !== '' && description !== ''){
          this.setState({
  	        queryName:name,
  	        queryDescription:description,
  	        category:category,
  	        isPublicChecked: type === 'public',
  	        queryId: queryId,
  	        treeLoadErrMsg: null,
  	        aggregateObjects: isAggregate === "true"
          });
          console.log("DSL Query Loaded: "+ decodedDslQuery);
          console.log("DSL Query Name: "+ name);
          console.log("DSL Query Description: "+ description);
          console.log("DSL Query ID: "+ queryId);
          console.log("DSL Query Category: "+ category);
          console.log("DSL Query isAggregate: "+ isAggregate);
          console.log("DSL Query type: "+ type);
          var treeObject = this.getAndPopulateTreeFromDSL(decodedDslQuery);
        }
    }else{
        this.triggerError(null, "invalidQuery");
    }
  }
  extractNodeDetails = (node, isRoot) =>{
    let nodeType =  node['node-type'];
    let nodeData = {
        "name": nodeType,
        "id": nodeType,
        "children": [],
        "details":{}
    }
    nodeData.details.includeInOutput = node.store;
    nodeData.details.isSelected = true;
    nodeData.details.isRootNode = isRoot;
    nodeData.details.nodeType = nodeType;
    var attributes = GeneralCommonFunctions.getFilteringOptions(nodeType);
    nodeData.details.attrDetails = attributes;
    nodeData.details.parentContainer = GeneralCommonFunctions.populateContainer(nodeType);
    if(node.store && !node['requested-props']){
        for(var key in nodeData.details.attrDetails){
            nodeData.details.attrDetails[key].isSelected = true;
        }
    }else if (node.store && node['requested-props']){
         for(var key in node['requested-props']){
            nodeData.details.attrDetails[key].isSelected = true;
            nodeData.details.attrDetails[key].alias=node['requested-props'][key];
         }
    }
    var isValid = true;
    for (var x in node['node-filter']){
        if(isValid){
            for (var y in node['node-filter'][x]) {
                if(isValid){
                    var attrKey = node['node-filter'][x][y]['key'];
                    var filter = node['node-filter'][x][y]['filter'];
                    //If aperture is not turned on and query loaded uses anything besides EQ throw error
                    if(!APERTURE_SERVICE && filter !== 'EQ'){
                        this.triggerError(null, "invalidQuery");
                        isValid = false;
                    }
                    if(!nodeData.details.attrDetails[attrKey]){
                        nodeData.details.attrDetails[attrKey] = {};
                    }
                    if(nodeData.details.attrDetails[attrKey].filterType.length > 0 && nodeData.details.attrDetails[attrKey].filterType[0] === ''){
                        nodeData.details.attrDetails[attrKey].filterType = [];
                    }
                    if(nodeData.details.attrDetails[attrKey].filterValue.length > 0 && nodeData.details.attrDetails[attrKey].filterValue[0] === ''){
                        nodeData.details.attrDetails[attrKey].filterValue = [];
                    }
                    //if a filter had no values associated to it throw a not supported error
                    if(node['node-filter'][x][y]['value'][0]){
                        for (var i in node['node-filter'][x][y]['value']){
                            nodeData.details.attrDetails[attrKey].filterType.push(filter);
                            nodeData.details.attrDetails[attrKey].filterValue.push(node['node-filter'][x][y]['value'][i]);
                        }
                        if(!nodeData.details.attrDetails[attrKey].attributeName){
                            nodeData.details.attrDetails[attrKey].attributeName = attrKey;
                        }
                    }else{
                        this.triggerError(null, "invalidQuery");
                        isValid = false;
                    }
                }
            }
        }
    }
    var initWhereNode = null;
    if(node['where-filter'].length > 0){
        for(var index in node['where-filter']){
            initWhereNode = this.extractNodeDetails(node['where-filter'][index].children[0], true);
        }
    }
    if(initWhereNode){
        nodeData.details.dslPath=[];
        nodeData.details.dslPathTree=[];
        nodeData.details.dslPathTree.push(initWhereNode);
    }
    if(node.children.length > 0){
        for(var i = 0; i < node.children.length; i++){
            nodeData.children[i] = this.extractNodeDetails(node.children[i], false);
        }
    }
    return nodeData;
  }

  setQueriesState = (savedQueries) =>{
    this.setState({
    	loadedQueries: savedQueries
    });
  };
  /* End Load Functions */
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
	return(
        <div>
            {toggelRealtimeAnalysis}
	       <div className="addPadding">
                <div className='row container-fluid my-4'>
                	<div className='col-lg-9'>
                		<header className='jumbotron'>
                                    <h1 className='display-2'>Visual Query Builder for <strong>B</strong>uild <strong>Y</strong>our <strong>O</strong>wn <strong>Q</strong>uery</h1>
                                    <p className='lead'>
                                        Visually build your own query, you can click the + icon to add objects to your query,
                                        - icon to remove objects from your query, or the pencil icon/double click to edit attributes.
                                        Single click and drag in the view to pan, use scrollwheel or pinch to zoom. <br/>
                                    </p>
                        </header>
                	</div>
                </div>
                <div className={'addPaddingTop alert alert-danger ' +(this.state.treeLoadErrMsg && this.state.treeLoadErrMsg !== '' ? 'show' : 'hidden')} id="treeLoadErrorMessage" role="alert">
                  An error occurred in loading the query. Please see details {this.state.treeLoadErrMsg}
                </div>
                <CustomDSLSaveLoad loadCallback={this.loadCallback} setQueriesState={this.setQueriesState} ref={this.saveLoadComponent} isDataSteward={this.state.isDataSteward} isDSLBuilder={true}/>
                <div className={'row ' + (this.state.init ? 'show' : 'hidden')}>
                    <button className='btn btn-primary' type='button' onClick={this.initialize.bind(this)}>Start Building (+)</button>
                </div>
                <div className={'row ' + (!this.state.init ? 'show' : 'hidden')}>
                    <button className='btn btn-primary' type='button' onClick={this.runDSL}>Run Query</button>
                    <button className='btn btn-outline-secondary' type='button' onClick={this.showEditDSLModal}>Manual Edit & Run</button>
                    <div className={'checkbox ' + (GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                       <label>
                         <input type="checkbox" checked={this.state.aggregateObjects} onChange={this.onAggregateCheckbox.bind(this)} />
                         Aggregate Objects
                       </label>
                       <label>
                         <input type="checkbox" checked={this.state.autoZoomEnabled} onChange={this.onAutoZoomCheckbox.bind(this)} />
                         Auto Zoom Enabled
                       </label>
                    </div>
                </div>

                <div className='static-modal' id='customDslBuilderModel'>
            		<Modal show={this.state.showNodeModal} onHide={this.closeNodeModal}>
            			<Modal.Header>
            				<Modal.Title>Modify Query</Modal.Title>
            			</Modal.Header>
            			    <Modal.Body>
                              <form>
                                   {Object.keys(this.state.nodeDetails).sort().map((key, node) => (
                                        <div className="dsl-panel">
                                           <Panel>
                                             <Panel.Heading>
                                               <Panel.Title>
                                                 <div className={'checkbox ' + (!this.state.init ? 'show' : 'hidden')}>
                                                    <label>
                                                      <input type="checkbox" checked={this.state.nodeDetails[key].isSelected} value={key} onChange={this.onNodeCheckbox.bind(this)} />
                                                      {this.state.nodeDetails[key].nodeType}
                                                    </label>
                                                    <Panel.Toggle>
                                                      <div className="pull-right">Options</div>
                                                    </Panel.Toggle>
                                                 </div>
                                                 <div className={(this.state.init ? 'show' : 'hidden')}>
                                                    <label>
                                                      <input type="radio" value={key} checked={this.state.nodeDetails[key].isSelected} onChange={this.onNodeRadio.bind(this)} />
                                                      {" " + this.state.nodeDetails[key].nodeType}
                                                    </label>
                                                    <Panel.Toggle>
                                                      <div className="pull-right">Options</div>
                                                    </Panel.Toggle>
                                                 </div>
                                               </Panel.Title>
                                             </Panel.Heading>
                                             <Panel.Collapse>
                                               <Panel.Body className='cardwrap'>
                                                 <div>
                                                    <div style={{float:'right'}}>
                                                        <button type='button' className='btn btn-primary pull-right' onClick={()=>this.renderPathFilterBuilder(key)}>Build Path Filter</button>
                                                    </div>
                                                 </div>
                                                 {this.state.nodeDetails[key].dslPath && this.state.nodeDetails[key].dslPath.length>0 &&
                                                  <Grid fluid={true} className='addPaddingTop'>
                                                    <Row className='show-grid addPaddingTop'>
                                                        <Col md={10}>
                                                        <strong>DSL PATH Filter</strong>
                                                        </Col>
                                                        <Col md={2} className='removeLeftPadding'>
                                                            <strong>Action</strong>
                                                        </Col>
                                                    </Row>
                                                  </Grid>}
                                                  <Grid fluid={true}>
                                                 {this.state.nodeDetails[key].dslPath && Object.keys(this.state.nodeDetails[key].dslPath).map((indx) => {
                                                    return(
                                                        <Row className='show-grid'>
                                                            <Col md={9}>
                                                                <div style={{float:'left',width:'100%',margin:'10px 0px'}}>
                                                                    {this.state.nodeDetails[key].dslPath[indx]}
                                                                </div>
                                                            </Col>
                                                            <Col md={3}>
                                                                     <button
                                                                        className='btn btn-primary'
                                                                        style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                                        type='button'
                                                                        onClick={e => {this.editPathNodeModal(key,this.state.nodeDetails[key].dslPath[indx],this.state.nodeDetails[key].dslPathTree[indx],indx)}}>Edit</button>
                                                                    <button
                                                                        className='btn btn-primary'
                                                                        style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                                        type='button'
                                                                        onClick={e => {this.deletePathNodeModal(key,this.state.nodeDetails[key].dslPath[indx],this.state.nodeDetails[key].dslPathTree[indx],indx)}}>Delete</button>
                                                            </Col>
                                                        </Row>
                                                    )
                                                 })}
                                                 </Grid>
                                                 <div style={{float:'left'}} className={(GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                                                        <button type='button' className='btn btn-outline-primary pull-right' onClick={()=>this.deselectAll(key)}>Deselect All</button>
                                                        <button type='button' className='btn btn-primary pull-right' onClick={()=>this.selectAll(key)}>Select All</button>
                                                </div>
                                                 <Grid fluid={true} className='addPaddingTop'>
                                                    <Row className='show-grid addPaddingTop'>
                                                       <Col md={(this.state.enableRealTime)?4:6} className={(GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                                                         <strong>Include in Output</strong>
                                                       </Col>
                                                       {APERTURE_SERVICE && this.state.enableRealTime && <Col md={4} className='removeLeftPadding'>
                                                         <strong>Filter Types</strong>
                                                       </Col>}
                                                       <Col md={(this.state.enableRealTime)?4:6} className='removeLeftPadding'>
                                                          <strong>Filter By (Optional)</strong>
                                                       </Col>
                                                    </Row>
                                                 {Object.keys(this.state.nodeDetails[key].attrDetails).sort().map((attrKey, attr) => {
                                                    return(
                                                           <Row className='show-grid'>
                                                              <Col md={(this.state.enableRealTime)?4:6} className={(GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                                                               <div className="checkbox">
                                                                   <label>
                                                                     <input type="checkbox" checked={this.state.nodeDetails[key].attrDetails
                                                                     && this.state.nodeDetails[key].attrDetails[attrKey]
                                                                     && this.state.nodeDetails[key].attrDetails[attrKey].isSelected }
                                                                     value={key + "|" + attrKey} onChange={this.onAttributeCheckbox.bind(this)} />
                                                                     {attrKey}
                                                                   </label>
                                                                </div>
                                                              </Col>
                                                              {this.filterTags(key,attrKey,this.state.nodeDetails[key].attrDetails[attrKey].isSelected)}
                                                              <Col md={(this.state.enableRealTime)?4:6} className='removeLeftPadding'>
                                                              {Object.keys(this.state.nodeDetails[key].attrDetails[attrKey].filterValue).map((indx) =>{
                                                                return(
                                                                    <div>
						    			{this.state.nodeDetails[key].attrDetails[attrKey].filterValue[indx] ==='' && <input type="text"
                                                                            placeholder={"Enter " + attrKey }
                                                                            className='inputFilter'
                                                                            onBlur={(e)=>{this.onFilterValueChange(e, key, attrKey,indx);}}
                                                                            />
                                                                        }
                                                                        {this.state.nodeDetails[key].attrDetails[attrKey].filterValue[indx] !=='' && <input type="text"
                                                                            onChange={(e)=>{this.onFilterValueChange(e, key, attrKey,indx);}}
                                                                            placeholder={"Enter " + attrKey }
                                                                            className='inputFilter'
                                                                            value={this.state.nodeDetails[key].attrDetails[attrKey].filterValue[indx]}
                                                                            />
                                                                        }
                                                                        {indx == 0 && <button
                                                                            className={(this.state.nodeDetails[key].attrDetails[attrKey].filterValue[indx] !=='')?'btn btn-primary':'btn btn-secondary'}
                                                                            style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                                            disabled={this.state.nodeDetails[key].attrDetails[attrKey].filterValue[indx]===''}
                                                                            type='button'
                                                                            onClick={e => {this.addOrTemplate(key,attrKey,indx)}}>+</button>}
                                                                        {indx > 0 && <button
                                                                            style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                                            id={'delete-'+indx}
                                                                            className='btn btn-danger'
                                                                            type='button'
                                                                            onClick={e => {this.deleteOrTemplate(key,attrKey,indx)}}>x</button>}

                                                                    </div>
                                                                )
                                                              })}

                                                              </Col>
                                                           </Row>
                                                    );
                                                  }
                                                 )}
                                                 </Grid>
                                               </Panel.Body>
                                             </Panel.Collapse>
                                           </Panel>
                                        </div>
                                   ))}
                                 </form>
                                 <div className={this.state.showPathFilterDslBuilder ? 'show' : 'hidden'}>
                                    <Modal show={this.state.showPathFilterDslBuilder} onHide={!this.state.showPathFilterDslBuilder} style={{width:'100%'}}>
                                        <Modal.Header>
                                            <Modal.Title>Build DSL Path</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body style={{overflow:'scroll'}}>
                                            <PathFilterDslBuilder  nodeType={this.state.pathFilterNodeType}
                                                                nodeName={this.state.pathFilterNodeName}
                                                                attrDetails={this.state.pathFIlterAttrDetails}
                                                                closePathNodeModal={this.closePathNodeModal}
                                                                submitPathNodeModal={this.submitPathNodeModal}
                                                                showPathFilterDslBuilder={this.state.showPathFilterDslBuilder}
                                                                dslPath={this.state.dslPathBuilder}
                                                                dslPathTree={this.state.dslPathTree}
                                                                isEditEnable={this.state.isEditEnable}
                                                                pathFilterIndex={this.state.pathFilterIndex}/>
                                        </Modal.Body>
                                    </Modal>
                                </div>
            			    </Modal.Body>
            			    <Modal.Footer>
            			    	<Button onClick={this.closeNodeModal}>Close</Button>
            			    	<Button onClick={this.submitNodeModal}>Submit</Button>
            			    </Modal.Footer>
            		</Modal>
                </div>
                <div className='static-modal' id='editNodeModel'>
                	<Modal show={this.state.showEditNodeModal} onHide={this.closeEditNodeModal}>
                		<Modal.Header>
                			<Modal.Title>Modify Node</Modal.Title>
                		</Modal.Header>
                		<Modal.Body>
                          <form>
                            <div className="dsl-panel">
                               <Panel>
                                 <Panel.Heading>
                                   <Panel.Title>
                                     <div>
                                        <label>{this.state.selectedNode
                                                && this.state.selectedNode.data
                                                && this.state.selectedNode.data.details ?
                                                this.state.selectedNode.data.details.nodeType
                                                : ""
                                               }
                                        </label>
                                     </div>
                                   </Panel.Title>
                                 </Panel.Heading>
                                 <Panel.Body className='cardwrap'>                                
                                    <Grid fluid={true} className='addPaddingTop'>
                                    <Row className='show-grid addPaddingTop'>
                                        <div style={{float:'right'}}>
                                            <button type='button' className='btn btn-primary pull-right' onClick={()=>this.renderPathFilterBuilder(0)}>Build Path Filter</button>
                                        </div>
                                    </Row>
                                    {this.state.selectedNode
                                        && this.state.selectedNode.data
                                        && this.state.selectedNode.data.details
                                        && this.state.nodeDetails[0]
                                        && this.state.nodeDetails[0].dslPath && this.state.nodeDetails[0].dslPath.length>0 && 
                                    <Row className='show-grid addPaddingTop'>
                                        <Col md={10}>
                                        <strong>DSL PATH Filter</strong>
                                        </Col>                                                
                                        <Col md={2} className='removeLeftPadding'>
                                            <strong>Action</strong>
                                        </Col>
                                    </Row>}
                                    </Grid>                                                                                                                                 
                                    {this.state.selectedNode
                                        && this.state.selectedNode.data
                                        && this.state.selectedNode.data.details
                                        && this.state.nodeDetails[0]
                                        && this.state.nodeDetails[0].dslPath && Object.keys(this.state.nodeDetails[0].dslPath).map((indx) => {
                                    return(
                                        <Row className='show-grid'>
                                            <Col md={9}>
                                                <div style={{float:'left',width:'100%',margin:'10px 0px'}}>
                                                    {this.state.nodeDetails[0].dslPath[indx]}
                                                </div>
                                            </Col>
                                            <Col md={3}>
                                                        <button 
                                                        className='btn btn-primary'
                                                        style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                        type='button' 
                                                        onClick={e => {this.editPathNodeModal(0,this.state.nodeDetails[0].dslPath[indx],this.state.nodeDetails[0].dslPathTree[indx],indx)}}>Edit</button>
                                                    <button 
                                                        className='btn btn-primary'
                                                        style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                        type='button' 
                                                        onClick={e => {this.deletePathNodeModal(0,this.state.nodeDetails[0].dslPath[indx],this.state.nodeDetails[0].dslPathTree[indx],indx)}}>Delete</button>
                                            </Col>
                                        </Row>
                                    )
                                    })}
                                    <div style={{float:'left'}} className={(GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                                        <button type='button' className='btn btn-outline-primary pull-right' onClick={()=>this.deselectAll(0)}>Deselect All</button>
                                        <button type='button' className='btn btn-primary pull-right' onClick={()=>this.selectAll(0)}>Select All</button>
                                    </div>
                                   <Grid fluid={true} className='addPaddingTop'>
                                      <Row className='show-grid addPaddingTop'>
                                         <Col md={(this.state.enableRealTime)?4:6} className={(GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                                           <strong>Include in Output</strong>
                                         </Col>
                                         {this.state.enableRealTime && <Col md={4} className='removeLeftPadding'>
                                           <strong>Filter Types</strong>
                                         </Col>}
                                         <Col md={(this.state.enableRealTime)?4:6} className='removeLeftPadding'>
                                            <strong>Filter By (Optional)</strong>
                                         </Col>
                                      </Row>
                                   {this.state.selectedNode
                                        && this.state.selectedNode.data
                                        && this.state.selectedNode.data.details
                                        && this.state.nodeDetails[0]
                                        && Object.keys(this.state.nodeDetails[0].attrDetails).sort().map((attrKey, attr) => {
                                      return(
                                             <Row className='show-grid'>
                                                <Col md={(this.state.enableRealTime)?4:6} className={(GlobalExtConstants.INVLIST.IS_ONAP ? 'hidden' : '' )}>
                                                 <div className="checkbox">
                                                     <label>
                                                       <input type="checkbox" checked={this.state.nodeDetails[0].attrDetails
                                                       && this.state.nodeDetails[0].attrDetails[attrKey]
                                                       && this.state.nodeDetails[0].attrDetails[attrKey].isSelected }
                                                       value={0 + "|" + attrKey} onChange={this.onAttributeCheckbox.bind(this)} />
                                                       {attrKey}
                                                     </label>
                                                  </div>
                                                </Col>
                                                {this.filterTags(0,attrKey, this.state.nodeDetails[0].attrDetails[attrKey].isSelected)}
                                                <Col md={(this.state.enableRealTime)?4:6} className='removeLeftPadding'>
                                                {Object.keys(this.state.nodeDetails[0].attrDetails[attrKey].filterValue).map((indx) =>{
                                                  return(
                                                      <div>
                                                          
                                                          {this.state.nodeDetails[0].attrDetails[attrKey].filterValue[indx] ==='' && <input type="text"
                                                              placeholder={"Enter " + attrKey }
                                                              className='inputFilter'
                                                              onBlur={(e)=>{this.onFilterValueChange(e, 0, attrKey, indx);}}
                                                              />
                                                          }
                                                          {this.state.nodeDetails[0].attrDetails[attrKey].filterValue[indx] !=='' && <input type="text"
                                                              onChange={(e)=>{this.onFilterValueChange(e, 0, attrKey,indx);}}
                                                              placeholder={"Enter " + attrKey }
                                                              className='inputFilter'
                                                              value={this.state.nodeDetails[0].attrDetails[attrKey].filterValue[indx]}
                                                              />
                                                          }
                                                          {indx == 0 && <button
                                                              className={(this.state.nodeDetails[0].attrDetails[attrKey].filterValue[indx]!=='')?'btn btn-primary':'btn btn-secondary'}
                                                              style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                              disabled={this.state.nodeDetails[0].attrDetails[attrKey].filterValue[indx]===''}
                                                              type='button'
                                                              onClick={e => {this.addOrTemplate(0 ,attrKey,indx)}}>+</button>}
                                                          {indx > 0 && <button
                                                              style={{padding:'2px',margin:'0px 0px 7px 3px'}}
                                                              id={'delete-'+indx}
                                                              className='btn btn-danger'
                                                              type='button'
                                                              onClick={e => {this.deleteOrTemplate(0 ,attrKey,indx)}}>x</button>}

                                                      </div>
                                                  )
                                                })}

                                                </Col>
                                             </Row>
                                      );
                                    }
                                   )}
                                   </Grid>
                                 </Panel.Body>
                               </Panel>
                            </div>
                          </form>                          
                          <div className={(this.state.showPathFilterDslBuilder && this.state.showEditNodeModal) ? 'show' : 'hidden'}>
                                <Modal show={this.state.showPathFilterDslBuilder} onHide={!this.state.showPathFilterDslBuilder} style={{width:'100%'}}>
                                    <Modal.Header>
                                        <Modal.Title>Build DSL Path</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body style={{overflow:'scroll'}}>
                                        <PathFilterDslBuilder  nodeType={this.state.pathFilterNodeType}
                                                            nodeName={this.state.pathFilterNodeName}
                                                            attrDetails={this.state.pathFIlterAttrDetails}
                                                            closePathNodeModal={this.closePathNodeModal}
                                                            submitPathNodeModal={this.submitPathNodeModal}
                                                            showPathFilterDslBuilder={this.state.showPathFilterDslBuilder}
                                                            dslPath={this.state.dslPathBuilder}
                                                            dslPathTree={this.state.dslPathTree}
                                                            isEditEnable={this.state.isEditEnable}
                                                            pathFilterIndex={this.state.pathFilterIndex}/>
                                    </Modal.Body>
                                </Modal> 
                           </div> 
                		</Modal.Body>
                		<Modal.Footer>
                			<Button onClick={this.closeEditNodeModal}>Close</Button>
                			<Button onClick={this.submitEditNodeModal}>Submit</Button>
                		</Modal.Footer>
                	</Modal>
                </div>
                <div className='static-modal'>
                	<Modal show={this.state.showEditModal} onHide={this.closeEditDSLModal}>
                		<Modal.Header>
                			<Modal.Title>Edit DSL Query</Modal.Title>
                		</Modal.Header>
                		<Modal.Body>
                            <form>
                                <FormGroup controlId="dslQuery">
                                      <ControlLabel>DSL Query</ControlLabel>
                                      <FormControl onChange={this.bindEdits.bind(this)} value={this.state.editModel} componentClass="textarea" placeholder="Enter DSL Query" />
                                 </FormGroup>
                            </form>
                		</Modal.Body>
                		<Modal.Footer>
                			<Button onClick={this.closeEditDSLModal}>Close</Button>
                			<Button onClick={this.submitEditAndRunDSL}>Submit</Button>
                		</Modal.Footer>
                	</Modal>
                </div>
                <div>
                    <div className={'card-header ' + (this.state.queryName && this.state.queryName !== '' ? 'show' : 'hidden')}>
                    	<div>
                    		<h3>{this.state.queryName}</h3>
                    	</div>
                    </div>
                    <div className={'card-header ' + (this.state.queryDescription && this.state.queryDescription !== ''  ? 'show' : 'hidden')}>
                    	<div>
                    		<h4>{this.state.queryDescription}</h4>
                    	</div>
                    </div>
                    <div className={'card-header ' + (this.state.dslQuery && this.state.dslQuery !== ''  ? 'show' : 'hidden')}>
                    	<div>
                    		<h4><strong>DSL Query: </strong><span className='pre-wrap-text'>{this.state.dslQuery}</span></h4>
                    	</div>
                    </div>
                </div>
                {this.state.enableModalFeedback && <Spinner loading={true}><span height="100%" width="100%"></span></Spinner>}
                <svg id='DSLBuilder' width='1800' height='800'></svg>
           </div>
        </div>
	);
  }
}

export default CustomDslBuilder;
