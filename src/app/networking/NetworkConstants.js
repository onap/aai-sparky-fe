/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
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
 */
export const POST = 'POST';
export const GET = 'GET';
export const POST_HEADER = {'Accept': 'application/json'};
export const SAME_ORIGIN = 'same-origin';
export const BACKEND_POST_HEADER = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
export const ERROR_RETRIEVING_DATA = 'Error fetching data from server';
export const NO_RESULTS_FOUND = 'No Results Found';
const BACKEND_IP_ADDRESS = document.location.hostname;
const BACKEND_PORT_NUMBER = window.location.port;
const PROTOCOL = window.location.protocol;
export const BASE_URL = PROTOCOL + '//' + BACKEND_IP_ADDRESS + ':' + BACKEND_PORT_NUMBER;
