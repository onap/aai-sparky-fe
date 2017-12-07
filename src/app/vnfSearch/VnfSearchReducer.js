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
import {vnfActionTypes} from 'app/vnfSearch/VnfSearchConstants.js';
import {
  CHART_ORCH_STATUS,
  CHART_PROV_STATUS,
  CHART_NF_ROLE,
  CHART_NF_TYPE,
  TOTAL_VNF_COUNT
} from 'app/vnfSearch/VnfSearchConstants.js';
import {ERROR_RETRIEVING_DATA} from 'app/networking/NetworkConstants.js';
import {MESSAGE_LEVEL_DANGER} from 'utils/GlobalConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';
import {
  filterBarActionTypes
} from 'generic-components/filterBar/FilterBarConstants.js';

export default (state = {}, action) => {
  let data = action.data;
  switch (action.type) {
    case vnfActionTypes.VNF_NETWORK_ERROR:
      return {
        ...state,
        processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
        processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
        processedNfTypeCountChartData: CHART_NF_TYPE.emptyData,
        processedNfRoleCountChartData: CHART_NF_ROLE.emptyData,
        count: TOTAL_VNF_COUNT.emptyValue,
        feedbackMsgText: ERROR_RETRIEVING_DATA,
        feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
      };
    case globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT:
      return {
        ...state,
        processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
        processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
        processedNfTypeCountChartData: CHART_NF_TYPE.emptyData,
        processedNfRoleCountChartData: CHART_NF_ROLE.emptyData,
        count: TOTAL_VNF_COUNT.emptyValue
      };
    case filterBarActionTypes.NEW_SELECTIONS:
      return {
        ...state,
        vnfFilterValues: data.selectedValuesMap,
        unifiedFilterValues: data.unifiedValues
      };
    case filterBarActionTypes.SET_UNIFIED_VALUES:
      return {
        ...state,
        unifiedFilterValues: data
      };
    case vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED:
      return {
        ...state,
        count: data.count,
        processedProvStatusCountChartData: data.provStatusData,
        processedOrchStatusCountChartData: data.orchStatusData,
        processedNfTypeCountChartData: data.nfTypeData,
        processedNfRoleCountChartData: data.nfRoleData,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
    case vnfActionTypes.VNF_FILTER_PANEL_TOGGLED:
      return {
        ...state,
        vnfVisualizationPanelClass: data.vnfVisualizationPanelClass
      };
    case vnfActionTypes.VNF_SEARCH_FILTERS_RECEIVED:
      return {
        ...state,
        vnfFilters: data
      };
    case filterBarActionTypes.SET_NON_CONVERTED_VALUES:
      return {
        ...state,
        nonConvertedFilters: data
      };
    case filterBarActionTypes.SET_CONVERTED_VALUES:
      return {
        ...state,
        nonConvertedFilters: {},
        unifiedFilterValues: data.convertedValues,
        vnfFilterValues: data.nonConvertedValues  // launching DI view via menu button requires this
                                                  // to be set so visualizations and table will populate themselves
      };
    case filterBarActionTypes.CLEAR_FILTERS:
      return {
        ...state,
        vnfFilters: {},
        vnfFilterValues: {},
        nonConvertedFilters: {},
        unifiedFilterValues: {}
      };
  }

  return state;
};
