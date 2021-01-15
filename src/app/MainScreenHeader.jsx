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
import { PropTypes } from 'prop-types';
import {connect} from 'react-redux';
import FontAwesome from 'react-fontawesome';
import {clearFilters} from 'filter-bar-utils';
import Button from 'react-bootstrap/lib/Button.js';
import Modal from 'react-bootstrap/lib/Modal.js';
import {postAnalyticsData, getStoreAnalyticsPayload} from 'app/analytics/AnalyticsActions.js';
import GlobalInlineMessageBar from 'app/globalInlineMessageBar/GlobalInlineMessageBar.jsx';
import {getClearGlobalMessageEvent} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {externalUrlRequest, externalMessageRequest, getSubscriptionPayload} from 'app/contextHandler/ContextHandlerActions.js';
import { getConfigurableViewConfigs } from 'app/configurableViews/ConfigurableViewActions.js';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import axios from 'axios';
import {BASE_URL} from 'app/networking/NetworkConstants.js';

import {
  filterBarActionTypes,
  ENVIRONMENT
} from 'utils/GlobalConstants.js';

import {
  Route,
  NavLink
} from 'react-router-dom';

import {
  AAI_TOP_LEFT_HEADER,
  AAI_HTML_TITLE,
  AAI_APERTURE_SERVICE,
  AAI_LOADTEMPLATE_MAX_COUNT
} from './MainScreenWrapperConstants.js';

import {
  showMainMenu,
  clearExtensibleViewData,
  setSecondaryTitle
} from './MainScreenWrapperActionHelper.js';

import {clearSuggestionsTextField} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions.js';
import {changeUrlAddress} from 'utils/Routes.js';
import defaultViews from 'resources/views/defaultViews.json';
import defaultViews_onap from 'resources/views/defaultViews_onap.json';
import {getPersonalizationDetails} from 'app/personlaization/PersonalizationActions.js';
import {isEmpty} from 'lodash';

let INVLIST = GlobalExtConstants.INVLIST;

const mapStateToProps = ({mainWrapper, configurableViews}) => {
  let {
    showMenu = false,
    toggleButtonActive = false,
    externalRequestFound = {},
    secondaryTitle = '',
    subscriptionPayload = {},
    subscriptionEnabled = false,
    aaiTopLeftPersonalizedHeader = AAI_TOP_LEFT_HEADER,
    aaiPersonalizedHtmlDocumentTitle = AAI_HTML_TITLE,
    aaiPersonalizedApertureService = AAI_APERTURE_SERVICE,
    aaiPersonalizedLoadTemplateMaxCount = AAI_LOADTEMPLATE_MAX_COUNT
  } = mainWrapper;

  let {
    configurableViewsConfig
  } = configurableViews;

  return {
    showMenu,
    toggleButtonActive,
    externalRequestFound,
    secondaryTitle,
    subscriptionPayload,
    subscriptionEnabled,
    configurableViewsConfig,
    aaiTopLeftPersonalizedHeader,
    aaiPersonalizedHtmlDocumentTitle,
    aaiPersonalizedApertureService,
    aaiPersonalizedLoadTemplateMaxCount
  };
};


const mapActionsToProps = (dispatch) => {
  return {
    onShowMenu: () => dispatch(showMainMenu(true)),
    onHideMenu: () => {
      dispatch(showMainMenu(false));
    },
    dispatchAnalyticsData: () => dispatch(
      postAnalyticsData(getStoreAnalyticsPayload())),
    onRouteChange: () => {
      dispatch(getClearGlobalMessageEvent());
      dispatch(clearSuggestionsTextField());
      dispatch(clearExtensibleViewData());
      dispatch(clearFilters(filterBarActionTypes.CLEAR_FILTERS));
      dispatch(setSecondaryTitle(undefined));
    },
    onExternalUrlRequest: (urlParamString) => {
      dispatch(externalUrlRequest(urlParamString));
    },
    onExternalMessageRecieved: (messageJson) => {
      dispatch(externalMessageRequest(messageJson));
    },
    onGetSubscriptionPayload: () => {
      dispatch(getSubscriptionPayload());
    },
    onFetchCustomViews: () => {
      dispatch(getConfigurableViewConfigs());
    },
    onGetPersonalizationValues: () => {
      dispatch(getPersonalizationDetails());
    }
  };
};

class MainScreenHeader extends Component {
  static propTypes = {
    showMenu: PropTypes.bool,
    toggleButtonActive: PropTypes.bool,
    externalRequestFound: PropTypes.object,
    secondaryTitle: PropTypes.string,
    subscriptionPayload: PropTypes.object,
    aaiTopLeftPersonalizedHeader: PropTypes.string,
    aaiPersonalizedHtmlDocumentTitle: PropTypes.string,
    aaiPersonalizedApertureService: PropTypes.bool,
    aaiPersonalizedLoadTemplateMaxCount: PropTypes.string
  };

