/*
 * ============LICENSE_START===================================================
 * SPARKY (AAI UI service)
 * ============================================================================
 * Copyright © 2017 AT&T Intellectual Property.
 * Copyright © 2017 Amdocs
 * All rights reserved.
 * ============================================================================
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
 * ============LICENSE_END=====================================================
 *
 * ECOMP and OpenECOMP are trademarks
 * and service marks of AT&T Intellectual Property.
 */

import React, {Component} from 'react';
import classNames from 'classnames';




class TreeNode extends Component {


  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toggle = () => {
    this.setState({visible: !this.state.visible});
  };

  render() {
    var childNodes;
    var classObj;
    if (this.props.node !== undefined && this.props.node.childNodes !== undefined) {
      childNodes = this.props.node.childNodes.map(function (node, index) {
        return <li key={index}><TreeNode node={node}/></li>;
      });

      classObj = {
        togglable: true,
        'togglable-down': this.state.visible,
        'togglable-up': !this.state.visible
      };
    }

    var style;
    if (!this.state.visible) {
      style = {display: 'none'};
    }

    return (
			<div>
				<h7 onClick={this.toggle} className={classNames(classObj)}>
					{this.props.node.title}
				</h7>
				<ul style={style} className='node-tree'>
					{childNodes}
				</ul>
			</div>
    );
  }
}

export default TreeNode;
