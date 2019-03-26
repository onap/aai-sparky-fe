import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import {
  onNodeDetailsChange,
  splitPaneResize,
  onNodeMenuChange,
  clearVIData,
  setNotificationText
} from 'app/tierSupport/TierSupportActions.js';
import {
  tierSupportActionTypes
} from 'app/tierSupport/TierSupportConstants.js';
import {
  MESSAGE_LEVEL_WARNING
} from 'utils/GlobalConstants.js';
import {
  globalInlineMessageBarActionTypes
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants.js';

describe('TierSupportActionTests', () => {
  it('onNodeDetailsChange', () => {
    const newDetails = {
      id: '7352312c7bfa814c3071a803d98c5b670952765974876e55ef954e0f8a930b1c',
      itemType: 'complex',
      nodeMeta: {
        nodeLabel1: 'Artic',
        nodeValidated: false,
        nodeLocation: 'bottom'
      },
      rootNode: false,
      index: 2,
    };
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ tierSupportReducer: {} });
    store.dispatch(onNodeDetailsChange(newDetails));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
      data: newDetails
    }]);
  });

  it('splitPaneResize', () => {
    const initialLoad = {
      test: 'message'
    };
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ tierSupportReducer: {} });
    store.dispatch(splitPaneResize(initialLoad));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: tierSupportActionTypes.SPLIT_PANE_RESIZE,
      data: initialLoad
    }]);
  });

  it('onNodeMenuChange', () => {
    const selectedMenu = {
      test: 'menuData'
    };
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ tierSupportReducer: {} });
    store.dispatch(onNodeMenuChange(selectedMenu));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: tierSupportActionTypes.TS_GRAPH_NODE_MENU_SELECTED,
      data: selectedMenu
    }]);
  });

  it('clearVIData', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ tierSupportReducer: {} });
    store.dispatch(clearVIData());
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA
    }]);
  });
  //
  // it('fetchSelectedNodeElement - no results', () => {
  //   const middlewares = [thunk];
  //   const mockStore = configureStore(middlewares);
  //   const store = mockStore({ tierSupportReducer: {} });
  //   const nodes = [
  //     {
  //       id: '7352312c7bfa814c3071a803d98c5b670952765974876e55ef954e0f8a930b1c',
  //       itemType: 'complex',
  //       nodeMeta: {
  //         className: 'selectedSearchedNodeClass',
  //         nodeLabel1: 'Artic',
  //         nodeValidated: false,
  //         nodeLocation: 'bottom'
  //       },
  //       rootNode: false,
  //       index: 2
  //     },
  //     {
  //       id: '3899453d98c5b670952765974876e55ef954e0f8a930b1c',
  //       itemType: 'generic-vnf',
  //       nodeMeta: {
  //         className: 'someOtherClassName',
  //         nodeLabel1: 'Artic',
  //         nodeValidated: false,
  //         nodeLocation: 'bottom'
  //       },
  //       rootNode: false,
  //       index: 1
  //     }
  //   ];
  //   const expectedActions = [
  //     {
  //       type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
  //       data: {
  //         nodes: nodes
  //       }
  //     },
  //     {
  //       type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
  //       data: nodes[0]
  //     }
  //   ];
  //
  //   console.log(nodes);
  //
  //   let fetchRequestCallback = () => {
  //     const results = {
  //       nodes: nodes
  //     };
  //     let init = { status: 200 };
  //     let myBlob = new Blob();
  //     let response = new Response();
  //     return new Promise((resolve, reject) => {
  //       resolve(response);
  //     });
  //   };
  //   return store.dispatch(fetchSelectedNodeElement(fetchRequestCallback))
  //     .then( () => {
  //       const actions = store.getActions();
  //       expect(actions).toEqual(expectedActions);
  //     });
  // });

  it('setNotificationText', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ tierSupportReducer: {} });
    const msgText = 'some test text';
    const msgSeverity = MESSAGE_LEVEL_WARNING;
    store.dispatch(setNotificationText(msgText, msgSeverity));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
      data: {
        msgText: msgText,
        msgSeverity: msgSeverity
      }
    }]);
  });

  it('Clear notification text with setNotificationText', () => {
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore({ tierSupportReducer: {} });
    const msgText = '';
    const msgSeverity = MESSAGE_LEVEL_WARNING;
    store.dispatch(setNotificationText(msgText, msgSeverity));
    const actions = store.getActions();
    expect(actions).toEqual([{
      type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
    }]);
  });
})
