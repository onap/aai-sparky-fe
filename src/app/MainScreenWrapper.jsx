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
  getConfigurableViewConfigs,
  setCustomRoutes
} from 'app/configurableViews/ConfigurableViewActions.js';
import {isEmpty} from 'lodash';
import {genericRequest} from 'app/networking/NetworkCalls.js';
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
import customComponentConfig from 'resources/views/customComponents.json';
import { newCustomComponentsEvent } from 'app/configurableViews/ConfigurableViewActions.js';
import {
  getConfigurableRoutes
} from 'app/configurableViews/ConfigurableViewManager.js';

import {
  getConfiguredComponentList
} from 'app/configurableViews/index.js';

const mapStateToProps = ({mainWrapper, configurableViews}) => {
  let {
    showMenu = false,
    toggleButtonActive = false,
    extensibleViewNetworkCallbackData = {}
  } = mainWrapper;

  let {
    configurableViewsConfig = {},
    customComponents = {},
    customRoutes = []
  } = configurableViews;

  return {
    showMenu,
    toggleButtonActive,
    extensibleViewNetworkCallbackData,
    configurableViewsConfig,
    customComponents,
    customRoutes
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
    },
    onConfigurableViewsInitialLoad: (components) => {
      dispatch(newCustomComponentsEvent(components));
    },
    onFetchCustomViews: () => {
      dispatch(getConfigurableViewConfigs());
    },
    onSetCustomRoutes: (routes) => {
      dispatch(setCustomRoutes(routes));
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

  componentDidMount() {
    // fetch custom views
    this.props.onFetchCustomViews();

    // fetch custom components
    let components = getConfiguredComponentList(customComponentConfig);
    this.props.onConfigurableViewsInitialLoad(components);
  }

  componentDidUpdate(prevProps) {
    if ((Object.keys(this.props.customComponents).length > 0 &&
      Object.keys(this.props.configurableViewsConfig).length > 0) &&
      ((JSON.stringify(prevProps.configurableViewsConfig) !== JSON.stringify(this.props.configurableViewsConfig)) ||
      (JSON.stringify(prevProps.customComponents) !== JSON.stringify(this.props.customComponents)))) {
      // we have both config and components populated and one was just set
      let customRoutes = getConfigurableRoutes(this.props.configurableViewsConfig, this.props.customComponents);
      this.props.onSetCustomRoutes(customRoutes);
    }
  }

  render() {

    const {
      onExtensibleViewNetworkCallback,
      extensibleViewNetworkCallbackData,
      onExtensibleViewMessageCallback,
      onOverlayNetworkCallback,
      configurableViewsConfig,
      customComponents,
      customRoutes
    } = this.props;

    let customViewList = [];
    extensibleViews.forEach(function(view,key) {

      let path = '', extKey = '';
      if(isEmpty(extensibleViews[key]['viewParams'])){
        path = '/' + view.viewName + '/:extensibleViewParams?';
        extKey = view.viewName + 'Route';
      } else {
        path = '/' + view.viewName  + view.viewParams;
        extKey = view.viewName + view.viewParams + 'Route';
      }

      var renderComponent = (props) => {
        let viewParams = {};
        if(isEmpty(extensibleViews[key]['viewParams']) && props.match.params.extensibleViewParams !== undefined) {
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
              networkingCallbackPromise = {(url, relativeURL, httpMethodType) => {
                return genericRequest(url, relativeURL, httpMethodType);
              }}
              viewName={view.displayName}
              viewData={extensibleViewNetworkCallbackData}
              viewParams={viewParams}/>
          );
        }
      };
      if(isEmpty(extensibleViews[key]['isExact']) && !extensibleViews[key]['isExact']){
        customViewList.push(
          <Route key={extKey} path={path} render={renderComponent}/>
        );
      } else {
        customViewList.push(
          <Route key={extKey} exact path={path} render={renderComponent}/>
        );
      }

    });

    let configurableViewList = getConfigurableRoutes(configurableViewsConfig, customComponents);

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
          {customRoutes}
          {configurableViewList}
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(MainScreenWrapper);
