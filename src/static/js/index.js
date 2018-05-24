import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import './app.css';
import 'typeface-roboto';
import { Provider } from 'react-redux';
import yourFaceApp from './reducers'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import injectTapEventPlugin from 'react-tap-event-plugin';

let store = createStore(yourFaceApp, applyMiddleware(thunk) )

/** https://material-ui-next.com/customization/themes/#the-other-variables **/
const theme = createMuiTheme({
  "palette": {
    "background": {
      
    }
  }
});

injectTapEventPlugin();
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
