import React from 'react';
import Link from 'generic-components/graph/Link.jsx';
import {shallow} from 'enzyme';

describe('Link component', () => {
  it('should be rendered', () => {
    const component = shallow(<Link/>);

    expect(component).toHaveLength(1);
  });
});
