import React from 'react';
import { shallow, mount } from 'enzyme';
import {Provider} from 'react-redux'
import configureStore from 'redux-mock-store';
import Table from 'react-bootstrap/lib/Table';

import ConnectedSelectedNodeDetails, { SelectedNodeDetails } from 'app/tierSupport/selectedNodeDetails/SelectedNodeDetails.jsx';
import { SELECTED_NODE_TABLE_COLUMN_NAMES } from 'app/tierSupport/selectedNodeDetails/SelectedNodeDetailsConstants.js';
import LaunchInContext from 'app/tierSupport/launchExternalResource/LaunchExternalResource.jsx';

describe('SelectedNodeDetails - Shallow render of component', () => {
  let wrapper;
  const nodeTypeProp = 'VNF';
  const uidProp = 'SomeValidUIDName';
  const nodeDataProp = {
    'interface-role': 'MPLS',
    'in-maint': 'false',
    'interface-type': 'WAN',
    'port-description': 'MPLS port on 10_NSG16_location4',
    'resource-version': '123456789',
    'interface-name': '10_port1_location4',
    'uri': 'network/pnfs/pnf/10_NSG14_location4/p-interfaces/p-interface/10_port1_location4'
  };

  beforeEach( () => {
    wrapper = shallow(
      <SelectedNodeDetails
        nodeType={nodeTypeProp}
        nodeData={nodeDataProp}
        uid={uidProp}
      />);
  })

  it('Render basic component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('Verify node type is displayed as a header', () => {
    expect(wrapper.contains(<h2>{nodeTypeProp}</h2>)).toBe(true);
    expect(wrapper.find('h2')).toHaveLength(1);
  });

  it('Verify uid is displayed', () => {
    expect(wrapper.contains(<span>{uidProp} <LaunchInContext/></span>)).toBe(true);
  });

  it('Verify node data table is displayed', () => {
    // verify table has a row for each node data prop plus one row for the column headers
    expect(wrapper.find(Table)).toHaveLength(1);
    expect(wrapper.find(Table).props().bsClass).toEqual('ts-selected-node-table');
    expect(wrapper.find(Table).children()).toHaveLength(2); // thead and tbody

    // validate the table header content
    expect(wrapper.find('thead')).toHaveLength(1);
    let cellClassName;
    for (let index = 1; index <= SELECTED_NODE_TABLE_COLUMN_NAMES.length; index++) {
      cellClassName = (index % 2 ? 'left-column-cell' : 'right-column-cell');
      expect(wrapper.contains(
        <th className={cellClassName}  key={index}>{SELECTED_NODE_TABLE_COLUMN_NAMES[index-1]}</th>
      )).toBe(true);
    }

    // validate the table body content
    expect(wrapper.find('tbody')).toHaveLength(1);
    expect(wrapper.find('tbody').children()).toHaveLength(7); // 1 row for each of the 7 properties
    for (let prop in nodeDataProp) {
      expect(wrapper.contains(
        <td className='left-column-cell'>{prop}</td>
      )).toBe(true);
      expect(wrapper.contains(
        <td className='right-column-cell'>{nodeDataProp[prop]}</td>
      )).toBe(true);
    }
  });
})

describe('SelectedNodeDetails - Shallow render of component with no node data', () => {
  let wrapper;
  const nodeTypeProp = 'VNF';
  const uidProp = 'SomeValidUIDName';
  const nodeDataProp = {};

  beforeEach( () => {
    wrapper = shallow(
      <SelectedNodeDetails
        nodeType={nodeTypeProp}
        nodeData={nodeDataProp}
        uid={uidProp}
      />);
  })

  it('Render basic component', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('Verify node data table is hidden', () => {
    // verify table is hidden
    expect(wrapper.find(Table)).toHaveLength(1);
    expect(wrapper.find(Table).props().bsClass).toEqual('hidden');
  });
})

describe('SelectedNodeDetails - Render React Component (wrapped in <Provider>)', () => {
  const initialState = {
    tierSupport: {
      launchExternalResourceReducer: {
        externalResourcePayload: {}
      },
      selectedNodeDetails: {
        nodeType: 'VNF',
        uid: 'AAI/CLYMR/000509/SD_WAN',
        nodeData: {
          'interface-role': 'MPLS',
          'in-maint': 'false',
          'interface-type': 'WAN',
          'port-description': 'MPLS port on 10_NSG16_location4',
          'resource-version': '123456789',
          'interface-name': '10_port1_location4',
          'uri': 'network/pnfs/pnf/10_NSG14_location4/p-interfaces/p-interface/10_port1_location4'
        }
      }
    }
  };
  const mockStore = configureStore();
  let store, wrapper;

  beforeEach( () => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><ConnectedSelectedNodeDetails /></Provider>);
  })

  it('Render the connected component', () => {
    expect(wrapper.find(ConnectedSelectedNodeDetails).length).toEqual(1);
  });

  it('Validate props from store', () => {
    expect(wrapper.find(SelectedNodeDetails).props().uid).toEqual(initialState.tierSupport.selectedNodeDetails.uid);
    expect(wrapper.find(SelectedNodeDetails).props().nodeType).toEqual(initialState.tierSupport.selectedNodeDetails.nodeType);
    expect(wrapper.find(SelectedNodeDetails).props().nodeData).toEqual(initialState.tierSupport.selectedNodeDetails.nodeData);
  });
})
