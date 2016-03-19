import styles from './styles.styl';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import NavItem from './NavItem';
import CSSModules from 'react-css-modules';
import { language } from '../../i18n/select.js';


@CSSModules(styles)
export default class Header extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
  };

  handleLogout = e => {
    const { logout, router } = this.props;

    e.preventDefault();

    logout(router);
  };

  renderNavBar() {
    const { loggedIn } = this.props;

    if (loggedIn) {
      return (
        <ul styleName="nav">
          <NavItem to="/">{language.Home}</NavItem>
          <NavItem to="/dashboard">{language.Dashboard}</NavItem>
          <NavItem to="/profile">{language.Profile}</NavItem>
          <NavItem to="/logout" onClick={this.handleLogout}>{language.Logout}</NavItem>
        </ul>
      );
    } else {
      return (
        <ul styleName="nav">
          <NavItem to="/">{language.Home}</NavItem>
          <NavItem to="/signup">{language.Sign_up}</NavItem>
          <NavItem to="/login">{language.Login}</NavItem>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav styleName="navbar">
          <Link
            to="/"
            activeClassName=""
            title="BMblog"
          >
          <span styleName="brand">
            BMblog
          </span>
          </Link>

          {this.renderNavBar()}
      </nav>
    );
  }
}
