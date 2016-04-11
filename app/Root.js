/* eslint-env browser */
/* global process */
import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import cookie from './utils/cookie';
import routes from './routes';
import { routerStateChange } from './actions/router';
import { createRedux } from './utils/redux';
import { browserHistory } from 'react-router';

const store = createRedux((process.env.NODE_ENV === 'production')
  ? window.__INITIAL_STATE__
  : { auth: { token: cookie.get('token') || '' } });

export default class Root extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Router
          history={browserHistory}
          routes={routes(store, true)}
          onUpdate={function() {
            store.dispatch(routerStateChange(this.state));
          }}
        />
      </Provider>
    );
  }
}
