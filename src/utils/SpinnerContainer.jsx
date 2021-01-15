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

import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import {COLOR_BLUE} from './GlobalExtConstants.js';
import { PropTypes } from 'prop-types';

class SpinnerContainer extends Component {
  render() {
    // if loading, show content as busy (ex: grey out)
    const spinnerContentClass = this.props.loading ? 'spinner-content' : '';
    return (
      <div className='col-lg-12 spinner-container'>
        <div className='spinner'>
          <ClipLoader color={COLOR_BLUE} loading={this.props.loading} />
        </div>
        <div className={spinnerContentClass}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default SpinnerContainer;

SpinnerContainer.propTypes = {
  loading: PropTypes.bool
};

SpinnerContainer.defaultProps = {
  loading: false
};
