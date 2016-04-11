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
import AppLeftNav from './Leftnav';
import {
    Colors,
    getMuiTheme,
} from 'material-ui/lib/styles';

@CSSModules(styles)
export default class Header extends React.Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        logout: PropTypes.func.isRequired,
        router: PropTypes.object.isRequired,
        location: React.PropTypes.object,
        history: React.PropTypes.object
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
                    <Link to="/"><MenuItem primaryText={language.Home}/></Link>
                    <Link to="/dashboard"><MenuItem primaryText={language.Dashboard}/></Link>
                    <Link to="/profile"><MenuItem primaryText={language.Profile}/></Link>
                    <Link to="/logout" onClick={this.handleLogout}><MenuItem primaryText={language.Logout}/></Link>
                </div>
            );
        } else {
            return (
                <div>
                    <Link to="/"><MenuItem primaryText={language.Home}/></Link>
                    <Link to="/signup"><MenuItem primaryText={language.Sign_up}/></Link>
                    <Link to="/login"><MenuItem primaryText={language.Login}/></Link>
                </div>
            );
        }
    };


    getStyles() {
        const darkWhite = Colors.darkWhite;

        const styles = {
            appBar: {
                position: 'fixed',
                // Needed to overlap the examples
                zIndex: 100 + 1,
                top: 0
            },
            footer: {
                backgroundColor: Colors.grey900,
                textAlign: 'center'
            },
            a: {
                color: darkWhite
            },
            p: {
                margin: '0 auto',
                padding: 0,
                color: Colors.lightWhite,
                maxWidth: 335
            },
            iconButton: {
                color: darkWhite
            }
        };

        return styles;
    };

    handleChangeRequestLeftNav(open) {
        this.setState({
            leftNavOpen: open
        });
    };

    handleRequestChangeList(event, value) {
        this.props.history.push(value);
        this.setState({
            leftNavOpen: false
        });
    };

    render() {
        const {
            history,
            location,
            children,
        } = this.props;

        var leftNavOpen = false;

        const styles = this.getStyles();

        let docked = false;
        let showMenuIconButton = true;

        // if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE) && title !== '') {
        //     docked = true;
        //     leftNavOpen = true;
        //     showMenuIconButton = false;
        //
        //     styles.leftNav = {
        //         zIndex: styles.appBar.zIndex - 1,
        //     };
        //     styles.root.paddingLeft = 256;
        //     styles.footer.paddingLeft = 256;
        // }

        return (
            <div>
                <AppBar
                    title="BMblog"
                    onTitleTouchTap={function() {  this.props.history.push('/'); }}
                    onLeftIconButtonTouchTap={this.handleChangeRequestLeftNav}
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
                <AppLeftNav
                    style={styles.leftNav}
                    history={history}
                    location={location}
                    docked={docked}
                    onRequestChangeLeftNav={this.handleChangeRequestLeftNav}
                    onRequestChangeList={this.handleRequestChangeList}
                    open={leftNavOpen}
                />
            </div>
        );
    }
}
