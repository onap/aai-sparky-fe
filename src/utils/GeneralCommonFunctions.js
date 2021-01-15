import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';

let OXM = GlobalExtConstants.OXM;

var scrollTo = function(id) {
    setTimeout(function () {
        document.getElementById("main-app-container").scrollTop = document.getElementById(id).offsetTop;
        }, 100);
}
var populatePathDSL = function(tree, isInit, onLoad, enableRealTime){
    console.log('populatePathDSL>>>>>>> pathFIlter****',tree);
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
            var nodeData=(onLoad)?node:node.data;
            if(nodeData){
                console.log('***************',JSON.stringify(nodeData));
                if(isInit){
                    DSL += '(>'+nodeData.name;
                }else{
                    DSL += nodeData.name;
                }
                
                let propState=false;
                if(nodeData.details){
                    var tempAttributeString = '';
                    var selectedAttributeCount = 0;                    
                    for (var key in nodeData.details.attrDetails){
                        if(nodeData.details.attrDetails[key].filterValue && nodeData.details.attrDetails[key].filterValue[0] !==''){
                            DSL += '(\'' + nodeData.details.attrDetails[key].attributeName + '\',';
                            let dslValues='';
                            for(var indx=0; indx<nodeData.details.attrDetails[key].filterValue.length; indx++){                            
                                dslValues=(indx>0) ? dslValues+',':dslValues;
                                if(enableRealTime && nodeData.details.attrDetails[key].filterType && nodeData.details.attrDetails[key].filterType[indx]){
                                    dslValues += nodeData.details.attrDetails[key].filterType[indx]+'(\''+ nodeData.details.attrDetails[key].filterValue[indx] + '\')';                                    
                                }else{
                                    dslValues +='\''+nodeData.details.attrDetails[key].filterValue[indx] + '\'';                                    
                                }                      
                                if(nodeData.details.attrDetails[key].filterValue.length-1 ===  indx){
                                    dslValues +=')';
                                }
                            }
                            DSL += dslValues;
                        }
                    }
                }
            }
            if(node.children && node.children.length>0){
                DSL+= '>' + populatePathDSL(node,false,onLoad,enableRealTime);
            }
            if(k !==  treeArrayLength - 1){
                DSL += ',';
            }
            if(k === treeArrayLength - 1 && treeArrayLength > 1){
                DSL += ']';
            }
        }
        if(isInit){
            DSL+=')';
        }     
        return DSL;
    }
    var getFilteringOptions = function(nodeType){
        var propertiesDsl = [];
        var result = JSON.parse(OXM);
        var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
        //console.dir(arrayOfTypes);
        var foundIndex = -1;
        var searchParam = nodeType;
    
        if (nodeType.toUpperCase() === 'LINESOFBUSINESS') {
            searchParam = 'lineOfBusiness';
        }
        //console.log('searchParam:' + searchParam);
        for (var i = 0; i < arrayOfTypes.length && foundIndex === -1; i++) {
            if (arrayOfTypes[i]['xml-root-element'][0]['$']['name'] === camelToDash(searchParam)) {
            foundIndex = i;
            }
        }
        if(foundIndex && arrayOfTypes[foundIndex]){
              //build the filter list
            for (var j = 0; j < arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'].length; j++) {
                let property =  arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['name'];            
                let type = arrayOfTypes[foundIndex]['java-attributes'][0]['xml-element'][j]['$']['type'];
                if(property !== 'length'){
                    if (type === 'java.lang.String' || type === 'java.lang.Boolean' || type === 'java.lang.Long' || type === 'java.lang.Integer') {
                        propertiesDsl[property] = {};
                        propertiesDsl[property].isSelected = false;
                        propertiesDsl[property].attributeName = property;
                        propertiesDsl[property].filterValue = [''];
                        propertiesDsl[property].filterType = [''];
                        propertiesDsl[property].dslPath = [];
                        propertiesDsl[property].dslPathTree = [];
                    }
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
            //console.log('FilterList' + JSON.stringify(sortedPropertiesDsl));
            return sortedPropertiesDsl;
        }else{
            return [];
        }
    }
    var getNodeTypes = function(){
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
    var populateContainer = function(nodeType){
        var result = JSON.parse(OXM);
        var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
        var isFound = false;
        var container = '';
        for (var i = 0; i < arrayOfTypes.length && !isFound; i++) {
             if(arrayOfTypes[i]['xml-root-element'][0]['$']['name'] === nodeType
                && arrayOfTypes[i]['xml-properties']
                && arrayOfTypes[i]['xml-properties'][0]
                && arrayOfTypes[i]['xml-properties'][0]['xml-property']){
                        isFound = true;
                        for(var k = 0; k < arrayOfTypes[i]['xml-properties'][0]['xml-property'].length; k++){
                            if(arrayOfTypes[i]['xml-properties'][0]['xml-property'][k]['$']['name'] === 'container'){
                                container = arrayOfTypes[i]['xml-properties'][0]['xml-property'][k]['$']['value'];
                            }
                        }
             }
        }
        return container;
    }
    var getEditableAttributes = function(nodeType){
        //get this from the oxm field
        var result = JSON.parse(OXM);
        var arrayOfTypes = result['xml-bindings']['java-types'][0]['java-type'];
        var isFound = false;
        var uiEditableProps = [];
        for (var i = 0; i < arrayOfTypes.length && !isFound; i++) {
             if(arrayOfTypes[i]['xml-root-element'][0]['$']['name'] === nodeType
                && arrayOfTypes[i]['xml-properties']
                && arrayOfTypes[i]['xml-properties'][0]
                && arrayOfTypes[i]['xml-properties'][0]['xml-property']){
                        isFound = true;
                        for(var k = 0; k < arrayOfTypes[i]['xml-properties'][0]['xml-property'].length; k++){
                            if(arrayOfTypes[i]['xml-properties'][0]['xml-property'][k]['$']['name'] === 'uiEditableProps'){
                                uiEditableProps = ((arrayOfTypes[i]['xml-properties'][0]['xml-property'][k]['$']['value']).replace(/\s/g,"")).split(',');
                            }
                        }
             }
        }
        return uiEditableProps;
    }
    var populateEdgeRules = function(nodeType,edgeRules){
        var nodeDetails = [];
        var node = null;
        console.log('populateEdgeRules.nodeType: ' + nodeType);
        var id = generateID();
        for (var i = 0; i < edgeRules.length; i++) {
            var ruleObj = edgeRules[i];
            if (ruleObj.from === nodeType && !nodeDetails[ruleObj.to + id]) {
                node = ruleObj.to + id;
                if(!nodeDetails[node]){
                  nodeDetails[node] = {};
                  nodeDetails[node].nodeType = ruleObj.to;
                  nodeDetails[node].isSelected = false;
                  nodeDetails[node].attrDetails = GeneralCommonFunctions.getFilteringOptions(ruleObj.to);
                  nodeDetails[node].parentContainer = GeneralCommonFunctions.populateContainer(ruleObj.to);
              }
            }
            if (ruleObj.to === nodeType && !nodeDetails[ruleObj.from + id]) {
                node = ruleObj.from + id;
                if(!nodeDetails[node]){
                  nodeDetails[node] = {};
                  nodeDetails[node].nodeType = ruleObj.from;
                  nodeDetails[node].isSelected = false;
                  nodeDetails[node].attrDetails = GeneralCommonFunctions.getFilteringOptions(ruleObj.from);
                  nodeDetails[node].parentContainer = GeneralCommonFunctions.populateContainer(ruleObj.from);
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
        console.log('EdgeRulesList' + JSON.stringify(nodesSorted));
        nodeDetails = nodesSorted;
        return nodeDetails;
    }
var camelToDash = function(str){
    return (str.replace(/\W+/g, '-')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')).toLowerCase();
}
var  generateID = function(){
    return Math.random().toString().replace('0.', '');
}
var extractNodeDetails = function(node, isRoot, errorFunction, isAperture){
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
                  //when merged with calls from builder use condition to enable this
                  /*if(!isAperture && filter !== 'EQ'){
                      errorFunction(null, "invalidQuery");
                      isValid = false;
                  }*/
                  if(!nodeData.details.attrDetails[attrKey]){
                      nodeData.details.attrDetails[attrKey] = {};
                  }
                  if(nodeData.details.attrDetails[attrKey].filterType.length > 0 && nodeData.details.attrDetails[attrKey].filterType[0] === ''){
                      nodeData.details.attrDetails[attrKey].filterType = [];
                  }
                  if(nodeData.details.attrDetails[attrKey].filterValue.length > 0 && nodeData.details.attrDetails[attrKey].filterValue[0] === ''){
                      nodeData.details.attrDetails[attrKey].filterValue = [];
                  }

                  if(node['node-filter'][x][y]['value'][0]){
                      for (var i in node['node-filter'][x][y]['value']){
                          nodeData.details.attrDetails[attrKey].filterType.push(filter);
                          nodeData.details.attrDetails[attrKey].filterValue.push(node['node-filter'][x][y]['value'][i]);
                      }
                      if(!nodeData.details.attrDetails[attrKey].attributeName){
                          nodeData.details.attrDetails[attrKey].attributeName = attrKey;
                      }
                  }else{
                      //if a filter had no values associated to it do nothing
                      //when merged with calls from builder use condition to enable this
                      /* errorFunction(null, "invalidQuery");
                      isValid = false; */
                  }
              }
          }
      }
  }
  var initWhereNode = null;
  if(node['where-filter'].length > 0){
      for(var index in node['where-filter']){
          initWhereNode = GeneralCommonFunctions.extractNodeDetails(node['where-filter'][index].children[0], true);
      }
  }
  if(initWhereNode){
      nodeData.details.dslPath=[];
      nodeData.details.dslPathTree=[];
      nodeData.details.dslPathTree.push(initWhereNode);
  }
  if(node.children.length > 0){
      for(var i = 0; i < node.children.length; i++){
          nodeData.children[i] = GeneralCommonFunctions.extractNodeDetails(node.children[i], false);
      }
  }
  return nodeData;
}
export const GeneralCommonFunctions = {
    scrollTo: scrollTo,
    populatePathDSL: populatePathDSL,
    getFilteringOptions: getFilteringOptions,
    getNodeTypes: getNodeTypes,
    populateContainer: populateContainer,
    populateEdgeRules: populateEdgeRules,
    camelToDash: camelToDash,
    generateID: generateID,
    extractNodeDetails: extractNodeDetails,
    getEditableAttributes: getEditableAttributes
};
