import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import ConnectedVnfSearch, { vnfSearch } from 'app/vnfSearch/VnfSearch.jsx';

describe('VnfSearch - Shallow render of component', () => {
  let wrapper;
  const vnfFilters = {};
  const vnfVisualizationPanelClass = 'collapsible-panel-main-panel';
  const unifiedFilterValues = {};

  beforeEach( () => {
    wrapper = shallow(
      <vnfSearch
        vnfFilters={vnfFilters}
        unifiedFilterValues={unifiedFilterValues}
        vnfVisualizationPanelClass={vnfVisualizationPanelClass}
      />
    );
  })

  it('Render basic component', () => {
    expect(wrapper.length).toEqual(1);
  });
})
//
// describe('VnfSearch - Render React Component (wrapped in <Provider>)', () => {
//   const initialState = {
//     vnfSearch: {}
//   };
//   const mockStore = configureStore();
//   let store, wrapper;
//
//   beforeEach( () => {
//     store = mockStore(initialState);
//     wrapper = mount(<Provider store={store}><ConnectedVnfSearch /></Provider>);
//   })
//
//   it('Render the connected component', () => {
//     expect(wrapper.find(ConnectedVnfSearch).length).toEqual(1);
//   });
//
//   it('Validate props from store', () => {
//     expect(wrapper.find(VnfSearchNfRoleVisualization).props().enableBusyFeedback).toEqual(initialState.vnfSearch.enableBusyFeedback);
//     expect(wrapper.find(VnfSearchNfRoleVisualization).props().processedNfRoleCountChartData).toEqual(initialState.vnfSearch.processedNfRoleCountChartData);
//   });
// })
