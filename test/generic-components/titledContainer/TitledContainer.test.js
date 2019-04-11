import React from 'react';
import TitledContainer from 'generic-components/titledContainer/TitledContainer.jsx';
import {shallow} from 'enzyme';

describe('TitledContainer component', () => {
  it('should be rendered', () => {
    const component = shallow(<TitledContainer/>);

    expect(component).toHaveLength(1);
  });
});
