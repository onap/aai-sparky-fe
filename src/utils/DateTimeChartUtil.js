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

let moment = require('moment');
let d3Scale = require('d3-scale');
let d3Time = require('d3-time');

/**
 * Converts specified time (ms since epoc) into a
 * MM/DD/YYYY format for the local timezone
 */
export function dateFormatLocalTimeZoneMMDDYYYY(time) {
  return moment(time).format('L');
};

/**
 * Converts specified time (ms since epoc) into a
 * YYYY-MM-DD format for the local timezone
 */
export function dateFormatLocalTimeZoneYYYYMMDD(time) {
  return moment(time).format('YYYY-MM-DD');
};

/**
 * Build a map of 'ticks' to be used on a graph axis based on the date range
 * identified by the specified JSON attribute (ticks will be on a daily basis)
 * @param data - the array of JSON data
 * @param attrKey - the attribute within the JSON containing the date
 * @returns - a map of ticks, one for each day within the range of dates
 *   covered by the specified data
 */
export function getTicks(data, attrKey) {
  if (!data || !data.length) {
    return [];
  }

  const domain = [new Date(data[0][attrKey]),
    new Date(data[data.length - 1][attrKey])];
  const scale = d3Scale.scaleTime().domain(domain).range([0, 1]);
  const ticks = scale.ticks(d3Time.timeDay, 1);

  return ticks.map(entry => +entry);
};

/**
 * Merges ticks into a list of data points
 * @param data - the list of data points (each point is a date/value pair)
 * @param ticks - a map of date based points to merge with the list of data
 * @param attrKey - the attribute which contains teh date value
 * @returns - an integrated list of data points and ticks
 */
export function getTicksData(data, ticks, attrKey) {
  if (!data || !data.length) {
    return [];
  }

  const dataMap = new Map(data.map((i) => [i[attrKey], i]));
  ticks.forEach(function (item) {
    if (!dataMap.has(item)) {
      let jsonObj = {};
      jsonObj[attrKey] = item;
      data.push(jsonObj);
    }
  });
  return data;
};

/**
 * Sort an array of JSON data by a specified attribute
 * @param data - array of JSON objects to be sorted
 * @param field - the attribute to sort on
 * @returns - the sorted array
 */
export function sortDataByField(data, field) {
  return data.sort(function (a, b) {
    return a[field] - b[field];
  });
};
