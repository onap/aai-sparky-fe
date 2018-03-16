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
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as Extensibility from './extensibility/index.js';
import TierSupport from './tierSupport/TierSupport.jsx';
import VnfSearch from './vnfSearch/VnfSearch.jsx';
import MainScreenHeader from './MainScreenHeader.jsx';
import {decryptParamsForView, changeUrlAddress} from 'utils/Routes.js';


import {
  Route,
  HashRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';

import {
  windowResize,
  extensibleViewNetworkCallback,
  overlayNetworkCallback,
  extensibleViewMessageCallback
} from './MainScreenWrapperActionHelper.js';

import extensibleViews from 'resources/views/extensibleViews.json';

const mapStateToProps = ({mainWrapper}) => {
  let {
    showMenu = false,
    toggleButtonActive = false,
    extensibleViewNetworkCallbackData = {}
  } = mainWrapper;

  return {
    showMenu,
    toggleButtonActive,
    extensibleViewNetworkCallbackData
  };
};

const mapActionsToProps = (dispatch) => {
  return {
    onWindowSizeChange: () => dispatch(windowResize()),
    onExtensibleViewNetworkCallback: (apiUrl,body,viewName,curViewData) =>  {
      dispatch(extensibleViewNetworkCallback(apiUrl,body,viewName,curViewData));
    },
    onExtensibleViewMessageCallback: (message, messageSevirity) => {
      dispatch(extensibleViewMessageCallback(message, messageSevirity));
    },
    onOverlayNetworkCallback: (apiUrl, body, viewName, curViewData, responseEventKey) =>  {
      dispatch(overlayNetworkCallback(apiUrl, body, viewName, curViewData, responseEventKey));
    }
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

    const {
      onExtensibleViewNetworkCallback,
      extensibleViewNetworkCallbackData,
      onExtensibleViewMessageCallback,
      onOverlayNetworkCallback
    } = this.props;

    let customViewList = [];
    extensibleViews.forEach(function(view,key) {
      var renderComponent = (props) => {
        let viewParams = {};
        if(props.match.params.extensibleViewParams !== undefined) {
          viewParams = decryptParamsForView(props.match.params.extensibleViewParams);
        }

        if (Extensibility.default.hasOwnProperty(view.componentName)) {
          let Component = Extensibility.default[view.componentName];
          return (
            <Component
              {...props}
              networkingCallback={(apiUrl, body, paramName, curViewData) => {
                onExtensibleViewNetworkCallback(apiUrl, body, paramName, curViewData);
              }}
              overlayCallback={(apiUrl, body, paramName, curOverlayData,responseEventKey) => {
                onOverlayNetworkCallback(apiUrl, body, paramName, curOverlayData, responseEventKey);
              }}
              messagingCallback ={(message, messageSeverity) => {
                onExtensibleViewMessageCallback(message, messageSeverity);
              }}
              changeRouteCallback = {(routeParam, historyObj) => {
                changeUrlAddress(routeParam, historyObj);
              }}
              viewName={view.displayName}
              viewData={extensibleViewNetworkCallbackData}
              viewParams={viewParams}/>
          );
        }
      };

      customViewList.push(
          <Route key={extensibleViews[key]['viewName'] + 'Route'} path={'/' + extensibleViews[key]['viewName'] + '/:extensibleViewParams?' }
             render={renderComponent}/>
      );
    });

    return (
      <Router>
        <div className='main-app-container'>
          <Switch>
            <Redirect from='/' exact to='/schema'/>
          </Switch>
          <Route key='MainScreenHeaderRoute' path='/:externalUrl?' component={MainScreenHeader}/>
          <Route key='TierSupportRoue' path='/schema/:viParam?' component={TierSupport}/>
          <Route key='VnfSearchRoute' path='/vnfSearch/:filters?' component={VnfSearch}/>
          {customViewList}
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(MainScreenWrapper);
