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
import TestUtils from 'react-dom/lib/ReactTestUtils';
import {storeCreator} from 'app/AppStore.js';
import {Provider} from 'react-redux';
import { expect } from 'chai';
import VnfSearchOrchStatusVisualizations from 'app/vnfSearch/vnfSearchVisualizations/VnfSearchOrchestratedStatusVisualization.jsx';
import VnfSearchProvStatusVisualizations from 'app/vnfSearch/vnfSearchVisualizations/VnfSearchProvStatusVisualization.jsx';
import VnfSearchTotalCountVisualization from 'app/vnfSearch/vnfSearchVisualizations/VnfSearchTotalCountVisualization.jsx';
import {
  CHART_PROV_STATUS,
  CHART_ORCH_STATUS,
  TOTAL_VNF_COUNT} from 'app/vnfSearch/vnfSearchVisualizations/VnfSearchVisualizationsConstants.js';

describe('VNF Visualizations Structure Tests', function () {

  function createState(processedOrchStatusCountChartData,
                       processedProvStatusCountChartData) {
    return {
      vnfSearch: {
        auditVisualizationsData: {
          processedOrchStatusCountChartData: processedOrchStatusCountChartData,
          processedProvStatusCountChartData: processedProvStatusCountChartData
        }
      }
    };
  }

  it('VNF: Visualization layout VNF Orch Status, no data', function () {
    const store = storeCreator(createState(
        CHART_ORCH_STATUS.clearingEmptyData,
        CHART_PROV_STATUS.clearingEmptyData
    ));
    this.component = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <VnfSearchOrchStatusVisualizations />
        </Provider>
    );
    let visualizationContainer = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'visualizations');
    expect(visualizationContainer).to.exist; // there is always a visualizations container
    expect(visualizationContainer[0].className).to.contain('hidden'); // make sure visualizations is hidden
  });

  it('VNF: Visualization layout VNF Prov Status, no data', function () {
    const store = storeCreator(createState(
        CHART_ORCH_STATUS.clearingEmptyData,
        CHART_PROV_STATUS.clearingEmptyData
    ));
    this.component = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <VnfSearchProvStatusVisualizations />
        </Provider>
    );
    let visualizationContainer = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'visualizations');
    expect(visualizationContainer).to.exist; // there is always a visualizations container
    expect(visualizationContainer[0].className).to.contain('hidden'); // make sure visualizations is hidden
  });


  it('VNF: Visualization layout Total VNF, no data', function () {
    const store = storeCreator(createState(
        TOTAL_VNF_COUNT.clearingEmptyValue
    ));
    this.component = TestUtils.renderIntoDocument(
        <Provider store={store}>
          <VnfSearchTotalCountVisualization />
        </Provider>
    );
    let visualizationContainer = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'visualizations');
    expect(visualizationContainer).to.exist; // there is always a visualizations container
    expect(visualizationContainer[0].className).to.contain('hidden'); // make sure visualizations is hidden
  });
});
