/* eslint-disable import/no-named-as-default */
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
import React, {Component} from 'react';
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
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import {GeneralCommonFunctions} from 'utils/GeneralCommonFunctions.js';
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
    'USESTUBS': INVLIST.useStubs
};
class PathFilterDslBuilder extends Component {
	constructor(props) {
		console.log('PathFilter props>>>>',props);
        super(props);
        APERTURE_SERVICE=JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
		this.state = {edgeRules : null,
		              showNodeModal: false,
		              treemap: null,
		              root: null,
		              svg: null,
		              duration: null,
		              g: null,
		              selectedNode: null,
		              traverseToNodes:[],
		              nodeDetails: [],
                      dslQuery: '',
                      dslQueryTree:'',
		              editModel:'',
		              showEditModal: false,
		              zoomFit: null,
		              autoZoomEnabled: true,
		              aggregateObjects: false,
		              init: true,
		              filterTypeDisplay: 'Filter Type',
                      selectedfilterType:[],
                      oxmMapping:null,
                      closePathNodeModal:true,
                      submitPathNodeModal:false,
                      parentNodeType:'',
                      parentAttrDetails:'',
                      showPathFilterDslBuilder:false,
                      dslPath:'',
                      dslPathTree:null,
                      isInitialize:true,
                      treeData:'',
                      showEditNodeModal:false,
		      enableRealTime: JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'ENABLE_ANALYSIS'))
		      }
	}

  componentDidMount () {
    console.log('Path Filter componentDidMount',JSON.stringify(this.props));
    //this.buildSQLStatementsFromSchema();
    this.processEdgeRules(EDGERULES);    
  }
  componentDidUpdate (nextProps) {
      console.log('Path  Filter componentDidUpdate>>>>>>>',nextProps);
      if(this.state.isInitialize){
        this.props=nextProps;
        console.log('this.props>>>>>>>>>>>>>',this.props);
        this.setState({submitPathNodeModal:this.props.submitPathNodeModal,
                closePathNodeModal:this.props.closePathNodeModal,
                parentNodeType:this.props.nodeType,
                parentAttrDetails:this.props.attrDetails,
                showPathFilterDslBuilder:this.props.showPathFilterDslBuilder,
                dslPath:this.props.dslPath,
                dslPathTree:this.props.dslPathTree,
                isInitialize: false},()=>{
                    if(this.props.dslPathTree){ 
                        this.build(this.props.nodeType,null,this.props.attrDetails,this.props.dslPathTree);
                    }else{
                        //this.initialize(this.props.nodeName);
                        this.setState({showNodeModal: true,isInitialize:false},()=>{this.populateEdgeRules(this.props.nodeName,this.state.edgeRules)});
                    }
                });
    }
    console.log('this.state under Update>>>>>',this.state);
  }
  componentWillReceiveProps(nextProps) {      
    console.log('path Filter componentWillReceiveProps>>>>');    
  }
  initialize = () => {
    var nodeDetails = [];
    var node = null;
    console.log('initializing');
    var id = GeneralCommonFunctions.generateID();
    var nodeTypes = GeneralCommonFunctions.getNodeTypes();
    for (var i = 0; i < nodeTypes.length; i++) {
        node = nodeTypes[i] + id;
        if(this.props.nodeName === nodeTypes[i]){
            var attributes = GeneralCommonFunctions.getFilteringOptions(nodeTypes[i]);
            if(!nodeDetails[node] && Object.keys(attributes).length > 0){
                nodeDetails[node] = {};
                nodeDetails[node].nodeType = nodeTypes[i];
                nodeDetails[node].isSelected = false;
                nodeDetails[node].attrDetails = attributes;
                nodeDetails[node].parentContainer = GeneralCommonFunctions.populateContainer(nodeTypes[i]);
            }
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
    console.log('Node Types List' + JSON.stringify(nodesSorted));
    nodeDetails = nodesSorted;
    this.setState({
    	nodeDetails: nodeDetails,
        showNodeModal: true,
        isInitialize:false
    });
  }
  initialLoadWhileClose= ()=>{
    this.setState({showNodeModal: true,isInitialize:false},()=>{this.populateEdgeRules(this.props.nodeName,this.state.edgeRules)});                   
  }
  processEdgeRules = (data) => {
  	this.setState({
  		edgeRules: data.rules
  	});
  }
  closeNodeModal = () =>{
    this.setState({
    	showNodeModal: false,
    	traverseToNodes: [],
    	selectedNode: null
    });
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
  
  onAttributeCheckbox(e){//delete
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
        }

        // check if the check box is checked or unchecked
        if (e.target.checked) {
          // add the value of the checkbox to nodes array
          node.attrDetails[attrValue].isSelected = true;
          node.attrDetails[attrValue].filterType[0]='EQ';
        } else {
          // or remove the value from the unchecked checkbox from the array
          node.attrDetails[attrValue].isSelected = false;
          node.attrDetails[attrValue].filterType = [''];
          node.attrDetails[attrValue].filterValue = [''];
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
  submitPathNodeModal= () =>{
      console.log('PathFinder submitPathNodeModal>>>>>',this.props);
      this.props.submitPathNodeModal(this.state.dslQuery,this.props.nodeType,this.state.dslQueryTree,this.props.isEditEnable,this.props.pathFilterIndex);
  }
  submitNodeModal = () =>{
    if(this.state.selectedNode){
        var treeData=this.state.dslQueryTree;
        var updatedTreeData='';
        var d = this.state.selectedNode;
        for(var node in this.state.nodeDetails){
            if(this.state.nodeDetails[node].isSelected){
                var newNodeObj = {
                          	type: 'node',
                            name: this.state.nodeDetails[node].nodeType,
                            id: node,
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
                console.log('submit node newNodeObj>>>>>',newNodeObj);
                treeData=(updatedTreeData==='')?treeData:updatedTreeData;
		updatedTreeData=this.handlingTreeDataWhileAddRemove(treeData,newNodeObj,d.data.id,d.data.name);
                 d.children.push(newNode);
                 this.setState({ nodeDetails: [] });
        }
      }
      this.setState({
          	showNodeModal: false,
          	traverseToNodes: [],
            selectedNode: null,
            dslQueryTree:updatedTreeData
       }, ()=>{this.update(this, d)});
    }else{
        var nodeType = "";
        var attrDetails = null;
        for (var key in this.state.nodeDetails) {
            if(this.state.nodeDetails[key].isSelected){
              nodeType = this.state.nodeDetails[key].nodeType;
              attrDetails = this.state.nodeDetails[key].attrDetails;
            }
        }
       this.build(nodeType, null, attrDetails);
       this.setState({ nodeDetails: [], showNodeModal: false, traverseToNodes: [], selectedNode: null });
    }
  }
  handlingTreeDataWhileAddRemove = (treeData,addObject,id,name)=>{ 
    if(addObject===''){
       if(treeData.children && treeData.children.length>0){            
            for(var y=0;y<treeData.children.length;y++){   
                if(treeData.children[y].id=== id  && treeData.children[y].name===name){                                
                    treeData.children.splice(y,1);                    
                }else{
                    treeData.children[y]=this.handlingTreeDataWhileAddRemove(treeData.children[y],'',id,name);
                }               
            }
        } 
    }else{
        if(treeData.id === id && treeData.name===name){
            if(!treeData.children){
                treeData.children=[];                    
            }                
            treeData.children.push(addObject); 
        }else if(treeData.children && treeData.children.length>0){            
            for(var y=0;y<treeData.children.length;y++){   
                if(treeData.children[y].id=== id  && treeData.children[y].name===name){
                    if(!treeData.children[y].children){
                        treeData.children[y].children=[];                    
                    }                
                    treeData.children[y].children.push(addObject);                    
                }else{
                    treeData.children[y]=this.handlingTreeDataWhileAddRemove(treeData.children[y],addObject,id,name);
                }               
            }
        } 
    }
    return treeData;
  }

  populateEdgeRules = (nodeType) => {
        let  nodeDetails=GeneralCommonFunctions.populateEdgeRules(nodeType,this.state.edgeRules);
  	    this.setState({
        	nodeDetails: nodeDetails
        });
  }
  
  
  closeEditDSLModal = () => {
    console.log("closing DSL edit modal");
    this.setState({ showEditModal: false });
  }
  submitEditNodeModal  = () =>{
    this.update(this, this.state.selectedNode);
    this.setState({showEditNodeModal: false});
  }
  closeEditNodeModal = () =>{
    this.setState({
    	showEditNodeModal: false,
        selectedNode: null
    });
  }
  bindEdits = (e) => {
    this.setState({ editModel: e.target.value });
  }
  
  update = (base, source, isInit) => {

        // Assigns the x and y position for the nodes
        var treeData = base.state.treemap(base.state.root);

        var DSL = GeneralCommonFunctions.populatePathDSL(treeData,true,false,this.state.enableRealTime);
        console.log(JSON.stringify("DSL :" + DSL));

        this.setState({ dslQuery: DSL });

        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        var list1 = d3.selectAll(".fa")
            .filter(".fa-plus")
            .style("display","block");

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
            .style("fill", function(d) {
                return d.data.details && d.data.details.includeInOutput ? "lightsteelblue" : "#fff";
            });
        nodeEnter.append("svg:foreignObject")
                .attr("width", 20)
                .attr("height", 20)
                .attr("y", -14)
                .attr("x", -10)
            .append("xhtml:span")
        	     .attr("class", function (d) {
        	                    let icon = 'icon-datanetwork-serverL';
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
                 .style("font-size", function (d){ return "20px";})
                 .attr("id", function (d) {return "nodeIcon" + d.id})
                 .style("color", '#387dff')
                 .style("display", "block");

        nodeEnter.append("svg:foreignObject")
                .attr("width", 5)
                .attr("height", 5)
                .attr("y", 10)
                .attr("x", -10)
                .on('click', function (d) {
                    if(d.data.details.isRootNode){
                        d = null;
                        base.state.svg.selectAll("*").remove();
                        base.setState({init: true, dslQuery: '',dslQueryTree:''});
                    }else{
                        let dslQueryTree=base.state.dslQueryTree; 
                        for(var i = 0; d.parent.children && i < d.parent.children.length; i++){
                            if (d.parent.children.length > 1 && d.data.name === d.parent.children[i].data.name){
                                d.parent.children.splice(i, 1);
                                dslQueryTree=base.handlingTreeDataWhileAddRemove(dslQueryTree,'',d.data.id,d.data.name);
                                base.setState({dslQueryTree:dslQueryTree});
                            }else if (d.parent.children.length === 1 && d.data.name === d.parent.children[i].data.name){
                                d.parent.children = null;
                            }
                        }
                        base.update(base, d);
                    }
                })
            .append("xhtml:span")
        	     .attr("class", "fa fa-minus")
                 .style("font-size", function (d){ return "5px";})
                 .attr("id", function (d) {return "nodeDelete" + d.id})
                 .style("color", '#387dff')
                 .style("display", function (d) {return "block";});
        nodeEnter.append("svg:foreignObject")
                         .attr("width", 5)
                         .attr("height", 5)
                         .attr("y", 10)
                         .attr("x", 5)
                         .on('click', function (d) { add(d)})
                     .append("xhtml:span")
                 	      .attr("class", "fa fa-plus")
                          .style("font-size", function (d){ return "5px";})
                          .attr("id", function (d) {return "nodeAdd" + d.id})
                          .style("color", '#387dff');
        nodeEnter.append("svg:foreignObject")
                                 .attr("width", 5)
                                 .attr("height", 5)
                                 .attr("y", -17)
                                 .attr("x", -10)
                                 .on('click', function (d) { edit(d)})
                             .append("xhtml:span")
                         	      .attr("class", "fa fa-pencil-square")
                                  .style("font-size", function (d){ return "5px";})
                                  .attr("id", function (d) {return "nodeEdit" + d.id})
                                  .style("color", '#387dff');
        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.children ? -13 : 13;
            })
            .attr("text-anchor", function(d) {
                return d.children ? "end" : "start";
            })
            .text(function(d) { return d.data.name; });

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);
        var postNodeDrawnCallBack = function (d){
          if(!isInit && base.state.autoZoomEnabled  || d.data.details.isRootNode){
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
          .style("fill", function(d) {
              return d.data.details && d.data.details.includeInOutput ? "lightsteelblue" : "#fff";
          })
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
              showNodeModal: true
            });

        }
        function edit(d){
            console.log("object editing: " + d);
            var nodeDetails = base.state.nodeDetails;
            //set up node details to have the node to edit
            nodeDetails[0] = d.data.details;
            base.setState({
              selectedNode: d,
              showEditNodeModal: true
            });
        }
        function doubleClick(d) {
            edit(d);
        }
      }
  selectAll = (nodeKey) =>{//delete
    var nodeDetails = this.state.nodeDetails;
    for (var key in nodeDetails[nodeKey].attrDetails) {
        nodeDetails[nodeKey].attrDetails[key].isSelected = true;
    }
    this.setState({nodeDetails: nodeDetails});
  }
  deselectAll = (nodeKey) =>{//delete
    var nodeDetails = this.state.nodeDetails;
    for (var key in nodeDetails[nodeKey].attrDetails) {
        nodeDetails[nodeKey].attrDetails[key].isSelected = false;
    }
    this.setState({nodeDetails: nodeDetails});
  }
  build = (type, propID, attrDetails,preBuiltTree) =>{
    console.log('build>>>>>>>>',type);
    var selected = null;
    var treeData =
      {
        "name": "complex",
        "id": "complex",
        "children": []
      };
    if(!preBuiltTree  && type && (propID || attrDetails)){
        let nodeType =  type;
        treeData = {
            "name": nodeType,
            "id": nodeType,
            "children": [],
            "details":{}
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
    }

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#PathDSLBuilder");
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
      var fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
          fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
      var width = bounds.width,
          height = bounds.height;
      var midX = bounds.x + width / 2,
          midY = bounds.y + height / 2;
      if (width == 0 || height == 0) return; // nothing to fit
      var scale = Math.min((0.95 / Math.max(width / fullWidth, height / fullHeight)), 2);
      var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

      var transform = d3.zoomIdentity
          .translate(80, translate[1])
          .scale(scale);
     svg.transition().duration(350)
        .call(zoom_handler.transform, transform);

    }

    //Set Default zoom
    svg.call(zoom_handler)
    .call(zoom_handler.transform, d3.zoomIdentity.translate(80, -500).scale(2));
    this.setState({
            init: false,
        	svg: svg,
        	g: g,
        	treemap: treemap,
        	root: root,
        	duration: duration,
            zoomFit: zoomFit,
            dslQueryTree: treeData
        }, ()=>{this.update(this, root, true);})

    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d.children.forEach(collapse)
        d.children = null
      }
    }


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
  render(){   
    return(
        <div id='pathFilterDSLModel'>            
            <div className="addPadding">                
                <div className={'row ' + (!this.state.init ? 'show' : 'hidden')}>
                    <div className="checkbox" style={{float:'left',width:'70%'}}>
                        <label>
                            <input type="checkbox" checked={this.state.autoZoomEnabled} onChange={this.onAutoZoomCheckbox.bind(this)}/>
                            Auto Zoom Enabled
                        </label>
                    </div>
                    <div style={{float:'right'}}> 
                        <Button onClick={this.props.closePathNodeModal}>Close</Button>
                        <Button onClick={this.submitPathNodeModal} disabled={(this.state.dslQuery === '')}>Submit</Button> 
                    </div> 
                </div>
                <div className={'row ' + (!this.state.init ? 'show' : 'hidden')}>
                    <div style={{fontWeight:'bold'}}>
                        <span>DSL PATH Query :</span> {this.state.dslQuery}
                    </div>                                       
                </div>
                <div className={'row ' + ((this.state.dslQuery != '') ? 'hidden' : 'show')}>
                    <div style={{float:'left'}}>
                        <button className='btn btn-primary' type='button' onClick={this.initialLoadWhileClose}>Start Building (+)</button>
                    </div>
                    <div style={{float:'right'}}> 
                        <Button onClick={this.props.closePathNodeModal}>Close</Button>
                        <Button onClick={this.submitPathNodeModal} disabled={(this.state.dslQuery === '')}>Submit</Button> 
                    </div> 
                </div>                                
            </div>
            <svg id='PathDSLBuilder' width='1800' height='800'></svg>     
            <div className='static-modal' id='customDslPathBuilderModel'>
            		<Modal show={this.state.showNodeModal} onHide={this.closeNodeModal}>
            			<Modal.Header>
            				<Modal.Title>Modify Dsl Path Query</Modal.Title>
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
                                             <div className={'form-check ' + (this.state.init ? 'show' : 'hidden')}>
                                                <label className="form-check-label">
                                                  <input className="form-check-input" type="radio" value={key} checked={this.state.nodeDetails[key].isSelected} onChange={this.onNodeRadio.bind(this)} />
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
                                             <Grid fluid={true} className='addPaddingTop'>
                                                <Row className='show-grid addPaddingTop'>
                                                   <Col md={(this.state.enableRealTime)?4:6}>
                                                     <strong>PROPERTIES</strong>
                                                   </Col>
                                                   {this.state.enableRealTime && <Col md={4} className='removeLeftPadding'>
                                                     <strong>Filter Types</strong>
                                                   </Col>}
                                                   <Col md={(this.state.enableRealTime)?4:6} className='removeLeftPadding'>
                                                      <strong>Filter By (Optional)</strong>
                                                   </Col>
                                                </Row>
                                             {Object.keys(this.state.nodeDetails[key].attrDetails).sort().map((attrKey, attr) => {
                                                return(
                                                       <Row className='show-grid'>
                                                          <Col md={(this.state.enableRealTime)?4:6}>
                                                           <div className="checkbox">
                                                               <label>
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
                                         <Col md={(this.state.enableRealTime)?4:6}>
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
                                                <Col md={(this.state.enableRealTime)?4:6}>
                                                 <div className="checkbox">
                                                     <label>                                                      
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
                		</Modal.Body>
                		<Modal.Footer>
                			<Button onClick={this.closeEditNodeModal}>Close</Button>
                			<Button onClick={this.submitEditNodeModal}>Submit</Button>
                		</Modal.Footer>
                	</Modal>
                </div>                  
        </div>
	);
  }
}

export default PathFilterDslBuilder;
