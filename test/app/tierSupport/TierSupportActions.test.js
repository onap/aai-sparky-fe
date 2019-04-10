import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import {
  onNodeDetailsChange,
  splitPaneResize,
  onNodeMenuChange,
  clearVIData,
  setNotificationText,
  fetchSelectedNodeElement,
  querySelectedNodeElement
}
from 'app/tierSupport/TierSupportActions';
import {tierSupportActionTypes} from 'app/tierSupport/TierSupportConstants';
import {MESSAGE_LEVEL_WARNING} from 'utils/GlobalConstants';
import {globalInlineMessageBarActionTypes} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants';
import {
  NO_RESULTS_FOUND,
  ERROR_RETRIEVING_DATA
} from 'app/networking/NetworkConstants';
import networkCall from 'app/networking/NetworkCalls';

const mockStore = configureStore([thunk]);

describe('TierSupportActionTests', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ tierSupportReducer: {} });
  });

  describe('onNodeDetailsChange', () => {
    it('emits TS_GRAPH_NODE_SELECTED with payload', () => {
      // Given
      const newDetails = {
        testDetails: 'Test Details',
      };
      const expectedActions = [{
        type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
        data: newDetails
      }];

      // When
      store.dispatch(onNodeDetailsChange(newDetails));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('splitPaneResize', () => {
    it('emits SPLIT_PANE_RESIZE action with payload', () => {
      // Given
      const initialLoad = {
        test: 'message'
      };
      const expectedActions = [{
        type: tierSupportActionTypes.SPLIT_PANE_RESIZE,
        data: initialLoad
      }];

      // When
      store.dispatch(splitPaneResize(initialLoad));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('onNodeMenuChange', () => {
    it('emits TS_GRAPH_NODE_MENU_SELECTED action with payload', () => {
      // Given
      const selectedMenu = {
        test: 'menuData'
      };
      const expectedActions = [{
        type: tierSupportActionTypes.TS_GRAPH_NODE_MENU_SELECTED,
        data: selectedMenu
      }];

      // When
      store.dispatch(onNodeMenuChange(selectedMenu));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('clearVIData', () => {
    it('emits TIER_SUPPORT_CLEAR_DATA action', () => {
      // Given
      const expectedActions = [{
        type: tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA
      }];

      // When
      store.dispatch(clearVIData());

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('fetchSelectedNodeElement', () => {
    it('emits actions with proper error message when 204 code returned', async () => {
      // Given
      const promise = () => getPromiseWithStatusCode(204);
      const expectedActions = [
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK,
        },
        {
          type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
          data: {errorMsg: NO_RESULTS_FOUND}
        }
      ];

      // When
      await store.dispatch(fetchSelectedNodeElement(promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with proper error message when 3XX code returned', async () => {
      // Given
      const promise = () => getPromiseWithStatusCode(301);
      const expectedActions = [
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK,
        },
        {
          type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
          data: {errorMsg: NO_RESULTS_FOUND}
        }
      ];

      // When
      await store.dispatch(fetchSelectedNodeElement(promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with proper error message when 5XX code returned', async () => {
      // Given
      const promise = () => getPromiseWithStatusCode(501);
      const expectedActions = [
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK,
        },
        {
          type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR,
          data: {value: ERROR_RETRIEVING_DATA, errorMsg: ERROR_RETRIEVING_DATA}
        }
      ];

      // When
      await store.dispatch(fetchSelectedNodeElement(promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with payload when 200 code returned and nodes not empty', async () => {
      // Given
      const {nodes, node1} = prepareTestNodes();
      const promise = () => getNodesPromise(nodes);
      const expectedActions = [
        {
          type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
          data: {"nodes": nodes}
        },
        {
          type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
          data: node1
        },
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK
        }
      ];

      // When
      await store.dispatch(fetchSelectedNodeElement(promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits actions with payload when 200 code returned and nodes empty', async () => {
      // Given
      const promise = () => getNodesPromise([]);
      const expectedActions = [
        {
          type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
          data: {errorMsg: NO_RESULTS_FOUND}
        },
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK
        }
      ];

      // When
      await store.dispatch(fetchSelectedNodeElement(promise));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('querySelectedNodeElement', () => {
    const searchHash = "testHash";

    it('emits actions when fetchRequest defined ', async () => {
      // Given
      const promise = () => getNodesPromise([]);
      const expectedAction = [
        {
          type: tierSupportActionTypes.TIER_SUPPORT_ACTIVATE_BUSY_FEEDBACK,
        },
        {
          type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
          data: {errorMsg: NO_RESULTS_FOUND}
        },
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK
        }
      ];

      // When
      await store.dispatch(querySelectedNodeElement(searchHash, promise));

      // Then
      expect(store.getActions()).toEqual(expectedAction);
    });

    it('builds request and emits actions when fetchRequest undefined ', async () => {
      // Given
      const stringifySpy = jest.spyOn(JSON, 'stringify');
      const promise = getNodesPromise([]);
      networkCall.fetchRequestObj = jest.fn(() => promise);
      const expectedStringifyInput = {
        hashId: searchHash
      };
      const expectedFetchRequestBody = "{\"hashId\":\"testHash\"}";
      const expectedAction = [
        {
          type: tierSupportActionTypes.TIER_SUPPORT_ACTIVATE_BUSY_FEEDBACK,
        },
        {
          type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
          data: {errorMsg: NO_RESULTS_FOUND}
        },
        {
          type: tierSupportActionTypes.TIER_SUPPORT_DISABLE_BUSY_FEEDBACK
        }
      ];

      // When
      await store.dispatch(querySelectedNodeElement(searchHash, undefined));

      // Then
      expect(stringifySpy).toHaveBeenCalledWith(expectedStringifyInput);
      expect(networkCall.fetchRequestObj).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          expectedFetchRequestBody
      );
      expect(store.getActions()).toEqual(expectedAction);
    });
  });

  describe('setNotificationText', () => {
  const msgSeverity = MESSAGE_LEVEL_WARNING;

    it('emits SET_GLOBAL_MESSAGE action with payload when msgText is not blank ', () => {
      // Given
      const msgText = 'some test text';
      const expectedActions = [{
        type: globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE,
        data: {
          msgText: msgText,
          msgSeverity: msgSeverity
        }
      }];

      // When
      store.dispatch(setNotificationText(msgText, msgSeverity));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('emits CLEAR_GLOBAL_MESSAGE when msgText is blank ', () => {
      // Given
      const msgText = '';
      const expectedActions = [{
        type: globalInlineMessageBarActionTypes.CLEAR_GLOBAL_MESSAGE
      }];

      // When
      store.dispatch(setNotificationText(msgText, msgSeverity));

      // Then
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  function getPromiseWithStatusCode(statusCode) {
    return new Promise(function(resolve) {
      resolve({status: statusCode});
    });
  }

  function getNodesPromise(nodes) {
    return new Promise(function (resolve) {
      resolve({
        status: 200,
        json: () => {
          return {
            nodes: nodes
          };
        }
      });
    });
  }

  function prepareTestNodes() {
    const node1 = prepareSelectedClassTestNode();
    const node2 = prepareOtherClassTestNode();
    return {
      nodes: [node1, node2],
      node1,
      node2
    }
  }

  function prepareOtherClassTestNode() {
    return  {
      id: '3899453d98c5b670952765974876e55ef954e0f8a930b1c',
      itemType: 'generic-vnf',
      nodeMeta: {
        className: 'someOtherClassName',
        nodeLabel1: 'Artic',
        nodeValidated: false,
        nodeLocation: 'bottom'
      },
      rootNode: false,
      index: 1
    };
  }

  function prepareSelectedClassTestNode() {
    return {
      id: '7352312c7bfa814c3071a803d98c5b670952765974876e55ef954e0f8a930b1c',
      itemType: 'complex',
      nodeMeta: {
        className: 'selectedSearchedNodeClass',
        nodeLabel1: 'Artic',
        nodeValidated: false,
        nodeLocation: 'bottom'
      },
      rootNode: false,
      index: 2
    };
  }
});
