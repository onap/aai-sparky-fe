import React from 'react';
import {Link} from 'react-router-dom';
//import {BrowserRouter} from 'react-router-dom';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
let URI_DELIMITCHAR = GlobalExtConstants.URI_DELIMITCHAR;

var prepareURI = (props) => {
  console.log('prepare URI');
  let URI = '/model/' + props.filterSelected;
  let filterList = props.filterSelectedList;
  if(filterList){
    for (var key in filterList){
      if(filterList.hasOwnProperty(key)){
        URI += ';' + filterList[key].id + URI_DELIMITCHAR + filterList[key].type + URI_DELIMITCHAR + filterList[key].value;
      }
    }
  }
  return (
    URI
  ); 
};
const RunFilterQuery = (props) => {
  if(props.param.isRunEnable){ 
    return(  
      <Link to={prepareURI(props.param)}> 
        <button type='button' className='btn btn-warning'>Run </button>
      </Link>
    );
  }else{
    return(
        <span></span>
    );
  }
};

export default RunFilterQuery;
