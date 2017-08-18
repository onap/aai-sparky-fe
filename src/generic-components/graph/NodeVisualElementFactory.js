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

import IconFactory from './IconFactory.js';
import NodeVisualElementConstants from './NodeVisualElementConstants.js';

class NodeVisualElementFactory {

  constructor() {
    this.visualElementMeta = {};

    this.setVisualElementMeta = this.setVisualElementMeta.bind(this);
    this.buildVisualElement = this.buildVisualElement.bind(this);
    this.createSvgCircle = this.createSvgCircle.bind(this);
    this.createSvgLine = this.createSvgLine.bind(this);
    this.createTextElement = this.createTextElement.bind(this);
    this.createImageElement = this.createImageElement.bind(this);
    this.createObjectElement = this.createObjectElement.bind(this);
    this.createButtonElement = this.createButtonElement.bind(this);
    this.applySvgAttributes = this.applySvgAttributes.bind(this);
    this.applyTransform = this.applyTransform.bind(this);
  }

  setVisualElementMeta(metaObject) {
    this.visualElementMeta = metaObject;
  }

  buildVisualElement(nodeProps, elementType, elementProps, index) {
    let elementKey = nodeProps.id + index.toString();
    switch (elementType) {
      case NodeVisualElementConstants.SVG_CIRCLE:
        return this.createSvgCircle(elementProps, elementKey);

      case NodeVisualElementConstants.SVG_LINE:
        return this.createSvgLine(elementProps, elementKey);

      case NodeVisualElementConstants.TEXT:
        return this.createTextElement(nodeProps, elementProps, elementKey);

      case NodeVisualElementConstants.IMAGE:
        return this.createImageElement(elementProps, elementKey);

      case NodeVisualElementConstants.OBJECT:
        return this.createObjectElement(elementProps, elementKey);

      case NodeVisualElementConstants.BUTTON:
        return this.createButtonElement(elementProps, elementKey);

      case NodeVisualElementConstants.ICON:
        return this.createButtonElement(elementProps, elementKey, nodeProps);

    }
  }

  createSvgCircle(circleProps, elementKey) {
    let finalProps = {};
    finalProps[NodeVisualElementConstants.CSS_CLASS] = circleProps.class;

    finalProps = this.applyTransform(finalProps, circleProps.shapeAttributes);
    finalProps = this.applySvgAttributes(finalProps, circleProps.svgAttributes);

    finalProps = {
      ...finalProps,
      key: elementKey
    };

    return React.createElement(NodeVisualElementConstants.SVG_CIRCLE,
      finalProps);
  }

  createSvgLine(lineProps, elementKey) {

    /* Keep this commented code. Will be used again when
      proper link construction is added
     let finalProps = {};
     finalProps[NodeVisualElementConstants.CSS_CLASS] = lineProps.class;
     finalProps = this.applySvgAttributes(finalProps, lineProps.svgAttributes);
     finalProps = this.applyTransform(finalProps, lineProps.shapeAttributes);
     */

    let finalProps = {
      ...lineProps,
      key: elementKey
    };

    return React.createElement(NodeVisualElementConstants.SVG_LINE, finalProps);
  }

  createTextElement(nodeProps, textProps, elementKey) {
    let finalProps = {};
    finalProps[NodeVisualElementConstants.CSS_CLASS] = textProps.class;

    finalProps = this.applySvgAttributes(finalProps, textProps.svgAttributes);
    finalProps = this.applyTransform(finalProps, textProps.shapeAttributes);

    finalProps = {
      ...finalProps,
      key: elementKey
    };

    return React.createElement(NodeVisualElementConstants.TEXT, finalProps,
      nodeProps[textProps.displayKey]);
  }

  createImageElement(imageProps, elementKey) {
    let finalProps = {};
    finalProps[NodeVisualElementConstants.CSS_CLASS] = imageProps.class;

    finalProps = this.applyTransform(finalProps, imageProps.shapeAttributes);
    finalProps = this.applySvgAttributes(finalProps, imageProps.svgAttributes);

    finalProps = {
      ...finalProps,
      key: elementKey
    };

    return React.createElement(NodeVisualElementConstants.IMAGE, finalProps);
  }

  createObjectElement(objectProps, elementKey) {
    let finalProps = {};
    finalProps[NodeVisualElementConstants.CSS_CLASS] = objectProps.class;

    finalProps = this.applyTransform(finalProps, objectProps.shapeAttributes);
    finalProps = this.applySvgAttributes(finalProps, objectProps.svgAttributes);

    finalProps = {
      ...finalProps,
      key: elementKey
    };

    return React.createElement(NodeVisualElementConstants.OBJECT, finalProps);
  }

  createButtonElement(buttonProps, elementKey, nodeMeta) {
    return IconFactory.createIcon(buttonProps.name, buttonProps, elementKey,
      nodeMeta);
  }

  applySvgAttributes(elementProps, svgAttributes) {
    if (svgAttributes) {
      return {
        ...elementProps,
        ...svgAttributes
      };
    }
    return elementProps;
  }

  applyTransform(elementProps, shapeAttributes) {
    if (shapeAttributes) {
      if (shapeAttributes.offset) {
        return {
          ...elementProps,
          transform: `translate(
                                ${shapeAttributes.offset.x}, 
                                ${shapeAttributes.offset.y})`
        };
      }
    }
    return elementProps;
  }
}

export default NodeVisualElementFactory;
