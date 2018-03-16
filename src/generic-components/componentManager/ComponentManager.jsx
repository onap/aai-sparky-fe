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

import ComponentManagerContainer from
  'generic-components/componentManager/ComponentManagerContainer.jsx';
import {
  MIN_PANEL_WIDTH,
  MIN_PANEL_HEIGHT,
  MAX_PANEL_WIDTH,
  EDIT_ICON,
  LAYOUT_STATIC
} from 'generic-components/componentManager/ComponentManagerConstants.js';

var widthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = widthProvider(ReactGridLayout);

export default class ComponentManager extends Component {
  constructor(props) {
    super(props);

    if (props.layoutType === LAYOUT_STATIC &&
      Object.keys(props.layoutFormat).length > 0) {
      this.state = {
        layout: props.layoutFormat.layout,
        panels: props.layoutFormat.panels,
        containers: props.layoutFormat.containers
      };
    } else {
      this.state = {
        layout: [],
        panels: [],
        containers: []
      };
    }
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  createContainer(
    containerId, xPos, yPos, width, height, staticLayout = false) {
    if (staticLayout) {
      return {
        id: containerId,
        properties: {
          x: xPos,
          y: yPos,
          w: width,
          h: height,
          isDraggable: false,
          isResizable: false
        }
      };
    } else {
      return {
        id: containerId,
        properties: {
          x: xPos,
          y: yPos,
          w: width,
          h: height,
          minW: MIN_PANEL_WIDTH,
          maxW: MAX_PANEL_WIDTH,
          minH: MIN_PANEL_HEIGHT
        }
      };
    }
  }

  createPanel(id, title, panelSource, panelProps, actionList) {
    return {
      id: id,
      title: title,
      source: panelSource,
      props: panelProps,
      actions: actionList
    };
  }

  addNewComponent(compProps, containingContainerId) {
    let containerId = containingContainerId;
    let actionsList = [];

    if (typeof containerId === 'undefined' || containerId === null) {
      // new component being added isn't associated with a
      // container yet, so create one
      containerId = 'container:' + (new Date).getTime();
      let updatedContainerProps = [];
      this.state.containers.forEach((containerProps) => {
        updatedContainerProps.push(containerProps);
      });
      updatedContainerProps.push(
        this.createContainer(containerId, 0, Infinity, 12, 2));
      this.setState({containers: updatedContainerProps});

      actionsList = [
        {
          type: 'close', id: containerId, callback: () => {
            this.removeExistingComponent(containerId);
          }
        }
      ];
    } else {
      // we are updating a static container with a new panel, add the edit
      // action so it can be updated moving forward
      actionsList = [
        {
          type: 'custom',
          id: containingContainerId,
          icon: EDIT_ICON,
          callback: () => {
            this.props.addPanelCallback(containingContainerId);
          }
        }
      ];
    }

    let updatedPanelProps = [];
    this.state.panels.forEach((panelProp) => {
      if (panelProp.id !== containingContainerId) {
        // add all existing panels except the one with a
        // matching id (this is an edit scenario, will replace
        // with new panel below
        updatedPanelProps.push(panelProp);
      }
    });
    updatedPanelProps.push(
      this.createPanel(
        containerId,
        compProps.title,
        compProps.visualizationSource,
        compProps.visualizationProps,
        actionsList));
    this.setState({panels: updatedPanelProps});
  }

  removeExistingComponent(id) {
    let updatedPanelProps = this.state.panels.filter((panelProp) => {
      return id !== panelProp.id;
    });
    this.setState({panels: updatedPanelProps});

    let updatedContainerProps = this.state.containers.filter(
      (containerProp) => {
        return id !== containerProp.id;
      });
    this.setState({containers: updatedContainerProps});
  }

  getLayoutProperties() {
    return {
      layout: this.state.layout,
      containers: this.state.containers,
      panels: this.state.panels
    };
  }

  setLayoutProperties(layoutProperties) {
    this.setState({
      layout: layoutProperties.layout,
      containers: layoutProperties.containers,
      panels: layoutProperties.panels
    });
  }

  fetchMatchingPanel(containerId) {
    let actionsList = [];
    let matchingPanel = (
      <ComponentManagerContainer
        showHeader={this.props.showHeader}
        showTitle={this.props.showTitle}
        showBorder={this.props.showBorder}
        actions={actionsList}>
        {'Please select a visualization'}
      </ComponentManagerContainer>
    );
    this.state.panels.forEach((panel) => {
      if (panel.id === containerId) {
        let GeneratedComponent =
					this.props.componentPropertiesProvider[panel.source].component.class;
        let visProps = panel.props;
        matchingPanel = (
          <ComponentManagerContainer
            showHeader={this.props.showHeader}
            showTitle={this.props.showTitle}
            showBorder={this.props.showBorder}
            title={panel.title}
            actions={panel.actions}>
            <GeneratedComponent {...visProps}/>
          </ComponentManagerContainer>
        );
      }
    });
    return matchingPanel;
  }

  preparedContainers() {
    let containersToRender = [];

    this.state.containers.forEach((container) => {
      let matchingPanel = this.fetchMatchingPanel(container.id);

      containersToRender.push(<div key={container.id}
                                   data-grid={{...(container.properties)}}>
        {matchingPanel}
      </div>);
    });

    return containersToRender;
  }

  onLayoutChange(layout) {
    this.setState({layout: layout});
    this.props.onLayoutChange(layout);
  }

  buildStaticContainers(layoutFormat) {
    let staticContainers = [];
    let nextRowIndex = 0;

    layoutFormat.layout.forEach((row) => {
      let nextColIndex = 0;
      let currentTallestContainer = 0;

      row.forEach((col) => {
        let containerId = 'container:' + nextRowIndex + '-' + nextColIndex;
        let xPos = nextColIndex;
        let yPos = nextRowIndex;
        let width = 12 * col.width;
        let height = col.height;

        nextColIndex = nextColIndex + width;
        currentTallestContainer = Math.max(currentTallestContainer, col.height);

        staticContainers.push(
          this.createContainer(
            containerId,
            xPos,
            yPos,
            width,
            height,
            true
          )
        );
      });

      nextRowIndex = currentTallestContainer;
    });

    return staticContainers;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.layoutFormat !== this.props.layoutFormat) {
      // layout format being passed in are the containers, panels and layout
      // for the newly view
      this.setState({
        layout: nextProps.layoutFormat.layout,
        panels: nextProps.layoutFormat.panels,
        containers: nextProps.layoutFormat.containers
      });
    }
  }

  render() {

    return (
      <div className='component-manager'>
        <ReactGridLayout
          className='content app-components'
          {...this.props}
          onLayoutChange={this.onLayoutChange}
          layout={this.state.layout}>
          {this.preparedContainers()}
        </ReactGridLayout>
      </div>
    );
  }
}
ComponentManager.defaultProps = {
  cols: 12,
  rewHeight: 100,
  onLayoutChange: function () {
  },
  showHeader: true,
  showTitle: true,
  showBorder: true
};
