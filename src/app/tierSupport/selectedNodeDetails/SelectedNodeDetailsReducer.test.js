import SelectedNodeDetailsReducer from './SelectedNodeDetailsReducer.js';
import {tierSupportActionTypes} from 'app/tierSupport/TierSupportConstants.js';
import {
  globalAutoCompleteSearchBarActionTypes
} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarConstants.js';

describe('SelectedNodeDetails - Reducer Tests', () => {
  it('Action Type: TS_NODE_SEARCH_RESULTS', () => {
    const action = {
      type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
      data: {
        nodes: [
          {
            'id': 'AAI/CLYMR/000509/SD_WAN',
            'itemType': 'service-instance',
            'itemNameKey': 'service-instance.AAI/SPRKY/000509/SD_WAN',
            'itemNameValue': 'AAI/SPRKY/000509/SD_WAN',
            'itemProperties': {
              'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
              'resource-version':'1508078039815'
            },
            'itemIntegrity' : {
              'entityId' : 'AEEhny_vnf1_under_fw-si1',
              'entityType' : 'vnf',
              'entityLink' : 'cloud-infrastr084-1377-4f49-9c72-f0_location2',
              'initialTimestamp' :'2017-11-13T16:58:01Z',
              'latestValidationTimestamp':'2017-11-13T16:58:01Z',
              'resourceVersion':'1510592264096',
              'violations': []
            },
            'nodeMeta': {
              'className': 'selectedSearchedNodeClass',
              'nodeDebug': null,
              'selfLinkResponseTimeInMs': 628,
              'relationshipNode': false,
              'searchTarget': true,
              'enrichableNode': false,
              'nodeValidated': true,
              'nodeIssue': false,
              'maxAltitude': 4,
              'nodeType': 'serviceInstance',
              'nodeLabel1':'service-instance',
              'nodeLabel2':'AAI/SPRKY/000509/SD_WAN'
            },
            'rootNode' : false
          }
        ]
      }
    };
    let state = {
      nodeType: '',
      uid: '',
      nodeData: {}
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: action['data']['nodes'][0]['itemType'],
      uid: action['data']['nodes'][0]['itemNameValue'],
      nodeData: action['data']['nodes'][0]['itemProperties']
    });
  });

  it('Action Type: TS_NODE_SEARCH_RESULTS - searchTarget === false', () => {
    const action = {
      type: tierSupportActionTypes.TS_NODE_SEARCH_RESULTS,
      data: {
        nodes: [
          {
            'id': 'AAI/CLYMR/000509/SD_WAN',
            'itemType': 'service-instance',
            'itemNameKey': 'service-instance.AAI/SPRKY/000509/SD_WAN',
            'itemNameValue': 'AAI/SPRKY/000509/SD_WAN',
            'itemProperties': {
              'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
              'resource-version':'1508078039815'
            },
            'itemIntegrity' : {
              'entityId' : 'AEEhny_vnf1_under_fw-si1',
              'entityType' : 'vnf',
              'entityLink' : 'cloud-infrastr084-1377-4f49-9c72-f0_location2',
              'initialTimestamp' :'2017-11-13T16:58:01Z',
              'latestValidationTimestamp':'2017-11-13T16:58:01Z',
              'resourceVersion':'1510592264096',
              'violations': []
            },
            'nodeMeta': {
              'className': 'selectedSearchedNodeClass',
              'nodeDebug': null,
              'selfLinkResponseTimeInMs': 628,
              'relationshipNode': false,
              'searchTarget': false,
              'enrichableNode': false,
              'nodeValidated': true,
              'nodeIssue': false,
              'maxAltitude': 4,
              'nodeType': 'serviceInstance',
              'nodeLabel1':'service-instance',
              'nodeLabel2':'AAI/SPRKY/000509/SD_WAN'
            },
            'rootNode' : false
          }
        ]
      }
    };
    let state = {
      nodeType: 'Complex',
      uid: 'ABC',
      nodeData: {
        'service-instance-id': 'blah/blah/blah',
        'resource-version':'123456'
      }
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: '',
      uid: '',
      nodeData: {}
    });
  });

  it('Action Type: TS_GRAPH_NODE_SELECTED', () => {
    const action = {
      type: tierSupportActionTypes.TS_GRAPH_NODE_SELECTED,
      data: {
        itemProperties: {
          'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
          'resource-version':'1508078039815'
        },
        itemType: 'Complex',
        itemNameValue: '123456'
      }
    };
    let state = {
      nodeType: '',
      uid: '',
      nodeData: {}
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: action['data']['itemType'],
      uid: action['data']['itemNameValue'],
      nodeData: action['data']['itemProperties']
    });
  });

  it('Action Type: TIER_SUPPORT_NETWORK_ERROR', () => {
    const action = {
      type: tierSupportActionTypes.TIER_SUPPORT_NETWORK_ERROR,
    };
    let state = {
      nodeType: 'Complex',
      uid: '12345',
      nodeData: {
        'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
        'resource-version':'1508078039815'
      }
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: '',
      uid: '',
      nodeData: {}
    });
  });

  it('Action Type: TIER_SUPPORT_CLEAR_DATA', () => {
    const action = {
      type: tierSupportActionTypes.TIER_SUPPORT_CLEAR_DATA,
    };
    let state = {
      nodeType: 'Complex',
      uid: '12345',
      nodeData: {
        'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
        'resource-version':'1508078039815'
      }
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: '',
      uid: '',
      nodeData: {}
    });
  });

  it('Action Type: TS_NODE_SEARCH_NO_RESULTS', () => {
    const action = {
      type: tierSupportActionTypes.TS_NODE_SEARCH_NO_RESULTS,
    };
    let state = {
      nodeType: 'Complex',
      uid: '12345',
      nodeData: {
        'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
        'resource-version':'1508078039815'
      }
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: '',
      uid: '',
      nodeData: {}
    });
  });

  it('Action Type: SEARCH_WARNING_EVENT', () => {
    const action = {
      type: globalAutoCompleteSearchBarActionTypes.SEARCH_WARNING_EVENT,
    };
    let state = {
      nodeType: 'Complex',
      uid: '12345',
      nodeData: {
        'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
        'resource-version':'1508078039815'
      }
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: '',
      uid: '',
      nodeData: {}
    });
  });

  it('Invalid Action Type', () => {
    const action = {
      type: 'Nonexistent Action Type',
    };
    let state = {
      nodeType: 'Complex',
      uid: '12345',
      nodeData: {
        'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
        'resource-version':'1508078039815'
      }
    };
    state = SelectedNodeDetailsReducer(state, action);
    expect(state).toEqual({
      nodeType: 'Complex',
      uid: '12345',
      nodeData: {
        'service-instance-id': 'AAI/SPRKY/000509/SD_WAN',
        'resource-version':'1508078039815'
      }
    });
  });
})
