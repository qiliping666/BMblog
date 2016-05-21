import Koa_router from 'koa-router';
import home from '../controllers/home.js';

const router = new Koa_router();

router
    .get('/', home); // HOME 路由

module.exports = router;
