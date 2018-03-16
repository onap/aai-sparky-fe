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
import React, {Component} from 'react';
import {connect} from 'react-redux';
import i18n from 'utils/i18n/i18n';

import InlineMessage from 'generic-components/InlineMessage/InlineMessage.jsx';
import {
  clearFeebackMessage,
  requestEditEntityAttributes
} from './EditAttributeActions.js';
import {
  SET_ATTRIBUTE_TITLE,
  ATTRIBUTE_MODIFICATION
} from './EditAttributeConstants.js';
import ChangeAttributeForm from 'editAttributes/changeAttributeForm/ChangeAttributeForm.jsx';
import {NO_VALUE_SELECTED} from 'editAttributes/changeAttributeForm/ChangeAttributeFormConstants.js';

let mapStateToProps = ({setAttributes}) => {
  let {
        feedbackMsgText = '',
        feedbackMsgSeverity = ''
      } = setAttributes;

  return {
    feedbackMsgText,
    feedbackMsgSeverity
  };
};

let mapActionToProps = (dispatch) => {
  return {
    handleSubmit: (values) => {
      let uri = values.uri;
      let attrMap = new Map();
      attrMap.set('provStatus', 'prov-status');
      attrMap.set('inMaint', 'in-maint');
      attrMap.set('isClosedLoopDisabled', 'is-closed-loop-disabled');
  
      let attributes = {};
      let valueString = JSON.stringify(values);
      JSON.parse(valueString, (key, value) => {
        if(value !== NO_VALUE_SELECTED) {
          let formattedKey = attrMap.get(key);
          if(formattedKey !== undefined) {
            attributes = {
              ...attributes, [formattedKey]: value
            };
          }
          return value;
        }
      });
      
      dispatch(requestEditEntityAttributes(uri, attributes));
    },
    clearFeedbackMessage: () => {
      dispatch(clearFeebackMessage());
    }
  };
};

class SetAttribute extends Component {
  render() {
    let {
		        feedbackMsgText,
		        feedbackMsgSeverity,
		        handleSubmit,
		        clearFeedbackMessage} = this.props;
    return (
      <div>
        <div className='header'>
          <div className='application-title'>{i18n(SET_ATTRIBUTE_TITLE)}</div>
        </div>
        <div className='secondary-header'>
          <span
            className='secondary-title'>{i18n(ATTRIBUTE_MODIFICATION)}</span>
          <InlineMessage level={feedbackMsgSeverity}
                         messageTxt={feedbackMsgText}/>
        </div>

        <ChangeAttributeForm
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          buttonSelected={() => {
            clearFeedbackMessage();
          }}/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapActionToProps)(SetAttribute);
