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
import keyMirror from 'utils/KeyMirror.js';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

export const VNF_TITLE = 'VNFs';

export const vnfActionTypes = keyMirror({
  COUNT_BY_PROV_STATUS_RECEIVED: null,
  ERROR_NO_DATA_FOR_PROV_STATUS_IN_SEARCH_RANGE_RECEIVED: null,
  COUNT_BY_ORCH_STATUS_RECEIVED: null,
  ERROR_NO_DATA_FOR_ORCH_STATUS_IN_SEARCH_RANGE_RECEIVED: null,
  TOTAL_VNF_COUNT_RECEIVED: null,
  ERROR_NO_COUNT_RECEIVED: null,
  VNF_NETWORK_ERROR: null
});

export const CHART_PROV_STATUS = {
  title: 'VNFs By Provisioning Status',
  yAxisLabel: 'VNFs',
  xAxisLabel: 'VNFs',
  emptyData: [{'values': [
    {
      'x': 'No data discovered for Provisioning Status',
      'y': 0
    }
  ]}]
};

export const CHART_ORCH_STATUS = {
  title: 'VNFs By Orchestration Status',
  yAxisLabel: 'VNFs',
  emptyData: [{'values': [
    {
      'x': 'No data discovered for Orchestration Status',
      'y': 0
    }
  ]}]
};

export const TOTAL_VNF_COUNT = {
  title: 'Total VNFs',
  emptyValue: 0
};

export const VNF_RESULT_URL = BASE_URL + '/search/summarybyentitytype';

export const DEFAULT_VNFS_SEARCH_HASH = '2172a3c25ae56e4995038ffbc1f055692bfc76c0b8ceda1205bc745a9f7a805d';
export const VNFS_ROUTE = 'vnfSearch';
