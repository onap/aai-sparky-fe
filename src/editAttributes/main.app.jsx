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
import React from 'react';
import ReactDOM from 'react-dom';

import 'resources/scss/bootstrap.scss';
import 'resources/css/font-awesome.min.css';
import 'resources/scss/style.scss';

import Application from './Application.jsx';
import SetAttribute from './EditAttributes.jsx';

ReactDOM.render(
		<Application><SetAttribute /></Application>,
		document.getElementById('set-attribute-app'));