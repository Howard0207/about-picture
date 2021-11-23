const { ErrorResponse } = require("../model/response");
const handleAuth = (ctx, next) => {
  return next().catch((err) => {
    if (401 === err.status) {
      ctx.status = 401;
      ctx.body = new ErrorResponse(401, "Protected resource, use Authorization header to get access");
      return;
    } else {
      throw err;
    }
  });
};

module.exports = handleAuth;
