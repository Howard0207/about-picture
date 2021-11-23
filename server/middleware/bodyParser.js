const koaBody = require("koa-body");
const bodyParser = koaBody({ multipart: true, formidable: { multiples: true, keepExtensions: true, uploadDir: "upload-temp", maxFileSize: 20 * 1024 * 1024 } });
module.exports = bodyParser;
