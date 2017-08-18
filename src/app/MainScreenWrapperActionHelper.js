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
import {aaiActionTypes} from './MainScreenWrapperConstants.js';

function createWindowSizeChangeEvent() {
  return {
    type: aaiActionTypes.AAI_WINDOW_RESIZE
  };
}

function createShowMenuEvent(show) {
  return {
    type: aaiActionTypes.AAI_SHOW_MENU,
    data: {
      showMenu: show
    }
  };
}

export function windowResize() {
  return dispatch => {
    dispatch(createWindowSizeChangeEvent());
  };
}

export function showMainMenu(show) {
  return dispatch => {
    dispatch(createShowMenuEvent(show));
  };
}
