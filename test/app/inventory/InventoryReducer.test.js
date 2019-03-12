import fetchMock from 'fetch-mock';
import expect from 'expect';
import {InventoryActionTypes} from "app/inventory/InventoryConstants";
import reducer from 'app/inventory/InventoryReducer';



function verifyStateProducedByReducer(action, currentState, expectedState) {
    // when
    const actual = reducer(currentState, action);

    // then
    expect(actual).toEqual(expectedState);
}

describe('InventoryReducer', () => {

    afterEach(() => {
        fetchMock.restore()
    });

    it('verify store state after TOPOGRAPHIC_QUERY_SUCCESS action', async () => {

        // given
        const action = {
            type: InventoryActionTypes.TOPOGRAPHIC_QUERY_SUCCESS,
            data: {
                "plotPoints": {
                    "keyA": "valueA",
                    "keyB": "valueB"
                }
            }
        };

        const expectedState = {
            state: "dummy",
            mapPlotPoints: {
                "keyA": "valueA",
                "keyB": "valueB"
            }
        };


        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);

    });

    it('verify store state after COUNT_BY_ENTITY_SUCCESS action', async () => {

        // given
        const action = {
            type: InventoryActionTypes.COUNT_BY_ENTITY_SUCCESS,
            data: {
                "countByType": {
                    "keyA": "valueA",
                    "keyB": "valueB"
                }
            }
        };

        const expectedState = {
            state: "dummy",
            countByType: {
                "keyA": "valueA",
                "keyB": "valueB"
            }
        };

        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);
    });


    it('verify store state after COUNT_BY_DATE_SUCCESS action', async () => {

        // given
        const action = {
            type: InventoryActionTypes.COUNT_BY_DATE_SUCCESS,
            data: {
                "countByDate": {
                    "keyA": "valueA",
                    "keyB": "valueB"
                }
            }
        };

        const expectedState = {
            state: "dummy",
            countByDate: {
                "keyA": "valueA",
                "keyB": "valueB"
            }
        };

        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);
    });

    it('verify store state after TOPOGRAPHIC_QUERY_FAILED action', async () => {

        // given
        const action = {
            type: InventoryActionTypes.TOPOGRAPHIC_QUERY_FAILED,
            data: {
                severity: "ERROR",
                message: "Some error occurred"
            }
        };

        const expectedState = {
            state: "dummy",
            feedbackMsgSeverity: "ERROR",
            feedbackMsgText: "Some error occurred"

        };

        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);
    });

    it('verify store state after COUNT_BY_ENTITY_FAILED action', async () => {

        // given
        const action = {
            type: InventoryActionTypes.COUNT_BY_ENTITY_FAILED,
            data: {
                severity: "ERROR",
                message: "Some error occurred"
            }
        };

        const expectedState = {
            state: "dummy",
            feedbackMsgSeverity: "ERROR",
            feedbackMsgText: "Some error occurred"

        };

        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);
    });

    it('verify store state after COUNT_BY_DATE_FAILED action', async () => {

        // given
        const action = {
            type: InventoryActionTypes.COUNT_BY_DATE_FAILED,
            data: {
                severity: "ERROR",
                message: "Some error occurred"
            }
        };

        const expectedState = {
            state: "dummy",
            feedbackMsgSeverity: "ERROR",
            feedbackMsgText: "Some error occurred"

        };

        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);
    });

    it('verify store state after unknown action', async () => {

        // given
        const action = {
            type: 'unknown',
        };

        const expectedState = {state: "dummy"};

        const currentState = {state: "dummy"};

        verifyStateProducedByReducer(action, currentState, expectedState);
    });

});
