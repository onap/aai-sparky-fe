import React from 'react';
import PaginatedTable from 'generic-components/paginatedTable/PaginatedTable.jsx';
import {shallow} from 'enzyme';

describe('PaginatedTable component', () => {
  it('should be rendered', () => {
    const component = shallow(<PaginatedTable tableHeaders={{}}/>);

    expect(component).toHaveLength(1);
  });
});
