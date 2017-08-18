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
export const PROJECTION_TYPES = {
  ALBERS_USA: 'ALBERS_USA',
  EQUIRECTANGULAR: 'EQUIRECTANGULAR'
};

export const PLOT_POINT_SHAPES = {
  CIRCLE: 'circle',
  PATH: 'path'
};

export const PLOT_POINT_KEY_BASE = 'mapPlotPoint_';
export const LAND_FEATURE_KEY = 'mapLandFeature';
export const BOUNDARY_MESH_KEY = 'mapBoundaryMesh';

export const MAP_OBJECT_KEYS = {
  ALBERS_USA_LAND_KEYS: ['objects', 'states'],
  ALBERS_USA_BOUNDARY_KEYS: ['objects', 'states'],
  EQUIRECTANGULAR_LAND_KEYS: ['objects', 'land'],
  EQUIRECTANGULAR_BOUNDARY_KEYS: ['objects', 'countries']
};
