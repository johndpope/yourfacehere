import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Components/Home';
import Reboot from 'material-ui/Reboot';

export default class App extends React.Component {
	render() {
		return (
			<div>
          <Reboot />
        	<Router>
	          <div>
	          	<Route path="/" exact component={Home} />
	          </div>
          	</Router>
          </div>
        )
	}
}
