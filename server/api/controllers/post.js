import {model_post} from '../models/post';
import marked from 'marked';
import {system_config} from '../../config.js';
import moment from 'moment';

moment.locale(system_config.System_country);//设置当地时间格式

export default (ctx) => {
    return model_post(ctx).then((result) => {
        result.post[0].post_content = marked(result.post[0].post_content.replace(/\r\n/ig, '<br/>'));
        result.post[0].post_date = moment(result.post[0].post_date).format('ll'); //格式化时间
        result.post[0].post_modified = moment(result.post[0].post_modified).format('ll'); //格式化时间

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