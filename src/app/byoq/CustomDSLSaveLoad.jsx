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

import commonApi from 'utils/CommonAPIService.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Pagination from 'react-js-pagination';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Panel from 'react-bootstrap/lib/Panel';
import {GeneralCommonFunctions} from 'utils/GeneralCommonFunctions.js';
import Alert from 'react-bootstrap/lib/Alert';
import MultiSelectDropDown from 'generic-components/MultiSelectDropDown.jsx';
let ENVIRONMENT = GlobalExtConstants.ENVIRONMENT;
let APERTURE_SERVICE = JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));

let INVLIST = GlobalExtConstants.INVLIST;

const settings = {
	'NODESERVER': INVLIST.NODESERVER,
	'PROXY': INVLIST.PROXY,
  	'PREFIX': INVLIST.PREFIX,
  	'VERSION': INVLIST.VERSION,
    'USESTUBS': INVLIST.useStubs,
    'TABULAR': INVLIST.TABULAR,
    'APERTURE': INVLIST.APERTURE,
    'TABULARVERSION': INVLIST.TABULARVERSION
};

/**
 * This class is used to handle any saving or loading of dsl queries
 */

class CustomDSLSaveLoad extends Component {

  constructor(props) {
    console.log(props);
    super(props);
    APERTURE_SERVICE=JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE'));
    this.state = {
        enablePublicQueriesBusyFeedback: false,
        enableCommunityQueriesBusyFeedback: false,
        enablePersonalQueriesBusyFeedback: false,
        enableDeleteBusyFeedback: false,
        loadedPublicQueries: [],
        loadedCommunityQueries: [],
        loadedPersonalQueries: [],
        filteredPublicEntries: [],
        filteredCommunityEntries: [],
        filteredPersonalEntries: [],
        initialFilteredPublicEntries: [],
        initialFilteredCommunityEntries: [],
        initialFilteredPersonalEntries:[],
        totalPublicResults: 0,
        totalCommunityResults: 0,
        totalPersonalResults: 0,
        queriesPublicErrMsg: false,
        queriesCommunityErrMsg: false,
        queriesPersonalErrMsg: false,
        deleteErrMsg: false,
        deleteSuccessfulMsg: false,
        focusedEntryName: '',
        focusedEntryType: false,
        showDeleteModal: false,
        filterPublicCriteria: '',
        filterCommunityCriteria: '',
        filterPersonalCriteria: '',
        displayValue:'Category',
        selectedOption:{"public":[],"community":[],"personal":[]},
        filterText:'',
        activeType:'public',
        queryId:'',
        loadQueryList:[],
        publicLoadQueryList:[],
        personalLoadQueryList:[],
        communityLoadQueryList:[],
        loadQueryLimit:parseInt(sessionStorage.getItem(ENVIRONMENT + 'LOADTEMPLATE_MAX_COUNT')),
        loadQueryFlag:true,
        selectedCount:0
    };
    settings['ISAPERTURE']=APERTURE_SERVICE;
  }
  componentDidMount = () => {
    this.setState({enablePersonalQueriesBusyFeedback:true,enablePublicQueriesBusyFeedback:true,enableCommunityQueriesBusyFeedback:true});
    this.getQueries();
  };
  componentWillUnmount  = () => {};

