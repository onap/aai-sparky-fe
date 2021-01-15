/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2021 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

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
