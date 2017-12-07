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
import keyMirror from 'utils/KeyMirror.js';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

export const VNF_TITLE = 'VNFs';
export const VNF_SEARCH_FILTER_NAME = 'vnfSearch';

export const vnfActionTypes = keyMirror({
  VNF_NETWORK_ERROR: null,
  VNF_SEARCH_RESULTS_RECEIVED: null,
  VNF_SEARCH_FILTERS_RECEIVED: null,
  VNF_FILTER_PANEL_TOGGLED: null
});

export const CHART_PROV_STATUS = {
  title: 'VNFs By Provisioning Status',
  yAxisLabel: 'VNFs',
  xAxisLabel: 'VNFs',
  emptyData: {'values': [
    {
      'x': 'No data discovered for Provisioning Status',
      'y': 0
    }
  ]}
};

export const CHART_ORCH_STATUS = {
  title: 'VNFs By Orchestration Status',
  yAxisLabel: 'VNFs',
  emptyData: {'values': [
    {
      'x': 'No data discovered for Orchestration Status',
      'y': 0
    }
  ]}
};

export const CHART_NF_TYPE = {
  title: 'VNFs By Network Function Type',
  yAxisLabel: 'VNFs',
  emptyData: {'values': [
    {
      'x': 'No data discovered for Network Function Type',
      'y': 0
    }
  ]}
};

export const CHART_NF_ROLE = {
  title: 'VNFs By Network Function Role',
  yAxisLabel: 'VNFs',
  emptyData: {'values': [
    {
      'x': 'No data discovered for Network Function Role',
      'y': 0
    }
  ]}
};

export const TOTAL_VNF_COUNT = {
  title: 'Total VNFs',
  emptyValue: ''
};

export const VNF_FILTER_AGGREGATION_URL = BASE_URL + '/rest/search/filterAggregation';

export const DEFAULT_VNFS_SEARCH_HASH = '2172a3c25ae56e4995038ffbc1f055692bfc76c0b8ceda1205bc745a9f7a805d';
export const VNFS_ROUTE = 'vnfSearch';
export const VNF_FILTER_EMPTY_RESULT = 'No data for the specified filters';
