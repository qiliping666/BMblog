import styles from './styles.styl';

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import Paper from 'material-ui/lib/paper';

//截取字符串，多余的部分用...代替
function setString(str, len) {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            return s + "...";
        }
    }
    return s;
}
@CSSModules(styles)
export default class PostsList extends React.Component {

    static propTypes = {
        posts: PropTypes.array
    };

    render() {
        return (
            <div styleName="wrapper">
                {this.props.posts
                    .filter(item => item.post_type == "post")
                    .map(post => {
                        return (
                            <Paper styleName="post" zDepth={1} key={post.ID}>
                                <Link to={`/posts/${post.ID}`}>
                                    <h2 className="post-header-link">{post.post_title}</h2>
                                    <div>{setString(post.post_content, 200)}</div>
                                </Link>
                            </Paper>
                        );
                    })}
            </div>
        );
    }
}
