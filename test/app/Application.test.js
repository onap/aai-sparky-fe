import React from 'react';
import {shallow} from 'enzyme';
import Application from 'app/Application';

describe('Application', () => {
  it('renders children when passed in', () => {
    const wrapper = shallow((
      <Application>
        <div className="unique"/>
      </Application>
    ));
    expect(wrapper.contains(<div className="unique" />)).toEqual(true);
  });
});