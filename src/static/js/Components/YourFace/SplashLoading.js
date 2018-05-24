import React from 'react';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';

const styles = {
  loading: {
    fontSize: '2rem'
  }
};

class SplashLoading extends React.Component {

  render() {
    return (<div className={this.props.classes.loading}>Loading awesome splash for your face(s)</div>)
  }
}

SplashLoading.PropTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SplashLoading)
