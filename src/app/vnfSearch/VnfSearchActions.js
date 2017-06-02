/*
 * ============LICENSE_START===================================================
 * SPARKY (AAI UI service)
 * ============================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ============================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=====================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

import {
  vnfActionTypes,
  VNF_RESULT_URL
} from 'app/vnfSearch/VnfSearchConstants.js';

import {
  getVnfProvStatusQueryString,
  getVnfOrchStatusQueryString,
  getVnfCountQueryString
} from 'app/networking/NetworkUtil.js';
import {
  POST,
  POST_HEADER,
  ERROR_RETRIEVING_DATA
} from 'app/networking/NetworkConstants.js';
import {
  getSetGlobalMessageEvent,
  getClearGlobalMessageEvent
} from 'app/GlobalInlineMessageBar/GlobalInlineMessageBarActions.js';

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
/*it is a vertical bar chart then y and x are switched */
function getProvStatusEvent(responseJson) {
  if (responseJson && responseJson.groupby_aggregation &&
    responseJson.groupby_aggregation.buckets &&
    responseJson.groupby_aggregation.buckets.length > 0) {
    let groupByProvStatusBucket;
    let dataPoints = [];
    for (groupByProvStatusBucket of
      responseJson.groupby_aggregation.buckets) {
      dataPoints.push({
        'x': groupByProvStatusBucket[itemKeyWord].split('=', 1)[0],
        'y': groupByProvStatusBucket[countKeyWord]
      });
    }

    let newProvStatusChartData = [
      {
        'values': dataPoints
      }
    ];

    let provStatusCountChartData = {
      chartData: newProvStatusChartData
    };
    return {
      type: vnfActionTypes.COUNT_BY_PROV_STATUS_RECEIVED,
      data: {provStatusCountChartData}
    };
  }
  else {
    return {
      type: vnfActionTypes.ERROR_NO_DATA_FOR_PROV_STATUS_IN_SEARCH_RANGE_RECEIVED
    };
  }
}

function getOrchStatusEvent(responseJson) {
  if (responseJson && responseJson.groupby_aggregation &&
    responseJson.groupby_aggregation.buckets &&
    responseJson.groupby_aggregation.buckets.length > 0) {
    let groupByOrchStatusBucket;
    let dataPoints = [];
    for (groupByOrchStatusBucket of
      responseJson.groupby_aggregation.buckets) {
      dataPoints.push({
        'x': groupByOrchStatusBucket[itemKeyWord].split('=', 1)[0],
        'y': groupByOrchStatusBucket[countKeyWord]
      });
    }

    let newOrchStatusChartData = [
      {
        'values': dataPoints
      }
    ];

    let orchStatusCountChartData = {
      chartData: newOrchStatusChartData
    };
    return {
      type: vnfActionTypes.COUNT_BY_ORCH_STATUS_RECEIVED,
      data: {orchStatusCountChartData}
    };
  }
  else {
    return {
      type: vnfActionTypes.ERROR_NO_DATA_FOR_ORCH_STATUS_IN_SEARCH_RANGE_RECEIVED
    };
  }
}

function getTotalVnfEvent(responseJson) {
  if (responseJson && responseJson.count && responseJson.count > 0) {
    return {
      type: vnfActionTypes.TOTAL_VNF_COUNT_RECEIVED,
      data: {count: responseJson.count}
    };
  }
  else {
    return {
      type: vnfActionTypes.ERROR_NO_COUNT_RECEIVED
    };
  }
}

export function processProvStatusVisualizationOnSearchChange(requestObject) {
  return dispatch => {
    return fetch(VNF_RESULT_URL, {
      method: POST,
      headers: POST_HEADER,
      body: JSON.stringify(getVnfProvStatusQueryString(requestObject))
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        dispatch(getProvStatusEvent(responseJson));
      }
    ).catch(
      () => {
        dispatch(getInvalidQueryEvent());
      }
    );
  };
}

export function processOrchStatusVisualizationOnSearchChange(requestObject) {
  return dispatch => {
    return fetch(VNF_RESULT_URL, {
      method: POST,
      headers: POST_HEADER,
      body: JSON.stringify(getVnfOrchStatusQueryString(requestObject))
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        dispatch(getOrchStatusEvent(responseJson));
      }
    ).catch(
      () => {
        dispatch(getInvalidQueryEvent());
      }
    );
  };
}

export function processTotalVnfVisualizationOnSearchChange(requestObject) {
  return dispatch => {
    return fetch(VNF_RESULT_URL + '/count', {
      method: POST,
      headers: POST_HEADER,
      body: JSON.stringify(
        getVnfCountQueryString(requestObject))
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        dispatch(getTotalVnfEvent(responseJson));
      }
    ).catch(
      () => {
        dispatch(getInvalidQueryEvent());
      }
    );
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
