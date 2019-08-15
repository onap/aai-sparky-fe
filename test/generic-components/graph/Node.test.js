import React from 'react';
import Node from 'generic-components/graph/Node.jsx';
import {shallow} from 'enzyme';

describe('Node component', () => {
  it('should be rendered', () => {
    const component = shallow(<Node/>);

    expect(component).toHaveLength(1);
  });
});
