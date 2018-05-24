import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import EmptyFaceSelector from './EmptyFaceSelector';

const EMPTY_FACE_NONE_SELECTED_VALUE = '-1';

const styles = {
  faceImg: {
    width: '150px',
    padding: '5px',
  },
  faceImgWrapper: {
    display: 'inline-block',
    padding: '5px',
  },
}

class FacesToSplash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFacesMap: [],
    }
  }

  checkIsCompleted() {   
    const totalToFill = this.props.splash.empty_faces.length;
    let totalSet = 0;
    this.state.selectedFacesMap.forEach(mapItem => {
      if (mapItem.empty_face_label !== EMPTY_FACE_NONE_SELECTED_VALUE) {
        totalSet++;
      }
    })
    this.props.onComplete(this.state.selectedFacesMap, totalSet === totalToFill)
  }

  handleSelectFace(face, emptyFace) {
    let foundFace = false;
    let selectedFacesMap = this.state.selectedFacesMap;

    for (let x=0;x<selectedFacesMap.length;x++) {
      if (emptyFace === false && selectedFacesMap[x].face_url === face.url) {
        selectedFacesMap[x].empty_face_label = EMPTY_FACE_NONE_SELECTED_VALUE;
        foundFace = true;
      } else if (selectedFacesMap[x].empty_face_label === emptyFace.label) {
        selectedFacesMap[x].face_url = face.url;
        foundFace = true;
      }
    }
    if (!foundFace) {
      selectedFacesMap.push({
        face_url: face.url,
        empty_face_label: emptyFace.label,
      })
    }
    this.setState({selectedFacesMap}, () => {
      this.checkIsCompleted();
    });
  }

  render() {
    const { faces, classes, splash } = this.props;
    let faceIdx = 0;
    return (
      <div>
        <div>
          <h4 className={classes.selectionHeader}>Which faces go where?</h4>
          {faces.map(face => {
            faceIdx++;
            let className = classes.faceImgWrapper;
            let selectedLabel = EMPTY_FACE_NONE_SELECTED_VALUE;
            for(let x=0;x<this.state.selectedFacesMap.length;x++) {
              if (this.state.selectedFacesMap[x].face_url === face.url) {
                selectedLabel= this.state.selectedFacesMap[x].empty_face_label
              }
            }
            return (
              <div
                key={faceIdx} 
                className={className}
                >
              <img
                src={face.url}               
                alt={`Face Number ` + faceIdx} 
                className={this.props.classes.faceImg}
               />
               <EmptyFaceSelector
                  onChange={this.handleSelectFace.bind(this)}
                  selectedLabel={selectedLabel}
                  userFace={face}
                  emptyValue={EMPTY_FACE_NONE_SELECTED_VALUE}
                  emptyFaces={splash.empty_faces}   />
               </div>
            );
          })}
        </div>


      </div>
    )
  }
}

FacesToSplash.propTypes = {
  faces: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  splash: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
}

export default withStyles(styles)(FacesToSplash)
