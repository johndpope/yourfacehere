import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux';
import FinalMerge from '../../Components/YourFace/FinalMerge';
import {resetSession, setState, selectSplash, AVAILABLE_STATES} from '../../actions'

const mapStateToProps = state => {
  return {
    finalImage: state.mergedPhoto
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleStartOver: () => {
      dispatch(resetSession())
    },
    handleGoBack: () => {
      dispatch(setState(AVAILABLE_STATES.SELECT_SPLASH))
      dispatch(selectSplash(null))
    }
  }
}

const FinalFaceMerge = connect(mapStateToProps, mapDispatchToProps)(FinalMerge);

export default FinalFaceMerge
