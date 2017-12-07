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
import FontAwesome from 'react-fontawesome';
import Button from 'react-bootstrap/lib/Button.js';
import Modal from 'react-bootstrap/lib/Modal.js';
import GlobalAutoCompleteSearchBar from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBar.jsx';
import {postAnalyticsData} from 'app/analytics/AnalyticsActions.js';
import GlobalInlineMessageBar from 'app/GlobalInlineMessageBar/GlobalInlineMessageBar.jsx';
import {getClearGlobalMessageEvent} from 'app/globalInlineMessageBar/GlobalInlineMessageBarActions.js';
import {externalUrlRequest, externalMessageRequest} from 'app/contextHandler/ContextHandlerActions.js';

import {
  Route,
  NavLink
} from 'react-router-dom';

import {
  AAI_TITLE,
  MENU_ITEM_TIER_SUPPORT,
  MENU_ITEM_VNF_SEARCH
} from './MainScreenWrapperConstants.js';

import {
  showMainMenu,
  clearExtensibleViewData,
  setSecondaryTitle
} from './MainScreenWrapperActionHelper.js';

import {clearSuggestionsTextField} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions.js';
import {changeUrlAddress} from 'utils/Routes.js';
import extensibleViews from 'resources/views/extensibleViews.json';
import {clearFilters} from 'generic-components/filterBar/FilterBarUtils.js';
const mapStateToProps = ({mainWrapper}) => {
  let {
    showMenu = false,
    toggleButtonActive = false,
    externalRequestFound = {},
    secondaryTitle = ''
  } = mainWrapper;

  return {
    showMenu,
    toggleButtonActive,
    externalRequestFound,
    secondaryTitle
  };
};


const mapActionsToProps = (dispatch) => {
  return {
    onShowMenu: () => dispatch(showMainMenu(true)),
    onHideMenu: () => {
      dispatch(showMainMenu(false));
    },
    dispatchAnalyticsData: () => dispatch(
      postAnalyticsData(document.documentElement.outerHTML.replace('\s+', ''))),
    onRouteChange: () => {
      dispatch(getClearGlobalMessageEvent());
      dispatch(clearSuggestionsTextField());
      dispatch(clearExtensibleViewData());
      dispatch(clearFilters());
      dispatch(setSecondaryTitle(undefined));
    },
    onExternalUrlRequest: (urlParamString) => {
      dispatch(externalUrlRequest(urlParamString));
    },
    onExternalMessageRecieved: (messageJson) => {
      dispatch(externalMessageRequest(messageJson));
    }
  };
};

class MainScreenHeader extends Component {
  static propTypes = {
    showMenu: React.PropTypes.bool,
    toggleButtonActive: React.PropTypes.bool,
    externalRequestFound: React.PropTypes.object,
    secondaryTitle: React.PropTypes.string
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
    if(this.props.match.params.externalUrl !== undefined &&
      this.isValidExternalURL(this.props.match.params.externalUrl)) {
      this.props.onExternalUrlRequest(this.props.match.params.externalUrl);
    }
  }
  componentWillReceiveProps(nextProps) {
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
  }

  receiveMessage(event) {
    function isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
    let messageData = event.data.message;
    if(isJson(messageData)) {
      this.props.onExternalMessageRecieved(JSON.parse(messageData));
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.receiveMessage, false);
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage);
  }

  render() {
    let {
      showMenu,
      onShowMenu,
      onHideMenu,
      toggleButtonActive,
      secondaryTitle
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

    // add Tier Support view
    menuOptions.push(
      <MenuItem key='schemaMenu' to='/schema' label={MENU_ITEM_TIER_SUPPORT}
                iconClass='button-icon view-inspect-button-icon'/>
    );

    // add VNF view
    menuOptions.push(
      <MenuItem key='vnfSearchMenu'
        to='/vnfSearch'
        label={MENU_ITEM_VNF_SEARCH}
        iconClass='button-icon vnf-search-button-icon'/>
    );

    // add all custom view menu options
    for (let view in extensibleViews) {
      menuOptions.push(
        <MenuItem key={extensibleViews[view]['viewName'] + 'Menu'} to={'/' + extensibleViews[view]['viewName']}
                  label={extensibleViews[view]['displayName']}
                  iconClass={'button-icon ' + extensibleViews[view]['iconClass']}/>
      );
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
          <span className='application-title'>{AAI_TITLE}</span>
          <GlobalAutoCompleteSearchBar history={this.props.history}/>
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
