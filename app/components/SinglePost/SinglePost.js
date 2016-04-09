import styles from './styles.styl';

import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { language } from '../../i18n/select.js';
import { markdown } from 'markdown';

@CSSModules(styles)
export default class SinglePost extends React.Component {
  static propTypes = {
    post: PropTypes.object
  };

  render() {
    const { post } = this.props;

    if (!post) return null;

    return (
      <div styleName="wrapper">
        <div styleName="title">{post.post_title}</div>
          <p dangerouslySetInnerHTML={{__html:markdown.toHTML(post.post_content)}}></p>
        <small>{language.written_by} {post.post_author}</small>
      </div>
    );
  }
}
