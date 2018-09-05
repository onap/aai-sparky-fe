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

import DateRangeSelector from 'generic-components/dateRangeSelector/DateRangeSelector.jsx';
import ComponentManager from 'generic-components/componentManager/ComponentManager.jsx';
import {DYNAMIC_VIEW_LOADER_TITLE} from 'generic-components/dynamicViewLoader/DynamicViewLoaderConstants.js';
import {processLayoutSourceChange} from 'generic-components/dynamicViewLoader/DynamicViewLoaderActions.js';
import {visualizationProviderProperties} from 'generic-components/dynamicViewLoader/VisualizationProvider.js';
import {LAYOUT_STATIC} from 'generic-components/componentManager/ComponentManagerConstants.js';

import i18n from 'utils/i18n/i18n';
import customViews from 'resources/views/customViews.json';

const mapStateToProps =
        ({dynamicViewReducer: {dynamicViewLoadData}}) => {
          let {
                viewTitle = i18n(DYNAMIC_VIEW_LOADER_TITLE),
                layoutSource = {}
              } = dynamicViewLoadData;

          return {
            viewTitle,
            layoutSource
          };
        };

let mapActionToProps = (dispatch) => {
  return {
    onLayoutSourceChange: (layoutSource) => {
      dispatch(processLayoutSourceChange(layoutSource));
    }
  };
};

class DynamicViewLoader extends Component {
  static propTypes = {
    viewTitle: PropTypes.string,
    layoutSource: PropTypes.object
  };

  componentWillMount() {
    let viewName = this.props.location.pathname.split('/');

    for (let view in customViews) {
      if (customViews[view]['viewName'] === viewName[1]) {
        this.props.onLayoutSourceChange(customViews[view]['layoutProperties']);
      }
    }
  }

  render() {
    let {viewTitle, layoutSource} = this.props;

    return (
      <div>
        <div className='secondary-header'>
          <span className='secondary-title'>
            {viewTitle}
          </span>
          <DateRangeSelector />
        </div>
        <ComponentManager
          componentPropertiesProvider={visualizationProviderProperties}
          layoutType={LAYOUT_STATIC}
          layoutFormat={layoutSource}
          showHeader={true}
          showTitle={true}
          showBorder={false}/>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(DynamicViewLoader);
