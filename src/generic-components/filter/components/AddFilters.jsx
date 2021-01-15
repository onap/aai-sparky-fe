import React from 'react';

const AddFilters = (props) => (
    <button type='button' className='btn btn-primary' onClick={props.addHandler}>Add Filter</button>
);

export default AddFilters;