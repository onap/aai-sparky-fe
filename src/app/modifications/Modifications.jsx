/*
 * ============LICENSE_START=======================================================
 * org.onap.aai
 * ================================================================================
 * Copyright © 2017-2018 AT&T Intellectual Property. All rights reserved.
 * Copyright © 2017-2018 Amdocs
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */
import React, {Component} from 'react';
import {GlobalExtConstants} from 'utils/GlobalExtConstants.js';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Panel from 'react-bootstrap/lib/Panel';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import Spinner from 'utils/SpinnerContainer.jsx';

let INVLIST = GlobalExtConstants.INVLIST;
let OXM = GlobalExtConstants.OXM;

let invList = null;

class Modifications extends Component {

  state = {
            file:null,
            enableBusyFeedback: false,
            enableUploadFeedback: false,
            showResults: false,
            errorResults: true
          };

  constructor(){
    super();
  }
  componentDidMount(){
  };
  addValidationError = (baseString, sheetName, row, validationError) => {
    return baseString += 'Error occurred on worksheet ' + sheetName + ' at Row ' + row + ' '
            + validationError + '\n';
  }
  uploadedFile = (e) => {
      this.setState({enableUploadFeedback: true,enableBusyFeedback:false,showResults:false,errorResults:false});
      let reader = new FileReader();
      let file = e.target.files[0];
      let wb = new Excel.Workbook();
      var columnHeaders = [];
      var jsonPayload = [];
      reader.onload= () => {
            const buffer = reader.result;
            var validationErrors = {};
                wb.xlsx.load(buffer).then(workbook => {
                  workbook.eachSheet(function(worksheet, sheetId) {
                                      worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                                      if(rowNumber === 1){
                                        for(var j = 1;j <= row.values.length; j++){
                                            columnHeaders[sheetId + '-' + j ] = row.values[j];
                                        }
                                      }else{
                                        var obj = {};
                                        obj.properties = {};
                                        obj['node-type'] = worksheet.name;
                                        for(var j = 1;j <= row.values.length; j++){
                                            if(['uri','action'].indexOf(columnHeaders[sheetId + '-' + j ]) > -1){
                                                obj[columnHeaders[sheetId + '-' + j ]] = row.values[j];
                                                if(!row.values[j] || row.values[j] === ""){

                                                }else if (columnHeaders[sheetId + '-' + j ] === 'action'
                                                    && ['DELETE','UPDATE', 'ADD'].indexOf((row.values[j]).toUpperCase()) === -1 ){
                                                    validationErrors = this.addValidationError(validationErrors,
                                                        worksheet.name, j, 'Action needs to be DELETE, UPDATE, or ADD');
                                                }
                                            }else if(columnHeaders[sheetId + '-' + j ] !== 'relationship-list'){
                                                obj.properties[columnHeaders[sheetId + '-' + j ]] = row.values[j];
                                            }
                                        }
                                        jsonPayload.push(obj);
                                      }
                                      console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
                                      });
                       console.log(JSON.stringify(jsonPayload));
                  });
                  this.setState({enableUploadFeedback: false});
                });

      }
      if((file.name).endsWith(".xls") || (file.name).endsWith(".xlsx")){
        reader.readAsArrayBuffer(file);
      }else{
        var error = {};
        error.validationMsg =  "Please upload a valid file, valid files are .xslx and .xsl only."
        triggerError(error);
        this.setState({enableUploadFeedback: false});
      }
  }
  onFileSubmit = () => {
    this.setState({enableBusyFeedback:true,showResults:false,errorResults:false});
  }
  triggerError = (error) => {
     console.error('[Modifications.jsx] error : ', JSON.stringify(error));
     this.setState({
            enableBusyFeedback: false,
         	showResults: false,
         	errorResults: true
       });
      let errMsg = '';
      if(error.validationMsg){
        errMsg = error.validationMsg;
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        if(error.response.status){
            errMsg += " Code: " + error.response.status;
        }
   	    if(error.response.data){
            errMsg += " - " + JSON.stringify(error.response.data);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        errMsg += " - Request was made but no response received";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        errMsg += " - Unknown error occurred " + error.message;
      }
      //Suppress Error Message when 404 results not found occur
      if(error.response && error.response.status === 404){
           this.setState({errorMessage:'', errorResults:false});
      }else{
           this.setState({errorMessage:errMsg});
      }
   }
  render = () => {
    return(
      <div>
          <div id='modifications'>
                <header className='addPadding jumbotron my-4'>
                    <h1 className='display-2'>Modifications Page</h1>
                    <p className='lead'>
                      On this page you have the ability to make modifications to the data by uploading a xslx.
                    </p>
                </header>
                <Grid fluid={true} className='model-container'>
                    <Spinner loading={this.state.enableUploadFeedback}>
                        <Row>
                            <form className="addPadding" onSubmit={this.onFileSubmit}>
                                  <div className="row justify-content-center mb-2">
                                       <input onChange={this.uploadedFile} type="file" id="excelFile" accept=".xlsx, .xls"/>
                                       <button type="submit" className="btn btn-sm btn-info">Send</button>
                                   </div>
                            </form>
                        </Row>
                    </Spinner>
                    <Spinner loading={this.state.enableBusyFeedback}>
                         <Row>
                           <div className={'addPaddingTop alert alert-danger ' +(this.state.errorResults ? 'show' : 'hidden')} role="alert">
                               An error occurred, please try again later. If this issue persists, please contact the system administrator. {this.state.errorMessage}
                           </div>
                         </Row>
                         <Row>
                           <div className={'addPaddingTop alert alert-success ' +(this.state.showResults ? 'show' : 'hidden')} role="alert">
                               The updates were made successfully.
                           </div>
                         </Row>
                    </Spinner>
                </Grid>
          </div>
      </div>
    );
  }
 }
export default Modifications;
