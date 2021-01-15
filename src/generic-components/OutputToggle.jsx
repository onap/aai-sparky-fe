/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
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
import Row from 'react-bootstrap/lib/Row';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';

let PAGINATION_CONSTANT = GlobalExtConstants.PAGINATION_CONSTANT;

const OutputToggle = (props) => {

  return (
      <div className="addPaddingSide">
          <Row className='show-grid'>
             <Col md={8}>
                <button type='button' className={'btn ' + ((props.scope.state.viewName === "CardLayout") ? 'btn-primary' : 'btn-outline-secondary')} value="CardLayout" onClick={(e) => props.scope.setViewName(e)}><i className={'icon-content-gridL ' + ((props.scope.state.viewName === "CardLayout") ? 'tabIconChosen' : 'tabIconNotChosen')} role="img"></i></button>
                {!props.cellDisabled && <button type='button' className={'btn ' + ((props.scope.state.viewName === "CellLayout") ? 'btn-primary' : 'btn-outline-secondary')} value="CellLayout" onClick={(e) => props.scope.setViewName(e)}><i className={'icon-content-gridguideL ' + ((props.scope.state.viewName === "CellLayout") ? 'tabIconChosen' : 'tabIconNotChosen')} role="img"></i></button>}
                {!props.visualDisabled && <button type='button' className={'btn ' + ((props.scope.state.viewName === "VisualLayout") ? 'btn-primary' : 'btn-outline-secondary')} value="VisualLayout" onClick={(e) => props.scope.setViewName(e)}><i className={'icon-datanetwork-globalnetworkL ' + ((props.scope.state.viewName === "VisualLayout") ? 'tabIconChosen' : 'tabIconNotChosen')} role="img"></i></button>}
             </Col>
          </Row>
          <Row className='show-grid'>
              <Col md={8}>
                  <div className='checkbox'>
                            <label>
                                {props.scope.state.viewName !==  'VisualLayout' && <input type='checkbox' className='radio'  value={props.scope.state.viewName} name='defaultViewName' checked={props.scope.state.viewName === props.scope.state.defaultViewName} onChange={(e) => props.scope.setDefaultViewName(e)} disabled={props.scope.state.viewName === props.scope.state.defaultViewName}/>}
                                {props.scope.state.viewName !==  'VisualLayout' && (props.scope.state.viewName === props.scope.state.defaultViewName ? 'Default View' : 'Set as Default View')}
                            </label>
                  </div>
              </Col>
          </Row>
      </div>
  );
};

export default OutputToggle;
