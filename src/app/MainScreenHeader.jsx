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
import {getClearGlobalMessageEvent} from 'app/GlobalInlineMessageBar/GlobalInlineMessageBarActions.js';

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
  showMainMenu
} from './MainScreenWrapperActionHelper.js';

import {clearSuggestionsTextField} from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarActions.js';

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
    onShowMenu: () => dispatch(showMainMenu(true)),
    onHideMenu: () => {
      dispatch(showMainMenu(false));
    },
    dispatchAnalyticsData: () => dispatch(
      postAnalyticsData(document.documentElement.outerHTML.replace('\s+', ''))),
    onRouteChange: () => {
      dispatch(getClearGlobalMessageEvent());
      dispatch(clearSuggestionsTextField());
    }
  };
};

class MainScreenHeader extends Component {
  static propTypes = {
    showMenu: React.PropTypes.bool,
    toggleButtonActive: React.PropTypes.bool
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

  componentWillReceiveProps(nextProps) {
    if (this.props.location &&
      this.props.location.pathname !== nextProps.location.pathname) {
      // update analytics
      this.props.dispatchAnalyticsData();

      if (this.hasRouteChanged(this.props.location.pathname,
          nextProps.location.pathname)) {
        this.props.onRouteChange();
      }
    }
  }

  render() {
    let {
          showMenu,
          onShowMenu,
          onHideMenu,
          toggleButtonActive
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
      <MenuItem to='/viewInspect' label={MENU_ITEM_TIER_SUPPORT}
                iconClass='button-icon view-inspect-button-icon'/>
    );

    // add VNF view
    // 2172a3c25ae56e4995038ffbc1f055692bfc76c0b8ceda1205bc745a9f7a805d is
    // the hash for 'VNFs' ... ensures VNF Search screen defaults to the
    // aggregate VNF results
    menuOptions.push(
      <MenuItem
        to='/vnfSearch/2172a3c25ae56e4995038ffbc1f055692bfc76c0b8ceda1205bc745a9f7a805d'
        label={MENU_ITEM_VNF_SEARCH}
        iconClass='button-icon vnf-search-button-icon'/>
    );

    // add all custom view menu options
    for (let view in customViews) {
      menuOptions.push(
        <MenuItem to={customViews[view]['viewName']}
                  label={customViews[view]['displayName']}
                  iconClass='button-icon inventory-button-icon'/>
      );
    }

    return (
      <div>
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
        </div>
      </div>

    );
  }
}

export default connect(mapStateToProps, mapActionsToProps)(MainScreenHeader);
