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
import React, { Component } from 'react';
import BrowseGallery from './BrowseGallery.jsx';
import { GlobalExtConstants }  from 'utils/GlobalExtConstants.js';
import {ExportExcel} from 'utils/ExportExcel.js';

let INVLIST = GlobalExtConstants.INVLIST;
let getDescriptionForNodes = ExportExcel.getDescriptionForNodes;

/**
 *  The Browse container is responsible for the browse page in the app.
 *  This container displays all the different node types you can explore,
 *  and provides links to navigate to the Model container where you can explore
 *  specific nodes.
 */

let invList = null;

class Browse extends Component {
  
  render() {
    // Grab the inv list json file, map all the node types and sort it
    const invKeys = Object.keys(INVLIST.INVENTORYLIST);

    invList = invKeys.map(item => {
      return { item: item, detail: INVLIST.INVENTORYLIST[item] };
    });


    invList.sort((a, b) => {
      var displayA = a.detail.display.toLowerCase();
      var displayB = b.detail.display.toLowerCase();

      if (displayA < displayB) {
        return -1;
      }

      if (displayA > displayB) {
        return 1;
      }

      return 0;
    });

    let nodesDesc=getDescriptionForNodes();
    return (
     <div>
        <header className='addPadding jumbotron my-4'>
          <h1 className='display-2'>Browse Network Elements</h1>
          <p className='lead'>
            On this page you have the ability to browse the entire inventory of the database by network element type. Simply choose the network element type you would like to browse.
          </p>
        </header>
        <div className='browse-content'>
          <BrowseGallery
            invList={invList} 
            descriptionList={nodesDesc}/>
        </div>
      </div>
    );
  }
}

export default Browse;
