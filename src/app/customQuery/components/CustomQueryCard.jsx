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

const customQueryCard = (props) => {

  console.log('[Custom Query Card] props : ', props);
  const properties = Object.keys(props.nodeProps).map( (prop, idx) => {
    return (
      <p key={idx}><strong> {prop} : </strong> { props.nodeProps[prop]} </p>
    );
  });

  return (
    <Col lg={3} md={3} sm={4}>
      <div className='card model-card'>
        <div className='card-header'>
          Node {props.nodeId}
        </div>
        <div className='card-content model-card-content'>
          {properties}
        </div>
      </div>
    </Col>
  );
};

export default customQueryCard;
