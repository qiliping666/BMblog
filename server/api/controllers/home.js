import {system_config} from '../../config.js';
import {querys} from '../db/mysql.js';
import {setString} from '../../app/tool/common_tool.js';
import {api} from '../models/index';
import moment from 'moment';

const env = system_config.System_type || 'development';//判断开发模式
const mysql_prefix = system_config.mysql_prefix;//数据库前缀

moment.locale(system_config.System_country);//设置当地时间格式

export default async (ctx) =>{
     await api.home().then((result) => {
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



    // if(env == "production"){
    //     //预留
    // }
    //
    // var sql = {
    //     options: "SELECT `option_name`,`option_value` FROM `bm_options` WHERE `option_id` < 7",
    //     post: "SELECT `bm_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` FROM `" + mysql_prefix + "posts`,`" + mysql_prefix + "users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID` ORDER BY `bm_posts`.`ID` DESC LIMIT 10",
    //     post_all: "SELECT count(`bm_posts`.`ID`) AS `posts_all` FROM `bm_posts`,`bm_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `bm_users`.`ID`",
    //     tag: "SELECT `name` AS `tag_name` FROM `bm_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
    //     category: "SELECT `name` AS `category_name` FROM `bm_terms` WHERE `term_id` in (SELECT `term_id` FROM `bm_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
    //     friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `bm_links` WHERE `link_id` in (SELECT `object_id` FROM `bm_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `bm_terms` WHERE `name` = '友情链接'))"
    // };

    // return querys(sql).then((result) => {
    //     if (result.length == 0) {
    //         ctx.throw(404, '未找该页面或没有任何文章内容!');
    //     } else {
    //         result.post[0].post_date = moment(result.post[0].post_date).format('ll');
    //         for (var a = 0; a < result.post.length; a++) {
    //             result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
    //         }
    //
    //         var options = "{";
    //         for (var n = 0; n < result.options.length; n++) {
    //             options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
    //             if (n < result.options.length - 1) {
    //                 options = options + ",";
    //             }
    //         }
    //         options = JSON.parse(options + "}");
    //
    //
    //         var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
    //         var posts_all = [temp];
    //         for (var z = 0; z < temp; z++) {
    //             posts_all[z] = z + 1;
    //         }
    //
    //         var posts = {
    //             options: options,
    //             posts: result.post,
    //             posts_all: posts_all,
    //             posts_now: "1",
    //             post_tag: result.tag,
    //             post_category: result.category,
    //             friendly_link: result.friendly_link
    //         };
    //
    //         console.log(posts);
    //         ctx.render('list', posts);
    //     }
    // });
};
