/*
 * ============LICENSE_START===================================================
 * SPARKY (AAI UI service)
 * ============================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ============================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=====================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

import React, {Component, PropTypes} from 'react';
import FontAwesome from 'react-fontawesome';
import InlineMessageConstatns from './InlineMessageConstants';

import Alert from 'react-bootstrap/lib/Alert';

export default class InlineMessage extends Component {

  static propType = {
    level: PropTypes.string,
    messageTxt: PropTypes.string
  };

  static defaultProps = {
    level: '',
    messageTxt: ''
  };

  render() {
    let {level, messageTxt} = this.props;
    let fontawesomeClassName;
    //Select the font based on the severity level
    switch (level) {
      case 'success':
        fontawesomeClassName = InlineMessageConstatns.SUCCESS_CLASSNAME;
        break;
      case 'warning':
        fontawesomeClassName = InlineMessageConstatns.WARNING_CLASSNAME;
        break;
      case 'danger':
        fontawesomeClassName = InlineMessageConstatns.DANGER_CLASSNAME;
        break;
      default:
        fontawesomeClassName = InlineMessageConstatns.DEFAULT_CLASSNAME;
        break;

    }

    if (messageTxt && messageTxt.length > 0) {
      return (
        <Alert bsStyle={level}
               className={InlineMessageConstatns.ALERT_PANEL_CLASSNAME}>
          <div className={InlineMessageConstatns.NOTIFICATION_PANEL_CLASSNAME}>
            <div className={InlineMessageConstatns.ICON_PANEL_CLASSNAME}>
              <FontAwesome className={fontawesomeClassName}
                           name={fontawesomeClassName}/>
            </div>
            <div className={InlineMessageConstatns.MESSAGE_PANEL_CLASSNAME}>
              {messageTxt}
            </div>
          </div>
        </Alert>
      );
    } else {
      return false;
    }

  }
}
