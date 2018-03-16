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
import {setAttributesActionTypes} from './EditAttributeConstants.js';
import {
  MESSAGE_LEVEL_SUCCESS,
  MESSAGE_LEVEL_DANGER
} from 'utils/GlobalConstants.js';

export default (state = {}, action) => {
  switch (action.type) {
    case setAttributesActionTypes.SET_ATTRIBUTE_ERROR:
      return {
        ...state,
        feedbackMsgText: action.data.errorMsg,
        feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
      };

    case setAttributesActionTypes.SET_ATTRIBUTE_SUCCESS:
      return {
        ...state,
        feedbackMsgText: action.data.successMsg,
        feedbackMsgSeverity: MESSAGE_LEVEL_SUCCESS
      };

    case setAttributesActionTypes.CLEAR_FEEDBACK_MESSAGE:
      return {
        ...state,
        feedbackMsgText: '',
        feedbackMsgSeverity: ''
      };
  }
  return state;
};
