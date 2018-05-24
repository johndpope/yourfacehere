import Cookie from 'js-cookie';
import analytics from '../Helpers/GoogleAnalytics';


export const ACTION_UPLOAD_PHOTO_COMPLETE = 'UPLOAD_PHOTO_COMPLETE'
function completeUpload(data) {
  return {
    type: ACTION_UPLOAD_PHOTO_COMPLETE,
    uploadedPhoto: data,
  }
}

export const ACTION_UPLOAD_PHOTO_ERROR = 'UPLOAD_PHOTO_COMPLETE_ERROR'
function errorUpload(error) {
  return {
    type: ACTION_UPLOAD_PHOTO_ERROR,
    error
  }
}


export function uploadPhoto(data) {
  return function(dispatch) {
    dispatch(setState(AVAILABLE_STATES.UPLOADING))
    analytics.event({category: 'YourFace',event: 'upload'})

    let headers = _getFetchHeaders();

    let formData = new FormData();
    formData.append('photo', data);

    return fetch('/api/user_upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: headers
      }).then(resp => resp.json())
      .then(resp => {
        if (resp.original && resp.faces) {
          dispatch(completeUpload(resp.original))
          dispatch(setFaces(resp.faces))
          dispatch(loadSplash(resp.faces.length))  
        } else {
          alert("Problem detecting faces. Maybe try with another picture?")
        }
      }).catch(err => {
        analytics.event({category: 'YourFace',event: 'error_upload'})
        alert("Error uploading")
        console.log(err);
        dispatch(errorUpload(err))
      })
  }
}

export const ACTION_LOAD_SPLASH = 'LOAD_SPLASH'
export function loadSplash(max_faces = 1, updateUIState = true) {
  return function(dispatch) {
    // start by setting the state for the UI
    +-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    updateUIState === true && dispatch(setState(AVAILABLE_STATES.LOADING_SPLASH))
    
    let headers = _getFetchHeaders();


    return fetch('/api/splash?max_faces=' + max_faces, {
      headers,
      credentials: 'include'
    }).then(
      resp => resp.json(),
      err => console.log(err)
    ).then(data => {
      dispatch(setSplash(data.splash))
      updateUIState === true && dispatch(setState(AVAILABLE_STATES.SELECT_SPLASH))
    })
  }
}

export function initSession() {
  return function(dispatch) {
    let headers = _getFetchHeaders();
    return fetch('/api/init', {
      headers: headers,
      credentials: 'include',

    }).then(
      resp => resp.json(), 
      err => console.log(err)
    ).then(resp => {//////////////////
      if (resp.faces !== undefined && resp.original !== undefined) {
        dispatch(setFaces(resp.faces))
        dispatch(completeUpload(resp.original))
        const hasMerged = resp.merged !== undefined && resp.merged !== null;
        if (hasMerged) {
          dispatch(setMergedPhoto(resp.merged))
          dispatch(setState(AVAILABLE_STATES.SHOW_FINAL))
        }
        dispatch(loadSplash(resp.faces.length, !hasMerged))
      } else {
        dispatch(setState(AVAILABLE_STATES.UPLOAD))
      }
    }).catch(err => {
      console.log(err);
    })
  }
}


export const ACTION_SET_SPLASH = 'SET_SPLASH'
export function setSplash(splashItems) {
  return { type: ACTION_SET_SPLASH, splashItems }
}
export const ACTION_SET_SELECTED_SPLASH = 'SET_SELECTED_SPLASH';
export function selectSplash(selectedSplash) {
  return { type: ACTION_SET_SELECTED_SPLASH, selectedSplash }
}

export const ACTION_MERGE_FACES = 'MERGE_FACES'
export function mergeFaces(selectedSplash, facesMap) {
  return function(dispatch) {
    9dispatch(setState(AVAILABLE_STATES.MERGING))
    
    let headers = _getFetchHeaders();
    headers.append('Content-type','application/json');

    return fetch('/api/merge', {
        credentials: 'include',
        headers: headers,
        method: 'post',
        body: JSON.stringify({
          'num_faces': selectedSplash.num_faces,
          'key': selectedSplash.key,
          'selected_face_map': facesMap
        }),
      }).then(resp => resp.json())
      .then(resp => {        
        dispatch(setMergedPhoto(resp))
        dispatch(setState(AVAILABLE_STATES.SHOW_FINAL))
      }).catch(err => {
        alert("There was an error merging faces")
        console.log(err)
        //this.handleCancel();
      })
  }
}

export const ACTION_SET_FACES = 'SET_FACES'
export function setFaces(faces) {
  return { type: ACTION_SET_FACES, faces }
}


export const ACTION_SET_STATE = 'SET_STATE'
export const AVAILABLE_STATES = {
  UPLOAD: 'upload',
  UPLOADING: 'uploading',
  LOADING_SPLASH: 'loading_splash',
  SELECT_SPLASH: 'select_splash',
  MERGING: 'merging',
  SHOW_FINAL: 'show_final',
};

const ANALYTICS_PAGEVIEW_STATES = [AVAILABLE_STATES.UPLOAD, AVAILABLE_STATES.SELECT_SPLASH, AVAILABLE_STATES.SHOW_FINAL]

export function setState(state) {
  if (ANALYTICS_PAGEVIEW_STATES.indexOf(state) > -1) {
    analytics.pageview(state);
  }
  return {type: ACTION_SET_STATE, state}
}


export const ACTION_FILTER_SPLASH = 'FILTER_SPLASH';
/*
* filterSplash('category','disney')
* filterSplash('num_faces', 2)
* filterSplash('category','')
*/
export function filterSplash(key, value) {
  return {type: ACTION_FILTER_SPLASH, filterType: key, filterValue: value}
}

export const ACTION_SET_MERGED_PHOTO = 'SET_MERGED_PHOTO';

function setMergedPhoto(data) {
  return { type: ACTION_SET_MERGED_PHOTO, data }
}

export function resetSession() {
  return function(dispatch) {
    fetch('/api/cancel_session', {
      credentials: 'include'
    }).then(() => {
      dispatch(setState(AVAILABLE_STATES.UPLOAD))
    }).catch(err => {
      dispatch(setState(AVAILABLE_STATES.UPLOAD))
    })
  }
}

function _getFetchHeaders() {
  let headers = new Headers();
  headers.append('X-CSRFToken', Cookie.get('csrftoken'));
  headers.append('X-Requested-With','XMLHttpRequest');
  return headers
}
