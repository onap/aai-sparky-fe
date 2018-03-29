import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';
import { BarChart } from 'recharts';

import ConnectedVnfSearchOrchStatusVisualizations,
  { VnfSearchOrchStatusVisualizations } from './VnfSearchOrchestratedStatusVisualization.jsx';
import { CHART_ORCH_STATUS } from './VnfSearchConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';

describe('VnfSearchOrchStatusVisualizations - Shallow render of component', () => {
  let wrapper;
  const processedOrchStatusCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchOrchStatusVisualizations
        enableBusyFeedback={false}
        processedOrchStatusCountChartData={processedOrchStatusCountChartDataProp}
      />
    );
  })

  it('Render basic component', () => {
    expect(wrapper.length).toEqual(1);
    expect(wrapper.hasClass('visualizations')).toEqual(true);
  });

  it('Verify Spinner is present but not visible', () => {
    expect(wrapper.find(Spinner)).toHaveLength(1);
    expect(wrapper.find(Spinner).props().loading).toEqual(false);
  });

  it('Verify BarChart is displayed', () => {
    expect(wrapper.find(BarChart)).toHaveLength(1);
    expect(wrapper.find(BarChart).props().data).toEqual(processedOrchStatusCountChartDataProp.values);
  });
})

describe('VnfSearchOrchStatusVisualizations - Shallow render of component with no chart data', () => {
  let wrapper;
  const processedOrchStatusCountChartDataProp = {
    values: null
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchOrchStatusVisualizations
        enableBusyFeedback={false}
        processedOrchStatusCountChartData={processedOrchStatusCountChartDataProp}
      />
    );
  })

  it('Visualization graph hidden', () => {
    expect(wrapper.length).toEqual(1);
    expect(['visualizations', 'hidden'].every(className => wrapper.hasClass(className))).toEqual(true);
  });
})

describe('VnfSearchOrchStatusVisualizations - Shallow render of component with busy feedback', () => {
  let wrapper;
  const processedOrchStatusCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchOrchStatusVisualizations
        enableBusyFeedback={true}
        processedOrchStatusCountChartData={processedOrchStatusCountChartDataProp}
      />
    );
  })

  it('Render basic component', () => {
    expect(wrapper.length).toEqual(1);
    expect(wrapper.hasClass('visualizations')).toEqual(true);
  });

  it('Verify Spinner is present and visible', () => {
    expect(wrapper.find(Spinner)).toHaveLength(1);
    expect(wrapper.find(Spinner).props().loading).toEqual(true);
  });

  it('Verify BarChart is displayed', () => {
    expect(wrapper.find(BarChart)).toHaveLength(1);
    expect(wrapper.find(BarChart).props().data).toEqual(processedOrchStatusCountChartDataProp.values);
  });
})

describe('VnfSearchOrchStatusVisualizations - Render React Component (wrapped in <Provider>)', () => {
  const initialState = {
    vnfSearch: {
      processedOrchStatusCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      enableBusyFeedback: false
    }
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchOrchStatusVisualizations /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchOrchStatusVisualizations).length).toEqual(1);
  });

  it('Validate props from store', () => {
    expect(wrapper.find(VnfSearchOrchStatusVisualizations).props().enableBusyFeedback).toEqual(initialState.vnfSearch.enableBusyFeedback);
    expect(wrapper.find(VnfSearchOrchStatusVisualizations).props().processedOrchStatusCountChartData).toEqual(initialState.vnfSearch.processedOrchStatusCountChartData);
  });
})

describe('VnfSearchOrchStatusVisualizations - Render React Component (wrapped in <Provider>) with default props', () => {
  const initialState = {
    vnfSearch: {}
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchOrchStatusVisualizations /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchOrchStatusVisualizations).length).toEqual(1);
  });

  it('Validate default props loaded', () => {
    expect(wrapper.find(VnfSearchOrchStatusVisualizations).props().enableBusyFeedback).toEqual(false);
    expect(wrapper.find(VnfSearchOrchStatusVisualizations).props().processedOrchStatusCountChartData).toEqual(CHART_ORCH_STATUS.emptyData);
  });
})
