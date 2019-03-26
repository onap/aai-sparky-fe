import React from 'react';
import { shallow } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';

import AutoCompleteSearchBar from 'generic-components/autoCompleteSearchBar/AutoCompleteSearchBar.jsx';

describe('AutoCompleteSearchBarTests', () => {
  const suggestions = [
    {
      text: 'Apple'
    },
    {
      text: 'Orange'
    },
    {
      text: 'Banana'
    }
  ];
  const initialState = {
    globalAutoCompleteSearchBarReducer: {
      value: '',
      suggestions: [],
      cachedSuggestions: [],
      suggestionName: ''
    }
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = shallow(<Provider store={store}><AutoCompleteSearchBar /></Provider>);
  })

  it('render search bar - visible', () => {
    expect(wrapper).toHaveLength(1); // ensure the message bar is mounted
    expect(wrapper.find(AutoCompleteSearchBar)).toHaveLength(1); // ensure the InlineMessage is mounted
  });
})
