import styles from './styles.styl';
import React, {PropTypes} from 'react';
import CSSModules from 'react-css-modules';
import {language} from '../../i18n/select.js';
import RaisedButton from 'material-ui/lib/raised-button';

@CSSModules(styles)
export default class Comment extends React.Component {
    static propTypes = {
        post: PropTypes.object
    };

    render() {
        const {post} = this.props;

        if (!post) return null;

        return (
            <div styleName="comment-post">
                <div>评论</div>
                <div styleName="comment-title">{post.post_title}</div>
                <small>{post.post_author}</small>
                <RaisedButton label="Default" />
            </div>
        );
    }
}
