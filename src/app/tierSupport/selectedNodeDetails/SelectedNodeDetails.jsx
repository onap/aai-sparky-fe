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
import {connect} from 'react-redux';
import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import Table from 'react-bootstrap/lib/Table';
import LaunchInContext from 'app/tierSupport/launchExternalResource/LaunchExternalResource.jsx';
import i18n from 'utils/i18n/i18n';
import {
  SELECTED_NODE_TITLE,
  NO_SELECTION,
  SELECTED_NODE_TABLE_COLUMN_NAMES
} from 'app/tierSupport/selectedNodeDetails/SelectedNodeDetailsConstants.js';

let mapStateToProps = ({tierSupport: {selectedNodeDetails}}) => {
  let {nodeData = {}, nodeType = '', uid = ''} = selectedNodeDetails;

  return {
    nodeData,
    nodeType,
    uid
  };
};

export class SelectedNodeDetails extends Component {
  static propTypes = {
    nodeData: PropTypes.object,
    nodeType: PropTypes.string,
    uid: PropTypes.string
  };

  render() {
    const {nodeData, nodeType, uid} = this.props;

    let tableClass = 'ts-selected-node-table';
    let noSelectionMessageClass = 'hidden';
    let tableColumns = [];
    let tableRows = [];

    if (Object.keys(nodeData).length > 0) {
      let cellClassName = '';
      for (let i = 1; i <= SELECTED_NODE_TABLE_COLUMN_NAMES.length; i++) {
        cellClassName = (i % 2 ? 'left-column-cell' : 'right-column-cell');
        tableColumns.push(<th className={cellClassName} key={i}>
          {i18n(SELECTED_NODE_TABLE_COLUMN_NAMES[i - 1])}
        </th>);
      }

      for (var key in nodeData) {
        let value = nodeData[key];
        tableRows.push(
          <tr key={key}>
            <td className='left-column-cell'>{key}</td>
            <td className='right-column-cell'>{value}</td>
          </tr>
        );
      }
    } else {
      tableClass = 'hidden';
      noSelectionMessageClass = '';
    }

    return (
      <div className='ts-selected-node-details'>
        <h1>{i18n(SELECTED_NODE_TITLE)}</h1>
        <h2>{nodeType}</h2>
        <span>{uid} <LaunchInContext /></span>
        <Table bsClass={tableClass}>
          <thead>
          <tr>
            {tableColumns}
          </tr>
          </thead>
          <tbody>
          {tableRows}
          </tbody>
        </Table>
        <p className={noSelectionMessageClass}>{i18n(NO_SELECTION)}</p>
      </div>
    );
  }
}
export default connect(mapStateToProps)(SelectedNodeDetails);
