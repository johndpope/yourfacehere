import React from 'react';
import {withStyles} from 'material-ui/styles';

const styles = {
  largeHeader: {
    fontSize: '4.2rem',
    padding: '40px',
    margin: '0',
    textAlign: 'center',
    backgroundColor: '#c6d5f3',
    boxShadow: '4px 2px 0 #99a7ab'
  }
}

class Header extends React.Component {
  render() {
    const {classes} = this.props;
    return (
      <h1 className={classes.largeHeader}>YourFaceHere</h1>
    )
  }
}

export default withStyles(styles)(Header);
