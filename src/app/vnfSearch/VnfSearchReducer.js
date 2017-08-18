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
import {vnfActionTypes} from 'app/vnfSearch/VnfSearchConstants.js';
import {
  CHART_ORCH_STATUS,
  CHART_PROV_STATUS,
  TOTAL_VNF_COUNT
} from 'app/vnfSearch/VnfSearchConstants.js';
import {ERROR_RETRIEVING_DATA} from 'app/networking/NetworkConstants.js';
import {MESSAGE_LEVEL_DANGER} from 'utils/GlobalConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';

export default (state = {}, action) => {
  let data = action.data;
  switch (action.type) {

    case vnfActionTypes.COUNT_BY_PROV_STATUS_RECEIVED:
      return {
        ...state,
        processedProvStatusCountChartData: data.provStatusCountChartData.chartData,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };

    case vnfActionTypes.COUNT_BY_ORCH_STATUS_RECEIVED:
      return {
        ...state,
        processedOrchStatusCountChartData: data.orchStatusCountChartData.chartData,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
    case vnfActionTypes.TOTAL_VNF_COUNT_RECEIVED:
      return {
        ...state,
        count: data.count,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
    case vnfActionTypes.ERROR_NO_DATA_FOR_PROV_STATUS_IN_SEARCH_RANGE_RECEIVED:
      return {
        ...state,
        processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
      };
    case vnfActionTypes.ERROR_NO_DATA_FOR_ORCH_STATUS_IN_SEARCH_RANGE_RECEIVED:
      return {
        ...state,
        processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
      };
    case vnfActionTypes.ERROR_NO_COUNT_RECEIVED:
      return {
        ...state,
        count: TOTAL_VNF_COUNT.emptyValue,
      };
    case vnfActionTypes.VNF_NETWORK_ERROR:
      return {
        ...state,
        processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
        processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
        count: TOTAL_VNF_COUNT.emptyValue,
        feedbackMsgText: ERROR_RETRIEVING_DATA,
        feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
      };
    case globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT:
      return {
        ...state,
        processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
        processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
        count: TOTAL_VNF_COUNT.emptyValue
      };
  }

  return state;
};
