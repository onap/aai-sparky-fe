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
