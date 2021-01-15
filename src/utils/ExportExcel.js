/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2018-2019 AT&T Intellectual Property. All rights reserved.
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
import {GlobalExtConstants} from './GlobalExtConstants.js';
import * as Excel from 'exceljs/dist/exceljs.min.js';

let OXM = GlobalExtConstants.OXM;
let EXCELCELLS = GlobalExtConstants.EXCELCELLS;
let DOWNLOAD_ALL = GlobalExtConstants.DOWNLOAD_ALL;
let INVLIST = GlobalExtConstants.INVLIST;

function camelToDash(str) {
	return (str.replace(/\W+/g, '-')
	  .replace(/([a-z\d])([A-Z])/g, '$1-$2')).toLowerCase();
}
  
function sortColumn(col1, col2) {
	if (col1.value < col2.value) {
		return -1;
	} else if (col1.value > col2.value) {
		return 1;
	} else {
		return 0;
	}
}
  
var  buildAttrList = function(inputParam, cols, sortBy) {
	// console.log('[getSearchParam] inputParam: ' + inputParam);
	let searchParam = inputParam;
  
	if (['PSERVER', 'COMPLEX', 'CLOUDREGION',
	  'NETWORKPROFILE', 'VIRTUALDATACENTER','VNFC'].indexOf(inputParam.toUpperCase()) === -1) {
	  searchParam = inputParam.substring(0, inputParam.length - 1);
	  // console.log('[getSearchParam] searchParam: ' + searchParam);
	}
	if('CHASSIES'.indexOf(inputParam.toUpperCase()) !== -1){
	  searchParam = inputParam.substring(0, inputParam.length - 2) + 's';
	}else if(inputParam.substr(inputParam.length - 3) === 'ies'){
	  searchParam = inputParam.substring(0, inputParam.length - 3) + 'y';
	}else if('COMPLEXES'.indexOf(inputParam.toUpperCase()) !== -1){
	  searchParam = inputParam.substring(0, inputParam.length - 2);
	}
	if(inputParam.toUpperCase() === 'PINTERFACES'){
	  searchParam = 'pInterface';
	}
	if (inputParam.toUpperCase() === 'LINESOFBUSINESS') {
	  searchParam = 'lineOfBusiness';
	  // console.log('[getSearchParam] searchParam: ' + searchParam);
	}
  
	// read oxm xml file
	let oxmFile = JSON.parse(OXM);
	let javaTypes = oxmFile['xml-bindings']['java-types'][0]['java-type'];
	// console.log('[buildAttrList] javaTypes:');
	// console.log(javaTypes);
  
	let foundIndex = -1;
	for (let i = 0; i < javaTypes.length && foundIndex === -1; i++) {
	  if (javaTypes[i]['xml-root-element'][0]['$']['name'] === camelToDash(searchParam)) {
		// console.log(javaTypes[i]);
		foundIndex = i;
	  }
	}
	
	//Adding Quick fix will be get rid of it later
	console.log('searchParam>>>>>>>stage2:',inputParam);
	if(foundIndex === -1){
	 for (let i = 0; i < javaTypes.length && foundIndex === -1; i++) {
	   if (javaTypes[i]['xml-root-element'][0]['$']['name'] === camelToDash(inputParam)) {
		 foundIndex = i;
	   }
	   if(foundIndex === -1){
		 if(inputParam.substr(inputParam.length - 1) === 's'){
		   searchParam = inputParam.substring(0, inputParam.length - 1);
		   console.log('searchParam>>>>>>>stage3:',searchParam);        
		 }
		 if (javaTypes[i]['xml-root-element'][0]['$']['name'] === camelToDash(searchParam)) {
		   foundIndex = i;
		 }
	   }
	 }
	}
   
	// build the column list
	let columns = cols;
  let requiredColumn = [];
	if(foundIndex > -1) {
	  //for (let j = 0; j < javaTypes[foundIndex]['java-attributes'][0]['xml-element'].length; j++) {
	   // columns.push({value: javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name']});
	  //}
	  if (javaTypes[foundIndex]['java-attributes']) {
		let elementLength = 0;
		if (javaTypes[foundIndex]['java-attributes'][0]['xml-element']) {
		  elementLength = javaTypes[foundIndex]['java-attributes'][0]['xml-element'].length;
		}
		for (var j = 0; j < elementLength; j++) {
		  let isPrimitive = JSON.stringify(javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['type']).indexOf('java.lang') > -1;
      let reqObj = JSON.stringify(javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['required']);
      let description='';
      if(javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['xml-properties'] && javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['xml-properties'][0]['xml-property'][0]['$']['name']=='description'){
        description= javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['xml-properties'][0]['xml-property'][0]['$']['value'];
      }
      let node = {value: javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name'],description: description};
      if(isPrimitive) { //add to the list
			  columns.push(node);
		  }
		  if(reqObj && reqObj.indexOf('true') > -1){
		       requiredColumn.push(node);
		  }
		}
	  }
	}
  
	//sort the column list
	columns.sort(sortColumn);
	  //Sort column with requiredColumn
	  if(sortBy === 'required'){
	    for(var c=0; c< columns.length; c++){
	      if(requiredColumn.indexOf(columns[c]) === -1){
	        requiredColumn.push(columns[c]);
	      }
	    }
	  }
	if(sortBy && (sortBy === 'required' || sortBy === 'mandatory')){
	   columns = requiredColumn;
	}
	// console.log('[buildAttrList] columns:');
	// console.log(columns);
  
	return columns;
}
var getDescriptionForNodes= function (){
    var invKeys = Object.keys(INVLIST.INVENTORYLIST);
    let oxmFile = JSON.parse(OXM);
    let javaTypes = oxmFile['xml-bindings']['java-types'][0]['java-type'];
    let nodeDescriptionObj={};
    let invList = invKeys.map(item => {
      for (let i = 0; i < javaTypes.length; i++) {
        if(javaTypes[i]['$']['name'].toLowerCase() === camelToDash(INVLIST.INVENTORYLIST[item].modelPath).toLowerCase()) {
          if(javaTypes[i]['xml-properties'] !== undefined && javaTypes[i]['xml-properties'][0]['xml-property'] && javaTypes[i]['xml-properties'][0]['xml-property'][0]['$']['name']==='description'){
            nodeDescriptionObj[INVLIST.INVENTORYLIST[item].modelPath]=javaTypes[i]['xml-properties'][0]['xml-property'][0]['$']['value'];
          }else{
            nodeDescriptionObj[INVLIST.INVENTORYLIST[item].modelPath]='';
          }        
        }
      }
      return nodeDescriptionObj;
    });
    return invList;
}

var generateExcels = function(nodeResults,dslQuery) {
    console.log('inside generateExcels>>>>>');
    //Creating New Workbook 
    var workbook = new Excel.Workbook();
    var nodesType = [];
    var worksheet;
    var columnsJsonObj = {}
    var columnsList = []
    columnsJsonObj.columns = columnsList;
    var nodesLength = nodeResults.length;
    console.log('nodeResults.length.......',nodesLength);
    for(var n=0;n<nodesLength;n++){
      //Creating Sheet for that particular WorkBook 
      let nodeTypeVal = nodeResults[n]["node-type"];
      let url = nodeResults[n]["url"];
      let columns = [];
      let buildColumns = [];
      if(nodesType.indexOf(nodeTypeVal) == -1){
         nodesType.push(nodeTypeVal);
         worksheet = workbook.addWorksheet(nodeTypeVal,{properties: {showGridLines: true}});
         buildColumns = buildAttrList(nodeTypeVal, [], 'required');
         if(dslQuery){
          let tempDslQuery= dslQuery+',';
          let nodeTypeProperties ='';
          let plainNodes ='';
          var nodePatternwithProp = generateRegexForDsl(nodeTypeVal);
          var nodeRegularExp = new RegExp(nodePatternwithProp, 'g');
          plainNodes = tempDslQuery.match(nodeRegularExp);
          console.log('plainNodes model Gallery null>>>>>*',plainNodes);
          if(plainNodes){
            let propertiesPattern ="\\{.*?\\}"; 
            var propRegularExp = new RegExp(propertiesPattern, 'g');
            nodeTypeProperties = plainNodes[0].match(propRegularExp); 
            console.log('nodeTypeProperties model Gallery>>>>>*',nodeTypeProperties);
            nodeTypeProperties = nodeTypeProperties[0].slice(1,-1).replace(/\'/g,'').toLowerCase().split(',');
            for(var z=0;z<buildColumns.length;z++){
                if(nodeTypeProperties.indexOf(buildColumns[z].value.toLowerCase()) !== -1){
                  columns.push(buildColumns[z]);
                }
              }
              console.log('on condition table columns>>>>',columns);
            }else{
              columns=buildColumns;
            }
          }else{
            columns=buildColumns;
          }
         columns.push({value: 'uri'});
         columns.push({value: 'relationship-list'});
         var column = {
          [nodeTypeVal] : columns
        }
        columnsJsonObj.columns.push(column);
         if (!worksheet.columns) {
          worksheet.columns = Object.keys(columns).map((k) => ({ header: columns[k].value, key: columns[k].value, width:15}))
        }
      }else{
        worksheet = workbook.getWorksheet(nodeTypeVal);
        let col = columnsJsonObj.columns; 
        for(var c in col){
          if(col[c][nodeTypeVal]){
            columns = col[c][nodeTypeVal];
          }
        }
      }      
      var excelCellsHeader = [];
      var loop = 0;
      var noOfCol = Math.ceil(columns.length/26);
      while(loop<noOfCol){
        if(loop === 0){
          for(var j=0; j<EXCELCELLS.length; j++){
            excelCellsHeader.push(EXCELCELLS[j]);
          }
        }else{
          for(var j=0; j<EXCELCELLS.length; j++){
            excelCellsHeader.push(EXCELCELLS[loop-1]+EXCELCELLS[j]);
          }
        }
        loop++;
      }      
      console.log('excelCellsHeader.......',excelCellsHeader);
      console.log('worksheet.columns>>>>',worksheet.columns);        
      var row = [];
      var relativeRow = [];
      var rows = [];
      for(var x in columns){
        if(nodeResults[n].properties[columns[x].value] !== undefined){
          row.push(nodeResults[n].properties[columns[x].value]);
          relativeRow.push("");
        }else{
          row.push("");
          relativeRow.push("");
        }      
      }
      row[row.length-2] = url;
      console.log('Push Row after>>>>>>>>>>>',row);
      var relationships = [];
      if(nodeResults[n]["related-to"]){
        let relative =nodeResults[n]["related-to"];
        var relativeLength = relative.length;
        console.log('relativeLength>>>>>>>>>>>',relativeLength);
        if(relativeLength>0){
        for(var r = 0; r<relative.length; r++){
          var relationship = '';
          var relationshipLabel = '';
          var nodeType = '';
          var localUrl = '';
          for(var k in relative[r]){
            let relation = k.toString();
            if(relation === 'relationship-label'){
              relationshipLabel = relative[r][k].toString().slice(33);
            }
            if(relation === 'node-type'){
              nodeType = relative[r][k].toString();
            } 
            if(relation === 'url'){
              localUrl = relative[r][k].toString();
            }       
          }
          relationship = 'Relationship ' + relationshipLabel + ' ' + nodeType + ' - ' + localUrl;
          if(r===0){
            row[row.length-1] = relationship;
            rows.push(row);
          }else{
            let tempRow = [];
            tempRow = [...relativeRow]; // cloning in ES6 Way to avoid deep copy
            tempRow[tempRow.length-1] = relationship;
            rows.push(tempRow);
          }     
        }
      }else{
        rows.push(row);
      }
      }else{
        rows.push(row);
      }
      console.log('Rows before pushing>>>>>>>>>>>',rows); 
      let initMergeCell = (n==0) ? 2: worksheet.rowCount + 1;      
      worksheet.addRows(rows);
      console.log('initMergeCell>>>>>>',initMergeCell);
      //worksheet.getColumn(columns.length).values = relationships;      
      let lastMergeCell = (relativeLength==0)? initMergeCell : initMergeCell + relativeLength - 1;
      console.log('lastMergeCell>>>>>>',lastMergeCell);
      for(var x=0;x<columns.length-1;x++){
        var cell = excelCellsHeader[x] + initMergeCell +':'+excelCellsHeader[x]+lastMergeCell;
        worksheet.mergeCells(cell);
      }
    }
    var workbookName = 'NodesList_'+nodesLength+'_Results.xlsx';
    generateWorkbook(workbook,workbookName);
  }
  var generateRegexForDsl= function(nodeType){
    var nodePatternwithProp = nodeType+"\\*\\{.*?\\}\\(.*?\\)[\\,|\\>|\\]|\\)]|"+nodeType+"\\*\\(.*?\\)\\{.*?\\}[\\,|\\>|\\]|\\)]|"+nodeType+"\\{.*?\\}\\(.*?\\)[\\,|\\>|\\]|\\)]|"+nodeType+"\\(.*?\\)\\{.*?\\}[\\,|\\>|\\]|\\)]|"+nodeType+"\\{.*?\\}[\\,|\\>|\\]|\\)]|"+nodeType+"\\*\\{.*?\\}[\\,|\\>|\\]|\\)]";
		return nodePatternwithProp;
  }  
 var generateExcelFromTabularView = function(tabledata,tableheaders,workbookName) {
   console.log('inside generateExcelFromTabularView>>>>>');
   //Creating New Workbook
   var workbook = new Excel.Workbook();
   var worksheet = workbook.addWorksheet('Results',{properties: {showGridLines: true}});
   var columns = [];
   if (!worksheet.columns) {
     worksheet.columns = Object.keys(tableheaders).map((k) => ({ header: tableheaders[k].name, key: tableheaders[k].name, width:20}))
   }
   var rows = [];
   var row = [];
   for(var n=0; n<tabledata.length; n++){
       console.log('TableData<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',tabledata[n]);
       row = [];
       Object.keys(tableheaders).map((k) => { row.push(tabledata[n][tableheaders[k].name])});
       rows.push(row);
   }
   worksheet.addRows(rows);
   generateWorkbook(workbook,workbookName);
 }
 var generateExcelFromTabularViewMultiTabs = function(tabData,tabHeaders,workBookName) {
   console.log('inside generateExcelFromTabularViewMultiTabs>>>>>');
   //Creating New Workbook
   var workbook = new Excel.Workbook();   
   Object.keys(tabData).forEach((key,index) => {
        var worksheet = workbook.addWorksheet((index+1)+'_'+key,{properties: {showGridLines: true}});
        var columns = [];
        var tableData = tabData[key];
        var tableHeaders = tabHeaders[key];
        if (!worksheet.columns) {
          worksheet.columns = Object.keys(tableHeaders).map((k) => ({ header: tableHeaders[k].name, key: tableHeaders[k].name, width:20}))
        }
        var rows = [];
        var row = [];
        for(var n = 0; n < tableData.length; n++){
            console.log('TableData<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',tableData[n]);
            row = [];
            Object.keys(tableHeaders).map((k) => { row.push(tableData[n][tableHeaders[k].name])});
            rows.push(row);
        }
        worksheet.addRows(rows);
   });
   generateWorkbook(workbook,workBookName);
 }
 var generateViolationExcels = function(tabledata,tableheaders) {
   generateExcelFromTabularView(tabledata, tableheaders, 'DataIntegrityViolationTable.xlsx');
 }
 var generateWorkbook = function(workbook,workbookName){
   console.log('generateWorkbook :',workbookName);
    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      document.body.appendChild(anchor);
      anchor.href = url;
      anchor.download = workbookName;
      anchor.click();
      window.URL.revokeObjectURL(url);
    }); 
  }


export const ExportExcel = {
  buildAttrList : buildAttrList,
  generateExcels : generateExcels,
  generateViolationExcels : generateViolationExcels,
  generateExcelFromTabularView: generateExcelFromTabularView,
  generateExcelFromTabularViewMultiTabs: generateExcelFromTabularViewMultiTabs,
  getDescriptionForNodes: getDescriptionForNodes
};