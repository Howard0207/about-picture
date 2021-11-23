const fs = require("fs");
const Router = require("@koa/router");
const router = new Router();
const { generateUUID } = require("../../utils");
var log4js = require('log4js');
var logger = log4js.getLogger();
// 获取当前文件目录
const curDir = process.cwd();

// 合并文件
const mergeFile = (token, count, ext) => {
	return new Promise((resolve, reject) => {
		const uuid = generateUUID();
		const targetFile = `${curDir}\\upload-files\\${uuid}.${ext}`;
		const originFileDir = `${curDir}\\upload-temp\\`;
		let start = 0;
		const writeStream = fs.createWriteStream(targetFile);
		const writeFile = () => {
			const originFile = `${originFileDir}${start}-${token}`;
			const readStream = fs.createReadStream(originFile);
			readStream.pipe(writeStream, { end: false });
			readStream.on("end", () => {
				fs.unlink(originFile, (err) => {
					if (err) reject(err);
				});
				if (++start < count) {
					writeFile();
				} else {
					resolve(`/upload-files/${uuid}.${ext}`);
				}
			});
		};
		writeFile();
	});
};

const insertImagePath = (path) => {};

router.post("/picture", async (ctx) => {
	// 获取前端file
	let { files } = ctx.request;
	const { fileToken, fileIndex, type, count, ext } = ctx.request.body;
	// 处理文件 -> 重命名
	if (files) {
		let originPath = files.file.path;
		let newPath = originPath.slice(0, originPath.lastIndexOf("\\") + 1) + fileIndex + "-" + fileToken;
		try {
			fs.rename(originPath, newPath, (err) => {
				if (err) {
					throw err;
				}
			});
		} catch (error) {
			ctx.body = { code: 500, msg: "上传失败" };
		}
		ctx.body = { code: 200, msg: "上传成功" };
		return true;
	}
	// 合并文件 -> 写入到新的目录中去
	if (type === "merge") {
		try {
			const path = await mergeFile(fileToken, count, ext);
			const insert = await insertImagePath(path);
			if (path) {
				ctx.body = { code: 200, path, msg: "文件合并成功" };
				return true;
			}
		} catch (error) {
			ctx.body = { code: 500, msg: "文件合并失败" };
			return false;
		}
	}
	ctx.body = {
		code: 405,
		msg: "文件上传失败",
	};
});

router.post("/test", async (ctx) => {
	ctx.body  = {
		code: 200,
		data: {
			msg: "Hello World!"
		}
	}
})

module.exports = router.routes();
