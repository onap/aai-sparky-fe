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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/lib/Col';

class HistoryEntry extends Component {
  constructor(props){
      console.log(props);
      super(props);
      this.props = props;
  }

  render(){
   this.triggerState = () => {
      this.props.triggerState(this.props.entryNodeId, this.props.entryEpoch);
    }
    return (
              <a className={"list-group-item list-group-item-action flex-column align-items-start "+ (this.props.entryAction === 'Deleted' ? 'group-item-danger' : '')}
                 onClick={this.triggerState}>
                <div className='d-flex w-100 justify-content-between'>
                  <h3 className="mb-1">{this.props.entryHeader}</h3>
                  <h3 className="mb-1">{this.props.entryBody}</h3>
                  <small>{this.props.entryDate}</small>
                </div>
                <div>
                  <small>Modified by {this.props.entrySOT}</small>
                </div>
                <div>
                  <small>Transaction Id : {this.props.entryTransId}</small>
                </div>
              </a>
    );
  }
};

export default HistoryEntry;
