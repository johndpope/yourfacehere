import React from 'react';
import {withStyles} from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import PropTypes from 'prop-types';
import FacesToSplash from './FacesToSplash';
import Button from 'material-ui/Button';

const styles = {
  modal: getModalStyle(),
  splashThumbnail: {
    width: '350px'
  },
  faceThumbWrapper: {
    display: 'inline-block',
    padding: '10px 20px'
  },
  faceThumb: {
    width: '100px'
  }
}

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    position: 'absolute',
    width: 600,
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, .5)',
    padding: 8 * 4,
    textAlign: 'center'
  };
}

class SplashItemModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectionComplete: false,
      selectedFacesMap: []
    }
  }

  setFacesSelected(selectedFacesMap, selectionComplete) {
    this.setState({selectedFacesMap, selectionComplete})
  }

  handleFinishClick() {
    this.props.handleFinishClick(this.state.selectedFacesMap)
  }

  render() {
    const {splash, classes, onClose, faces} = this.props;
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={true}
        onClose={onClose}
      >
        <div className={classes.modal}>
          <img src={splash.url} className={classes.splashThumbnail} alt={splash.label} />
          <div>
            <FacesToSplash
              faces={faces}
              splash={splash}
              onComplete={this.setFacesSelected.bind(this)}
            />
          </div>
          <Button color="primary" onClick={this.handleFinishClick.bind(this)} raised disabled={!this.state.selectionComplete}>Finish</Button>
        </div>
      </Modal>
    )
  }
}

SplashItemModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  splash: PropTypes.object.isRequired,
  faces: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  handleFinishClick: PropTypes.func.isRequired
}

export default withStyles(styles)(SplashItemModal);
