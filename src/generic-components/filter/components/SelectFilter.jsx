import React, {Component} from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

class SelectFilter extends Component {
	constructor(props) {
		console.log('SelectFilter props',props);
        super(props);
        this.props = props;
        this.state = {dropdownIsOpen : false, isInitialize: true}
    }    
    componentWillReceiveProps (nextProps) {
        console.log('next props componentWillReceiveProps>>>>>>>',nextProps);
        console.log('tihs props componentWillReceiveProps>>>>>>>',this.props);
        if(this.state.isInitialize || this.props.id !== nextProps.id){       
            this.props=nextProps;
            this.setState({isInitialize:false},()=>{this.updateDropDownState();});                 
        }
        console.log('this.state under Update>>>>>',this.state);
    }
    
    handleDropdownValues = (props) => {
        const listItems = Object.keys(props.filterList).map((filter,index) => {
          let filterValue=(props.filterList[index].value)?props.filterList[index].value:props.filterList[index];
          let description=(props.filterList[index].description)?props.filterList[index].description:'';
          return(    
              <MenuItem eventKey={index} key={index} title={description}>{filterValue}</MenuItem>
          );
        }); 
        console.log('listItems',listItems); 
        return (    
          listItems
        );
    };    
    toggleDropdown = () => {
        console.log('toggleDropdown>>>>>',this.state.dropdownIsOpen);
        this.setState({ dropdownIsOpen: !this.state.dropdownIsOpen },()=>{this.updateDropDownState();});
    };
    updateDropDownState = () =>{
        console.log('updateDropDownState',this.state.dropdownIsOpen);
        //document.dispatchEvent(new MouseEvent('click'));dropdownIsOpen
        let id=(this.props.id)? 'dropdown-root-'+this.props.id :'dropdown-root-1'
        if(this.state.dropdownIsOpen){
            document.getElementById(id).getElementsByClassName('dropdown-menu')[0].style.display='block';
        }else{
            document.getElementById(id).getElementsByClassName('dropdown-menu')[0].style.display='none';
        }                
    }
    handleSelect(eventKey, event) {
       Object.keys(this.props.filterList).map((filter,index) => {
           if(eventKey === index){
                let filterValue=(this.props.filterList[index].value)?this.props.filterList[index].value:this.props.filterList[index];
                this.props.onMenuSelect(filterValue,this.props.id)
           }        
       });    
    }
    render(){
        if(this.state.isInitialize){
            this.setState({isInitialize:false},()=>{this.updateDropDownState();});
        }
        return(
            <div id={(this.props.id)? 'dropdown-root-'+this.props.id :'dropdown-root-1'}>
                <DropdownButton
                    bsStyle='primary'
                    title= {(this.props.selectedFilter)? this.props.selectedFilter: this.props.param.filterDisplay}
                    key= '1'
                    id={(this.props.id)? 'dropdown-basic-'+this.props.id :'dropdown-basic-1'} 
                    className='dropdownButton'
                    onToggle={this.toggleDropdown}
                    onSelect={this.handleSelect.bind(this)}                    
                    >
                    { 
                        this.handleDropdownValues(this.props)
                    }           
                </DropdownButton>
            </div>
        );
    }
}
export default SelectFilter;