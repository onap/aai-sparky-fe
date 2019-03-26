import VnfSearchReducer from 'app/vnfSearch/VnfSearchReducer.js';
import {
  vnfActionTypes,
  CHART_ORCH_STATUS,
  CHART_PROV_STATUS,
  CHART_NF_ROLE,
  CHART_NF_TYPE,
  TOTAL_VNF_COUNT
} from 'app/vnfSearch/VnfSearchConstants.js';
import {ERROR_RETRIEVING_DATA} from 'app/networking/NetworkConstants.js';
import {
  filterBarActionTypes,
  MESSAGE_LEVEL_DANGER
} from 'utils/GlobalConstants';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';

describe('VnfSearchReducer - Reducer Action Type Tests', () => {
  it('Action Type: VNF_NETWORK_ERROR', () => {
    const action = {
      type: vnfActionTypes.VNF_NETWORK_ERROR
    };
    let state = {
      processedProvStatusCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      processedOrchStatusCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      processedNfTypeCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      processedNfRoleCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      count: 20,
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
      processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
      processedNfTypeCountChartData: CHART_NF_TYPE.emptyData,
      processedNfRoleCountChartData: CHART_NF_ROLE.emptyData,
      count: TOTAL_VNF_COUNT.emptyValue,
      feedbackMsgText: ERROR_RETRIEVING_DATA,
      feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
    });
  });

  it('Action Type: SEARCH_WARNING_EVENT', () => {
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT
    };
    let state = {
      processedProvStatusCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      processedOrchStatusCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      processedNfTypeCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      processedNfRoleCountChartData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      count: 20,
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      processedProvStatusCountChartData: CHART_PROV_STATUS.emptyData,
      processedOrchStatusCountChartData: CHART_ORCH_STATUS.emptyData,
      processedNfTypeCountChartData: CHART_NF_TYPE.emptyData,
      processedNfRoleCountChartData: CHART_NF_ROLE.emptyData,
      count: TOTAL_VNF_COUNT.emptyValue,
    });
  });

  it('Action Type: NEW_SELECTIONS', () => {
    const action = {
      type: filterBarActionTypes.NEW_SELECTIONS,
      data: {
        selectedValuesMap: [
          { filter1: ['someValue'] }
        ],
        unifiedValues: [
          { filter1: ['someValue', 'someOtherValue']}
        ]
      }
    };
    let state = {
      vnfFilterValues: {},
      unifiedFilterValues: {}
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      vnfFilterValues: action.data.selectedValuesMap,
      unifiedFilterValues: action.data.unifiedValues
    });
  });

  it('Action Type: SET_UNIFIED_VALUES', () => {
    const action = {
      type: filterBarActionTypes.SET_UNIFIED_VALUES,
      data: {
        unifiedValues: [
          { filter1: ['someValue', 'someOtherValue']}
        ]
      }
    };
    let state = {
      unifiedFilterValues: {}
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      unifiedFilterValues: action.data
    });
  });

  it('Action Type: VNF_SEARCH_RESULTS_RECEIVED', () => {
    const action = {
      type: vnfActionTypes.VNF_SEARCH_RESULTS_RECEIVED,
      data: {
        provStatusData: {
          values: [
            {x: 'col 1', y: 3},
            {x: 'col 2', y: 7},
            {x: 'col 3', y: 2}
          ]
        },
        orchStatusData: {
          values: [
            {x: 'col 1', y: 3},
            {x: 'col 2', y: 7},
            {x: 'col 3', y: 2}
          ]
        },
        nfTypeData: {
          values: [
            {x: 'col 1', y: 3},
            {x: 'col 2', y: 7},
            {x: 'col 3', y: 2}
          ]
        },
        nfRoleData: {
          values: [
            {x: 'col 1', y: 3},
            {x: 'col 2', y: 7},
            {x: 'col 3', y: 2}
          ]
        },
        count: 25,
      }
    };
    let state = {
      processedProvStatusCountChartData: {},
      processedOrchStatusCountChartData: {},
      processedNfTypeCountChartData: {},
      processedNfRoleCountChartData: {},
      count: 0,
      feedbackMsgText: 'some error msg',
      feedbackMsgSeverity: 'someSeverityLevel'
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      processedProvStatusCountChartData: action.data.provStatusData,
      processedOrchStatusCountChartData: action.data.orchStatusData,
      processedNfTypeCountChartData: action.data.nfTypeData,
      processedNfRoleCountChartData: action.data.nfRoleData,
      count: action.data.count,
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: VNF_FILTER_PANEL_TOGGLED', () => {
    const action = {
      type: vnfActionTypes.VNF_FILTER_PANEL_TOGGLED,
      data: {
        vnfVisualizationPanelClass: 'hide',
      }
    };
    let state = {
      vnfVisualizationPanelClass: 'show'
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      vnfVisualizationPanelClass: 'hide'
    });
  });

  it('Action Type: VNF_SEARCH_FILTERS_RECEIVED', () => {
    const action = {
      type: vnfActionTypes.VNF_SEARCH_FILTERS_RECEIVED,
      data: [
        { filter1: 'value 1' },
        { filter2: 'value 2' }
      ]
    };
    let state = {
      vnfFilters: []
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      vnfFilters: action.data
    });
  });

  it('Action Type: SET_NON_CONVERTED_VALUES', () => {
    const action = {
      type: filterBarActionTypes.SET_NON_CONVERTED_VALUES,
      data: [
        { value1: 'abc' },
        { value2: 'xyz' }
      ]
    };
    let state = {
      nonConvertedFilters: []
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      nonConvertedFilters: action.data
    });
  });

  it('Action Type: SET_CONVERTED_VALUES', () => {
    const action = {
      type: filterBarActionTypes.SET_CONVERTED_VALUES,
      data: {
        convertedValues: {
          value1: 'abc',
          value2: 'xyz'
        },
        nonConvertedValues: {
          value1: 123,
          value2: 456
        }
      }
    };
    let state = {
      nonConvertedFilters: {
        filter1: 'one',
        filter2: 'two'
      },
      unifiedFilterValues: {},
      vnfFilterValues: {}
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      nonConvertedFilters: {},
      unifiedFilterValues: action.data.convertedValues,
      vnfFilterValues: action.data.nonConvertedValues
    });
  });

  it('Action Type: VNF_ACTIVATE_BUSY_FEEDBACK', () => {
    const action = {
      type: vnfActionTypes.VNF_ACTIVATE_BUSY_FEEDBACK
    };
    let state = {
      enableBusyFeedback: false
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      enableBusyFeedback: true
    });
  });

  it('Action Type: VNF_DISABLE_BUSY_FEEDBACK', () => {
    const action = {
      type: vnfActionTypes.VNF_DISABLE_BUSY_FEEDBACK
    };
    let state = {
      enableBusyFeedback: true
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      enableBusyFeedback: false
    });
  });

  it('Action Type: CLEAR_FILTERS', () => {
    const action = {
      type: filterBarActionTypes.CLEAR_FILTERS
    };
    let state = {
      vnfFilters: {
        filter1: 'filterName1'
      },
      vnfFilterValues: {
        filter1: 'value 1'
      },
      nonConvertedFilters: {
        nonConvertedFilter1: 'some fitler props'
      },
      unifiedFilterValues: {
        unifiedFilter1: 'some unified props'
      }
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      vnfFilters: {},
      vnfFilterValues: {},
      nonConvertedFilters: {},
      unifiedFilterValues: {}
    });
  });

  it('Invalid Action Type', () => {
    const action = {
      type: 'Nonexistent Action Type',
    };
    let state = {
      vnfFilters: {
        filter1: 'filterName1'
      },
      vnfFilterValues: {
        filter1: 'value 1'
      },
      nonConvertedFilters: {
        nonConvertedFilter1: 'some fitler props'
      },
      unifiedFilterValues: {
        unifiedFilter1: 'some unified props'
      },
      enableBusyFeedback: true,
      provStatusData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      orchStatusData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      nfTypeData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      nfRoleData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      count: 25
    };
    state = VnfSearchReducer(state, action);
    expect(state).toEqual({
      vnfFilters: {
        filter1: 'filterName1'
      },
      vnfFilterValues: {
        filter1: 'value 1'
      },
      nonConvertedFilters: {
        nonConvertedFilter1: 'some fitler props'
      },
      unifiedFilterValues: {
        unifiedFilter1: 'some unified props'
      },
      enableBusyFeedback: true,
      provStatusData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      orchStatusData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      nfTypeData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      nfRoleData: {
        values: [
          {x: 'col 1', y: 3},
          {x: 'col 2', y: 7},
          {x: 'col 3', y: 2}
        ]
      },
      count: 25
    });
  });
})
