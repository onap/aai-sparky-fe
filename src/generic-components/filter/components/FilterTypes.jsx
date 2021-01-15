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
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
var filterTypeList = GlobalExtConstants.FILTER_TYPES;

class FilterTypes extends Component {
	constructor(props) {
		console.log('FilterTypes props>>>>',props);
        super(props);
        this.props = props;
        this.state = {dropdownIsOpen : false, isInitialize: true}
    }
    componentWillReceiveProps (nextProps) {
        console.log('next props componentWillReceiveProps>>>>>>>',nextProps);
        console.log('tihs props componentWillReceiveProps>>>>>>>',this.props);
        if(this.state.isInitialize || this.props !== nextProps){    
            this.props=nextProps;           
            this.setState({isInitialize:false}, ()=>{this.updateDropDownState();});                 
        }
        console.log('this.state under Update>>>>>',this.state);
    }
    handleDropdownValues = (props) => {
        const listItems = Object.keys(filterTypeList).map((filter,index) => {
          return(    
              <MenuItem 
                      eventKey={index} 
                      key={filter}> 
                      {filterTypeList[index]} 
              </MenuItem>
          );
        }); 
        return (    
          listItems
        );
    };
    toggleDropdown = () => {
        console.log('toggleDropdown>>>>>',this.state.dropdownIsOpen);
        this.setState({ dropdownIsOpen: !this.state.dropdownIsOpen },()=>{this.updateDropDownState()});
    };
    updateDropDownState = () =>{
        console.log('updateDropDownState',this.state.dropdownIsOpen);
        //document.dispatchEvent(new MouseEvent('click'));
        let id=(this.props.id)? 'dropdown-root-'+this.props.id :'dropdown-root-2'
        if(this.state.dropdownIsOpen){
            document.getElementById(id).getElementsByClassName('dropdown-menu')[0].style.display='block';
        }else{
            document.getElementById(id).getElementsByClassName('dropdown-menu')[0].style.display='none';
        }        
    }
    handleSelect(eventKey, event) {
        Object.keys(filterTypeList).map((filter,index) => {
            if(eventKey === index){
                this.props.onMenuSelect(filterTypeList[index],this.props.id)
            }        
        });     
     }
    render(){
        if(this.state.isInitialize){
            this.setState({isInitialize:false},()=>{this.updateDropDownState();});
        }
        return(
            <div id={(this.props.id)? 'dropdown-root-'+this.props.id :'dropdown-root-2'}>
                <DropdownButton
                    bsStyle='primary'
                    title= {(this.props.selectedFilter)? this.props.selectedFilter: this.props.param.filterTypeDisplay}
                    key= '2'
                    id={(this.props.id)? 'dropdown-basic-'+this.props.id :'dropdown-basic-2'} 
                    className='dropdownButton'
                    onToggle={this.toggleDropdown} 
                    disabled={(this.props.state)?this.props.state:false} 
                    onSelect={this.handleSelect.bind(this)}  >
                    { 
                        this.handleDropdownValues(this.props)
                    }
                </DropdownButton>
            </div>
        )
    }
}
export default FilterTypes;
