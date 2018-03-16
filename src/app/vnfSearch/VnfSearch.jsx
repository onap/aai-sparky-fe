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

import {
  isEqual,
  isEmpty
} from 'lodash';

import {VerticalFilterBar} from 'vertical-filter-bar';
import {CollapsibleSlidingPanel} from 'collapsible-sliding-panel';

import {setSecondaryTitle} from 'app/MainScreenWrapperActionHelper.js';
import {
  vnfActionTypes,
  VNF_TITLE,
  VNFS_ROUTE,
  VNF_SEARCH_FILTER_NAME
} from 'app/vnfSearch/VnfSearchConstants.js';

import {
  processVnfVisualizationsOnFilterChange,
  processVnfFilterPanelCollapse,
  setNotificationText,
  clearVnfSearchData
} from 'app/vnfSearch/VnfSearchActions.js';

import VnfSearchOrchStatusVisualizations from 'app/vnfSearch/VnfSearchOrchestratedStatusVisualization.jsx';
import VnfSearchProvStatusVisualizations from 'app/vnfSearch/VnfSearchProvStatusVisualization.jsx';
import VnfSearchNfTypeVisualizations from 'app/vnfSearch/VnfSearchNfTypeVisualization.jsx';
import VnfSearchNfRoleVisualizations from 'app/vnfSearch/VnfSearchNfRoleVisualization.jsx';
import VnfSearchTotalCountVisualization from 'app/vnfSearch/VnfSearchTotalCountVisualization.jsx';
import i18n from 'utils/i18n/i18n';
import {changeUrlAddress, buildRouteObjWithFilters} from 'utils/Routes.js';

import {
  FilterBarConstants,
  processFilterSelection,
  getUnifiedFilters,
  buildFilterValueMap,
  setNonConvertedFilterValues,
  setFilterSelectionsToDefaults,
  convertNonConvertedValues
} from 'filter-bar-utils';

import {
  globalInlineMessageBarActionTypes
} from 'app/globalInlineMessageBar/GlobalInlineMessageBarConstants.js';

import {
  UNIFIED_FILTERS_URL,
  filterBarActionTypes
} from 'utils/GlobalConstants.js';

const mapStateToProps = ({vnfSearch}) => {
  let {
    feedbackMsgText = '',
    feedbackMsgSeverity = '',
    vnfFilters = {},
    selectedFilterValues = {},
    vnfFilterValues = {},
    vnfVisualizationPanelClass = 'collapsible-panel-main-panel',
    unifiedFilterValues = {},
    nonConvertedFilters = {}
  } = vnfSearch;

  return {
    feedbackMsgText,
    feedbackMsgSeverity,
    vnfFilters,
    selectedFilterValues,
    vnfFilterValues,
    vnfVisualizationPanelClass,
    unifiedFilterValues,
    nonConvertedFilters
  };
};

let mapActionToProps = (dispatch) => {
  return {
    onSetViewTitle: (title) => {
      dispatch(setSecondaryTitle(title));
    },
    onInitializeVnfSearchFilters: () => {
      // first time to the page, need to get the list of available filters
      dispatch(getUnifiedFilters(UNIFIED_FILTERS_URL, VNF_SEARCH_FILTER_NAME,
        vnfActionTypes.VNF_SEARCH_FILTERS_RECEIVED, globalInlineMessageBarActionTypes.SET_GLOBAL_MESSAGE));
    },
    onFilterPanelCollapse: (isOpen) => {
      // expand/collapse the filter panel
      dispatch(processVnfFilterPanelCollapse(isOpen));
    },
    onFilterSelection: (selectedFilters, allFilters) => {
      // callback for filter bar whenever a selection is made... need to
      // convert and save the selected value(s)
      if (Object.keys(allFilters).length > 0) {
        // only process the selection if allFilters has values (possible that
        // filter bar is sending back the default filter selections before
        // we have received the list of available filters i.e. allFilters)
        dispatch(processFilterSelection(filterBarActionTypes.NEW_SELECTIONS, selectedFilters, allFilters));
      }
    },
    onFilterValueChange: (convertedFilterValues) => {
      // filter values have been converted, now update the VNF visualizations
      dispatch(processVnfVisualizationsOnFilterChange(convertedFilterValues));
    },
    onReceiveNewFilterValueParams: (filterValueString) => {
      // new filter values have been received as URL parameters, save the
      // non-converted values (later to be converted and sent to filter bar)
      // and update the VNF visualizations
      let filterValueMap =  buildFilterValueMap(filterValueString);

      dispatch(setNonConvertedFilterValues(filterBarActionTypes.SET_NON_CONVERTED_VALUES, filterValueMap));
      dispatch(processVnfVisualizationsOnFilterChange(filterValueMap));

      // incase url param was changed manually, need to update vnfFilterValues
    },
    onResetFilterBarToDefaults: (filters, filterValues) => {
      dispatch(setFilterSelectionsToDefaults(filterBarActionTypes.SET_UNIFIED_VALUES,
        filterBarActionTypes.SET_NON_CONVERTED_VALUES, filters, filterValues));
    },
    onPrepareToUnmount: () => {
      // clean things up:
      // 1- clear the VNF data
      // 2- ensure filter bar is closed
      dispatch(clearVnfSearchData());
      dispatch(processVnfFilterPanelCollapse(false));
    },
    onConvertFilterValues: (nonConvertedValues, allFilters, currentlySetFilterValues) => {
      // we have saved non-converted filter values received from URL params,
      // time to convert them so can update filter bar selections programatically
      dispatch(convertNonConvertedValues(filterBarActionTypes.SET_CONVERTED_VALUES, nonConvertedValues,
        allFilters, currentlySetFilterValues));
    },
    onMessageStateChange: (msgText, msgSeverity) => {
      dispatch(setNotificationText(msgText, msgSeverity));
    }
  };
};

