const Router = require("@koa/router");
const jwt = require("jsonwebtoken");
const { TOKENSECRET } = require("../../config");
const { SuccessResponse, ErrorResponse } = require("../../model/response");

// 创建路由
const router = new Router();

/**
 * 生成token
 * @param { type: Object, desc: 封装在token中的信息 } info
 */
const createToken = (info) => {
  const token = "Bearer " + jwt.sign(info, TOKENSECRET, { expiresIn: "48h" });
  return token;
};

router.post("/login", (ctx) => {
  const token = createToken({ name: "小明" });
  ctx.body = new SuccessResponse({ token });
  return;
});

module.exports = router.routes();
