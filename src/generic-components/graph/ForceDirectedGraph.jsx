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
import {drag} from 'd3-drag';
import {forceSimulation, forceLink, forceManyBody, forceCenter} from 'd3-force';
import {interpolateNumber} from 'd3-interpolate';
import {select, event as currentEvent} from 'd3-selection';
import React, {Component, PropTypes} from 'react';
import {interval, now} from 'd3-timer';
import {zoom, zoomIdentity} from 'd3-zoom';
import NodeConstants from './NodeVisualElementConstants.js';

import {simulationKeys} from './ForceDefinitions.js';
import NodeFactory from './NodeFactory.js';
import NodeVisualElementFactory from './NodeVisualElementFactory.js';

class ForceDirectedGraph extends Component {
  static propTypes = {
    viewWidth: PropTypes.number,
    viewHeight: PropTypes.number,
    graphData: PropTypes.object,
    nodeIdKey: PropTypes.string,
    linkIdKey: PropTypes.string,
    nodeSelectedCallback: PropTypes.func,
    nodeButtonSelectedCallback: PropTypes.func,
    currentlySelectedNodeView: PropTypes.string
  };

  static defaultProps = {
    viewWidth: 0,
    viewHeight: 0,
    graphData: {
      graphCounter: -1, nodeDataArray: [], linkDataArray: [], graphMeta: {}
    },
    nodeIdKey: '',
    linkIdKey: '',
    nodeSelectedCallback: undefined,
    nodeButtonSelectedCallback: undefined,
    currentlySelectedNodeView: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      nodes: [], links: [], mainGroupTransform: zoomIdentity
    };

    this.updateSimulationForce = this.updateSimulationForce.bind(this);
    this.resetState = this.resetState.bind(this);
    this.applyBufferDataToState = this.applyBufferDataToState.bind(this);
    this.createNodePropForState = this.createNodePropForState.bind(this);
    this.createLinkPropForState = this.createLinkPropForState.bind(this);
    this.startSimulation = this.startSimulation.bind(this);
    this.simulationComplete = this.simulationComplete.bind(this);
    this.simulationTick = this.simulationTick.bind(this);
    this.nodeSelected = this.nodeSelected.bind(this);
    this.nodeButtonSelected = this.nodeButtonSelected.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.onGraphDrag = this.onGraphDrag.bind(this);
    this.onNodeDrag = this.onNodeDrag.bind(this);
    this.addNodeInterpolator = this.addNodeInterpolator.bind(this);
    this.runInterpolators = this.runInterpolators.bind(this);

    this.nodeBuffer = [];
    this.linkBuffer = [];
    this.nodeDatum = [];
    this.nodeButtonDatum = [];
    this.nodeFactory = new NodeFactory();
    this.visualElementFactory = new NodeVisualElementFactory();

    this.isGraphMounted = false;

    this.listenerGraphCounter = -1;
    this.nodeIndexTracker = new Map();
    this.interpolators = new Map();
    this.areInterpolationsRunning = false;

    this.newNodeSelected = true;
    this.currentlySelectedNodeButton = undefined;

    this.intervalTimer = interval(this.applyBufferDataToState, simulationKeys.DATA_COPY_INTERVAL);
    this.intervalTimer.stop();

    this.interpolationTimer = interval(this.runInterpolators, simulationKeys.DATA_COPY_INTERVAL);
    this.interpolationTimer.stop();

    this.simulation = forceSimulation();
    this.simulation.on('end', this.simulationComplete);
    this.simulation.stop();

    this.svgZoom =
      zoom().scaleExtent([NodeConstants.SCALE_EXTENT_MIN, NodeConstants.SACEL_EXTENT_MAX]);
    this.svgZoom.clickDistance(2);
    this.nodeDrag = drag().clickDistance(2);

