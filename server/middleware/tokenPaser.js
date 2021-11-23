const jwt = require("jsonwebtoken");
const { TOKENSECRET } = require("../config");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "INFO";

const tokenPaser = async (ctx, next) => {
  const { request } = ctx;
  const { Authorization } = request.headers;
  logger.trace(Authorization);
  if (Authorization) {
    try {
      const originToken = Authorization.split(" ")[1];
      logger.trace(originToken);
      const parsedToken = {};
      const decoded = jwt.verify(originToken, TOKENSECRET);
      logger.info(decoded);
      Object.keys(decoded).forEach((key) => {
        parsedToken[key] = decoded[key];
      });
      ctx.request.token = parsedToken;
    } catch (error) {
      ctx.status = 406;
      ctx.body = { code: 406, message: "" };
      return;
    }
  }
  await next();
};
module.exports = tokenPaser;
