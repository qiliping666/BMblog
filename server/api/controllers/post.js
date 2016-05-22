import {model_post} from '../models/post';
import marked from 'marked';

export default (ctx) => {
    return model_post(ctx).then((result) => {
        result.post[0].post_content = marked(result.post[0].post_content.replace(/\r\n/ig, '<br/>'));

        var options = "{";
        for (var n = 0; n < result.options.length; n++) {
            options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
            if (n < result.options.length - 1) {
                options = options + ",";
            }
        }
        options = JSON.parse(options + "}");

        var posts = {
            options: options,
            post: result.post[0],
            post_comment: result.comment,
            post_comment_back: result.comment_back,
            post_tag: result.tag,
            post_category: result.category,
            friendly_link: result.friendly_link
        };

        ctx.render('post', posts);
    });
};