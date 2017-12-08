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
import React, {Component} from 'react';
import {Field, Fields, reduxForm, propTypes} from 'redux-form';
import i18n from 'utils/i18n/i18n';

import {
  LABEL_NODE_URI,
  LABEL_PROV_STATUS,
  LABEL_ATTRIBUTES,
  LABEL_IN_MAINT,
  LABEL_IS_CLOSED_LOOP,
  BUTTON_SUBMIT,
  BUTTON_CLEAR,
  NO_VALUE_SELECTED,
  PREPROV,
  NVTPROV,
  DECOM,
  PROV,
  CAPPED,
  RETIRED,
  TRUE,
  FALSE
} from './ChangeAttributeFormConstants.js';
import validate from './validate.js';

class ChangeAttributeForm extends Component {

  static propTypes = {
    ...propTypes
  };

  renderTextField = ({input, label, type, meta: {touched, error}}) => (
    <div className='attribute-field'>
      <label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type}
                          onBlur={() => input.value === '' ? input.onBlur(' ') : input.onBlur()}/>
        {touched && ((error && <span className='error-message'>{error}</span>))}
      </div>
    </div>
  );


  booleanOptions = [
    <option value={NO_VALUE_SELECTED}>{i18n(NO_VALUE_SELECTED)}</option>,
    <option value='true'>{i18n(TRUE)}</option>,
    <option value='false'>{i18n(FALSE)}</option>
  ];

  provStatusOptions = [
    <option value={NO_VALUE_SELECTED}>{i18n(NO_VALUE_SELECTED)}</option>,
    <option value={PREPROV}>{PREPROV}</option>,
    <option value={NVTPROV}>{NVTPROV}</option>,
    <option value={PROV}>{PROV}</option>,
    <option value={CAPPED}>{CAPPED}</option>,
    <option value={DECOM}>{DECOM}</option>,
    <option value={RETIRED}>{RETIRED}</option>
  ];

  renderAttributeFields = (fields) => (
    <div>
      <div className='centre'>
        {(fields.provStatus.meta.touched ||
        fields.inMaint.meta.touched ||
        fields.isClosedLoopDisabled.meta.touched) &&
        fields.provStatus.meta.error &&
        <span className='error-message'>{fields.provStatus.meta.error}</span>}
      </div>
      <div className='attribute-field'>
        <label>{LABEL_PROV_STATUS}</label>
        <div>
          <select {...fields.provStatus.input}>
            {this.provStatusOptions}
          </select>
        </div>
      </div>
      <div className='attribute-field'>
        <label>{LABEL_IN_MAINT}</label>
        <div>
          <select {...fields.inMaint.input}>
            {this.booleanOptions}
          </select>
        </div>
      </div>
      <div className='attribute-field'>
        <label>{LABEL_IS_CLOSED_LOOP}</label>
        <div>
          <select {...fields.isClosedLoopDisabled.input}>
            {this.booleanOptions}
          </select>
        </div>
      </div>
    </div>
  );

  render() {
    const {
		          handleSubmit,
		          buttonSelected,
		          pristine,
		          reset,
		          submitting} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field name='uri' type='text' component={this.renderTextField}
               label={i18n(LABEL_NODE_URI)}/>
        <div className='centre'><h2>{i18n(LABEL_ATTRIBUTES)}</h2></div>
        <Fields names={['provStatus', 'inMaint', 'isClosedLoopDisabled']}
                component={this.renderAttributeFields}/>
        <div className='centre'>
          <button type='submit'
                  disabled={pristine || submitting}
                  onClick={() => {
								            buttonSelected();
								          }}>
		          {i18n(BUTTON_SUBMIT)}
          </button>
          <button type='button'
                  disabled={pristine || submitting}
                  onClick={() => {
								            reset();
								            buttonSelected();
								          }}>
		          {i18n(BUTTON_CLEAR)}
          </button>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'changeAttributeForm',
  validate
})(ChangeAttributeForm);

