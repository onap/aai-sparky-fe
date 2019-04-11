import React from 'react';
import InlineMessage from 'generic-components/InlineMessage/InlineMessage.jsx';
import {shallow} from 'enzyme';

describe('InlineMessage component', () => {
  it('should be rendered', () => {
    const component = shallow(<InlineMessage/>);

    expect(component).toHaveLength(1);
  });
});
