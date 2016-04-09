import styles from './styles.styl';

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import {language} from '../../i18n/select.js';

import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';

@CSSModules(styles)
export default class Header extends React.Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        logout: PropTypes.func.isRequired,
        router: PropTypes.object.isRequired
    };

    handleLogout = e => {
        const {logout, router} = this.props;

        e.preventDefault();

        logout(router);
    };

    renderNavBar() {
        const {loggedIn} = this.props;

        if (loggedIn) {
            return (
                <div>
                    <Link to="/" ><MenuItem primaryText={language.Home} /></Link>
                    <Link to="/dashboard" ><MenuItem primaryText={language.Dashboard} /></Link>
                    <Link to="/profile" ><MenuItem primaryText={language.Profile} /></Link>
                    <Link to="/logout" onClick={this.handleLogout} ><MenuItem primaryText={language.Logout} /></Link>
                </div>
            );
        } else {
            return (
                <div>
                    <Link to="/" ><MenuItem primaryText={language.Home} /></Link>
                    <Link to="/signup" ><MenuItem primaryText={language.Sign_up} /></Link>
                    <Link to="/login" ><MenuItem primaryText={language.Login} /></Link>
                </div>
            );
        }
    };

    render() {
        return (
            <AppBar
                title="BMblog"
                onTitleTouchTap={function() { this.props.history.pushState(null, '/'); }}
                iconElementRight={
                  <IconMenu
                    iconButtonElement={
                      <IconButton><MoreVertIcon /></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  >
                    {this.renderNavBar()}
                  </IconMenu>
                }
            />
        );
    }
}
