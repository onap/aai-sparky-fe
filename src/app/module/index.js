/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2021 AT&T Intellectual Property. All rights reserved.
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

// Import section (used as anchor to add extension imports)
import Browse from '../browse/Browse.jsx';
import SpecializedSearch from '../specializedSearch/SpecializedSearch.jsx';
import Modifications from '../modifications/Modifications.jsx';
import Model from '../model/modelSearch/Model.jsx';
import ModelGallery from '../model/modelSearch/components/ModelGallery.jsx';
import ModelReducer from '../model/modelSearch/ModelReducer.js';
import History from '../model/history/History.jsx';
import HistoryGallery from '../model/history/components/HistoryGallery.jsx';
import HistoryQuery from '../model/history/HistoryQuery.jsx';
import CustomQuery from '../customQuery/CustomQuery.jsx';
import CustomDsl from '../byoq/CustomDsl.jsx';
import CustomDslBuilder from '../byoq/CustomDslBuilder.jsx';

let components = {};
// Components section (used as an anchor to add extension components)
components['ModelGallery'] = ModelGallery;
components['HistoryGallery'] = HistoryGallery;
components['HistoryQuery'] = HistoryQuery;
components['Model'] = Model;
components['ModelReducer'] = ModelReducer;
components['History'] = History;
components['CustomDsl'] = CustomDsl;
components['CustomDslBuilder'] = CustomDslBuilder;
components['Browse'] = Browse;
components['SpecializedSearch'] = SpecializedSearch;
components['Modifications'] = Modifications;
components['CustomQuery'] = CustomQuery;

export default components;
