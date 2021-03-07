import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Upload, Progress, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import { uploadFileChunk } from "_api";
import { errorCapture } from "_utils";
import axios from "axios";
import "_less/compress";

const CancelToken = axios.CancelToken;

// 所有文件状态
const Status = {
	wait: "wait",
	pause: "pause",
	uploading: "uploading",
	hash: "hash",
	error: "error",
	done: "done",
};

// 单个文件的状态
const fileStatus = {
	wait: "wait",
	uploading: "uploading",
	success: "success",
	error: "error",
	secondPass: "secondPass",
	pause: "pause",
	resume: "resume",
};
// 单个文件的状态 对应描述
const fileStatusStr = {
	wait: "待上传",
	uploading: "上传中",
	success: "成功",
	error: "失败",
	secondPass: "已秒传",
	pause: "暂停",
	resume: "恢复",
};

var chunkSize = 100 * 1024; // 切片大小

class Compress extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { fileList: [], threads: 4, request: [] };
	}

	// 计算文件大小
	transformByte = (size) => {
		if (!size) {
			return "0B";
		}
		var num = 1024.0; // byte
		if (size < num) {
			return size + "B";
		}
		// kb
		if (size < Math.pow(num, 2)) {
			return (size / num).toFixed(2) + "K";
		}
		// M
		if (size < Math.pow(num, 3)) {
			return (size / Math.pow(num, 2)).toFixed(2) + "M";
		}
		// G
		if (size < Math.pow(num, 4)) {
			return (size / Math.pow(num, 3)).toFixed(2) + "G";
		}
		// T
		return (size / Math.pow(num, 4)).toFixed(2) + "T";
	};

	// 清空列表
	emptyFile = () => {
		this.setState({ fileList: [] });
	};

	// 文件分片
	createFileChunk = (file, size = chunkSize) => {
		const fileChunkList = [];
		var count = 0;
		while (count < file.size) {
			fileChunkList.push({ file: file.slice(count, count + size) });
			count += size;
		}
		console.log("createFileChunk -> fileChunkList", fileChunkList);
		return fileChunkList;
	};

	// 上传处理
	handleUpload = async () => {
		const { fileList } = this.state;
		if (fileList.length === 0) {
			return false;
		}
		console.log("handleupload ----------------------- start");
		for (let i = 0; i < fileList.length; i++) {
			if (["secondPass", "success"].includes(fileList[i].status)) {
				console.log("跳过已上传成功或已秒传的");
				continue;
			}
			// 对文件进行分片
			const fileChunkList = this.createFileChunk(fileList[i].file);
			fileList[i].chunkData = fileChunkList.map(({ file }, index) => {
				return { chunk: file, filename: fileList[i].file.name, index, size: file.size };
			});
			await this.uploadChunk(fileList[i]);
		}
	};

	// 上传分片
	uploadChunk = async (data) => {
		const token = +new Date();
		const { chunkData, file } = data;
		const ext = file.name.split(".").pop();
		const formList = chunkData
			.filter((item) => !item.chunk.uploaded)
			.map(({ chunk, index, filename }) => {
				const formData = new FormData();
				formData.append("fileIndex", index);
				formData.append("file", chunk);
				formData.append("token", token);
				return { formData, index, filename, token };
			});
		this.sendRequset(formList, ext, data);
	};

	calculateFileHash = (fileChunkList) => {};

	updateProgress = () => {
		this.forceUpdate();
	};

	releaseRequest = (source) => {
		const idx = this.state.request.findIndex((item) => item === source);
		this.state.request.splice(idx, 1);
	};

	uploadFileChunk = (requestParams, data, idx) => {
		const { file } = data;
		data.loaded[idx] = 0;
		const source = CancelToken.source();
		this.state.request.push(source);
		return axios
			.post("/upload/picture", requestParams, {
				cancelToken: source.token,
				onUploadProgress: (progress) => {
					const { loaded } = progress;
					data.loaded[idx] = loaded;
					console.log(data.loaded, file.size);
					let totalLoaded = 0;
					for (let data of data.loaded) {
						if (!data) data = 0;
						totalLoaded += data;
					}
					data.uploadProgress = parseInt((totalLoaded / file.size) * 100);
					console.log(data.uploadProgress);
					if (data.updateProgress > 100) data.updateProgress = 100;
					this.updateProgress();
				},
			})
			.then((res) => {
				this.releaseRequest(source);
				if (res.code === 200) {
					return res.data;
				}
			})
			.catch(() => {
				this.releaseRequest(source);
			});
	};

	stop = () => {
		let [source] = this.state.request;
		console.log("正在取消上传");
		while (source) {
			source.cancel();
			source = this.state.request.shift();
		}
	};

	// 发送上传请求
	sendRequset = (formList, ext, data) => {
		const { threads } = this.state;
		const { token } = formList[0];
		const count = formList.length;
		let uploadChunkIndex = count;
		const maxLoop = Math.min(threads, count);
		let requestMerged = false;
		data.loaded = [];
		return new Promise((resolve, reject) => {
			const handler = async () => {
				const requestItem = formList.pop();
				if (requestItem) {
					const { formData } = requestItem;
					uploadChunkIndex--;
					await this.uploadFileChunk(formData, data, uploadChunkIndex);
					handler();
				} else {
					if (!requestMerged) {
						requestMerged = true;
						const [err] = await errorCapture(uploadFileChunk, { type: "merge", count, token, ext });
						if (err) {
						} else {
							data.status = "success";
							resolve("finished");
						}
					}
				}
			};
			for (let i = 0; i < maxLoop; i++) {
				handler();
			}
		});
	};

	getUploadStatus = (uploadProgress) => {
		if (uploadProgress === 0) {
			return "待上传";
		} else if (uploadProgress === 100) {
			return "已上传";
		} else {
			return "上传中";
		}
	};

	render() {
		const { fileList } = this.state;
		const props = {
			beforeUpload: (file) => {
				this.setState((state) => ({
					fileList: [...state.fileList, { file: file, status: "wait", uploadProgress: 0 }],
				}));
				return false;
			},
			fileList,
			multiple: true,
			showUploadList: false,
		};
		return (
			<div className="compress">
				<header className="compress__header">
					<Upload {...props}>
						<Button>
							<UploadOutlined />
							选择文件
						</Button>
					</Upload>
					<Button onClick={this.handleUpload}>上传</Button>
					<Button onClick={this.stop}>暂停</Button>
					<Button>恢复</Button>
					<Button onClick={this.emptyFile}>清空</Button>
				</header>
				<main className="compress__main">
					{fileList.length > 0 ? (
						<QueueAnim delay={300} className="queue-simple">
							{fileList.map((item) => {
								return (
									<div key={item.file.uid} className="upload-item">
										<div className="upload-name">名称：{item.file.name}</div>
										<div className="upload-size">大小：{this.transformByte(item.file.size)}</div>
										<div className="upload-progress">
											<span className="label">进度：</span>
											<div className="content">
												<Progress percent={item.uploadProgress} status="active" />
											</div>
										</div>
										<div className="upload-status">{this.getUploadStatus(item.uploadProgress)}</div>
									</div>
								);
							})}
						</QueueAnim>
					) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无待上传数据" />
					)}
				</main>
			</div>
		);
	}
}
Compress.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
};
export default withRouter(Compress);
