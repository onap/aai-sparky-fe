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
import Select from 'react-select';

class MultiSelectDropDown extends Component {
  constructor(props) {
	super(props); 
	this.state = {
		options:[],
		displayValue:'Category'
	  };    
  }
  componentDidMount(){
    console.log('MultiSelectDropDown component  mount');    
  };
  componentWillReceiveProps(nextProps){
	console.log('MultiSelectDropDown component  componentWillReceiveProps',nextProps);
	this.setState({
		options:nextProps.options,
		displayValue:nextProps.displayValue,
		triggerSelect:nextProps.triggerSelect,
	  });
  }
  render() {    
    return (	
	 	 		<Select
					className='dropdown-item basic-multi-select'
					placeholder={this.state.displayValue}
					onChange={this.state.triggerSelect}
					options={this.state.options} 
					isMulti
    			classNamePrefix="select"
				/>
    );
  }
}
export default MultiSelectDropDown;
