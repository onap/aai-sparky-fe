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

import React from 'react';

import NodeVisualElementConstants from './NodeVisualElementConstants.js';

class IconFactory {
  static createIcon(iconName, iconProps, key, nodeProps) {
    switch (iconName) {
      case NodeVisualElementConstants.ICON_ELLIPSES:
        let iconEllipsesChildren = [];

        if (iconProps.svgAttributes) {
          let circleProps = {
            ...iconProps.svgAttributes,
            key: key + '_ellipsesCircle'
          };

          let ellipsesBackgroundClassName = (iconProps.isSelected === true)
            ? 'background-selected'
            : 'background-unselected';

          circleProps = {
            ...circleProps,
            className: ellipsesBackgroundClassName
          };

          iconEllipsesChildren.push(
            React.createElement(NodeVisualElementConstants.SVG_CIRCLE,
              circleProps));
        }

        let ellipseOneProps = {
          className: 'ellipses-ellipse',
          cx: '-4',
          cy: '0',
          rx: '1.5',
          ry: '1.5',
          key: key + '_ellipseOne'
        };
        iconEllipsesChildren.push(
          React.createElement(NodeVisualElementConstants.ELLIPSE,
            ellipseOneProps));

        let ellipseTwoProps = {
          className: 'ellipses-ellipse',
          cx: '0',
          cy: '0',
          rx: '1.5',
          ry: '1.5',
          key: key + '_ellipseTwo'
        };
        iconEllipsesChildren.push(
          React.createElement(NodeVisualElementConstants.ELLIPSE,
            ellipseTwoProps));

        let ellipseThreeProps = {
          className: 'ellipses-ellipse',
          cx: '4',
          cy: '0',
          rx: '1.5',
          ry: '1.5',
          key: key + '_ellipseThree'
        };
        iconEllipsesChildren.push(
          React.createElement(NodeVisualElementConstants.ELLIPSE,
            ellipseThreeProps));

        let finalEllipsesProps = {
          className: iconProps.class,
          key: key
        };

        if (iconProps.shapeAttributes) {
          if (iconProps.shapeAttributes.offset) {
            finalEllipsesProps = {
              ...finalEllipsesProps,
              transform: `translate(
                                   ${iconProps.shapeAttributes.offset.x}, 
                                   ${iconProps.shapeAttributes.offset.y})`
            };
          }
        }

        return React.createElement(NodeVisualElementConstants.G,
          finalEllipsesProps, iconEllipsesChildren);

      case NodeVisualElementConstants.ICON_TRIANGLE_WARNING:
        let iconTriangleWarningChildren = [];

        if (iconProps.svgAttributes) {
          let circleProps = {
            ...iconProps.svgAttributes,
            key: key + '_triangleWarningCircle'
          };

          let triangleWarningBackgrounClassName = (iconProps.isSelected ===
          true) ? 'background-selected' : 'background-unselected';

          circleProps = {
            ...circleProps,
            className: triangleWarningBackgrounClassName
          };
          iconTriangleWarningChildren.push(
            React.createElement(NodeVisualElementConstants.SVG_CIRCLE,
              circleProps));
        }

        let trianglePathProps = {
          className: 'triangle-warning',
          d: 'M-4.5 4 L 0 -6.5 L 4.5 4 Z M-0.5 3.75 L -0.5 3 L 0.5 3 L 0.5 3.75 Z M-0.35 2.75 L -0.75 -3.5 L 0.75 -3.5 L 0.35 2.75 Z',
          key: key + '_triangleWarningPath'
        };
        iconTriangleWarningChildren.push(
          React.createElement(NodeVisualElementConstants.PATH,
            trianglePathProps));

        let finalTriangleWarningProps = {
          className: iconProps.class,
          key: key
        };

        if (iconProps.shapeAttributes) {
          if (iconProps.shapeAttributes.offset) {
            finalTriangleWarningProps = {
              ...finalTriangleWarningProps,
              transform: `translate(
                                   ${iconProps.shapeAttributes.offset.x}, 
                                   ${iconProps.shapeAttributes.offset.y})`
            };
          }
        }

        return React.createElement(NodeVisualElementConstants.G,
          finalTriangleWarningProps, iconTriangleWarningChildren);

      case NodeVisualElementConstants.ICON_TICK:
        let tickOverlayMainKey = nodeProps.meta.id + '_overlayTick';
        let iconTickRadius = 5;
        let tickNodeClassName = nodeProps.meta.nodeMeta.className;
        if (tickNodeClassName ===
          NodeVisualElementConstants.SELECTED_SEARCHED_NODE_CLASS_NAME ||
          tickNodeClassName ===
          NodeVisualElementConstants.SELECTED_NODE_CLASS_NAME) {
          iconTickRadius = 8;
        }
        let tickIconcircleProps = {
          className: 'icon_tick_circle',
          r: iconTickRadius,
          key: key + '_tickCircle'
        };
        let iconTickChildren = [];

        iconTickChildren.push(
          React.createElement(NodeVisualElementConstants.SVG_CIRCLE,
            tickIconcircleProps));
        let tickIconTransformProperty = 'translate(-15, -10)';
        if (tickNodeClassName ===
          NodeVisualElementConstants.SELECTED_SEARCHED_NODE_CLASS_NAME ||
          tickNodeClassName ===
          NodeVisualElementConstants.SELECTED_NODE_CLASS_NAME) {
          tickIconTransformProperty = 'translate(-30, -18)';

        }
        let tickPathProps = {
          className: 'icon_tick_path',
          d: 'M-3 0 L -1.5 1.8 L3 -1.5 L -1.5 1.8',
          key: key + '_tickPath'
        };
        iconTickChildren.push(
          React.createElement(NodeVisualElementConstants.PATH, tickPathProps));

        let finalTickIconProps = {
          className: 'icon_tick',
          key: tickOverlayMainKey + '_final',
          transform: tickIconTransformProperty
        };
        return React.createElement(NodeVisualElementConstants.G,
          finalTickIconProps, iconTickChildren);

      case NodeVisualElementConstants.ICON_WARNING:
        let warningOverlayMainKey = nodeProps.meta.id + '_overlayTick';
        let iconWarningRadius = 5;
        let warningNodeClassName = nodeProps.meta.nodeMeta.className;
        if (warningNodeClassName ===
          NodeVisualElementConstants.SELECTED_SEARCHED_NODE_CLASS_NAME ||
          warningNodeClassName ===
          NodeVisualElementConstants.SELECTED_NODE_CLASS_NAME) {
          iconWarningRadius = 8;
        }
        let warningIconcircleProps = {
          className: 'icon_warning_circle',
          r: iconWarningRadius,
          key: key + '_warningCircle'
        };
        let iconWarningChildren = [];

        iconWarningChildren.push(
          React.createElement(NodeVisualElementConstants.SVG_CIRCLE,
            warningIconcircleProps));
        let warningIconTransformProperty = 'translate(-15, -10)';
        if (warningNodeClassName ===
          NodeVisualElementConstants.SELECTED_SEARCHED_NODE_CLASS_NAME ||
          warningNodeClassName ===
          NodeVisualElementConstants.SELECTED_NODE_CLASS_NAME) {
          warningIconTransformProperty = 'translate(-30, -18)';
        }
        let warningPathProps = {
          className: 'icon_warning_path',
          d: 'M-0.35 3.8 L -0.35 3.7 L 0.35 3.7 L 0.35 3.8 Z M-0.1 1.8 L -0.6 -3.5 L 0.6 -3.5 L 0.1 1.8 Z',
          key: key + '_tickPath'
        };
        iconWarningChildren.push(
          React.createElement(NodeVisualElementConstants.PATH,
            warningPathProps));

        let finalWarningIconProps = {
          className: 'icon_warning',
          key: warningOverlayMainKey + '_final',
          transform: warningIconTransformProperty
        };
        return React.createElement(NodeVisualElementConstants.G,
          finalWarningIconProps, iconWarningChildren);
    }
  }
}

export default IconFactory;
