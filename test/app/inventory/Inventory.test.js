import React from "react";
import {Provider} from "react-redux";
import thunk from 'redux-thunk';

import configureMockStore from "redux-mock-store";
import {mount} from 'enzyme';
import expect from "expect";

import Inventory, {mapStateToProps} from 'app/inventory/Inventory';


const mockStore = configureMockStore([thunk]);
const store = mockStore({inventoryReducer:{}});

describe('Inventory component', () => {

    fetch =  require('jest-fetch-mock');

    it("should be rendered", () => {

        // when
        let wrapper = mount(
            <Provider store={store}>
                <Inventory />
            </Provider>
        );

        // then
        let actual = wrapper.text();
        expect(actual).toInclude('Active Inventory');
    });

    it('should update props with state data properly', () => {
        const inventoryReducerState = {
            mapPlotPoints: [],
            countByType: [],
            countByDate: [],
            feedbackMsgText: '',
            feedbackMsgSeverity: ''
        };

        const storeState = {
            inventoryReducer: inventoryReducerState
        };

        const actual = mapStateToProps(storeState);
        expect(actual).toEqual(inventoryReducerState);
    });
});
