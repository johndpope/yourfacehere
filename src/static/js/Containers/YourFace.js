import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Uploader from './YourFace/Uploader';
import SelectSplash from './YourFace/SelectSplash';
import SplashLoading from '../Components/YourFace/SplashLoading';
import FinalFaceMerge from './YourFace/FinalFaceMerge';
import {initSession, AVAILABLE_STATES } from '../actions';


class YourFace extends React.Component {
  componentDidMount() {    
    this.props.dispatch(initSession())
  }

  render(){
    const {
      currentState
    } = this.props;
    if (currentState === AVAILABLE_STATES.UPLOAD ) {
      return <Uploader />
    } else if (currentState === AVAILABLE_STATES.UPLOADING){ 
      return <p>Uploading and stuff...</p>
    } else if (currentState === AVAILABLE_STATES.LOADING_SPLASH) {
      return <SplashLoading />
    } else if (currentState === AVAILABLE_STATES.SELECT_SPLASH) {
      return <SelectSplash />
    } else if(currentState === AVAILABLE_STATES.MERGING) {
      return <p>Merging and stuff</p>
    } else if (currentState === AVAILABLE_STATES.SHOW_FINAL) {
      return <FinalFaceMerge />
    } else {
      return null
    }
  }
}

YourFace.propTypes = {
  currentState: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  return {
    currentState: state.currentState  
  }
  
}

export default connect(mapStateToProps)(YourFace)
