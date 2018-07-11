import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';

import ConnectedVnfSearchTotalCountVisualization,
  { VnfSearchTotalCountVisualization } from 'app/vnfSearch/VnfSearchTotalCountVisualization.jsx';
import { TOTAL_VNF_COUNT } from 'app/vnfSearch/VnfSearchConstants.js';
import Spinner from 'utils/SpinnerContainer';

describe('VnfSearchTotalCountVisualization - Shallow render of component', () => {
  let wrapper;
  const countProp = 25;

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchTotalCountVisualization
        enableBusyFeedback={false}
        count={countProp}
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

  it('Verify total count is displayed', () => {
    expect(wrapper.contains(<span>{countProp}</span>)).toBe(true);
  });
})

describe('VnfSearchTotalCountVisualization - Shallow render of component with no chart data', () => {
  let wrapper;
  const countProp = null;

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchTotalCountVisualization
        enableBusyFeedback={false}
        count={countProp}
      />
    );
  })

  it('Visualization graph hidden', () => {
    expect(wrapper.length).toEqual(1);
    expect(['visualizations', 'hidden'].every(className => wrapper.hasClass(className))).toEqual(true);
  });
})

describe('VnfSearchTotalCountVisualization - Shallow render of component with busy feedback', () => {
  let wrapper;
  const countProp = 25;

  beforeEach( () => {
    wrapper = shallow(
      <VnfSearchTotalCountVisualization
        enableBusyFeedback={true}
        count={countProp}
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

  it('Verify total count is displayed', () => {
    expect(wrapper.contains(<span>{countProp}</span>)).toBe(true);
  });
})

describe('VnfSearchTotalCountVisualization - Render React Component (wrapped in <Provider>)', () => {
  const initialState = {
    vnfSearch: {
      count: 25,
      enableBusyFeedback: false
    }
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchTotalCountVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchTotalCountVisualization).length).toEqual(1);
  });

  it('Validate props from store', () => {
    expect(wrapper.find(VnfSearchTotalCountVisualization).props().enableBusyFeedback).toEqual(initialState.vnfSearch.enableBusyFeedback);
    expect(wrapper.find(VnfSearchTotalCountVisualization).props().count).toEqual(initialState.vnfSearch.count);
  });
})

describe('VnfSearchTotalCountVisualization - Render React Component (wrapped in <Provider>) with default props', () => {
  const initialState = {
    vnfSearch: {}
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedVnfSearchTotalCountVisualization /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedVnfSearchTotalCountVisualization).length).toEqual(1);
  });

  it('Validate default props loaded', () => {
    expect(wrapper.find(VnfSearchTotalCountVisualization).props().enableBusyFeedback).toEqual(false);
    expect(wrapper.find(VnfSearchTotalCountVisualization).props().count).toEqual(TOTAL_VNF_COUNT.emptyValue);
  });
})
