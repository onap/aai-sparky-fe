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
import Modal from 'react-bootstrap/lib/Modal';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Spinner from 'utils/SpinnerContainer.jsx';

let PAGINATION_CONSTANT = GlobalExtConstants.PAGINATION_CONSTANT;
let PAGINATION_RESULTS = PAGINATION_CONSTANT.RESULTS_PER_PAGE;

class DownloadRangeModel extends Component {
  constructor(props){
    super(props); 
    let totalPages = Math.ceil(this.props.totalResults/PAGINATION_RESULTS);
    let defaultCount = (totalPages < 10)? totalPages : 10;
    let defaultPageRange = defaultCount*PAGINATION_RESULTS;
    this.state = {
      defaultPageCount : defaultCount,
      downloadType: 'defaultPage',
      totalPages:totalPages,
      limitTotalPages:defaultCount,
      startPageCount:'',
      endPageCount:'',
      defaultPageError:false,
      downloadPageRangeError:false,
      defaultPageErrorMsg:'',
      downloadPageRangeErrorMsg:'',
      showDownloadResultsModal:this.props.showDownloadResultsModal, 
      triggerDownload:this.props.triggerDownload,
      triggerClose:this.props.triggerClose,
      totalResults: this.props.totalResults,
      errorDownloadResults:this.props.errorDownloadResults,
      downloadErrorMsg:this.props.downloadErrorMsg,
      pageRange:defaultPageRange,
      enableBusyFeedback: this.props.enableModelBusyFeedback
    }; 
  };   
  componentDidMount(){
    console.log('DownloadRange component  mount');    
  };
  componentWillReceiveProps(nextProps){
    console.log('DownloadRange component  componentWillReceiveProps',nextProps);
    let totalPages = Math.ceil(nextProps.totalResults/PAGINATION_RESULTS);
    let defaultCount = (totalPages < 10)? totalPages : 10;
    let defaultPageRange = defaultCount*PAGINATION_RESULTS;
    this.setState({
      showDownloadResultsModal:nextProps.showDownloadResultsModal, 
      errorDownloadResults:nextProps.errorDownloadResults,
      downloadErrorMsg:nextProps.downloadErrorMsg,
      enableBusyFeedback: nextProps.enableModelBusyFeedback,
      totalPages:totalPages,
      limitTotalPages:defaultCount,
      defaultPageCount: defaultCount
    });
  }    
  renderError = (errorMsg) => {    
    return(
        <Row className='show-grid topBottomMargin'>
          <span className='label badge-pill label-danger topBottomMargin pre-wrap-text'><strong>Error</strong>: {errorMsg}</span>
        </Row>
      );
  };
  onInputDataChange = (event) =>{
    let name=event.target.name;
    let value= (event.target.value !== '')? parseInt(event.target.value): '';
    this.onDataValidate(name,value);
  }
  onDataValidate =(name,value) =>{
    console.log('DownloadRangeModel onDataValidate>>>>>>',this.state);
    let pageCount=1;
    let msg='';
    let totalCount = 0;
    let totalResultsCount=0;
    if(name === 'defaultPageCount'){
      if(isNaN(value)){
        msg = 'Please enter valid input as Number';
      }else if(value <= 0){        
        msg = 'Please enter valid page count From 1 to ' + this.state.limitTotalPages;
      }else if(value > this.state.limitTotalPages ){
        msg = 'Please enter valid page count From 1 to ' + this.state.limitTotalPages+'.The maximum download is limited to '+this.state.limitTotalPages +' pages at a time';
      }
      if(msg === ''){
          pageCount=value*PAGINATION_RESULTS;
          console.log('Before setting state defaultPageCount>>>>>',value);
          this.setState({defaultPageCount:value,pageRange:pageCount,defaultPageError:false,defaultPageErrorMsg:'',disableDownloadBtn:false});
      }else if(msg !== ''){
        this.setState({defaultPageCount:event.target.value,defaultPageError:true,defaultPageErrorMsg:msg,disableDownloadBtn:true});
      }
    }else if(name === 'startPageCount'){      
      if(isNaN(value)){
        msg = 'Please enter valid input as Number';
      }   
      if(msg === ''){
        console.log('Before setting state startPageCount>>>>>',value);        
        this.setState({startPageCount:value,downloadPageRangeError:false,downloadPageRangeErrorMsg:'',disableDownloadBtn:false},function(){this.onDataValidate('rangeValidation')}.bind(this));
      }else{
        this.setState({downloadPageRangeError:true,downloadPageRangeErrorMsg:msg,disableDownloadBtn:true});
      }     
    }else if(name === 'endPageCount'){
      if(isNaN(value)){
        msg = 'Please enter valid input as Number';
      }
      if(msg === ''){
        console.log('Before setting state endPageCount>>>>>',value);
        this.setState({endPageCount: value,downloadPageRangeError: false, downloadPageRangeErrorMsg: '',disableDownloadBtn:false},function(){this.onDataValidate('rangeValidation')}.bind(this));        
      }else{
        this.setState({downloadPageRangeError:true,downloadPageRangeErrorMsg:msg,disableDownloadBtn:true});
      }
    }
    if(name === 'rangeValidation'){
      let startCount = this.state.startPageCount;
      startCount=(startCount === '')? 0:parseInt(startCount);
      let endCount = this.state.endPageCount;
      endCount=(endCount === '')? 0:parseInt(endCount);
      if(startCount <= 0 || endCount <= 0 || startCount > this.state.totalPages || endCount > this.state.totalPages || startCount > endCount || endCount < startCount){
        msg = 'Please enter a valid page range from 1 to '+ this.state.totalPages +'.The maximum download is limited to '+ this.state.limitTotalPages +' pages at a time';
      }else{
        totalCount = this.state.endPageCount - this.state.startPageCount + 1;
        totalResultsCount=totalCount*PAGINATION_RESULTS;
        if(totalCount > 10){
          msg = 'The maximum download is limited to '+ this.state.limitTotalPages +' pages at a time. Please adjust your input to continue';
        }
      }   
      if(msg !== ''){
        this.setState({downloadPageRangeError:true,downloadPageRangeErrorMsg:msg,disableDownloadBtn:true});
      }else{       
        pageCount=this.state.startPageCount + '-' + this.state.endPageCount;
        this.setState({disableDownloadBtn: false, pageRange: pageCount});
      }
    } 
  };
  setSelectTypeOfDownload = (event) =>{
    console.log('DownloadRange:setSelectTypeOfDownload',event.target.value);
    let totalPages=parseInt(this.state.totalPages); 
    let pageCount=0;   
    if (event.target.value === 'downloadPageRange'){
      this.setState(
        {defaultPageCount : (totalPages < 10)? totalPages : 10,startPageCount:'',endPageCount:'',downloadType:event.target.value,downloadPageRangeError:false,defaultPageError:false,disableDownloadBtn:true, downloadErrorMsg:'', errorDownloadResults:false}
       );
    }else{
      pageCount= (totalPages < 10)? totalPages*PAGINATION_RESULTS : 10*PAGINATION_RESULTS;
      this.setState({defaultPageCount : (totalPages < 10)? totalPages : 10, startPageCount:'',endPageCount:'',pageRange:pageCount,downloadType:event.target.value,downloadPageRangeError:false,defaultPageError:false,disableDownloadBtn:false, downloadErrorMsg:'',errorDownloadResults:false});
    } 
  }
  submitDownloadResults = () =>{
    console.log('DownloadRange:submitDonwloadResults',this.state);    
    this.props.triggerDownload(this.state.pageRange,true);    
  }
  closeDownloadResults = () =>{
    console.log('DownloadRange:closeDownloadReults');
    this.props.triggerClose(); 
  }
  render(){ 
    console.log('downloadRange:this.state>>>>>>>>>>>*',this.state); 
    return(
        <div id='downloadPagePane' className='addPadding customDsl'>
          <div className='static-modal'>
            <Modal show={this.state.showDownloadResultsModal} onHide={this.closeDownloadResults}>
              <Modal.Header>
                <Modal.Title>Download Results</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h4>Your result set has <strong>{this.state.totalPages}</strong> pages</h4>
                {this.state.errorDownloadResults && (<div>{this.renderError(this.state.downloadErrorMsg)}</div>)}
                <form id='downloadRangeForm' name='downloadRangeForm'>
                  <div className="radio">
                    <label>
                      <input type="radio" value="defaultPage"
                              checked={this.state.downloadType === 'defaultPage'}
                              onChange={(e) => this.setSelectTypeOfDownload(e)} />                     
                      <input type='number' size='8' name='defaultPageCount'
                              onBlur={(event) => this.onInputDataChange(event)} 
                              placeholder='Default Page Count' 
                              value={this.state.defaultPageCount}
                              disabled={!(this.state.downloadType === 'defaultPage')}
                              onChange={(event) => this.onInputDataChange(event)} />
                      <span>pages</span>
                    </label>
                    {this.state.defaultPageError && (<div>{this.renderError(this.state.defaultPageErrorMsg)}</div>)}
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio"  value="downloadPageRange"
                              checked={this.state.downloadType === 'downloadPageRange'}
                              onChange={(e) => this.setSelectTypeOfDownload(e)} />
                      From 
                      <span><input type='number' size='8' name='startPageCount'
                              onBlur={(event) => this.onInputDataChange(event)} 
                              placeholder='Start Page'
                              disabled={!(this.state.downloadType === 'downloadPageRange')}
                              value={this.state.startPageCount}                             
                              onChange={(event) => this.onInputDataChange(event)} /></span>
                      <span>To</span>
                      <span><input type='number' size='8' name='endPageCount'
                              onBlur={(event) => this.onInputDataChange(event)} 
                              placeholder='End Page' 
                              value={this.state.endPageCount}
                              disabled={!(this.state.downloadType === 'downloadPageRange')}                              
                              onChange={(event) => this.onInputDataChange(event)} /></span>
                      <span>pages</span>
                    </label>
                    {this.state.downloadPageRangeError && (<div>{this.renderError(this.state.downloadPageRangeErrorMsg)}</div>)}
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeDownloadResults}>Close</Button>
                <Button onClick={this.submitDownloadResults} disabled={this.state.disableDownloadBtn}>Download</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
    );
  }
}
export default DownloadRangeModel;
