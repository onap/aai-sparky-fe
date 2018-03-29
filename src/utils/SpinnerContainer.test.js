import React from 'react';
import { ClipLoader } from 'react-spinners';
import { mount } from 'enzyme';

import SpinnerContainer from './SpinnerContainer.jsx';
import {COLOR_BLUE} from 'utils/GlobalConstants.js';

describe('SpinnerContainer', () => {
  it('render spinner - visible', () => {
    const spinner = mount(
      <SpinnerContainer loading={true}>
        <div class='test-div'>Testing Spinner Child</div>
        <div class='test-div'>Testing Spinner Child</div>
      </SpinnerContainer>
    );
    expect(spinner.props().loading).toEqual(true); // check that the props match
    expect(spinner.find(ClipLoader)).toHaveLength(1); // ensure the ClipLoader is mounted
    expect(spinner.find(ClipLoader).props().color).toEqual(COLOR_BLUE); // ensure spinner is blue
    expect(spinner.find(ClipLoader).props().loading).toEqual(true); // ensure spinner is showing
    expect(spinner.find('div.spinner-content')).toHaveLength(1); // ensure the children are grayed out
    expect(spinner.find('div.spinner-content').children()).toHaveLength(2); // ensure number of children is accurate
  });

  it('render spinner - not visible', () => {
    const spinner = mount(
      <SpinnerContainer loading={false}>
        <div class='test-div'>Testing Spinner</div>
      </SpinnerContainer>
    );
    expect(spinner.props().loading).toEqual(false);
    expect(spinner.find(ClipLoader)).toHaveLength(1);
    expect(spinner.find(ClipLoader).props().loading).toEqual(false); // ensure spinner is not showing
    expect(spinner.find('div.spinner-content')).toHaveLength(0);
  });
})
