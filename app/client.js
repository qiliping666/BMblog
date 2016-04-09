/* eslint-env browser */
/* global process */
import 'babel/polyfill';
import React from 'react';
import Root from './Root';
import ReactDOM from 'react-dom';

// const history = (process.env.NODE_ENV === 'production')
//   ? new BrowserHistory()
//   : new HashHistory();
//import { hashHistory } from 'react-router';

ReactDOM.render(
  <Root />,
  document.getElementById('app')
);
