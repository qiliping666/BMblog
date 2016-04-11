import '../styles/global.styl';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../components/Header/Header';
import { fetchProfile, logout } from '../actions/auth';
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

@connect(state => ({
  auth: state.auth,
  router: state.router,
  history: state.history
}))
export default class App extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.string,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const {
      auth,
      dispatch
    } = this.props;

    return (
      <div>
        <Header
          loggedIn={!!auth.token}
          router={this.props.router}
          history={this.props.history}
          location={this.props.location}
          {...bindActionCreators({ logout }, dispatch)}
        />

        {this.props.children}
      </div>
    );
  }
}
