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
import {geoAlbersUsa, geoEquirectangular, geoPath} from 'd3-geo';
import {feature, mesh} from 'topojson';

import {
  BOUNDARY_MESH_KEY,
  LAND_FEATURE_KEY,
  MAP_OBJECT_KEYS,
  PLOT_POINT_KEY_BASE,
  PLOT_POINT_SHAPES,
  PROJECTION_TYPES
} from './MapConstants.js';
import usMapJson from './mapJson/usJson.json';
import worldMapJson from  './mapJson/worldJson.json';

class TopographicMap extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    pointArray: PropTypes.array,
    currentProjection: PropTypes.string
  };

  static defaultProps = {
    width: 840,
    height: 500,
    pointArray: [],
    currentProjection: PROJECTION_TYPES.ALBERS_USA
  };

  constructor(props) {
    super(props);

    this.state = {
      landFeatures: undefined,
      boundaryMesh: undefined,
      plotPoints: []
    };

    this.setCurrentProjection = this.setCurrentProjection.bind(this);
    this.processAndRenderMapData = this.processAndRenderMapData.bind(this);
    this.generateLandFeatures = this.generateLandFeatures.bind(this);
    this.generateBoundaryMesh = this.generateBoundaryMesh.bind(this);
    this.generatePlotPointArray = this.generatePlotPointArray.bind(this);
    this.extractNestedObjectInJson = this.extractNestedObjectInJson.bind(this);
    this.areArraysEqual = this.areArraysEqual.bind(this);

    this.setCurrentProjection(props.currentProjection);
    this.projection.translate([this.props.width / 2, this.props.height / 2]);
    this.path = geoPath().projection(this.projection);
    this.didProjectionTypeChange = true;
    this.isMapMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.areArraysEqual(this.props.pointArray, nextProps.pointArray)) {
      if (this.props.currentProjection !== nextProps.currentProjection) {
        this.didProjectionTypeChange = true;
        this.setCurrentProjection(nextProps.currentProjection);
      }
      if (this.isMapMounted) {
        this.processAndRenderMapData(nextProps.pointArray);
      }
    }
  }

  componentDidMount() {
    this.isMapMounted = true;
    this.processAndRenderMapData(this.props.pointArray);
  }

  setCurrentProjection(projectionType) {
    switch (projectionType) {
      case PROJECTION_TYPES.ALBERS_USA:
        this.projection = geoAlbersUsa();
        break;

      case PROJECTION_TYPES.EQUIRECTANGULAR:
        this.projection = geoEquirectangular();
        break;

      default:
        // TODO -> FE logging should be a thing at some point. Maybe a log call
        // to the BE?
        break;
    }
  }

  processAndRenderMapData(plotPointArray) {
    let landFeatures = this.state.landFeatures;
    let boundaryMesh = this.state.boundaryMesh;
    let plotPoints = this.state.plotPoints;

    switch (this.props.currentProjection) {
      case PROJECTION_TYPES.ALBERS_USA:
        if (this.didProjectionTypeChange) {
          landFeatures =
            this.generateLandFeatures(usMapJson,
              MAP_OBJECT_KEYS.ALBERS_USA_LAND_KEYS);
          boundaryMesh =
            this.generateBoundaryMesh(usMapJson,
              MAP_OBJECT_KEYS.ALBERS_USA_BOUNDARY_KEYS);
          this.didProjectionTypeChange = false;
        }
        plotPoints = this.generatePlotPointArray(plotPointArray);
        break;
      case PROJECTION_TYPES.EQUIRECTANGULAR:
        if (this.didProjectionTypeChange) {
          landFeatures =
            this.generateLandFeatures(worldMapJson,
              MAP_OBJECT_KEYS.EQUIRECTANGULAR_LAND_KEYS);
          boundaryMesh =
            this.generateBoundaryMesh(worldMapJson,
              MAP_OBJECT_KEYS.EQUIRECTANGULAR_BOUNDARY_KEYS);
          this.didProjectionTypeChange = false;
        }
        plotPoints = this.generatePlotPointArray(plotPointArray);
        break;
      default:

        // TODO -> FE logging should be a thing at some point. Maybe a log call
        // to the BE?
        break;
    }

    this.setState(() => {
      return {
        landFeatures: landFeatures,
        boundaryMesh: boundaryMesh,
        plotPoints: plotPoints
      };
    });
  }

  generateLandFeatures(jsonData, featureKeys) {
    let featureType = this.extractNestedObjectInJson(jsonData, featureKeys);
    let landFeature = undefined;
    if (featureType !== undefined) {
      let landFeaturePath = this.path(feature(jsonData, featureType));
      let landFeatureProps = {
        className: 'land-features',
        d: landFeaturePath,
        key: LAND_FEATURE_KEY
      };
      landFeature =
        React.createElement(PLOT_POINT_SHAPES.PATH, landFeatureProps);
    }
    return landFeature;
  }

  generateBoundaryMesh(jsonData, boundaryKeys) {
    let boundaryType = this.extractNestedObjectInJson(jsonData, boundaryKeys);
    let boundary = undefined;
    if (boundaryType !== undefined) {
      let boundaryPath = this.path(mesh(jsonData, boundaryType, (a, b) => {
        return a !== b;
      }));
      let boundaryProps = {
        className: 'boundary-mesh',
        d: boundaryPath,
        key: BOUNDARY_MESH_KEY
      };
      boundary = React.createElement(PLOT_POINT_SHAPES.PATH, boundaryProps);
    }
    return boundary;
  }

  generatePlotPointArray(pointArray) {
    let generatedPoints = [];
    if (pointArray !== undefined && pointArray.length > 0) {
      generatedPoints = pointArray.map((longLat, index) => {
        let projectedLongLat = this.projection(
          [longLat.longitude, longLat.latitude]);
        let plotPointProps = {
          className: 'plot-point',
          r: 4,
          cx: projectedLongLat[0],
          cy: projectedLongLat[1],
          key: PLOT_POINT_KEY_BASE + index,
        };
        return React.createElement(PLOT_POINT_SHAPES.CIRCLE, plotPointProps);
      });
    }
    return generatedPoints;
  }

  render() {
    let {landFeatures, boundaryMesh, plotPoints} = this.state;
    let {width, height} = this.props;

    return (
      <div width={width} height={height}>
        <svg width={width} height={height}>
          <g>
            {landFeatures}
            {boundaryMesh}
            {plotPoints}
          </g>
        </svg>
      </div>
    );
  }

  extractNestedObjectInJson(jsonData, keysArray) {
    let subObject = undefined;
    if (jsonData !== undefined && keysArray !== undefined) {
      subObject = jsonData[keysArray[0]];
      if (subObject !== undefined) {
        for (let i = 1; i < keysArray.length; i++) {
          subObject = subObject[keysArray[i]];
        }
      }
    }
    return subObject;
  }

  areArraysEqual(arrayOne, arrayTwo) {
    if (arrayOne.length !== arrayTwo.length) {
      return false;
    }
    for (let i = 0; i < arrayOne.length; i++) {
      if (arrayOne[i] instanceof Array && arrayTwo instanceof Array) {
        if (!this.areArraysEqual(arrayOne[i], arrayTwo[i])) {
          return false;
        }
      }
      else if (arrayOne[i] !== arrayTwo[i]) {
        return false;
      }
    }
    return true;
  }
}

export default TopographicMap;
