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
import isEmpty from 'lodash/isEmpty';
import moment from 'moment-timezone';
import {
  POST,
  POST_HEADER
} from 'app/networking/NetworkConstants.js';
import {
  UNIFIED_FILTERS_URL,
  DISCOVER_FILTERS_ERROR_MSG,
  DATE_TIME_ZONE,
  FILTER_ATTRIBUTE_TO,
  FILTER_ATTRIBUTE_FROM,
  FILTER_ATTRIBUTE_CODE,
  FILTER_ATTRIBUTE_VALUES,
  FILTER_ATTRIBUTE_CONTROLS,
  FILTER_ATTRIBUTE_DEFAULT_VALUE,
  FILTER_TYPE_ENUM,
  filterBarActionTypes
} from 'generic-components/filterBar/FilterBarConstants.js';
import {
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js';
import {
  getSetGlobalMessageEvent
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';

export function buildFilterValueMap(filterValueString) {
  let filterValueObj = {};
  let filters = filterValueString.split(',');

  for (let filterIndex in filters) {
    let filterStringParts = filters[filterIndex].split('=');

    filterValueObj[filterStringParts[0]] = filterStringParts[1];
  }

  return filterValueObj;
}

export function buildFilterValueMapFromObj(filterValues) {
  let filterValueObj = {};

  for (let filterIndex in filterValues) {
    filterValueObj[filterValues[filterIndex].filterId] = filterValues[filterIndex].filterValue;
  }

  return filterValueObj;
}

export function getFilterListQueryString(filterValueList) {
  let filterQueryList = [];

  for (let filter in filterValueList) {
    if (filterValueList[filter]) {
      filterQueryList.push(
        {
          'filterId': filter,
          'filterValue': filterValueList[filter]
        }
      );
    }
  }

  return filterQueryList;
}

function getFilterSearchURL() {
  return UNIFIED_FILTERS_URL.replace('@@IP-ADDRESS@@', document.location.hostname);
}

function getFiltersQueryObject(viewName) {
  return {
    'viewName': viewName
  };
}

function getFiltersEvent(actionType, filterList) {
  return {
    type: actionType,
    data: filterList
  };
}

export function getUnifiedFilters(viewName, actionType) {
  return dispatch => {
    return fetch(getFilterSearchURL(), {
      credentials: 'same-origin',
      method: POST,
      headers: POST_HEADER,
      body: JSON.stringify(getFiltersQueryObject(viewName))
    }).then(
      (response) => response.json()
    ).then(
      (responseJson) => {
        dispatch(
          getFiltersEvent(actionType, responseJson.filters)
        );
      }
    ).catch(
      () => {
        dispatch(getSetGlobalMessageEvent(DISCOVER_FILTERS_ERROR_MSG, MESSAGE_LEVEL_WARNING));
      }
    );
  };
}

function extractConvertedDateValues(dateValues) {
  let convertedValues = {};
  if (dateValues.from) {
    let startMoment = moment(dateValues.from);
    convertedValues.startDate = startMoment.toDate();
    convertedValues.time_zone = startMoment.format(DATE_TIME_ZONE);
  }

  if (dateValues.to) {
    let endMoment = moment(dateValues.to);
    convertedValues.endDate = endMoment.toDate();
    convertedValues.time_zone = endMoment.format(DATE_TIME_ZONE);
  }

  convertedValues.code = dateValues.code;

  return convertedValues;
}

function convertFilterValues(filterValues) {
  let convertedFilterValues = {};

  for (let filterId in filterValues) {
    if (filterValues.hasOwnProperty(filterId) &&
      !isEmpty(filterValues[filterId]) && !isEmpty(filterValues[filterId].controls)) {
      let controls = filterValues[filterId].controls;
      let firstControlKey = Object.keys(controls)[0];
      if (controls[firstControlKey][FILTER_ATTRIBUTE_VALUES][FILTER_ATTRIBUTE_FROM] ||
        controls[firstControlKey][FILTER_ATTRIBUTE_VALUES][FILTER_ATTRIBUTE_TO]) {
        // TODO should check against filter type (ex: dropdown or date)
        // rather than assuming value attributes (ex: 'to' or 'from')
        convertedFilterValues[filterId] =
          extractConvertedDateValues(controls[firstControlKey][FILTER_ATTRIBUTE_VALUES]);
      } else {
        let codeValue = controls[firstControlKey][FILTER_ATTRIBUTE_VALUES][FILTER_ATTRIBUTE_CODE];
        convertedFilterValues[filterId] = codeValue;
      }
    }
  }

  return convertedFilterValues;
}

function combineMissingFilters(filterValues, allFilters) {
  let allFilterIds = Object.keys(allFilters);

  for (let id in allFilterIds) {
    if (!filterValues.hasOwnProperty(allFilterIds[id])) {
      filterValues[allFilterIds[id]] = '';
    }
  }

  return filterValues;
}

function getFilterSelectionEvent(selectedValuesMap, convertedValues) {
  return {
    type: filterBarActionTypes.NEW_SELECTIONS,
    data: {
      selectedValuesMap: convertedValues,
      unifiedValues: selectedValuesMap
    }
  };
}

export function processFilterSelection(filterValues, allFilters) {
  let convertedFilterValues = convertFilterValues(filterValues);
  let combinedFilterValues = combineMissingFilters(convertedFilterValues, allFilters);

  // dispatch NEW_SELECTION event type with converted values as the data
  return getFilterSelectionEvent(filterValues, combinedFilterValues);
}

export function setNonConvertedFilterValues(nonConvertedValues) {
  return {
    type: filterBarActionTypes.SET_NON_CONVERTED_VALUES,
    data: nonConvertedValues
  };
}

function convertedFilterValuesEvent(nonConvertedValues, convertedValues) {
  return {
    type: filterBarActionTypes.SET_CONVERTED_VALUES,
    data: {
      nonConvertedValues: nonConvertedValues,
      convertedValues: convertedValues
    }
  };
}

function mapValuesToOption(filterOptions, nonConvertedValue) {
  let mappedValues = {};

  // loop over options to find match for value
  for (let i in filterOptions) {
    if (filterOptions[i].code === nonConvertedValue) {
      // found the matching
      mappedValues = filterOptions[i];
      break;
    }
  }

  return mappedValues;
}

function mapValuesToDateOption(nonConvertedValue) {
  let mappedValues = {};

  if (nonConvertedValue.startDate) {
    mappedValues.from = new Date(nonConvertedValue.startDate);
  } else {
    mappedValues.from = null;
  }

  if (nonConvertedValue.endDate) {
    mappedValues.to = new Date(nonConvertedValue.endDate);
  } else {
    mappedValues.to = null;
  }

  mappedValues.code = nonConvertedValue.code;

  return mappedValues;
}

function mapValuesToFilter(nonConvertedValues, allFilters, currentlySetFilterValues) {
  let convertedValues = {};

  for (let nonConvertedId in nonConvertedValues) {
    if (nonConvertedValues[nonConvertedId] !== '') {
      let matchingFilterObj = allFilters[nonConvertedId];
      let filterControlId = Object.keys(matchingFilterObj.controls)[0];
      let mappedValue = {};

      if (matchingFilterObj[FILTER_ATTRIBUTE_CONTROLS][filterControlId].type === FILTER_TYPE_ENUM.DATE) {
        mappedValue = mapValuesToDateOption(nonConvertedValues[nonConvertedId]);
      } else {
        mappedValue = mapValuesToOption(matchingFilterObj[FILTER_ATTRIBUTE_CONTROLS][filterControlId].options,
          nonConvertedValues[nonConvertedId]);
      }

      let values = {};
      values[FILTER_ATTRIBUTE_VALUES] = mappedValue;
      let filterControlers = {};
      filterControlers[filterControlId] = values;
      let filter = {};
      filter[FILTER_ATTRIBUTE_CONTROLS] = filterControlers;
      convertedValues[nonConvertedId] = filter;
    } else if (!isEmpty(currentlySetFilterValues[nonConvertedId])) {
      // currently a value is set for this filter, need to ensure we map this filter
      // to an empty value so that it is cleared/reset
      let matchingFilterObj = allFilters[nonConvertedId];
      let filterControlId = Object.keys(matchingFilterObj.controls)[0];
      let mappedValue = {};
      let values = {};
      values[FILTER_ATTRIBUTE_VALUES] = mappedValue;
      let filterControlers = {};
      filterControlers[filterControlId] = values;
      let filter = {};
      filter[FILTER_ATTRIBUTE_CONTROLS] = filterControlers;
      convertedValues[nonConvertedId] = filter;
    }
  }

  return convertedValues;
}

export function convertNonConvertedValues(nonConvertedValues, allFilters, currentlySetFilterValues) {
  let convertedValues = mapValuesToFilter(nonConvertedValues, allFilters, currentlySetFilterValues);
  return convertedFilterValuesEvent(nonConvertedValues, convertedValues);
}

export function clearFilters() {
  return {
    type: filterBarActionTypes.CLEAR_FILTERS
  };
}

function getSetUnifiedFilterValuesEvent(unifiedValues) {
  return {
    type: filterBarActionTypes.SET_UNIFIED_VALUES,
    data: unifiedValues
  };
}

function getFilterDefault(filters, filterId) {
  let filterControlId = Object.keys(filters[filterId][FILTER_ATTRIBUTE_CONTROLS])[0];
  let defaultValue = filters[filterId][FILTER_ATTRIBUTE_CONTROLS][filterControlId][FILTER_ATTRIBUTE_DEFAULT_VALUE];
  if (!defaultValue) {
    defaultValue = {};
  }
  return defaultValue;
}

export function setFilterSelectionsToDefaults(filters, filterValues) {
  let defaultFilterMap = {};

  for (let filterId in filters) {
    let filterDefaultValue = getFilterDefault(filters, filterId);
    if (!isEmpty(filterDefaultValue) || (filterValues && filterValues[filterId])) {
      let filterControlId = Object.keys(filters[filterId][FILTER_ATTRIBUTE_CONTROLS])[0];
      let controller = {};
      controller.values = filterDefaultValue;
      let controllers = {};
      controllers[filterControlId] = controller;
      let controls = {};
      controls.controls = controllers;
      defaultFilterMap[filterId] = controls;
    }
  }

  if (isEmpty(defaultFilterMap)) {
    // there are no default values, so need to ensure all filters get cleared,
    // but just incase this 'clearing'
    let combinedValues = combineMissingFilters(defaultFilterMap, filters);
    return setNonConvertedFilterValues(combinedValues);
  } else {
    // jsut set the Unified Filter Value which will be sent down to the filter (filter
    // will set itself to the default value and then send notification back up of the selection
    return getSetUnifiedFilterValuesEvent(defaultFilterMap);
  }
}
