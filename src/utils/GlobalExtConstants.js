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


const appConfigJson = require('app/assets/configuration/app_config.json');
const BACKEND_IP_ADDRESS = document.location.hostname;
const BACKEND_PORT_NUMBER = window.location.port;
const PROTOCOL = window.location.protocol;
var url = window.location.href;
var environment = '';
if(url.includes('localhost')){
  var regTitle = new RegExp(appConfigJson.APP_TITLE_REGX_LOCAL);
  environment = url.match(regTitle)[1].toUpperCase() + '_LOCALHOST_';
}else if (url.includes('ecompc_')){
  environment = url.split('/')[3] + '_';
}else{
  var regTitle = new RegExp(appConfigJson.APP_TITLE_REGX);
  environment = url.match(regTitle)[1].toUpperCase() + '_NON_WEBJUNCTION_';
}

let pathNameVar = sessionStorage.getItem(environment + 'PAGE_TITLE');
let apertureService = JSON.parse(sessionStorage.getItem(environment + 'APERTURE_SERVICE'));
console.log('GlobalExtConstants apertureService************',apertureService);
if (!pathNameVar || pathNameVar === '' || pathNameVar === null) {
  if(url.includes('localhost')){
    var regTitle = new RegExp(appConfigJson.APP_TITLE_REGX_LOCAL);
    sessionStorage.setItem(environment + 'PAGE_TITLE',url.match(regTitle)[1].toUpperCase());
  }else{
    var regTitle = new RegExp(appConfigJson.APP_TITLE_REGX);
    sessionStorage.setItem(environment + 'PAGE_TITLE',url.match(regTitle)[1].toUpperCase());
  }
}

console.log('sessionStorage.getItem(PAGE_TITLE)>>>>>',sessionStorage.getItem(environment + 'PAGE_TITLE'));
pathNameVar = sessionStorage.getItem(environment + 'PAGE_TITLE').toLowerCase();
if(pathNameVar === 'a&ai'){
  pathNameVar = 'aai';
}
const appName = appConfigJson[pathNameVar.toUpperCase()];
const inventoryList =  require('app/assets/configuration/' + pathNameVar + '/' + appName.INVLIST);

var base = '';
var url = window.location.href;
if(url.includes('ecompc_')){
  base = PROTOCOL + '//' + BACKEND_IP_ADDRESS + '/' + url.split('/')[3];
}else{
  base = PROTOCOL + '//' + BACKEND_IP_ADDRESS + ':' + BACKEND_PORT_NUMBER;
}
const baseURL = base;

var overrideDomain = baseURL;
if(inventoryList.NODESERVER){
  overrideDomain = 'https://' + inventoryList.NODESERVER;
}
/*
REGEX - will use the REGEXP operation
EQ
CONTAINS - will use the LIKE operation in mysql (case insensitive by default)
STARTS_WITH - will use the LIKE operation in mysql (case insensitive by default)
ENDS_WITH - will use the LIKE operation in mysql (case insensitive by default)
GT
LT
GTE
LTE
*/


var filterTypeList = ['EQ','NEQ','CONTAINS','NOT_CONTAINS','STARTS_WITH','NOT_STARTS_WITH','ENDS_WITH','NOT_ENDS_WITH','GT','LT','GTE','LTE','REGEX','NOT_REGEX'];
var tabularFilterType = (apertureService) ? 'CONTAINS' : '=';
var uriDelimiter = '*';


export const GlobalExtConstants = {
  TITLE : appName.TITLE,
  ENVIRONMENT : environment,
  PATHNAME : pathNameVar,
  BASE_URL : baseURL,
  OVERRIDE_DOMAIN: overrideDomain,
  CUSTOMQUERYLIST :  require('app/assets/configuration/' + pathNameVar + '/' + appName.CUSTQUERYLIST),
  INVLIST : inventoryList,
  EDGERULES : require('app/assets/configuration/' + pathNameVar + '/dbedgeRules.json'),
  OXM : JSON.stringify(require('app/assets/configuration/' + pathNameVar + '/' + appName.OXM)),
  COLOR_BLUE : '#009fdb',
  PAGINATION_CONSTANT : { RESULTS_PER_PAGE : 50 , PAGE_RANGE_DISPLAY : 10},
  DOWNLOAD_ALL : 500,
  EXCELCELLS : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  DOWNLOAD_TOOLTIP : 'Downloads Current Page Results',
  APERTURE_SERVICE : apertureService,
  FILTER_TYPES: filterTypeList,
  TABULAR_FILTER_TYPE: tabularFilterType,
  URI_DELIMITCHAR: uriDelimiter,
  EMAIL_EXT: '@test.com'
};
