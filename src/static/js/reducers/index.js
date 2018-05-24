import { combineReducers } from 'redux'

import {
  ACTION_UPLOAD_PHOTO_BEGIN,
  ACTION_UPLOAD_PHOTO_COMPLETE,
  ACTION_UPLOAD_PHOTO_ERROR,
  ACTION_SET_SPLASH,
  ACTION_LOAD_SPLASH,
  ACTION_SET_SELECTED_SPLASH,
  ACTION_SET_FACES,
  ACTION_SET_STATE,
  AVAILABLE_STATES,
  ACTION_FILTER_SPLASH,
  ACTION_SET_MERGED_PHOTO,
} from '../actions';

/*
{
  splash: {
    selectedSplash: {},
    isLoading: false,
    error: false,
    availableSplash: [],
    filterNumFaces: int,
    filterCategory: string
  },
  faces: [],
  uploadPhoto: {
    isUploading: false,
    uploadedPhoto: {},
    error: false
  },
  currentState: '',
  mergedPhoto: null ||  {}
}

*/

// Splash art and states therein
function splash(state = { 
    isLoading: false, 
    selectedSplash: null, 
    error: false, 
    availableSplash: [],
    filterCategory: '',
    filterNumFaces: 1
  }, 
  action
  ) {
  switch(action.type) {
    case ACTION_SET_SPLASH: // { splashItems: [] } 
      return Object.assign({}, state, {availableSplash: action.splashItems });    
    case ACTION_LOAD_SPLASH:
      return Object.assign({}, state, {isLoading: true})
    case ACTION_SET_SELECTED_SPLASH: // { selectedSplash: {} }
      return Object.assign({}, state, { selectedSplash: action.selectedSplash })    
    case ACTION_FILTER_SPLASH: // { filterType: '', filterValue: ''}
      if (action.filterType === 'category') {
        return Object.assign({}, state, { filterCategory: action.filterValue })
      } else if (action.filterType === 'num_faces') {
        return Object.assign({}, state, { filterNumFaces: parseInt(action.filterValue, 10) })
      }
      return state;
    default:
      return state;
  }
}

// faces returned from the uploaded photo evaluation
function faces(state = [], action) {
  switch(action.type) {
    case ACTION_SET_FACES:
      return action.faces
    default:
      return state
  }
}

// Original uploaded photo and various states therein
function uploadPhoto(state = { isUploading: false, uploadedPhoto: {}, error: false}, action) {
  switch(action.type) {
    case ACTION_UPLOAD_PHOTO_BEGIN:
      return Object.assign({}, state, {isUploading: true})
    case ACTION_UPLOAD_PHOTO_COMPLETE:
      return Object.assign({}, state, {isUploading: false, uploadedPhoto: action.uploadedPhoto})
    case ACTION_UPLOAD_PHOTO_ERROR:
      return Object.assign({}, state, {isUploading: false, error: true})
    default:
      return state
  }
}

// For general state for UI flow
function currentState(state = AVAILABLE_STATES.UPLOAD, action) {
  switch(action.type) {
    case ACTION_SET_STATE:
      return action.state
    default:
      return state;
  }
}
// Final Photo - set the data
function mergedPhoto(state = null, action) {
  switch(action.type) {
    case ACTION_SET_MERGED_PHOTO:
      return action.data
    default:
      return state;
  }
}

const yourFaceApp = combineReducers({
  splash,
  faces,
  uploadPhoto,
  currentState,
  mergedPhoto,
});

export default yourFaceApp;
