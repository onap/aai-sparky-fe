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
import React, {Component} from 'react';
import {connect} from 'react-redux';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Brush
} from 'recharts';
import i18n from 'utils/i18n/i18n';

import TopographicMap from 'generic-components/map/TopographicMap.jsx';
import {
  onTopographicMapMounted, onCountByTypeLoad, onLoadTotalCountByDate
} from 'app/inventory/InventoryActions.js';
import {
  INVENTORY_TITLE,
  TOTAL_ENTITY_COUNTS_BY_DATE_CHART,
  COMPLEX_BY_LOCATION_TITLE,
  ENTITIES_BY_TYPE_TITLE,
  TOTAL_ENTITY_COUNT_TITLE
} from 'app/inventory/InventoryConstants.js';
import InlineMessage from 'generic-components/InlineMessage/InlineMessage.jsx';
import PaginatedTable from 'generic-components/paginatedTable/PaginatedTable.jsx';
import {
  dateFormatLocalTimeZoneMMDDYYYY, getTicks, getTicksData, sortDataByField
} from 'utils/DateTimeChartUtil.js';
import TitledContainer from 'generic-components/titledContainer/TitledContainer.jsx';
import {COLOR_BLUE} from 'utils/GlobalConstants.js';

const mapStateToProps = ({inventoryReducer}) => {
  let {
        mapPlotPoints   = [], countByType = [], countByDate = [],
        feedbackMsgText = '', feedbackMsgSeverity = ''
      }                 = inventoryReducer;

  return {
    mapPlotPoints,
    countByType,
    countByDate,
    feedbackMsgText,
    feedbackMsgSeverity
  };
};

const mapActionToProps = (dispatch) => {
  return {
    onMountQueryTopographicVisualization: (requestObject) => {
      dispatch(onTopographicMapMounted(requestObject));
    }, onLoadCountByType: () => {
      dispatch(onCountByTypeLoad());
    }, onLoadTotalCountByDate: () => {
      dispatch(onLoadTotalCountByDate());
    }
  };
};

class Inventory extends Component {

  componentDidMount() {
    let requestObject = {
      entityType: 'complex'
    };
    this.props.onMountQueryTopographicVisualization(requestObject);
    this.props.onLoadCountByType();
    this.props.onLoadTotalCountByDate();
  }

  render() {
    let {
          mapPlotPoints, countByType, onLoadCountByType, countByDate,
          feedbackMsgSeverity, feedbackMsgText
        } = this.props;

    let tableDefinition = {
	    key: {name: 'Entity'},
	    doc_count: {name: 'Count'}
    };
    let paginationClasses = 'audit-pagination';
    let tableClasses =
          'inventory-table table table-striped table-bordered table-condensed';

    const xAxisAttrName = 'date';
    const yAxisAttrName = 'count';
    const sortedData = sortDataByField(countByDate, xAxisAttrName);
    const ticksArr = getTicks(sortedData, xAxisAttrName);
    const completeData = getTicksData(sortedData, ticksArr, xAxisAttrName);
    const completeSortedData = sortDataByField(completeData, xAxisAttrName);

    let totalEntities = 0;
    let lastDate = '';
    if (sortedData.length > 0) {
      lastDate =
        dateFormatLocalTimeZoneMMDDYYYY(sortedData[sortedData.length - 1]
          .date);
      totalEntities = sortedData[sortedData.length - 1].count;
    }

    return (
      <div>
        <div className='secondary-header'>
          <span className='secondary-title'>{i18n(INVENTORY_TITLE)}</span>
          <InlineMessage level={feedbackMsgSeverity}
                         messageTxt={feedbackMsgText}/>
        </div>
        <Grid fluid={true}>
          <Row>
            <Col xs={3} sm={3} md={3}>
              <TitledContainer title={TOTAL_ENTITY_COUNT_TITLE}>
                <div className='total-entity-count'>
                  {totalEntities}
                  <span>{lastDate}</span>
                </div>
              </TitledContainer>
              <TitledContainer title={ENTITIES_BY_TYPE_TITLE}>
                <PaginatedTable
                  tableHeaders={tableDefinition}
                  displayHeader={false}
                  tableData={countByType}
                  activePage={1}
                  pageCount={1}
                  onPageIndexSelected={ () => onLoadCountByType()}
                  paginationClass={paginationClasses}
                  tableClass={tableClasses}
                  maxPaginationLinks={25}/>
              </TitledContainer>
            </Col>
            <Clearfix visibleSmBlock/>
            <Col xs={9} sm={9} md={9}>
              <TitledContainer
                title={i18n(TOTAL_ENTITY_COUNTS_BY_DATE_CHART.title)}>
                <ResponsiveContainer width='100%' height={250}>
                  <LineChart data={completeSortedData}
                             margin={{
                               top: 10, bottom: 10, left: 10, right: 70
                             }}>
                    <XAxis dataKey={xAxisAttrName} ticks={ticksArr}
                           tickCount={ticksArr.length}
                           tickFormatter={dateFormatLocalTimeZoneMMDDYYYY}/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray='3 3'/>
                    <Tooltip labelFormatter={dateFormatLocalTimeZoneMMDDYYYY}/>
                    <Brush dataKey={xAxisAttrName}
                           tickFormatter={dateFormatLocalTimeZoneMMDDYYYY}
                           height={20} stroke={COLOR_BLUE}/>
                    <Line
                      name={i18n(TOTAL_ENTITY_COUNTS_BY_DATE_CHART.yAxisLabel)}
                      type='monotone' dataKey={yAxisAttrName}
                      stroke={COLOR_BLUE}
                      connectNulls={true} activeDot={{r: 6}}/>
                  </LineChart>
                </ResponsiveContainer>
              </TitledContainer>
              <TitledContainer title={i18n(COMPLEX_BY_LOCATION_TITLE)}>
                <TopographicMap pointArray={mapPlotPoints}/>
              </TitledContainer>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionToProps)(Inventory);
