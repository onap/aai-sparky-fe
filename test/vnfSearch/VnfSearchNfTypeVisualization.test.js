import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';
import { BarChart } from 'recharts';

import ConnectedVnfSearchNfTypeVisualization,
  { VnfSearchNfTypeVisualization } from 'app/vnfSearch/VnfSearchNfTypeVisualization.jsx';
import { CHART_NF_TYPE } from 'app/vnfSearch/VnfSearchConstants.js';
import Spinner from 'utils/../../src/utils/SpinnerContainer';

describe('VnfSearchNfTypeVisualization - Shallow render of component', () => {
  let wrapper;
  const processedNfTypeCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchNfTypeVisualization
        enableBusyFeedback={false}
        processedNfTypeCountChartData={processedNfTypeCountChartDataProp}
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
    expect(wrapper.find(BarChart).props().data).toEqual(processedNfTypeCountChartDataProp.values);
  });
})

describe('VnfSearchNfTypeVisualization - Shallow render of component with no chart data', () => {
  let wrapper;
  const processedNfTypeCountChartDataProp = {
    values: null
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchNfTypeVisualization
        enableBusyFeedback={false}
        processedNfTypeCountChartData={processedNfTypeCountChartDataProp}
      />
    );
  })

  it('Visualization graph hidden', () => {
    expect(wrapper.length).toEqual(1);
    expect(['visualizations', 'hidden'].every(className => wrapper.hasClass(className))).toEqual(true);
  });
})

describe('VnfSearchNfTypeVisualization - Shallow render of component with busy feedback', () => {
  let wrapper;
  const processedNfTypeCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchNfTypeVisualization
        enableBusyFeedback={true}
        processedNfTypeCountChartData={processedNfTypeCountChartDataProp}
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
    expect(wrapper.find(BarChart).props().data).toEqual(processedNfTypeCountChartDataProp.values);
  });
})

describe('VnfSearchNfTypeVisualization - Render React Component (wrapped in <Provider>)', () => {
  const initialState = {
    vnfSearch: {
      processedNfTypeCountChartData: {
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
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchNfTypeVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchNfTypeVisualization).length).toEqual(1);
  });

  it('Validate props from store', () => {
    expect(wrapper.find(VnfSearchNfTypeVisualization).props().enableBusyFeedback).toEqual(initialState.vnfSearch.enableBusyFeedback);
    expect(wrapper.find(VnfSearchNfTypeVisualization).props().processedNfTypeCountChartData).toEqual(initialState.vnfSearch.processedNfTypeCountChartData);
  });
})

describe('VnfSearchNfTypeVisualization - Render React Component (wrapped in <Provider>) with default props', () => {
  const initialState = {
    vnfSearch: {}
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchNfTypeVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchNfTypeVisualization).length).toEqual(1);
  });

  it('Validate default props loaded', () => {
    expect(wrapper.find(VnfSearchNfTypeVisualization).props().enableBusyFeedback).toEqual(false);
    expect(wrapper.find(VnfSearchNfTypeVisualization).props().processedNfTypeCountChartData).toEqual(CHART_NF_TYPE.emptyData);
  });
})
