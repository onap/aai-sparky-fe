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

import React from 'react';
import ModelNodeCard from './ModelNodeCard.jsx';

const modelNodeGallery = (props) => {

  const cards = props.nodes.map(node => {
    console.log('[Model Node Gallery] : ', node);
    return (
      <ModelNodeCard
        key={node.id}
        nodeId={node.id}
        nodeType={node['node-type']}
        nodeProps={node.properties}
        nodeRelatives={node['related-to']}
        nodeUrl={node.url}/>
    );
  });

  return (
    <div>
      {cards}
    </div>
  );
};

export default modelNodeGallery;
