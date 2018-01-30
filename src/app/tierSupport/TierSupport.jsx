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
import SplitPane from 'react-split-pane';
import { ClipLoader } from 'react-spinners';
import {COLOR_BLUE} from 'utils/GlobalConstants.js';

import {setSecondaryTitle} from 'app/MainScreenWrapperActionHelper.js';
import ForceDirectedGraph from 'generic-components/graph/ForceDirectedGraph.jsx';
import SelectedNodeDetails from 'app/tierSupport/selectedNodeDetails/SelectedNodeDetails.jsx';


import overlaysDetails from 'resources/overlays/overlaysDetails.json';
import * as Overlays from 'app/overlays/OverlayImports.js';

import i18n from 'utils/i18n/i18n';
import {
  onNodeDetailsChange,
  onNodeMenuChange,
  splitPaneResize,
  querySelectedNodeElement,
  setNotificationText,
  clearVIData
} from 'app/tierSupport/TierSupportActions.js';
import {
  TSUI_TITLE,
  TSUI_NODE_DETAILS_INITIAL_WIDTH,
  TSUI_NODE_DETAILS_MIN_WIDTH,
  TSUI_GRAPH_MENU_NODE_DETAILS,
} from './TierSupportConstants.js';

let mapStateToProps = (
  {
    tierSupport:
      {
        tierSupportReducer,
        globalAutoCompleteSearchBar
      }
  }) => {

  let {
        forceDirectedGraphRawData = {
          graphCounter: -1,
          nodeDataArray: [],
          linkDataArray: [],
          graphMeta: {}
        }, windowWidth = 500,
        windowHeight = 500,
        graphNodeSelectedMenu = TSUI_GRAPH_MENU_NODE_DETAILS,
        feedbackMsgText = '',
        feedbackMsgSeverity = '',
        nodeData = {},
        enableBusyFeedback = false
      } = tierSupportReducer;

  let {
        performPrepareVisualization = false,
        selectedSuggestion = {}
      } = globalAutoCompleteSearchBar;
  return {
    forceDirectedGraphRawData,
    windowWidth,
    windowHeight,
    graphNodeSelectedMenu,
    performPrepareVisualization,
    selectedSuggestion,
    feedbackMsgText,
    feedbackMsgSeverity,
    nodeData,
    enableBusyFeedback
  };
};

let mapActionToProps = (dispatch) => {
  return {
    onSetViewTitle: (title) => {
      dispatch(setSecondaryTitle(title));
    },
    onNodeSelected: (requestObject) => {
      dispatch(onNodeDetailsChange(requestObject));
    },
    onNodeMenuSelect: (selectedMenu) => {
      dispatch(onNodeMenuChange(selectedMenu.buttonId));
    },
    onSplitPaneResize: (initialLoad) => {
      dispatch(splitPaneResize(initialLoad));
    },
    onNewVIParam: (param) => {
      dispatch(querySelectedNodeElement(param));
    },
    onMessageStateChange: (msgText, msgSeverity) => {
      dispatch(setNotificationText(msgText, msgSeverity));
    },
    onRequestClearData: () => {
      dispatch(clearVIData());
    }
  };
};

class TierSupport extends Component {
  static propTypes = {
    forceDirectedGraphRawData: React.PropTypes.object,
    windowWidth: React.PropTypes.number,
    windowHeight: React.PropTypes.number,
    graphNodeSelectedMenu: React.PropTypes.string,
    feedbackMsgText: React.PropTypes.string,
    feedbackMsgSeverity: React.PropTypes.string,
    nodeData: React.PropTypes.object,
    enableBusyFeedback: React.PropTypes.bool
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.viParam &&
      nextProps.match.params.viParam !==
      this.props.match.params.viParam) {
      this.props.onNewVIParam(nextProps.match.params.viParam);
    }
    if(nextProps.match.params.viParam && nextProps.match.params.viParam !==
      this.props.match.params.viParam) {
      this.props.onRequestClearData();
    }

