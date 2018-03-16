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

import {TOTAL_VNF_COUNT} from 'app/vnfSearch/VnfSearchConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';

let mapStateToProps = ({vnfSearch}) => {
  let {
        count = TOTAL_VNF_COUNT.emptyValue,
        enableBusyFeedback = false
      } = vnfSearch;

  return {
    count,
    enableBusyFeedback
  };
};

class VnfSearchTotalCountVisualization extends Component {
  static propTypes = {
    count: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    enableBusyFeedback: React.PropTypes.bool
  };

  render() {
    let {
          count,
          enableBusyFeedback
        } = this.props;

    let visualizationClass = 'visualizations';
    if (count === null) {
      visualizationClass = 'visualizations hidden';
    }

    return (
      <div id='audit-visualizations' className={visualizationClass}>
        <div className='visualization-charts'>
          <div className='visualization-side-by-side-30'>
            <span>&nbsp;</span>
            <h3>{i18n(TOTAL_VNF_COUNT.title)}</h3>
            <Spinner loading={enableBusyFeedback}>
              <div className='total-box-entity-count'>
                <span>{count}</span>
              </div>
            </Spinner>
          </div>
        </div>
      </div>
    );
  }

}
export default connect(mapStateToProps)(VnfSearchTotalCountVisualization);