  navigationLinkAndCurrentPathMatch(location, to) {
    let linkPathElements = to.split('/');
    let locationElements = location.pathname.split('/');

    // the element arrays above will have the route at index 1 ... need to
    // verify if the routes match
    return locationElements[1] === linkPathElements[1];
  }

  hasRouteChanged(currentPath, nextPath) {
    let currentPathParts = currentPath.split('/');
    let nextPathParts = nextPath.split('/');

    if (currentPathParts[1] !== nextPathParts[1]) {
      return true;
    } else {
      return false;
    }
  }

  isValidExternalURL(url) {
    if(decodeURIComponent(url).indexOf('&') > 0 ) {
      return true;
    } else {
      return false;
    }
  }

  componentWillMount() {
    this.props.onGetPersonalizationValues();
    this.props.onGetSubscriptionPayload();
    if(this.props.match.params.externalUrl !== undefined &&
      this.isValidExternalURL(this.props.match.params.externalUrl)) {
      this.props.onExternalUrlRequest(this.props.match.params.externalUrl);
    }
    sessionStorage.setItem(ENVIRONMENT + 'ENABLE_ANALYSIS', true);
    var portalInfoPath = BASE_URL + '/portal/info';
    //portalInfoPath = 'https://localhost:8000/portal/info';
    axios.get(portalInfoPath).then(res => {
      console.log('res:' + res.data);
      var roles = [];
      if(res.status === 200){
        if(res.data.status && (res.data.status !== '200')){
          this.setDefaultCredentials(res.data);
        }else{
          sessionStorage.setItem(ENVIRONMENT + 'userId', res.data.attuid);
          for(var i = 0; i < res.data.role.length; i++){
            roles.push(res.data.role[i].name);
          }
          sessionStorage.setItem(ENVIRONMENT + 'roles', roles);
        }
      }else{
        this.setDefaultCredentials(res.data);
      }
    }, error=>{
      this.setDefaultCredentials(error);
    }).catch(error => {
      this.setDefaultCredentials(error);
    });
  }

