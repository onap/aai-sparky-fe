import React from 'react';
import { mount } from 'enzyme';

import ToggleInput from 'generic-components/input/ToggleInput.jsx';

describe('ToggleInput Tests', () => {
  it('render toggle input - visible', () => {
    const toggle = mount( <ToggleInput /> );
    expect(toggle).toHaveLength(1); // ensure the message bar is mounted
    expect(toggle.find('input')).toHaveLength(1); // ensure the InlineMessage is mounted
  });
})