class vnfSearch extends Component {
  static propTypes = {
    feedbackMsgText: React.PropTypes.string,
    feedbackSeverity: React.PropTypes.string,
    vnfFilters: React.PropTypes.object,
    selectedFilterValues: React.PropTypes.object,
    vnfFilterValues: React.PropTypes.object,
    vnfVisualizationPanelClass: React.PropTypes.string,
    unifiedFilterValues: React.PropTypes.object,
    nonConvertedFilters: React.PropTypes.object
  };

  componentWillMount() {
    this.props.onSetViewTitle(i18n(VNF_TITLE));
    this.props.onInitializeVnfSearchFilters();

    if (this.props.match &&
      this.props.match.params &&
      this.props.match.params.filters) {
      this.props.onReceiveNewFilterValueParams(this.props.match.params.filters);
    }

    if (this.props.feedbackMsgText) {
      this.props.onMessageStateChange(this.props.feedbackMsgText,
        this.props.feedbackMsgSeverity);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.feedbackMsgText && nextProps.feedbackMsgText !== this.props.feedbackMsgText) {
      this.props.onMessageStateChange(nextProps.feedbackMsgText, nextProps.feedbackMsgSeverity);
    }

    if (nextProps.vnfFilterValues && !isEqual(nextProps.vnfFilterValues, this.props.vnfFilterValues) &&
      this.props.vnfFilters) {
      this.props.onFilterValueChange(nextProps.vnfFilterValues);
      changeUrlAddress(buildRouteObjWithFilters(VNFS_ROUTE, nextProps.vnfFilterValues), this.props.history);
    }

    if (nextProps.match &&
      nextProps.match.params &&
      nextProps.match.params.filters &&
      !isEqual(nextProps.match.params.filters, this.props.match.params.filters)) {
      // added line below to reload the filters if filter changes, this will load new filters
      this.props.onInitializeVnfSearchFilters();
      this.props.onReceiveNewFilterValueParams(nextProps.match.params.filters);
    } else if (Object.keys(nextProps.nonConvertedFilters).length > 0 &&
      !isEqual(this.props.nonConvertedFilters, nextProps.nonConvertedFilters)) {
      if (Object.keys(this.props.vnfFilters).length > 0) {
        this.props.onConvertFilterValues(nextProps.nonConvertedFilters, this.props.vnfFilters,
          this.props.vnfFilterValues);
      }
    } else if ((!nextProps.match || !nextProps.match.params || !nextProps.match.params.filters) &&
      this.props.match.params.filters && this.props.vnfFilters && this.props.vnfFilterValues) {
      // VNF Search navigation button was pressed while the view is still visible ... need to reset
      // the filter bar selections to the default values
      this.props.onResetFilterBarToDefaults(this.props.vnfFilters, this.props.vnfFilterValues);
    }

    if (nextProps.vnfFilters && !isEqual(nextProps.vnfFilters, this.props.vnfFilters) &&
      Object.keys(this.props.nonConvertedFilters).length > 0) {
      // just received list of available filters and there is are nonConvertedFilters (previously
      // set from url params), need to convert those values and update the filter bar selections

      this.props.onConvertFilterValues(this.props.nonConvertedFilters, nextProps.vnfFilters,
        this.props.vnfFilterValues);

    } else if (nextProps.vnfFilters && !isEqual(nextProps.vnfFilters, this.props.vnfFilters) &&
      isEmpty(this.props.vnfFilterValues)) {
      // filter bar previously returned the default filter selections (but we didn't have the list
      // of available filters at the time, so couldn't do anything. Now receiving the list of
      // available filters, so triger the filter selection action in order to load the visualization data
      this.props.onResetFilterBarToDefaults(nextProps.vnfFilters, this.props.vnfFilterValues);
    }
  }

  componentWillUnmount() {
    // set the data to 'NO DATA' so upon return, the view is rendered with
    // no data until the request for new data is returned
    this.props.onPrepareToUnmount();
  }

  getFilterBar() {
    return (
      <VerticalFilterBar
        filtersConfig={this.props.vnfFilters}
        filterValues={this.props.unifiedFilterValues}
        filterTitle={FilterBarConstants.FILTER_BAR_TITLE}
        onFilterChange={(selectedFilters) =>
          this.props.onFilterSelection(selectedFilters, this.props.vnfFilters)} />    );
  }

  render() {
    let filterBar = this.getFilterBar();

    return (
      <div className='view-container'>
        <CollapsibleSlidingPanel
          slidingPanelClassName='collapsible-sliding-panel'
          slidingPanelClosedClassName='collapsible-sliding-panel-is-closed'
          expanderHandleClassName='collapsible-sliding-panel-expander'
          slidingPanelContent={filterBar}>
          <div className={this.props.vnfVisualizationPanelClass}>
            <VnfSearchTotalCountVisualization />
            <VnfSearchProvStatusVisualizations />
            <VnfSearchOrchStatusVisualizations />
            <VnfSearchNfTypeVisualizations />
            <VnfSearchNfRoleVisualizations />
          </div>
        </CollapsibleSlidingPanel>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(vnfSearch);
