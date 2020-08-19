const Router = require("@koa/router");
const loginController = require("./login");
const router = new Router();

router.use("/account", loginController);

module.exports = router.routes();
