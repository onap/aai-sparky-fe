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
import Col from 'react-bootstrap/lib/Col';
import Label from 'react-bootstrap/lib/Label';
import { Link } from 'react-router-dom';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';

const modelBreadcrumb = (props) => {

 let links = null;
 let historyStackArr = [];
 var setURIInSession = function(uri){
    sessionStorage.setItem(GlobalExtConstants.ENVIRONMENT + 'URI', uri);
 }
    if (props.historyStackString) {
      historyStackArr = props.historyStackString.split('||');
      for(var i = 0; i < historyStackArr.length; i++){
         historyStackArr[i] = historyStackArr[i].split(',');
         console.log('[ModelBreadcrumb.jsx] previous url ' + historyStackArr[i][0] + ' previous api call '+ historyStackArr[i][1]);
      }
      links = historyStackArr.map((link, idx) => {
        let breadCrumbTxt=decodeURI(link[2]).replace(/%2F/g,'/');
        return (
                <div className='customBreadCrumb'>
                {idx === historyStackArr.length - 2 ? (
                    <b id={'breadcrumbStatic' + idx} style={{'float' : 'left'}}>{breadCrumbTxt}</b>
                    ) : idx !== historyStackArr.length - 1 ? (
                    <div id={'breadcrumbLink' + idx}>
                      <div style={{'float' : 'left'}}>                          
                        <Link
                          key={idx}
                          to={{
                            pathname: link[0],
                            uri: link[1],
                            historyStackString: (breadCrumbTxt==='Origin')?'':props.historyStackString
                          }} onClick={() => setURIInSession(link[1])}>{breadCrumbTxt}
                        </Link>
                    </div>
                      <div style={{'float' : 'left'}}>&nbsp;&nbsp;&#x3E;&#x3E;&nbsp;&nbsp;</div>
                </div>
                 ):(<div></div>)}
                 </div>
        );
      });
    }
  return (
    <Col md={12}  className='addPaddingTop'>
        {links}
    </Col>
  );
};

export default modelBreadcrumb;
