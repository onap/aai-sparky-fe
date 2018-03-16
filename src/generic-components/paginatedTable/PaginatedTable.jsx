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

import Pagination from 'react-bootstrap/lib/Pagination';
import Table from 'react-bootstrap/lib/Table';

const MAX_PAGE_LINKS = 5;

export default class PaginatedTable extends Component {

  static propTypes = {
    tableHeaders: React.PropTypes.object,
    tableData: React.PropTypes.array,
    activePage: React.PropTypes.number,
    pageCount: React.PropTypes.number,
    onPageIndexSelected: React.PropTypes.func,
    paginationClass: React.PropTypes.string,
    tableClass: React.PropTypes.string,
    displayHeader: React.PropTypes.bool,
    maxPaginationLinks: React.PropTypes.number
  }

  static defaultProps = {
    tableHeaders: '',
    tableData: [],
    activePage: 1,
    pageCount: 1,
    displayHeader: true,
    maxPaginationLinks: MAX_PAGE_LINKS,
    tableClass: 'table table-striped table-bordered table-condensed'
  };

  render() {
    let {tableHeaders,
          tableData,
          activePage,
          pageCount,
          onPageIndexSelected,
          paginationClass,
          maxPaginationLinks,
          tableClass,
          displayHeader} = this.props;
    let paginationClasses = (pageCount > 1)
      ? paginationClass
      : paginationClass +
                            ' hidden';
    let header = [];

    let indexForKeys = 0;
    let createIndexForKey = () => {
      indexForKeys = indexForKeys + 1;
      let newIndex = indexForKeys;
      return newIndex;
    };

    if (displayHeader) {
      let tableColumns = [];
      for (var columnName in tableHeaders) {
        tableColumns.push(
          <th key={tableHeaders[columnName].name + '_' + createIndexForKey()}>
             {tableHeaders[columnName].name}
          </th>);
      }
      header.push(<thead key={'header_' + createIndexForKey()}>
      <tr key={'header_row_' + createIndexForKey()}>
        {tableColumns}
      </tr>
      </thead>);
    }

    return (
      <div>
        <Table bsClass={tableClass}>
          {header}
          <tbody>
          { tableData.map((rowData) => {
            let tableRow = [];
            for (var columnName in tableHeaders) {
	            let columnClassName = '';
	            if(tableHeaders[columnName].hasOwnProperty('className')){
		            columnClassName = tableHeaders[columnName].className;
	            }
              tableRow.push(
                <td key={columnName + '_' + createIndexForKey()} className={columnClassName}>
                  {rowData[columnName]}
                </td>);
            }
            return (
              <tr key={'row_' + createIndexForKey()}>{tableRow}</tr>
            );
          })}
          </tbody>
        </Table>

        <div className={paginationClasses}>
          <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            bsSize='large'
            items={pageCount}
            maxButtons={maxPaginationLinks}
            onSelect={(event) => onPageIndexSelected(event)}
            activePage={activePage}/>
        </div>
      </div>
    );
  }
}
