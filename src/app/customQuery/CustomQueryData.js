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

export const dropDownList = [
  {
    placeholder: 'Vnf Required as Start Node',
    label:'complex-fromVnf',
    value:'complex-fromVnf',
    description: {
      summary: 'The "complex-fromVnf" query allows a client to provide A&AI a vnf name or ID to retrieve the ' +
      'generic-vnf, pserver, complex, licenses, and entitlements.',
      additionalInfo:
      'Input: vnf name or vnf ID\n' +
      'Output: generic-vnf, pserver, complex, licenses, entitlements\n' +
      'Users: SDN-GC, Conductor\n' +
      'Releases: 1707'
    }
  },
  {
    placeholder: 'Vnf Required as Start Node',
    label:'topology-summary',
    value:'topology-summary',
    description: {
      summary: 'The "topology-summary" query allows a client to provide A&AI one or more VNFs and retrieve various data ' +
      'related to that VNF. This includes data about the VNF itself (the generic-vnf), the related vnfc, the related ' +
      'vserver (along with the tenant, cloud-region, image and flavor) and the related pserver (along with the complex).',
      additionalInfo:
      'Input: generic-vnf, The original intent was to pass all generic-vnfs with a specified service-id. ' +
      '(adding owning-entity, project, platform and line-of-business in 1810 as first step to depreciating service-id)\n' +
      'Output: the generic-vnf, related platform, line-of-business (1810), related owning-entity, project (from related ' +
      'service-instance) (1810), related vnfc, related vserver, tenant, cloud-region, image, flavor, related pserver, ' +
      'complex\n' +
      'Users: AOTS, GEOLINK, DCAE-Sandbox, POLO\n' +
      'Releases: 1702, 1810'
    }
  },
  {
    placeholder: 'Pserver Required as Start Node',
    label:'service-fromPserverandSubsName',
    value:'service-fromPserverandSubsName',
    reqPropPlaceholder:'subscriberName=Enter some value here',
    description: {
      summary: 'The "service-fromPServerandSubsName" query allows a client to provide A&AI a hostname and subscriber ' +
      'name, then return service instance and service subscription information.',
      additionalInfo:
      'Input: hostname and subscriber-name\n' +
      'Output: service-instance and service-subscription\n' +
      'Users: MSO\n' +
      'Releases: 1710'
    }
  },
  {
    placeholder: 'Vnf Required as Start Node',
    label:'cloudRegion-fromNfType',
    value:'cloudRegion-fromNfType',
    description: {
      summary: 'The "cloudRegion-fromNfType" query allows a client to provide A&AI with an nf-type and returns the ' +
      'cloud-regions running those vnfs.',
      additionalInfo:
      'Input: nf-type\n' +
      'Output: cloud-region\n' +
      'Users: vIPR\n' +
      'Releases: 1710'
    }
  },
  {
    placeholder: 'Need Pserver as Start Node',
    label:'colocated-devices',
    value:'colocated-devices',
    description: {
      summary: 'The "colocated-devices" query allows a client to provide A&AI a physical server and retrieves all other ' +
      'physical devices in the same location along with details on their physical interfaces and links.',
      additionalInfo:
      'Input: pserver\n' +
      'Output: pservers, pnfs, p-interfaces, physical-links\n' +
      'Users: SDN-GCP\n' +
      'Releases: 1707'
    }
  },
  {
    placeholder: 'Need Cloud Region as Start Node',
    label: 'locationNetTypeNetRole-fromCloudRegion',
    value: 'locationNetTypeNetRole-fromCloudRegion',
    description: {
      summary: 'The "locationNetTypeNetRole-fromCloudRegion" query allows a client to provide A&AI with a ' +
      'cloud-region-id and returns the cloud-region, complex, and l3-networks.',
      additionalInfo:
      'Input: cloud-region-id\n' +
      'Output: cloud-region, complex, l3-network\n' +
      'Users: vIPR\n' +
      'Releases: 1710'
    }
  },
  {
    placeholder: 'Need Cloud Region as Start Node',
    label:'sites-byCloudRegionId',
    value:'sites-byCloudRegionId',
    description: {
      summary: 'The "sites-byCloudRegionId " query allows a client to provide A&AI with a cloud-region-id and an ' +
      'optional cloud-region-version and returns the appropriate complexes.',
      additionalInfo:
      'Input: cloud-region-id, optional cloud-region-version\n' +
      'Output: complex object(s)\n' +
      'Users: POLICY\n' +
      'Releases: 1707'
    }
  },
  {
    placeholder: 'Need Cloud Region as Start Node',
    label:'cloudRegion-fromCountry',
    value:'cloudRegion-fromCountry',
    description: {
      summary: 'The "cloudRegion-fromCountry" query allows a client to provide A&AI with a country and retrieve all ' +
      'appropriate cloud-regions.',
      additionalInfo:
      'Input: country\n' +
      'Output: cloud-region\n' +
      'Users: vIPR\n' +
      'Releases: 1710'
    }
  },
  {
    placeholder: 'Need vf-module as Start Node',
    label:'so-request-vfModule',
    value:'so-request-vfModule',
    description: {
      summary: 'The "so-request-vfModule" query allows a client to provide A&AI a vf-module then return all the ' +
      'reference objects needed to send MSO an orchestration request.',
      additionalInfo:
      'Input: vf-module\n' +
      'Output: vf-module, generic-vnf, service-instance, volume-group, cloud-region\n' +
      'Users: VID\n' +
      'Releases: E1802'
    }
  },
  {
    placeholder: 'Need Vnf as Start Node',
    label:'linked-devices',
    value:'linked-devices',
    description: {
      summary: 'The "linked-devices" query allows a client to provide A&AI a generic-vnf, vserver, or newvce and ' +
      'retrieve all connected generic-vnfs, vservers, and newvces.',
      additionalInfo:
      'Input: generic-vnf, vserver, or newvces\n' +
      'Output: all connected generic-vnfs, vservers, and newvces\n' +
      'Users: POLO\n' +
      'Releases: E1802'
    }
  },
  {
    placeholder: 'Need ucpe-instance as Start Node',
    label:'ucpe-instance',
    value:'ucpe-instance',
    description: {
      summary: 'The "ucpe-instance" query allows a client to provide A&AI a physical server or physical network device, ' +
      'using the hostname, and retrieve the device and the complex it is located in. This includes the pserver or pnf ' +
      'itself and the complex.',
      additionalInfo:
      'Input: pserver or pnf, Using pserver hostname or pnf pnf-name to identify the starting node is preferred.\n' +
      'Output: the pserver or pnf, related complex\n' +
      'Users: SNIRO\n' +
      'Releases: 1702'
    }
  }
];
