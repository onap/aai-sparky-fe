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
import React from 'react';
import { expect } from 'chai';
import reducer from 'app/vnfSearch/VnfSearchReducer.js';
import {
  CHART_ORCH_STATUS,
  CHART_PROV_STATUS, vnfSearchVisualizationsActionTypes} from 'app/vnfSearch/VnfSearchConstants.js';



describe('VNF: Audit Visualizations Reducers test suite', function() {
  const initialState = {
    processedProvStatusCountChartData: CHART_PROV_STATUS.clearingEmptyData,
    processedOrchStatusCountChartData: CHART_ORCH_STATUS.clearingEmptyData
  };
  const initStateWithData = {
    processedProvStatusCountChartData: [
      {
        values: [
          {
            x: 'complex',
            y: 60
          }
        ]
      }
    ],
    processedOrchStatusCountChartData: [
      {
        values: [
          {
            x: 'prov-status',
            y: 60
          }
        ]
      }
    ]
  };



  it('VNF: COUNT_BY_ORCH_STATUS_RECEIVED event', function() {
    const chartData = [
      {
        'values': [
          { 'x': 'physical-location-id', 'y':  22},
          { 'x': 'prov-status', 'y': 14},
          { 'x': 'status-type-3', 'y': 24}
        ]
      }
    ];

    const action = {
      type: vnfSearchVisualizationsActionTypes.COUNT_BY_ORCH_STATUS_RECEIVED,
      data: {
        orchStatusCountChartData: {
          chartData: chartData,
        }
      }
    };

    const newState = reducer(initialState, action);
    expect(newState.processedOrchStatusCountChartData[0].values.length).to.equal(3);
    expect(newState.processedOrchStatusCountChartData[0].values[0]['x']).to.equal('physical-location-id');
    expect(newState.processedOrchStatusCountChartData[0].values[1]['x']).to.equal('prov-status');
    expect(newState.processedOrchStatusCountChartData[0].values[2]['x']).to.equal('status-type-3');
    expect(newState.processedOrchStatusCountChartData[0].values[0]['y']).to.equal(22);
    expect(newState.processedOrchStatusCountChartData[0].values[1]['y']).to.equal(14);
    expect(newState.processedOrchStatusCountChartData[0].values[2]['y']).to.equal(24);
  });

  it('VNF: COUNT_BY_PROV_STATUS_RECEIVED event', function() {
    const chartData = [
      {
        'values': [
          { 'x': 'physical-location-id', 'y':  22},
          { 'x': 'prov-status', 'y': 14},
          { 'x': 'status-type-3', 'y': 24}
        ]
      }
    ];

    const action = {
      type: vnfSearchVisualizationsActionTypes.COUNT_BY_PROV_STATUS_RECEIVED,
      data: {
        provStatusCountChartData: {
          chartData: chartData,
        }
      }
    };

    const newState = reducer(initialState, action);
    expect(newState.processedProvStatusCountChartData[0].values.length).to.equal(3);
    expect(newState.processedProvStatusCountChartData[0].values[0]['x']).to.equal('physical-location-id');
    expect(newState.processedProvStatusCountChartData[0].values[1]['x']).to.equal('prov-status');
    expect(newState.processedProvStatusCountChartData[0].values[2]['x']).to.equal('status-type-3');
    expect(newState.processedProvStatusCountChartData[0].values[0]['y']).to.equal(22);
    expect(newState.processedProvStatusCountChartData[0].values[1]['y']).to.equal(14);
    expect(newState.processedProvStatusCountChartData[0].values[2]['y']).to.equal(24);
  });


  it('VNF: Total VNF event', function() {


    const action = {
      type: vnfSearchVisualizationsActionTypes.TOTAL_VNF_COUNT_RECEIVED,
      data: {count: 10}
    };

    const newState = reducer(initialState, action);
    expect(newState.count).to.equal(10);

  });


  it('VNF: NETWORK_ERROR event', function() {
    const action = {
      type: vnfSearchVisualizationsActionTypes.VNF_SEARCH_NETWORK_ERROR
    }
    const newState = reducer(initStateWithData, action);
    expect(newState.processedProvStatusCountChartData).to.deep.equal(CHART_PROV_STATUS.clearingEmptyData);
    expect(newState.processedOrchStatusCountChartData).to.deep.equal(CHART_ORCH_STATUS.clearingEmptyData);
  });

});
