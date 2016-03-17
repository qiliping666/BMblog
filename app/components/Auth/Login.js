import styles from './styles.styl';
import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { language } from '../../i18n/select.js';

@CSSModules(styles)
export default class Login extends React.Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        handleLogin: PropTypes.func.isRequired
    }

    static contextTypes = {
        router: React.PropTypes.object
    }

    state = {
        username: '',
        password: ''
    }

    handleChange = field => e => {
        e.preventDefault();
        this.setState({[field]: e.target.value});
    }

    handleLogin = e => {
        e.preventDefault();
        const { username, password } = this.state;

        this.props.handleLogin(username, password);
    }

    render() {
        const { auth: { error } } = this.props;
        const { username, password } = this.state;

        return (
            <div styleName="wrapper">
                <div styleName="title">{language.Login}</div>

                {error
                    ? <div>{error.message}</div>
                    : null}

                <div styleName="code">
                    <code>
                        <span styleName="hilight">Test 测试账号:</span>
                    </code>
                    <br />
                    <code>
                        <span styleName="hilight">root</span>
                    </code>
                    <br />
                    <code>
                        <span styleName="hilight">admin888</span>
                    </code>
                </div>

                <form onSubmit={this.handleLogin}>
                    <label htmlFor="username">{language.Username}</label>

                    <input
                        styleName="input"
                        value={username}
                        onChange={this.handleChange('username')}
                        id="username"
                        type="text"
                        placeholder={language.Username}
                        required
                    />

                    <label htmlFor="password">{language.Password}</label>
                    <input
                        styleName="input"
                        value={password}
                        onChange={this.handleChange('password')}
                        id="password"
                        type="password"
                        placeholder={language.Password}
                        required
                    />

                    <button
                        styleName="btn"
                        type="submit"
                    >
                        {language.Login}
                    </button>
                </form>
            </div>
        );
    }
}
