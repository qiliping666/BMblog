import Koa_router from 'koa-router';
const router = new Koa_router();

router
    .get('/api', (ctx) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    ctx.set("Access-Control-Allow-headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    ctx.set("X-Powered-By", ' 3.2.1');
    ctx.set("Content-Type", "application/json;charset=utf-8");
    return query("SELECT * FROM `" + mysql_prefix + "posts` WHERE ID=542").then((a) => {
        ctx.body = a;
    });
});


export default router;