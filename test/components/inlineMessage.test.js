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

import { expect } from 'chai';
import React from 'react';
import TestUtils from 'react-dom/lib/ReactTestUtils';
import InlineMessage from 'generic-components/InlineMessage/InlineMessage.jsx';
import InlineMessageConstants from 'generic-components/InlineMessage/InlineMessageConstants.js';

describe('Core Inline Message Suite', function() {

  let _successMessage;
  let _warningMessage;
  let _dangerMessage;
  let _defaultMessage;

  beforeEach(function() {
    _warningMessage = TestUtils.renderIntoDocument(<InlineMessage level='warning' messageTxt='Warning Message' />);
    _successMessage = TestUtils.renderIntoDocument(<InlineMessage level='success' messageTxt='Success Message' />);
    _dangerMessage = TestUtils.renderIntoDocument(<InlineMessage level='danger' messageTxt='Danger Message' />);
    _defaultMessage = TestUtils.renderIntoDocument(<InlineMessage level='info' messageTxt='Info Message' />);
  });

	// test structure
  it('Inline Message - validate success message panel', function() {
    let alertPanel = TestUtils.findRenderedDOMComponentWithClass(_successMessage, 'alert');
    expect(alertPanel).to.exist; // alert panel exists
    let alertPanel_style = TestUtils.findRenderedDOMComponentWithClass(_successMessage, 'alert-success');
    expect(alertPanel_style).to.exist; // alert panel has proper styling
    let messagePanel = TestUtils.findRenderedDOMComponentWithClass(_successMessage, InlineMessageConstants.MESSAGE_PANEL_CLASSNAME);
    expect(messagePanel).to.exist;
    expect(messagePanel.innerHTML).to.have.string('Success Message'); // messagePanel panel has proper message
    let iconPanel = TestUtils.findRenderedDOMComponentWithClass(_successMessage, InlineMessageConstants.ICON_PANEL_CLASSNAME);
    expect(iconPanel).to.exist;
    expect(iconPanel.innerHTML).to.have.string(InlineMessageConstants.SUCCESS_CLASSNAME); // notification panel has proper styling
  });
  it('Inline Message - validate info message panel', function() {
    let alertPanel = TestUtils.findRenderedDOMComponentWithClass(_defaultMessage, 'alert');
    expect(alertPanel).to.exist; // alert panel exists
    let alertPanel_style = TestUtils.findRenderedDOMComponentWithClass(_defaultMessage, 'alert-info');
    expect(alertPanel_style).to.exist; // alert panel has proper styling
    let messagePanel = TestUtils.findRenderedDOMComponentWithClass(_defaultMessage, InlineMessageConstants.MESSAGE_PANEL_CLASSNAME);
    expect(messagePanel).to.exist;
    expect(messagePanel.innerHTML).to.have.string('Info Message'); // messagePanel panel has proper message
    let iconPanel = TestUtils.findRenderedDOMComponentWithClass(_defaultMessage, InlineMessageConstants.ICON_PANEL_CLASSNAME);
    expect(iconPanel).to.exist;
    expect(iconPanel.innerHTML).to.have.string(InlineMessageConstants.DEFAULT_CLASSNAME); // icon panel has proper styling
  });
  it('Inline Message - validate warning message panel', function() {
    let alertPanel = TestUtils.findRenderedDOMComponentWithClass(_warningMessage, 'alert');
    expect(alertPanel).to.exist; // alert panel exists
    let alertPanel_style = TestUtils.findRenderedDOMComponentWithClass(_warningMessage, 'alert-warning');
    expect(alertPanel_style).to.exist; // alert panel has proper styling
    let messagePanel = TestUtils.findRenderedDOMComponentWithClass(_warningMessage, InlineMessageConstants.MESSAGE_PANEL_CLASSNAME);
    expect(messagePanel).to.exist;
    expect(messagePanel.innerHTML).to.have.string('Warning Message'); // messagePanel panel has proper message
    let iconPanel = TestUtils.findRenderedDOMComponentWithClass(_warningMessage, InlineMessageConstants.ICON_PANEL_CLASSNAME);
    expect(iconPanel).to.exist;
    expect(iconPanel.innerHTML).to.have.string(InlineMessageConstants.WARNING_CLASSNAME); // icon panel has proper styling
  });
  it('Inline Message - validate danger message panel', function() {
    let alertPanel = TestUtils.findRenderedDOMComponentWithClass(_dangerMessage, 'alert');
    expect(alertPanel).to.exist; // alert panel exists
    let alertPanel_style = TestUtils.findRenderedDOMComponentWithClass(_dangerMessage, 'alert-danger');
    expect(alertPanel_style).to.exist; // alert panel has proper styling
    let messagePanel = TestUtils.findRenderedDOMComponentWithClass(_dangerMessage, InlineMessageConstants.MESSAGE_PANEL_CLASSNAME);
    expect(messagePanel).to.exist;
    expect(messagePanel.innerHTML).to.have.string('Danger Message'); // messagePanel panel has proper message
    let iconPanel = TestUtils.findRenderedDOMComponentWithClass(_dangerMessage, InlineMessageConstants.ICON_PANEL_CLASSNAME);
    expect(iconPanel).to.exist;
    expect(iconPanel.innerHTML).to.have.string(InlineMessageConstants.DANGER_CLASSNAME); // icon panel has proper styling
  });
});
