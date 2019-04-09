import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock';

import {
  processVnfFilterPanelCollapse,
  clearVnfSearchData,
  setNotificationText,
  processVnfVisualizationsOnFilterChange
} from 'app/vnfSearch/VnfSearchActions.js';
import {
  vnfActionTypes,
  CHART_PROV_STATUS,
  CHART_ORCH_STATUS,
  CHART_NF_TYPE,
  CHART_NF_ROLE,
  TOTAL_VNF_COUNT,
  VNF_FILTER_EMPTY_RESULT
} from 'app/vnfSearch/VnfSearchConstants.js';
import { globalInlineMessageBarActionTypes } from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants.js';
import { ERROR_RETRIEVING_DATA } from 'app/networking/NetworkConstants.js';

describe('VnfSearchAction - Action Tests', () => {
  it('Action: processVnfFilterPanelCollapse - open', () => {
    const result = processVnfFilterPanelCollapse(true);
    expect(result).toEqual({
      type: vnfActionTypes.VNF_FILTER_PANEL_TOGGLED,
      data: {
        vnfVisualizationPanelClass: 'collapsible-panel-main-panel vertical-filter-panel-is-open'
      }
    });
  });

  it('Action: processVnfFilterPanelCollapse - close', () => {
    const result = processVnfFilterPanelCollapse(false);
    expect(result).toEqual({
      type: vnfActionTypes.VNF_FILTER_PANEL_TOGGLED,
      data: {
        vnfVisualizationPanelClass: 'collapsible-panel-main-panel'
      }
    });
  });

  it('Action: clearVnfSearchData', () => {
    const result = clearVnfSearchData();
    expect(result).toEqual({
      type: vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED,
      data: {
        count: '',
        provStatusData: CHART_PROV_STATUS.emptyData,
        orchStatusData: CHART_ORCH_STATUS.emptyData,
        nfTypeData: CHART_NF_TYPE.emptyData,
        nfRoleData: CHART_NF_ROLE.emptyData
      }
    });
  });

  it('Action: setNotificationText - with message', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ vnfSearch: {} });
    store.dispatch(setNotificationText('test error message', 'WARNING'));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
      data: {
        msgText: 'test error message',
        msgSeverity: 'WARNING'
      }
    }]);
  });

  it('Action: processVnfVisualizationsOnFilterChange - data for filter values', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ vnfSearch: {} });
    const filterValueMap = {
      1: 'Running',
      2: 'Junk',
      7: 'Blah',
      8: 'Doh'
    };
    const expectedActions = [
      { type: vnfActionTypes.VNF_ACTIVATE_BUSY_FEEDBACK },
      { type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE },
      {
        type: vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED,
        data: {
          count: 10,
          provStatusData: {
            values: [
              { x: 'junk', y: 10 }
            ]
          },
          orchStatusData: {
            values: [
              { x: 'running', y: 10 }
            ]
          },
          nfTypeData: {
            values: [
              { x: 'doh', y: 10 }
            ]
          },
          nfRoleData: {
            values: [
              { x: 'blah', y: 10 }
            ]
          }
        }
      },
      { type: vnfActionTypes.VNF_DISABLE_BUSY_FEEDBACK }
    ];
    fetchMock.mock('*', {
      "total": 10,
      "aggregations":{
        "nf-role":[{"doc_count":10,"key":"blah"}],
        "nf-type":[{"doc_count":10,"key":"doh"}],
        "prov-status":[{"doc_count":10,"key":"junk"}],
        "orchestration-status":[{"doc_count":10,"key":"running"}]
      }
    });

    return store.dispatch(processVnfVisualizationsOnFilterChange(filterValueMap))
      .then( () => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
        fetchMock.restore();
      });
  });

  it('Action: processVnfVisualizationsOnFilterChange - no data for filter values', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ vnfSearch: {} });
    const filterValueMap = {
      1: 'Running',
      2: 'Junk',
      7: '',
      8: 'Doh'
    };
    const expectedActions = [
      { type: vnfActionTypes.VNF_ACTIVATE_BUSY_FEEDBACK },
      { type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
        data: { msgSeverity: "warning", msgText: VNF_FILTER_EMPTY_RESULT }
      },
      {
        type: vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED,
        data: {
          count: TOTAL_VNF_COUNT.emptyData,
          provStatusData: CHART_PROV_STATUS.emptyData,
          orchStatusData: CHART_ORCH_STATUS.emptyData,
          nfTypeData: CHART_NF_TYPE.emptyData,
          nfRoleData: CHART_NF_ROLE.emptyData
        }
      },
      { type: vnfActionTypes.VNF_DISABLE_BUSY_FEEDBACK }
    ];
    fetchMock.mock('*', {
      "total": 0,
      "aggregations":{
        "nf-role":[],
        "nf-type":[],
        "prov-status":[],
        "orchestration-status":[]
      }
    });

    return store.dispatch(processVnfVisualizationsOnFilterChange(filterValueMap))
      .then( () => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
        fetchMock.restore();
      });
  });

  it('Action: processVnfVisualizationsOnFilterChange - network error', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ vnfSearch: {} });
    const filterValueMap = {
      1: 'Running',
      2: 'Junk',
      7: 'Blah',
      8: 'Doh'
    };
    const expectedActions = [
      { type: vnfActionTypes.VNF_ACTIVATE_BUSY_FEEDBACK },
      { type: vnfActionTypes.VNF_DISABLE_BUSY_FEEDBACK },
      {
        type: vnfActionTypes.VNF_NETWORK_ERROR,
        data: { errorMsg: ERROR_RETRIEVING_DATA }
      }
    ];
    fetchMock.mock('*', 503);

    return store.dispatch(processVnfVisualizationsOnFilterChange(filterValueMap))
      .then( () => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
        fetchMock.restore();
      });
  });

  it('Action: setNotificationText - no message', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ vnfSearch: {} });
    store.dispatch(setNotificationText('', ''));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
    }]);
  });
})
