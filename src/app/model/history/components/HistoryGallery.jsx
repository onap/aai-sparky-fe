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
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import HistoryEntry from './HistoryEntry.jsx';
/**
 * This function will take all of the node objects and turn them into
 * a ui grid of HistoryCard components. This function is essentially a container
 * for the HistoryCards
 * @param props
 * @returns {*}
 */
const HistoryGallery = (props) => {

    let entries = null;
    if (props.entries && props.entries.length > 0) {
        entries = props.entries.map((entry, idx) => {
        return (
          <HistoryEntry
            key={idx}
            triggerState={props.triggerState}
            entryKey={entry.key}
            entryType={entry.type}
            entryValue={entry.value}
            entryBody= {entry.body}
            entryHeader= {entry.header}
            entrySOT={entry.sot}
            entryAction= {entry.action}
            entryEpoch= {entry.timeRank}
            entryNodeId= {props.nodeId}
            entryDate={entry.displayTimestamp}
            entryTransId = {entry['tx-id']}/>
        );
      });
    }else{
        return (<p>No History</p>);
    }

    return (
      <div className="list-group">
        {entries}
      </div>
    );
};

export default HistoryGallery;