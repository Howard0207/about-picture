const fs = require("fs");
const Router = require("@koa/router");
const router = new Router();
const { generateUUID } = require("../../utils");
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
					resolve("finished");
				}
			});
		};
		writeFile();
	});
};

router.post("/picture", async (ctx) => {
	// 获取前端file
	let { files } = ctx.request;
	const { token, fileIndex, type, count, ext } = ctx.request.body;

	// 处理文件 -> 重命名
	if (files) {
		let originPath = files.file.path;
		let newPath = originPath.slice(0, originPath.lastIndexOf("\\") + 1) + fileIndex + "-" + token;
		try {
			await fs.rename(originPath, newPath, (err) => {
				if (err) throw err;
			});
		} catch (error) {
			ctx.body = { status: 500, msg: "上传失败" };
		}
		ctx.body = { status: 200, msg: "上传成功" };
		return false;
	}

	// 合并文件 -> 写入到新的目录中去
	if (type === "merge") {
		try {
			const res = await mergeFile(token, count, ext);
			if (res === "finished") {
				ctx.body = { status: 200, msg: "文件合并成功" };
				return true;
			}
		} catch (error) {
			ctx.body = { status: 500, msg: "文件合并失败" };
			return false;
		}
	}
	ctx.body = {
		status: 405,
		msg: "文件上传失败",
	};
});

module.exports = router.routes();
