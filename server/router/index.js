const Router = require("@koa/router");
const router = new Router();

const mail = require("./mail");
const account  = require('./account');
const upload = require("./upload");



router.use(mail, account, upload);
module.exports = router.routes();