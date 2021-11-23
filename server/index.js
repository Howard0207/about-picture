const Koa = require("koa2");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const koajwt = require("koa-jwt");
const Router = require("@koa/router");
const tokenPaser = require("./middleware/tokenPaser");
const { TOKENSECRET } = require("./config");
const { ErrorResponse } = require("./model/response");
const routes = require('./router');
const app = new Koa();
const router = new Router();

app.use(koaStatic("upload-files"));

// 路由鉴权
app.use((ctx, next) => {
	return next().catch(err => {
		if (401 === err.status) {
			ctx.status = 401;
			ctx.body = new ErrorResponse(401, "Protected resource, use Authorization header to get access");
			return; 
		} else {
			throw err;
		}
	});
});

// 路由鉴权
app.use(koajwt({ secret: TOKENSECRET }).unless({ path: [/^\/account/] }));

// token 解析到request对象上
app.use(tokenPaser);

/**
 * body parser
 * 文件自动上传到指定目录，
 * 上传文件大小限制 20Mb
 */
app.use(
	koaBody({
		multipart: true,
		formidable: { multiples: true, keepExtensions: true, uploadDir: "upload-temp", maxFileSize: 20 * 1024 * 1024 },
	})
);

app.use(routes).use(router.allowedMethods());

app.listen(10100, () => {
	console.log("服务已启动，10100端口监听中...");
});