  setDefaultCredentials = (error) =>{
    console.log('MainScreenHeader.jsx :: Issue retrieving portal info from sparky backend, setting default, details - ' + JSON.stringify(error));
    sessionStorage.setItem(ENVIRONMENT + 'userId', 'default_uid');
    var roles = ['ui_view'];
    sessionStorage.setItem(ENVIRONMENT + 'roles', roles);
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.aaiPersonalizedHtmlDocumentTitle)) {
      if(!sessionStorage.getItem(ENVIRONMENT + 'PAGE_TITLE') || sessionStorage.getItem(ENVIRONMENT + 'PAGE_TITLE') !== nextProps.aaiPersonalizedHtmlDocumentTitle) {
        sessionStorage.setItem(ENVIRONMENT + 'PAGE_TITLE', nextProps.aaiPersonalizedHtmlDocumentTitle);
      }
      document.title = nextProps.aaiPersonalizedHtmlDocumentTitle;
    } else {
      document.title = AAI_HTML_TITLE;
    }
    //Added for APERTURE Service Enable/Disable
    if(!sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE') || JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE')) !== nextProps.aaiPersonalizedApertureService) {
      if(JSON.parse(sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE')) !== nextProps.aaiPersonalizedApertureService){
        sessionStorage.setItem(ENVIRONMENT + 'APERTURE_SERVICE', Boolean(nextProps.aaiPersonalizedApertureService));
        if(nextProps.aaiPersonalizedApertureService){
          sessionStorage.setItem(ENVIRONMENT + 'ENABLE_ANALYSIS', true);
        }else{
          sessionStorage.setItem(ENVIRONMENT + 'ENABLE_ANALYSIS', false);
        }
      }else{
        sessionStorage.setItem(ENVIRONMENT + 'APERTURE_SERVICE', Boolean(nextProps.aaiPersonalizedApertureService));
      }     
    }
    if(!sessionStorage.getItem(ENVIRONMENT + 'APERTURE_SERVICE')){
      sessionStorage.setItem(ENVIRONMENT + 'ENABLE_ANALYSIS', false);
    }
    if(!sessionStorage.getItem(ENVIRONMENT + 'LOADTEMPLATE_MAX_COUNT') || sessionStorage.getItem(ENVIRONMENT + 'LOADTEMPLATE_MAX_COUNT') !== nextProps.aaiPersonalizedLoadTemplateMaxCount) {
      sessionStorage.setItem(ENVIRONMENT + 'LOADTEMPLATE_MAX_COUNT', nextProps.aaiPersonalizedLoadTemplateMaxCount);
    }
    if (this.props.location &&
      this.props.location.pathname !==
      nextProps.location.pathname) {
      // update analytics
      this.props.dispatchAnalyticsData();

      if (this.hasRouteChanged(this.props.location.pathname,
          nextProps.location.pathname)) {
        this.props.onRouteChange();
      }
    }

    if(nextProps.match.params.externalUrl !== undefined &&
      nextProps.match.params.externalUrl !== this.props.match.params.externalUrl &&
      this.isValidExternalURL(nextProps.match.params.externalUrl)) {
      this.props.onExternalUrlRequest(nextProps.match.params.externalUrl);
    }
    /* if the externalURL is not valid, we do not add any message as other proper
     views will get that messages since the route will be this parameter.*/

    if(this.props.externalRequestFound !== nextProps.externalRequestFound &&
      nextProps.externalRequestFound !== undefined && nextProps.externalRequestFound.suggestion !== undefined) {
      changeUrlAddress(nextProps.externalRequestFound.suggestion, nextProps.history);
    }

    if (nextProps.subscriptionEnabled) {
      if (nextProps.subscriptionPayload !== this.props.subscriptionPayload &&
        Object.keys(nextProps.subscriptionPayload).length > 0) {
        var getWindowUrl = function (url) {
          var split = url.split('/');
          return split[0] + '//' + split[2];
        };
        window.parent.postMessage(
          JSON.stringify(nextProps.subscriptionPayload),
          getWindowUrl(document.referrer));
      }
    }
  }

  receiveMessage(event, $this) {
    function isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
    if(isJson(event.data)) {
      let messageData = JSON.parse(event.data);
      if(isJson(messageData.message)) {
        $this.props.onExternalMessageRecieved(messageData.message);
      }
    }

  }
  componentDidMount() {
    //TODO Move this logic to the component will receive props.
    //Check if the event lister is available and if the subscription is
    // enabled before registering for it
    if(document.referrer) {
      var $this = this;
      window.addEventListener('message', function (e) {
        $this.receiveMessage(e, $this);
      }, false);
    }

    // fetch custom views
    this.props.onFetchCustomViews();
  }

  componentWillUnmount() {
    if(this.props.subscriptionEnabled) {
      var $this = this;
      window.removeEventListener('message', function (e) {
        $this.receiveMessage(e, $this);
      });
    }
  }

  render() {
    let {
      showMenu,
      onShowMenu,
      onHideMenu,
      toggleButtonActive,
      secondaryTitle,
      configurableViewsConfig,
      aaiTopLeftPersonalizedHeader
    } = this.props;

    let menuOptions = [];

    const MenuItem = ({label, iconClass, to}) => (
      <Route path={to} children={({location}) => (
        <NavLink to={to} onClick={onHideMenu}>
          <div className={this.navigationLinkAndCurrentPathMatch(location, to) ? 'main-menu-button-active' : 'main-menu-button'}>
            <div className={iconClass}/>
            <div className='button-icon'>{label}</div>
          </div>
        </NavLink>
      )}/>
    );

    const ConfigurableMenuItem = ({label, to}) => (
      <Route path={to} children={({location}) => (
        <NavLink to={to} onClick={onHideMenu}>
          <div className={this.navigationLinkAndCurrentPathMatch(location, to) ?
            'main-menu-button-active' : 'main-menu-button'}>
            <div className='button-icon configurable-view-button-icon'/>
            <div className='button-icon'>{label}</div>
          </div>
        </NavLink>
      )}/>
    );

    let dv = defaultViews;
    if(INVLIST.IS_ONAP){
        dv = defaultViews_onap;
    }

    // add all default view menu options
    for (let view in dv) {
      let shouldDisplayIcon = false;
      if(dv[view]['onlyRoute'] === undefined){
        shouldDisplayIcon = true;
      } else if(dv[view]['onlyRoute'] === false){
        shouldDisplayIcon = true;
      }
      if(shouldDisplayIcon === true){
        menuOptions.push(
          <MenuItem key={dv[view]['viewName'] + 'Menu'} to={'/' + dv[view]['viewName']}
                    label={dv[view]['displayName']}
                    iconClass={'button-icon ' + dv[view]['iconClass']}/>
        );
      }
    }

    if (configurableViewsConfig && configurableViewsConfig.layouts) {
      for (let configurableView in configurableViewsConfig.layouts) {
        menuOptions.push(
          <ConfigurableMenuItem key={configurableViewsConfig.layouts[configurableView]['id'] + 'Menu'} to={'/' + configurableViewsConfig.layouts[configurableView]['id']}
                                label={configurableViewsConfig.layouts[configurableView]['title']}/>
        );
      }
    }

    let secondaryTitleClass = 'secondary-header';
    if (secondaryTitle === undefined || secondaryTitle === '') {
      secondaryTitleClass = secondaryTitleClass + ' hidden';
    }

    return (
      <div className='header'>
        <div>
          <Button
            bsClass={(toggleButtonActive)
              ? 'toggle-view-button-active'
              : 'toggle-view-button'}
            onClick={onShowMenu}>
            <FontAwesome name='bars'/>
          </Button>
          <Modal show={showMenu} onHide={onHideMenu}
                 dialogClassName='modal-main-menu'>
            <Modal.Body>
              {menuOptions}
            </Modal.Body>
          </Modal>
          <span className='application-title'>{aaiTopLeftPersonalizedHeader}</span>
        </div>
        <GlobalInlineMessageBar />
        <div className={secondaryTitleClass}>
          <span className='secondary-title'>{secondaryTitle}</span>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(MainScreenHeader);
