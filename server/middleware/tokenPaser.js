const jwt = require("jsonwebtoken");
const { TOKENSECRET } = require("../config");
const tokenPaser = (ctx, next) => {
    const { request } = ctx;
    const { authorization } = request.headers;
    if (authorization) {
        try {
            const originToken = authorization.split(" ")[1];
            const parsedToken = {};
            const decoded = jwt.verify(originToken, TOKENSECRET);
            Object.keys(decoded).forEach(key => {
                parsedToken[key] = decoded[key];
            });
            ctx.request.token = parsedToken;
        } catch (error) {
            ctx.status = 406;
            ctx.body = { code: 406, message: "" };
            return;
        }
    }
    next();
};

module.exports = tokenPaser;
