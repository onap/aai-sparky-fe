import React, { Component } from 'react';
import { ClipLoader } from 'react-spinners';
import {COLOR_BLUE} from 'utils/GlobalConstants.js';

class SpinnerContainer extends Component {
  render() {
    // if loading, show content as busy (ex: grey out)
    const spinnerContentClass = this.props.loading ? 'spinner-content' : '';
    return (
      <div className='spinner-container'>
        <div className='spinner'>
          <ClipLoader color={COLOR_BLUE} loading={this.props.loading} />
        </div>
        <div className={spinnerContentClass}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default SpinnerContainer;

SpinnerContainer.propTypes = {
  loading: React.PropTypes.bool
};

SpinnerContainer.defaultProps = {
  loading: false
};

