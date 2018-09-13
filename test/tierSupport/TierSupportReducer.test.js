import TierSupportReducer from 'app/tierSupport/TierSupportReducer.js';
import ForceDirectedGraph from 'generic-components/graph/ForceDirectedGraph.jsx';
import {
  tierSupportActionTypes,
  TSUI_GRAPH_MENU_NODE_DETAILS
} from 'app/tierSupport/TierSupportConstants.js';
import {
  MESSAGE_LEVEL_WARNING,
  MESSAGE_LEVEL_DANGER
} from 'utils/GlobalConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';

describe('TierSupportReducerTests', () => {
  it('Action Type: TS_NODE_SEARCH_RESULTS', () => {
    ForceDirectedGraph.graphCounter = 0; // ensuring counter is at zero after previous tests
    const action = {
      type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
      data: {
        nodes: [
          {
            nodeMeta: {
              searchTarget: true
            },
            itemProperties: 'someProperty'
          }
        ],
        links: ['link', 'information'],
        graphMeta: { graph: 'meta' }
      }
    };
    let graphData = ForceDirectedGraph.generateNewProps(action.data.nodes, action.data.links,
      action.data.graphMeta);
    ForceDirectedGraph.graphCounter = 0; // ensuring counter is at zero after previous statement
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      forceDirectedGraphRawData: graphData,
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: TS_GRAPH_NODE_MENU_SELECTED', () => {
    const action = {
      type: tierSupportActionTypes.TS_GRAPH_NODE_MENU_SELECTED,
      data: {
        attr1: 'someValue',
        attr2: 'someOterValue'
      }
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      graphNodeSelectedMenu: action.data
    });
  });

  it('Action Type: TS_NODE_SEARCH_NO_RESULTS', () => {
    ForceDirectedGraph.graphCounter = 0; // ensuring counter is at zero after previous tests
    let emptyNodesAndLinksNoResults = {
      graphCounter: 1,
      graphMeta: {},
      linkDataArray: [],
      nodeDataArray: []
    };
    const action = {
      type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
      data: {
        errorMsg: 'some error message'
      }
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      forceDirectedGraphRawData: emptyNodesAndLinksNoResults,
      graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS,
      feedbackMsgText: action.data.errorMsg,
      feedbackMsgSeverity: MESSAGE_LEVEL_WARNING
    });
  });

  it('Action Type: TIER_SUPPORT_NETWORK_ERROR', () => {
    ForceDirectedGraph.graphCounter = 0; // ensuring counter is at zero after previous tests
    let emptyNodesAndLinksNoResults = {
      graphCounter: 1,
      graphMeta: {},
      linkDataArray: [],
      nodeDataArray: []
    };
    const action = {
      type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR,
      data: {
        errorMsg: 'some error message'
      }
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      forceDirectedGraphRawData: emptyNodesAndLinksNoResults,
      graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS,
      feedbackMsgText: action.data.errorMsg,
      feedbackMsgSeverity: MESSAGE_LEVEL_DANGER
    });
  });

  it('Action Type: TIER_SUPPORT_CLEAR_DATA', () => {
    ForceDirectedGraph.graphCounter = 0; // ensuring counter is at zero after previous tests
    let emptyNodesAndLinksNoResults = {
      graphCounter: 1,
      graphMeta: {},
      linkDataArray: [],
      nodeDataArray: []
    };
    const action = {
      type: tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      forceDirectedGraphRawData: emptyNodesAndLinksNoResults,
      graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS,
      feedbackMsgText: '',
      feedbackMsgSeverity: ''
    });
  });

  it('Action Type: TS_GRAPH_NODE_SELECTED', () => {
    const action = {
      type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
      data: 'some action data'
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      nodeData: action.data
    });
  });

  it('Action Type: TIER_SUPPORT_ACTIVATE_BUSY_FEEDBACK', () => {
    const action = {
      type: tierSupportActionTypes.TIER_SUPPORT_ACTIVATE_BUSY_FEEDBACK,
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      enableBusyFeedback: true
    });
  });

  it('Action Type: TIER_SUPPORT_DISABLE_BUSY_FEEDBACK', () => {
    const action = {
      type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK,
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      enableBusyFeedback: false
    });
  });

  it('Action Type: SEARCH_WARNING_EVENT', () => {
    ForceDirectedGraph.graphCounter = 0; // ensuring counter is at zero after previous tests
    let emptyNodesAndLinksNoResults = {
      graphCounter: 1,
      graphMeta: {},
      linkDataArray: [],
      nodeDataArray: []
    };
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT,
      data: {
        errorMsg: 'some warning msg'
      }
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      forceDirectedGraphRawData: emptyNodesAndLinksNoResults,
      graphNodeSelectedMenu: TSUI_GRAPH_MENU_NODE_DETAILS
    });
  });

  it('Action Type: TS_OVERLAY_NETWORK_CALLBACK_RESPONSE_RECEIVED', () => {
    const action = {
      type: tierSupportActionTypes.TS_OVERLAY_NETWORK_CALLBACK_RESPONSE_RECEIVED,
      data: {
        curData: {
          attr1: 'value1',
          attr2: 'value2'
        },
        paramName: 'attr2',
        overlayData: 'someValue2'
      }
    };
    let state = {};
    state = TierSupportReducer(state, action);
    expect(state.tierSupportReducer).toEqual({
      nodeData: {
        attr1: 'value1',
        attr2: 'someValue2'
      }
    });
  });
})
