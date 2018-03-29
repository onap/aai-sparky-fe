import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';
import { BarChart } from 'recharts';

import ConnectedVnfSearchProvStatusVisualization,
  { VnfSearchProvStatusVisualization } from './VnfSearchProvStatusVisualization.jsx';
import { CHART_PROV_STATUS } from './VnfSearchConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';

describe('VnfSearchProvStatusVisualization - Shallow render of component', () => {
  let wrapper;
  const processedProvStatusCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchProvStatusVisualization
        enableBusyFeedback={false}
        processedProvStatusCountChartData={processedProvStatusCountChartDataProp}
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
    expect(wrapper.find(BarChart).props().data).toEqual(processedProvStatusCountChartDataProp.values);
  });
})

describe('VnfSearchProvStatusVisualization - Shallow render of component with no chart data', () => {
  let wrapper;
  const processedProvStatusCountChartDataProp = {
    values: null
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchProvStatusVisualization
        enableBusyFeedback={false}
        processedProvStatusCountChartData={processedProvStatusCountChartDataProp}
      />
    );
  })

  it('Visualization graph hidden', () => {
    expect(wrapper.length).toEqual(1);
    expect(['visualizations', 'hidden'].every(className => wrapper.hasClass(className))).toEqual(true);
  });
})

describe('VnfSearchProvStatusVisualization - Shallow render of component with busy feedback', () => {
  let wrapper;
  const processedProvStatusCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchProvStatusVisualization
        enableBusyFeedback={true}
        processedProvStatusCountChartData={processedProvStatusCountChartDataProp}
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
    expect(wrapper.find(BarChart).props().data).toEqual(processedProvStatusCountChartDataProp.values);
  });
})

describe('VnfSearchProvStatusVisualization - Render React Component (wrapped in <Provider>)', () => {
  const initialState = {
    vnfSearch: {
      processedProvStatusCountChartData: {
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
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchProvStatusVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchProvStatusVisualization).length).toEqual(1);
  });

  it('Validate props from store', () => {
    expect(wrapper.find(VnfSearchProvStatusVisualization).props().enableBusyFeedback).toEqual(initialState.vnfSearch.enableBusyFeedback);
    expect(wrapper.find(VnfSearchProvStatusVisualization).props().processedProvStatusCountChartData).toEqual(initialState.vnfSearch.processedProvStatusCountChartData);
  });
})

describe('VnfSearchProvStatusVisualization - Render React Component (wrapped in <Provider>) with default props', () => {
  const initialState = {
    vnfSearch: {}
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchProvStatusVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchProvStatusVisualization).length).toEqual(1);
  });

  it('Validate default props loaded', () => {
    expect(wrapper.find(VnfSearchProvStatusVisualization).props().enableBusyFeedback).toEqual(false);
    expect(wrapper.find(VnfSearchProvStatusVisualization).props().processedProvStatusCountChartData).toEqual(CHART_PROV_STATUS.emptyData);
  });
})