  filterPublicList = (event) =>{
      this.filterPublicListWithCategory(event.target.value);
  }
  filterPublicListWithCategory = (value) =>{
     var updatedList = this.state.loadedPublicQueries;
     updatedList = Object.keys(updatedList).filter(key => {
        return JSON.stringify(updatedList[key]).toLowerCase().search(value.toLowerCase()) !== -1;
     }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );     
     let filterList=this.filterUpdatedList(updatedList, "public");
     console.log('filterPublicListWithCategory filterList>>>>>',filterList);
     this.setState({filteredPublicEntries: filterList, totalPublicResults: Object.keys(filterList).length, filterPublicCriteria: value,filterText: value.toLowerCase()});
   }
  filterCommunityList = (event) =>{
      this.filterCommunityListWithCategory(event.target.value);
  }
  filterCommunityListWithCategory = (value) =>{
     var updatedList = this.state.loadedCommunityQueries;
     updatedList = Object.keys(updatedList).filter(key => {
        return JSON.stringify(updatedList[key]).toLowerCase().search(value.toLowerCase()) !== -1;
     }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );
     let filterList=this.filterUpdatedList(updatedList, "community");
     console.log('filterCommunityListWithCategory filterList>>>>>',filterList);
     this.setState({filteredCommunityEntries: filterList, totalCommunityResults: Object.keys(filterList).length, filterCommunityCriteria: value,filterText: value.toLowerCase()});
  }
  filterPersonalList = (event) =>{
      this.filterPersonalListWithCategory(event.target.value);
  }
  filterPersonalListWithCategory =(value) =>{
     var updatedList = this.state.loadedPersonalQueries;
     updatedList = Object.keys(updatedList).filter(key => {
        return JSON.stringify(updatedList[key]).toLowerCase().search(value.toLowerCase()) !== -1;
     }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );
     let filterList=this.filterUpdatedList(updatedList, "personal");
     console.log('filterPersonalListWithCategory filterList>>>>>',filterList);     
     this.setState({filteredPersonalEntries: filterList, totalPersonalResults: Object.keys(filterList).length, filterPersonalCriteria: value,filterText: value.toLowerCase()});
  }
  filterUpdatedList = (updatedList, type) =>{
    let selectedCategory = this.state.selectedOption[type];
    let filterList = [];
    let selectedOption = [];
    if(selectedCategory.length > 0){
       selectedOption = Object.keys(selectedCategory).map((index)=>{
           return selectedCategory[index].value;
       }); 
       Object.keys(updatedList).map((key) => {
           Object.keys(updatedList[key]).map((entry) => {
               if(entry === 'category' && selectedOption.indexOf(updatedList[key][entry]) !==-1){
                   filterList[key]=updatedList[key];                  
               }
           })
       });
    }else{
       filterList=updatedList;
    }
    return filterList;
  }
  processQueryResponse = (res) => {
    var formattedList = [];
    for(var i = 0; i < res.length; i++){
        var newQueryObj = {};
        var requiredFieldCount = 0;
        if(res[i]){
            newQueryObj.isSelect=false;
            newQueryObj.id = res[i].id;
            newQueryObj['is_aggregate'] = false;
            newQueryObj['is_public'] = false;
            newQueryObj['community_shared'] = false;
            newQueryObj['template_details'] = [];
            for(var j = 0; j < res[i].cols.length; j++){
                if(res[i].cols[j].name){
                    if(res[i].cols[j].name === 'query_name'){
                        requiredFieldCount++;
                        newQueryObj.name = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'creator'){
                        requiredFieldCount++;
                        newQueryObj.creator = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'dsl'){
                        requiredFieldCount++;
                        newQueryObj.dsl = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'description'){
                        newQueryObj.description = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'is_aggregate'){
                        newQueryObj['is_aggregate'] = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'is_public'){
                        newQueryObj['is_public'] = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'community_shared'){
                        newQueryObj['community_shared'] = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'template_details'){
                        newQueryObj['template_details'] = res[i].cols[j].value;
                    }
                    if(res[i].cols[j].name === 'category'){
                        newQueryObj['category'] = res[i].cols[j].value;
                    }
                }
            }
            newQueryObj.version = res[i].version;
        }
        if(requiredFieldCount === 3){
            formattedList[res[i].id] = newQueryObj;
        }else{
            console.log('Issue occurred on query list processing for the following element: ' + JSON.stringify(newQueryObj));
        }
    }
    return formattedList;
  }
  
