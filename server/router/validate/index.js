const Router = require("@koa/router");
const router = new Router({ "prefix": "/validate" });
const validateSlide = require('./validate-slide');

const routes = [validateSlide];

router.use(...routes);

module.exports = router.routes();