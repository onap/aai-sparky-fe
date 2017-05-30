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

import {combineReducers, createStore, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import GlobalAutoCompleteSearchBarReducer from 'app/globalAutoCompleteSearchBar/GlobalAutoCompleteSearchBarReducer.js';
import TierSupportReducer from 'app/tierSupport/TierSupportReducer.js';
import MainScreenWrapperReducer from './MainScreenWrapperReducer.js';
import InventoryReducer from './inventory/InventoryReducer.js';
import DynamicViewLoaderReducer from 'generic-components/dynamicViewLoader/DynamicViewLoaderReducer.js';
import VnfSearchReducer from './vnfSearch/VnfSearchReducer.js';
import GlobalInlineMessageBarReducer from 'app/globalInlineMessageBar/GlobalInlineMessageBarReducer.js';

function createCompose() {
  return window.devToolsExtension
    ?
         compose(applyMiddleware(thunkMiddleware), window.devToolsExtension())
    : applyMiddleware(thunkMiddleware);
}

export const storeCreator = (initialState) => createStore(
  combineReducers({
    mainWrapper: MainScreenWrapperReducer,
    globalAutoCompleteSearchBarReducer:  GlobalAutoCompleteSearchBarReducer,
    tierSupport: TierSupportReducer,
    inventoryReducer: InventoryReducer,
    dynamicViewReducer: DynamicViewLoaderReducer,
    vnfSearch: VnfSearchReducer,
    globalInlineMessageBar: GlobalInlineMessageBarReducer
  }),
  initialState,
  createCompose()
);


const store = storeCreator();

export default store;
