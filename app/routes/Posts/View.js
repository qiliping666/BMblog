import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchPost} from '../../actions/posts';
import SinglePost from '../../components/SinglePost/SinglePost';
import Comment from '../../components/Comment/Comment';
import { language } from '../../i18n/select.js';

@connect(state => ({
    posts: state.posts.items
}))
export default class PostsView extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        params: PropTypes.object,
        posts: PropTypes.object
    };

    static fillStore(redux, props) {
        return redux.dispatch(fetchPost(props.params.id));
    }

    render() {
        const post = this.props.posts[this.props.params.id];

        return (
            post
                ? <div><SinglePost post={post}/><Comment post={post}/></div>
                : <div-center><p>{ language.post_not_exist }</p></div-center>
        );
    }
}
