import React from 'react';

const ClearFilter = (props) => (
    <button type='button' className='btn btn-secondary' onClick={props.clearAllHandler}>Clear Filters</button>
);

export default ClearFilter;