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
import {connect} from 'react-redux';
import { PropTypes } from 'prop-types';
import React, {Component} from 'react';
import {isEmpty} from 'lodash';
import Button from 'react-bootstrap/lib/Button.js';

let mapStateToProps = ({tierSupport: {launchExternalResourceReducer}}) => {
  let {externalResourcePayload = {}} = launchExternalResourceReducer;

  return {
    externalResourcePayload
  };
};

class LaunchExternalResource extends Component {
  static propTypes = {
    externalResourcePayload: PropTypes.object
  };

  render() {
    const {externalResourcePayload} = this.props;

    let launchExternalResourceClass = 'hidden';
    if(!isEmpty(externalResourcePayload) && (externalResourcePayload.message.payload.params.objectName.length > 0)){
      launchExternalResourceClass = '';
    }

    return (
      <div className={launchExternalResourceClass}>
        <Button
          bsClass='launch-external-resource-button'
          onClick={this.handleClick} />
      </div>
    );
  }
  handleClick = () => {
    var getWindowUrl = function (url) {
      var split = url.split('/');
      return split[0] + '//' + split[2];
    };
    if(document.referrer) {
      window.parent.postMessage(JSON.stringify(this.props.externalResourcePayload), getWindowUrl(document.referrer));
    }
  }
}
export default connect(mapStateToProps)(LaunchExternalResource);
