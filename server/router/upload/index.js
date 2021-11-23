const Router = require("@koa/router");
const tinyPicture = require("./tinyPicture");
const uploadPicture = require("./uploadPicture");
const router = new Router();

router.use("/upload", tinyPicture, uploadPicture);

module.exports = router.routes();
