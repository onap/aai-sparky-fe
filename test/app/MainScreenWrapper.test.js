import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'jest-fetch-mock';
import { MemoryRouter } from 'react-router';

import MainScreenWrapper from 'app/MainScreenWrapper';
import MainScreenHeader from 'app/MainScreenHeader';
import VnfSearch from 'app/vnfSearch/VnfSearch';
import TierSupport from 'app/tierSupport/TierSupport';

describe('MainScreenWrapper', () => {
  const initialState = {
    mainWrapper: {},
    globalAutoCompleteSearchBarReducer: {},
    tierSupport: {
      tierSupportReducer:{},
      globalAutoCompleteSearchBar:{},
      selectedNodeDetails:{},
      launchExternalResourceReducer:{}
    },
    inventoryReducer: {},
    vnfSearch: {},
    globalInlineMessageBar: {},
    extensibility: {},
    configurableViews: {}
  };
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    store.clearActions();
    fetchMock.once({});
  });

  it('renders without errors', () => {

    let wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[ '/' ]}>
          <MainScreenWrapper/>
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(MainScreenHeader)).toHaveLength(1);
    expect(wrapper.find(VnfSearch)).toHaveLength(0);
    expect(wrapper.find(TierSupport)).toHaveLength(1);
  });
});