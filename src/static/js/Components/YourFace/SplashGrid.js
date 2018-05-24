import React from 'react';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import SplashItem from './SplashItem';
import SplashItemModal from './SplashItemModal';
import SplashFilters from '../../Containers/YourFace/SplashFilters';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = {
  wrapper: {
    maxWidth: '1080px',
    margin: '0 auto'
  },
  rightAligned: {
    textAlign: 'right'
  },
  infoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#cdcdcd',
    border: 'solid 2px #aaa',
    dropShadow: '2px 2px 2px #000',
    marginBottom: '20px'
  }
};

class SplashGrid extends React.Component {

  renderSplashModal() {
    if (this.props.selectedSplash !== null) {
      return (
        <SplashItemModal 
        onClose={this.props.handleUnselectSplash} 
        splash={this.props.selectedSplash} 
        faces={this.props.faces} 
        handleFinishClick={this.props.handleFinishClick}
        />
      )
    } else {
      return null
    }
  }

  render() {
    const {
      classes, 
      splashItems, 
      handleSelectSplash,
      handleCancelClick
    } = this.props;

    return (
      <div className={classes.wrapper}>
        <div className={classes.infoWrapper}>
          <Typography>Your image has been uploaded and some awesome faces have been found. Now select some character art for that beautiful face.</Typography>
        </div>
        <Grid container spacing={16}>
          <Grid item xs={6}>
            <SplashFilters />
          </Grid>
          <Grid className={classes.rightAligned} item xs={6}>
            <Button onClick={handleCancelClick}>Start Over</Button>
          </Grid>
        </Grid>        
        <Grid container spacing={16}>
          {splashItems.map(splashItem => {
            return (
              <Grid key={splashItem.key} item xs={6} md={3}>
                <SplashItem splash={splashItem} onSelect={handleSelectSplash} />
              </Grid>
            )  
          })}
        </Grid>
        {this.renderSplashModal()}
      </div>
    )
  }
}

SplashGrid.propTypes = {
  splashItems: PropTypes.array.isRequired,
  handleSelectSplash: PropTypes.func.isRequired,
  handleUnselectSplash: PropTypes.func.isRequired,
  faces: PropTypes.array.isRequired,
  handleFinishClick: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  selectedSplash: PropTypes.object,

}

export default withStyles(styles)(SplashGrid)
