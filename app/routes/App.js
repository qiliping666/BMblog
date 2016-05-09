import '../styles/global.styl';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Header from '../components/Header/Header';
import {logout} from '../actions/auth';
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

@connect(state => ({
    auth: state.auth,
    router: state.router
}))
export default class App extends React.Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
        dispatch: PropTypes.func.isRequired,
        store: PropTypes.object,
        error: PropTypes.string,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        router: PropTypes.object
    };

    render() {
        const {
            auth,
            dispatch,
            location,
            history,
            children,
            router
        } = this.props;

        return (
            <div>
                <Header
                    loggedIn={!!auth.token}
                    history={history}
                    router={router}
                    location={location}
                    {...bindActionCreators({logout}, dispatch)}
                />

                {children}
            </div>
        );
    }
}