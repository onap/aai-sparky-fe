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


export default {
  createNodeAttributes: () => {
    return {
      className: 'node'
    };
  },
  createShapeAttributes: () => {
    return {
      r: 3
    };
  },
  createCircleStyle: () => {
    return {
      fill: 'rgb(98, 102, 104)',
      stroke: 'rgb(78, 82, 84)',
      strokeWidth: 1
    };
  },
  createLinkAttributes: () => {
    return {
      className: 'link',
      x1: 50,
      y1: 50,
      x2: 100,
      y2: 500,
    };
  },
  createLineStyle: () => {
    return {
      stroke: 'rgb(217, 218, 218)',
      strokeWidth: 1
    };
  },
  createTestCircle: () => {
    return React.createElement('circle', {
      cx: '100',
      cy: '100',
      r: '15',
      fill: 'rgb(255, 255, 255)',
      stroke: 'rgb(98, 102, 104)',
      strokeWidth: '3'
    });
  },
  getNodeLinkArray: () => {
    return {
      'graphMeta': {
        'aaiEntityNodeDescriptors': {
          'generalNodeClass': {
            'class': 'aai-entity-node general-node',
            'visualElements': [
              {
                'type': 'circle',
                'class': 'outer',
                'svgAttributes': {
                  'r': '16'
                }
              },
              {
                'type': 'circle',
                'class': 'inner',
                'svgAttributes': {
                  'r': '10'
                }
              },
              {
                'type': 'text',
                'class': 'id-type-label',
                'displayKey': 'itemType',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '33'
                  }
                }
              },
              {
                'type': 'text',
                'class': 'id-value-label',
                'displayKey': 'itemNameValue',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '48'
                  }
                }
              }
            ]
          },
          'searchedNodeClass': {
            'class': 'aai-entity-node search-node',
            'visualElements': [
              {
                'type': 'circle',
                'class': 'outer',
                'svgAttributes': {
                  'r': '16'
                }
              },
              {
                'type': 'circle',
                'class': 'inner',
                'svgAttributes': {
                  'r': '10'
                }
              },
              {
                'type': 'text',
                'class': 'id-type-label',
                'displayKey': 'itemType',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '33'
                  }
                }
              },
              {
                'type': 'text',
                'class': 'id-value-label',
                'displayKey': 'itemNameValue',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '48'
                  }
                }
              }
            ]
          },
          'selectedSearchedNodeClass': {
            'class': 'aai-entity-node selected-search-node',
            'visualElements': [
              {
                'type': 'circle',
                'class': 'outer',
                'svgAttributes': {
                  'r': '31'
                }
              },
              {
                'type': 'circle',
                'class': 'inner',
                'svgAttributes': {
                  'r': '20'
                }
              },
              {
                'type': 'text',
                'class': 'id-type-label',
                'displayKey': 'itemType',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '48'
                  }
                }
              },
              {
                'type': 'text',
                'class': 'id-value-label',
                'displayKey': 'itemNameValue',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '63'
                  }
                }
              },
              {
                'type': 'button',
                'name': 'icon_ellipses',
                'class': 'node-button',
                'shapeAttributes': {
                  'offset': {
                    'x': '33',
                    'y': '-35'
                  }
                },
                'svgAttributes': {
                  'className': 'node-button',
                  'r': '10'
                }
              },
              {
                'type': 'button',
                'name': 'icon_triangle_warning',
                'class': 'node-button',
                'shapeAttributes': {
                  'offset': {
                    'x': '46',
                    'y': '-12'
                  }
                },
                'svgAttributes': {
                  'className': 'node-button',
                  'r': '10'
                }
              }
            ]
          },
          'selectedNodeClass': {
            'class': 'aai-entity-node selected-node',
            'visualElements': [
              {
                'type': 'circle',
                'class': 'outer',
                'svgAttributes': {
                  'r': '31'
                }
              },
              {
                'type': 'circle',
                'class': 'inner',
                'svgAttributes': {
                  'r': '20'
                }
              },
              {
                'type': 'text',
                'class': 'id-type-label',
                'displayKey': 'itemType',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '48'
                  }
                }
              },
              {
                'type': 'text',
                'class': 'id-value-label',
                'displayKey': 'itemNameValue',
                'shapeAttributes': {
                  'offset': {
                    'x': '0',
                    'y': '63'
                  }
                }
              },
              {
                'type': 'button',
                'name': 'icon_ellipses',
                'class': 'node-button',
                'shapeAttributes': {
                  'offset': {
                    'x': '33',
                    'y': '-35'
                  }
                },
                'svgAttributes': {
                  'className': 'node-button',
                  'r': '10'
                }
              },
              {
                'type': 'button',
                'name': 'icon_triangle_warning',
                'class': 'node-button',
                'shapeAttributes': {
                  'offset': {
                    'x': '46',
                    'y': '-12'
                  }
                },
                'svgAttributes': {
                  'className': 'node-button',
                  'r': '10'
                }
              }
            ]
          }
        },
        'numNodes': 6,
        'numLinks': 5,
        'renderTimeInMs': 4550,
        'numLinksResolvedSuccessfullyFromCache': 0,
        'numLinksResolvedSuccessfullyFromServer': 7,
        'numLinkResolveFailed': 0
      },
      'nodes': [{
        'id': 'TRINITY-PSERVER',
        'itemType': 'pserver',
        'itemNameKey': 'pserver.TRINITY-PSERVER',
        'itemNameValue': 'TRINITY-PSERVER',
        'itemProperties': {
          'hostname': 'TRINITY-PSERVER',
          'in-maint': 'false',
          'resource-version': '1455590484'
        },
        'nodeMeta': {
          'className': 'selectedSearchedNodeClass',
          'nodeDebug': null,
          'selfLinkResponseTimeInMs': 628,
          'relationshipNode': false,
          'searchTarget': true,
          'enrichableNode': false,
          'nodeValidated': true,
          'nodeIssue': true
        }
      }, {
        'id': 'TRINITYSIL',
        'itemType': 'complex',
        'itemNameKey': 'complex.TRINITYSIL',
        'itemNameValue': 'TRINITYSIL',
        'itemProperties': {
          'country': 'USA',
          'postal-code': '07748',
          'city': 'Middletown',
          'physical-location-id': 'TRINITYSIL',
          'resource-version': '1459957457',
          'street1': 'Trinity',
          'state': 'NJ',
          'physical-location-type': 'Trinity',
          'region': 'US'
        },
        'nodeMeta': {
          'className': 'generalNodeClass',
          'nodeDebug': null,
          'selfLinkResponseTimeInMs': 644,
          'relationshipNode': false,
          'searchTarget': false,
          'enrichableNode': false,
          'nodeValidated': true,
          'nodeIssue': false
        }
      }, {
        'id': 'c385bb3e-6ebd-4898-bc92-792e0ac2db50',
        'itemType': 'vserver',
        'itemNameKey': 'vserver.c385bb3e-6ebd-4898-bc92-792e0ac2db50',
        'itemNameValue': 'c385bb3e-6ebd-4898-bc92-792e0ac2db50',
        'itemProperties': {
          'in-maint': 'false',
          'resource-version': '1475160142',
          'vserver-name': 'bems0001vm001',
          'prov-status': 'ACTIVE',
          'vserver-id': 'c385bb3e-6ebd-4898-bc92-792e0ac2db50',
          'vserver-name2': 'bems0001vm001bem001-1452',
          'vserver-selflink': 'TRINITY vserverLink',
          'is-closed-loop-disabled': 'false'
        },
        'nodeMeta': {
          'className': 'generalNodeClass',
          'nodeDebug': null,
          'selfLinkResponseTimeInMs': 2633,
          'relationshipNode': false,
          'searchTarget': false,
          'enrichableNode': false
        }
      }, {
        'id': '7c73d776-001d-4042-a958-37f2e419ed10',
        'itemType': 'vserver',
        'itemNameKey': 'vserver.7c73d776-001d-4042-a958-37f2e419ed10',
        'itemNameValue': '7c73d776-001d-4042-a958-37f2e419ed10',
        'itemProperties': {
          'resource-version': '1477075390',
          'vserver-name': 'nsbg0001vm002',
          'prov-status': 'NVTPROV',
          'vserver-id': '7c73d776-001d-4042-a958-37f2e419ed10',
          'vserver-name2': 'VM-19631',
          'vserver-selflink': 'TRINITY vserverLink'
        },
        'nodeMeta': {
          'className': 'generalNodeClass',
          'nodeDebug': null,
          'selfLinkResponseTimeInMs': 2368,
          'relationshipNode': false,
          'searchTarget': false,
          'enrichableNode': false
        }
      }, {
        'id': 'fc6be93d-915e-4034-a8f9-463b70130614',
        'itemType': 'vserver',
        'itemNameKey': 'vserver.fc6be93d-915e-4034-a8f9-463b70130614',
        'itemNameValue': 'fc6be93d-915e-4034-a8f9-463b70130614',
        'itemProperties': {
          'resource-version': '1477075398',
          'vserver-name': 'nsbg0001vm004',
          'prov-status': 'NVTPROV',
          'vserver-id': 'fc6be93d-915e-4034-a8f9-463b70130614',
          'vserver-name2': 'VM-19630',
          'vserver-selflink': 'TRINITY vserverLink'
        },
        'nodeMeta': {
          'className': 'generalNodeClass',
          'nodeDebug': null,
          'selfLinkResponseTimeInMs': 2621,
          'relationshipNode': false,
          'searchTarget': false,
          'enrichableNode': false
        }
      }, {
        'id': '8555c2ed-6818-43c5-8cf5-cd36b0169031',
        'itemType': 'vserver',
        'itemNameKey': 'vserver.8555c2ed-6818-43c5-8cf5-cd36b0169031',
        'itemNameValue': '8555c2ed-6818-43c5-8cf5-cd36b0169031',
        'itemProperties': {
          'resource-version': '1477075396',
          'vserver-name': 'nsbg0001vm003',
          'prov-status': 'NVTPROV',
          'vserver-id': '8555c2ed-6818-43c5-8cf5-cd36b0169031',
          'vserver-name2': 'VM-19629',
          'vserver-selflink': 'TRINITY vserverLink'
        },
        'nodeMeta': {
          'className': 'generalNodeClass',
          'nodeDebug': null,
          'selfLinkResponseTimeInMs': 2663,
          'relationshipNode': false,
          'searchTarget': false,
          'enrichableNode': false
        }
      }],
      'links': [{
        'id': 'TRINITY-PSERVER_TRINITYSIL',
        'source': 'TRINITY-PSERVER',
        'target': 'TRINITYSIL'
      }, {
        'id': 'TRINITY-PSERVER_c385bb3e-6ebd-4898-bc92-792e0ac2db50',
        'source': 'TRINITY-PSERVER',
        'target': 'c385bb3e-6ebd-4898-bc92-792e0ac2db50'
      }, {
        'id': 'TRINITY-PSERVER_7c73d776-001d-4042-a958-37f2e419ed10',
        'source': 'TRINITY-PSERVER',
        'target': '7c73d776-001d-4042-a958-37f2e419ed10'
      }, {
        'id': 'TRINITY-PSERVER_fc6be93d-915e-4034-a8f9-463b70130614',
        'source': 'TRINITY-PSERVER',
        'target': 'fc6be93d-915e-4034-a8f9-463b70130614'
      }, {
        'id': 'TRINITY-PSERVER_8555c2ed-6818-43c5-8cf5-cd36b0169031',
        'source': 'TRINITY-PSERVER',
        'target': '8555c2ed-6818-43c5-8cf5-cd36b0169031'
      }]
    };
  }
};
