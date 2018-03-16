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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import i18n from 'utils/i18n/i18n';

import {CHART_NF_TYPE} from 'app/vnfSearch/VnfSearchConstants.js';
import {COLOR_BLUE} from 'utils/GlobalConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';

let mapStateToProps = ({vnfSearch}) => {
  let {
        processedNfTypeCountChartData = CHART_NF_TYPE.emptyData,
        enableBusyFeedback = false
      } = vnfSearch;

  return {
    processedNfTypeCountChartData,
    enableBusyFeedback
  };
};

class VnfSearchNfTypeVisualization extends Component {
  static propTypes = {
    processedNfTypeCountChartData: React.PropTypes.object,
    enableBusyFeedback: React.PropTypes.bool
  };

  render() {
    let {
          processedNfTypeCountChartData,
          enableBusyFeedback
        } = this.props;

    let visualizationClass = 'visualizations';
    if (processedNfTypeCountChartData.values ===
      null ||
      processedNfTypeCountChartData.values.size <=
      0) {
      visualizationClass = 'visualizations hidden';
    }
    const xAxisAttrName = 'x';
    const yAxisAttrName = 'y';

    return (
      <div id='audit-visualizations' className={visualizationClass}>
        <div className='visualization-charts'>
          <div >
            <h3>{i18n(CHART_NF_TYPE.title)}</h3>
            <Spinner loading={enableBusyFeedback}>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={processedNfTypeCountChartData.values}>
                  <XAxis dataKey={xAxisAttrName}/>
                  <YAxis   />
                  <CartesianGrid strokeDasharray='3 3'/>
                  <Tooltip/>
                  <Bar name={i18n(CHART_NF_TYPE.yAxisLabel)}
                       dataKey={yAxisAttrName} fill={COLOR_BLUE}/>
                </BarChart>
              </ResponsiveContainer>
            </Spinner>
          </div>
        </div>
      </div>
    );
  }

}
export default connect(mapStateToProps)(VnfSearchNfTypeVisualization);
