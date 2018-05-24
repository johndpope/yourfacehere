import React from 'react'; // eslint-disable-line
import {connect} from 'react-redux'
import SplashGrid from '../../Components/YourFace/SplashGrid';
import {selectSplash, mergeFaces, resetSession} from '../../actions'

const filteredSplash = state => {
  const {
    availableSplash,
    filterNumFaces,
    filterCategory,
  } = state.splash;

  return availableSplash.filter(splash => {
    if (splash.num_faces === filterNumFaces) {
      if (filterCategory === '') {
        return true;
      }
      return filterCategory === splash.category_key;
    } else {
      return false;
    }
  })
}

const mapStateToProps = state => {
  return {
    splashItems: filteredSplash(state),
    selectedSplash: state.splash.selectedSplash,
    faces: state.faces
  }
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectSplash: splash => {
      dispatch(selectSplash(splash))
    },
    handleUnselectSplash: splash => {
      dispatch(selectSplash(null))
    },
    handleCancelClick: () => {
      dispatch(resetSession())
    },
    dispatch
  }
};

const mergedProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps;
  const {selectedSplash} = stateProps;
  const handleSendMerge = (selectedFacesMap) => {
    dispatch(mergeFaces(selectedSplash, selectedFacesMap))
  }
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    handleFinishClick: handleSendMerge
  }
}

const SplashSelector = connect(
  mapStateToProps, 
  mapDispatchToProps,
  mergedProps
)(SplashGrid);

export default SplashSelector
