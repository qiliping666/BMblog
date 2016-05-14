import Koa from 'koa';
import Koa_router from 'koa-router';
import Koa_logger from 'koa-logger';
import Koa_favicon from 'koa-favicon';
import Koa_convert from 'koa-convert';
import Koa_json from 'koa-json';
import Koa_body_parser from 'koa-bodyparser';
import {system_config} from './config.js';
import {
    query,
    querys,
    querys_ASC,
    querys_Tx,
    querys_Parallelism,
    query_once_start
} from './api/db/mysql.js';
import {setString} from './app/tool/common_tool.js';
import path from 'path';
import swig from 'swig';
import serve from 'koa-static';
import marked from 'marked';
//import assemble from 'assemble';

const app = new Koa();
const router = new Koa_router();
const body_parser = new Koa_body_parser();
//const env = system_config.System_type || 'development';//判断开发模式
const mysql_prefix = system_config.mysql_prefix;//数据库前缀

app
    .use(Koa_convert(body_parser))
    .use(Koa_convert(Koa_json()))
    .use(Koa_convert(Koa_logger()))
    .use(Koa_convert(Koa_favicon(path.join(__dirname, '../app/assets/img/favicon.ico'))))
    .use(Koa_convert(serve(path.join(__dirname, '../app'))))
    .use((ctx, next) => {
        const start = new Date();
        return next().then(() => {
            const ms = new Date() - start;
            console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
        });
    });