    this.updateSimulationForce();
    // Temporary code until backend supports NOT displaying the button in the response.
    if(props.dataOverlayButtons.length === 1) {
      this.hideButton = true;
    } else {
      this.hideButton  = false;
    }
    if (props.graphData) {
      if (props.graphData.graphCounter !== -1) {
        this.startSimulation(props.graphData, props.currentlySelectedNodeView, props.dataOverlayButtons);
      }
    }
  }

  componentDidMount() {
    this.isGraphMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.graphData.graphCounter !== this.props.graphData.graphCounter) {
      this.listenerGraphCounter = this.props.graphData.graphCounter;
      this.newNodeSelected = true;
      this.resetState();
      this.startSimulation(nextProps.graphData, nextProps.currentlySelectedNodeView, nextProps.dataOverlayButtons);
    }
  }


  componentDidUpdate(prevProps) {
    let hasNewGraphDataRendered = (prevProps.graphData.graphCounter ===
    this.props.graphData.graphCounter);
    let shouldAttachListeners = (this.listenerGraphCounter !== this.props.graphData.graphCounter);
    let nodeCount = this.state.nodes.length;

    if (nodeCount > 0) {
      if (hasNewGraphDataRendered && shouldAttachListeners) {
        let nodes = select('.fdgMainSvg').select('.fdgMainG')
                                         .selectAll('.aai-entity-node')
                                         .data(this.nodeDatum);
        nodes.on('click', (d) => {
          this.nodeSelected(d);
        });

        nodes.call(this.nodeDrag.on('drag', (d) => {
          let xAndY = [currentEvent.x, currentEvent.y];
          this.onNodeDrag(d, xAndY);
        }));

        let mainSVG = select('.fdgMainSvg');
        let mainView = mainSVG.select('.fdgMainView');
        this.svgZoom.transform(mainSVG, zoomIdentity);
        this.svgZoom.transform(mainView, zoomIdentity);

        mainSVG.call(this.svgZoom.on('zoom', () => { // D3 Zoom also handles panning
          this.onZoom(currentEvent.transform);
        })).on('dblclick.zoom', null); // Ignore the double-click zoom event

        this.listenerGraphCounter = this.props.graphData.graphCounter;
      }

      if (this.newNodeSelected) {
        let nodeButtons = select('.fdgMainSvg').select('.fdgMainG')
                                               .selectAll('.aai-entity-node')
                                               .selectAll('.node-button')
                                               .data(this.nodeButtonDatum);
        if (!nodeButtons.empty()) {
          nodeButtons.on('click', (d) => {
            this.nodeButtonSelected(d);
          });
          if (hasNewGraphDataRendered && shouldAttachListeners) {
            this.newNodeSelected = false;
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.isGraphMounted = false;

    let nodes = select('.fdgMainSvg').select('.fdgMainG')
                                     .selectAll('.aai-entity-node');
    let nodeButtons = nodes.selectAll('.node-button');

    nodes.on('click', null);
    nodeButtons.on('click', null);

    let mainSVG = select('.fdgMainSvg');

    mainSVG.call(this.svgZoom.on('zoom', null)).on('dblclick.zoom', null);
    mainSVG.call(drag().on('drag', null));
  }

  updateSimulationForce() {
    this.simulation.force('link', forceLink());
    this.simulation.force('link').id((d) => {
      return d.id;
    });
    this.simulation.force('link').strength(0.3);
    this.simulation.force('link').distance(100);

    this.simulation.force('charge', forceManyBody());
    this.simulation.force('charge').strength(-1250);
    this.simulation.alpha(1);

    this.simulation.force('center',
      forceCenter(this.props.viewWidth / 2, this.props.viewHeight / 2));
  }

  resetState() {
    if (this.isGraphMounted) {
      this.setState(() => {
        return {
          mainGroupTransform: zoomIdentity,
          nodes: [], links: []
        };
      });
    }
  }

  applyBufferDataToState() {
    this.nodeIndexTracker.clear();

    let newNodes = [];
    this.nodeBuffer.map((node, i) => {
      let nodeProps = this.createNodePropForState(node);

      if (nodeProps.meta.nodeMeta.className ===
        NodeConstants.SELECTED_NODE_CLASS_NAME ||
        nodeProps.meta.nodeMeta.className ===
        NodeConstants.SELECTED_SEARCHED_NODE_CLASS_NAME) {

        this.nodeButtonDatum[0].data = nodeProps.meta;
        if(this.nodeButtonDatum.length > 1) {
          this.nodeButtonDatum[1].data = nodeProps.meta;
          nodeProps = {
            ...nodeProps,
            buttons: [this.nodeButtonDatum[0].isSelected, this.nodeButtonDatum[1].isSelected]
          };
        } else {
          nodeProps = {
            ...nodeProps,
            buttons: [this.nodeButtonDatum[0].isSelected]
          };
        }
      }

      newNodes.push(this.nodeFactory.buildNode(nodeProps.meta.nodeMeta.className, nodeProps, this.hideButton));

      this.nodeIndexTracker.set(node.id, i);
    });

    let newLinks = [];
    this.linkBuffer.map((link) => {
      let key = link.id;
      let linkProps = this.createLinkPropForState(link);
      newLinks.push(this.visualElementFactory.createSvgLine(linkProps, key));
    });

    if (this.isGraphMounted) {
      this.setState(() => {
        return {
          nodes: newNodes, links: newLinks
        };
      });
    }
  }

  createNodePropForState(nodeData) {
    return {
      renderProps: {
        key: nodeData.id, x: nodeData.x, y: nodeData.y
      }, meta: {
        ...nodeData
      }
    };
  }

  createLinkPropForState(linkData) {
    return {
      className: 'aai-entity-link',
      x1: linkData.source.x,
      y1: linkData.source.y,
      x2: linkData.target.x,
      y2: linkData.target.y
    };
  }

  startSimulation(graphData, currentView, overlayButtons) {
    this.nodeFactory.setNodeMeta(graphData.graphMeta);

    // Experiment with removing length = 0... might not be needed as new array
    // assignment will likely destroy old reference
    this.nodeBuffer.length = 0;
    this.nodeBuffer = Array.from(graphData.nodeDataArray);
    this.linkBuffer.length = 0;
    this.linkBuffer = Array.from(graphData.linkDataArray);
    this.nodeDatum.length = 0;
    this.nodeDatum = Array.from(graphData.nodeDataArray);

    this.nodeButtonDatum.length = 0;

    let isNodeDetailsSelected = (currentView ===
    overlayButtons[0] ||
    currentView ===
    '');
    this.nodeButtonDatum.push({
      name: NodeConstants.ICON_ELLIPSES, isSelected: isNodeDetailsSelected, overlayName: overlayButtons[0]
    });


    if(overlayButtons.length > 1 ) {
      let isSecondButtonSelected = (currentView === overlayButtons[1]);

      this.nodeButtonDatum.push({
        name: NodeConstants.ICON_TRIANGLE_WARNING, isSelected: isSecondButtonSelected, overlayName: overlayButtons[1]
      });
    }


    if (isNodeDetailsSelected) {
      this.currentlySelectedNodeButton = NodeConstants.ICON_ELLIPSES;
    } else {
      this.currentlySelectedNodeButton = NodeConstants.ICON_TRIANGLE_WARNING;
    }

    this.updateSimulationForce();

    this.simulation.nodes(this.nodeBuffer);
    this.simulation.force('link').links(this.linkBuffer);
    this.simulation.on('tick', this.simulationTick);
    this.simulation.restart();
  }

  simulationComplete() {
    this.intervalTimer.stop();
    this.applyBufferDataToState();
  }

  simulationTick() {
    this.intervalTimer.restart(this.applyBufferDataToState, simulationKeys.DATA_COPY_INTERVAL);
    this.simulation.on('tick', null);
  }

  nodeSelected(datum) {
    if (this.props.nodeSelectedCallback) {
      this.props.nodeSelectedCallback(datum);
    }

    let didUpdateNew = false;
    let didUpdatePrevious = false;
    let isSameNodeSelected = true;

    // Check to see if a default node was previously selected
    let selectedDefaultNode = select('.fdgMainSvg').select('.fdgMainG')
                                                   .selectAll('.aai-entity-node')
                                                   .filter('.selected-node');
    if (!selectedDefaultNode.empty()) {
      if (selectedDefaultNode.datum().id !== datum.id) {
        this.nodeBuffer[selectedDefaultNode.datum().index].nodeMeta.className =
          NodeConstants.GENERAL_NODE_CLASS_NAME;
        didUpdatePrevious = true;
        isSameNodeSelected = false;
      }
    }

    // Check to see if a searched node was previously selected
    let selectedSearchedNode = select('.fdgMainSvg').select('.fdgMainG')
                                                    .selectAll('.aai-entity-node')
                                                    .filter('.selected-search-node');
    if (!selectedSearchedNode.empty()) {
      if (selectedSearchedNode.datum().id !== datum.id) {
        this.nodeBuffer[selectedSearchedNode.datum().index].nodeMeta.className =
          NodeConstants.SEARCHED_NODE_CLASS_NAME;
        didUpdatePrevious = true;
        isSameNodeSelected = false;
      }
    }

    if (!isSameNodeSelected) {
      let newlySelectedNode = select('.fdgMainSvg').select('.fdgMainG')
                                                   .selectAll('.aai-entity-node')
                                                   .filter((d) => {
                                                     return (datum.id === d.id);
                                                   });
      if (!newlySelectedNode.empty()) {

        if (newlySelectedNode.datum().nodeMeta.searchTarget) {
          this.nodeBuffer[newlySelectedNode.datum().index].nodeMeta.className =
            NodeConstants.SELECTED_SEARCHED_NODE_CLASS_NAME;
        } else {
          this.nodeBuffer[newlySelectedNode.datum().index].nodeMeta.className =
            NodeConstants.SELECTED_NODE_CLASS_NAME;
        }
        didUpdateNew = true;
      }
    }

    if (didUpdatePrevious && didUpdateNew) {
      this.newNodeSelected = true;
      this.applyBufferDataToState();
    }
  }

  nodeButtonSelected(datum) {
    if (this.props.nodeButtonSelectedCallback) {
      let buttonClickEvent = {
        buttonId: datum.overlayName
      };
      this.props.nodeButtonSelectedCallback(buttonClickEvent);
    }

    if (this.currentlySelectedNodeButton !== datum.name) {
      if (datum.name === this.nodeButtonDatum[0].name) {
        this.nodeButtonDatum[0].isSelected = true;
        this.nodeButtonDatum[1].isSelected = false;
      }
      if (datum.name === this.nodeButtonDatum[1].name) {
        this.nodeButtonDatum[0].isSelected = false;
        this.nodeButtonDatum[1].isSelected = true;
      }
      this.currentlySelectedNodeButton = datum.name;
      this.applyBufferDataToState();
    }
  }

  onZoom(eventTransform) {
    if (this.isGraphMounted) {
      this.setState(() => {
        return {
          mainGroupTransform: eventTransform
        };
      });
    }
  }

  onGraphDrag(xAndYCoords) {
    let translate = `translate(${xAndYCoords.x}, ${xAndYCoords.y})`;
    let oldTransform = this.state.mainGroupTransform;
    if (this.isGraphMounted) {
      this.setState(() => {
        return {
          ...oldTransform, translate
        };
      });
    }
  }

  onNodeDrag(datum, xAndYCoords) {
    let nodeIndex = this.nodeIndexTracker.get(datum.id);
    if (this.nodeBuffer[nodeIndex]) {
      this.nodeBuffer[nodeIndex].x = xAndYCoords[0];
      this.nodeBuffer[nodeIndex].y = xAndYCoords[1];
      this.applyBufferDataToState();
    }
  }

  addNodeInterpolator(nodeId, key, startingValue, endingValue, duration) {
    let numberInterpolator = interpolateNumber(startingValue, endingValue);
    let timeNow = now();
    let interpolationObject = {
      nodeId: nodeId, key: key, duration: duration, timeCreated: timeNow, method: numberInterpolator
    };
    this.interpolators.set(nodeId, interpolationObject);

    if (!this.areInterpolationsRunning) {
      this.interpolationTimer.restart(this.runInterpolators, simulationKeys.DATA_COPY_INTERVAL);
      this.areInterpolationsRunning = true;
    }
  }

  runInterpolators() {
    // If we have no more interpolators to run then shut'r down!
    if (this.interpolators.size === 0) {
      this.interpolationTimer.stop();
      this.areInterpolationsRunning = false;
    }

    let iterpolatorsComplete = [];
    // Apply interpolation values
    this.interpolators.forEach((interpolator) => {
      let nodeIndex = this.nodeIndexTracker.get(interpolator.nodeId);
      if (nodeIndex) {
        let elapsedTime = now() - interpolator.timeCreated;
        // Normalize t as D3's interpolateNumber needs a value between 0 and 1
        let t = elapsedTime / interpolator.duration;
        if (t >= 1) {
          t = 1;
          iterpolatorsComplete.push(interpolator.nodeId);
        }
        this.nodeBuffer[nodeIndex][interpolator.key] = interpolator.method(t);
      }
    });

    // Remove any interpolators that are complete
    if (iterpolatorsComplete.length > 0) {
      for (let i = 0; i < iterpolatorsComplete.length; i++) {
        this.interpolators.delete(iterpolatorsComplete[i]);
      }
    }

    this.applyBufferDataToState();
  }

  render() {
    // We will be using these values veru shortly, commenting out for eslint
    // reasons so we can build for PV let {viewWidth, viewHeight} = this.props;
    let {nodes, links, mainGroupTransform} = this.state;

    return (
      <div className='ts-force-selected-graph'>
        <svg className={'fdgMainSvg'} width='100%' height='100%'>
          <rect className={'fdgMainView'} x='0.5' y='0.5' width='99%'
                height='99%' fill='none'/>
          <filter id='selected-node-drop-shadow'>
            <feGaussianBlur in='SourceAlpha' stdDeviation='2.2'/>
            <feOffset dx='-1' dy='1' result='offsetblur'/>
            <feFlood floodColor='rgba(0,0,0,0.5)'/>
            <feComposite in2='offsetblur' operator='in'/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in='SourceGraphic'/>
            </feMerge>
          </filter>
          <g className={'fdgMainG'} transform={mainGroupTransform}>
            {links}
            {nodes}
          </g>
        </svg>
      </div>
    );
  }

  static graphCounter = 0;

  static generateNewProps(nodeArray, linkArray, metaData) {
    ForceDirectedGraph.graphCounter += 1;
    return {
      graphCounter: ForceDirectedGraph.graphCounter,
      nodeDataArray: nodeArray,
      linkDataArray: linkArray,
      graphMeta: metaData
    };
  }
}

export default ForceDirectedGraph;
