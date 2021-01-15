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
import PanelGroup from 'react-bootstrap/lib/PanelGroup';
import Panel from 'react-bootstrap/lib/Panel';
import Modal from 'react-bootstrap/lib/Modal';
import Grid from 'react-bootstrap/lib/Grid';
import Button from 'react-bootstrap/lib/Button';
import ModelGallery from 'app/model/modelSearch/components/ModelGallery.jsx';
import Autosuggest from 'react-autosuggest';
import DatePicker from 'react-datepicker';
import moment from "moment";
import DslHints from 'app/assets/configuration/dsl_hints.json';
import DslDetailedHelp from 'app/assets/configuration/dsl_detailedHelp.json';
import {ExportExcel} from 'utils/ExportExcel.js';
import commonApi from 'utils/CommonAPIService.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import {GeneralCommonFunctions} from 'utils/GeneralCommonFunctions.js';
import Spinner from 'utils/SpinnerContainer.jsx';
import OutputToggle from 'generic-components/OutputToggle.jsx';
import Pagination from 'react-js-pagination';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OutputVisualization, {Visualization} from 'generic-components/OutputVisualization.jsx';
import ModelCard from 'app/model/modelSearch/components/ModelCard.jsx';
import CustomDSLSaveLoad from 'app/byoq/CustomDSLSaveLoad.jsx';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import InfoToggle from 'generic-components/InfoToggle.jsx';
import Alert from 'react-bootstrap/lib/Alert';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, {textFilter,customFilter} from 'react-bootstrap-table2-filter';
import FilterTypes from 'generic-components/filter/components/FilterTypes.jsx';
import DownloadRangeModel from 'generic-components/DownloadRangeModel.jsx';
import SelectFilter from 'generic-components/filter/components/SelectFilter.jsx';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

let PAGINATION_CONSTANT = GlobalExtConstants.PAGINATION_CONSTANT;
let EDGERULES = GlobalExtConstants.EDGERULES;
let OXM = GlobalExtConstants.OXM;
let INVLIST = GlobalExtConstants.INVLIST;
let generateExcels = ExportExcel.generateExcels;
let DOWNLOAD_ALL = GlobalExtConstants.DOWNLOAD_ALL;
let DOWNLOAD_TOOLTIP = GlobalExtConstants.DOWNLOAD_TOOLTIP;
let filterTypeList = GlobalExtConstants.FILTER_TYPES;
let TABULAR_FILTER_TYPE = GlobalExtConstants.TABULAR_FILTER_TYPE;
let ENVIRONMENT = GlobalExtConstants.ENVIRONMENT;
let EMAIL_EXT = GlobalExtConstants.EMAIL_EXT;
let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
let buildAttrList = ExportExcel.buildAttrList;

let dslHints = null;
let nodeTypes = [];
let properties = null;
let traverseRulesDsl = [];
let inputValue = '';
let testData = null;

var settings = {
	'NODESERVER': INVLIST.NODESERVER,
	'PROXY': INVLIST.PROXY,
  	'PREFIX': INVLIST.PREFIX,
  	'VERSION': INVLIST.VERSION,
	'USESTUBS': INVLIST.useStubs,
	'APERTURE': INVLIST.APERTURE,
	'TABULAR': INVLIST.TABULAR,
	'TABULARVERSION': INVLIST.TABULARVERSION
};
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
	  filterText = 'Enter ' + this.props.column.text;
	  return filterText;
	}
	filter = () => {
	  let txt=this.props.column.text;
	  let obj = {};
	  obj[txt] = this.getValue();
	  var columnFilter = this.props.columnFilter; 
	 for(var i=0;i<columnFilter.length;i++){
		if(columnFilter[i][txt] != undefined){
		  columnFilter[i][txt] = this.getValue();
		  this.props.handleOnFilter(columnFilter,this.getValue());
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
			  onChange={this.filter}
			/>
		  
		</div>
	  )
	}
  }
  
