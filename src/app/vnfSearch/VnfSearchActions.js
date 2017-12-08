/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017 Amdocs
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
 *
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */
 
import {
  vnfActionTypes,
  VNF_FILTER_AGGREGATION_URL,
  CHART_PROV_STATUS,
  CHART_ORCH_STATUS,
  CHART_NF_TYPE,
  CHART_NF_ROLE,
  TOTAL_VNF_COUNT,
  VNF_FILTER_EMPTY_RESULT
} from 'app/vnfSearch/VnfSearchConstants.js';
import {
  POST,
  POST_HEADER,
  ERROR_RETRIEVING_DATA
} from 'app/networking/NetworkConstants.js';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {MESSAGE_LEVEL_WARNING} from 'utils/GlobalConstants.js';

let fetch = require('node-fetch');
fetch.Promise = require('es6-promise').Promise;

const itemKeyWord = 'key';
const countKeyWord = 'doc_count';

function getInvalidQueryEvent() {
  return {
    type: vnfActionTypes.VNF_NETWORK_ERROR,
    data: {errorMsg: ERROR_RETRIEVING_DATA}
  };
}

function processProvData(provDataList) {
  let dataPoints = [];
  let newProvStatusChartData = CHART_PROV_STATUS.emptyData;
  for (let provData of provDataList) {
    dataPoints.push(
      {
        'x': provData[itemKeyWord],
        'y': provData[countKeyWord]
      }
    );
  }

  if (dataPoints.length > 0) {
    newProvStatusChartData = {
      'values': dataPoints
    };
  }

  return newProvStatusChartData;
}

function processOrchData(orchDataList) {
  let dataPoints = [];
  let newOrchStatusChartData = CHART_ORCH_STATUS.emptyData;
  for (let orchData of orchDataList) {
    dataPoints.push(
      {
        'x': orchData[itemKeyWord],
        'y': orchData[countKeyWord]
      }
    );
  }

  if (dataPoints.length > 0) {
    newOrchStatusChartData = {
      'values': dataPoints
    };
  }

  return newOrchStatusChartData;
}

function processNfTypeData(nfDataList) {
  let dataPoints = [];
  let newNfTypeChartData = CHART_NF_TYPE.emptyData;
  for (let nfData of nfDataList) {
    dataPoints.push(
      {
        'x': nfData[itemKeyWord],
        'y': nfData[countKeyWord]
      }
    );
  }

  if (dataPoints.length > 0) {
    newNfTypeChartData = {
      'values': dataPoints
    };
  }

  return newNfTypeChartData;
}

function processNfRoleData(nfDataList) {
  let dataPoints = [];
  let newNfRoleChartData = CHART_NF_ROLE.emptyData;
  for (let nfData of nfDataList) {
    dataPoints.push(
      {
        'x': nfData[itemKeyWord],
        'y': nfData[countKeyWord]
      }
    );
  }

  if (dataPoints.length > 0) {
    newNfRoleChartData = {
      'values': dataPoints
    };
  }

  return newNfRoleChartData;
}

function getVnfFilterAggregationQueryString(filterValueMap) {
  let filterList = [];

  for (let filter in filterValueMap) {
    if (filterValueMap[filter] !== '') {
      filterList.push(
        {
          'filterId': filter,
          'filterValue': filterValueMap[filter]
        }
      );
    } else {
      filterList.push(
        {
          'filterId': filter
        }
      );
    }
  }

  return {
    'filters': filterList
  };
}

function getVnfVisualizationsResultsEvent(results) {
  let count = TOTAL_VNF_COUNT.emptyData;
  let provData = CHART_PROV_STATUS.emptyData;
  let orchData = CHART_ORCH_STATUS.emptyData;
  let netFuncTypeData = CHART_NF_TYPE.emptyData;
  let netFuncRoleData = CHART_NF_ROLE.emptyData;

  if (results.total) {
    count = results.total;
  }

  if (results['aggregations'] && results['aggregations']['prov-status']) {
    provData = processProvData(results['aggregations']['prov-status']);
  }

  if (results['aggregations'] &&
    results['aggregations']['orchestration-status']) {
    orchData = processOrchData(results['aggregations']['orchestration-status']);
  }

  if (results['aggregations'] &&
    results['aggregations']['nf-type']) {
    netFuncTypeData = processNfTypeData(results['aggregations']['nf-type']);
  }

  if (results['aggregations'] &&
    results['aggregations']['nf-role']) {
    netFuncRoleData = processNfRoleData(results['aggregations']['nf-role']);
  }

  return {
    type: vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED,
    data: {
      count: count,
      provStatusData: provData,
      orchStatusData: orchData,
      nfTypeData: netFuncTypeData,
      nfRoleData: netFuncRoleData
    }
  };
}

export function processVnfVisualizationsOnFilterChange(filterValueMap) {
  return dispatch => {
    return fetch(VNF_FILTER_AGGREGATION_URL, {
      method: POST,
      headers: POST_HEADER,
      body: JSON.stringify(getVnfFilterAggregationQueryString(filterValueMap))
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        if(responseJson.total === 0) {
          dispatch(getSetGlobalMessageEvent(VNF_FILTER_EMPTY_RESULT, MESSAGE_LEVEL_WARNING));
        } else {
          dispatch(getClearGlobalMessageEvent());
        }
        dispatch(getVnfVisualizationsResultsEvent(responseJson));
      }
    ).catch(
      () => {
        dispatch(getInvalidQueryEvent());
      }
    );
  };
}

export function processVnfFilterPanelCollapse(isOpen) {
  let vnfVisualizationPanelClass = 'collapsible-panel-main-panel';

  if (isOpen) {
    vnfVisualizationPanelClass += ' vertical-filter-panel-is-open';
  }

  return {
    type: vnfActionTypes.VNF_FILTER_PANEL_TOGGLED,
    data: {
      vnfVisualizationPanelClass: vnfVisualizationPanelClass
    }
  };
}

export function setNotificationText(msgText, msgSeverity) {
  if (msgText.length > 0) {
    return dispatch => {
      dispatch(
        getSetGlobalMessageEvent(msgText, msgSeverity));
    };
  } else {
    return dispatch => {
      dispatch(getClearGlobalMessageEvent());
    };
  }
}

export function clearVnfSearchData() {
  return {
    type: vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED,
    data: {
      count: '',
      provStatusData: CHART_PROV_STATUS.emptyData,
      orchStatusData: CHART_ORCH_STATUS.emptyData,
      nfTypeData: CHART_NF_TYPE.emptyData,
      nfRoleData: CHART_NF_ROLE.emptyData
    }
  };
}
