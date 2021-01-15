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

import React, {Component} from 'react';
import ModelGallery from 'app/modelSearch/components/ModelGallery.jsx';
import testData from 'app/CustomQueryMultiNode';

class testGallery extends Component {

  state = {
    nodes: [],
    multipleNodes: '',
    isLoading: 'show'
  }

  componentWillMount () {
    this.processData(testData);
  }



  processData = (data) => {
    console.log('Response data' + JSON.stringify(data));
    if (data && data.results) {
      //this.nodes = data.results;
      this.setState({
        nodes: data.results
      });

      this.multipleNodes = this.state.nodes.length > 1;
    }
    if (data && data.headers && data.headers.get('total-results')) {
      this.modelService.setTotalResults(data.headers.get('total-results'));
    }
    this.setState({
      isLoading: 'hidden'
    });
  }

  render() {

    let nodes = '';
    if ( this.state.nodes.length > 0 ) {

      console.log('nodes exist');

      nodes =
        (<div className='model-container'>
          <ModelGallery
            nodes={this.state.nodes}/>
        </div>);
    }

    return(
      <div className='multipleNodes'>
        <div className={!this.state.isLoading}>
          <div className='col align-self-cemter'>
            <fa name='cog' className='fa-5x fa-spin'></fa>
          </div>
        </div>
        <div className={!this.state.isLoading}>
          <h2>{this.header}</h2>
          <div className='nodes container-fluid'>
            <div className='row-dsl'>
              {nodes}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default testGallery;
