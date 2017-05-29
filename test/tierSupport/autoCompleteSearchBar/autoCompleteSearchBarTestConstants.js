/*
 * ============LICENSE_START=======================================================
 * SPARKY (AAI UI service)
 * ================================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ================================================================================
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
 * ============LICENSE_END=========================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

const validResponseJsonForRequestFromFetchWithHitsType1 = {
	"took": 5,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 9376,
		"max_score": 3.3899312,
		"hits": [
			{
				"_index": "entitysearchindex-localhost",
				"_type": "aaiEntities",
				"_id": "4785c7ec8ae11be12ca742248713346ea03a473ef65aa84bbea102c67fa5d",
				"_score": 3.3899312,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1",
					"searchTagIDs": "0",
					"searchTags": "service-instance-id=a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1"
				}
			},
			{
				"_index": "entitysearchindex-localhost",
				"_type": "aaiEntities",
				"_id": "8e9baedcbf1cb2f9439f6b8b5eeaf0b8fa364086c8ef5ee6edcf6f5da114",
				"_score": 3.1589103,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "d1f3c3be-7a7f-42ea-a9ac-ca20af1588b8",
					"searchTagIDs": "0",
					"searchTags": "service-instance-id=d1f3c3be-7a7f-42ea-a9ac-ca20af1588b8"
				}
			},
			{
				"_index": "entitysearchindex-localhost",
				"_type": "aaiEntities",
				"_id": "dd4bdbf810f5c1bc7be7d91f241b0221d75617a45f574f2ed6207e9c8ceb9e",
				"_score": 3.147036,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "6c27a7cb-d8e1-45a8-aa12-61a694201cca",
					"searchTagIDs": "0",
					"searchTags": "service-instance-id=6c27a7cb-d8e1-45a8-aa12-61a694201cca"
				}
			},
			{
				"_index": "entitysearchindex-localhost2",
				"_type": "aaiEntities",
				"_id": "4785c7ec8ae11be12ca742248713346ea03a473ef65aa84bbea102c67fa5d",
				"_score": 3.3899312,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1",
					"searchTagIDs": "0",
					"searchTags": "service-instance-id=a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1"
				}
			},
			{
				"_index": "entitysearchindex-localhost2",
				"_type": "aaiEntities",
				"_id": "8e9baedcbf1cb2f9439f6b8b5eeaf0b8fa364086c8ef5ee6edcf6f5da114",
				"_score": 3.1589103,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "d1f3c3be-7a7f-42ea-a9ac-ca20af1588b8",
					"searchTagIDs": "0",
					"searchTags": "service-instance-id=d1f3c3be-7a7f-42ea-a9ac-ca20af1588b8"
				}
			},
			{
				"_index": "entitysearchindex-localhost2",
				"_type": "aaiEntities",
				"_id": "dd4bdbf810f5c1bc7be7d91f241b0221d75617a45f574f2ed6207e9c8ceb9e",
				"_score": 3.147036,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "6c27a7cb-d8e1-45a8-aa12-61a694201cca",
					"searchTagIDs": "0",
					"searchTags": "service-instance-id=6c27a7cb-d8e1-45a8-aa12-61a694201cca"
				}
			}
		]
	}
};

const validResponseJsonForRequestFromFetchWithHitsType2 = {
	"took": 5,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 9376,
		"max_score": 3.3899312,
		"hits": [
			{
				"_index": "entitysearchindex-localhost",
				"_type": "aaiEntities",
				"_id": "4785c7ec8ae11be12ca742248713346ea03a473ef65aa84bbea102c67fa5d",
				"_score": 3.3899312,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"entityPrimaryKeyValue": "a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1",
					"searchTagIDs": "0",
					"searchTags": "hostname-id=a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1"
				}
			},
			{
				"_index": "entitysearchindex-localhost",
				"_type": "aaiEntities",
				"_id": "8e9baedcbf1cb2f9439f6b8b5eeaf0b8fa364086c8ef5ee6edcf6f5da114",
				"_score": 3.1589103,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "d1f3c3be-7a7f-42ea-a9ac-ca20af1588b8",
					"searchTagIDs": "0",
					"searchTags": "hostname-id=d1f3c3be-7a7f-42ea-a9ac-ca20af1588b8"
				}
			},
			{
				"_index": "entitysearchindex-localhost",
				"_type": "aaiEntities",
				"_id": "dd4bdbf810f5c1bc7be7d91f241b0221d75617a45f574f2ed6207e9c8ceb9e",
				"_score": 3.147036,
				"_source": {
					"entityType": "service-instance",
					"edgeTagQueryEntityFieldName": "service-instance.service-instance-id",
					"edgeTagQueryEntityFieldValue": "6c27a7cb-d8e1-45a8-aa12-61a694201cca",
					"searchTagIDs": "0",
					"searchTags": "hostname-id=6c27a7cb-d8e1-45a8-aa12-61a694201cca"
				}
			}
		]
	}
};

const validResponseJsonForRequestFromFetchWithOutHits = {
	"took": 5,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 0,
		"max_score": 3.3899312,
		"hits": []
	}
};

const networkError = {
	"error": "Network Error"
};

const validResponseJsonForNodeSearchFromFetchWithHits = {
	"graphMeta":{},
	"nodes" : [ {
		"id" : "service-instance.PRUCPEHOST0627002",
		"itemType" : "service-instance",
		"itemNameKey" : "service-instance.PRUCPEHOST0627002",
		"itemNameValue" : "PRUCPEHOST0627002",
		"itemProperties" : {
			"resource-version" : "1467233099",
			"service-instance-id" : "PRUCPEHOST0627002"
		},
		"nodeMeta" : {
			"className" : "selectedSearchedNodeClass",
			"nodeDebug" : null,
			"selfLinkResponseTimeInMs" : 131,
			"relationshipNode" : false,
			"searchTarget" : true,
			"enrichableNode" : false
		}
	} ]
};

const inValidResponseJsonForNodeSearchFromFetchWithHits = {
	"graphMeta":{},
	"nodes" : []
};

const nodeSearchKeyword = 'service-instance-id=a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1';
const nodeSearchKeywordWithOutEqualSign = 'a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1';
const multipleNodeSearchKeyword = 'service-instance-id=a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1, service-instance-id=a162a2a2-ea7e-4e94-afc3-e9d064a3c2a1';
const mockRequestTimeOut = 1;
export default{
	validResponseJsonForRequestFromFetchWithHitsType1: validResponseJsonForRequestFromFetchWithHitsType1,
	validResponseJsonForRequestFromFetchWithHitsType2: validResponseJsonForRequestFromFetchWithHitsType2,
	validResponseJsonForRequestFromFetchWithOutHits: validResponseJsonForRequestFromFetchWithOutHits,
	networkError: networkError,
	validResponseJsonForNodeSearchFromFetchWithHits: validResponseJsonForNodeSearchFromFetchWithHits,
	inValidResponseJsonForNodeSearchFromFetchWithHits: inValidResponseJsonForNodeSearchFromFetchWithHits,
	nodeSearchKeyword: nodeSearchKeyword,
	nodeSearchKeywordWithOutEqualSign: nodeSearchKeywordWithOutEqualSign,
	multipleNodeSearchKeyword: multipleNodeSearchKeyword,
	mockRequestTimeOut: mockRequestTimeOut
};
