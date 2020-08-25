const Koa = require("koa2");
const formidable = require("formidable");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const koajwt = require("koa-jwt");
const tokenPaser = require("./middleware/tokenPaser");
const { TOKENSECRET } = require("./config");
const { ErrorResponse } = require("./model/response");
const account = require("./router/account");
const upload = require("./router/upload");
const app = new Koa();

app.use(koaStatic("public"));

// 路由鉴权
// app.use((ctx, next) => {
//     return next().catch(err => {
//         if (401 === err.status) {
//             ctx.status = 401;
//             ctx.body = new ErrorResponse(401, "Protected resource, use Authorization header to get access");
//             return;
//         } else {
//             throw err;
//         }
//     });
// });

// 路由鉴权
// app.use(koajwt({ screct: TOKENSECRET }).unless({ path: [/\/login/] }));

// token 解析到request对象上
// app.use(tokenPaser);

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

// 添加 account 路由
app.use(account);

// 添加 upload 路由
app.use(upload);

app.listen(10000, () => {
    console.log("服务已启动，10000端口监听中...");
});
