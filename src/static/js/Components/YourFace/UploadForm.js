import React from 'react';
import Dropzone from 'react-dropzone';
import Grid from 'material-ui/Grid';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';

let styles = {
  dropzone: {
    default: {
      width: '100%',
      height: '20vh',
      border: 'solid 1px #555',
      backgroundColor: '#ccc',
      textAlign: 'center',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
    }
  },
  uploadWrapper: {
    maxWidth: '750px',
    margin: '0 auto'
  }
};

styles.dropzone.active = Object.assign({}, styles.dropzone.default, {backgroundColor: '#0f0'});
styles.dropzone.uploading = Object.assign( {}, styles.dropzone.default, {backgroundColor: '#0ff'});

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFile : null,
      isUploading: false,
    };
  }

  handleSelectFile(files) {
    if (files.length > 0) {
      this.props.handleSelectFile(files[0])
    }
  }


  render() {
    let innerContent = '';
    if (this.state.isUploading) {
      innerContent = (
        <Grid item xs={12}>
          We are uploading your photo and looking for faces. Hold on! Sometimes this can take a few seconds if you are on mobile.
        </Grid>
      )
    } else {
      innerContent = [
        <Grid item xs={12} md={6} key={`gridItem1`}>
          <div>
            <h3>{`Easily put your face onto your favorite character!`}</h3>
            <p>Upload a photo and we will automatically detect the faces. You can then choose your character art, and TADA...your face is on their body. Neat.</p>
            <p>Fun fact: More character art is available when multiple faces are detected in your photo.</p>  
          </div>
        </Grid>,
        <Grid item xs={12} md={6} key={`gridItem2`}>
          <Dropzone 
            onDrop={this.handleSelectFile.bind(this)}
            multiple={false}
            accept="image/*"
            style={styles.dropzone.default}
            activeStyle={styles.dropzone.active}>
            <h3>{`DRAG FILES HERE`}</h3>
            <p>Or click this box to open the file select prompt</p>
          </Dropzone>
        </Grid>
      ]
      
    }
    return (
      <Grid container spacing={16} className={this.props.classes.uploadWrapper}>
        {innerContent}
      </Grid>        
    )
  }
}

UploadForm.propTypes = {
  handleSelectFile: PropTypes.func.isRequired
}


export default withStyles(styles)(UploadForm)
