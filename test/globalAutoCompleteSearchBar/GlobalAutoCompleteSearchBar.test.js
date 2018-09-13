import React from 'react';
import { mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';

import GlobalAutoCompleteSearchBar from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBar.jsx'
import AutoCompleteSearchBar from 'generic-components/autoCompleteSearchBar/AutoCompleteSearchBar.jsx';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';

describe('GlobalAutoCompleteSearchBarTests', () => {
  const initValue = 'some random search text';
  const initialState = {
    globalAutoCompleteSearchBarReducer: {
      value: initValue
    }
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><GlobalAutoCompleteSearchBar /></Provider>);
  })

  it('render search bar - visible', () => {
    expect(wrapper).toHaveLength(1); // ensure the message bar is mounted
    expect(wrapper.find(AutoCompleteSearchBar)).toHaveLength(1); // ensure the InlineMessage is mounted
  });

  it('props assigned properly', () => {
    expect(wrapper.find(AutoCompleteSearchBar).props().value).toEqual(initValue); // check that the props match
  })
})