  getPublicQueries = () => {
    settings['ISTABULAR'] = true;
    return new Promise((resolve, reject) => {
                        commonApi(settings, 'queries/is_public=true', 'GET', null, 'BYOQPublicQueries', GlobalExtConstants.OVERRIDE_DOMAIN)
                        		.then(res => {
                        			console.log('res:' + res.data, 'load');
                        			if(res.status === 200 || res.status === 404){
                        			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201 && res.data.status !== 404)){
                        			        this.triggerError(res.data);
                        			    }else{
                        			        var list = this.processQueryResponse(res.data);
                        			        this.setState({
                                             enablePublicQueriesBusyFeedback:false,
                                             filteredPublicEntries: list,
                                             initialFilteredPublicEntries: list,
                                             totalPublicResults: Object.keys(list).length,
                                             loadedPublicQueries: list
                                             });
                                          this.runPublicFilter();
                                          resolve(list);
                                      }
                                  }else{
                                    this.triggerError(res.data, 'public_load');
                                  }
                                resolve([]);
                        		}, error=>{
                        		    if(error.response.status === 404){
                        		        this.setState({
                                                      enablePublicQueriesBusyFeedback:false,
                                                      filteredPublicEntries: [],
                                                      totalPublicResults: 0,
                                                      initialFilteredPublicEntries:[],
                                                      loadedPublicQueries: []
                                                    });
                        		    }else{
                        		        this.triggerError(error.response.data, 'public_load');
                        		    }
                        		    resolve([]);
                        		}).catch(error => {
                        		    this.triggerError(error, 'public_load');
                        		    resolve([]);
                            })
                        })
    }
  getCommunityQueries = () => {
      settings['ISTABULAR'] = true;
      return new Promise((resolve, reject) => {
                          commonApi(settings, 'queries/community_shared=true', 'GET', null, 'BYOQCommunityQueries', GlobalExtConstants.OVERRIDE_DOMAIN)
                          		.then(res => {
                          			console.log('res:' + res.data, 'load');
                          			if(res.status === 200 || res.status === 404){
                          			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201 && res.data.status !== 404)){
                          			        this.triggerError(res.data);
                          			    }else{
                          			        var list = this.processQueryResponse(res.data);
                          			        this.setState({
                                               enableCommunityQueriesBusyFeedback:false,
                                               filteredCommunityEntries: list,
                                               initialFilteredCommunityEntries: list,
                                               totalCommunityResults: Object.keys(list).length,
                                               loadedCommunityQueries: list
                                               });
                                            this.runCommunityFilter();
                                            resolve(list);
                                        }
                                    }else{
                                      this.triggerError(res.data, 'community_load');
                                    }
                                  resolve([]);
                          		}, error=>{
                          		    if(error.response.status === 404){
                          		        this.setState({
                                                        enableCommunityQueriesBusyFeedback:false,
                                                        filteredCommunityEntries: [],
                                                        totalCommunityResults: 0,
                                                        initialFilteredCommunityEntries:[],
                                                        loadedCommunityQueries: []
                                                      });
                          		    }else{
                          		        this.triggerError(error.response.data, 'community_load');
                          		    }
                          		    resolve([]);
                          		}).catch(error => {
                          		    this.triggerError(error, 'community_load');
                          		    resolve([]);
                              })
                          })
  }
  getPrivateQueries = () => {
        settings['ISTABULAR'] = true;
        let query='queries/is_public=false';
        if(sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId')){
            query+='&creator=' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId');
        }        
        return new Promise((resolve, reject) => {
          commonApi(settings, 'queries/is_public=false&creator=' + sessionStorage.getItem(GlobalExtConstants.ENVIRONMENT + 'userId'), 'GET', null, 'BYOQPersonalQueries', GlobalExtConstants.OVERRIDE_DOMAIN)
          		.then(res => {
          			console.log('res:' + res.data, 'load');
          			if(res.status === 200 || res.status === 404){
          			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201 && res.data.status !== 404)){
          			        this.triggerError(res.data);
          			    }else{
          			        var list = this.processQueryResponse(res.data);
          			        this.setState({
                                 enablePersonalQueriesBusyFeedback:false,
                                 filteredPersonalEntries: list,
                                 initialFilteredPersonalEntries: list,
                                 totalPersonalResults: Object.keys(list).length,
                                 loadedPersonalQueries: list
                                 });
                              this.runPersonalFilter();
                              resolve(list);
                          }
                      }else{
                        this.triggerError(res.data, 'personal_load');
                      }
                      resolve([]);
          		}, error=>{
          		    if(error.response.status === 404){
          		        this.setState({
                                          enablePersonalQueriesBusyFeedback:false,
                                          filteredPersonalEntries: [],
                                          initialFilteredPersonalEntries: [],
                                          totalPersonalResults: 0,
                                          loadedPersonalQueries: []
                                        });
          		    }else{
          		        this.triggerError(error.response.data, 'personal_load');
          		    }
          		     resolve([]);
          		}).catch(error => {
          		    this.triggerError(error, 'personal_load');
          		    resolve([]);
                })
           })
  }
  getQueries = () =>{
    var state = this;
    this.getCommunityQueries();
    Promise.all([
      this.getPublicQueries(),
      this.getPrivateQueries()
      ])
      .then(function (responses) {
      	var result = Object.assign({}, responses[0], responses[1]);
        state.props.setQueriesState(result);
        state.setState({loadQueryList:[],publicLoadQueryList:[],personalLoadQueryList:[],communityLoadQueryList:[],selectedCount:0});
      }).catch(function (error) {
      	console.log(error);
      });
  };
  triggerError = (error, type) => {
    console.error('[CustomDslSaveLoad.jsx] error : ', JSON.stringify(error));
  	let errMsg = '';
  	if(error.status && error.message){
  	    errMsg += "Error Occurred: " + error.status + ' - ' +error.message;
  	}else{
  	    errMsg += "Error Occurred: " + JSON.stringify(error);
  	}
  	console.log(errMsg);
  	if(type === 'public_load'){
        this.setState({queriesPublicErrMsg:errMsg,
                       enablePublicQueriesBusyFeedback:false,
                       filteredPublicEntries: [],
                       totalPublicResults: 0,
                       loadedPublicQueries: []});
        var result = Object.assign({}, [], this.state.loadedPersonalQueries);
        this.props.setQueriesState(result);
    }else if(type === 'personal_load'){
        this.setState({queriesPersonalErrMsg:errMsg,
                       enablePersonalQueriesBusyFeedback:false,
                       filteredPersonalEntries: [],
                       totalPersonalResults: 0,
                       loadedPersonalQueries: []});
        var result = Object.assign({}, this.state.loadedPublicQueries, []);
        this.props.setQueriesState(result);
    }else if(type === 'community_load'){
        this.setState({queriesCommunityErrMsg:errMsg,
                       enableCommunityQueriesBusyFeedback:false,
                       filteredCommunityEntries: [],
                       totalCommunityResults: 0,
                       loadedCommunityQueries: []});
        var result = Object.assign({}, this.state.loadedCommunityQueries, []);
        this.props.setQueriesState(result);
    }else if (type === 'delete'){
        this.setState({deleteErrMsg: errMsg + " - Failed to delete query : " + this.state.focusedEntryName, enableDeleteBusyFeedback:false});
        GeneralCommonFunctions.scrollTo("deleteError");
    }else{
        console.log('[CustomDslSaveLoad.jsx] :: triggerError invoked with invalid type : ' + type);
    }
  }

  runPublicFilter = () =>{
    var updatedList = this.state.loadedPublicQueries;
    updatedList = Object.keys(updatedList).filter(key => {
                return JSON.stringify(updatedList[key]).toLowerCase().search(this.state.filterPublicCriteria.toLowerCase()) !== -1;
             }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );
             this.setState({filteredPublicEntries: updatedList, totalPublicResults: Object.keys(updatedList).length},()=>{if(this.state.selectedOption["public"].length>0){this.filterPublicListWithCategory(this.state.filterPublicCriteria)}});
  }
  runCommunityFilter = () =>{
    var updatedList = this.state.loadedCommunityQueries;
    updatedList = Object.keys(updatedList).filter(key => {
                return JSON.stringify(updatedList[key]).toLowerCase().search(this.state.filterCommunityCriteria.toLowerCase()) !== -1;
             }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );
             this.setState({filteredCommunityEntries: updatedList, totalCommunityResults: Object.keys(updatedList).length},()=>{if(this.state.selectedOption["community"].length>0){this.filterCommunityListWithCategory(this.state.filterCommunityCriteria)}});
  }
  runPersonalFilter = () =>{
    var updatedList = this.state.loadedPersonalQueries;
    updatedList = Object.keys(updatedList).filter(key => {
                return JSON.stringify(updatedList[key]).toLowerCase().search(this.state.filterPersonalCriteria.toLowerCase()) !== -1;
             }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );
             this.setState({filteredPersonalEntries: updatedList, totalPersonalResults: Object.keys(updatedList).length},()=>{if(this.state.selectedOption["personal"].length>0){this.filterPersonalListWithCategory(this.state.filterPersonalCriteria)}});
  }

  addElement = (element) =>{
    var updatedList = this.state.loadedPublicQueries;
    updatedList[element.id] = element[0];
    this.setState({loadedPublicQueries: updatedList});
    this.props.setQueriesState(updatedList);
    this.runPublicFilter();
  }

  submitDelete = () =>{
     var loadedQueries = [];
     if(this.state.focusedEntryType === "personal"){
        loadedQueries = this.state.loadedPersonalQueries;
     }else{
        loadedQueries = this.state.loadedPublicQueries;
     }
     this.setState({enableDeleteBusyFeedback:true});
     settings['ISTABULAR'] = true;
     commonApi(settings, 'queries/' + encodeURIComponent(this.state.queryId), 'DELETE', '{\"id\":\"'
        + encodeURIComponent(this.state.queryId) + '\"}', 'BYOQDeleteQuery', GlobalExtConstants.OVERRIDE_DOMAIN, null,
        [{
            "name":"If-Match",
            "value": loadedQueries[this.state.queryId].version
         }])
            		.then(res => {
            			console.log('res:' + res.data);
            			if(res.status === 200){
            			    if(res.data.status && (res.data.status !== 200 && res.data.status !== 201)){
            			        this.triggerError(res.data, 'delete');
            			    }else{
            			        var updatedList = loadedQueries;
                                //remove the entry from the list
                                updatedList = Object.keys(updatedList).filter(key => {
                                   return key !== this.state.queryId;
                                }).reduce( (res, key) => Object.assign(res, { [key]: updatedList[key] }), {} );
                                this.setState({showDeleteModal:false,
                                               focusedEntryName: '',
                                               enableDeleteBusyFeedback:false,
                                               deleteSuccessfulMsg: "Successfully deleted query : " + this.state.focusedEntryName});
                                GeneralCommonFunctions.scrollTo("deleteSuccess");
                                if(this.state.focusedEntryType === "personal"){
                                   this.getCommunityQueries();
                                   this.setState({loadedPersonalQueries: updatedList});
                                   var result = Object.assign({}, this.state.loadedPublicQueries, updatedList);
                                   this.props.setQueriesState(result);
                                }else{
                                   this.setState({loadedPublicQueries: updatedList});
                                   var result = Object.assign({}, updatedList, this.state.loadedPersonalQueries);
                                   this.props.setQueriesState(result);
                                }
                                this.runPublicFilter();
                                this.runCommunityFilter();
                                this.runPersonalFilter();
                            }
            			}else{
            			    this.triggerError(res.data, 'delete');
            			}
            		}, error=>{
            		    this.triggerError(error.response.data, 'delete');
            		}).catch(error => {
            		    this.triggerError(error, 'delete');
     });
  };

  openDeleteModal = (id,name, isPublic) =>{
    var focusedEntryType = "public";
    if(isPublic === "true"){
        focusedEntryType = "public";
    }else{
        focusedEntryType = "personal";
    }
    this.setState({showDeleteModal:true, focusedEntryName: name, focusedEntryType: focusedEntryType, deleteSuccessfulMsg:false, deleteErrMsg:false, queryId:id});
  };

  closeDeleteModal = () =>{
    this.setState({showDeleteModal:false, focusedEntryName: '', focusedEntryType: false, deleteSuccessfulMsg:false, deleteErrMsg:false, queryId:''});
  };

  loadQuery = (e) =>{
    this.loadQueryData(e.target.value,0);
  };
  loadQueryData=(queryTemp, id)=>{
    let splitString = queryTemp.split('||');
    let name = splitString[0];
    let description = splitString[1];
    let category=(splitString[2] !== 'undefined')? splitString[2]:'';
    let dsl = splitString[3];
    let isAggregate = splitString[4];
    let type = splitString[5];
    let queryId = splitString[6];
    let isCommunityShared = splitString[7];
    let templateDetails = splitString[8];
    this.props.loadCallback(name, description, category, dsl, isAggregate, type, queryId, isCommunityShared, id, templateDetails, false);
  };
  loadBulkCallback =() =>{
    this.props.loadBulkCallback(this.state.loadQueryList);
  }
  loadAndRunQuery = (e) =>{
    let splitString = (e.target.value).split('||');
    let dsl = splitString[0];
    let isAggregate = splitString[1];
    this.props.loadCallback('', '', '', dsl, isAggregate, null, '', null, 0, [], true);
  };
  onMultiSelectPublicDropdownSelect = (selectedOption) =>{
    console.log('onMultiSelectPublicDropdownSelect selectedList',selectedOption);
    var tempSelection = this.state.selectedOption;
    tempSelection["public"] = selectedOption;
    this.setState({selectedOption:tempSelection},()=>{this.filterPublicListWithCategory(this.state.filterPublicCriteria)});
  };
  onMultiSelectCommunityDropdownSelect = (selectedOption) =>{
    console.log('onMultiSelectCommunityDropdownSelect selectedList',selectedOption);
    var tempSelection = this.state.selectedOption;
    tempSelection["community"] = selectedOption;
    this.setState({selectedOption:tempSelection},()=>{this.filterCommunityListWithCategory(this.state.filterCommunityCriteria)});
  };
  onMultiSelectPersonalDropdownSelect = (selectedOption) =>{
    console.log('onMultiSelectPersonalDropdownSelect selectedList',selectedOption);
    var tempSelection = this.state.selectedOption;
    tempSelection["personal"] = selectedOption;
    this.setState({selectedOption:tempSelection},()=>{this.filterPersonalListWithCategory(this.state.filterPersonalCriteria)});
  };
  prepareMultiOptions = (type) => {
    //this.setState({activeType:type});
    let filteredEntries=[];
    if(type==='public'){
        filteredEntries=this.state.initialFilteredPublicEntries;
    }else if(type==='community'){
        filteredEntries=this.state.initialFilteredCommunityEntries;
    }else{
        filteredEntries=this.state.initialFilteredPersonalEntries;
    }
    let dupArray=[];
    let  multiOption=Object.keys(filteredEntries).map((entry, idx) => {
                let obj ={};
                if(filteredEntries[entry]['category'] && dupArray.indexOf(filteredEntries[entry]['category']) === -1){
                    obj['value']=filteredEntries[entry]['category'];
                    obj['label']= filteredEntries[entry]['category'];
                    dupArray.push(filteredEntries[entry]['category']);
                }else{
                    obj='';
                }
                return obj;       
            });    
     let filterMultiOption = multiOption.filter((entry) => {
            if(entry !== '') return entry;             
     });    
     console.log('filterMultiOption>>>>>',filterMultiOption);   
     return filterMultiOption;       
  };
  editSavedQuery = (e) =>{
    let splitString = (e.target.value).split('||');
    let name = splitString[0];
    let description = splitString[1];
    let category = (splitString[2] !== 'undefined')? splitString[2]:'';
    let dsl = atob(splitString[3]).replace('<pre>','').replace('</pre>','');
    let isAggregate = splitString[4];
    let type = splitString[5];
    let queryId= splitString[6];
    let isCommunityShared = splitString[7];
    let templateDetails = splitString[8];
    this.props.editCallback(name, description, category, dsl, isAggregate, type, queryId, isCommunityShared, templateDetails);
  };
  loadAllQueries = () =>{
    console.log('this.state.loadQueryList>>>>',this.state.loadQueryList);
    let loadQueryList=this.state.loadQueryList;
    for(var l=0;l<loadQueryList.length;l++){
        this.loadQueryData(loadQueryList[l],l);
    }
  };
  onSelectCheckbox=(e) =>{
    let splitString = (e.target.value).split('||');   
    let type = splitString[5];
    let queryId=splitString[6];
    let queryList='';
    let loadQuery='';
    if(type =='public'){
        queryList=this.state.filteredPublicEntries;
        loadQuery= this.state.publicLoadQueryList;
    }else if (type == 'personal'){
        queryList=this.state.filteredPersonalEntries;
        loadQuery= this.state.personalLoadQueryList;        
    }else{
        queryList=this.state.filteredCommunityEntries;
        loadQuery= this.state.communityLoadQueryList;
    }
    let flag= true;
    if (e.target.checked) {        
        if(loadQuery.length<10){
            loadQuery.push(e.target.value);
            queryList[queryId].isSelect=true;        
        }    
    }else{
        let index=loadQuery.indexOf(e.target.value);
        loadQuery.splice(index,1);
        queryList[queryId].isSelect=false;         
    }
    flag=(loadQuery.length<=10)?true:false;
    if(type=='public'){
        this.setState({loadQueryList:loadQuery,publicLoadQueryList:loadQuery,personalLoadQueryList:[],communityLoadQueryList:[],filteredPublicEntries:queryList,loadQueryFlag:flag,selectedCount:loadQuery.length});
    }else if(type=='personal'){
        this.setState({loadQueryList:loadQuery,personalLoadQueryList:loadQuery,publicLoadQueryList:[],communityLoadQueryList:[],filteredPersonalEntries:queryList,loadQueryFlag:flag,selectedCount:loadQuery.length});
    } else{
        this.setState({loadQueryList:loadQuery,communityLoadQueryList:loadQuery,publicLoadQueryList:[],personalLoadQueryList:[],filteredCommunityEntries:queryList,loadQueryFlag:flag,selectedCount:loadQuery.length});
    }   
  }
  render() {
        let savedQueryCard = (type, totalCount, filterList, filteredEntries) =>{
                                let onMultiSelectDropdownSelect= (type==='public') ? this.onMultiSelectPublicDropdownSelect : (type==='community') ? this.onMultiSelectCommunityDropdownSelect : this.onMultiSelectPersonalDropdownSelect;
                                return <div className='card d3-model-card'>
                                          <div className={'card-header ' + (this.props.isSavedQueryFlow ? 'show' : 'hidden')}>
                                               <div>
                                                 <h3>Find A Query</h3>
                                               </div>
                                          </div>
                                          <div className='card-header'>
                                               <div>
                                                 <div style={{width:'82%',float:'left'}}>
                                                    <h5>Total Saved Queries: <strong>{totalCount}</strong></h5>
                                                 </div>
                                                 <div className={(this.props.isSavedQueryFlow ? 'show' : 'hidden')}>
                                                    <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{'Enabled for up to '+this.state.loadQueryLimit+' Queries'}</Tooltip>}>
											            <span className="d-inline-block" style={{display: 'inline-block'}}>
                                                            <button className='btn btn-outline-primary' type='button' onClick={()=>this.loadBulkCallback()} disabled={!(this.state.loadQueryList.length<=10 && this.state.loadQueryList.length>0)}>Load Selected Queries</button>
                                                        </span>
                                                    </OverlayTrigger>
                                                 </div>                                                             
                                               </div>
                                               <div>
                                                   <form>
                                                       <div className='alignFormTwinElements'>
                                                       <fieldset className="form-group">
                                                           <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={filterList}/>
                                                       </fieldset>
                                                       </div>
                                                       <div className='alignFormTwinElements'>
                                                       <fieldset className="form-group">
                                                            <MultiSelectDropDown
                                                                    options={this.prepareMultiOptions(type)}
                                                                    displayValue={this.state.displayValue}
                                                                    triggerSelect={onMultiSelectDropdownSelect}
                                                            />
                                                        </fieldset>
                                                       </div>
                                                   </form>
                                               </div>
                                          </div>
                                          <div className='card-content model-card-content'>
                                                 <table className="table table-hover table-striped">
                                                   <thead>
                                                     <tr>
                                                       <th scope='col' className={(this.props.isSavedQueryFlow ? 'show' : 'hidden')}>Select</th>
                                                       <th scope="col">Name</th>
                                                       <th scope="col">Description</th>
                                                       <th scope="col">Category</th>
                                                       <th scope="col">Creator</th>
                                                       <th scope="col">Aggregate</th>
                                                       <th scope="col" className={((type === 'personal') ? '' : 'hidden')}>Shared</th>
                                                       <th scope="col">Actions</th>
                                                     </tr>
                                                   </thead>
                                                   <tbody>
                                                   {Object.keys(filteredEntries).sort(function(a, b) {
                                                                                                      var compareA = a.toUpperCase();
                                                                                                      var compareB = b.toUpperCase();
                                                                                                      if(compareA < compareB) return -1;
                                                                                                      if(compareA > compareB) return 1;
                                                                                                      return 0;
                                                                                                     }).map((entry, idx) => {                                                                                                        
                                                                                                     return (                                                                                                     
                                                                                                       <tr>
                                                                                                         <td className={(this.props.isSavedQueryFlow ? '' : 'hidden')}>
                                                                                                            <div className="checkbox">
                                                                                                            <OverlayTrigger  placement='top' overlay={<Tooltip id='tooltip-top'>{(this.state.selectedCount===this.state.loadQueryLimit)?'Reached Maximun Template Count '+this.state.loadQueryLimit:(this.state.loadQueryLimit-this.state.selectedCount)+' More Selectable'}</Tooltip>}>
                 		    	 	                                                                            <span className="d-inline-block" style={{display: 'inline-block'}}>						    				
                                                                                                                <label>
                                                                                                                    <input type="checkbox" checked={filteredEntries[entry].isSelect} onChange={this.onSelectCheckbox.bind(this)} value={filteredEntries[entry].name + '||' + filteredEntries[entry].description + '||' + filteredEntries[entry].category + '||' + filteredEntries[entry].dsl + '||' + filteredEntries[entry]['is_aggregate'] + '||' +  type + '||' + entry + '||' + filteredEntries[entry]['community_shared'] + '||' + filteredEntries[entry]['template_details']} disabled={!filteredEntries[entry].isSelect && !this.state.loadQueryFlag}/>
                                                                                                                </label>
                                                                                                                </span>
                                                                                                            </OverlayTrigger>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                         <td><strong>{filteredEntries[entry].name}</strong></td>
                                                                                                         <td>{filteredEntries[entry].description}</td>
                                                                                                         <td width='15%'>{(filteredEntries[entry].category)?filteredEntries[entry].category:''}</td>
                                                                                                         <td>{filteredEntries[entry].creator}</td>
                                                                                                         <td>{filteredEntries[entry]['is_aggregate']}</td>
                                                                                                         <td className={((type === 'personal') ? '' : 'hidden')}>{filteredEntries[entry]['community_shared']}</td>
                                                                                                         <td className="actionsRow">
                                                                                                             <div>
                                                                                                         	    <button className={'btn btn-primary ' + (!this.props.isDSLBuilder ? '' : 'hidden')} type='button' value={filteredEntries[entry].dsl + "||" + filteredEntries[entry]['is_aggregate']} onClick={this.loadAndRunQuery}>Run</button>
                                                                                                         	    <button className='btn btn-outline-secondary' type='button' value={filteredEntries[entry].name + '||' + filteredEntries[entry].description + '||' + filteredEntries[entry].category + '||' + filteredEntries[entry].dsl + '||' + filteredEntries[entry]['is_aggregate'] + '||' +  type + '||' + entry + '||' + filteredEntries[entry]['community_shared'] + '||' + filteredEntries[entry]['template_details']  } onClick={this.loadQuery}>Load</button>
                                                                                                                <button className={'btn btn-outline-secondary ' + ((this.props.isDataSteward || type === 'personal') && type !== 'community' && !this.props.isDSLBuilder ? '' : 'hidden')} type='button' value={filteredEntries[entry].name + '||' + filteredEntries[entry].description + '||' + filteredEntries[entry].category + '||' + filteredEntries[entry].dsl + '||' + filteredEntries[entry]['is_aggregate'] + '||' +  type +'||' + entry + '||' + filteredEntries[entry]['community_shared'] + '||' + filteredEntries[entry]['template_details']} onClick={this.editSavedQuery}>Edit</button>
                                                                                                                <button className={'btn btn-outline-secondary ' + ((this.props.isDataSteward || type === 'personal') && type !== 'community' && !this.props.isDSLBuilder ? '' : 'hidden')} type='button' onClick={(e) => this.openDeleteModal(entry,filteredEntries[entry].name, filteredEntries[entry]['is_public'])}>Delete</button>
                                                                                                             </div>
                                                                                                         </td>
                                                                                                       </tr>
                                                                                                     );
                                                                                             })}
                                                   </tbody>
                                                 </table>
                                          </div>
                                      </div>};
        let savedQueryMessaging = (type, loadedQueries, queryErrMsg) => { return <Col>
                                <Alert className={!queryErrMsg ? 'show' : 'hidden'} bsStyle="warning">
                                    {type === 'public' && <h3>No Saved Public Queries Loaded</h3>}
                                    {type === 'community' && <h3>No Saved Community Shared Queries Loaded</h3>}
                                    {type === 'personal' && <h3>No Saved Personal Queries Loaded</h3>}
                                </Alert>
                                <Alert bsStyle="danger" className={queryErrMsg ? 'show' : 'hidden'} onDismiss={() => {
                                                                                                                   if(type==='public'){
                                                                                                                      this.setState({queriesPublicErrMsg: false});
                                                                                                                   }else if (type === 'community'){
                                                                                                                      this.setState({queriesCommunityErrMsg: false});
                                                                                                                   }else{
                                                                                                                      this.setState({queriesPersonalErrMsg: false});
                                                                                                                   }}}>
                                    <h3>An error occurred</h3>
                                    <p>
                                      {queryErrMsg}
                                    </p>
                                </Alert>
                              </Col>
        }
        let savedQueryTabs = () => { return <Tabs defaultActiveKey={'1'} id="multipleTabularView">
                                                <Tab eventKey={'1'} title={'Public'}>
                                                    <Spinner loading={this.state.enablePublicQueriesBusyFeedback}>
                                                        {Object.keys(this.state.loadedPublicQueries).length <= 0 && (<div>{savedQueryMessaging('public', this.state.loadedPublicQueries, this.state.queriesPublicErrMsg)}</div>)}
                                           	            {Object.keys(this.state.loadedPublicQueries).length > 0 && (<div>{savedQueryCard('public', this.state.totalPublicResults, this.filterPublicList, this.state.filteredPublicEntries)}</div>)}
                                           	        </Spinner>
                                           	    </Tab>
                                           	    <Tab eventKey={'2'} title={'Community'}>
                                                    <Spinner loading={this.state.enableCommunityQueriesBusyFeedback}>
                                                        {Object.keys(this.state.loadedCommunityQueries).length <= 0 && (<div>{savedQueryMessaging('community', this.state.loadedCommunityQueries, this.state.queriesCommunityErrMsg)}</div>)}
                                                        {Object.keys(this.state.loadedCommunityQueries).length > 0 && (<div>{savedQueryCard('community', this.state.totalCommunityResults, this.filterCommunityList, this.state.filteredCommunityEntries)}</div>)}
                                                    </Spinner>
                                                </Tab>
                                           	    <Tab eventKey={'3'} title={'My Personal Queries'}>
                                           	       <Spinner loading={this.state.enablePersonalQueriesBusyFeedback}>
                                           	            {Object.keys(this.state.loadedPersonalQueries).length <= 0 &&(<div>{savedQueryMessaging('personal', this.state.loadedPersonalQueries, this.state.queriesPersonalErrMsg)}</div>)}
                                                        {Object.keys(this.state.loadedPersonalQueries).length > 0 && (<div>{savedQueryCard('personal', this.state.totalPersonalResults, this.filterPersonalList, this.state.filteredPersonalEntries)}</div>)}
                                                   </Spinner>
                                                </Tab>
                                           </Tabs>
        };
        if (!GlobalExtConstants.INVLIST.IS_ONAP){
            return (<div>
            <div className='static-modal'>
                      		<Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal} dialogClassName="modal-override">
                      		    <Spinner loading={this.state.enableDeleteBusyFeedback}>
                      			    <Modal.Header>
                      			    	<Modal.Title>Delete DSL Query</Modal.Title>
                      			    </Modal.Header>
                      			    <Modal.Body>
                      			        <Alert id="deleteError" className={this.state.deleteErrMsg ? 'show' : 'hidden'} bsStyle="danger" onDismiss={() => this.setState({deleteErrMsg: false})}>
                                            <h3>An error occurred</h3>
                                            <p>
                                              {this.state.deleteErrMsg}
                                            </p>
                                         </Alert>
                                        <p>Are you sure you want to delete the following query?: {this.state.focusedEntryName}</p>
                      			    </Modal.Body>
                      			    <Modal.Footer>
                                    	<Button onClick={this.closeDeleteModal}>Cancel</Button>
                                    	<Button onClick={this.submitDelete}>Delete</Button>
                                    </Modal.Footer>
                                </Spinner>
                      		</Modal>
            </div>

              <Row>
                 <Col className={this.props.isSavedQueryFlow ? 'col-lg-10' : 'col-lg-12'}>
                    <Alert id="deleteSuccess" bsStyle="success" className={this.state.deleteSuccessfulMsg ? 'show' : 'hidden'} onDismiss={() => this.setState({deleteSuccessfulMsg: false})}>
                            <h3>Delete Successful</h3>
                            <p>
                              {this.state.deleteSuccessfulMsg}
                            </p>
                    </Alert>
                    {!this.props.isSavedQueryFlow && (<Panel>
                      <Panel.Heading>
                        <Panel.Title toggle>
                          <div className="checkbox">
                             <h2>Saved Queries</h2>
                          </div>
                        </Panel.Title>
                      </Panel.Heading>
                      <Panel.Collapse>
                        <Panel.Body className='cardwrap'>
                            {savedQueryTabs()}
                        </Panel.Body>
                      </Panel.Collapse>
                    </Panel>)}
                    {this.props.isSavedQueryFlow && savedQueryTabs()}
                  </Col>
                 </Row>
          </div>);
        }else{
            return (<span></span>);
        }
   }
}

export default CustomDSLSaveLoad;
