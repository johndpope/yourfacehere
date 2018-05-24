import React from 'react'; //eslint-disable-line
import {connect} from 'react-redux'
import SplashFilters from '../../Components/YourFace/SplashFilters';
import {filterSplash} from '../../actions'


const getAvailableCategories = state => {
  
  let availableCategories = [];
  state.splash.availableSplash.forEach(splash => {
    if (availableCategories.indexOf(splash.category_key) === -1) {
      availableCategories.push(splash.category_key)
    }
  });
  return availableCategories
}

const mapStateToProps = state => {
  return {
    currentFilterNumFaces: state.splash.filterNumFaces,
    currentFilterCategory: state.splash.filterCategory,
    maxFaces: state.faces.length,
    availableCategories: getAvailableCategories(state)
  }
};

const mapDispatchToProps = dispatch => {
  return {
    handleFinishClick: selectedFacesMap => {
      console.log(selectedFacesMap)
    },
    handleNumFacesFilterUpdate: numFaces => {
      dispatch(filterSplash('num_faces', numFaces))
    },
    handleCategoryFilterUpdate: category => {
      dispatch(filterSplash('category', category))
    }
  }
};

const SplashFiltersConnected = connect(
  mapStateToProps, 
  mapDispatchToProps
)(SplashFilters);

export default SplashFiltersConnected
