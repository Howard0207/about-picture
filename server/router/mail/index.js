const Router = require("@koa/router");
const nodemailer = require("nodemailer");
const router = new Router();
const { MAIL_CONFIG } = require("../../config");
const strategy = require("./strategy");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "INFO";

var mailTransport = nodemailer.createTransport(MAIL_CONFIG);

const sendMail = (options) => {
  return new Promise((resolve, reject) => {
    try {
      mailTransport.sendMail(options, function (err, msg) {
        if (err) reject(err);
        resolve(msg);
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * msg: {
 *  accepted: [ '631187563@qq.com' ],
 *  rejected: [],
 *  envelopeTime: 122,
 *  messageTime: 137,
 *  messageSize: 751,
 *  response: '250 Mail OK queued as smtp11,D8CowAAXqyQS2JxhzhUfAA--.1929S2 1637668884',
 *  envelope: { from: 'wode163_youjian@163.com', to: [ '631187563@qq.com' ] },
 *  messageId: '<8fd0ecd5-32ab-efdc-5ca5-f268a7b44101@163.com>'
 *}
 */
router.post("/mail", async (ctx) => {
  const { type, params } = ctx.request.body;
  const options = strategy[type](params);
  try {
    const msg = await sendMail(options);
    logger.info(msg);
    ctx.body = { code: 200, msg: "邮件发送成功" };
  } catch (err) {
    ctx.body = { code: 500, msg: "邮件发送失败" };
  }
});

module.exports = router.routes();
