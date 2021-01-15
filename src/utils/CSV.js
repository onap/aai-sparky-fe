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

import {GlobalExtConstants} from './GlobalExtConstants.js';
let OXM = GlobalExtConstants.OXM;

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

var  buildAttrList = function(inputParam, cols) {
  // console.log('[getSearchParam] inputParam: ' + inputParam);
  let searchParam = inputParam;

  if (['PSERVER', 'COMPLEX', 'CLOUDREGION',
    'NETWORKPROFILE', 'VIRTUALDATACENTER'].indexOf(inputParam.toUpperCase()) === -1) {
    searchParam = inputParam.substring(0, inputParam.length - 1);
    // console.log('[getSearchParam] searchParam: ' + searchParam);
  }
  console.log('Before loop included',searchParam);
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
  console.log('After loop included',searchParam);
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
        if(isPrimitive) { //add to the list
          let node = {value: javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name']};
          columns.push(node);
        }
      }
    }
  }

  //sort the column list
  columns.sort(sortColumn);

  // console.log('[buildAttrList] columns:');
  // console.log(columns);

  return columns;
}

var multiTypeBuildAttrList = function(nodes) {
  // read oxm xml file
  let oxmFile = JSON.parse(OXM);
  let javaTypes = oxmFile['xml-bindings']['java-types'][0]['java-type'];

  let typeList = new Map();

  nodes.forEach(node => {
    let searchParam = node['node-type'];

    let foundIndex = -1;
    for (let i = 0; i < javaTypes.length && foundIndex === -1; i++) {
      if (javaTypes[i]['xml-root-element'][0]['$']['name'] === camelToDash(searchParam)) {
        foundIndex = i;
        if (!typeList.has(searchParam)) {

          let props = [];
          //for (let j = 0; j < javaTypes[foundIndex]['java-attributes'][0]['xml-element'].length; j++) {
            //props.push({
              //value: javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name']
            //});
          //}
          if (javaTypes[foundIndex]['java-attributes']) {
            let elementLength = 0;
            if (javaTypes[foundIndex]['java-attributes'][0]['xml-element']) {
              elementLength = javaTypes[foundIndex]['java-attributes'][0]['xml-element'].length;
            }
            for (var j = 0; j < elementLength; j++) {
              let isPrimitive = JSON.stringify(javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['type']).indexOf('java.lang') > -1;
              if(isPrimitive) { //add to the list
                let node = {value: javaTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name']};
                props.push(node);
              }
            }
          }

          props.sort(sortColumn);
          typeList.set(searchParam, props);
        }
      }
    }
  });

  // console.log('typeList:');
  // console.log(typeList);

  return typeList;
}

var buildCSV = function(columns, nodes) {
  let outputArray = [];
  outputArray[0] = [];

  for (let i = 0; i < columns.length; i++) {
    let str = columns[i].value;
    outputArray[0][str] = columns[i];
  }

  // console.log('[buildCSV] initial outputArray with columns:');
  // console.log(outputArray);

  // console.log('[buildCSV] nodes.length:');
  // console.log(nodes.length);

  let q = 0;
  for (let j = 1; j < nodes.length + 1; j++) {
    outputArray[j] = [];
    for (var k in nodes[q].properties) {
      if (nodes[q].properties.hasOwnProperty(k)) {
        let str = k;
        outputArray[j][str] = nodes[q].properties[k].toString();
      }
    }
    let relative = nodes[q]['related-to'];
    for(var r = 0; r<relative.length; r++){
      var relationship = '';
      var relationshipLabel = '';
      var nodeType = '';
      var url = '';
      for(var k in relative[r]){
        let relation = k.toString();
        if(relation === 'relationship-label'){
          relationshipLabel = relative[r][k].toString().slice(33);
        }
        if(relation === 'node-type'){
          nodeType = relative[r][k].toString();
        } 
        if(relation === 'url'){
          url = relative[r][k].toString();
        }       
        relationship = 'Relationship ' + relationshipLabel + ' ' + nodeType + ' - ' + url;
        console.log('relationship>>>>>',relationship);
      }
      let cnt = r + 1;
      let str = 'Relationship' + cnt;      
      outputArray[j][str] = relationship;
      outputArray[0][str] ='Relationship'+cnt;
    }
    q++;
  }

  return outputArray;
}

var multiTypebuildCSV = function(nodes) {
  let outputArray = [];

  nodes.forEach(node => {
    let nodeVal = [];
    for (var prop in node.properties) {
      if (node.properties.hasOwnProperty(prop)) {
        let val = { value: prop + ': ' + node.properties[prop].toString()};
        // console.log(val);
        nodeVal.push(val);
      }
    }
    nodeVal.sort(sortColumn);
    nodeVal.unshift({ value: node['node-type'] }, {value : node.url });
    let relative = node['related-to'];
    for(var r = 0; r<relative.length; r++){
      var relationship = '';
      var relationshipLabel = '';
      var nodeType = '';
      var url = '';
      for(var k in relative[r]){
        let relation = k.toString();
        if(relation === 'relationship-label'){
          relationshipLabel = relative[r][k].toString().slice(33);
        }
        if(relation === 'node-type'){
          nodeType = relative[r][k].toString();
        } 
        if(relation === 'url'){
          url = relative[r][k].toString();
        }       
        relationship = 'Relationship ' + relationshipLabel + ' ' + nodeType + ' - ' + url;
        console.log('relationship>>>>>',relationship);
      }
      let cnt = r + 1;  
      let val = { value: 'Relationship'+cnt + ': ' + relationship};
      nodeVal.push(val);
    }
    outputArray.push(nodeVal);
  });

  // console.log(outputArray);
  return outputArray;
}

var convertToCSVStr = function(outputArray) {
  let array = (typeof outputArray !== 'object' ? JSON.parse(outputArray) : outputArray);
  let str = '';
  let row = '';

  for (let index in outputArray[0]) {
    // convert each value to string and comma-separated
    row += index + ',';
  }
  row = row.slice(0, -1);
  // append Label row with line break
  str += row + '\r\n';

  for (let i = 1; i < array.length; i++) {
    let line = '';
    for (let k in outputArray[0]) {
      if (outputArray[0].hasOwnProperty(k)) {
        if (array[i][k]) {
          line += array[i][k] + ',';
        } else {
          line += ',';
        }
      }
    }
    str += line + '\r\n';
  }
  return str;
}

var multiTypeConvertToCSVStr = function(outputArray) {
  let array = (typeof outputArray !== 'object' ? JSON.parse(outputArray) : outputArray);
  let str = '';
  let max = 0;
  // find max length of array to determine number of rows to loop through
  array.forEach(node => {
    if (node.length > max) {
      max = node.length;
    }
  });

  // console.log('max: ' + max);

  for (let i = 0; i < max; i++) {
    let line = '';
    for (let j = 0; j < array.length; j++) {
      line += array[j][i] ? array[j][i].value  + ',' : ',';
    }
    str += line + '\r\n';
  }
  return str;
}

var downloadCSV = function(csvStr, filename) {
  // console.log(csvStr);
  var a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  var blob = new Blob([csvStr], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename + '.csv';
  a.click();
}
export const CSV = {
  buildAttrList : buildAttrList,
  multiTypeBuildAttrList : multiTypeBuildAttrList,
  buildCSV : buildCSV,
  multiTypebuildCSV : multiTypebuildCSV,
  convertToCSVStr : convertToCSVStr,
  multiTypeConvertToCSVStr : multiTypeConvertToCSVStr,
  downloadCSV : downloadCSV
};
