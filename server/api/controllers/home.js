import {system_config} from '../../config.js';
import {setString} from '../../app/tool/common_tool.js';
import home from '../models/home.js';
import moment from 'moment';

const env = system_config.System_type || 'development';//判断开发模式
const mysql_prefix = system_config.mysql_prefix;//数据库前缀

moment.locale(system_config.System_country);//设置当地时间格式

export default (ctx) =>{
     return home().then((result) => {
        if (result.length == 0) {
            ctx.throw(404, '未找该页面或没有任何文章内容!');
        } else {
            result.posts[0].post_date = moment(result.posts[0].post_date).format('ll');
            for (var a = 0; a < result.posts.length; a++) {
                result.posts[a].post_content = setString(result.posts[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
            }

            var options = "{";
            for (var n = 0; n < result.options.length; n++) {
                options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                if (n < result.options.length - 1) {
                    options = options + ",";
                }
            }
            options = JSON.parse(options + "}");


            var temp = parseInt(parseInt(result.posts_all[0].posts_all) / 10 + 1);
            var posts_all = [temp];
            for (var z = 0; z < temp; z++) {
                posts_all[z] = z + 1;
            }

            var posts = {
                options: options,
                posts: result.posts,
                posts_all: posts_all,
                posts_now: "1",
                post_tag: result.post_tag,
                post_category: result.post_category,
                friendly_link: result.friendly_link
            };

            ctx.render('list', posts);
        }
    });
};

export var list = (ctx) =>{
    ctx.body = "homelist";
};
