import '../../styles/global.styl';
import styles from './styles.styl';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import { language } from '../../i18n/select.js';

@CSSModules(styles)
export default class Dashboard extends React.Component {
  static propTypes = {
    publishedPosts: PropTypes.array.isRequired,
    togglePublishPost: PropTypes.func.isRequired,
    unpublishedPosts: PropTypes.array.isRequired
  };

  togglePublishPost = (id, status) => {
    this.props.togglePublishPost(id, status);
  };

  render() {
    const { publishedPosts, unpublishedPosts } = this.props;

    const pp = publishedPosts.map(post => (
      <tr key={post.id}>
        <td>{post.title}</td>

        <td>
          <Link
            to={`/dashboard/edit/${post.id}`}
            styleName="clickable"
          >{language.Edit}</Link>
        </td>

        <td className="table-button">
          <div styleName="clickable"
            onClick={() => this.togglePublishPost(post.id, post.published)}
          >
              {language.Unpublish}
          </div>
        </td>
      </tr>
    ));

    const up = unpublishedPosts.filter(item => !item.published)
    .map(post => (
      <tr key={post.id}>
        <td>{post.title}</td>

        <td>
          <Link to={`/dashboard/edit/${post.id}`}>
          <div
            styleName="clickable"
            >
              {language.Edit}
          </div>
          </Link>
        </td>

        <td>
          <div
            styleName="clickable"
            onClick={() => this.togglePublishPost(post.id, post.published)}
            >
              {language.Publish}
          </div>
        </td>
      </tr>
    ));

    return (
      <div styleName="wrapper">
        <div styleName="controls">
          <Link to={'/dashboard/add'}>
            <button
              styleName="btn"
            >
                {language.Add_Post}
            </button>
          </Link>
        </div>

        <div styleName="published-container">
          <div styleName="subtitle">{language.Published_posts}</div>
          <table styleName="table">
            <tbody>{pp}</tbody>
          </table>
        </div>

        <div styleName="unpublished-container">
          <div styleName="subtitle">{language.Unpublished_posts}</div>
          <table styleName="table">
            <tbody>{up}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
