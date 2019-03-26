import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';
import { BarChart } from 'recharts';

import ConnectedVnfSearchNfRoleVisualization,
  { VnfSearchNfRoleVisualization } from 'app/vnfSearch/VnfSearchNfRoleVisualization.jsx';
import { CHART_NF_ROLE } from 'app/vnfSearch/VnfSearchConstants.js';
import Spinner from 'utils/SpinnerContainer.jsx';

describe('VnfSearchNfRoleVisualization - Shallow render of component', () => {
  let wrapper;
  const processedNfRoleCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchNfRoleVisualization
        enableBusyFeedback={false}
        processedNfRoleCountChartData={processedNfRoleCountChartDataProp}
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
    expect(wrapper.find(BarChart).props().data).toEqual(processedNfRoleCountChartDataProp.values);
  });
})

describe('VnfSearchNfRoleVisualization - Shallow render of component with no chart data', () => {
  let wrapper;
  const processedNfRoleCountChartDataProp = {
    values: null
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchNfRoleVisualization
        enableBusyFeedback={false}
        processedNfRoleCountChartData={processedNfRoleCountChartDataProp}
      />
    );
  })

  it('Visualization graph hidden', () => {
    expect(wrapper.length).toEqual(1);
    expect(['visualizations', 'hidden'].every(className => wrapper.hasClass(className))).toEqual(true);
  });
})

describe('VnfSearchNfRoleVisualization - Shallow render of component with busy feedback', () => {
  let wrapper;
  const processedNfRoleCountChartDataProp = {
    values: [
      {x: 'col 1', y: 3},
      {x: 'col 2', y: 7},
      {x: 'col 3', y: 2}
    ]
  };

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchNfRoleVisualization
        enableBusyFeedback={true}
        processedNfRoleCountChartData={processedNfRoleCountChartDataProp}
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
    expect(wrapper.find(BarChart).props().data).toEqual(processedNfRoleCountChartDataProp.values);
  });
})

describe('VnfSearchNfRoleVisualization - Render React Component (wrapped in <Provider>)', () => {
  const initialState = {
    vnfSearch: {
      processedNfRoleCountChartData: {
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
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchNfRoleVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchNfRoleVisualization).length).toEqual(1);
  });

  it('Validate props from store', () => {
    expect(wrapper.find(VnfSearchNfRoleVisualization).props().enableBusyFeedback).toEqual(initialState.vnfSearch.enableBusyFeedback);
    expect(wrapper.find(VnfSearchNfRoleVisualization).props().processedNfRoleCountChartData).toEqual(initialState.vnfSearch.processedNfRoleCountChartData);
  });
})

describe('VnfSearchNfRoleVisualization - Render React Component (wrapped in <Provider>) with default props', () => {
  const initialState = {
    vnfSearch: {}
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchNfRoleVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchNfRoleVisualization).length).toEqual(1);
  });

  it('Validate default props loaded', () => {
    expect(wrapper.find(VnfSearchNfRoleVisualization).props().enableBusyFeedback).toEqual(false);
    expect(wrapper.find(VnfSearchNfRoleVisualization).props().processedNfRoleCountChartData).toEqual(CHART_NF_ROLE.emptyData);
  });
})
