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
import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import {Button} from 'react-bootstrap';
import AutoSuggest from 'react-autosuggest';
import Highlighter from 'react-highlight-words';
import debounce from 'lodash.debounce';
import {ButtonGroup} from 'react-bootstrap';
import Modal from 'react-bootstrap/lib/Modal';
import {Link} from 'react-router-dom';
import {genericRequest} from 'app/networking/NetworkCalls.js';

import {changeUrlAddress} from 'utils/Routes.js';

import {
  ICON_CLASS_SEARCH,
  ICON_CLASS_CLEAR,
  ICON_CLASS_HELP,
  SEARCH_DEBOUNCE_TIME,
  NO_MATCHES_FOUND,
  SEARCH_PLACEHOLDER_TEXT
} from './AutoCompleteSearchBarConstants.js';

export default class AutoCompleteSearchBar extends Component {
  static propTypes = {
    value: PropTypes.string,
    suggestions: PropTypes.array,
    cachedSuggestions: PropTypes.array,
    suggestionName: PropTypes.string
  };

  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      helpModalShow: false,
      searchable: []
    };
  };

  componentWillMount() {
    this.debouncedLoadSuggestions =
      debounce(this.props.onSuggestionsFetchRequested, SEARCH_DEBOUNCE_TIME);
  }

  onSuggestionsFetchRequested = ({value}) => {
    this.debouncedLoadSuggestions({value});
  };

  isValidSearch(value) {
    return (value && value !== NO_MATCHES_FOUND);
  }

  isValidSuggestionObject(suggestionObj) {
    return (suggestionObj &&
    Object.keys(suggestionObj).length > 0 &&
    this.isValidSearch(suggestionObj.text));
  }

  getSelectedSuggestionObj(value, cachedSuggestions) {
    let matchesSuggestion = {};

    if (this.isValidSearch(value)) {
      for (let suggestionIndex in cachedSuggestions) {
        if (cachedSuggestions[suggestionIndex].text === value) {
          matchesSuggestion = cachedSuggestions[suggestionIndex];
          break;
        }
      }
    }

    return matchesSuggestion;
  }

  newSearchSelected(
    cachedSuggestion, invalidSearchCallback, dispatchAnalytics, value) {
    if (this.isValidSuggestionObject(cachedSuggestion)) {
      changeUrlAddress(cachedSuggestion, this.props.history);
      //Call analytics if defined
      if (dispatchAnalytics) {
        dispatchAnalytics();
      }
    } else {
      invalidSearchCallback(value);
    }
  }

  render() {
    const {
      value, suggestions,
      suggestionName, cachedSuggestions,
      onInputChange, onInvalidSearch,
      onClearSuggestionsTextFieldRequested,
      onSuggestionsClearRequested,
      dispatchAnalytics
    } = this.props;
    const inputProps = {
      placeholder: SEARCH_PLACEHOLDER_TEXT,
      value,
      onChange: onInputChange
    };

    let closeHelpModal = () => {
      this.setState({helpModalShow: false});
    };
    let showHelpModal = () => {
      genericRequest('/schema/searchable', true, 'GET').then(res=>{
        let searchDOM =  res.sort(function(a, b) {
          var compareA = (a['node-type']).toLowerCase();
          var compareB = (b['node-type']).toLowerCase();
          if(compareA < compareB){
            return -1;
          };
          if(compareA > compareB){
            return 1;
          };
          return 0;
        }).map((prop) => {
          return (
            <div><p><strong>{prop['node-type']}:</strong></p><p>{prop['searchable-attributes']}</p></div>
          );
        });
        this.setState({searchable: searchDOM, helpModalShow: true});
      }, error => {
        console.log(error);
        this.setState({searchable: 'An error occurred, please try again later.', helpModalShow: true});
      }).catch(error => {
        console.log(error);
        this.setState({searchable: 'An error occurred, please try again later.', helpModalShow: true});
      });
    };

    let clearButtonClass = (value.length > 0)
      ? 'auto-complete-clear-button'
      : 'auto-complete-clear-button hidden';

    return (
      <div className='auto-complete-search'>
        <AutoSuggest
          suggestions={suggestions}
          getSuggestionValue={suggestion => suggestion[suggestionName]}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={(event, {suggestion}) => {
            this.newSearchSelected(suggestion, onInvalidSearch, dispatchAnalytics, value);
            this.props.onClearSuggestionsTextFieldRequested();
          }}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          focusFirstSuggestion={false}
          renderSuggestionsContainer={this.renderSuggestionsContainer}/>
        <ButtonGroup className='auto-complete-search-button-group'>
          <Button type='submit' className={clearButtonClass}
            onClick={onClearSuggestionsTextFieldRequested}>
            <i className={ICON_CLASS_CLEAR} aria-hidden='true'/>
          </Button>
          <Button type='submit' className='auto-complete-help-button' onClick={showHelpModal}>
            <i className={ICON_CLASS_HELP} aria-hidden='true'/>
          </Button>
          <Button type='submit' className='auto-complete-search-button' onClick={() => {
            this.newSearchSelected(this.getSelectedSuggestionObj(value, cachedSuggestions),
              onInvalidSearch, dispatchAnalytics, value);
            this.props.onSuggestionsClearRequested();
          }}>
            <i className={ICON_CLASS_SEARCH} aria-hidden='true'/>
          </Button>
        </ButtonGroup>
        <div className='static-modal'>
          <Modal show={this.state.helpModalShow} onHide={closeHelpModal}>
            <Modal.Header>
            	<Modal.Title>Searchable Fields</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='modal-searchable'>
                {this.state.searchable}
              </div>
            </Modal.Body>
            <Modal.Footer>
            	<Button onClick={closeHelpModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

  renderSuggestion(suggestion, {query}) {
    let toHighLightArray = query.split(' ');
    let suggestionTextArray = suggestion.text.split(' ');
    let arrayIndex = 0;

    if (suggestion.text !== NO_MATCHES_FOUND) {
      // render the suggestion as a clickable link
      return (
        <div className='suggestionFlexContainer'>
        <span key={'sugSpan1'}
              className='suggestionColumnTwo'>
          <Link style={{textDecoration: 'none'}}
                to={'/' + suggestion.route + '/' + suggestion.hashId}
                replace={true}>
            {suggestionTextArray.map(
              function () {
                return (
                  <span key={arrayIndex + 'sugSpan3'}>
                    <Highlighter key={arrayIndex + 'high'}
                                 highlightClassName='highlight'
                                 searchWords={toHighLightArray}
                                 textToHighlight={suggestionTextArray[arrayIndex]}
                                 autoEscape={true}/>
                    { ++arrayIndex ? ' ' : ' '}
                 </span>);

              })} </Link>
      </span>
        </div>
      );
    } else {
      // render the suggestion as plain text
      return (
        <div className='suggestionFlexContainer'>
          <span key={'sugSpan1'}
                className='suggestionColumnTwo'>
              {suggestionTextArray.map(
                function () {
                  return (
                    <span key={arrayIndex + 'sugSpan3'}>
                      <Highlighter key={arrayIndex + 'high'}
                                   highlightClassName='highlight'
                                   searchWords={toHighLightArray}
                                   textToHighlight={suggestionTextArray[arrayIndex]}
                                   autoEscape={true}/>
                      { ++arrayIndex ? ' ' : ' '}
                   </span>);

                })}
          </span>
        </div>
      );
    }
  }

  renderSuggestionsContainer({children, ...rest}) {
    if (children !== null && children.props.items.length < 5) {
      rest.className = 'react-autosuggest__suggestions-containerCopy';
    }
    return (
      <div {...rest.containerProps} {...rest}>
        {children}
      </div>
    );
  }
}
