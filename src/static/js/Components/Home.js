import React from 'react';
import YourFace from '../Containers/YourFace';
import Disclaimer from './Disclaimer';
import Header from './Header';
import {withStyles} from 'material-ui/styles'


const styles = {
  bodyWrapper: {
  },
  appContentWrapper: {
    padding: '16px'
  }
}

class Home extends React.Component {
	render() {
		return (
      <div className={this.props.classes.bodyWrapper}>
        <Header />
        <div className={this.props.classes.appContentWrapper}>          
          <YourFace />          
          <Disclaimer />
        </div>
      </div>
		)
	}
}

export default withStyles(styles)(Home)
