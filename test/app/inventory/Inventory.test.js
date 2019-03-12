import React from 'react';
import thunk from 'redux-thunk';

import configureMockStore from 'redux-mock-store';
import expect from 'expect';

import Inventory from 'app/inventory/Inventory';
import {shallow} from 'enzyme';


const mockStore = configureMockStore([thunk]);
const store = mockStore({inventoryReducer: {}});

describe('Inventory component', () => {

  fetch = require('jest-fetch-mock');

  it('should be rendered', () => {

    // when
    let wrapper = shallow(
        <Inventory store={store}/>
    );

    // then
    let actual = wrapper.render().text();
    expect(actual).toInclude('Active Inventory');
  });

});
