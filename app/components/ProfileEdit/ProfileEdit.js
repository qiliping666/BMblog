import styles from './styles.styl';

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { language } from '../../i18n/select.js';

@CSSModules(styles)
export default class ProfileEdit extends React.Component {
  static propTypes = {
    profile: PropTypes.object,
    saveProfile: PropTypes.func.isRequired
  }

  state = {
    profile: { ...this.props.profile }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.saveProfile(this.state.profile);
  }

  handleChange = field => e => {
    e.preventDefault();

    this.setState({
      profile: {
        ...this.state.profile,
        [field] : e.target.value
      }
    });
  }

  render() {
    const { firstname, lastname } = this.state.profile;

    return (
      <form
        styleName="wrapper"
        onSubmit={this.handleSubmit}
      >
        <div styleName="panel">
          <div styleName="title">{language.Basic_info}</div>

            <label htmlFor="firstname">{language.First_name}</label>

            <input
              styleName="input-title"
              value={firstname}
              onChange={this.handleChange('firstname')}
              id="firstname"
              type="text"
              placeholder={language.First_name}
            />

            <label htmlFor="lastname">{language.Last_name}</label>

            <input
              styleName="input-title"
              value={lastname}
              onChange={this.handleChange('lastname')}
              id="lastname"
              type="text"
              placeholder={language.Last_name}
            />

          <button
            styleName="btn"
            type="submit"
          >
            {language.Save}
          </button>

        </div>
      </form>
    );
  }
}