class CustomDsl extends Component {
	nodeResults = '';
	typeOfCall = true;
	downloadTooltip = DOWNLOAD_TOOLTIP;
	downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
	downloadRangeTooltip= 'Download Results By Custom Range Selection';
	downloadBulkTooltip= 'Download Results Of All Loaded Queries';
	historyStackString = '';
	dslObject={};
	dslObjectList=[];
	nodeTypeArray=[];
	nodeTypeArrayList=[];
	edgesArray=[];
	relationsArray=[];
	tempDslQuery='';
	tempDslQueryList=[];
	templateError=[];
	templateErrorList={};
	baseState='';
	propertiesDsl = [];
	tableFilterAliasColumns={};
	constructor(props) {
		console.log('CustomDsl:Constuctor props>>>>',props);
		super(props);
		APERTURE_SERVICE=JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
    console.log('APERTURE_SERVICE: ' + APERTURE_SERVICE);
			TABULAR_FILTER_TYPE=(APERTURE_SERVICE && JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'ENABLE_ANALYSIS')))?'CONTAINS':'=';
	    this.saveLoadComponent = React.createRef();
		this.saveLoadComponentDsl = React.createRef();
		this.state = {
			nodeTypes: [],
			hintHtml: {},
			header: null,
			multipleNodes: '',
			isLoading: false,
			nodes: [],
			simpleQueries: [],
			traversalQueries: [],
			unionQueries: [],
			negationQueries: [],
			topologyQueries: [],
			limitQueries: [],
      advancedQueries: [],
			showModal: false,
			query: '',
			value: '',
			valuePreviousState: '',
			suggestions: [],
			edgeRules: [],
			previousNodeTypeDsl: '',
			selected: [],
			nodeTypeDsl: '',
			model: null,
			showPagination: false,
			showResults: false,
			activePage: 1,
			aggregateActivePage: 1,
			totalResults: 0,
			errorResults: false,
			errorMessage: '',
			noResults: true,
			validInput: false,
			isInitialLoad: true,
			prevQuery : '',
			showHistoryModal:false,
			startDate: moment(),
            res: null,
            visualAddition: false,
            nodeDisplay: '',
            showNodeModal: false,
            focusedNode: {},
	    	historyType: 'dsl',
      		focusedNodeUri: 0,
			viewName: localStorage.getItem(GlobalExtConstants.ENVIRONMENT + '_' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId') + '_viewPreference')  || 'CardLayout',
			focusedNodeType: '',
			historyParams: '' , 
			showModelOptions:false,
			enableCalendar: true,
			resetColumnFilters: true,
			isPageNumberChange: false,
			loadedQueries: [],
			queryDescription: '',
			queryName: '',			
			category:'',
			saveSuccessfulMsg: false,
			saveErrorMsg: false,
			enableSaveBusyFeedback: false,
			isAggregate: false,
			isAggregatePreviousState: false,
			isAggregateChecked: false,
			isCommunitySharedPreviousState: false,
			isCommunitySharedChecked: false,
			associatedNodesEnabled: false,
			associatedNodesEnabledPreviuosState: false,
			aggregatePaths: [],
			aggregatePathAttrs: [],
			aggregateParentGroup: [],
			aggregateObjects: [],
			tabularAggregateColumns: [],
			tabularAggregateData: [],
			aggregateAttrList: [],
			aggregateNodes: [],
			allAggregateNodes: [],
			allres: null,
			allAggregatePaths: [],
			allAggregatePathAttrs: [],
			allAggregateObjects: [],
			allAggregateParentGroup: [],
			allTabularAggregateColumns: [],
			allTabularAggregateData: [],
			allAggregateAttrList: [],
			reRender: false,
			columnFilter: [],
			filterTemplateEntries: [],
			filterTemplateHeader: [],
			filterTemplateError: false,
			filterTemplateEntriesList:[],
	  		filterTemplateHeaderList:[],
			filterTemplateErrorList:[],
			nodeTypeOfDslTemplateList:[],
			valueList:[],
			templateQueryList:[],
            editModel: {},
            showEditModal: false,
            templateQuery: '',
            isDSLFlow: props.viewName === 'BYOQ',
			isSavedQueryFlow: props.viewName === 'Saved Queries',
			filterTypeDisplay: {'default':'Filter Type'},
			filterTypeDisplayList: [],
			disableFilter: true,
			totalPages: 0,
			pageRange: 1,
			showDownloadResultsModal: false,
			errorDownloadResults:false,
			downloadErrorMsg: '',      
			enableModelBusyFeedback:false,
			downloadCount:DOWNLOAD_ALL,
			addAndTemplateState:false,
			nodeTypeOfDslTemplate:[],
			filterDisplay:'Select Property',
			queryId:'',
			queryNameList: [],
			queryDescriptionList: [],
			categoryList: [],
			isPublicCheckedList: [],
			isCommunitySharedList: [],
			queryIdList: [],
			isAggregateCheckedList:[],
			associatedNodesEnabledList: [],
			associatedNodesEnabledPreviuosStateList: [],
			enableTreeLoadBusyFeedback: false,
            treeLoadErrMsg: null,
			isDataSteward: sessionStorage.getItem(ENVIRONMENT + 'roles') && sessionStorage.getItem(ENVIRONMENT + 'roles').indexOf('data_steward_ui_view') > -1,
			isPublicChecked: sessionStorage.getItem(ENVIRONMENT + 'roles') && sessionStorage.getItem(ENVIRONMENT + 'roles').indexOf('data_steward_ui_view') > -1,
			defaultViewName: localStorage.getItem(GlobalExtConstants.ENVIRONMENT + '_' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId') + '_viewPreference')  || 'CardLayout',
      		isTypeahead: true,
			enableRealTime: JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'ENABLE_ANALYSIS')),
			downloadTemplateStatus:false,
			failedDownloadedTemplate:[],
			failedDownloadedTemplateMsg:'',
			failedEmailTemplateMsg:'',
			isMergedTabsChecked:false,
			isGenerateEmailChecked: false,
			emailTriggerMsg:'',
			dslConfigArray: [],
			staticTemplateFilters: [],
            staticTemplateFiltersList: [],
	    tableAggregateAliasColumns:{}
		}
	}
  componentWillMount = () => {
    console.log('CustomDsl:componentWillMount',JSON.stringify(this.props));
	if(!this.props.location.historyStackString){
		this.props.location.historyStackString = this.props.location.pathname + ',,Origin||';
	}else{
		this.historyStackString = this.props.location.historyStackString;
	}
	dslHints = Object.values(DslHints);
	this.setState( {hintHtml: dslHints});
	this.processHelp( DslDetailedHelp );
	console.log('how many nodes? ' + this.state.nodes.length);
	this.processEdgeRules(EDGERULES);
	nodeTypes = this.buildNodeList();		
	this.setState({
		nodeTypes: nodeTypes},
		function () {
			console.log('nodeTypes: ' + this.state.nodeTypes.length) ;
			this.baseState=this.state;
			this.buildDynamicByoq('','','init');
		}
	);	
		
 }
 buildDynamicByoq=(queryParam, makeCall, loadType)=> {
    let query = '';
    let shouldRun = makeCall;
    if(queryParam){
       query = queryParam;
    }else if(this.props.match.params.type === 'built' || this.props.match.params.type === 'built-aggregate'){
       query = atob(this.props.match.params.propId).replace('<pre>','').replace('</pre>','');
       shouldRun = true;
    }else{
        shouldRun = true;
		let nodeType =  (this.props.match.params.type) ? this.props.match.params.type : '';
		let propIds = (this.props.match.params.propId) ? this.props.match.params.propId.split(';') : '';
		let propertyValue = '';
		for(var i  in propIds){
			let propValue = propIds[i].split(':');
			console.log(propValue[0] + '....' + propValue[1]);
			let atobPropValue = atob(propValue[1]).replace('<pre>','').replace('</pre>','');
			if(propertyValue == ''){
				propertyValue ='(\'' + propValue[0] +'\',\''+ atobPropValue + '\')';
			}else{
				propertyValue = propertyValue + '(\'' + propValue[0] +'\',\''+ atobPropValue + '\')';
			}			
		}
		console.log('propertyValue>>>>>',propertyValue);
	    let relArray = (this.props.match.params.relArray) ? this.props.match.params.relArray.split('&') : '';
	    let relativeStr = '';
	    let str = '';
	    if(relArray.length>0){
	    	for(var n in relArray){
	    		relativeStr = relativeStr + relArray[n] + '*'
	    	}
	    	str = relativeStr.replace(/\*/g, '*,').slice(0, -1);
	    }
	    let relativeAttachStr = (str === '') ? '' : '>[' + str + ']';
	    //encPropValue = (nodeType === '') ? '': atob(propValue[1]);
		query = (nodeType === '') ? '' : nodeType + '*' + propertyValue + relativeAttachStr;
		if(loadType ==='init'){
			console.log('this.baseState>>>>>',this.baseState)
			this.baseState.value=query;
		}		
	}
	console.log('query>>>',query);
	console.log('this.props.match.params.type>>>',this.props.match.params.type);
	if(query != ''){
		this.nodeResults = '';
		this.typeOfCall = true;
		let isInitialLoad = this.state.isInitialLoad;
		this.setState( {value: query,validInput: true,isInitialLoad: false},() => { if(shouldRun){this.formQueryString(false, isInitialLoad,false)}});
	} 
}
  getNodeTypes = () =>{
    var result = JSON.parse(OXM);
    var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
    var nodeTypeArray = [];
    for(var j = 0; j < arrayOfTypes.length; j++){
        if(arrayOfTypes[j]['xml-root-element'] && arrayOfTypes[j]['xml-root-element'][0]
            && arrayOfTypes[j]['xml-root-element'][0]['$'] && arrayOfTypes[j]['xml-root-element'][0]['$']['name']){
            nodeTypeArray.push((arrayOfTypes[j]['xml-root-element'][0]['$']['name']).toLowerCase());
        }
    }
    return nodeTypeArray;
  }

  getNodeTypeFromURI = (uri) => {
    var nodeTypeArray = this.getNodeTypes();
    var tokenizedUri = uri.split("/");
    var nodeType = "";
    var found = false;
    for (var i = tokenizedUri.length - 1; i >= 0 && !found; i--){
        if(nodeTypeArray.indexOf(tokenizedUri[i]) > -1){
            nodeType = tokenizedUri[i];
            found = true;
        }
    }
    return nodeType;
  }

  getAttributesFromNodeType = (nt) => {
    var result = JSON.parse(OXM);
    var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
    var foundIndex = -1;
    var attributesArray = [];
    var nodeType = nt.replace(/-/g,'');
  	for (var i = 0; i < arrayOfTypes.length && foundIndex === -1; i++) {
  		if(arrayOfTypes[i]['$'] && arrayOfTypes[i]['$']['name'] && arrayOfTypes[i]['$']['name'].toLowerCase() === nodeType){
  		    foundIndex = i;
  		}
  	}
    for (var j = 0; j < arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'].length; j++) {
    	let property =  arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name'];
    	let type = arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['type'];
    	if (type === 'java.lang.String' || type === 'java.lang.Boolean') {
    	    attributesArray.push(property);
    	}
    }
    return attributesArray;
  }
 
  getAttributesFromPath = (path,tableAggregateAliasColumns) => {
     var nodeParseArray = path.split('>');
    console.log(nodeParseArray);
    var attributeArray = [];
    var aggregatePaths = this.state.aggregatePathAttrs;
    if(!this.typeOfCall){
        aggregatePaths = this.state.allAggregatePathAttrs;
    }
    for(var i = 0; i < nodeParseArray.length; i++){
		var nodeKey = nodeParseArray[i].trim();	
		let tableColumnsBuilt = ExportExcel.buildAttrList(nodeKey,[],'required');
        for(var j = 0; j <  aggregatePaths[nodeKey].length; j++){
			let desc=tableColumnsBuilt.map((a) => 
			{
				if(a.value.toLowerCase()==aggregatePaths[nodeKey][j].toLowerCase())
				  return a.description;
				else
				  return '';
			}).filter(function (el) {
				return el != '';
			});
			if(desc.length===0){
				desc.push('');
			}
			if(Object.keys(tableAggregateAliasColumns).length !== 0 && tableAggregateAliasColumns[nodeKey] && tableAggregateAliasColumns[nodeKey][0][aggregatePaths[nodeKey][j]]){
				attributeArray.push(nodeKey + '|' + tableAggregateAliasColumns[nodeKey][0][aggregatePaths[nodeKey][j]] +'|'+ desc[0]);
			}else{
				attributeArray.push(nodeKey + '|' + aggregatePaths[nodeKey][j] + '|' + desc[0]);
			}
        }
    }
    return attributeArray;
  }

  buildNodeList = () => {
		var result = JSON.parse(OXM);
		var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
		let nodeList = [];

		for (var i = 0; i < arrayOfTypes.length; i++) {
			var hasProperties = false;
			if (arrayOfTypes[i]['java-attributes']) {
			    let elementLength = 0;
			    if (arrayOfTypes[i]['java-attributes'][0]['xml-element']) {
			    	elementLength = arrayOfTypes[i]['java-attributes'][0]['xml-element'].length;
			    }
			    for (var j = 0; j < elementLength; j++) {
			    	let property = JSON.stringify(arrayOfTypes[i]['java-attributes'][0]['xml-element'][j]['xml-properties']);
			    	if (property) { //add to the list
			    	hasProperties = true;
			    	}
			    }
			    if (hasProperties) {
			    	let node = arrayOfTypes[i]['xml-root-element'][0]['$']['name'];
			    	nodeList.push(node);
			    }
			}
		}
		nodeList.sort();
		return nodeList;
  }

  processHelp(data) {
		//console.log('Data' + JSON.stringify(data));
		this.setState( {simpleQueries: data.simple } );
		console.log('Value' + JSON.stringify(this.state.simpleQueries));
		this.setState( {traversalQueries: data.traversal} );
		this.setState( {unionQueries: data.union} );
		this.setState( {negationQueries: data.negation} );
		this.setState( {topologyQueries: data.topology} );
		this.setState( {limitQueries: data.limit} );
    this.setState( {advancedQueries: data.advanced} );
  }

  processEdgeRules = (data) => {
		var ruleArr = [];
		this.setState({
			edgeRules: data.rules
		});
		ruleArr = data.rules;
		// console.log("Rule"+JSON.stringify(ruleArr));
		// new = data.Rules;
  }

  hint = () => { // open modal
    console.log('hint >> showModal');
    this.setState({
		  showModal:true
    });
    this.hints = this.state.html;
  }

  onAddItem = (event) => {
	  event.preventDefault();
	  GeneralCommonFunctions.scrollTo("outputBlock");
      this.nodeResults = '';
      this.typeOfCall = true;
      this.setState({ viewName: this.state.defaultViewName, aggregateActivePage: 1, activePage: 1, nodes: [], aggregateNodes: [],errorResults:false},function () { this.formQueryString(false,false,false); }.bind(this));
  };

  formQueryString = (bypassCall, isInitialLoad, aggregateForGraph) =>{
		console.log('formQueryString>>>>>>this.state.value :',this.state.value);
		var DSLQuery = this.state.value;
		DSLQuery.trim();
		console.log('DSLQuery.trim().length: ' + DSLQuery.trim().length);
		let resp = '';
		if (DSLQuery.trim() !== '' || (this.props.match.params.type && DSLQuery.trim() !== '')){
			console.log('validInput.DSLQuery: ' + DSLQuery);
			this.setState({
			    validInput: true,isInitialLoad: isInitialLoad
			});
			const payload = {dsl: DSLQuery};
			let format = 'simple';
			if((this.state.isAggregateChecked || (isInitialLoad && this.props.match.params.type === 'built-aggregate')) && !aggregateForGraph){
			    format = 'aggregate';
			    this.setState({isAggregateChecked: true});
			}
			let queryStr = '';
			if(this.typeOfCall){
			    if(format === 'aggregate' || aggregateForGraph){
			        this.setState({isAggregate: true});
			        queryStr = 'dsl?format=' + format + '&resultIndex=' + this.state.aggregateActivePage + '&resultSize=' + PAGINATION_CONSTANT.RESULTS_PER_PAGE;
			    }else{
			        this.setState({isAggregate: false});
			        queryStr = 'dsl?format=' + format + '&resultIndex='
                			                + this.state.activePage + '&resultSize=' + PAGINATION_CONSTANT.RESULTS_PER_PAGE;
			    }
			}else{
				let pagerange=this.state.pageRange.toString();
				pagerange=pagerange.split('-');
				if(pagerange.length > 1){
					queryStr = 'dsl?format=' + format + '&resultIndex='+ parseInt(pagerange[0]) +'&resultSize=' + PAGINATION_CONSTANT.RESULTS_PER_PAGE + '&resultRangeEnd=' + parseInt(pagerange[1]);
				}else{					
					queryStr = 'dsl?format=' + format + '&resultIndex='+ 1 +'&resultSize=' + parseInt(pagerange);
				} 
				
			}
			const path = queryStr;
			this.state.header = DSLQuery;
			console.log('DSLQuery: ' + DSLQuery);
			console.log('payload: ' + JSON.stringify(payload));
			console.log('path: ' + path);
			if(aggregateForGraph){
			     this.setState({isLoading: true, prevQuery:DSLQuery});
			} else if(this.typeOfCall){
					if(this.state.prevQuery !== DSLQuery){
			            this.setState({isLoading: true,
			            	totalResults: 0,
			            	prevQuery:DSLQuery
			            });
					}else{
			            this.setState({isLoading: true, nodes: [], aggregateNodes: [], prevQuery:DSLQuery});
			        }
			}
			if(!bypassCall){
				resp = this.getNodes(settings, path, payload, aggregateForGraph);
			}
		}else { // write a msg
			console.log('validInput: ' + false);
			this.setState({
				validInput: false,
				isInitialLoad: isInitialLoad
			});
			GeneralCommonFunctions.scrollTo('dslInputError');
		}
		console.log('Response: ' + resp);
  }

  onSuggestionSelected = (event, { suggestion }) => {
		event.preventDefault();

		let item = suggestion;
		console.log('onSuggestionSelected.item: ' + item);
		console.log('onSuggestionSelected.inputValue: ' + inputValue);

		this.setState({
			selected: [...this.state.selected, item],
				value: inputValue + item
			},
			function () {
			console.log('onSuggestionSelected.selected: ' + this.state.selected);
			console.log('onSuggestionSelected.value: ' + this.state.value);
		});
		//if (!item.includes('(')) {
	  if (item.indexOf('(') === -1) { // not found
			this.setState({previousNodeTypeDsl: item},
				function () {
					this.setState({
					nodeTypeDsl: item
					});
					console.log('onSuggestionSelected.previousNodeTypeDsl: ' + this.state.previousNodeTypeDsl);
					console.log('onSuggestionSelected.nodeTypeDsl: ' + this.state.nodeTypeDsl);
				}
			);
		}
  }

  storeInputReference = autosuggest => {
		if (autosuggest !== null) {
			this.input = autosuggest.input;
		}
  };

  clear = () => {
		this.setState({
			value: '',
			previousNodeTypeDsl: '',
            header: ''
		});
  }

  openSaveModal = () =>{
        this.setState({
        	showSaveModal: true,
        	saveSuccessfulMsg: false,
        	treeLoadErrMsg: false,
        	isPublicChecked:this.state.isDataSteward,
        	isCommunitySharedChecked: false,
            isEditModal:false,
            enableTreeLoadBusyFeedback: true,
            dslConfigurableFiltersArray: []
        });
        this.getTreeFromDSL(this.state.value).then(tree => {
             this.setState({enableTreeLoadBusyFeedback: false, dslConfigArray: this.getConfigArrayFromDSLTree(tree, [], [])});
        });
  };

  handleTypeaheadChange = (event) =>{
    this.setState({isTypeahead: event.target.checked});
  }

  closeSaveModal = () =>{
  	//Set previous loaded state
	  if(this.state.isEditModal){
		  this.setState({
			  value: this.state.valuePreviousState,
			  isAggregateChecked: this.state.isAggregateCheckedPreviousState,
			  isCommunitySharedChecked: this.state.isCommunitySharedCheckedPreviousState,
			  associatedNodesEnabled: this.state.associatedNodesEnabledPreviousState,
			  enableTreeLoadBusyFeedback: false
		  });
	  }

	  this.setState({
		  showSaveModal: false,
		  queryDescription: '',
		  queryName: '',		  
		  category:'',
		  enableSaveBusyFeedback: false,
		  showQueryExistsWarning: false,
		  saveFailureMsg: false,
		  isEditModal:false
	  });
  };

  submitSave = (bypassDupeCheck) =>{
	let existQueryName=false;
	let queryId='';
	Object.keys(this.state.loadedQueries).map((key) =>{
		if(this.state.loadedQueries[key].name === this.state.queryName){
			existQueryName=true;
			if(this.state.showQueryExistsWarning){
				queryId=key;
			}			
		}
	});
    if(!bypassDupeCheck && existQueryName){
        this.setState({showQueryExistsWarning:true});
    }else{
        var aggregateString = "false";
        if(this.state.isAggregateChecked){
            aggregateString = "true";
		}
		var queryParam=(this.state.queryId==='')?queryId:this.state.queryId;
        var body =  {
                      "cols": [
                          {
                              "name": "query_name",
                              "value": this.state.queryName
                          },
                          {
                              "name": "creator",
                              "value": sessionStorage.getItem(ENVIRONMENT + 'userId')
                          },
                          {
                              "name": "description",
                              "value": this.state.queryDescription
                          },
                          {
                              "name": "is_aggregate",
                              "value": aggregateString
                          },
                          {
                              "name": "community_shared",
                              "value": "" + this.state.isCommunitySharedChecked
                          },
                          {
                              "name": "is_public",
                              "value": "" + this.state.isPublicChecked
                          },
                          {
                              "name": "template_details",
                              "value": JSON.stringify(this.state.staticTemplateFilters)
                          },
                          {
                              "name": "dsl",
                              "value": btoa('<pre>' + this.state.value + '</pre>')
						  }						  
                      ]
		}
		if(this.state.category && this.state.category !=''){
			let catObj={"name": "category","value": this.state.category}
			body['cols'].push(catObj);
		}
		let localVersion='';
		if(this.state.showQueryExistsWarning){
			if(bypassDupeCheck && this.state.loadedQueries[queryParam] && this.state.loadedQueries[queryParam].version ){
				localVersion = this.state.loadedQueries[queryParam].version;;
				body.version = localVersion;

			}
		}else{
			if(bypassDupeCheck && this.state.loadedQueries[this.state.queryId] && this.state.loadedQueries[this.state.queryId].version ){
				localVersion = this.state.loadedQueries[this.state.queryId].version;;
				body.version = localVersion;
			}
		}
        
		this.setState({showQueryExistsWarning:false, enableSaveBusyFeedback:true});
		settings['ISTABULAR'] = true;
		let localQuery='queries';
		let localHeader=null; 
		if(queryParam !==''){
			localQuery += '/'+encodeURIComponent(queryParam);
			localHeader= [{
				"name":"If-Match",
				"value": localVersion
			 }];
		}
		commonApi(settings, localQuery, 'PUT', body, 'BYOQSaveInfo', GlobalExtConstants.OVERRIDE_DOMAIN,null,localHeader)
               		.then(res => {
               			console.log('res:' + res.data);
               			if(res.status === 201){
               			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201)){
               			        this.triggerSaveError(res.data);
               			    }else{
								if(this.state.isEditModal && this.state.isDSLFlow){
									this.setState({
										value: this.state.valuePreviousState,
										isAggregateChecked: this.state.isAggregateCheckedPreviousState,
										isCommunitySharedChecked: this.state.isCommunitySharedCheckedPreviousState,
										associatedNodesEnabled: this.state.associatedNodesEnabledPreviousState,
									});
								}

								let jumpToId = "saveSuccess";
								if (this.state.isSavedQueryFlow && this.state.isEditModal){
									jumpToId = "saveSuccessEdit";
								}
								else if(this.state.isSavedQueryFlow && !this.state.isEditModal){
									jumpToId = "saveSuccessTemplate";
								}

								this.setState({
									saveSuccessfulMsg: "The following query was successfully saved: " + this.state.queryName,
									showSaveModal: false,
									enableSaveBusyFeedback:false,
								});

								GeneralCommonFunctions.scrollTo(jumpToId);
								if(this.state.isSavedQueryFlow){
									this.saveLoadComponent.current.getQueries();
								}else {
									this.saveLoadComponentDsl.current.getQueries();
								}
                               }
                           }else{
                             this.triggerSaveError(res.data);
                           }
               		}, error=>{
               		    this.triggerSaveError(error.response.data);
               		}).catch(error => {
               		    this.triggerSaveError(error);
        });
    }
  };

  triggerSaveError = (error) => {
      console.error('[CustomDsl.jsx] error : ', JSON.stringify(error));
    	let errMsg = '';
    	if(error.status && error.message){
    	    errMsg += "Error Occurred: " + error.status + ' - ' +error.message;
    	}else{
    	    errMsg += "Error Occurred: " + JSON.stringify(error);
    	}
    	console.log(errMsg);
        this.setState({saveFailureMsg: errMsg + " - Failed to save query : " + this.state.queryName, enableSaveBusyFeedback:false});
        GeneralCommonFunctions.scrollTo("saveFailure");
    }

  handleQueryDescriptionChange =  (e) => {
     this.setState({queryDescription: e.target.value});
  };
  handleQueryNameChange = (e) => {
     this.setState({queryName: e.target.value});
  };
  handleQueryChange = (e) => {
  	this.setState({value: e.target.value});
  };
  handleCategoryChange = (e) =>{
	this.setState({category: e.target.value});
  };

  setQueriesState = (savedQueries) =>{
    this.setState({
    	loadedQueries: savedQueries
    });
  };

  getNodes(settings, path, payload, graphCall) {
		this.setState({isLoading: true});
		settings['ISTABULAR'] = false;
		if(this.state.enableRealTime && APERTURE_SERVICE){
			settings['ISAPERTURE'] = this.state.enableRealTime;
		}else{
			Object.keys(settings).forEach((key)=>{
				if(key==='ISAPERTURE'){
					delete settings[key];
				}
			})
		}
		console.dir('CustomDSL:settings:' + JSON.stringify(settings));
		console.log('CustomDSL:path:' + path);
		console.dir('CustomDSL:payload:' + JSON.stringify(payload));
		commonApi(settings, path, 'PUT', payload, 'BYOQDefault', null, null, [{
                                                                                "name":"X-DslApiVersion",
                                                                                "value": "V2"
                                                                              }])
		.then(res => {
			console.log('CustomDSL: Response',Object.keys(res.data));
				if(!graphCall && this.typeOfCall){
					this.setState({aggregatePaths: [],
								aggregateParentGroup: [],
								aggregateObjects: []});
				}
				if(this.state.isAggregate){
					if(graphCall){
						if(res.data.results.length > 0 && this.state.visualAddition){
							Visualization.chart('currentStateAggregate', [], [], res.data, this);
							this.setState({isLoading: false, nodes: res.data.results, res: res});
						}
					}else{
						this.processAggregateData(res);
					}
				}else{
					this.processData(res);
					if(this.state.nodes.length > 0 && this.state.visualAddition){
						Visualization.chart('currentState', [], [], this.state.res.data, this);
					}
				}
			}, error=>{
				if(this.typeOfCall){
					this.triggerError(error);
				}else{
					let errMsg = this.renderErrorMsg(error);
					this.setState({ isLoading: false,errorDownloadResults:true,downloadErrorMsg:errMsg,enableModelBusyFeedback:false});       
     				}				
			}).catch(error => {
				if(this.typeOfCall){
					this.triggerError(error);
				}else{
					let errMsg = this.renderErrorMsg(error);
					this.setState({ isLoading: false,errorDownloadResults:true,downloadErrorMsg:errMsg,enableModelBusyFeedback:false});       
     			}
	  });
		//this.input.focus();
  }

  triggerError = (error) => {
    console.error('[CustomDsl.jsx] triggerError error : ', JSON.stringify(error));
  	//this.processData('');
  	this.setState({isLoading: false,
  		totalResults: 0,
		showPagination: false,
		showResults: false,
		isInitialLoad: false,
		noResults: true,
		errorResults: true			  
  	  });
  	this.downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
	let errMsg = this.renderErrorMsg(error);
	this.setState({errorMessage:errMsg});
	console.log(error.config);
	this.input.focus();
  }
  renderErrorMsg = (error) =>{
	let errMsg='';
  	if (error.response) {
  		// The request was made and the server responded with a status code
  		// that falls out of the range of 2xx
  		console.log('[CustomDsl.jsx] error :', error.response);
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
   return errMsg;
  }
  formAliasFilterPropertes = ()  =>{
	let tableAggregateAliasColumns={};
	this.tableFilterAliasColumns={};
	let dslQuery = this.state.value;
	var limitPattern = /limit[\s]\d+|limit\d+/ig
	var limitkey = dslQuery.match(limitPattern);
	if(limitkey){
		dslQuery = dslQuery.replace(limitkey[limitkey.length-1],'').trim();
	}
	dslQuery = this.alterDslQueryByRemoveSpaces(dslQuery);
	//New adding
	this.dslObject={};
	this.nodeTypeArray=[];
	//create placeholders for NodeTypes with Propand Propvalues
	this.tempDslQuery=this.formTempDslQuery(dslQuery);
	//Preparing Json Object to render into Placeholder		
	this.contructDslNodes(dslQuery,'node',false,false,false,false);
	;
	let aliasRegex=/\'(\s)as(\s)\'|\'as\'/ig;
	Object.keys(this.dslObject).map((nodekey)=>{
		let nodeprops=this.dslObject[nodekey][0]['props'];
		if(nodeprops){
			let nodeTypeProp = nodeprops[0].slice(1,-1).split(',');
			let objAlias = {};
			let filterObjAlias={};
			for(var s=0;s<nodeTypeProp.length;s++){
				let nodeTypePropes=nodeTypeProp[s].match(aliasRegex);
				let alias='';
				let nprop='';
				if(nodeTypePropes){
					let nodeTypeSplit=nodeTypeProp[s].split(aliasRegex);
					nprop=nodeTypeSplit[0].replace(/\'/g,'');                  
					alias=nodeTypeSplit[nodeTypeSplit.length-1].replace(/\'/g,'');
					objAlias[nprop]=alias;
					filterObjAlias[alias]=nprop;
				}
			}
			let nodeNo=parseInt(nodekey.substr(nodekey.length-2,nodekey.length-1).replace(/\-/g,''));
			let keyact=isNaN(nodeNo);
			let actKey=nodekey.split('-');
			if(!keyact){
				actKey.splice(actKey.length-1,1);
				nodekey=actKey.join('-')+nodeNo;
			}		
			if(!tableAggregateAliasColumns[nodekey]){   
				tableAggregateAliasColumns[nodekey]=[]; 
				tableAggregateAliasColumns[nodekey].push(objAlias);      
			
			} 
			if(!this.tableFilterAliasColumns[nodekey]){   
				this.tableFilterAliasColumns[nodekey]=[]; 
				this.tableFilterAliasColumns[nodekey].push(filterObjAlias);		  
			}
		}		
	});
	return tableAggregateAliasColumns;
  }
  processAggregateData = (resp) =>{
        console.log('CustomDSL:processAggregateData Response data: ' + JSON.stringify(resp.data));
	var downloadCount = DOWNLOAD_ALL;
        var uniqueNodePaths = [];
        var uniqueNodeAttributes = [];
        var groupingByStart = [];
		var aggregateObjectArray = [];
		if (resp.data && resp.data.results) {
			for(var i = 0; i < resp.data.results.length; i++){
				var fullPath = "";
				var nodePath = "";
				var nodeTypesForPath = [];
				var startNodeKey = "";
				var aggregateObject = {};
				//Make sure everything is in an array, so pushing single element into the array
				if(!Array.isArray(resp.data.results[i])){
					var tempObj = Object.assign({}, resp.data.results[i]);
					resp.data.results[i] = [];
					resp.data.results[i].push(tempObj);
				}
				for(var j = 0; j < resp.data.results[i].length; j++){
					var objectIndex = 0;
					for(var key in resp.data.results[i][j]){
						var nodeType = this.getNodeTypeFromURI(key);
						if (objectIndex === 0){
							startNodeKey = key;
						}
						objectIndex++;
						var nodeTypeLabel = '';
						if(nodeTypesForPath[nodeType] >= 1){
							nodeTypeLabel = nodeType + nodeTypesForPath[nodeType];
							nodeTypesForPath[nodeType] = nodeTypesForPath[nodeType]++;
						}else if (nodeTypesForPath[nodeType] === 0){
							nodeTypeLabel = nodeType + 1;
							nodeTypesForPath[nodeType] = 1;
						}else{
							nodeTypeLabel = nodeType;
							nodeTypesForPath[nodeType] = 0;
						}
						if(!uniqueNodeAttributes[nodeTypeLabel]){
						    uniqueNodeAttributes[nodeTypeLabel] = [];
						}
						for(var propKey in resp.data.results[i][j][key].properties){
						    if(uniqueNodeAttributes[nodeTypeLabel].indexOf(propKey) === -1){
						        uniqueNodeAttributes[nodeTypeLabel].push(propKey);
						    }
							Object.defineProperty(resp.data.results[i][j][key].properties, nodeTypeLabel + '|' + propKey, Object.getOwnPropertyDescriptor(resp.data.results[i][j][key].properties, propKey));
							delete resp.data.results[i][j][key].properties[propKey];
						}
						fullPath += key + ' > ';
						nodePath += nodeTypeLabel + ' > ';
					}
					aggregateObject = Object.assign({}, aggregateObject, resp.data.results[i][j][startNodeKey].properties);
				}
				nodePath =  nodePath.substring(0, nodePath.length - 3);
				if(!aggregateObjectArray[nodePath]){
					aggregateObjectArray[nodePath] = [];
				}
				aggregateObjectArray[nodePath].push(aggregateObject);
				resp.data.results[i].fullPath = fullPath.substring(0, fullPath.length - 3);
				resp.data.results[i].nodePath = nodePath;
				if(!groupingByStart[startNodeKey]){
					groupingByStart[startNodeKey] = [];
					groupingByStart[startNodeKey].push(resp.data.results[i]);
				}else{
					groupingByStart[startNodeKey].push(resp.data.results[i]);
				}
				if(uniqueNodePaths.indexOf(resp.data.results[i].nodePath) === -1){
					uniqueNodePaths.push(resp.data.results[i].nodePath);
				}
				console.log('Grouping by Start: ' + JSON.stringify(groupingByStart));
				console.log('Unique Paths: ' + JSON.stringify(uniqueNodePaths));
			}
			if(this.typeOfCall){
				let totalResults = (resp.headers) ? parseInt(resp.headers['total-results']) : 0;
				console.log('totalResults>>>>>>>>>>>>>>>>>>>>>',totalResults);				
				if(totalResults > DOWNLOAD_ALL){
					this.downloadAllTooltip = DOWNLOAD_ALL + ' results out of '+ totalResults +' results will be downloaded, Please filter results further to obtain full report';
				}else{
					this.downloadAllTooltip = (totalResults === 1) ?'Downloads ' + totalResults + ' Results' : 'Downloads all ' + totalResults + ' Results' ;
					downloadCount= totalResults;
				}       
				this.setState({
					aggregateNodes: resp.data.results,
					res: resp,
					aggregatePaths: uniqueNodePaths,
					aggregatePathAttrs: uniqueNodeAttributes,
					aggregateObjects: aggregateObjectArray,
					aggregateParentGroup: groupingByStart,
					isLoading: false,
					totalResults: totalResults,
					showResults: totalResults > 0 ? true : false,
					showPagination: totalResults > 0 ? true : false,
					isInitialLoad: false,
					noResults: totalResults > 0 ? false : true,
					errorResults: false,
					downloadCount: downloadCount,
				},function(){this.formatAggregateIntoTabular();});
				this.multipleNodes = this.state.aggregateNodes.length > 1;
				//this.setState({ viewName: "CardLayout" }); commented not to defaulting to CardView 
			}else{
				console.log('else condition>>>>');			
				if(resp.data && resp.data.results) {			
					this.nodeResults = resp.data.results;
					let totalResults = 0;
					let totalPages = 0;
					totalResults = parseInt(resp.headers['total-results']);
					totalPages = parseInt(resp.headers['total-pages']);
					this.setState({
						allAggregateNodes: resp.data.results,
						allres: resp,
						allAggregatePathAttrs: uniqueNodeAttributes,
						allAggregatePaths: uniqueNodePaths,
						allAggregateObjects: aggregateObjectArray,
						allAggregateParentGroup: groupingByStart,
						totalPages:totalPages,
						totalResults:totalResults,
						errorDownloadResults:false,
						downloadErrorMsg:''				
					},function(){this.formatAggregateIntoTabular();});
				}else{
					this.downloadAllTooltip = 'Downloads First ' + DOWNLOAD_ALL + ' Results';
				}
				this.setState({isLoading: false});
		  	}
		}
		GeneralCommonFunctions.scrollTo("outputBlock");
  }

  formatAggregateIntoTabular = () =>{
    let tableColumnsList = [];
    let tableDataList = [];
	let columnFilter = [];
	var aggregatePaths = [];
	var aggregateObjects = [];
	let tableAggregateAliasColumns=this.formAliasFilterPropertes();
	
	if(this.typeOfCall){
	    aggregatePaths = this.state.aggregatePaths;
	    aggregateObjects = this.state.aggregateObjects;
	}else{
	    aggregatePaths = this.state.allAggregatePaths;
	    aggregateObjects = this.state.allAggregateObjects;
	}
	for(var p = 0; p < aggregatePaths.length; p++){
		var types = [aggregatePaths[p]];
		var type = types[0];
		var attributeList = this.getAttributesFromPath(type,tableAggregateAliasColumns);
		var downloadAllCalled = false;
		tableColumnsList[type] = [];
		tableColumnsList[type].push({dataField: 'id', text: 'id', hidden: true });
		tableDataList[type] = aggregateObjects[type];
		for(var attrIndex = 0; attrIndex < attributeList.length; attrIndex++){
			let col=attributeList[attrIndex].split('|').splice(0,2).join('|');
			let desc=attributeList[attrIndex].split('|')[2];
			if(!columnFilter[attrIndex] || (columnFilter[attrIndex] && columnFilter[attrIndex][attributeList[attrIndex]] === undefined)){
				let obj = {};				
				obj[col] = '';
				obj['description']=desc
				columnFilter.push(obj);
			}
			  if(!this.typeOfCall){
				tableColumnsList[type].push({name: col,
					dataField: col, 
					text: col, 
					hidden: false,
					headerAttrs: {title:desc},				
					filter: textFilter({getFilter: (f) => { this.setState({filterEnable: true})}})
				});
			  }else{
			    tableColumnsList[type].push({name: col,
                   	dataField: col,
                   	text: col,
					hidden: false,
					headerAttrs: { title:desc},	
                   	filter : customFilter(),
                   	filterRenderer : (onFilter, column) => <AttributeFilter handleOnFilter= {this.handleOnFilter} onFilter={ onFilter } column={ column } isPageChange={this.state.isPageNumberChange} nodeType={type} columnFilter={columnFilter}/>
                     });
			  }
		}
		if(this.typeOfCall){
            this.setState({tabularAggregateColumns: tableColumnsList, tabularAggregateData: tableDataList, aggregateAttrList: attributeList,tableAggregateAliasColumns:tableAggregateAliasColumns});
        }else{
            this.setState({allTabularAggregateColumns: tableColumnsList, allTabularAggregateData: tableDataList, allAggregateAttrList: attributeList,tableAggregateAliasColumns:tableAggregateAliasColumns}, function(){if(!downloadAllCalled){downloadAllCalled = true;this.downloadAllAggregate();}});
	}
	}
  }

  downloadAggregate = () =>{
	this.typeOfCall = true;
    ExportExcel.generateExcelFromTabularViewMultiTabs( this.state.tabularAggregateData, this.state.tabularAggregateColumns, 'AggregateObjects.xlsx');
  }

  downloadAllAggregate = (pageRange,rangeState) =>{
	console.log('downloadAllAggregate>>>>>>>>>>>*',pageRange);
    if(pageRange){
	  this.typeOfCall=false;
	  let rangeModelState=(rangeState)? rangeState: false;
      this.setState(
        { pageRange: pageRange,isLoading: true,showDownloadResultsModal:rangeModelState,enableModelBusyFeedback:true},
        function () { this.formQueryString(false,false,false); }.bind(this)
      );
    }else{
      this.setState(
        {errorDownloadResults: false, showDownloadResultsModal: false, downloadErrorMsg:'', isLoading: false, enableModelBusyFeedback:false},
        function (){
			ExportExcel.generateExcelFromTabularViewMultiTabs( this.state.allTabularAggregateData, this.state.allTabularAggregateColumns, 'AggregateObjects.xlsx');
			this.typeOfCall = true;
		}.bind(this)
      );
	} 
  }
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
  processData = (resp) => {
		console.log('Response data: ' + JSON.stringify(resp.data));
		this.tableFilterAliasColumns=this.formAliasFilterPropertes();
		if(this.typeOfCall){
			if (resp.data && resp.data.results) {
				//this.nodes = data.results;setDefaultViewName
				this.setState({
					nodes: resp.data.results,
					res: resp
				});
				this.multipleNodes = this.state.nodes.length > 1;
				//this.setState({ viewName: "CardLayout" });
			}
			let totalResults = 0;
			let downloadCount = DOWNLOAD_ALL;
			if(resp.headers) {
				totalResults = parseInt(resp.headers['total-results']);
				if(totalResults > DOWNLOAD_ALL){
					this.downloadAllTooltip = DOWNLOAD_ALL + ' results out of '+ totalResults +' results will be downloaded, Please filter results further to obtain full report';
				}else{
					this.downloadAllTooltip = (totalResults === 1) ?'Downloads ' + totalResults + ' Results' : 'Downloads all ' + totalResults + ' Results' ;
					downloadCount= totalResults;
				}
				this.setState({isLoading: false,
					totalResults: totalResults,
					totalPages: parseInt(resp.headers['total-pages']),
					showPagination: resp.headers['total-results'] > 0 ? true : false,
					showResults: resp.headers['total-results'] > 0 ? true : false,
					isInitialLoad: false,
					noResults: resp.headers['total-results'] && resp.headers['total-results'] > 0 ? false : true,
					errorResults: !resp.headers['total-results'],
					downloadCount: downloadCount
				});
			}
		}else{
			if(resp.data && resp.data.results) {
				this.nodeResults = resp.data.results;
				let totalResults = 0;
				let totalPages = 0;
				if(resp.headers) {
					totalResults = parseInt(resp.headers['total-results']);
					totalPages = parseInt(resp.headers['total-pages']);
				}
				this.setState({totalPages:totalPages,errorDownloadResults:false,downloadErrorMsg:''},() => {this.getAllExcels()});				
			}else{
				this.nodeResults = '';
				this.setState({ isLoading: false,errorDownloadResults:true,downloadErrorMsg:error+'',enableModelBusyFeedback:false});       
     		}
		}
		GeneralCommonFunctions.scrollTo("outputBlock");
  }

  close = () => {
		this.setState({
			showModal: false
		});
  }

  onClick = (event) => {
		console.log('onClick');
  }

  onTextAreaChange = (event) => {
    this.setState({value: event.target.value});
  }

  onChange = (event, { newValue }) => {
		console.log('onChange.newValue: ' + newValue);
		let term = null;
		this.setState({
			value: newValue},
			function () {
				console.log('onChange.selected: ' + this.state.selected);
				console.log('onChange.state value set: ' + this.state.value);
				if (this.state.value.slice(-1) === '(' || this.state.value.slice(-1) === '>') {
					//this.onSuggestionsFetchRequested(term);
					term = this.getValue(this.state.value); // this returns term, array of props or rules
					if (term) {
					console.log('onChange.term: ' + term.toString());
					}
					console.log('onChange.setting suggestions');
					this.setState({
						suggestions: term
					});
				}else if(this.state.value === ''){
					inputValue='';
				}
			}
		);
		// if term exists && term length > 0 - try to load suggestions
		//if(term && term.length > 0){
	  	//properties = term.map(property => {
				//return <div key={property}>{property}<br/></div>;
	  	//});
		//}
	}

  getValue = (term) => {
		inputValue = '';
		let isStartNode = (term.split('>')).length <= 1;
		console.log('getValue.term is: ' + term);

		let toArray = term.split(' ');
		//console.log('Value' + JSON.stringify(toArray[toArray.length - 1]));
		if (toArray && toArray.length > 1) {
			//this.model = term;
			console.log('getValue.toArray: ' + toArray.length);
			this.setState({
			model: term
			});
			term = toArray[toArray.length - 1];

		}
		for (var i = 0; i < toArray.length - 1; i++) {
			inputValue = inputValue + ' ' + toArray[i];
		}
		console.log('getValue.inputValue toArray: ' + inputValue);
		//console.log(term.slice(-1));
		if (term.slice(-1) === '(') {
			console.log('getValue.detected ( property search');
			var nodeVal = term.slice(0, -1);
			nodeVal = nodeVal.trim();
			console.log('getValue.property.nodeVal: ' + nodeVal);
			var val = [];
			val = this.state.nodeTypes.filter(v => v.toLowerCase().indexOf(nodeVal.toLowerCase()) > -1);
			console.log('getValue.val.length: ' + val.length);
			if (val.length === 0) {
			  nodeVal = this.state.previousNodeTypeDsl;
			  inputValue = inputValue + term.slice(0, -1);
			}else {
			  inputValue = inputValue + ' ' + nodeVal;
			}
			console.log('getValue.inputValue property: ' + inputValue);
            if (nodeVal) {
				this.propertiesDsl=this.populateColumnOptions(nodeVal, isStartNode);
				this.setState({nodeTypeDsl: nodeVal,previousNodeTypeDsl:nodeVal});
			}
			term = this.propertiesDsl;
		} else if (term.slice(-1) === '>') {
			console.log('getValue.detected > edgerule search');
			var nodeVal = this.state.previousNodeTypeDsl;
			nodeVal = nodeVal.trim();
			console.log('getValue.edgerule.nodeVal: ' + nodeVal);
			var val = [];

			inputValue = term;

			this.populateEdgeRules(nodeVal);
			term = traverseRulesDsl;
		}
		else {
			//console.log('getValue.nodeTypes: ' + this.state.nodeTypes);
			term = (term === '' ? this.state.nodeTypes : this.state.nodeTypes.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10);
		}
		//console.log('getValue.term: ' + term);
		return term;
 }

  camelToDash = (str) =>  {
    console.log('camelToDash.str: ' + str);
		return (str.replace(/\W+/g, '-')
	  .replace(/([a-z\d])([A-Z])/g, '$1-$2')).toLowerCase();
  }

  
  populateColumnOptions = (nodeType, isStartNode) =>{
	  console.log('populateColumnOptions>>>>>nodeType',nodeType);
		let propertiesDsl = [];
		var result = JSON.parse(OXM);
		var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
		//console.dir(arrayOfTypes);
		var foundIndex = -1;
		var searchParam = nodeType;
		//if(['PSERVER', 'COMPLEX', 'CLOUDREGION', 'NETWORKPROFILE', 'VIRTUALDATACENTER'].indexOf(this.nodeType.toUpperCase()) === -1){
			//searchParam = this.nodeType.substring(0, this.nodeType.length - 1);
		//}
		//console.log('nodeType:' + nodeType);
		if (nodeType.substr(nodeType.length - 3) === 'ies') {
			searchParam = nodeType.substring(0, nodeType.length - 3) + 'y';
		}

		if (nodeType.toUpperCase() === 'LINESOFBUSINESS') {
			searchParam = 'lineOfBusiness';
		}
		//console.log('searchParam:' + searchParam);
		for (var i = 0; i < arrayOfTypes.length && foundIndex === -1; i++) {
			if (arrayOfTypes[i]['xml-root-element'][0]['$']['name'] === this.camelToDash(searchParam)) {
			foundIndex = i;
			}
		}
		for (var j = 0; j < arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'].length; j++) {
			let property =  arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name'];
			//console.log('array' + JSON.stringify(property));
			let type = arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['type'];
			//console.log('type: ' + type);
			if (type === 'java.lang.String' || type === 'java.lang.Boolean' || type ==='java.lang.Integer' || type ==='java.lang.Long') {
				let value = '';
				if(isStartNode !== undefined){
					value = '(\'' + property + '\',\'Value\')';
				}else{
					value= property;
				}
				propertiesDsl.push(value);
			}
		}
		//console.log('propertiesDsl: ' + propertiesDsl);
		let sortedPropertiesDsl = propertiesDsl.sort(function (filter1, filter2) {
			if (filter1 < filter2) {
				return -1;
			} else if (filter1 > filter2) {
				return 1;
			} else {
				return 0;
			}
		});
		//console.log('sortedPropertiesDsl: ' + sortedPropertiesDsl);		
		if(isStartNode !== undefined){
			propertiesDsl = sortedPropertiesDsl;
			//console.log('FilterList' + JSON.stringify(propertiesDsl));
		}
		return propertiesDsl;
		
  }
  componentWillReceiveProps(nextProps) {
		console.log('nextProps......', nextProps);
		//console.log('this.props.....', this.props);
		
		var relArray = false;
		if(this.props.match.params.relArray){
			if(nextProps.match.params.relArray){
				if(nextProps.match.params.relArray !== this.props.match.params.relArray){
					relArray = true;
				}
			}
		}else{
			relArray = false;
		}
		console.log('relArray>>>>',relArray);
		this.setState({
        		isDSLFlow: this.props.viewName === 'BYOQ',
			isSavedQueryFlow: this.props.viewName === 'Saved Queries',
			showNodeModal:false
        	},()=>{if (nextProps.match.params.type && nextProps.match.params.propId &&
			(nextProps.match.params.type !== this.props.match.params.type || 
			nextProps.match.params.propId !== this.props.match.params.propId || relArray)) {
			this.props = nextProps;
			this.buildDynamicByoq();
		}});		
  }
  populateEdgeRules = (nodeType) => {
		traverseRulesDsl = [];
		console.log('populateEdgeRules.nodeType: ' + nodeType);
		for (var i = 0; i < this.state.edgeRules.length; i++) {
			var ruleObj = this.state.edgeRules[i];
			if (ruleObj.from === nodeType) {
			console.log('from: ' + ruleObj.to);
			traverseRulesDsl.push(ruleObj.to);
			}
			if (ruleObj.to === nodeType) {
			console.log('to: ' + ruleObj.from);
			traverseRulesDsl.push(ruleObj.from);
			}
		}
		let traverseRulesDslSorted = traverseRulesDsl.sort(function (filter1, filter2) {
			if (filter1 < filter2) {
				return -1;
			} else if (filter1 > filter2) {
				return 1;
			} else {
				return 0;
			}
    });
		console.log('EdgeRulesList' + JSON.stringify(traverseRulesDslSorted));
		traverseRulesDsl = traverseRulesDslSorted;
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
	  this.setState({
		suggestions: this.getSuggestions(value)
	  });
  };
  getAllExcels = (pageRange,rangeState) =>{
	console.log('getAllExcels>>>>>>>>>>>*',pageRange);
    if(pageRange){
	  this.typeOfCall=false;
	  let rangeModelState=(rangeState)? rangeState: false;
      this.setState(
        { pageRange: pageRange,isLoading: true,showDownloadResultsModal:rangeModelState,enableModelBusyFeedback:true},
        function () { this.formQueryString(false,false,false); }.bind(this)
      );
    }else{
    
      this.setState(
        {errorDownloadResults: false, showDownloadResultsModal: false, downloadErrorMsg:'', isLoading: false, enableModelBusyFeedback:false},
        function () { generateExcels(this.nodeResults,this.state.prevQuery);this.nodeResults='';this.typeOfCall = true;}.bind(this)
	  );
    }   
  }

  getTreeFromDSL = (dslQuery) =>{
     var treeObject = [];
     var payload = {dsl: dslQuery};
     settings['ISAPERTURE'] = true;
     return commonApi(settings, 'dsl/convert-query-to-tree', 'PUT', payload, 'ConvertQueryToTree')
                         		.then(res => {
                         			console.log('res:' + res.data, 'load');
                         			if(res.status === 200 || res.status === 404){
                         			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201 && res.data.status !== 404)){
                         			        this.triggerTreeError(res.data, 'treeLoad');
                         			        return {};
                         			    }else{
                         			        treeObject = res.data;
                         			        this.setState({
                                              treeLoadErrMsg: null
                                            });
                                           console.log("TREE OBJECT: " + JSON.stringify(treeObject));
                                           //set the init state
                                           var initNode = GeneralCommonFunctions.extractNodeDetails(treeObject.children[0], true, this.triggerTreeError, APERTURE_SERVICE);
                                           if(!this.state.treeLoadErrMsg || this.state.treeLoadErrMsg === ''){
                                               console.log(JSON.stringify(initNode));
                                               return initNode;
                                           }else{
                                               this.triggerTreeError(null, 'treeLoad');
                                               return {};
                                           }
                                       }
                                   }else{
                                     this.triggerTreeError(res.data, 'treeLoad');
                                     return {};
                                   }
                         		}, error=>{
                         		    if(error.response.status === 404){
                         		        this.setState({enableTreeLoadBusyFeedback:false});
                         		        return {};
                         		    }else{
                         		        this.triggerTreeError(error.response.data, 'treeLoad');
                         		        return {};
                         		    }
                         		}).catch(error => {
                         		    this.triggerTreeError(error, 'treeLoad');
                         		    return {};
                               })
  }
  triggerTreeError = (error, type) => {
    console.error('[CustomDsl.jsx] error : ', JSON.stringify(error));
  	let errMsg = '';
  	if(error && error.status && error.message){
  	    errMsg += "Error Occurred: " + error.status + ' - ' +error.message;
  	}else{
  	    errMsg += "Error Occurred: " + JSON.stringify(error);
  	}
  	console.log(errMsg);
  	if(type === 'treeLoad' || type === 'invalidQuery'){
  	    var errorMessage = errMsg;
        this.setState({treeLoadErrMsg: errorMessage, enableTreeLoadBusyFeedback: false});
    }else{
        console.log('[CustomDsl.jsx] :: triggerError invoked with invalid type : ' + type);
    }
  }
  getConfigArrayFromDSLTree = (node, configArray, keyArray) =>{

   var tempKey = node.name;
   var nodeKey;
   if(keyArray[tempKey]){
       nodeKey = tempKey + '-' + keyArray[tempKey];
       keyArray[tempKey] = keyArray[tempKey]++;
   }else{
       nodeKey = tempKey;
       keyArray[tempKey] = 1;
   }
   if(node.details && node.details.attrDetails){
       for (var attr in node.details.attrDetails){
           if(node.details.attrDetails[attr].filterType && node.details.attrDetails[attr].filterType.length > 0
                && node.details.attrDetails[attr].filterType[0] !== ""){
                if(!configArray[nodeKey]){
                    configArray[nodeKey] = {};
                    configArray[nodeKey].filters = [];
                }
                configArray[nodeKey].filters.push(attr);
           }
       }
   }
   if(node.children && node.children.length > 0){
       for(var i = 0; i < node.children.length; i++){
           configArray = this.getConfigArrayFromDSLTree(node.children[i], configArray, keyArray);
       }
   }
    return configArray;
  }
  handlePageChange = (pageNumber) => {
    console.log('[CustomDsl.jsx] HandelPageChange active page is', pageNumber);
	this.typeOfCall = true;
	if(this.state.isAggregateChecked){
		this.setState(
			{ aggregateActivePage: pageNumber, isLoading: true, nodes: [], aggregateNodes: [],resetColumnFilters: false, isPageNumberChange: true},
			function () { this.formQueryString(false,false,false); }.bind(this)
			);
	}else{
		this.setState(
		{ activePage: pageNumber, isLoading: true, nodes: [], aggregateNodes: [],resetColumnFilters: false, isPageNumberChange: true},
		function () { this.formQueryString(false,false,false); }.bind(this)
		);
	}
  }
  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
  };

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
  escapeRegexCharacters(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestions = (value) => {
    console.log('getSuggestions.value: ' + value);
		const escapedValue = this.escapeRegexCharacters(value.trim());
		const regex = new RegExp('^' + escapedValue, 'i');
		return nodeTypes.filter(nodeType => regex.test(nodeType));
  }


// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
  getSuggestionValue = suggestion => suggestion;

// Use your imagination to render suggestions.
  renderSuggestion = suggestion => (
		<div>
			{suggestion}
		</div>
  );

  onSuggestionsUpdateRequested =( { value }) => {
    console.log('onSuggestionsUpdateRequested.value: ' + value);
		this.setState({
			suggestions: getSuggestions(value)
		});
  }

  shouldRenderSuggestions = () => {
		return true;
  }
  openHistory = (nodeDisplay, nodeUri, nodeType) => { // open modal from Card
	console.log('history >> showModal',nodeDisplay);
	let historyNodeUri = (nodeUri)?nodeUri.replace('/aperture/','/'):nodeUri;
	let paramToPassThrough = '';
	if(nodeType){
		this.setState({
			nodeDisplay: nodeDisplay,
			showHistoryModal: true,
			showModelOptions:true,
			enableCalendar:true,
			historyType:(this.state.historyType === 'dsl') ? 'nodeState' : this.state.historyType,
			focusedNodeUri: historyNodeUri,
			focusedNodeType: nodeType
		});
	}else{
		this.setState({
			showHistoryModal:true,
			showModelOptions:false,
			enableCalendar:true,
			historyType : 'dsl',
			focusedNodeUri: this.state.value,
			focusedNodeType: nodeType
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
  submitHistory = () => {
	console.log("submitting history");
	let paramToPassThrough = '';
	if(this.state.focusedNodeType){
		paramToPassThrough = '/history/' + this.state.historyType +'/' + this.state.focusedNodeType + '/' + btoa(this.state.focusedNodeUri);	
	}else{
		paramToPassThrough = '/historyQuery/' + this.state.historyType + '/' + btoa(this.state.value);
	}
    let epochStartTime = (this.state.startDate).unix();
	this.props.history.push(paramToPassThrough + '/' + epochStartTime * 1000);
  }
  handleDateChange = (newDate) =>{
    this.setState({ startDate: moment(+newDate) });
    console.log('[CustomDsl.jsx] handleDateChange date is ', this.state.startDate);
    console.log('[CustomDsl.jsx] handleDateChange date is in millis ', +this.state.startDate);
  }

  setViewName(event) {
    console.log(event.currentTarget.value);
    if(this.state.isAggregate && event.currentTarget.value === 'VisualLayout'){
        this.formQueryString(false, false, true);
    }
    this.setState({
    		viewName: event.currentTarget.value
    });
  }

  setDefaultViewName=(event)=>{
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
  openNodeModal(nodeDisplay, nodeUri, nodeType){ // open modal
                   console.log('customdsl >> showModal');
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
    if((this.state.isAggregate || this.state.aggregateNodes.length > 0 || this.state.nodes.length > 0) && !this.state.visualAddition){
        //Visualization.chart('currentState', [], [], this.state.res.data, this);
        this.setState({
            		visualAddition: true
        });
    }
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
  loadBulkCallback=(loadQueryList)=>{
	console.log('Start:Load bulk Callback>>>>>>');
	let filterEntriesList=[];
	let filterTemplateHeaderList=[];
	let filterTemplateErrorList=[];
	let nodeTypeOfDslTemplateList=[];
	let templateQueryList=[];
	let valueList=[];
	this.dslObjectList=[];
	this.nodeTypeArrayList=[];
	this.tempDslQueryList=[];
	this.templateErrorList={};
	let isAggregateCheckedList=[];
	let associatedNodesEnabledList=[];
	let queryNameList=[];
	let queryDescriptionList=[];
	let categoryList=[];
	let isPublicCheckedList=[];
	let queryIdList=[];
	let filterTypeDisplayList=[];
	let isCommunitySharedList = [];
	let staticTemplateFiltersList=[];
	for(var idx=0;idx<loadQueryList.length;idx++){
		let splitString = loadQueryList[idx].split('||');
		let name = splitString[0];
		let description = splitString[1];
		let category=(splitString[2] !== 'undefined')? splitString[2]:'';
		let dsl = splitString[3];
		let isAggregate = splitString[4];
		let type = splitString[5];
		let queryId = splitString[6];
		let isCommunityShared = splitString[7];
		let templateDetails = splitString[8];
		if(name !== '' && description !== '' && this.state.isSavedQueryFlow){
		    var staticTemplateFilters = templateDetails;
            if(staticTemplateFilters.length > 0){
              staticTemplateFilters = JSON.parse(staticTemplateFilters);
            }else{
              staticTemplateFilters = [];
            }
            staticTemplateFiltersList.push(staticTemplateFilters);
			queryNameList.push(name);
			queryIdList.push(queryId);
			queryDescriptionList.push(description);
			isPublicCheckedList.push(type === 'public');
			categoryList.push(category);
			isCommunitySharedList.push(isCommunityShared);			
		}
		associatedNodesEnabledList.push(false);
		if(isAggregate === "true"){
			isAggregateCheckedList.push(true);
		}else{
			isAggregateCheckedList.push(false);		
		}
		filterTypeDisplayList.push({'default':'Filter Type'});
		this.setState({
			queryNameList:queryNameList,
			queryDescriptionList:queryDescriptionList,
			categoryList:categoryList,
			isPublicCheckedList: isPublicCheckedList,
			queryIdList: queryIdList,
			filterTemplateEntries:[],
			filterTemplateError: false,
			isTypeahead: false,
			isAggregateCheckedList: isAggregateCheckedList,
			associatedNodesEnabledList: associatedNodesEnabledList,
			filterTypeDisplayList: filterTypeDisplayList,
			downloadTemplateStatus:false,
			failedDownloadedTemplate:[],
			failedDownloadedTemplateMsg:'',
			failedEmailTemplateMsg:'',
			emailTriggerMsg:'',
		  	isMergedTabsChecked: false,
		  	staticTemplateFiltersList: staticTemplateFiltersList
		});
		
		if(this.state.isSavedQueryFlow){
							
			dsl=atob(dsl).replace('<pre>','').replace('</pre>','');			
			this.dslObject={};
			this.nodeTypeArray=[];
				
			var limitPattern = /limit[\s]\d+|limit\d+/ig;
			var limitkey = dsl.match(limitPattern);
			if(limitkey){
				dsl = dsl.replace(limitkey[limitkey.length-1],'').trim();
			}
			dsl = this.alterDslQueryByRemoveSpaces(dsl);
			//create placeholders for NodeTypes with Propand Propvalues
			this.tempDslQuery=this.formTempDslQuery(dsl);
			this.tempDslQueryList.push(this.tempDslQuery);
			//Preparinga Json Object to render into Placeholder		
			this.contructDslNodes(dsl,'node',false,false,false,false);
			//Query to replace placeholders with JSON Object values depends on Flow either SavedQuery or TableFilters
			let query=this.formTemplateQuery('savedQuery',idx,true);
			query=query.replace(/\'(as)\'/g,'\' as \'').replace(/\(\'\s(as)\s\'\)/g,'(\'as\')');
			if(limitkey){
				query+=' '+limitkey[limitkey.length-1];		
			}	
			let filterEntries=[];
			let filterTemplateHeader={};
			var errorOccurred=false;
			Object.keys(this.dslObject).map((key)=>{
				filterEntries.push(this.dslObject[key]['filterEntries'][0]);
				filterTemplateHeader[key]= {}
				filterTemplateHeader[key]=this.dslObject[key]['filterTemplateHeader'][key];
				if(!errorOccurred){
					errorOccurred=this.dslObject[key]['errorOccurred'];
				}	
			});			
			filterEntriesList.push(filterEntries);
			filterTemplateHeaderList.push(filterTemplateHeader);
			filterTemplateErrorList.push(errorOccurred);
			nodeTypeOfDslTemplateList.push(this.nodeTypeArray);
			templateQueryList.push(query);
			valueList.push(dsl);
			this.dslObjectList.push(this.dslObject);

		}
	}
	this.setState({ valueList: valueList, 
		templateQueryList: templateQueryList, 
		filterTemplateEntriesList: filterEntriesList,
		filterTemplateHeaderList:filterTemplateHeaderList,
		filterTemplateErrorList: filterTemplateErrorList,
		nodeTypeOfDslTemplateList:nodeTypeOfDslTemplateList,		
		isAggregateCheckedList: isAggregateCheckedList,
		associatedNodesEnabledList: associatedNodesEnabledList,
		isInitialLoad:false
	},()=>{GeneralCommonFunctions.scrollTo('templateList');});
  }
  loadCallback = (name, description, category, dslQuery, isAggregate, type, queryId, isCommunityShared, id, templateDetails, makeCall) =>{
  	let filterEntriesList=[];
	let filterTemplateHeaderList=[];
	let filterTemplateErrorList=[];
	let nodeTypeOfDslTemplateList=[];
	let templateQueryList=[];
	let valueList=[];
	this.dslObjectList=[];
	this.nodeTypeArrayList=[];
	this.tempDslQueryList=[];
	this.templateErrorList={};
	let isAggregateCheckedList=[];
	let associatedNodesEnabledList=[];
	let queryNameList=[];
	let queryDescriptionList=[];
	let categoryList=[];
	let isPublicCheckedList=[];
	let queryIdList=[];
	let filterTypeDisplayList=[];
	let isCommunitySharedList=[];
	let staticTemplateFiltersList=[];
	let idx=parseInt(id);
	if(isNaN(idx)){
		idx=0;
	}
    if(name !== '' && description !== '' && this.state.isSavedQueryFlow){		
		queryNameList.push(name);
		queryIdList.push(queryId);
		queryDescriptionList.push(description);
		isPublicCheckedList.push(type === 'public');
		var staticTemplateFilters = templateDetails;
        if(staticTemplateFilters.length > 0){
          staticTemplateFilters = JSON.parse(staticTemplateFilters);
        }else{
          staticTemplateFilters = [];
        }
        staticTemplateFiltersList.push(staticTemplateFilters);
		categoryList.push(category);
		isCommunitySharedList.push(isCommunityShared);
      	this.setState({
		  queryNameList:queryNameList,
		  queryDescriptionList:queryDescriptionList,
		  categoryList:categoryList,
		  isPublicCheckedList: isPublicCheckedList,
		  isCommunitySharedChecked: isCommunityShared === "true",
		  queryIdList: queryIdList,
		  isCommunitySharedList:isCommunitySharedList,
		  staticTemplateFiltersList: staticTemplateFiltersList,
		  downloadTemplateStatus:false,
		  failedDownloadedTemplate:[],
		  failedDownloadedTemplateMsg:'',
		  failedEmailTemplateMsg:'',
		  emailTriggerMsg:'',
		  isMergedTabsChecked: false,
		  isGenerateEmailChecked: false
      	});
    }
    //reset any filter template forms
	this.setState({ filterTemplateEntries: [], filterTemplateError: false, isTypeahead: false});
	associatedNodesEnabledList.push(false);
	let associatedNodesEnable=false;
	let isAggregateChecked=false;
    if(isAggregate === "true"){
		isAggregateCheckedList.push(true);
		isAggregateChecked=true;
    }else{
        isAggregateCheckedList.push(false);		
    }
    this.setState({ isAggregateCheckedList: isAggregateCheckedList, associatedNodesEnabledList: associatedNodesEnabledList,isAggregateChecked:isAggregateChecked,associatedNodesEnabled:associatedNodesEnable});	
    if(this.state.isSavedQueryFlow && !makeCall){
        this.loadTemplateForm(atob(dslQuery).replace('<pre>','').replace('</pre>',''),idx);
    }else{
		this.setState({viewName: this.state.defaultViewName,
                       activePage: 1,
                       aggregateActivePage: 1});
        this.buildDynamicByoq(atob(dslQuery).replace('<pre>','').replace('</pre>',''), makeCall);
    }
    if(this.state.isDSLFlow){
        GeneralCommonFunctions.scrollTo("jumbotron");
    }else if(this.state.isSavedQueryFlow){
        GeneralCommonFunctions.scrollTo("templateList");
    }
  }

  editCallback = (name, description, category, dsl, isAggregateStr, type, queryId, isCommunityShared, templateDetails) =>{
  	//Save stated of loaded queries
  	this.state.valuePreviousState = this.state.value;
  	this.state.isAggregateCheckedPreviousState = this.state.isAggregateChecked;
  	this.state.isCommunitySharedCheckedPreviousState = this.state.isCommunitySharedChecked;
    this.state.associatedNodesEnabledPreviousState = this.state.associatedNodesEnabled;

  	let isAggregateChecked = false;
  	let isCommunitySharedChecked = false;
  	let associatedNodesEnabled = false;

  	if(isAggregateStr === 'true'){
  		isAggregateChecked = true;
  		associatedNodesEnabled = true;
  	}

  	if(isCommunityShared === 'true'){
    	isCommunitySharedChecked = true;
    }

    var staticTemplateFilters = templateDetails;
    if(staticTemplateFilters.length > 0){
        staticTemplateFilters = JSON.parse(staticTemplateFilters);
    }else{
        staticTemplateFilters = [];
    }
    this.getTreeFromDSL(dsl).then(tree => {
         this.setState({
                        enableTreeLoadBusyFeedback: false,
                        dslConfigArray: this.getConfigArrayFromDSLTree(tree, [], []),
                        showSaveModal: true,
                        saveSuccessfulMsg: false,
                        isPublicChecked: type === 'public',
                        isEditModal:true,
                        queryName:name,
                        queryDescription:description,
                        category:category,
                        isAggregateChecked: isAggregateChecked,
                        isCommunitySharedChecked: isCommunitySharedChecked,
                        associatedNodesEnabled: associatedNodesEnabled,
                        value: dsl,
                        queryId: queryId,
                        staticTemplateFilters: staticTemplateFilters
                        });
    });
  }

  saveTemplate = (idx) => {
	  var saveModal = () => {
	  	this.setState(
	  		{
				  showSaveModal: true,
				  saveSuccessfulMsg: false,
				  isPublicChecked: this.state.isPublicChecked,
				  isEditModal:false,
				  queryName:'',
				  queryDescription:'',
				  category:'',
				  queryId:'',
				  isPublicChecked: this.state.isPublicCheckedList[idx],
				  isAggregateChecked: this.state.isAggregateCheckedList[idx],
				  enableTreeLoadBusyFeedback: true
			});
		this.getTreeFromDSL(this.state.value).then(tree => {
                this.setState({enableTreeLoadBusyFeedback: false, dslConfigArray: this.getConfigArrayFromDSLTree(tree, [], [])});
        });
	  }
	  this.populateTemplate(false, saveModal, idx);
  }

  runTemplate = (idx) =>{
    this.populateTemplate(true, null, idx);
  }
  submitEditAndRunDSL = () =>{
    this.setState({ showEditModal: false, value: this.state.editModel,aggregateActivePage:1,activePage:1 }, () => this.formQueryString(false,false,false));
  }
  showEditDSLModal = (idx) => {
    console.log("enabling DSL edit modal");
    var openModal = () => {
        this.setState({ editModel: this.state.value, enableTreeLoadBusyFeedback: true, showEditModal: true });
    }
    this.populateTemplate(false, openModal, idx);
  }
  closeEditDSLModal = () => {
    console.log("closing DSL edit modal");
    this.setState({ showEditModal: false, enableTreeLoadBusyFeedback: false });
  }
  bindEdits = (e) => {
    this.setState({ editModel: e.target.value });
  }
  populateTemplate = (shouldRun, callback, indx) =>{
	console.log('CustomDSL:populateTemplate this.state>>>>>>>>>>>>>>>>>>>*',this.state);
	let query=this.formFinalTemplateQuery(indx);
	console.log('CustomDSL:query>>>>>>>>>*',query);
	console.log('CustomDSL:query>>>>>>>>>BTOA*',btoa(query));
    this.setState({ value: query,aggregateActivePage:1,activePage:1}, () => {if(shouldRun){this.formQueryString(false,false,false)}else{callback()}});
  }
  formFinalTemplateQuery = (indx)=>{
	console.log('formFinalTemplateQuery>> forming finalQuery before Run scenarios>>>>');
	var query = this.state.templateQueryList[indx];
	for(var i = 0; i < this.state.filterTemplateEntriesList[indx].length; i++){
		let filterTemplateEntries=this.state.filterTemplateEntriesList[indx][i];
		Object.keys(filterTemplateEntries).map((key)=>{
			Object.keys(filterTemplateEntries[key]).map((entry)=>{
				let templateEntry=filterTemplateEntries[key][entry];
				if(templateEntry.name !== ''){
					let templateFilterQuery = "'" + templateEntry.name + "','" + templateEntry.value + "'";
					console.log('Before templateFilterQuery>>>>>',templateFilterQuery);
					let valueArray=templateEntry.value.split('^');
					let typeArray=templateEntry.type.split('^');
					templateFilterQuery = "'" + templateEntry.name + "'";
					let templatekeyValues='';
					for(var x=0;x<valueArray.length;x++){
						if(valueArray[x] !==''){
							if(templatekeyValues === ''){									
								templatekeyValues = (this.state.enableRealTime)?typeArray[x] +"('" + valueArray[x] + "')":"'"+valueArray[x]+"'";
							}else{
								templatekeyValues = (this.state.enableRealTime)?templatekeyValues+","+typeArray[x] +"('" + valueArray[x] + "')":templatekeyValues+",'"+ valueArray[x] + "'";
							}
						}
					}
					templateFilterQuery=templateFilterQuery+","+templatekeyValues;
					console.log('templateFilterQuery>>>>>',templateFilterQuery);
					query = query.replace('$' + (templateEntry.templateKey + 1),templateFilterQuery);
					query = query.replace(/\"/g,'\'');
				}
			})			
		});		
	}
	return query;
  }
  stripFirstCharacter=(str)=>{
	return str.substr(1);
  }
  stripLastCharacter=(str)=>{
	return str.substr(0, str.length - 1);
  }
  stripFirstTwoCharacter(str){
	return str.substr(2);
  }
  updateTemplateFilterValues=(key,templateKey,value,id,idx)=>{
	if(value!==''){
	  var filterTemplateEntriesList = this.state.filterTemplateEntriesList;
	  var filterTemplateHeaderList=this.state.filterTemplateHeaderList;
	  var filterMap = filterTemplateEntriesList[idx];
	  var filterTemplateHeader=filterTemplateHeaderList[idx];
	  let idArray=id.split('_');
	  let ind=parseInt(idArray[idArray.length-1]);
	  let finalSelectedProp='';
	  let existing=false;
	  console.log(ind+'<<<updateTemplateFilterValues>>>>'+key+'<><>',value);
	  console.log(templateKey+'filterMap>>>>>>>>>>>>>>>>',filterMap);
	  Object.keys(filterMap).forEach((index) =>{
		  if(filterMap[index][key]){
			  Object.keys(filterMap[index][key]).forEach((i)=>{
				  if(filterMap[index][key][i].templateKey === templateKey){
					  console.log(key+'<<filterMap[index][key][templateKey]>>>'+filterMap[index][key][i]);
					  let filterValue=filterMap[index][key][i].value.split('^');
					  filterValue[ind]=value;
					  filterMap[index][key][i].value=filterValue.join('^');
					  console.log('Updated Filtered Template Entries map' + JSON.stringify(filterMap));						
					  if(filterMap[index][key][i].name !== '' ){
						  filterTemplateHeader[key]['propName'] = filterMap[index][key][i].name;
						  existing =true;
					  }else{
						  console.log('set listname >>>>***',filterTemplateHeader[key]['propName']);
						  finalSelectedProp=filterTemplateHeader[key]['propName'];
						  let status=false;
						  if(filterTemplateHeader[key]['propName'] !== this.state.filterDisplay){							  
							filterMap[index][key][i].name= filterTemplateHeader[key]['propName'];
							status=true;
						  }else{
							filterMap[index][key][i].name= 'ERROR';
							if(!(this.templateErrorList[idx] && this.templateErrorList[idx].length>0)){
								this.templateErrorList[idx]=[];
							}
							this.templateErrorList[idx].push(key);
						  }
						  let selectedProp=[];
						  console.log('filterTemplateHeader[key][selectedProp]>>>>',filterTemplateHeader[key]['selectedProp']);
						  if(filterTemplateHeader[key]['selectedProp'] && status){
							  selectedProp=filterTemplateHeader[key]['selectedProp'];
							  let indSelect= selectedProp.indexOf(filterTemplateHeader[key]['propName']);
							  if(indSelect !== -1){
								  selectedProp=selectedProp.splice(indSelect,1);
								  filterTemplateHeader[key]['selectedProp']=selectedProp;
							  }					
						  }									
					  }				
					  filterTemplateHeader[key]['enableAnd'] = true;
					  this.updateSavedQueryTemplate('add',key,templateKey,filterMap,filterTemplateHeader,idx);
				  }
			  });				
		  }
	  });
	}
	// this.setState({filterTemplateError: true});     
}
updateSavedQueryTemplate=(action,key,templatekey,templateMaps,templateHeader,idx)=>{
		console.log(action+'updateSavedQueryTemplate>>>>>>>>>>>>>*');
		let templateEntriesList = this.state.filterTemplateEntriesList;
		let filterTemplateHeaderList=this.state.filterTemplateHeaderList;
		let templateEntries = templateEntriesList[idx];
		let filterTemplateHeader= filterTemplateHeaderList[idx];
		let finalSelectedProp='';
		idx=parseInt(idx);
		if(templateMaps){
		  templateEntries=templateMaps;
		}
		if(templateHeader){
		  filterTemplateHeader=templateHeader
		}
		let templateQuery = this.state.templateQueryList[idx];
		if(templateQuery.charAt(templateQuery.length-1) !== ']'){
		  templateQuery=templateQuery+',';
		}	
		let keyact=isNaN(parseInt(key.substr(key.length-2,key.length-1)));
		console.log('keyact>>>>****',keyact);
		console.log('TemplateQuery>>>&&*',templateQuery);
		let nodeInd=0;
		let tempkey =key;
		if(!keyact){
			  let actKey=key.split('-');
			  nodeInd=parseInt(actKey[actKey.length-1]);
			  actKey.splice(actKey.length-1,1);
			  tempkey=actKey.join('-');
		}
		let dslObject=this.dslObjectList[idx];
		if(action === 'add'){
			Object.keys(dslObject).map((nodekey)=>{
			  if(nodekey === key){
				  let tempEntries=[];			 
				  Object.keys(templateEntries).map((index) =>{if(templateEntries[index][key] && nodekey === key){ tempEntries= templateEntries[index][key]}});
				  console.log('tempEntries>>>>',tempEntries); 
				  dslObject[nodekey]['templateEntries']=tempEntries;
				  dslObject[nodekey]['filterTemplateHeader']=filterTemplateHeader[nodekey];
			  }		  
			})
		}else{
		  let findEntry=true;
		  Object.keys(templateEntries).map((index) =>{
			  console.log('templateEntries[index][key]??????',templateEntries[index][key]);
			  if(templateEntries[index][key]){
				  Object.keys(templateEntries[index][key]).map((i)=>{
					  console.log(i+'templateEntries[index][key][i].templateKey>>>',templateEntries[index][key][i]);
					  if(findEntry && templateEntries[index][key][i].templateKey === templatekey){
						  findEntry=false;
						  let name = templateEntries[index][key][i].name;
						  finalSelectedProp=name;
						  templateEntries[index][key].splice(i,1);
						  filterTemplateHeader[key]['enableAnd'] = true;
						  filterTemplateHeader[key]['propName'] = this.state.filterDisplay;
						  let selectedProp=[];
						  console.log('filterTemplateHeader[key][selectedProp]???????',filterTemplateHeader[key]['selectedProp']);
						  if(filterTemplateHeader[key]['selectedProp']){
							  selectedProp=filterTemplateHeader[key]['selectedProp'];
							  let ind= selectedProp.indexOf(name);
							  if(ind !== -1){
								  selectedProp=selectedProp.splice(ind,1);
								  filterTemplateHeader[key]['selectedProp']=selectedProp;
							  }	
						  }
						  if(name=='ERROR'){
							if(this.templateErrorList[idx] && this.templateErrorList[idx].length>0){
								this.templateErrorList[idx].pop();
							}							
						  }
						  console.log('selectedProp>>>>',filterTemplateHeader[key]['selectedProp']);
					  }
				  });	
			  }
		  });
		  Object.keys(dslObject).map((nodekey)=>{
			  if(nodekey === key && !findEntry){
				let tempEntries=[];			 
				Object.keys(templateEntries).map((index) =>{if(templateEntries[index][key] && nodekey === key){ tempEntries= templateEntries[index][key]}});
				console.log('Delete tempEntries>>>>',tempEntries); 
				dslObject[nodekey]['templateEntries']=tempEntries;
				dslObject[nodekey]['filterTemplateHeader']=filterTemplateHeader[nodekey];
			  }		  
		  })
		}
		console.log(action+' .......Update Saved ***************this.dslObject',dslObject);
		Object.keys(dslObject).map((nodekey)=>{
			  //console.log(nodekey+'this.dslObject[nodekey][0]>>>>>',dslObject[nodekey][0]);
			  //console.log('key>>>>',key);
			  if(nodekey === key && dslObject[nodekey][0]){
				  Object.keys(templateEntries).map((index) =>{
					  console.log('templateEntries[index][key]>>>>',templateEntries[index][key]);
					  if(templateEntries[index][key]){
						 let props='{';
						 Object.keys(templateEntries[index][key]).map((i)=>{
							console.log(i+'templateEntries[index][key]>>>>',templateEntries[index][key][i]);
							  let prop='';
							  let newProps=(parseInt(i)!==0)?',\''+templateEntries[index][key][i]['name']+'\'':'\''+templateEntries[index][key][i]['name']+'\'';	
							  props+=newProps;
							  if(templateEntries[index][key][i].templateKey === templatekey){
								  let name=templateEntries[index][key][i]['name']
								  let value=templateEntries[index][key][i]['value'].split('^');
								  let type=templateEntries[index][key][i]['type'].split('^');
								  prop='(\''+name+'\',';
								  for(var x=0;x<value.length;x++){
									  if(this.state.enableRealTime){
										  prop+=type[x]+'(\''+value[x]+'\')';
										  if(x===value.length-1){
											  prop+=')';
										  }else{
											  prop+=',';
										  }	
									  }else{
										  prop+='\''+value[x]+'\'';
										  if(x===value.length-1){
											  prop+=')';
										  }else{
											  prop+=',';
										  }
									  }
								  }
								  let values=dslObject[nodekey][0]['values'];
								  //console.log('values>>>>>',values);
								  if(values && values.length>0){
									let findState=false;
									let errorPropMsg=null;									
									for(var n=0;n<values.length;n++){
										if(values[n].indexOf('!(\''+name+'\'') !==-1){
											values[n]='!'+prop;
											findState=true;
										}else if(values[n].indexOf('(\''+name+'\'') !==-1){
											values[n]=prop;
											findState=true;
										}
										if(values[n].indexOf('(\'ERROR\',') !==-1){
											errorPropMsg=n;
										}
									}
									if(errorPropMsg){
										values.splice(errorPropMsg,1);
									}
									if(!findState){
										values.push(prop);
									}
									dslObject[nodekey][0]['values']=values;									
								 }else{
									dslObject[nodekey][0]['values']=[];
									dslObject[nodekey][0]['values'].push(prop);
								 }
								 //console.log(prop+'this.dslObject[nodekey][0][values]>>>>',dslObject[nodekey][0]['values']);
							  }
						  });
						  props+='}';						  
						  if(action!=='add' && dslObject[nodekey][0]['values']){
							  dslObject[nodekey][0]['values'].splice(idx,1);								
						  }
					  }
				  });
			  }		  
		});
		//console.log('After Setting ***************this.dslObject',dslObject);		
		this.dslObjectList[idx]=dslObject;
		let queryList=this.state.templateQueryList;
		let dslquery=queryList[idx];
		var limitPattern = /limit[\s]\d+|limit\d+/ig
		var limitkey = dslquery.match(limitPattern);		
		//this.tempDslQuery=this.formTempDslQuery(dsl);
		let query=this.formTemplateQuery('savedQuery',idx);
		query=query.replace(/\'(as)\'/g,'\' as \'').replace(/\(\'\s(as)\s\'\)/g,'(\'as\')');
		if(limitkey){
			query+=' '+limitkey[limitkey.length-1];		
		}	
		console.log('query>>>>>>>>>>>>>',query);
		queryList[idx]=query;
		templateEntriesList[idx]=templateEntries;
		filterTemplateHeaderList[idx]=filterTemplateHeader;
		this.setState({filterTemplateEntriesList:templateEntriesList,filterTemplateHeaderList:filterTemplateHeaderList,templateQueryList:queryList}); 
	  
  }	
  capturingGroups=(dsl)=>{
	var capturedGroups=[];
	let findGroup=true;
	var block = dsl;
	do{
		var startIndex = block.indexOf('['),/* index of first bracket */
		currPos = startIndex,
		openBrackets = 0,
		stillSearching = true,
		waitForChar = false;
		if(currPos === -1){
			findGroup=false;
		}
		while (stillSearching && currPos <= block.length) {
		  var currChar = block.charAt(currPos);
		  switch (currChar) {
			  case '[':
				openBrackets++; 
				break;
			  case ']':
				openBrackets--;
				break;			  
			}		  
		  currPos++ 
		  if (openBrackets === 0) { stillSearching = false; } 
		}
		console.log('capturingGroups>>>>>>>>>>>>',block.substring(startIndex , currPos));
		if(block.substring(startIndex , currPos) !==''){
			capturedGroups.push(block.substring(startIndex , currPos));
			block=block.replace(block.substring(startIndex , currPos),'#$')
		}
	}while(findGroup);		
	return capturedGroups;
  }
  formTempDslQuery=(dsl) =>{
	let tempQuery='';
	tempQuery=dsl.replace(/\!\((?:[^>)(]|\((?:[^)(]+)\))*\)/g,'').replace(/\((?:[^>)(]|\((?:[^)(]+)\))*\)/g,'').replace(/\{(.*?)\}/g,'').replace(/\*/g,'').trim('')+',';
	tempQuery = tempQuery.replace(/\s+/g, '');
	tempQuery=tempQuery.replace(/[a-zA-Z0-9*\-]/g,'#').replace(/\!\!/g,'!').replace(/\!\>/g,'>');
	tempQuery=tempQuery.replace(/\#(.*?)(?=\>|\!|\(|\)|\,|\])/g,'#').trim('');
	tempQuery=this.stripLastCharacter(tempQuery);
	return tempQuery;
  }
  loadTemplateForm=(dsl,idx) =>{
	console.log('loadTemplateForm>>>idx>>>>',idx);
	this.dslObject={};
	this.nodeTypeArray=[];
	var limitPattern = /limit[\s]\d+|limit\d+/ig;
	var limitkey = dsl.match(limitPattern);
	if(limitkey){
		dsl = dsl.replace(limitkey[limitkey.length-1],'').trim();
	}
	dsl = this.alterDslQueryByRemoveSpaces(dsl);
	//create placeholders for NodeTypes with Propand Propvalues
	this.tempDslQuery=this.formTempDslQuery(dsl);
	this.tempDslQueryList.push(this.tempDslQuery);
	//Preparinga Json Object to render into Placeholder		
	this.contructDslNodes(dsl,'node',false,false,false,false);
	console.log('dsl>>>>>>>>>>>>>',dsl);
	//Query to replace placeholders with JSON Object values depends on Flow either SavedQuery or TableFilters
	let query=this.formTemplateQuery('savedQuery',idx,true);
	query=query.replace(/\'(as)\'/g,'\' as \'').replace(/\(\'\s(as)\s\'\)/g,'(\'as\')');
	if(limitkey){
		query+=' '+limitkey[limitkey.length-1];		
	}	
	let filterEntries=[];
	let filterTemplateHeader={};
	var errorOccurred=false;
	console.log('before setting DSLOBJECT>>',this.dslObject);
	Object.keys(this.dslObject).map((key)=>{
		filterEntries.push(this.dslObject[key]['filterEntries'][0]);
		filterTemplateHeader[key]= {}
		filterTemplateHeader[key]=this.dslObject[key]['filterTemplateHeader'][key];
		if(!errorOccurred){
			errorOccurred=this.dslObject[key]['errorOccurred'];
		}	
	});	
	let filterEntriesList=[];
	let filterTemplateHeaderList=[];
	let filterTemplateErrorList=[];
	let nodeTypeOfDslTemplateList=[];
	let templateQueryList=[];
	let valueList=[];
	if(idx === 0){
		this.setState({ valueList: [], 
			templateQueryList: [], 
			filterTemplateEntriesList: [],
			filterTemplateHeaderList:[],
			filterTemplateErrorList: [],
			nodeTypeOfDslTemplateList:[]
		});
	}
	filterEntriesList.push(filterEntries);
	filterTemplateHeaderList.push(filterTemplateHeader);
	filterTemplateErrorList.push(errorOccurred);
	nodeTypeOfDslTemplateList.push(this.nodeTypeArray);
	templateQueryList.push(query);
	valueList.push(dsl);
	this.dslObjectList.push(this.dslObject);    
	this.setState({ valueList: valueList, 
		templateQueryList: templateQueryList, 
		filterTemplateEntriesList: filterEntriesList,
		filterTemplateHeaderList:filterTemplateHeaderList,
		filterTemplateErrorList: filterTemplateErrorList,
		nodeTypeOfDslTemplateList:nodeTypeOfDslTemplateList,
		isInitialLoad:false
	},()=>{GeneralCommonFunctions.scrollTo('templateList');});
	
  }
 formTemplateQuery=(flow,idx,state)=>{
	let query='';
	let count = 0;
	let tempDslQueryArr=(idx !== undefined && !state)?this.tempDslQueryList[idx].split('#'):this.tempDslQuery.split('#');
	let newCustomQuery=(idx !== undefined && !state)?this.dslObjectList[idx]:this.dslObject;
	Object.keys(newCustomQuery).map((key)=>{
		query='';
		let newDslObject=newCustomQuery[key][0];
		let filterValues='';
		if(newDslObject){
			//console.log('this>>>>>>>>>>>>>>>>>>>>>>',this);
			if(flow==='savedQuery'){				
				//reformed the DSL Object with Filter Entries and Template Entries
				this.formTemplateFilterValues(newDslObject['values'],newDslObject['nodeName'],key,idx);
				let entries=[];
				if(newCustomQuery[key]['templateEntries']){
					entries=newCustomQuery[key]['templateEntries'];
				}else{
					entries='';
				}
				filterValues=(newDslObject['values']) ? this.replaceFilterValues(newDslObject['values'],entries) :'';
			}else{
				filterValues=(newDslObject['values'])? this.formFilterValues(newDslObject['values']):'';
			}
			query+=newDslObject['nodeName'];
			if(newDslObject['props']){
				query+=newDslObject['props'];
			}
			if(newDslObject['values']){
				query+=filterValues;			
			}
			tempDslQueryArr[count]=tempDslQueryArr[count]+query;
			count++;
		}
	});
	query=tempDslQueryArr.join('');
	return query;
 }
 contructDslNodes=(dsl,type,groupStart,groupEnd,edgeStart,edgeEnd)=>{	    
	console.log(type+'contructDslNodes>>>>>>>>>>>>>>',dsl);	
	dsl=dsl.replace(/\s*\,\s*/g, ',')
	var declareEdgePattern=/\(\>(?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)|\!\(\>(?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g;
	let localEdges=dsl.match(declareEdgePattern);
	let edgesDsl=dsl;
	if(localEdges){
		this.edgesArray=localEdges.concat(this.edgesArray);
		edgesDsl=dsl.replace(declareEdgePattern,'>@$');
		edgesDsl=edgesDsl.replace(/\!\>\@\$/g,'>!@$');	
	}	
	//capturing relations group b/w [] Parent only 
	let relations=this.capturingGroups(edgesDsl);		
	if(relations){
		this.relationsArray=relations.concat(this.relationsArray);
		for(var z in relations){
			edgesDsl=edgesDsl.replace(relations[z],'#$');				
		}			
	}
	//console.log('edgesDsl to padd getDslNodes>>>>>',edgesDsl);
	this.getDslNodes(edgesDsl,type,groupStart,groupEnd,edgeStart,edgeEnd);
}
	
 getDslNodes=(dsl,type,groupStart,groupEnd,edgeStart,edgeEnd)=>{
	console.log('getDslNodes>>>>',dsl);
	let dslArray=[];
	let localDslNodes='';
	let relations=false;
	let edges=false;
	let traversal=false;
	dslArray = dsl.split('>');
	if(type === 'relationalNode'){
		traversal=(dsl.indexOf('#$') === -1 && dslArray.length>1 && dsl.indexOf('@$') === -1);
	}
	for(var i=0;i<dslArray.length;i++){
		if(dslArray[i] !== ''){
			if(dslArray[i] === '#$'){//RelationalNode
				//relations to be enables
				localDslNodes=this.relationsArray[0];
				console.log(dslArray[i]+'<<<dslArray[i] localDslNodes>>>>>>>****>>>>',localDslNodes);
				localDslNodes=this.stripLastCharacter(this.stripFirstCharacter(localDslNodes));
				type='relationalNode';
				this.relationsArray=this.relationsArray.slice(1,this.relationsArray.length);					
				this.getDslRelationalNodes(localDslNodes,type);
			}else if(dslArray[i].trim() === '@$' || dslArray[i].trim() === '!@$'){//EdgeNode
			//edges should be enable
				localDslNodes=this.edgesArray[0];
				type='edgeNode'
				localDslNodes=this.stripLastCharacter(localDslNodes);
				if(localDslNodes.startsWith('!')){
					localDslNodes=localDslNodes.substr(3);
					type='negEdgeNode';
				}else{
					localDslNodes=localDslNodes.substr(2);
					type='edgeNode';
				}
				this.edgesArray=this.edgesArray.slice(1,this.edgesArray.length);
				this.getDslEdgeNodes(localDslNodes,type);
			}
			//node,traversal,relationalEdges
			let x=i+1;				
			if(dslArray[x] && dslArray[x] === '#$'){
				relations=true;
			}
			if(dslArray[x] && dslArray[x] === '@$'){
				edges=true;
			}				
			let tStart=(parseInt(i) === 0 && traversal)?true:false;
			let tEnd=(parseInt(i) === dslArray.length-1 && traversal)?true:false;
			if(i === dslArray.length-1){
				if(type==='edgeNode' || type === 'negEdgeNode'){
					edgeEnd=true;
					edgeStart=(dslArray.length===1)?true:false;
					groupStart=false;
					groupEnd=false;
				}else if(type==='relationalNode'){
					edgeEnd=false;
					edgeStart=false;							
				}else{
					groupStart=false;
					groupEnd=false;
					edgeEnd=false;
					edgeStart=false;
				}
			}
			if(!(dslArray[i] === '#$' || dslArray[i].trim() === '@$' || dslArray[i].trim() === '!@$')){					
				dslArray[i]=dslArray[i].replace(/\,$/g,'').replace(/\]$/g,'').replace(/\>$/g,'').trim();
				this.formDslObject(dslArray[i],type,groupStart,groupEnd,relations,traversal,tStart,tEnd,edges,edgeStart,edgeEnd);
			}				
		}			
	}
	console.log('<<formDslObject>>>>>',JSON.stringify(this.dslObject));
}
getDslEdgeNodes=(edgesDsl,type)=>{		
	//space for future changes
	this.contructDslNodes(edgesDsl,type,false,false,true,false);
}
getDslRelationalNodes=(relationDsl,type)=>{
	console.log('getDslRelationalNodes>>>>>>>>>>>>',relationDsl)
	//var dslRelationNodes=relationDsl.substring(relationDsl.indexOf('['),relationDsl.lastIndexOf(']')+1);
	let dslRelationNodes=this.capturingGroups(relationDsl);
	let dslRelations= relationDsl;
	if(dslRelationNodes){
		for(var z in dslRelationNodes){
			dslRelations=dslRelations.replace(dslRelationNodes[z],'#$');
		}
		this.relationsArray=dslRelationNodes.concat(this.relationsArray);
	}
	let relationsList=dslRelations.replace(/\((?:[^)(]+|\((?:[^)(]+)\))*\)/g,'').replace(/\{(.*?)\}/g,'').trim('').replace(/\>\#\$/g,'').replace(/\>\@\$/g,'').replace(/\>\!\@\$/g,'').replace(/\!/g,'').split(',');
	dslRelations=','+dslRelations+'&&';
	let groupStart=false;
	let groupEnd=false;		
	//relationsList: have all Relations like node [node1>#$,node2,node3>node4]: possible to contain EdgeNodes,Traversal condition and inner relationNodes
	for(var k in relationsList){
		console.log(k+'relationsList>>>>**',relationsList);
		if(parseInt(k)===0){
			groupStart=true;
			groupEnd=false;
		}else if(parseInt(k) === relationsList.length-1){
			groupStart=false;
			groupEnd=true;
		}else{
			groupStart=false;
			groupEnd=false;
		}
		if(relationsList.length === 1){
			groupStart=true;
			groupEnd=true;
		}
		var relationPattern='';
		
		console.log('dslRelations>>>>>>>>>>>>',dslRelations);
		let pattern=relationsList[k]+"(.*?)>\\#\\$(?=\\,|\\&&)|"+relationsList[k]+"(.*?)>\\@\\$(?=\\,|\\&&)|"+relationsList[k]+"(.*?)>\\!\\@\\$(?=\\,|\\&&)";
		console.log('pattern>>>>>',pattern);
		let relationP1 = new RegExp(pattern, 'g');					
		let findDslRelation=dslRelations.match(relationP1);
		console.log('findDslRelation>>>>>>',findDslRelation);
		if(findDslRelation){//dslRelations.indexOf(relationsList[k]+'>#') !==-1 || dslRelations.indexOf(relationsList[k]+'>@$') !==-1){
			relationPattern="(?:[^-]"+relationsList[k].split('>')[0]+"(.*?)(?=\,[a-z]|&&))|"+"(?:[^-]"+relationsList[k].split('>')[0]+"(?=\,[a-z]|&&))";
		}else if(dslRelations.indexOf(relationsList[k]+',#') !== -1){
			relationPattern="(?:[^-]"+relationsList[k]+"(.*?)(?=\,#))|"+"(?:[^-]"+relationsList[k]+"(?=\,#))";
		}else if(relationsList[k] !== '#$'){
			relationPattern="(?:[^-|^>]"+relationsList[k]+"(.*?)(?=\,[a-z]|>|&&))|"+"(?:[^-|^>]"+relationsList[k]+"(?=\,[a-z]|>|&&))";
		}
		if(relationsList[k] !== '#$'){		
			console.log(k+'for relationPattern>>>',relationPattern);
			console.log(k+'for dslRelations>>>>',dslRelations);
			let relationPatternExp = new RegExp(relationPattern, 'g');					
			let dslRelationArray=dslRelations.match(relationPatternExp);
			console.log(k+'for dslRelationArray>>>>',dslRelationArray);
			if(dslRelationArray){
				for(var j in dslRelationArray){	
					console.log('dslRelationArray[j]>>>',dslRelationArray[j]);						
					let dslRelationNode=null;					
					dslRelationArray[j]= dslRelationArray[j].substr(1);
					dslRelations=dslRelations.replace(dslRelationArray[j],'@');
					console.log('groupStart>>>>>>>>>>',groupStart);
					this.contructDslNodes(dslRelationArray[j],type,groupStart,groupEnd);						
				}
			}else{				
				var relationPatternArray=relationsList[k].split('>');
				relationPattern=''; 
				for(var x=0;x<relationPatternArray.length;x++){
					if(x === 0){
						relationPattern=relationPatternArray[x]+'(.*?)';
					}else{
						relationPattern=relationPattern+'>'+relationPatternArray[x]+'(.*?)';
						if(x===relationPatternArray.length-1){
							relationPattern=relationPattern+'(?=\,[a-z]|&&)';
						}						
					}
				}
				console.log('relationPattern>>>>>>',relationPattern);
				relationPatternExp = new RegExp(relationPattern, 'g');
				dslRelationArray=dslRelations.match(relationPatternExp);
				if(dslRelationArray){
					dslRelations=dslRelations.replace(dslRelationArray[0],'@');
					console.log('dslRelationArray!!!!!!!!!!!!!>>>>>',dslRelationArray);
					this.contructDslNodes(dslRelationArray[0],type,groupStart,groupEnd);
				}				
			}			
		}else{
			let localDslNodes=this.relationsArray[0];
			relationsList[k]=this.stripLastCharacter(this.stripFirstCharacter(localDslNodes));
			this.relationsArray=this.relationsArray.slice(1,this.relationsArray.length);
			console.log('relationsList[k]>***>>>',relationsList[k]);
			//dslRelations=dslRelations.replace(dslRelationArray[j],'@');
			this.contructDslNodes(relationsList[k],type,groupStart,groupEnd);
			
		}				
	}
}
formDslObject=(dslArray,type,groupStart,groupEnd,relationState,traversal,tStart,tEnd,edges,eStart,eEnd,id)=>{
	let nodeType=dslArray.replace(/\((?:[^)(]+|\((?:[^)(]+)\))*\)/g,'').replace(/\{(.*?)\}/g,'').replace(/\!/g,'').trim('');
	let props=dslArray.match(/\{(.*?)\}/g);
	let propValues=dslArray.match(/\((?:[^)(]+|\((?:[^)(]+)\))*\)|\!\((?:[^)(]+|\((?:[^)(]+)\))*\)/g);
	var entries=[]
	var entry = {};
	entry.type = type;
	entry.relationsStart = groupStart;
	entry.relationsEnd= groupEnd;
	entry.relations=relationState;
	entry.nodeName = nodeType;
	entry.props=props;
	entry.traversal=traversal;
	entry.traversalStart=tStart;
	entry.traversalEnd=tEnd;
	entry.edgeEnable=(edges)?edges:false;
	entry.edgeStart=(eStart)?eStart:false;
	entry.edgeEnd=(eEnd)?eEnd:false;
	entry.values=propValues;
	entries.push(entry);
	let entityId=nodeType.replace(/\*/g,'');
	if(!this.nodeTypeArray.includes(entityId)){
		this.nodeTypeArray.push(entityId);
		this.dslObject[entityId] = entries;
	}else{
		let newNodeType='';
		let repeatMode=true;
		for(var n=1;n<=this.nodeTypeArray.length;n++){
			if(!this.nodeTypeArray.includes(entityId+'-'+n) && repeatMode){
				newNodeType=entityId+'-'+n;	
				repeatMode=false;
			}
		}
		this.nodeTypeArray.push(newNodeType);
		this.dslObject[newNodeType] = entries;
	}		
	console.log('nodeTypeArray>>>>',this.nodeTypeArray);
	console.log('this.dslObject>>>>',this.dslObject);	
}
formFilterValues=(propValues)=>{
	let templateQuery='';
	let negQuery='';	
	for(var k = 0; k < propValues.length; k++){
		if(propValues[k].indexOf('!') !== -1){
			negQuery += propValues[k];
		}else{
			templateQuery += propValues[k];
		}		
	}
	if(negQuery!==''){
		templateQuery+=negQuery;
	}
	console.log('templateQuery>>>>>>>>>>>>',templateQuery);
	return templateQuery;
}
replaceFilterValues=(propValues,entries)=>{
	console.log(propValues+'<<<propValues>>>>>',entries);
	let templateQuery='';
	let negQuery='';
	let count=1;
	for(var k = 0; k < propValues.length; k++){
		let templatekey=(entries)?entries[k].templateKey+1:count;
		if(propValues[k].indexOf('!') !== -1){
			negQuery += "!($" + templatekey + ")";
		}else{
			templateQuery += "($" + templatekey + ")";
		}	
		count++;	
	}
	if(negQuery!==''){
		templateQuery+=negQuery;
	}
	console.log('templateQuery>>>>>>>>>>>>',templateQuery);
	return templateQuery;
}
formTemplateFilterValues=(propvalues,nodeName,nodeId,idx)=>{
	let filterTemplateHeader = {};
	let filterEntries=[];
	var spaceRemoverPattern=/\,\s/g;
	var errorOccurred = false;
	var filterTypeDisplayArray = this.state.filterTypeDisplayList;
	let filterTypeDisplay= {'default':'Filter Type'};
	if(!filterTypeDisplayArray[idx] || filterTypeDisplayArray[idx] === undefined){
		filterTypeDisplayArray.push(filterTypeDisplay);
	}
	var entries = [];
	var filterTypeEntries =[];
	var selectedProp=[];
	if(propvalues){
		for(var i = 0; i < propvalues.length; i++){
			console.log('propvalues['+i+']>>>>',propvalues[i]);
			var entry = {};
			let propVal = '';
			if(propvalues[i].indexOf('!') !==-1){
				propVal=this.stripLastCharacter(this.stripFirstTwoCharacter(propvalues[i].trim()));
			}else{
				propVal=this.stripLastCharacter(this.stripFirstCharacter(propvalues[i].trim()));
			}				
			propVal = propVal.replace(spaceRemoverPattern,',');
			//console.log('propVal>>>>>>>>>>>',propVal);			
			var matchesList = propVal.split(/',|\),/g)
			//console.log('matchesList>>>>',matchesList);									
			let type='';
			let value='';
			let errorFound=true;
			let entryState=true;
			for(var n=0;n<matchesList.length;n++){
				let scenario=true;
				let found=true;
				if(n==0){
					entry.name = this.stripFirstCharacter(matchesList[n].trim());
					selectedProp.push(this.stripFirstCharacter(matchesList[n].trim()));
				}else{
					let obj={};
					var lastChar=matchesList[n].charAt(matchesList[n].length-1);							
					for(var x in filterTypeList){
						if(found){
							let pattern= new RegExp('^'+filterTypeList[x]+'\\((.*?)', 'g');	
							var filterExist=matchesList[n].match(pattern);
							//console.log(matchesList[n]+'filterExist>>>>>',filterExist);
							if(filterExist){
								var nodevalue='';
								if(lastChar===')'){
									nodevalue=matchesList[n].replace(filterTypeList[x],'').replace(/\(\'/,'').replace(/\'\)/,'');
								}else{
									nodevalue=this.stripLastCharacter(matchesList[n].replace(filterTypeList[x],'').replace(/\(\'/,''));
								}
								//console.log('before srtip>>>',nodevalue);					
								type=(type==='')?filterTypeList[x]:type+'^'+filterTypeList[x];
								value=(value==='')?nodevalue:value+'^'+nodevalue;
								scenario=false;
								found=false;
								errorFound=false;
								entryState=false;					
								obj[entry.templateKey+1] = filterTypeList[x];
								filterTypeEntries.push(obj);
								console.log('filterTypeDisplayArray....>*',filterTypeEntries);					
							}
						}			
						console.log(found+'found>>>>>>>>>>>>',value);
					}
					if(scenario){
						console.log('inside else');
						type=(type==='')?'EQ':type+'^'+'EQ';						
						let val=this.stripFirstCharacter(matchesList[n].trim());
						if(lastChar == '\''){
							val=this.stripLastCharacter(val);
						}
						value=(value==='')?val:value+'^'+val;
						entryState=false;
						found=false;
						errorFound=false;
					}			
				}
			}
			if(!entryState){
				entry.type =type;
				entry.value =  value;
				entry.templateKey = i;
				entries.push(entry);		
			}
			if(errorFound && !errorOccurred){
				errorOccurred=true;
			}
		}			
	}
	console.log('Initial Filtered Template Entries ' + JSON.stringify(entries));
	//nodeTypeOfDsl.push(nodeTypes[z]);
	let obj = {};
	obj[nodeId] = entries;
	filterTemplateHeader[nodeId]= {};
	filterTemplateHeader[nodeId]['enableAnd'] = true;
	filterTemplateHeader[nodeId]['propName'] = this.state.filterDisplay;
	filterTemplateHeader[nodeId]['selectedProp']=selectedProp;
	filterEntries.push(obj)
	filterTypeDisplayArray[idx][nodeId] = filterTypeEntries;
	let dslObject=this.dslObjectList[idx];
	if(dslObject){
		dslObject[nodeId]['filterTemplateHeader']= filterTemplateHeader;
		dslObject[nodeId]['filterEntries']=filterEntries;
		dslObject[nodeId]['errorOccurred']=errorOccurred;
		this.dslObjectList[idx]=dslObject;
	}else{
		this.dslObject[nodeId]['filterTemplateHeader']= filterTemplateHeader;
		this.dslObject[nodeId]['filterEntries']=filterEntries
		this.dslObject[nodeId]['errorOccurred']=errorOccurred;
	}		
  }
  
  onAssociatedNodesCheckbox(e) {
      var cbValue = false;
      if (e.target.checked) {
        cbValue = true;
      }else {
        cbValue = false;
      }
      this.setState({ associatedNodesEnabled: cbValue });
  }
  onAggregateCheckbox(e) {
      var cbValue = false;
      if (e.target.checked) {
        cbValue = true;
        this.setState({associatedNodesEnabled: false});
      }else {
        cbValue = false;
      }
      this.setState({ isAggregateChecked: cbValue });
  }
  onPublicCheckbox(e) {
      var cbValue = false;
      if (e.target.checked) {
        cbValue = true;
        this.setState({ isPublicChecked: cbValue, isCommunitySharedChecked: false });
      }else {
        cbValue = false;
        this.setState({ isPublicChecked: cbValue });
      }
  }
  onMergedTabsCheckbox(e){
	var cbValue = false;
	if (e.target.checked) {
	  cbValue = true;
	  this.setState({ isMergedTabsChecked: cbValue});
	}else {
	  cbValue = false;
	  this.setState({ isMergedTabsChecked: cbValue });
	}
  }
  onGenerateEmailButton(){	
	let path='email-bulk-dsl-to-excel';
	this.generatebulkDslToExcel(path,true);	
  }
  onCommunitySharedCheckbox(e) {
      var cbValue = false;
      if (e.target.checked) {
        cbValue = true;
      }else {
        cbValue = false;
      }
      this.setState({ isCommunitySharedChecked: cbValue });
  }
  onDslConfigCheckbox(e, key) {
        var cbValue = false;
        var staticTemplateFilters = this.state.staticTemplateFilters;
        if (e.target.checked) {
          cbValue = true;
          staticTemplateFilters = staticTemplateFilters.filter(e => e !== key);
        }else {
          cbValue = false;
          staticTemplateFilters.push(key);
        }
        this.setState({ staticTemplateFilters: staticTemplateFilters });
    }
  handleOnFilter = (columnFilter,value) =>{
	console.log('handleOnFilter to Re-render', this.state.columnFilter);
	var applyState = true;
	if(value === ''){
		for(var i= 0; i < columnFilter.length; i++){
			var x = columnFilter[i];		
			console.log('handleOnfilter ColumnFilterList.....',Object.keys(x));
			Object.keys(x).forEach(function(key){
				if(x[key] !==''){
					applyState=false;
				}
			});
		}
	}else{
		applyState = false;
	}
	
    this.setState({columnFilter : columnFilter,reRender:true,disableFilter: applyState});
  }
  
  alterDslQueryByRemoveSpaces = (dslQuery) =>{
	    var p2='';
		if((dslQuery.indexOf('(>') !==-1) || (dslQuery.indexOf('!(>') !==-1)){
			p2=/\((?:[^>)(]|\((?:[^)(]+)\))*\)/g;
		}
		else{
			p2 = /\((?:[^)(]+|\((?:[^)(]+)\))*\)/g;
		}
		var prop = dslQuery.match(p2);
		var spacepattern = /\s(?!(^)]*\()/g;		
		var newDslQuery='';
		if(prop && prop.length > 0){
			var x = dslQuery.replace(p2,'{*$}');
			var matchStr = x.replace(spacepattern,'');			
			var propArray=matchStr.split('{*$}');			
			for(var i in prop){
				newDslQuery=newDslQuery+propArray[i]+prop[i];
			}
			newDslQuery = newDslQuery + propArray[propArray.length-1];
		}else{
			newDslQuery = dslQuery.replace(spacepattern,'');
		}
		newDslQuery = newDslQuery.trim();
		console.log('New DSl Query after alterDslQueryByRemoveSpaces>>>>>>',newDslQuery);
		return newDslQuery;
  }
 
  isTableFilterForAggregation = (columnFilterList,columnsList) => {
	console.log('isTableFilterForAggregation:aggregateTableFilterColumns>>>>>>',this.state.aggregateTableFilterColumns);
	//console.log('isTableFilterForAggregation:columnFilterList>>>>>>>>',columnFilterList);
	var nodeTypeArray = [];
	var columnsList = {};
	var filterMessage = {};
	var j = 0;	
	for(var i= 0; i < columnFilterList.length; i++){
		var x = columnFilterList[i];		
		console.log('isTableFilterForAggregation:Aggregate columnFilterList.....',Object.keys(x));
		var  propValue = '';
		Object.keys(x).forEach((key)=>{
			var grabNode = key.split("|");
			let indx=false;
			let index='';
			if(nodeTypeArray.indexOf(grabNode[0]) === -1){
				nodeTypeArray.push(grabNode[0]);
				j = j + 1;
				indx=true;
				index=j-1;
			}else{
				index=nodeTypeArray.indexOf(grabNode[0]);
			}
			
			if(!columnsList[nodeTypeArray[index]]){
				columnsList[nodeTypeArray[index]] = [];
			}
			if(!filterMessage[nodeTypeArray[index]]){
				filterMessage[nodeTypeArray[index]]=[];
			}
			let col='';
			if(this.tableFilterAliasColumns[grabNode[0]][0] && this.tableFilterAliasColumns[grabNode[0]][0][grabNode[1]]){
				col=this.tableFilterAliasColumns[grabNode[0]][0][grabNode[1]];
			}else{
				col=grabNode[1];
			}
			if(columnsList[nodeTypeArray[index]].indexOf(col) === -1){
				columnsList[nodeTypeArray[index]].push(col);
				if(x[key] != ''){
					let filterMsg = '';
					if(this.state.enableRealTime){
						filterMsg='(\''+col +'\'' + ',' + TABULAR_FILTER_TYPE+'(\'' + x[key]+ '\'))';
					}else{
						filterMsg='(\''+col +'\'' + ',' + '\'' + x[key] + '\')';
					}	
					filterMessage[nodeTypeArray[j-1]].push(filterMsg);
				}
			}
			propValue=x[key];			
		});					
	}
	console.log('isTableFilterForAggregation:nodeTypeArray><><><>',nodeTypeArray);	
	console.log('isTableFilterForAggregation:columnsList<><><>',columnsList);
	console.log('isTableFilterForAggregation:filterMessage>>>>>>>>',filterMessage);
	let dslQuery = this.state.value;
	var limitPattern = /limit[\s]\d+|limit\d+/ig
	var limitkey = dslQuery.match(limitPattern);
	if(limitkey){
		dslQuery = dslQuery.replace(limitkey[limitkey.length-1],'').trim();
	}
	dslQuery = this.alterDslQueryByRemoveSpaces(dslQuery);
	//New adding
	this.dslObject={};
	this.nodeTypeArray=[];
	//create placeholders for NodeTypes with Propand Propvalues
	this.tempDslQuery=this.formTempDslQuery(dslQuery);
	//Preparing Json Object to render into Placeholder		
	this.contructDslNodes(dslQuery,'node',false,false,false,false);
	console.log('dslQuerydsl>>>>>>>>>>>>>',dslQuery);		
	//adding	
	Object.keys(this.dslObject).map((nodekey)=>{		
		let nodeNo=parseInt(nodekey.substr(nodekey.length-2,nodekey.length-1).replace(/\-/g,''));
		console.log('nodeNo>>>>>>>>>>>>>>',nodeNo);
		let keyact=isNaN(nodeNo);
		let nodeType=nodekey;
		let actKey=nodekey.split('-');
		console.log(nodeType+'>>>>nodeType<<<<nodeType>>>>',actKey);
		if(!keyact){
			actKey.splice(actKey.length-1,1);
			nodeType=actKey.join('-')+nodeNo;
		}
		if(!nodeTypeArray.includes(nodeType) && nodeTypeArray.includes(actKey.join('-'))){
			nodeType=actKey.join('-');
		}
		console.log('nodeType>>>>>>>>>>',nodeType);
		var columns = columnsList[nodeType];
		var filterMsg= filterMessage[nodeType];
		console.log('CustomDsl js filterMsg:',filterMsg);
		if(nodeType && this.dslObject[nodekey][0]){
			if(filterMsg && filterMsg.length>0){
				for(var i=0;i<filterMsg.length;i++){
					let values=this.dslObject[nodekey][0]['values'];
					let nonExist=true
					let columnCompare=filterMsg[i].split(',')[0];
					if(values && values.length>0){
						for(var n=0;n<values.length;n++){
							console.log('values[n].indexOf(columnCompare)>>>>',values[n].indexOf(columnCompare));
							if(values[n].indexOf(columnCompare) !==-1 && values[n].indexOf('!'+columnCompare) ===-1){
								values[n]=filterMsg[i];
								nonExist=false;
							}
						}
						if(nonExist){
							this.dslObject[nodekey][0]['values'].push(filterMsg[i]);	
						}else{
							this.dslObject[nodekey][0]['values']=values;	
						}
					}else{
						this.dslObject[nodekey][0]['values']=[];
						this.dslObject[nodekey][0]['values'].push(filterMsg[i]);
					}
				}
			}
		}
	});
	this.dslObjectList =[];
	this.dslObjectList.push(this.dslObject);
	//Query to replace placeholders with JSON Object values depends on Flow either SavedQuery or TableFilters	
	let newDslQuery=this.formTemplateQuery('tableFilter');
	newDslQuery=newDslQuery.replace(/\'(as)\'/g,'\' as \'').replace(/\(\'\s(as)\s\'\)/g,'(\'as\')');
	if(limitkey){
		newDslQuery+=' '+limitkey[limitkey.length-1];
	}
	console.log('query>>>>>>>>>>>>>>>>>>>>>****',newDslQuery);
	this.setState({value : newDslQuery, viewName: "CellLayout", aggregateActivePage:1}, function () { this.formQueryString(false,false,false); }.bind(this));
	//End	
  }

  isTableFilterApply = (columnFilterList,nodeTypeList,columnsList,aliasColumnList) => {
    console.log('CustomDSL js ....columnFilterList:',columnFilterList);
	console.log('CustomDSL js .... nodeTypeList:',nodeTypeList);
	var nodeTypeListArray = [];
	if(!Array.isArray(nodeTypeList)){
		nodeTypeListArray.push(nodeTypeList);
		nodeTypeList = nodeTypeListArray;
	}
	console.log('CustomDSL js .... nodeTypeList After set:',nodeTypeList);
	var dslQuery = this.state.value;
	var limitPattern = /limit[\s]\d+|limit\d+/ig
	var limitkey = dslQuery.match(limitPattern);
	if(limitkey){
		dslQuery = dslQuery.replace(limitkey[limitkey.length-1],'').trim();
	}
	dslQuery = this.alterDslQueryByRemoveSpaces(dslQuery);
	//New adding
	this.dslObject={};
	this.nodeTypeArray=[];
	//create placeholders for NodeTypes with Propand Propvalues
	this.tempDslQuery=this.formTempDslQuery(dslQuery);
	//Preparinga Json Object to render into Placeholder		
	this.contructDslNodes(dslQuery,'node',false,false,false,false);
	console.log('dslQuerydsl>>>>>>>>>>>>>',dslQuery);		
	//adding	
	Object.keys(this.dslObject).map((nodekey)=>{
		var nodeType=this.dslObject[nodekey][0]['nodeName'].replace(/\*/g,'');
		console.log('nodeType>>>>>>>>>>',nodeType);
		var columnFilter = (columnFilterList[nodeType])?columnFilterList[nodeType][0]:[];
		var aliasColumnFilters = (aliasColumnList[nodeType])?aliasColumnList[nodeType][0]:[];
		console.log('CustomDsl js columnFilter:',columnFilter);
		var columns = columnsList[nodeType];
		console.log('CustomDsl js Columns:',columns);
		if(columns && columnFilter.length>0){
			for(var i=0;i<columns.length;i++){
				console.log(columnFilter[i]+'<<<<<<columnFilter[i]columns[i].value>>>>',columns[i]);
				var colAliasFilter='';
				for(var z=0;z<aliasColumnFilters.length;z++){
					if(aliasColumnFilters[z][columns[i].value]){
						colAliasFilter=aliasColumnFilters[z][columns[i].value];
					}				
				}		
				var colFilterValue = columnFilter[i][columns[i].value];      
				if(colFilterValue != ""){        
					let filterMsg = '';
					let col=(colAliasFilter)?colAliasFilter:columns[i].value;
					if(this.state.enableRealTime){
						filterMsg='(\''+col +'\'' + ',' + TABULAR_FILTER_TYPE+'(\'' + colFilterValue + '\'))';
					}else{
						filterMsg='(\''+col +'\'' + ',' +'\'' + colFilterValue + '\')';
					}				
					let values=this.dslObject[nodekey][0]['values'];
					let nonExist=true;
					if(values && values.length>0){
						for(var n=0;n<values.length;n++){
							if(values[n].indexOf('(\''+col+'\'') !==-1 && values[n].indexOf('!(\''+col+'\'') ===-1){
								values[n]=filterMsg;
								nonExist=false;
							}
						}
						if(nonExist){
							this.dslObject[nodekey][0]['values'].push(filterMsg);	
						}else{
							this.dslObject[nodekey][0]['values']=values;	
						}
					}else{
						this.dslObject[nodekey][0]['values']=[];
						this.dslObject[nodekey][0]['values'].push(filterMsg);
					}
				}
			}
		}
	});
	//Query to replace placeholders with JSON Object values depends on Flow either SavedQuery or TableFilters	
	this.dslObjectList =[];
	this.dslObjectList.push(this.dslObject);
	let newDslQuery=this.formTemplateQuery('tableFilter');
	newDslQuery=newDslQuery.replace(/\'(as)\'/g,'\' as \'').replace(/\(\'\s(as)\s\'\)/g,'(\'as\')');
	if(limitkey){
		newDslQuery+=' '+limitkey[limitkey.length-1];
	}
	console.log('query>>>>>>>>>>>>>>>>>>>>>****',newDslQuery);
	this.setState({value : newDslQuery, viewName: "CellLayout", activePage:1}, function () { this.formQueryString(false,false,false); }.bind(this));
	//End
  }
  
  onTargetMenuOfFilterTypes = (listName,id) => {
	console.log('onTargetMenuOfFilterTypes>>>>',listName);
	let idArray=id.split('#');
	let key=idArray[0];
	let templateKey=parseInt(idArray[1]);
	let filterTypeIndex = parseInt(idArray[2]);
	let idx= parseInt(idArray[3]);
	var filterTypeDisplayList = this.state.filterTypeDisplayList;	
	var filterTypeDisplayArray = filterTypeDisplayList[idx];
	Object.keys(filterTypeDisplayArray).map((entry) => {
		if(entry === key){
			console.log('filterTypeDisplayArray.entry....',filterTypeDisplayArray[entry]);
			if(filterTypeDisplayArray[entry][templateKey]){
				filterTypeDisplayArray[key][templateKey] = listName;
			}else{
				let obj={};
				obj[templateKey+1]=listName;
				filterTypeDisplayArray[key].push(obj);
			}
		}
	});	
	let filterTemplateEntriesList =	this.state.filterTemplateEntriesList;
	var filterTemplateEntriesArray = filterTemplateEntriesList[idx];	
	Object.keys(filterTemplateEntriesArray).map((entry)=>{
		if(filterTemplateEntriesArray[entry][key]){
			Object.keys(filterTemplateEntriesArray[entry][key]).map((ind) =>{
				if(filterTemplateEntriesArray[entry][key][ind].templateKey === templateKey){
					let type=filterTemplateEntriesArray[entry][key][ind].type.split('^');
					if(type[filterTypeIndex]){
						type[filterTypeIndex]=listName
					}else{
						type.push(listName);
					}
					filterTemplateEntriesArray[entry][key][ind].type=type.join('^');
				}
			})
		}
	});
	console.log('onTargetMenuOfFilterTypes filterTemplateEntriesArray>>>',filterTemplateEntriesArray);
	filterTemplateEntriesList[idx]=filterTemplateEntriesArray;
	filterTypeDisplayList[idx]=filterTypeDisplayArray;
	this.setState({filterTypeDisplayList:filterTypeDisplayList,filterTemplateEntriesList:filterTemplateEntriesList});
  }
  filterTags = (type,templateKey,key,idx) =>{
	console.log(key+'<<<filterTags>>>>>*',type);
	let filterType = (type === '')? this.state.filterTypeDisplayList[idx]['default']:type;
	let filterTag = '';
	if(APERTURE_SERVICE && this.state.enableRealTime){
		console.log(filterType+'before passing Filter>*',this.state);
		let filterTypesArray=filterType.split('^');	
		let filters = Object.keys(filterTypesArray).map((index)=>{
						return  <div style={{margin:'0px 0px 0px 5px'}}>
									<label>
										<FilterTypes param={this.state}
													selectedFilter={filterTypesArray[index]}
													id={key+'#'+templateKey+'#'+index+'#'+idx}
													onMenuSelect={this.onTargetMenuOfFilterTypes} />
									</label>
								</div>
						});
		filterTag=<td width='20%'>{filters}</td>;
	}
	return filterTag;
  }
  populateFilteredColumnOptions = (nodekey,indx) =>{
	let keyact=isNaN(parseInt(nodekey.substr(nodekey.length-2,nodekey.length-1)));
	let actColumns ='';
	if(keyact){
		actColumns =this.populateColumnOptions(nodekey);//this.populateColumnOptions(key);
	}else{
		let actKey=nodekey.split('-');
		actKey.splice(actKey.length-1,1);
		actColumns =this.populateColumnOptions(actKey.join('-'));
	}	 
	let filterTemplateEntries=this.state.filterTemplateEntriesList[indx];
	let filterTemplateHeader=this.state.filterTemplateHeaderList[indx];
	let selectedColumns=[];
	Object.keys(filterTemplateEntries).map((index) => {
		let filterTemplateEntry = filterTemplateEntries[index];
		Object.keys(filterTemplateEntry).map((key) =>{
			let filterTemplateEntryKey=filterTemplateEntry[key];
			if(nodekey === key){
				Object.keys(filterTemplateEntryKey).sort().map((entryKey, entry) => {
					if(filterTemplateEntryKey[entryKey].name !==''){
						let index=actColumns.indexOf(filterTemplateEntryKey[entryKey].name);
						actColumns.splice(index,1);
						selectedColumns.push(filterTemplateEntryKey[entryKey].name);				
					}
				});
				filterTemplateHeader[key]['selectedProp']=selectedColumns;
			}			
		});
	});
	return actColumns;
  };
  /**AND OR functionality */
  addAndTemplate = (key,idx) =>{
	console.log('addAndTemplate:key',key);
	let templateEntriesList = this.state.filterTemplateEntriesList;
	let filterTemplateHeaderList= this.state.filterTemplateHeaderList;
	let templateEntries = this.state.filterTemplateEntriesList[idx];
	let filterTemplateHeader= this.state.filterTemplateHeaderList[idx];
	Object.keys(templateEntries).map((index) =>{
		Object.keys(templateEntries[index]).map((entryKey)=>{
			if(entryKey === key){
				let length=templateEntries[index][entryKey].length;
				let tempKey = (length===0)?length:templateEntries[index][entryKey][length-1].templateKey+1;
				let obj ={}
				obj['name']='';
				obj['value']='';
				obj['type']=(this.state.enableRealTime)?'EQ':'';
				obj['templateKey']=tempKey;
				obj['addition']=true;
				templateEntries[index][entryKey].push(obj);
				//templateEntries[index][entryKey]['enableAnd']=false;
				filterTemplateHeader[key]['enableAnd'] = false;
				filterTemplateHeader[key]['propName'] = this.state.filterDisplay;
			}
		});
	});
	templateEntriesList[idx]=templateEntries;
	filterTemplateHeaderList[idx]=filterTemplateHeader;
	this.setState({filterTemplateHeaderList:filterTemplateHeaderList,filterTemplateEntriesList:templateEntriesList});
  }
  addOrTemplate = (key,name,templateKey,idx) =>{
	console.log('addOrTemplate: key',key);
	let templateEntriesList = this.state.filterTemplateEntriesList;
	let templateEntries = templateEntriesList[idx];
	Object.keys(templateEntries).map((index) =>{
		Object.keys(templateEntries[index]).map((entryKey)=>{
			let templateEntry=templateEntries[index][entryKey];
			if(entryKey === key){
				Object.keys(templateEntry).map((entry)=>{
					if(templateEntry[entry].templateKey === templateKey){
						let value = templateEntry[entry].value;
						let type = templateEntry[entry].type;
						templateEntry[entry].value=value+'^';
						let fType=(this.state.enableRealTime)?'EQ':'';
						templateEntry[entry].type=type+'^'+fType;
						templateEntry[entry].name = name;
					}
				})
			}
		});
	});
	console.log('addOrTemplate templateEntries>>>>',templateEntries);
	templateEntriesList[idx]=templateEntries;
	this.setState({filterTemplateEntriesList:templateEntriesList});
  }
  deleteOrTemplate = (key,templatekey,id,idx) =>{
	console.log('deleteOrTemplate');
	let templateEntriesList = this.state.filterTemplateEntriesList;
	let templateEntries = templateEntriesList[idx];
	let delIndx=parseInt(id.split('-')[1]);
	Object.keys(templateEntries).map((index) =>{
		if(templateEntries[index][key]){
			Object.keys(templateEntries[index][key]).map((i)=>{
				if(templateEntries[index][key][i].templateKey===templatekey){
					let valueArray = templateEntries[index][key][i].value.split('^');
					let typeArray = templateEntries[index][key][i].type.split('^');
					valueArray.splice(delIndx,1);
					typeArray.splice(delIndx,1)
					console.log('valueArray>>>>>>',valueArray);
					templateEntries[index][key][i].value=valueArray.join('^');
					templateEntries[index][key][i].type=typeArray.join('^');
				}
			})			
		}		
	});
	console.log('deleteOrTemplate templateEntries>>>>',templateEntries);
	templateEntriesList[idx]=templateEntries;
	this.setState({filterTemplateEntriesList:templateEntriesList});
  }
  updatePropertyFilter = (listName,idkey) =>{
	console.log('updatePropertyFilter:',listName)
	let keys=idkey.split('#');
	let key=keys[0];
	let idx=parseInt(keys[2]);
	let templateKey=parseInt(keys[1]);
	let filterTemplateHeaderList = this.state.filterTemplateHeaderList;
	let filterTemplateHeader= filterTemplateHeaderList[idx];
	var filterTemplateEntriesList = this.state.filterTemplateEntriesList;
	var filterMap = filterTemplateEntriesList[idx];	  
	filterTemplateHeader[key]['propName']=listName;
	//this.setState({filterTemplateHeader:filterTemplateHeader});	
	let status=false;
	Object.keys(filterMap).forEach((index) =>{
		if(filterMap[index][key]){
			Object.keys(filterMap[index][key]).forEach((i)=>{
				if(filterMap[index][key][i].templateKey === templateKey){
					if(filterMap[index][key][i].name === 'ERROR'){
						filterMap[index][key][i].name= listName;									
						let selectedProp=[];
						console.log('filterTemplateHeader[key][selectedProp]>>>>',filterTemplateHeader[key]['selectedProp']);
						if(filterTemplateHeader[key]['selectedProp']){
							selectedProp=filterTemplateHeader[key]['selectedProp'];
							let indSelect= selectedProp.indexOf(listName);
							if(indSelect !== -1){
								selectedProp=selectedProp.splice(indSelect,1);
								filterTemplateHeader[key]['selectedProp']=selectedProp;
							}					
						}
						filterTemplateHeader[key]['enableAnd'] = true;
						console.log('ERRROOR CONDITION HANDLING!!!!');
						this.templateErrorList[idx].pop();
						this.updateSavedQueryTemplate('add',key,templateKey,filterMap,filterTemplateHeader,idx);
					}else{
						console.log('Regular Scenario>>>>>');
						filterTemplateHeaderList[idx]=filterTemplateHeader;
						this.setState({filterTemplateHeaderList:filterTemplateHeaderList});
					}
				}
			})
		}
	});
  };
  /** */
  prepareDownloadRangeModel = () =>{
	let downloadExcelsFunc= this.getAllExcels;
	if(this.state.isAggregate){
		downloadExcelsFunc=this.downloadAllAggregate;
	}
    let downloadRangeModel = (this.state.showDownloadResultsModal)? <DownloadRangeModel 
              showDownloadResultsModal={this.state.showDownloadResultsModal}
              totalPages={this.state.totalPages}
              totalResults={this.state.totalResults}
              triggerDownload={downloadExcelsFunc}
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
	this.baseState.enableRealTime=!checked;
	this.baseState.header='';	
	this.baseState.templateQuery='';
	this.baseState.filterTemplateEntries=[];
	this.baseState.filterTemplateHeader=[];
	this.baseState.filterTemplateError=false;
	this.baseState.nodeTypeOfDslTemplate=[];
	this.baseState.filterTemplateEntriesList=[];
	this.baseState.filterTemplateHeaderList=[];
	this.baseState.filterTemplateErrorList=[];
	this.baseState.nodeTypeOfDslTemplateList=[];
	this.baseState.templateQueryList=[];
	this.baseState.valueList=[];
	this.dslObject={};
	this.nodeTypeArray=[];
	this.dslObjectList=[];
	this.nodeTypeArrayList=[];
	this.edgesArray=[];
	this.relationsArray=[];
	this.tempDslQuery='';
	this.tempDslQueryList=[];
	this.templateError=[];
	this.templateErrorList={};
	this.setState({...this.baseState},()=>{this.buildDynamicByoq();});	
  }
  templateheaderSaveQuery = (id)=>{
	console.log('templateheaderSaveQuery>>>>>>>>>>>>>',id);
	let templateSavedQuery = '';
	let entityKeyAddition = 1;
	let templateheaderSaveQuery = '';
	let filterTemplateHeaderList = this.state.filterTemplateHeaderList;
	//templateheaderSaveQuery=Object.keys(this.state.filterTemplateEntriesList).map((id)=>{
		//let tempheaderSavedQuery=''
		if(this.state.filterTemplateEntriesList[id].length > 0 && !this.state.filterTemplateErrorList[id]){
				let filterTemplateEntries=this.state.filterTemplateEntriesList[id];
				let staticTemplateFilters = this.state.staticTemplateFiltersList[id];
				templateheaderSaveQuery= <div>
				{Object.keys(filterTemplateEntries).map((index) => {
					let filterTemplateEntry = filterTemplateEntries[index];
					return Object.keys(filterTemplateEntry).map((key) =>{
						let filterTemplateEntryKey=filterTemplateEntry[key];
						let columns =this.populateFilteredColumnOptions(key,id);//this.populateColumnOptions(key);
						return 	<table className='table table-hover table-striped savedQueryTemplate' style={{margin:'0px',padding:'2px'}} id={'table_'+key}>
									<thead>
										<tr>
											<th colSpan='2'>{key.toUpperCase()}</th>
											{this.state.enableRealTime && <th width='20%'></th>}
											<th width={(this.state.enableRealTime)?'30%':'25%'}></th>
											<th width={(this.state.enableRealTime)?'20%':'25%'}>
												<button id={key+'_addAND'} className='btn btn-secondary' disabled ={!filterTemplateHeaderList[id][key]['enableAnd']} type='button' onClick={e => {this.addAndTemplate(key,id)}}>Add Filter</button>
											</th>
										</tr>
									</thead>
									<tbody>
										{Object.keys(filterTemplateEntryKey).sort().map((entryKey, entry) => {
											entityKeyAddition = parseInt(entryKey) + 2;
											let valueArray = filterTemplateEntryKey[entryKey].value.split('^');
											console.log("Comparing Static Array: " + JSON.stringify(staticTemplateFilters) + " with " + key + "|" + filterTemplateHeaderList[id][key]['propName']);
											if(staticTemplateFilters.indexOf(key + "|" + filterTemplateEntryKey[entryKey].name) === -1 ){
											    return(
											    	<tr>
											    		<td width={(this.state.enableRealTime)?'10%':'25%'}>
											    			<label>{'$' + (filterTemplateEntryKey[entryKey].templateKey + 1)}</label>
											    		</td>
											    		<td width={(this.state.enableRealTime)?'20%':'25%'}>
											    			{filterTemplateEntryKey[entryKey].name !== '' && filterTemplateEntryKey[entryKey].name !== 'ERROR' && <label>{filterTemplateEntryKey[entryKey].name}</label>}
											    			{filterTemplateEntryKey[entryKey].name === '' && <SelectFilter param={this.state}
											    				filterList={columns}
											    				id={key+'#'+filterTemplateEntryKey[entryKey].templateKey+'#'+id}
											    				selectedFilter={filterTemplateHeaderList[id][key]['propName']}
											    				onMenuSelect={this.updatePropertyFilter}/>}
											    			{filterTemplateEntryKey[entryKey].name === 'ERROR' && <div className='inputBoxError'><SelectFilter param={this.state}
											    				filterList={columns}
											    				id={key+'#'+filterTemplateEntryKey[entryKey].templateKey+'#'+id}
											    				selectedFilter={this.state.filterDisplay}
											    				onMenuSelect={this.updatePropertyFilter}/></div>}
											    		</td>
											    		{this.filterTags(filterTemplateEntryKey[entryKey].type,filterTemplateEntryKey[entryKey].templateKey,key,id)}
											    		<td width={(this.state.enableRealTime)?'30%':'25%'}>
											    			{Object.keys(valueArray).map((indx) =>{
											    					return(
											    						<div style={{margin:'5px'}}>
											    							{valueArray[indx] === '' && <input id={key+'_'+indx} onBlur={e => this.updateTemplateFilterValues(key,filterTemplateEntryKey[entryKey].templateKey,e.target.value,e.target.id,id)}/>}
											    							{valueArray[indx] !== '' && <input id={key+'_'+valueArray[indx]+'_'+indx} value={valueArray[indx]} onChange={e => this.updateTemplateFilterValues(key,filterTemplateEntryKey[entryKey].templateKey,e.target.value,e.target.id,id)}/>}
											    							{indx == 0 && <button className={(filterTemplateEntryKey[entryKey].name !== '')?'btn btn-primary':'btn btn-secondary'} style={{padding:'2px',margin:'0px 0px 7px 5px'}} disabled={filterTemplateEntryKey[entryKey].name === ''} type='button' onClick={e => {this.addOrTemplate(key,filterTemplateEntryKey[entryKey].name,filterTemplateEntryKey[entryKey].templateKey,id)}}>+</button>}
											    							{indx>0 && <button style={{padding:'2px',margin:'0px 0px 7px 5px'}} id={'delete-'+indx} className='btn btn-danger' type='button' onClick={e => {this.deleteOrTemplate(key,filterTemplateEntryKey[entryKey].templateKey,e.target.id,id)}}>x</button> }
											    						</div>
											    					)
											    			})}
											    		</td>
											    		<td width={(this.state.enableRealTime)?'20%':'25%'}>
											    			{filterTemplateEntryKey[entryKey].addition &&<button id='deleteAnd' className='btn btn-secondary' type='button' onClick={e => {this.updateSavedQueryTemplate('delete',key,filterTemplateEntryKey[entryKey].templateKey,'','',id)}}>Delete</button>}
											    		</td>
											    	</tr>);
											}else {
											    return;
											}
										})}
									</tbody>
								</table>						
								})
						})}
						</div>
		}
		return templateheaderSaveQuery;
  };
  downloadBulkDslToExcel = () =>{
	console.log('downloadBulkDslToExcel>>>>>>>>>>>');		
	let path='bulk-dsl-to-excel';
	this.generatebulkDslToExcel(path,false)
  }
  generatebulkDslToExcel = (path,state) =>{
  	this.setState({isLoading: true});
	Object.keys(settings).forEach((key)=>{
		if(key==='ISAPERTURE' || key==='ISTABULAR'){
			delete settings[key];
		}
	})
	let mergedTabs=this.state.isMergedTabsChecked;
	var payload =  {'headers':{
		'X-DslApiVersion':'V2',
		'use-aperture': this.state.enableRealTime,
		'schema-version': INVLIST.VERSION,
		'merge-tabs':mergedTabs,
		'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		},'dsls': []};
		
	Object.keys(this.state.queryNameList).map((index)=>{
		if(!this.state.filterTemplateErrorList[index]){
			let query=this.formFinalTemplateQuery(index);		
			let obj={
				"query-id": parseInt(index)+1, 
				"query-name": this.state.queryNameList[index], 
				"query-description": this.state.queryDescriptionList[index], 
				"is-aggregate": this.state.isAggregateCheckedList[index], 
				"dsl": query
				};
			payload['dsls'].push(obj);
		}
	});
	var email='';	
	if(state){
		let userid = sessionStorage.getItem(ENVIRONMENT + 'userId');
		if(userid ==='testuid'){// For testing Purpose
			email='AAI-UI-DEV@list.att.com';
		}else{
			email=userid+EMAIL_EXT;
		}		
		payload['headers']['email'] = email;
	}
	console.dir('CustomDSL:payload:' + JSON.stringify(payload));
	commonApi(settings, path, 'POST', payload, '',GlobalExtConstants.OVERRIDE_DOMAIN, null, [{
																"name":"X-DslApiVersion",
																"value": "V2"},
																{
																"name":"use-aperture",
																"value": this.state.enableRealTime
																},
																{
																"name":"schema-version",
																"value":INVLIST.VERSION},
																{
																"name":"accept",
																"value":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
																},{
																"name":"encode-response",
																"value":true}
															])
	.then(res => {			
			let success =true;
			let failures=[];
			if(!state){
				if(res['headers']['failures']){
					failures=res['headers']['failures'].split(',');
					for (var i = 0; i < failures.length; i++) {
						var a = failures[i].split('|');
						a.splice(1, 1);
						failures[i] = a.join();
					}
					success=false;
				}else{
					let filename='';
					if(res['headers']['content-disposition']){
						filename=res['headers']['content-disposition'].split('=')[1];
					}else if(res['headers']['Content-Disposition']){
						filename=res['headers']['content-disposition'].split('=')[1];
					}
					const blob = new Blob([this.s2ab(atob(res.data))],
					{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'});
					const url = window.URL.createObjectURL(blob);
					const anchor = document.createElement('a');
					document.body.appendChild(anchor);
					anchor.href = url;
					anchor.download = filename;
					anchor.click();
					window.URL.revokeObjectURL(url);
				}
				this.setState({
					isLoading: false,
					downloadTemplateStatus:success,
					failedDownloadedTemplate:failures,
					failedDownloadedTemplateMsg:'',
					failedEmailTemplateMsg:'',
					emailTriggerMsg:''
				},()=>{GeneralCommonFunctions.scrollTo("downloadTemplateStatusAlert");});							
			}else{
				let emailTriggerMsg='';
				let failedEmailTriggerMsg='';
				success=false;
				failures=[];
				if(res.status === 202){
					emailTriggerMsg='The job has been successfully triggered. The results will be emailed to '+ email +' when finished.'
				}else{
					failedEmailTriggerMsg='Failed to Generate an Email for selected template queries';
				}
				this.setState({
					isLoading: false,
					downloadTemplateStatus:success,
					failedDownloadedTemplate:failures,
					failedDownloadedTemplateMsg:'',
					failedEmailTemplateMsg:failedEmailTriggerMsg,
					emailTriggerMsg:emailTriggerMsg
				},()=>{GeneralCommonFunctions.scrollTo("downloadTemplateStatusAlert");});
			}				
		}).catch(error => {
			console.log('Bulk download xls Catch the Error>>>>>',error.response);
			let ErrorMessage=(state)?'Failed to Generate an Email for selected template queries':'Failed to Download selected template queries';
			if (error.response && error.response.data) {
				if(error.response.data.status){
					ErrorMessage += " Code: " + error.response.data.status;
				}
				if(error.response.data.msg){
					ErrorMessage += " - " + JSON.stringify(error.response.data.msg);
			  }
			}
			if(state){
				this.setState({
					isLoading: false,
					downloadTemplateStatus:false,
					failedDownloadedTemplate:[],
					failedDownloadedTemplateMsg:'',
					failedEmailTemplateMsg:ErrorMessage
				},()=>{GeneralCommonFunctions.scrollTo("downloadTemplateStatusAlert");});
			}else{
				this.setState({
					isLoading: false,
					downloadTemplateStatus:false,
					failedDownloadedTemplate:[],
					failedDownloadedTemplateMsg:ErrorMessage,
					failedEmailTemplateMsg:'',
					emailTriggerMsg:''
				},()=>{GeneralCommonFunctions.scrollTo("downloadTemplateStatusAlert");});
			}
			
		});
  }
  s2ab=(s)=> {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
  }
  templateList = () =>{
	var filterTypeHeader='';
	if(APERTURE_SERVICE){		
		filterTypeHeader =  (this.state.enableRealTime)?<th scope='col' width='20%'>Filter Type</th>:''; 
	}
	var listOfTemplate=[];
	Object.keys(this.state.filterTemplateEntriesList).map((idx)=>{
		let templateList =<div id={"template_"+idx} className="col-lg-10 templateview">
						{this.state.filterTemplateEntriesList[idx].length > 0 && !this.state.filterTemplateErrorList[idx] &&
					  		<div className='card d3-model-card model-card-content'>
							  <Alert id='saveSuccess' bsStyle='success' className={this.state.saveSuccessfulMsg && !this.state.isEditModal ? 'show' : 'hidden'} onDismiss={() => this.setState({saveSuccessfulMsg: false})}>
								  <h3>Query Saved Successfully</h3>
								  <p>
									  {this.state.saveSuccessfulMsg}
								  </p>
							</Alert>
							<div className='card-header'>
								<div>
									<h3><strong>{parseInt(idx)+1}.{this.state.queryNameList[idx]}</strong> - {this.state.queryDescriptionList[idx]}</h3>
								</div>
							</div>
							<div>
								<div className='card-header'>
									<h5>{this.state.templateQueryList[idx]}</h5>
								</div>
								<table className="table table-hover table-striped" style={{margin:'0px',padding:'2px'}}>
									<thead>
										<tr>
											<th scope="col" width={(this.state.enableRealTime)?'10%':'25%'}>Filter Key</th>
											<th scope="col" width={(this.state.enableRealTime)?'20':'25%'}>Filter Name</th>
											{filterTypeHeader}
											<th scope="col" width={(this.state.enableRealTime)?'30%':'25%'}>Filter Value</th>
											<th scope="col" width={(this.state.enableRealTime)?'20%':'25%'}> Action</th>
										</tr>
									</thead>
								</table>
							</div>
							<div className='card-content model-card-content' style={{margin:'0px'}}>									
								{this.templateheaderSaveQuery(idx)}                               
							 </div>
							<div className='card-footer'>
								<button id='runSavedQuery' className='btn btn-primary btn-space' type='button' onClick={e => {this.runTemplate(idx)}}>Run Query</button>
								<button id='manualEditQuery' className='btn btn-secondary btn-space' type='button' onClick={e =>{this.showEditDSLModal(idx)}} disabled={this.templateError.length>0}>Manual Edit & Run</button>
								<button id='saveQuery' className='btn btn-outline-secondary btn-space' type='button' onClick={e =>{this.saveTemplate(idx)}} disabled={this.templateError.length>0}>Save</button>
								<div className="checkbox">
									<label>
									<input type="checkbox" id='aggregateObjects' checked={this.state.isAggregateCheckedList[idx]} onChange={this.onAggregateCheckbox.bind(this)} />
									Aggregate Objects
									</label>
								</div>
							</div>
					 </div>
				}
				{this.state.queryNameList[idx] && this.state.filterTemplateEntriesList[idx].length === 0 && !this.state.filterTemplateErrorList[idx] &&
					<div className='addPaddingTop alert alert-warning' role="alert">
					  No filters present to populate for this saved query, please run as is or edit the query manually and run.
					</div>
				}
				{this.state.filterTemplateErrorList[idx] &&
				  <div className='addPaddingTop alert alert-danger' role="alert">
					An error occurred in parsing the template, please try a different template or contact the data steward to resolve this issue.
				  </div>
				}
		</div>;
		listOfTemplate.push(templateList);
	});	
	console.log('listOfTemplate>>>>>#####>>>>>>>',listOfTemplate);
	return listOfTemplate;
  }


  render(){
	let downloadRangeModel = this.prepareDownloadRangeModel();
	let templateList= this.templateList();
	var toggelRealtimeAnalysis = '';
	var emailCheckbox = <div className={(this.dslObjectList.length>0)?'show':'hidden'}>
							<div className="checkbox">
								<OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{'Report will be generated and emailed to '+sessionStorage.getItem(ENVIRONMENT + 'userId')+'@att.com when finished'}</Tooltip>}>
									<span className="d-inline-block" style={{display: 'inline-block'}}>
										<Button bsSize='small' disabled={(this.dslObjectList.length===0)} onClick={() => {this.onGenerateEmailButton()}}>
											Generate & Email <i className='icon-documents-folder'></i>
										</Button>
									</span>
								</OverlayTrigger>
							</div>
						</div>
	var mergedTabs = <div className={(this.dslObjectList.length>0)?'show':'hidden'}>
						<div className="checkbox">
							<label>
								<input type="checkbox" checked={this.state.isMergedTabsChecked} onChange={this.onMergedTabsCheckbox.bind(this)} />
								Merge Tabs
							</label>
						</div>
					 </div>
	var downloadAllTemplateQueries = <div className={(this.dslObjectList.length>0)?'show':'hidden'}>
										<OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{this.downloadBulkTooltip}</Tooltip>}>
											<span className="d-inline-block" style={{display: 'inline-block'}}>
												<Button bsSize='small' disabled={(this.dslObjectList.length===0)} onClick={() => {this.downloadBulkDslToExcel()}}>
													Download Loaded Queries <i className='icon-documents-downloadablefile'></i>
												</Button>
											</span>
										</OverlayTrigger>										
								 	</div>
	let downloadTemplateStatusAlert= <div className={(this.dslObjectList.length>0)?'show':'hidden'}>
										<Alert id="saveSuccess" bsStyle="success" className={(this.state.downloadTemplateStatus && this.state.failedDownloadedTemplate.length===0)?'show':'hide'} onDismiss={() => this.setState({
												downloadTemplateStatus:false,
												failedDownloadedTemplate:[],
												failedDownloadedTemplateMsg:'',
												failedEmailTemplateMsg:'',
												emailTriggerMsg:''})}>
											<h3>Download Loaded Templates are  Successfully</h3>
											<p>
												The selected templates downloaded successfull.
											</p>
										</Alert>
										{this.state.failedDownloadedTemplate.length>0 && <Alert id="saveFailure" bsStyle="danger"  onDismiss={() => this.setState({
												downloadTemplateStatus:false,
												failedDownloadedTemplate:[],
												failedDownloadedTemplateMsg:'',
												failedEmailTemplateMsg:'',
												emailTriggerMsg:''})}>
											<h3>Download Loaded Templates are Failed</h3>
											<p>											
												{this.state.failedDownloadedTemplate.toString()} templates are failed to download.Please refer the downloaded spreadsheet for more details.
											</p>
										</Alert>}
										{this.state.failedDownloadedTemplateMsg !=='' && <Alert id="saveFailure" bsStyle="danger" onDismiss={() => this.setState({
												downloadTemplateStatus:false,
												failedDownloadedTemplate:[],
												failedDownloadedTemplateMsg:'',
												failedEmailTemplateMsg:'',
												emailTriggerMsg:''})}>
											<h3>Download Loaded Templates are Failed</h3>
											<p>											
												{this.state.failedDownloadedTemplateMsg}
											</p>
										</Alert>}
										{this.state.emailTriggerMsg !=='' && <Alert id="saveSuccess" bsStyle="success" onDismiss={() => this.setState({failedEmailTemplateMsg:'',emailTriggerMsg:''})}>
											<h3>Generate & Email Triggered</h3>
											<p>											
												{this.state.emailTriggerMsg}
											</p>
										</Alert>}
										{this.state.failedEmailTemplateMsg !=='' && <Alert id="saveFailure" bsStyle="danger" onDismiss={() => this.setState({failedEmailTemplateMsg:'',emailTriggerMsg:''})}>
											<h3>Generate & Email Templates is Failed</h3>
											<p>											
												{this.state.failedEmailTemplateMsg}
											</p>
										</Alert>}										
									</div>
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
		const inputProps = {
			placeholder: 'Please enter a query',
			value: this.state.value,
			onChange: this.onChange,
			onSelect: this.onSelect,
			onClick: this.onClick
		};

		let nodes = [];
		if ( this.state.isAggregate && this.state.aggregateNodes.length > 0 ) {

			console.log('nodes exist', JSON.stringify(this.state.aggregateNodes[0]));
            if(this.state.isAggregate && this.state.viewName === 'CardLayout'){
                var nodeDetails = this.state.aggregateNodes.map(entry => {
                                                           return <Col lg={4} md={4} sm={6} xs={12}>
                                                                   <div className='card aggregate-card'>
                                                                        <div className='card-header'>
                                                                          <h4 className='card-title'>{entry.nodePath}</h4>
                                                                        </div>
                                                                        <div className='card-content aggregate-card-content'>
                                                                        <span>
                                                                    {entry && typeof entry.map === 'function' && entry.map(subEntry =>
                                                                         {  let nodesPropList={};
																			return Object.keys(subEntry).map((node) => {
																						 console.log("subentry : " + JSON.stringify(node + ' ' + JSON.stringify(subEntry[node])));
																						 let description='';
																						 let nodeType=subEntry[node]['node-type'];
																						 if(!nodesPropList[nodeType]){																							
																							var requiredParams = buildAttrList(nodeType,[],'mandatory');
																							nodesPropList[nodeType]=requiredParams;
																						 }
                                                                                         return (<span>
                                                                                                     {this.state.associatedNodesEnabled && (<Alert bsStyle="info"><strong>{node}</strong></Alert>)}
                                                                                                     {Object.keys(subEntry[node].properties).map((key)=>{
																										 let propKey=key.split('|')[1];
																										 let found=true;
																										 for(var a in nodesPropList[nodeType]){
																											if(propKey===nodesPropList[nodeType][a].value){
																												found=false;
																												return (<p className="aggregate-attribute"><strong title={nodesPropList[nodeType][a].description}>{key}</strong> : {"" + subEntry[node].properties[key]}</p>);
																											}
																										 }
																										 if(found){
																											return (<p className="aggregate-attribute"><strong>{key}</strong> : {"" + subEntry[node].properties[key]}</p>);
																										 }                                                                                                        
                                                                                                     })
                                                                                                     }
                                                                                                 </span>)
                                                                                     })
                                                                         })
                                                                     }

                                                                          {this.state.associatedNodesEnabled && (<Alert bsStyle="info"><strong>{entry.fullPath}</strong></Alert>)}
                                                                        </span>
                                                                        </div>
                                                                    </div>
                                                                   </Col>;
                                                   });
                nodes =
                <div className='model-container'>
                	{nodeDetails}
                </div>;
            }else if(this.state.isAggregate && this.state.viewName === 'CellLayout'){
               if(this.state.aggregateAttrList.length > 0 && this.state.aggregatePaths){
                   var types = this.state.aggregatePaths;
                   var type = types[0];
                   let tabs=types.map((nodeType,index) => {
			   if(this.state.tabularAggregateData[nodeType] && this.state.tabularAggregateColumns[nodeType]){
	                     return(
	                       <Tab eventKey={nodeType} title={nodeType}>
	                         <BootstrapTable
	                             id={nodeType}
	                             keyField='id'
	                             data={this.state.tabularAggregateData[nodeType]}
	                             columns={this.state.tabularAggregateColumns[nodeType]}
	                             bordered={ true }
	                             headerClasses='table-header-view'
	                             columnFilter={ true }
	                             filter={ filterFactory() }
	                             bootstrap4 striped hover condensed
	                         />
	                       </Tab>
	                     )
			   }
	           });

		    nodes =
		    	 <div>
				<button type='button' className={(this.state.disableFilter)? 'btn btn-outline-secondary' : 'btn btn-primary'} disabled={this.state.disableFilter} onClick={() => {this.isTableFilterForAggregation(this.state.columnFilter,this.state.tabularAggregateColumns[type])}} style={{float: 'right', margin: '2px'}}>Apply Filters (All)</button>
                         	<Tabs defaultActiveKey={type} id="multipleTabularView">
                          		{tabs}
                        	</Tabs>
			 </div>;
                }
            }else if(this.state.isAggregate && this.state.viewName === 'VisualLayout'){
                     nodes = <span></span>;
            }
		}else if (this.state.nodes.length > 0){
		    const modelGalleryElement = <ModelGallery
            								nodes={this.state.nodes}
            								viewName={this.state.viewName}
            								historyStackString={this.props.location.historyStackString}
            								openHistoryModal={this.openHistory}
            								isPageNumberChange={this.state.isPageNumberChange}
            								resetColumnInd={this.state.resetColumnFilters}
									isTableFilterApply={this.isTableFilterApply}
									dslQuery={this.state.value}
									enableRealTime={this.state.enableRealTime}
									tableFilterAliasColumns={this.tableFilterAliasColumns}/>;
            nodes =
            <div className='model-container'>
            	{modelGalleryElement}
            </div>;
		}				
	return(
		<div>
			{toggelRealtimeAnalysis}
			<div className='addPadding customDsl'>
		    <div className='static-modal'>
					<Modal show={this.state.showHistoryModal} onHide={this.closeHistory}>
						<Modal.Header>
							<Modal.Title>Retrieve {(this.state.focusedNodeType) ? this.state.focusedNodeType: ' BYOQ Query '} History</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form className={this.state.showModelOptions ? 'show' : 'hidden'} id='historyForm' name='historyForm'>
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
        	<Modal show={this.state.showEditModal} onHide={this.closeEditDSLModal}>
        		<Modal.Header>
        			<Modal.Title>Edit DSL Query</Modal.Title>
        		</Modal.Header>
        		<Modal.Body>
                    <form id='dslQueryEditable' name='dslQueryEditable'>
                        <FormGroup controlId="dslQuery">
                              <ControlLabel>DSL Query</ControlLabel>
                              <FormControl className="template-textarea" onChange={this.bindEdits.bind(this)} value={this.state.editModel} componentClass="textarea" placeholder="Enter DSL Query" />
                         </FormGroup>
                    </form>
        		</Modal.Body>
        		<Modal.Footer>
        			<Button onClick={this.closeEditDSLModal}>Close</Button>
        			<Button onClick={this.submitEditAndRunDSL}>Submit</Button>
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
														enableRealTime={this.state.enableRealTime}/>
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
                  		<Modal show={this.state.showSaveModal} onHide={this.closeSaveModal} dialogClassName="modal-override">
                  		    <Spinner loading={this.state.enableSaveBusyFeedback}>
                  			    <Modal.Header>
                  			    	<Modal.Title>{this.state.isEditModal ? 'Edit' : 'Save'} DSL Query</Modal.Title>
                  			    </Modal.Header>
                  			    <Modal.Body>
                  			         <Alert id="saveFailure" bsStyle="danger" className={this.state.saveFailureMsg ? 'show' : 'hidden'} onDismiss={() => this.setState({saveFailureMsg: false})}>
                                         <h3>Query Save Failed</h3>
                                         <p>
                                           {this.state.saveFailureMsg}
                                         </p>
                                     </Alert>
                                    <form className={!this.state.showQueryExistsWarning ? 'show' : 'hidden'} id='saveDslQueryForm' name='saveDslQueryForm'>
                                      <FormGroup controlId="queryName">
                                           <ControlLabel>Query Name</ControlLabel>
										  {!this.state.isEditModal && (<input id='dslNameHelp' type='name' className='form-control' id='queryName' aria-describedby='dslNameHelp' placeholder='Enter query name' value={this.state.queryName} onChange={this.handleQueryNameChange}/>)}
										  {!this.state.isEditModal && (<small id='queryNameHelp' className='form-text text-muted'>Select a name for your saved query, do not reuse names.</small>)}
										  {this.state.isEditModal && (<p>{this.state.queryName}</p>)}
                                      </FormGroup>
                                      <FormGroup controlId="queryDescription">
                                           <ControlLabel>Query Description</ControlLabel>
                                           <FormControl componentClass="textarea" id="queryDescription" aria-describedby="queryDescriptionHelp" placeholder="Enter query description" value={this.state.queryDescription} onChange={this.handleQueryDescriptionChange} />
                                           <small id="queryDescriptionHelp" className="form-text text-muted">Be as descriptive as possible to describe the purpose of the saved query (this will be searchable)</small>
                                      </FormGroup>
				      <FormGroup controlId="category">
                                           <ControlLabel>Category</ControlLabel>
                                           <input id='category' type="name" className="form-control"  aria-describedby="category of SavedQuery" placeholder="Enter category" value={this.state.category} onChange={this.handleCategoryChange}/>
                                      </FormGroup>
                                      <FormGroup controlId="privacy_indicator">
                                        {this.state.isDataSteward && (<div className="checkbox">
                                           <label>
                                             <input type="checkbox" checked={this.state.isPublicChecked} onChange={this.onPublicCheckbox.bind(this)} />
                                             Public
                                           </label>
                                        </div>)}
                                        <div className={"checkbox " + ((!this.state.isPublicChecked || !this.state.isDataSteward) ? 'show' : 'hidden')}>
                                           <label>
                                             <input type="checkbox" checked={this.state.isCommunitySharedChecked} onChange={this.onCommunitySharedCheckbox.bind(this)} />
                                             Share with Community
                                           </label>
                                        </div>
                                        {!this.state.isDataSteward && (<ControlLabel>Personal Query</ControlLabel>)}
                                      </FormGroup>
                                      <FormGroup controlId='aggregate'>
										  {this.state.isAggregateChecked && !(this.state.isEditModal || this.state.isSavedQueryFlow) && (<ControlLabel>Aggregate Query</ControlLabel>)}
										  {!this.state.isAggregateChecked && !(this.state.isEditModal || this.state.isSavedQueryFlow) && (<ControlLabel>Standard Query</ControlLabel>)}
										  {(this.state.isEditModal || this.state.isSavedQueryFlow) && (<div className='checkbox'>
											  <label>
												  <input type='checkbox' checked={this.state.isAggregateChecked} onChange={this.onAggregateCheckbox.bind(this)}/>
												  Aggregate Query
											  </label>
										  </div>)}
									  </FormGroup>
                                      <FormGroup controlId='queryDSL'>
                                           <ControlLabel>DSL Query</ControlLabel>
										  {!this.state.isEditModal && !this.state.isSavedQueryFlow ? <p>{this.state.value}</p> : <FormControl componentClass='textarea' id='queryDSL' aria-describedby='queryDSLHelp' placeholder='Enter dsl query' value={this.state.value} onChange={this.handleQueryChange} />}
									  </FormGroup>
									  <FormGroup controlId='templateDetails'>
									    <Spinner loading={this.state.enableTreeLoadBusyFeedback}>
									       <div className={!this.state.treeLoadErrMsg ? 'show' : 'hidden'}>
                                                <ControlLabel>Configuration Template Details - check for configurable, uncheck for static</ControlLabel>
                                                {Object.keys(this.state.dslConfigArray).map(key => {
                                                     return (this.state.dslConfigArray[key].filters).map(filter =>{
                                                         return (<div className='checkbox'>
                                                                 	  <label>
                                                                 		  <input type='checkbox' checked={this.state.staticTemplateFilters.indexOf(key + '|' + filter) === -1} onChange={(e) => {this.onDslConfigCheckbox(e, key + '|' + filter)}} />
                                                                 		  {key} - {filter}
                                                                 	  </label>
                                                                 </div>)
                                                     })
                                                  })
                                                }
                                           </div>
                                           <Alert bsStyle="danger" className={this.state.treeLoadErrMsg ? 'show' : 'hidden'}>
                                                <h3>Error Loading Configurable Filters</h3>
                                                <p>
                                                  {this.state.treeLoadErrMsg}
                                                </p>
                                            </Alert>
                                        </Spinner>
                                      </FormGroup>
                                    </form>
                                    <Alert bsStyle="warning" className={this.state.showQueryExistsWarning ? 'show' : 'hidden'} onDismiss={() => this.setState({showQueryExistsWarning: false})}>
                                        <h3>Query Name Already Exists</h3>
                                        <p>
                                          There is already a query with the name {this.state.queryName}, do you wish to overwrite the existing query?
                                        </p>
                                    </Alert>
                  			    </Modal.Body>
                  			    <Modal.Footer className={!this.state.showQueryExistsWarning ? 'show' : 'hidden'}>
                                	<Button onClick={this.closeSaveModal}>Close</Button>
                                	<Button disabled={this.state.queryName.trim() === '' || this.state.queryDescription.trim() === ''} onClick={() => {this.submitSave()}}>Save</Button>
                                </Modal.Footer>
                                <Modal.Footer className={this.state.showQueryExistsWarning ? 'show' : 'hidden'}>
                                	<Button onClick={() => this.setState({showQueryExistsWarning : false})}>No</Button>
                                	<Button onClick={() => {this.submitSave(true)}}>Yes</Button>
                                </Modal.Footer>
                            </Spinner>
                  		</Modal>
        </div>
			<div id="jumbotron" className='row'>
				<div className={'row container-fluid my-4 '  + (this.state.isDSLFlow ? 'show' : 'hidden')}>
					<div className='col-lg-12'>
						<header className='jumbotron'>
                                    <h1 className='display-2'><strong>B</strong>uild <strong>Y</strong>our <strong>O</strong>wn <strong>Q</strong>uery</h1>
                                    <p className='lead'>
                                      On this page you have the ability to craft your own query to retrieve objects from the database.
                                      There are help menus in the accordions and a modal triggered from the light bulb icon to help with syntax.
                                      There are is also a typeahead feature that will help you build your query as you type, providing valid nodes and attributes to use.
                                    </p>
                        </header>
					</div>
				</div>
				<div className={'row container-fluid my-4 '  + (this.state.isSavedQueryFlow ? 'show' : 'hidden')}>
                    <div className='col-lg-12'>
                    	<header className='jumbotron'>
                                    <h1 className='display-2'>Saved Queries</h1>
                                    <p className='lead'>
                                      On this page you have the ability to load and run previously saved queries.
                                      You can run them as they are saved or choose to load them to replace the filters
                                      in the template.
                                    </p>
                        </header>
                    </div>
				</div>
		    </div>
		    <div className='row'>
			    <div className={'addPadding col-md-12 ' + (this.state.isSavedQueryFlow ? 'show' : 'hidden')}>
					<div className='row'>
						<div className='col-lg-10'>
							<Alert id="saveSuccessEdit" bsStyle="success" className={this.state.saveSuccessfulMsg && this.state.isEditModal ? 'show' : 'hidden'} onDismiss={() => this.setState({saveSuccessfulMsg: false})}>
								<h3>Query Saved Successfully</h3>
								<p>
									{this.state.saveSuccessfulMsg}
								</p>
							</Alert>
						</div>
					</div>
			        <CustomDSLSaveLoad loadCallback={this.loadCallback} loadBulkCallback={this.loadBulkCallback} setQueriesState={this.setQueriesState} ref={this.saveLoadComponent} isDataSteward={this.state.isDataSteward} isSavedQueryFlow={this.state.isSavedQueryFlow} editCallback={this.editCallback}/>
				<div className='col-xs-1'>
					<a href={INVLIST.USERGUIDE_URL} target="_blank">
						<i className="dsl-hint icon-documents-manual"></i>
					</a>
					<pre>User<br />Guide</pre>
				</div>
				<div className='col-lg-11'><InfoToggle/></div>
			</div>
			<div className='row'>
				<div className='col-md-12' id='templateList'>
					{templateList}
				</div>
				<div className='col-md-10'  id='downloadTemplateStatusAlert'>
					<div className='col-md-6'>
						{downloadTemplateStatusAlert}
					</div>
					<div className='col-md-6'>
						<div style={{float:'right'}}>
							{emailCheckbox}
						</div>
						<div style={{float:'right',margin: '10px'}}>
							{downloadAllTemplateQueries}
						</div>
						<div style={{float:'right',margin: '10px'}}>
							{mergedTabs}
						</div>											
					</div>
				</div>				
				</div>			        
				<div className={'addPadding col-md-9 ' + (this.state.isDSLFlow ? 'show' : 'hidden')}>
					<form onSubmit={this.onAddItem} id='byoqFormForQuery' name='byoqFormForQuery'>
					<div className='row'>
						<div className='col-lg-9 form-group'>
						    <Alert id="saveSuccess" bsStyle="success" className={this.state.saveSuccessfulMsg ? 'show' : 'hidden'} onDismiss={() => this.setState({saveSuccessfulMsg: false})}>
			                                <h3>Query Saved Successfully</h3>
			                                <p>
			                                  {this.state.saveSuccessfulMsg}
			                                </p>
			                            </Alert>
							<div id="byoqInput"><label htmlFor='newQuery'>Build Your Own Query</label></div>
							<div className={this.state.isTypeahead ? 'show' : 'hidden'}>
								<Autosuggest
								suggestions={this.state.suggestions}
								onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
								onSuggestionsClearRequested={this.onSuggestionsClearRequested}
								getSuggestionValue={this.getSuggestionValue}
								renderSuggestion={this.renderSuggestion}
								inputProps={inputProps}
								shouldRenderSuggestions={this.shouldRenderSuggestions}
								onSuggestionSelected={this.onSuggestionSelected}
								ref={this.storeInputReference}
								/>
							</div>
							<div className={this.state.isTypeahead ? 'hidden' : 'show'}>
								<FormControl componentClass="textarea"
								rows="4"
								onChange={this.onTextAreaChange}
								style={{width: '655px'}}
								value={this.state.value}
								/>
							</div>
						</div>
					<div className='col-xs-1'>
						<a href={INVLIST.USERGUIDE_URL} target="_blank">
							<i className="dsl-hint icon-documents-manual"></i>
						</a>
						<pre>User<br />Guide</pre>
					</div>
						<InfoToggle/>
						<div className='col-xs-1'>
							<i className='dsl-hint icon-misc-ideation' onClick={this.hint} ></i>
							<pre>Hint</pre>
						</div>
						<div className='static-modal'>
							<Modal show={this.state.showModal} onHide={this.close}>
								<Modal.Header>
									<Modal.Title>DSL Syntax</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									{
										this.state.hintHtml.map(hints => {
										return <div key={hints.notation}>
										<label>{hints.notation}</label> =>
										<pre style={{color: 'blue'}}>  {hints.description}</pre>
										</div>;
										})
									}
								</Modal.Body>
								<Modal.Footer>
									<Button onClick={this.close}>Close</Button>
								</Modal.Footer>
							</Modal>
						</div>						
					</div>
					<div className='row'>
						<div className='col-sm-10'>
							<button id='runByoqQuery' className='btn btn-primary' type='submit'>Run</button>
							{ !INVLIST.IS_ONAP &&(<button id='saveByoqQuery' className='btn btn-outline-secondary'  type='button' disabled={this.state.value.trim() === ''} onClick={this.openSaveModal}>Save</button>)}
							{ INVLIST.isHistoryEnabled && (<button id='historyByoqQuery' className='btn btn-outline-secondary' type='button' disabled={this.state.value.trim() === ''} onClick={this.openHistory}>History</button>)}
							<button id='clearByoqQuery' className='btn btn-outline-secondary' type='button' onClick={this.clear}>Clear</button>
							<Toggle
								id="typeAheadToggle"
								defaultChecked={this.state.isTypeahead}
								checked={this.state.isTypeahead}
								className='toggle-theme'
								onChange={this.handleTypeaheadChange} />
							<span className='addPaddingLeft'>Typeahead</span>
            			</div>
					</div>
				</form>
				<div className={this.state.isInitialLoad ? 'hidden' : 'show'} id='dslInputError'>
					<Row className={this.state.validInput ? 'hidden' : 'show show-grid'}>
					  <Col md={12}>
						<span className='label badge-pill label-danger'><strong>Error </strong>: Please enter a valid query input</span>
					  </Col>
					</Row>
				</div>
				<div className="checkbox">
                   <label>
                     <input type="checkbox" id='aggregateObjectsChkbox' checked={this.state.isAggregateChecked} onChange={this.onAggregateCheckbox.bind(this)} />
                     Aggregate Objects
                   </label>
                   {this.state.isAggregateChecked && (<label>
                     <input id='includeAssociatedNodes' type="checkbox" checked={this.state.associatedNodesEnabled} onChange={this.onAssociatedNodesCheckbox.bind(this)} />
                     Include Associated Nodes
                   </label>)}
                </div>
			    <CustomDSLSaveLoad loadCallback={this.loadCallback} loadBulkCallback={this.loadBulkCallback} setQueriesState={this.setQueriesState} ref={this.saveLoadComponentDsl} isDataSteward={this.state.isDataSteward} editCallback={this.editCallback}/>
			</div>
			<div className={'col-lg-2 col-md-12 ' + (this.state.isDSLFlow ? 'show' : 'hidden')}>
            	<PanelGroup accordion id='rb-accordion'>
            		<Panel eventKey='1'>
            		<Panel.Heading>
            			<Panel.Title toggle>+ Simple Queries</Panel.Title>
            		</Panel.Heading>
            		<Panel.Body collapsible>
						<div className='cardwrap'>
							<div className='cardWrapHeaderTxt'>
								<label>{this.state.simpleQueries.abstract}</label>
							</div>
							<div>
							{this.state.simpleQueries.notation.map(entry => {
								return (
									<div key={entry.notation}>
									<b><label>{entry.notation}</label></b> =>
									<span style={{color: 'blue'}}> {entry.description}</span>
								</div>
								);
							})}
							</div>
						</div>
            		</Panel.Body>
            		</Panel>
            		<Panel eventKey='2'>
            			<Panel.Heading>
            				<Panel.Title toggle>+ Traversal Queries</Panel.Title>
            			</Panel.Heading>
            			<Panel.Body collapsible>
							<div className='cardwrap'>
								<div className='cardWrapHeaderTxt'>
									<label>{this.state.traversalQueries.abstract}</label>
								</div>
								<div>
									{this.state.traversalQueries.notation.map(entry => {
									return (
										<div key={entry.notation}>
											<b><label>{entry.notation}</label></b> =>
											<span style={{color: 'blue'}}> {entry.description}</span>
										</div>
									);
									})}
								</div>
							</div>
            			</Panel.Body>
            		</Panel>
            		<Panel eventKey='3'>
            			<Panel.Heading>
            				<Panel.Title toggle>+ Union Queries</Panel.Title>
            			</Panel.Heading>
            			<Panel.Body collapsible>
							<div className='cardwrap'>
								<div className='cardWrapHeaderTxt'>
									<label>{this.state.unionQueries.abstract}</label>
								</div>
								<div>
									{this.state.unionQueries.notation.map(entry => {
									return (
										<div key={entry.notation}>
											<b><label>{entry.notation}</label></b> =>
											<span style={{color: 'blue'}}> {entry.description}</span>
									</div>
									);
									})}
								</div>
							</div>
            			</Panel.Body>
            		</Panel>
            		<Panel eventKey='4'>
            			<Panel.Heading>
            				<Panel.Title toggle>+ Limit Queries</Panel.Title>
            			</Panel.Heading>
            			<Panel.Body collapsible>
							<div className='cardwrap'>
								<div className='cardWrapHeaderTxt'>
									<label>{this.state.limitQueries.abstract}</label>
								</div>
								<div>
									{this.state.limitQueries.notation.map(entry => {
									return (
										<div key={entry.notation}>
											<b><label>{entry.notation}</label></b> =>
											<span style={{color: 'blue'}}> {entry.description}</span>
									</div>
									);
									})}
								</div>
							</div>
            			</Panel.Body>
            		</Panel>
            		<Panel eventKey='5'>
            			<Panel.Heading>
            				<Panel.Title toggle>+ Negation Queries</Panel.Title>
            			</Panel.Heading>
            			<Panel.Body collapsible>
							<div className='cardwrap'>
								<div className='cardWrapHeaderTxt'>
									<label>{this.state.negationQueries.abstract}</label>
								</div>
								<div>
									{this.state.negationQueries.notation.map(entry => {
									return (
										<div key={entry.notation}>
											<b><label>{entry.notation}</label></b> =>
											<span style={{color: 'blue'}}> {entry.description}</span>
										</div>
									);
									})}
								</div>
							</div>
            			</Panel.Body>
            		</Panel>
            		<Panel eventKey='6'>
            			<Panel.Heading>
            				<Panel.Title toggle>+ Topology Queries</Panel.Title>
            			</Panel.Heading>
            			<Panel.Body collapsible>
							<div className='cardwrap'>
								<div className='cardWrapHeaderTxt'>
									<label>{this.state.topologyQueries.abstract}</label>
								</div>
								<div>
									{this.state.topologyQueries.notation.map(entry => {
									return (
										<div key={entry.notation}>
											<b><label>{entry.notation}</label></b> =>
											<span style={{color: 'blue'}}> {entry.description}</span>
										</div>
									);
									})}
								</div>
							</div>
            			</Panel.Body>
            		</Panel>
                <Panel eventKey='7' className={(this.state.enableRealTime) ? 'show' : 'hidden'}>
                  <Panel.Heading>
                    <Panel.Title toggle>+ Advanced Queries</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <div className='cardwrap'>
                      <div className='cardWrapHeaderTxt'>
                        <label>{this.state.advancedQueries.abstract}</label>
                      </div>
                      <div>
                        {this.state.advancedQueries.notation.map(entry => {
                          return (
                            <div key={entry.notation}>
                              <b><label>{entry.notation}</label></b> =>
                              <span style={{color: 'blue'}}> {entry.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Panel.Body>
                </Panel>
            	</PanelGroup>
            </div>
            </div>
            <div className='row'>
			<div className='multipleNodes' id="outputBlock">
			<Spinner loading={this.state.isLoading && this.state.isInitialLoad}>
			</Spinner>
				<div className={this.state.isInitialLoad ? 'hidden' : 'show'}>
					<Spinner loading={this.state.isLoading} fullscreen={true}>
						<div className={this.state.validInput ? 'show' : 'hidden'}>
					    <Col md={12}>
						    <h2 className='pre-wrap-text'>{this.state.header}</h2>
						    <br/>
						    <h5>Total Results: <strong>{this.state.totalResults}</strong></h5>
						</Col>
						{this.state.showResults && <div className="addPaddingTop" >
						    <OutputToggle scope={this} visualDisabled={this.state.totalResults > PAGINATION_CONSTANT}/>
						</div> }
						{!this.state.isAggregate && (<div id="standardOutput" className="col-md-12">
						    <Row className={this.state.showResults ? 'show' : 'hidden'}>
						    	<Col md={8} className={this.state.showPagination ? 'show' : 'hidden'}>
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
						    				<Button bsSize='small' onClick={() => {this.getAllExcels(this.state.downloadCount)}}>
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
						    <hr/>
						    <div className={'addPaddingTop alert alert-danger ' +(this.state.errorResults ? 'show' : 'hidden')} role="alert">
                              An error occurred, please try again later. If this issue persists, please contact the system administrator. {this.state.errorMessage}
                            </div>
						    <Row className={this.state.noResults ? 'show' : 'hidden'}>
						    	<Col md={12}>
						    		<h2>No Results Found</h2>
						    	</Col>
						    </Row>
						    <div className={this.state.errorResults || this.state.noResults ? 'hidden' : 'show'}>
						    	<div className='nodes container-fluid'>
						    		<div className='row-dsl'>
						    			{nodes}
						    		</div>
						    	</div>
						    </div>
						    <Row className={this.state.showPagination ? 'show' : 'hidden'}>
						    	<Col md={6}>
						    		<Pagination
						    			activePage={this.state.activePage}
						    			itemsCountPerPage={PAGINATION_CONSTANT.RESULTS_PER_PAGE}
						    			totalItemsCount={this.state.totalResults}
						    			pageRangeDisplayed={PAGINATION_CONSTANT.PAGE_RANGE_DISPLAY}
						    			onChange={this.handlePageChange} />
						    	</Col>
						    </Row>
						</div>)}
						{this.state.isAggregate && (<div id="aggregateOutput">
                            		<Row className={ this.state.errorResults || this.state.noResults ? 'hidden' : 'show'}>
								<Col md={8} className={this.state.showPagination ? 'show' : 'hidden'}>
						    		<Pagination
						    			activePage={this.state.aggregateActivePage}
						    			itemsCountPerPage={PAGINATION_CONSTANT.RESULTS_PER_PAGE}
						    			totalItemsCount={this.state.totalResults}
						    			pageRangeDisplayed={PAGINATION_CONSTANT.PAGE_RANGE_DISPLAY}
						    			onChange={this.handlePageChange} />
						    	</Col>
								<Col md={2} className='text-right'>
						    		<OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{this.downloadAllTooltip}</Tooltip>}>
                 		    	 		<span className="d-inline-block" style={{display: 'inline-block'}}>
						    				<Button bsSize='small' onClick={() => {this.downloadAllAggregate(this.state.downloadCount)}}>
						    					Download XLSX <i className='icon-documents-downloadablefile'></i>
						    				</Button>
						    			</span>
						    		</OverlayTrigger>
						    	</Col>
								<Col md={2} className='pull-right text-right'>
                            	    <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>Download All Aggregate Objects By Custom Range Selection</Tooltip>}>
                            	    	<span className="d-inline-block" style={{display: 'inline-block'}}>
                            	    			<Button bsSize='small' onClick={this.openDownloadRange}>
                            	    			Download XLSX (Range) <i className='icon-documents-downloadablefile'></i>
                            	    		</Button>
                            	    	</span>
                            	    </OverlayTrigger>
                            	</Col>
                            </Row>
                            <hr/>
                            <div className={'addPaddingTop alert alert-danger ' + (this.state.errorResults ? 'show' : 'hidden')} role="alert">
                                    An error occurred, please try again later. If this issue persists, please contact the system administrator. {this.state.errorMessage}
                                  </div>
                            <Row className={this.state.noResults ? 'show' : 'hidden'}>
                            	<Col md={12}>
                            		<h2>No Results Found</h2>
                            	</Col>
                            </Row>
                            <div className={this.state.errorResults || this.state.noResults ? 'hidden' : 'show'}>
                            	<div className='nodes container-fluid'>
                            		<div className='row-dsl'>
                            			{nodes}
                            			<div className={this.state.viewName === "VisualLayout" ? 'show' : 'hidden'}>
                            			    <OutputVisualization identifier="currentStateAggregate" width={ window.outerWidth * 0.8 } height="1200" overflow="scroll"/>
                                        </div>
                            		</div>
                            	</div>
                            </div>
							<Row className={this.state.showPagination ? 'show' : 'hidden'}>
						    	<Col md={6}>
								<Pagination
						    			activePage={this.state.aggregateActivePage}
						    			itemsCountPerPage={PAGINATION_CONSTANT.RESULTS_PER_PAGE}
						    			totalItemsCount={this.state.totalResults}
						    			pageRangeDisplayed={PAGINATION_CONSTANT.PAGE_RANGE_DISPLAY}
						    			onChange={this.handlePageChange} />
						    	</Col>
						    </Row>
						</div>)}
			    			</div>
							<Spinner loading={this.state.enableModelBusyFeedback}>
								{downloadRangeModel}
					  		</Spinner>
					</Spinner>
				</div>
				<div className='row'>
					<div className='col-sm-10'></div>
				</div>
			</div>
			</div>
		</div>
	</div>
  );
	}
}

export default CustomDsl;
