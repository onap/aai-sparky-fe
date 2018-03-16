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
import React, {Component, PropTypes} from 'react';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';

import i18n from 'utils/i18n/i18n';

const ICON_CLASS_CLOSE = 'fa fa-times';

export default class ComponentManagerContainer extends Component {

  static propType = {
    id: PropTypes.string,
    title: PropTypes.string,
    actions: PropTypes.array,
    showHeader: PropTypes.bool,
    showTitle: PropTypes.bool,
    showBorder: PropTypes.bool,
  };

  static defaultProps = {
    id: '',
    title: 'Some Title',
    actions: [],
    showHeader: true,
    showTitle: true,
    showBorder: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {
          title,
          actions,
          children,
          showHeader,
          showTitle,
          showBorder
        } = this.props;
    let buttons = [];
    actions.forEach((action) => {
      switch (action.type) {
        case 'close':
          buttons.push(
            <Button
              type='submit'
              key={action.type}
              className='close-button'
              onClick={ () => {
                action.callback(action.id);
              }}>
              <i className={ICON_CLASS_CLOSE} aria-hidden='true'></i>
            </Button>
          );
          break;
        case 'custom':
          buttons.push(
            <Button
              type='submit'
              key={action.type}
              className='custom-button'
              onClick={action.callback}>
              <i className={'fa ' + action.icon} aria-hidden='true'></i>
            </Button>
          );
          break;
      }
    });

    let containerClass = showBorder
      ? 'titled-container titled-container-boarders'
      : 'titled-container';
    let headerClass = showHeader ? 'titled-container-header' : 'hidden';
    let titleClass = showTitle ? '' : 'hidden';

    return (
      <div className={containerClass}>
        <ButtonGroup>{buttons}</ButtonGroup>
        <div className={headerClass}>
          <span className={titleClass}>{i18n(title)}</span>
        </div>
        <div className='contents'>
          {children}
        </div>
      </div>
    );
  }
}
