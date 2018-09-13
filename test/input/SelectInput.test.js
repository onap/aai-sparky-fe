import React from 'react';
import { mount } from 'enzyme';
import Select from 'react-select';

import SelectInput from 'generic-components/input/SelectInput.jsx';

describe('SelectInput Tests', () => {
  it('render select input - visible', () => {
    const select = mount( <SelectInput /> );
    expect(select).toHaveLength(1); // ensure the message bar is mounted
    expect(select.find(Select)).toHaveLength(1); // ensure the InlineMessage is mounted
  });
})
