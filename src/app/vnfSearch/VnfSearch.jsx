/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017 Amdocs
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
 *
 * ECOMP is a trademark and service mark of AT&T Intellectual Property.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  VNF_TITLE,
  VNFS_ROUTE,
  DEFAULT_VNFS_SEARCH_HASH
} from 'app/vnfSearch/VnfSearchConstants.js';
import {
  processTotalVnfVisualizationOnSearchChange,
  processOrchStatusVisualizationOnSearchChange,
  processProvStatusVisualizationOnSearchChange,
  setNotificationText
} from 'app/vnfSearch/VnfSearchActions.js';
import VnfSearchOrchStatusVisualizations from 'app/vnfSearch/VnfSearchOrchestratedStatusVisualization.jsx';
import VnfSearchProvStatusVisualizations from 'app/vnfSearch/VnfSearchProvStatusVisualization.jsx';
import VnfSearchTotalCountVisualization from 'app/vnfSearch/VnfSearchTotalCountVisualization.jsx';
import i18n from 'utils/i18n/i18n';
import {changeUrlAddress, buildRouteObj} from 'utils/Routes.js';

const mapStateToProps = ({vnfSearch}) => {
  let {
        feedbackMsgText = '',
        feedbackMsgSeverity = ''
      } = vnfSearch;

  return {
    feedbackMsgText,
    feedbackMsgSeverity
  };
};

let mapActionToProps = (dispatch) => {
  return {
    onReceiveNewParams: (vnfParam) => {
      dispatch(processTotalVnfVisualizationOnSearchChange(vnfParam));
      dispatch(processOrchStatusVisualizationOnSearchChange(vnfParam));
      dispatch(processProvStatusVisualizationOnSearchChange(vnfParam));
    },
    onMessageStateChange: (msgText, msgSeverity) => {
      dispatch(setNotificationText(msgText, msgSeverity));
    }
  };
};

class vnfSearch extends Component {
  componentWillMount() {
    if (this.props.match &&
      this.props.match.params &&
      this.props.match.params.vnfParam) {
      this.props.onReceiveNewParams(this.props.match.params.vnfParam);
    } else {
      // render using default search params (hash for "VNFs")
      this.props.onReceiveNewParams(DEFAULT_VNFS_SEARCH_HASH);
      changeUrlAddress(buildRouteObj(VNFS_ROUTE, DEFAULT_VNFS_SEARCH_HASH),
        this.props.history);
    }

    if (this.props.feedbackMsgText) {
      this.props.onMessageStateChange(this.props.feedbackMsgText,
        this.props.feedbackMsgSeverity);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.vnfParam) {
      if (nextProps.match.params.vnfParam !==
        this.props.match.params.vnfParam) {
        this.props.onReceiveNewParams(nextProps.match.params.vnfParam);
      }
    } else if (this.props.match.params.vnfParam) {
      // currently on VNF page and somebody has clicked the VNF NavLink
      // want to reload the view with the default params (hash for "NFVs")
      this.props.onReceiveNewParams(DEFAULT_VNFS_SEARCH_HASH);
      changeUrlAddress(buildRouteObj(VNFS_ROUTE, DEFAULT_VNFS_SEARCH_HASH),
        this.props.history);
    }

    if (nextProps.feedbackMsgText &&
      nextProps.feedbackMsgText !==
      this.props.feedbackMsgText) {
      this.props.onMessageStateChange(nextProps.feedbackMsgText,
        nextProps.feedbackMsgSeverity);
    }
  }

  componentWillUnmount() {
    // resetting to default params so on relaunch there will be no
    // visibility of old searches
    this.props.onReceiveNewParams(DEFAULT_VNFS_SEARCH_HASH);
  }

  render() {
    return (
      <div>
        <div className='secondary-header'>
          <span className='secondary-title'>{i18n(VNF_TITLE)}</span>
        </div>
        <VnfSearchTotalCountVisualization />
        <VnfSearchProvStatusVisualizations />
        <VnfSearchOrchStatusVisualizations />
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(vnfSearch);
