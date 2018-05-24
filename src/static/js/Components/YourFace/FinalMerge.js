import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import ShareIcons from '../../Components/YourFace/ShareIcons';
import Typography from 'material-ui/Typography';

const styles = {
  finalImage: {
    width: '100%'
  },
  finalImageWrapper: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  wrapper: {
    maxWidth: '1080px',
    margin: '0 auto',
    textAlign: 'center'
  },

}

class FinalMerge extends React.Component {
  render() {
    const {
      classes,
      finalImage,
      handleStartOver,
      handleGoBack
    } = this.props;

    return (
      <div className={classes.wrapper}>
        <Typography type='display1' gutterBottom>Your Face Merge Is Complete</Typography>
        
        <div className={classes.finalImageWrapper}>
          <img src={finalImage.url} className={classes.finalImage} alt="Final Merge"/>
        </div>
        <ShareIcons url={finalImage.url} />
        <div>
          <Button onClick={handleGoBack}>Go Back</Button>
          <Button onClick={handleStartOver}>Start Over</Button>
        </div>
      </div>
    )
  }
}

FinalMerge.propTypes = {
  classes: PropTypes.object.isRequired,
  finalImage: PropTypes.object.isRequired,
  handleStartOver: PropTypes.func.isRequired,
  handleGoBack: PropTypes.func.isRequired,
}


export default withStyles(styles)(FinalMerge)
