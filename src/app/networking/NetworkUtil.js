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
  AUDIT_SEARCH_DATE_FORMAT,
  AUDIT_SEARCH_DATE_TIME_ZONE
} from './NetworkConstants.js';

export function getTableDateQueryString(requestObject) {
  return {
    'queryParameters': {
      'startDate': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'endDate': requestObject.dateRange.endDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'time_zone': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_TIME_ZONE),
      'typeData': {
        'type': 'pagination',
        'from': requestObject.startIndex,
        'size': requestObject.resultCount
      }
    }
  };
}

export function getTSUIElasticSearchQueryString(query) {
  // Create the query request
  let posFirstEqualSign = query.indexOf('=');
  let newQuery = query.substring(posFirstEqualSign + 1);  // remove the first
                                                          // 'attrName=' from
                                                          //'attrName=attrValue'
  newQuery = newQuery.replace(/\,[^\=]+\=/gi, ' ');  // remove all ', attrName='
  newQuery = newQuery.trim(); // remove whitespace at both ends, if any

  return {
    'maxResults': '10',
    'queryStr': newQuery
  };
}
export function getSeverityVisualizationQueryString(requestObject) {
  return {
    'queryParameters': {
      'startDate': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'endDate': requestObject.dateRange.endDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'time_zone': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_TIME_ZONE),
      'typeData': {
        'type': 'groupBy',
        'groupByField': 'severity'
      }
    }
  };
}

export function getStatusVisualizationQueryString(requestObject) {
  return {
    'queryParameters': {
      'startDate': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'endDate': requestObject.dateRange.endDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'time_zone': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_TIME_ZONE),
      'typeData': {
        'type': 'groupBy',
        'groupByField': 'category'
      }
    }
  };
}

export function getEntityTypeVisualizationQueryString(requestObject) {
  return {
    'queryParameters': {
      'startDate': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'endDate': requestObject.dateRange.endDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'time_zone': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_TIME_ZONE),
      'typeData': {
        'type': 'groupBy',
        'groupByField': 'entityType'
      }
    }
  };
}

export function getDateVisualizationQueryString(requestObject) {
  return {
    'queryParameters': {
      'startDate': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'endDate': requestObject.dateRange.endDate.format(
        AUDIT_SEARCH_DATE_FORMAT),
      'time_zone': requestObject.dateRange.startDate.format(
        AUDIT_SEARCH_DATE_TIME_ZONE),
      'typeData': {
        'type': 'dateHistogram'
      }
    }
  };
}

export function getVnfOrchStatusQueryString(requestObject) {
  return {
    'hashId': requestObject,
    'groupby': 'orchestration-status'
  };
}
export function getVnfProvStatusQueryString(requestObject) {
  return {
    'hashId': requestObject,
    'groupby': 'prov-status'
  };
}
export function getVnfCountQueryString(requestObject) {
  return {
    'hashId': requestObject
  };
}





