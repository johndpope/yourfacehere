import React from 'react'; //eslint-disable-line
import {connect} from 'react-redux'
import UploadForm from '../../Components/YourFace/UploadForm';
import {uploadPhoto} from '../../actions'

const mapStateToProps = state => {
  return {}
};

const mapDispatchToProps = dispatch => {
  return {
    handleSelectFile: file => {
      dispatch(uploadPhoto(file))
    }
  }
};

const Uploader = connect(
  mapStateToProps, 
  mapDispatchToProps
)(UploadForm);

export default Uploader
