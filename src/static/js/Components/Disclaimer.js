import React from 'react';
import {withStyles} from 'material-ui/styles';

const styles = {
  footerWrapper: {
    textAlign: 'center',
    margin: '0 auto',
    padding: '60px 0 0 0',
  },
  disclaimerText: {
    fontSize: '0.8rem',
    fontStyle: 'italic',
  }
}

class Disclaimer extends React.Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.footerWrapper}>
        <p className={classes.disclaimerText}>
          {`This tool is not created or endorsed by Disney\u2122 or Riot Games\u2122.`}
          <br />
          Note that all final images are hosted by <a href='https://www.imgur.com' target='_blank' rel='noopener noreferrer'>Imgur</a>
        </p>
      </div>
    )
  }
}

export default withStyles(styles)(Disclaimer);
