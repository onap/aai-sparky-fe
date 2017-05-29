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
  GET,
  POST_HEADER,
  ERROR_RETRIEVING_DATA,
  SAME_ORIGIN,
  BACKEND_IP_ADDRESS
} from 'app/networking/NetworkConstants.js';

import {
  INVENTORY_GEO_VISUALIZATION_SEARCH_URL,
  GEO_VISUALIZATION_QUERY_STRING_PARAMETERS,
  INVENTORY_COUNT_BY_TYPE_SEARCH_URL,
  INVENTORY_COUNT_BY_DATE_SEARCH_URL,
  InventoryActionTypes
} from 'app/inventory/InventoryConstants.js';

import {MESSAGE_LEVEL_DANGER} from 'utils/GlobalConstants.js';

function getSuccessfulTopographicVisualizationQueryEvent(responseJson) {
  return {
    type: InventoryActionTypes.TOPOGRAPHIC_QUERY_SUCCESS,
    data: {
      plotPoints: responseJson.plotPoints
    }
  };
}

function getFailedTopographicVisualizationQueryEvent() {
  return {
    type: InventoryActionTypes.TOPOGRAPHIC_QUERY_FAILED,
    data: {
      message: ERROR_RETRIEVING_DATA,
      severity: MESSAGE_LEVEL_DANGER
    }
  };
}

function getSuccessfulCountByTypeQueryEvent(responseJson) {
  return {
    type: InventoryActionTypes.COUNT_BY_ENTITY_SUCCESS,
    data: {
      countByType: responseJson.result
    }
  };
}

function getFailedCountByTypeQueryEvent() {
  return {
    type: InventoryActionTypes.COUNT_BY_ENTITY_FAILED,
    data: {
      message: ERROR_RETRIEVING_DATA,
      severity: MESSAGE_LEVEL_DANGER
    }
  };
}

function getSuccessfulCountsByDateQueryEvent(responseJson) {
  return {
    type: InventoryActionTypes.COUNT_BY_DATE_SUCCESS,
    data: {
      countByDate: responseJson.result
    }
  };
}

function getFailedCountByDateQueryEvent() {
  return {
    type: InventoryActionTypes.COUNT_BY_DATE_FAILED,
    data: {
      message: ERROR_RETRIEVING_DATA,
      severity: MESSAGE_LEVEL_DANGER
    }
  };
}

function getDynamicTopographicQueryURL(entityType) {
  return INVENTORY_GEO_VISUALIZATION_SEARCH_URL.replace(BACKEND_IP_ADDRESS,
      BACKEND_IP_ADDRESS) +
    GEO_VISUALIZATION_QUERY_STRING_PARAMETERS +
    entityType;
}

function getCountByTypeQueryURL() {
  return INVENTORY_COUNT_BY_TYPE_SEARCH_URL.replace(BACKEND_IP_ADDRESS,
    BACKEND_IP_ADDRESS);
}

function getCountByDateQueryURL() {
  return INVENTORY_COUNT_BY_DATE_SEARCH_URL.replace(BACKEND_IP_ADDRESS,
    BACKEND_IP_ADDRESS);
}

export function onLoadTotalCountByDate() {
  return function (dispatch) {
    fetch(getCountByDateQueryURL(), {
      credentials: SAME_ORIGIN,
      method: GET,
      headers: POST_HEADER
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => dispatch(
        getSuccessfulCountsByDateQueryEvent(responseJson))
    ).catch(
      () => dispatch(getFailedCountByDateQueryEvent())
    );
  };
}

export function onCountByTypeLoad() {
  return function (dispatch) {
    fetch(getCountByTypeQueryURL(), {
      credentials: SAME_ORIGIN,
      method: GET,
      headers: POST_HEADER
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => dispatch(
        getSuccessfulCountByTypeQueryEvent(responseJson))
    ).catch(
      () => dispatch(getFailedCountByTypeQueryEvent())
    );
  };
}

export function onTopographicMapMounted(requestObject) {
  return function (dispatch) {
    fetch(getDynamicTopographicQueryURL(requestObject.entityType), {
      credentials: SAME_ORIGIN,
      method: GET,
      headers: POST_HEADER
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => dispatch(
        getSuccessfulTopographicVisualizationQueryEvent(responseJson))
    ).catch(
      () => {
        dispatch(getFailedTopographicVisualizationQueryEvent());
      }
    );
  };
}

