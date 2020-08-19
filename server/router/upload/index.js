const Router = require("@koa/router");
const tinyPicture = require("./tinyPicture");

const router = new Router();

router.use("/upload", tinyPicture);

module.exports = router.routes();
