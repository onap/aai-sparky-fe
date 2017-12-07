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

export const InventoryActionTypes = keyMirror({
  TOPOGRAPHIC_QUERY_SUCCESS: null,
  TOPOGRAPHIC_QUERY_FAILED: null,
  COUNT_BY_ENTITY_SUCCESS: null,
  COUNT_BY_ENTITY_FAILED: null,
  COUNT_BY_DATE_SUCCESS: null,
  COUNT_BY_DATE_FAILED: null
});

export const INVENTORY_TITLE = 'Active Inventory';
export const COMPLEX_BY_LOCATION_TITLE = 'Complexes By Location';
export const TOTAL_ENTITY_COUNT_TITLE = 'Total Entities';
export const ENTITIES_BY_TYPE_TITLE = 'Entities By Type';

export const INVENTORY_COUNT_BY_TYPE_SEARCH_URL = BASE_URL + '/rest/visualization/entityCountHistory?type=table';
export const INVENTORY_COUNT_BY_DATE_SEARCH_URL = BASE_URL + '/rest/visualization/entityCountHistory?type=graph';
export const INVENTORY_GEO_VISUALIZATION_SEARCH_URL = BASE_URL + '/rest/visualization/geovisualization';
export const GEO_VISUALIZATION_QUERY_STRING_PARAMETERS = '/?entity=';

export const TOTAL_ENTITY_COUNTS_BY_DATE_CHART = {
  title: 'Total Entities By Date',
  yAxisLabel: 'Entities',
  emptyData: [{
    values: []
  }]
};
