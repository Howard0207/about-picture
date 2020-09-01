const Router = require("@koa/router");
const router = new Router();
const project = require("./project");

router.use("/primary-electrical", project);

module.exports = router.routes();