router
    .get('/', (ctx) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/list.html'));

        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT `yi_blog_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` FROM `" + mysql_prefix + "blog_posts`,`" + mysql_prefix + "blog_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `yi_blog_users`.`ID` ORDER BY `yi_blog_posts`.`ID` DESC LIMIT 10",
            post_all: "SELECT count(`yi_blog_posts`.`ID`) AS `posts_all` FROM `yi_blog_posts`,`yi_blog_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `yi_blog_users`.`ID`",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.length == 0) {
                ctx.throw(404, '未找该页面或没有任何文章内容!');
            } else {
                for (var a = 0; a < result.post.length; a++) {
                    result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                }

                var options = "{";
                for (var n = 0; n < result.options.length; n++) {
                    options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                    if (n < result.options.length - 1) {
                        options = options + ",";
                    }
                }
                options = JSON.parse(options + "}");


                var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
                var posts_all = [temp];
                for (var z = 0; z < temp; z++) {
                    posts_all[z] = z + 1;
                }

                var posts = {
                    options: options,
                    posts: result.post,
                    posts_all: posts_all,
                    posts_now: "1",
                    post_tag: result.tag,
                    post_category: result.category,
                    friendly_link: result.friendly_link
                };

                ctx.body = template(posts);
            }
        });
    })
    .get('/page/:num', (ctx) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/list.html'));
        var limit = parseInt((parseInt(ctx.params.num) - 1) * 10) + "," + 10;
        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT `yi_blog_posts`.`ID` ,`post_title`,`post_date`, `post_content`,`display_name` FROM `" + mysql_prefix + "blog_posts`,`" + mysql_prefix + "blog_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `yi_blog_users`.`ID` ORDER BY `yi_blog_posts`.`ID` DESC LIMIT " + limit,
            post_all: "SELECT count(`yi_blog_posts`.`ID`) AS `posts_all` FROM `yi_blog_posts`,`yi_blog_users` WHERE `post_type` = 'post' AND `post_status` = 'publish' AND `post_author` = `yi_blog_users`.`ID`",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.length == 0) {
                ctx.throw(404, '未找该页面或没有任何文章内容!');
            } else {
                for (var a = 0; a < result.post.length; a++) {
                    result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                }

                var options = "{";
                for (var n = 0; n < result.options.length; n++) {
                    options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                    if (n < result.options.length - 1) {
                        options = options + ",";
                    }
                }
                options = JSON.parse(options + "}");


                var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
                var posts_all = [temp];
                for (var z = 0; z < temp; z++) {
                    posts_all[z] = z + 1;
                }

                var posts = {
                    options: options,
                    posts: result.post,
                    posts_all: posts_all,
                    posts_now: ctx.params.num,
                    post_tag: result.tag,
                    post_category: result.category,
                    friendly_link: result.friendly_link
                };

                ctx.body = template(posts);
            }
        });
    })
    .get('/:id.html', ctx => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/post.html'));

        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT * FROM `" + mysql_prefix + "blog_posts` WHERE `ID` = " + ctx.params.id + " AND `post_type` = 'post' AND `post_status` = 'publish'",
            comment: "SELECT * FROM `yi_blog_comments` WHERE `comment_post_ID` = " + ctx.params.id + " AND `comment_parent` = 0 ORDER BY `comment_ID` DESC",
            comment_back: "SELECT * FROM `yi_blog_comments` WHERE `comment_post_ID` = " + ctx.params.id + " AND `comment_parent` != 0 ORDER BY `comment_ID` ASC",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        if (ctx.params.id <= 582) {
            return querys(sql).then((result) => {
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

                ctx.body = template(posts);
            });
        } else if (ctx.params.id > 582) {
            return querys(sql).then((result) => {
                result.post[0].post_content = marked(result.post[0].post_content);

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

                ctx.body = template(posts);
            });
        } else {
            ctx.throw(404, '未找该页面。');
        }
    })
    .get('/:page', (ctx, next) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/post.html'));

        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT * FROM `" + mysql_prefix + "blog_posts`  WHERE `post_type` = 'page' AND `post_status` = 'publish' AND `post_name` = '" + ctx.params.page + "'",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.post.length == 0) {
                return next();
            } else {
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

                ctx.body = template(posts);
            }
        });
    })
    .get('/:page', (ctx) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/list.html'));

        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT * FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.page + "' OR `slug` = '" + ctx.params.page + "') AND `taxonomy` = 'category')) ORDER BY `yi_blog_posts`.`ID` DESC LIMIT 10",
            post_all: "SELECT count(`yi_blog_posts`.`ID`) AS `posts_all` FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.page + "' OR `slug` = '" + ctx.params.page + "') AND `taxonomy` = 'category'))",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.length == 0) {
                ctx.throw(404, '未找该页面或没有任何文章内容!');
            } else {
                for (var a = 0; a < result.post.length; a++) {
                    result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                }

                var options = "{";
                for (var n = 0; n < result.options.length; n++) {
                    options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                    if (n < result.options.length - 1) {
                        options = options + ",";
                    }
                }
                options = JSON.parse(options + "}");

                var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
                var posts_all = [temp];
                for (var z = 0; z < temp; z++) {
                    posts_all[z] = z + 1;
                }

                var posts = {
                    options: options,
                    posts: result.post,
                    posts_all: posts_all,
                    posts_now: "1",
                    posts_type: "/" + ctx.params.page,
                    post_tag: result.tag,
                    post_category: result.category,
                    friendly_link: result.friendly_link
                };

                ctx.body = template(posts);
            }
        });
    })

    .get('/:page/page/:num', (ctx) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/list.html'));
        var limit = parseInt((parseInt(ctx.params.num) - 1) * 10) + "," + 10;
        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT * FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.page + "' OR `slug` = '" + ctx.params.page + "') AND `taxonomy` = 'category')) ORDER BY `yi_blog_posts`.`ID` DESC LIMIT " + limit,
            post_all: "SELECT count(`yi_blog_posts`.`ID`) AS `posts_all` FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.page + "' OR `slug` = '" + ctx.params.page + "') AND `taxonomy` = 'category'))",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.length == 0) {
                ctx.throw(404, '未找该页面或没有任何文章内容!');
            } else {
                for (var a = 0; a < result.post.length; a++) {
                    result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                }

                var options = "{";
                for (var n = 0; n < result.options.length; n++) {
                    options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                    if (n < result.options.length - 1) {
                        options = options + ",";
                    }
                }
                options = JSON.parse(options + "}");

                var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
                var posts_all = [temp];
                for (var z = 0; z < temp; z++) {
                    posts_all[z] = z + 1;
                }

                var posts = {
                    options: options,
                    posts: result.post,
                    posts_all: posts_all,
                    posts_now: ctx.params.num,
                    posts_type: "/" + ctx.params.page,
                    post_tag: result.tag,
                    post_category: result.category,
                    friendly_link: result.friendly_link
                };

                ctx.body = template(posts);
            }
        });
    })

    .get('/tag/:name', (ctx) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/list.html'));

        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT * FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag')) ORDER BY `yi_blog_posts`.`ID` DESC LIMIT 10",
            post_all: "SELECT count(`yi_blog_posts`.`ID`) AS `posts_all` FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag'))",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.length == 0) {
                ctx.throw(404, '未找该页面或没有任何文章内容!');
            } else {
                for (var a = 0; a < result.post.length; a++) {
                    result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                }

                var options = "{";
                for (var n = 0; n < result.options.length; n++) {
                    options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                    if (n < result.options.length - 1) {
                        options = options + ",";
                    }
                }
                options = JSON.parse(options + "}");

                var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
                var posts_all = [temp];
                for (var z = 0; z < temp; z++) {
                    posts_all[z] = z + 1;
                }

                var posts = {
                    options: options,
                    posts: result.post,
                    posts_all: posts_all,
                    posts_now: "1",
                    posts_type: "/tag/" + ctx.params.name,
                    post_tag: result.tag,
                    post_category: result.category,
                    friendly_link: result.friendly_link
                };

                ctx.body = template(posts);
            }
        });
    })

    .get('/tag/:name/page/:num', (ctx) => {
        var template = swig.compileFile(path.join(__dirname, 'app/blog/template/list.html'));
        var limit = parseInt((parseInt(ctx.params.num) - 1) * 10) + "," + 10;
        var sql = {
            options: "SELECT `option_name`,`option_value` FROM `yi_blog_options` WHERE `option_id` < 7",
            post: "SELECT * FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag')) ORDER BY `yi_blog_posts`.`ID` DESC LIMIT " + limit,
            post_all: "SELECT count(`yi_blog_posts`.`ID`) AS `posts_all` FROM `" + mysql_prefix + "blog_posts` WHERE `ID` IN (SELECT `object_id` FROM `" + mysql_prefix + "blog_term_relationships` WHERE `term_taxonomy_id` = (SELECT `term_taxonomy_id` FROM `" + mysql_prefix + "blog_term_taxonomy` WHERE `term_id` = (SELECT `term_id` FROM `" + mysql_prefix + "blog_terms` WHERE `name` = '" + ctx.params.name + "' OR `slug` = '" + ctx.params.name + "') AND `taxonomy` = 'post_tag'))",
            tag: "SELECT `name` AS `tag_name` FROM `yi_blog_terms` WHERE `term_id` IN ( SELECT * FROM (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'post_tag' ORDER BY `count` DESC LIMIT 15) AS `term_id`)",
            category: "SELECT `name` AS `category_name` FROM `yi_blog_terms` WHERE `term_id` in (SELECT `term_id` FROM `yi_blog_term_taxonomy` WHERE `taxonomy` = 'category' AND `count` != 0)",
            friendly_link: "SELECT `link_url`,`link_name`,`link_target` FROM `yi_blog_links` WHERE `link_id` in (SELECT `object_id` FROM `yi_blog_term_relationships` WHERE `term_taxonomy_id` in (SELECT `term_id`  FROM `yi_blog_terms` WHERE `name` = '友情链接'))"
        };

        return querys(sql).then((result) => {
            if (result.length == 0) {
                ctx.throw(404, '未找该页面或没有任何文章内容!');
            } else {
                for (var a = 0; a < result.post.length; a++) {
                    result.post[a].post_content = setString(result.post[a].post_content.replace(/<[^>]+>/g, ""), 200);//去掉所有的html标记
                }

                var options = "{";
                for (var n = 0; n < result.options.length; n++) {
                    options = options + "\"" + result.options[n].option_name + "\":\"" + result.options[n].option_value + "\"";
                    if (n < result.options.length - 1) {
                        options = options + ",";
                    }
                }
                options = JSON.parse(options + "}");

                var temp = parseInt(parseInt(result.post_all[0].posts_all) / 10 + 1);
                var posts_all = [temp];
                for (var z = 0; z < temp; z++) {
                    posts_all[z] = z + 1;
                }

                var posts = {
                    options: options,
                    posts: result.post,
                    posts_all: posts_all,
                    posts_now: ctx.params.num,
                    posts_type: "/tag/" + ctx.params.name,
                    post_tag: result.tag,
                    post_category: result.category,
                    friendly_link: result.friendly_link
                };

                ctx.body = template(posts);
            }
        });
    })

    .get('/api', (ctx) => {
        ctx.set("Access-Control-Allow-Origin", "*");
        ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        ctx.set("Access-Control-Allow-headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        ctx.set("X-Powered-By", ' 3.2.1');
        ctx.set("Content-Type", "application/json;charset=utf-8");
        return query("SELECT * FROM `" + mysql_prefix + "blog_posts` WHERE ID=542").then((a) => {
            ctx.body = a;
        });
    })

    .get('/test/querys/:name', (ctx) => {
        var sqls = {
            table_a: "select count(*) from yi_blog_posts",
            table_b: "select count(*) from yi_blog_terms",
            table_c: "select count(*) from yi_blog_terms",
            table_d: "select count(*) from yi_blog_terms",
            table_e: "select count(*) from yi_blog_terms",
            table_f: "select count(*) from yi_blog_terms",
            table_g: "select count(*) from yi_blog_terms",
            table_h: "select count(*) from yi_blog_users"
        };
        // var sqls = [
        //         "select count(*) from yi_blog_posts",
        //         "select count(*) from yi_blog_terms",
        //         "select count(*) from yi_blog_terms",
        //         "select count(*) from yi_blog_terms",
        //         "select count(*) from yi_blog_terms",
        //         "select count(*) from yi_blog_terms",
        //         "select count(*) from yi_blog_terms",
        //         "select count(*) from yi_blog_users"
        // ];
        return querys(sqls).then((post) => {
            if (post.length == 0) {
                ctx.throw(404, '未找该页面。');
            } else {
                ctx.body = post;
            }
        });
    })

    .get('/test/querys_Parallelism/:name', (ctx) => {
        return query_once_start().then((conn) => {
            var sqls_ob = {
                table_a: function (callback) {
                    conn.query('select count(*) from yi_blog_posts', function (err, result) {
                        callback(err, result[0]); // 将结果传入callback
                    });
                },
                table_b: function (callback) {
                    conn.query('select count(*) from yi_blog_terms', function (err, result) {
                        callback(err, result[0]);
                    });
                },
                table_c: function (callback) {
                    conn.query('select count(*) from yi_blog_users', function (err, result) {
                        callback(err, result[0]);
                    });
                }
            };
            return querys_Parallelism(sqls_ob).then((post) => {
                if (post.length == 0) {
                    ctx.throw(404, '未找该页面。');
                } else {
                    //释放连接
                    conn.release();
                    console.log("连接已被关闭。");
                    ctx.body = post;
                }
            });
        });
    })

    .get('/test/querys_ASC/:name', (ctx) => {
        return query_once_start().then((conn) => {
            // sqls_ob是一个Object
            var sqls_ob = {
                table_a: function (callback) {
                    conn.query('select count(*) from yi_blog_posts', function (err, result) {
                        callback(err, result[0]); // 将结果传入callback
                    });
                },
                table_b: function (callback) {
                    conn.query('select count(*) from yi_blog_terms', function (err, result) {
                        callback(err, result[0]);
                    });
                },
                table_c: function (callback) {
                    conn.query('select count(*) from yi_blog_users', function (err, result) {
                        callback(err, result[0]);
                    });
                }
            };

            return querys_ASC(sqls_ob).then((post) => {
                if (post.length == 0) {
                    ctx.throw(404, '未找该页面。');
                } else {
                    //释放连接
                    conn.release();
                    ctx.body = post;
                }
            });
        });
    })

    .get('/test/querys_Tx/:name', (ctx) => {
        return query_once_start().then((conn) => {
            var sqls = [
                function (callback) {
                    conn.beginTransaction(function (err) {
                        callback(err);
                    });
                },

                function (callback) {
                    conn.query('select ID from yi_blog_posts WHERE `ID` = 5', function (err, result) {
                        if (err) {
                            conn.rollback(); // 发生错误事务回滚
                            callback(err);
                        } else {
                            callback(err, result); // 生成的ID会传给下一个任务
                        }
                    });
                },

                function (last, callback) {
                    console.log(last);
                    conn.query('select * from yi_blog_posts WHERE `ID` = ' + last[0].ID, function (err, result) {
                        if (err) {
                            conn.rollback(); // 发生错误事务回滚
                            callback(err);
                        } else {
                            callback(err, result[0]); // 生成的ID会传给下一个任务
                        }
                    });
                },

                function (result, callback) {
                    conn.commit(function (err) {
                        callback(err, result);
                    });
                }
            ];

            return querys_Tx(sqls).then((post) => {
                if (post.length == 0) {
                    ctx.throw(404, '未找该页面。');
                } else {
                    //释放连接
                    conn.release();
                    ctx.body = post;
                }
            });
        });
    })
;

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(system_config.HTTP_server_port);

console.log("Now start HTTP-API server on port " + system_config.HTTP_server_port + "...");