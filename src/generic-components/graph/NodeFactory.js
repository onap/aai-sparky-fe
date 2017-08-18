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
import React from 'react';

import NodeVisualElementConstants from './NodeVisualElementConstants.js';
import NodeVisualElementFactory from './NodeVisualElementFactory.js';

class NodeFactory {

  constructor() {
    this.graphMeta = {};
    this.visualElementFactory = new NodeVisualElementFactory();

    this.setNodeMeta = this.setNodeMeta.bind(this);
  }

  setNodeMeta(metaObject) {
    this.graphMeta = metaObject;
    this.visualElementFactory.setVisualElementMeta(metaObject);
  }

  buildNode(nodeType, nodeProps) {

    let translate = `translate(
                              ${nodeProps.renderProps.x},
                              ${nodeProps.renderProps.y})`;
    let finalProps = {
      ...nodeProps.renderProps,
      className: this.graphMeta.aaiEntityNodeDescriptors[nodeType].class,
      transform: translate
    };

    let nodeVisualElementsData = this.extractVisualElementArrayFromMeta(
      nodeType);
    let nodeVisualElements = undefined;
    if (nodeVisualElementsData) {
      nodeVisualElements = [];
      nodeVisualElementsData.map((elementData, index) => {
        if (elementData.type === NodeVisualElementConstants.BUTTON) {
          if (nodeProps.buttons) {
            let isButtonSelected = true;
            elementData = {
              ...elementData,
              isSelected: isButtonSelected
            };
          }
        }
        nodeVisualElements.push(
          this.visualElementFactory.buildVisualElement(nodeProps.meta,
            elementData.type, elementData, index));
      });
      //Draw overlay only if the node is validated
      if (nodeProps.meta.nodeMeta.nodeValidated) {

        if (nodeProps.meta.nodeMeta.nodeIssue) {
          let warningOverlayProps = {
            name: NodeVisualElementConstants.ICON_WARNING,
          };
          nodeVisualElements.push(
            this.visualElementFactory.buildVisualElement(nodeProps,
              NodeVisualElementConstants.ICON, warningOverlayProps,
              nodeVisualElementsData.length + 1));
        } else {
          let tickOverlayProps = {
            name: NodeVisualElementConstants.ICON_TICK,
          };
          nodeVisualElements.push(
            this.visualElementFactory.buildVisualElement(nodeProps,
              NodeVisualElementConstants.ICON, tickOverlayProps,
              nodeVisualElementsData.length + 1));
        }
      }
    }

    if (nodeVisualElements) {
      return React.createElement('g', finalProps, nodeVisualElements);
    }

    return React.createElement('g', finalProps);
  }

  extractVisualElementArrayFromMeta(nodeClassName) {
    let nodeVisualElements = undefined;
    if (this.graphMeta.aaiEntityNodeDescriptors) {
      nodeVisualElements =
        this.graphMeta.aaiEntityNodeDescriptors[nodeClassName].visualElements;
    }
    return nodeVisualElements;
  }
}

export default NodeFactory;
