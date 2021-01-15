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