    if (nextProps.feedbackMsgText !== this.props.feedbackMsgText) {
      this.props.onMessageStateChange(nextProps.feedbackMsgText,
        nextProps.feedbackMsgSeverity);
    }
  }

  componentWillMount() {
    this.props.onSetViewTitle(i18n(TSUI_TITLE));
    if (this.props.match.params.viParam) {
      this.props.onNewVIParam(this.props.match.params.viParam);
    } else {
      this.props.onRequestClearData();
    }
  }

  componentDidMount() {
    this.props.onSplitPaneResize(true);
  }

  componentWillUnmount() {
    // resetting to default (empty screen)
    this.props.onRequestClearData();
  }

  render() {

    const {
            forceDirectedGraphRawData,
            onNodeSelected,
            windowWidth,
            windowHeight,
            onSplitPaneResize,
            onNodeMenuSelect,
            enableBusyFeedback
          } = this.props;

    let componentVisibitliyClassName = 'showContainer';
    if(enableBusyFeedback){
      componentVisibitliyClassName = 'hideContainer';
    }
    let availableOverlay;
    let overlayComponent;
    // Currently only ONE overlay can be added to each view.
    // todo: need to make it array if more than one overlay can be used. No need now.
    overlaysDetails.forEach(function(overlay){
      if(overlay.view === 'schema') {
        availableOverlay = overlay.key;
        overlayComponent = overlay.componentName;
      }
    });

    //Temp code for a demo, will be removed as Vis library is updated
    let currentNodeButton;
    if(this.props.graphNodeSelectedMenu ===
      TSUI_GRAPH_MENU_NODE_DETAILS ) {
      currentNodeButton = 'NODE_DETAILS';
    } else if(availableOverlay) {
      currentNodeButton = availableOverlay;
    }
    // End temp code
    let dataOverlayButtons = ['NODE_DETAILS'];
    if(availableOverlay) {
      dataOverlayButtons.push(availableOverlay);
    }
    let currentSelectedMenu = this.getCurrentSelectedMenu(overlayComponent);
    return (
      <div className='tier-support-ui'>
          <div className='spinner'>
              <ClipLoader color={COLOR_BLUE} loading={enableBusyFeedback} />
            </div>
          <div className={componentVisibitliyClassName}>
            <SplitPane
              split='vertical'
              enableResizing='true'
              onDragFinished={ () => {
                onSplitPaneResize(false);
              } }
              defaultSize={TSUI_NODE_DETAILS_INITIAL_WIDTH}
              minSize={TSUI_NODE_DETAILS_MIN_WIDTH}
              maxSize={-200}
              primary='second'>
              <div>
                <ForceDirectedGraph
                  viewWidth={windowWidth}
                  viewHeight={windowHeight}
                  graphData={forceDirectedGraphRawData}
                  nodeSelectedCallback={(nodeData) => {
                    onNodeSelected(nodeData);
                  }}
                  nodeButtonSelectedCallback={(selectedMenuId) => {
                    onNodeMenuSelect(selectedMenuId);
                  }}
                  dataOverlayButtons={dataOverlayButtons}
                  currentlySelectedNodeView={currentNodeButton}/>

              </div>
              <div>
                {currentSelectedMenu}
              </div>
            </SplitPane>
          </div>
      </div>
    );
  }

  isNotEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return true;
      }
    }
    return false;
  }

  getCurrentSelectedMenu(overlayComponent) {
    let secondOverlay;
    if (this.props.graphNodeSelectedMenu === TSUI_GRAPH_MENU_NODE_DETAILS) {
      if (!this.nodeDetails) {
        this.nodeDetails = <SelectedNodeDetails/>;
      }
      return this.nodeDetails;
    }
    else {
      if (this.isNotEmpty(this.props.nodeData) && overlayComponent) {
        if (Overlays.default.hasOwnProperty(overlayComponent)) {
          let OverlayComponent = Overlays.default[overlayComponent];
          secondOverlay = <OverlayComponent nodeDetails={this.props.nodeData}/>;
        }
      }
      return secondOverlay;
    }
  }

}

export default connect(mapStateToProps, mapActionToProps)(TierSupport);
