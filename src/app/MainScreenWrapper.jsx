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

import React, {Component} from 'react';
import {connect} from 'react-redux';

import TierSupport from './tierSupport/TierSupport.jsx';
import VnfSearch from './vnfSearch/VnfSearch.jsx';
import MainScreenHeader from './MainScreenHeader.jsx';

import DynamicViewLoader from
  'generic-components/dynamicViewLoader/DynamicViewLoader.jsx';

import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';

import {
  windowResize
} from './MainScreenWrapperActionHelper.js';

import customViews from 'resources/views/customViews.json';

const mapStateToProps = ({mainWrapper}) => {
  let {
        showMenu = false,
        toggleButtonActive = false
      } = mainWrapper;

  return {
    showMenu,
    toggleButtonActive
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    onWindowSizeChange: () => dispatch(windowResize())
  };
};

class MainScreenWrapper extends Component {

  constructor() {
    super();
    window.addEventListener('resize', () => {
      this.props.onWindowSizeChange();
    });
  }

  render() {
    let customViewList = [];

    // add all custom views
    for (let view in customViews) {
      customViewList.push(
        <Route path={'/' + customViews[view]['viewName']}
               component={DynamicViewLoader}/>
      );
    }

    return (
      <Router>
        <div>
          <Switch>
            <Redirect from='/' exact to='/viewInspect'/>
          </Switch>
          <Route path='/' component={MainScreenHeader}/>
          <Route path='/viewInspect/:viParam?' component={TierSupport}/>
          <Route path='/vnfSearch/:vnfParam?' component={VnfSearch}/>
          {customViewList}
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(MainScreenWrapper);
