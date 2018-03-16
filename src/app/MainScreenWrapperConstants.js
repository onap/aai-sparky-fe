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
import keyMirror from 'utils/KeyMirror.js';

export const aaiActionTypes = keyMirror({
  SET_CURRENT_SCREEN: null,
  AAI_WINDOW_RESIZE: null,
  AAI_SHOW_MENU: null,
  EXTENSIBLE_VIEW_NETWORK_CALLBACK_RESPONSE_RECEIVED: null,
  EXTENSIBLE_VIEW_NETWORK_CALLBACK_CLEAR_DATA: null,
  SET_SECONDARY_TITLE: null
});

export const screens = keyMirror({
  TIER_SUPPORT: null,
  INVENTORY: null,
  VNF_SEARCH: null
});

export const AAI_TITLE = 'A&AI';
export const MENU_ITEM_TIER_SUPPORT = 'View & Inspect';
export const MENU_ITEM_VNF_SEARCH = 'VNFs';
