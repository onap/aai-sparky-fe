import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import expect from 'expect';

import {onLoadTotalCountByDate, onCountByTypeLoad, onTopographicMapMounted} from 'app/inventory/InventoryActions';
import {InventoryActionTypes} from 'app/inventory/InventoryConstants';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


function mockRequestToEntityCountHistoryEndpoint(postfix, response) {
    fetchMock.getOnce(
        `http://localhost:/rest/visualization${postfix}`,
        response
    );
}

describe('InventoryActions', () => {

    afterEach(() => {
        fetchMock.restore()
    });

    describe('verify onLoadTotalCountByDate', () => {
        it('creates COUNT_BY_DATE_SUCCESS response when there is no error', async () => {

            // given
            mockRequestToEntityCountHistoryEndpoint("/entityCountHistory?type=graph",{
                status: 200,
                body: {
                    "result": {
                        "keyA": "valueA",
                        "keyB": "valueB"
                    }
                }
            });

            const expectedActions = [
                {
                    type: InventoryActionTypes.COUNT_BY_DATE_SUCCESS,
                    data: {
                        countByDate: {
                            "keyA": "valueA",
                            "keyB": "valueB"
                        }
                    }
                }];

            const store = mockStore();

            // when
            await store.dispatch(onLoadTotalCountByDate());

            // then
            expect(store.getActions()).toEqual(expectedActions);
        });


        it('creates COUNT_BY_DATE_FAILED response when there is a problem with remote service', async () => {

            // given
            mockRequestToEntityCountHistoryEndpoint("/entityCountHistory?type=graph",{
                status: 500
            });

            const expectedActions = [
                {
                    type: InventoryActionTypes.COUNT_BY_DATE_FAILED,
                    data: {
                        message: 'Error fetching data from server',
                        severity: 'danger'
                    }
                }];

            const store = mockStore();

            // when
            await store.dispatch(onLoadTotalCountByDate());

            // then
            expect(store.getActions()).toEqual(expectedActions);
        });
    });



    describe('verify onCountByTypeLoad', () => {
        it('creates COUNT_BY_ENTITY_SUCCESS response when there is no error', async () => {

            // given
            mockRequestToEntityCountHistoryEndpoint("/entityCountHistory?type=table",{
                status: 200,
                body: {
                    "result": {
                        "keyA": "valueA",
                        "keyB": "valueB"
                    }
                }
            });

            const expectedActions = [
                {
                    type: InventoryActionTypes.COUNT_BY_ENTITY_SUCCESS,
                    data: {
                        countByType: {
                            "keyA": "valueA",
                            "keyB": "valueB"
                        }
                    }
                }];

            const store = mockStore();

            // when
            await store.dispatch(onCountByTypeLoad());

            // then
            expect(store.getActions()).toEqual(expectedActions);
        });


        it('creates COUNT_BY_ENTITY_FAILED response when there is a problem with remote service', async () => {

            // given
            mockRequestToEntityCountHistoryEndpoint("/entityCountHistory?type=table",{
                status: 500
            });

            const expectedActions = [
                {
                    type: InventoryActionTypes.COUNT_BY_ENTITY_FAILED,
                    data: {
                        message: 'Error fetching data from server',
                        severity: 'danger'
                    }
                }];

            const store = mockStore();

            // when
            await store.dispatch(onCountByTypeLoad());

            // then
            expect(store.getActions()).toEqual(expectedActions);
        });
    });



    describe('verify onTopographicMapMounted', () => {
        it('creates TOPOGRAPHIC_QUERY_SUCCESS response when there is no error', async () => {

            // given
            const requestObject = {
                entityType: "entityType"
            };
            mockRequestToEntityCountHistoryEndpoint("/geovisualization/?entity=entityType",{
                status: 200,
                body: {
                    "plotPoints": {
                        "keyA": "valueA",
                        "keyB": "valueB"
                    }
                }
            });

            const expectedActions = [
                {
                    type: InventoryActionTypes.TOPOGRAPHIC_QUERY_SUCCESS,
                    data: {
                        plotPoints: {
                            "keyA": "valueA",
                            "keyB": "valueB"
                        }
                    }
                }];

            const store = mockStore();

            // when
            await store.dispatch(onTopographicMapMounted(requestObject));

            // then
            expect(store.getActions()).toEqual(expectedActions);
        });


        it('creates TOPOGRAPHIC_QUERY_FAILED response when there is a problem with remote service', async () => {

            // given
            const requestObject = {
                entityType: "entityType"
            };
            mockRequestToEntityCountHistoryEndpoint("/geovisualization/?entity=entityType",{
                status: 500
            });

            const expectedActions = [
                {
                    type: InventoryActionTypes.TOPOGRAPHIC_QUERY_FAILED,
                    data: {
                        message: 'Error fetching data from server',
                        severity: 'danger'
                    }
                }];

            const store = mockStore();

            // when
            await store.dispatch(onTopographicMapMounted(requestObject));

            // then
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
