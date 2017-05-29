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
import Button from 'react-bootstrap/lib/Button';

import i18n from 'utils/i18n/i18n';

const ICON_CLASS_MAXIMIZE = 'fa fa-chevron-down fa-lg';
const ICON_CLASS_MINIMIZE = 'fa fa-chevron-up fa-lg';

export default class TitledContainer extends Component {

  static propType = {
    title: PropTypes.string
  };

  static defaultProps = {
    title: 'Some Title'
  };

  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    let {title, children} = this.props;
    let contentsClass = this.state.isToggleOn ? 'contents' : 'hidden';
    let className = this.state.isToggleOn
      ? ICON_CLASS_MINIMIZE
      : ICON_CLASS_MAXIMIZE;
    return (
      <div className='dep-titled-container'>
        <div className='header'>
          <span className='header-title'>{i18n(title)}</span>
          <Button type='submit' className='toggle-visibility-button'
                  onClick={this.handleClick}>
            <i className={className} aria-hidden='true'/>
          </Button>
        </div>
        <div className={contentsClass}>
          {children}
        </div>
      </div>
    );
  }
}
