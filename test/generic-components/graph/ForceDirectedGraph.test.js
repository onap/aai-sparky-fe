import React from 'react';
import ForceDirectedGraph from 'generic-components/graph/ForceDirectedGraph.jsx';
import {shallow} from 'enzyme';

describe('ForceDirectedGraph component', () => {
  it('should be rendered', () => {
    const component = shallow(<ForceDirectedGraph dataOverlayButtons="Test"/>);

    expect(component).toHaveLength(1);
  });
});
