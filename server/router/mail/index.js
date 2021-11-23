const Router = require("@koa/router");
const nodemailer = require("nodemailer");
const router = new Router();
const { MAIL_CONFIG } = require("../../config");
const strategy = require("./strategy");

var mailTransport = nodemailer.createTransport(MAIL_CONFIG);

router.post('/mail', async (ctx) => {
  const { type, params } = ctx.request.body;
  const options = strategy[type](params);
  try {
    await mailTransport.sendMail(options, function (err, msg) {
      if (err) {
        console.log(err);
        ctx.body = { code: 500, msg: '邮件发送失败' }
      } else {
        ctx.body = { code: 200, msg: '邮件发送成功' }
      }
    });
  } catch (error) {
    ctx.body = { code: 500, msg: '邮件发送失败' }
  }
});

module.exports = router.routes();