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

const languages = [
  {
	name: 'C',
	year: 1972
  },
  {
	name: 'C#',
	year: 2000
  },
  {
	name: 'C++',
	year: 1983
  },
  {
	name: 'Clojure',
	year: 2007
  },
  {
	name: 'Elm',
	year: 2012
  },
  {
	name: 'Go',
	year: 2009
  },
  {
	name: 'Haskell',
	year: 1990
  },
  {
	name: 'Java',
	year: 1995
  },
  {
	name: 'Javascript',
	year: 1995
  },
  {
	name: 'Perl',
	year: 1987
  },
  {
	name: 'PHP',
	year: 1995
  },
  {
	name: 'Python',
	year: 1991
  },
  {
	name: 'Ruby',
	year: 1995
  },
  {
	name: 'Scala',
	year: 2003
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
	<span>{suggestion.name}</span>
  );
}

class Test extends React.Component {
  constructor() {
	super();

	this.state = {
	  value: '',
	  suggestions: getSuggestions('')
	};

	this.onChange = this.onChange.bind(this);
	this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  onChange(event, { newValue, method }) {
	this.setState({
	  value: newValue
	});
  }

  onSuggestionsUpdateRequested({ value }) {
	this.setState({
	  suggestions: getSuggestions(value)
	});
  }

  render() {
	const { value, suggestions } = this.state;
	const inputProps = {
	  placeholder: "Type 'c'",
	  value,
	  onChange: this.onChange
	};

	return (
	  <Autosuggest suggestions={suggestions}
				   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
				   shouldRenderSuggestions={() => true}
				   getSuggestionValue={getSuggestionValue}
				   renderSuggestion={renderSuggestion}
				   inputProps={inputProps} />
	);
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
