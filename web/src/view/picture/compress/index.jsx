import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Upload, Progress, Empty } from "antd";
import { UploadOutlined, PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
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
		this.state = { fileList: [], threads: 4, request: [], uploadQueue: [] };
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
	emptyFile = () => this.setState({ fileList: [], request: [], uploadQueue: [] });

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

	calculateFileHash = (fileChunkList) => {};

	updateProgress = () => this.forceUpdate();

	releaseRequest = (source) => {
		const idx = this.state.request.findIndex((item) => item === source);
		this.state.request.splice(idx, 1);
	};

	uploadFileChunk = (requestParams, data, idx) => {
		const { file, chunkData } = data;
		data.loaded[idx] = data.loaded[idx] || 0;
		if (chunkData[idx].size >= data.loaded[idx]) {
			const source = CancelToken.source();
			this.state.request.push(source);
			console.log(data);
			return axios
				.post("/upload/picture", requestParams, {
					cancelToken: source.token,
					onUploadProgress: (progress) => {
						const { loaded } = progress;
						data.loaded[idx] = loaded;
						// console.log(data.loaded, file.size);
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
				});
			// .catch(() => {
			// 	console.log("错误的release了");
			// 	this.releaseRequest(source);
			// });
		} else {
			return Promise.resolve();
		}
	};

	// 判断文件是否分片
	isFileSplitToChunk = (file) => {
		if (Array.isArray(file.chunkData) && file.chunkData.length) {
			return true;
		}
		return false;
	};

	// 初始化chunk上传参数
	initUploadChunkParams = (data) => {
		const { chunkData, file, cur, token } = data;
		const ext = file.name.split(".").pop();
		const formData = new FormData();
		formData.append("fileIndex", cur);
		formData.append("file", chunkData[cur].chunk);
		formData.append("token", token);
		return { formData, token, ext };
	};

	uploadChunkF = (requestParams, data, cur) => {
		const { file, chunkData, uploadChunkStatus } = data;
		const { request } = this.state;
		console.log(cur);
		data.loaded[cur] = data.loaded[cur] || 0;
		if (chunkData[cur].size >= data.loaded[cur]) {
			const source = CancelToken.source();
			request.push(source);
			uploadChunkStatus[cur] = "uploading";
			return axios
				.post("/upload/picture", requestParams, {
					cancelToken: source.token,
					onUploadProgress: (progress) => {
						const { loaded } = progress;
						data.loaded[cur] = loaded;
						let totalLoaded = 0;
						for (let data of data.loaded) {
							if (!data) data = 0;
							totalLoaded += data;
						}
						data.uploadProgress = parseInt((totalLoaded / file.size) * 100);
						if (data.updateProgress > 100) data.updateProgress = 100;
						this.updateProgress();
					},
				})
				.then((res) => {
					this.releaseRequest(source);
					if (res.data.status === 200) {
						uploadChunkStatus[cur] = "uploaded";
						return res.data;
					}
				});
		} else {
			return Promise.resolve();
		}
	};

	handleUploadFile = (file) => {
		const params = this.initUploadChunkParams(file);
		const { cur, chunkData } = file;
		const { formData, token, ext } = params;
		const { uploadQueue, request, threads } = this.state;
		const uploadProcess = this.uploadChunkF(formData, file, cur);
		uploadProcess.then(() => {
			if (file.cur < file.chunkData.length) {
				this.handleUploadFile(file);
				file.cur++;
			} else {
				const findResult = file.uploadChunkStatus.find((item) => item === "uploading");
				console.log(findResult);
				if (!findResult) {
					const idx = uploadQueue.findIndex((item) => item === file);
					uploadQueue.splice(idx, 1);
					axios.post("/upload/picture", { type: "merge", count: chunkData.length, token, ext });
					this.setState({ uploadQueue }, () => {
						// const waitItem = uploadQueue.find((item) => !item.uploadStatus);
						if (request.length < threads) {
							this.upload();
						}
					});
					file.uploadStatus = "success";
				}
			}
		});
	};

	// 文件上传
	upload = () => {
		const { uploadQueue, threads, request } = this.state;
		let idx = 0;
		let left = 0;
		let count = 0;
		for (; idx < uploadQueue.length && request.length < threads; idx++) {
			const file = uploadQueue[idx];
			if (!file.uploadStatus) {
				file.cur = 0;
				file.uploadStatus = "updating";
				this.handleUploadFile(file);
				file.cur++;
			}
		}
		while (request.length < threads && uploadQueue.length > 0 && count < 4) {
			left = left < uploadQueue.length ? left : 0;
			const file = uploadQueue[left];
			if (file.cur < file.chunkData.length) {
				this.handleUploadFile(file);
				idx++;
				file.cur++;
			}
			count++;
			left++;
		}
	};

	// 单文件开始上传
	start = async (upfile) => {
		const { uploadQueue } = this.state;
		if (!this.isFileSplitToChunk(upfile)) {
			const fileChunkList = this.createFileChunk(upfile.file);
			upfile.loaded = [];
			upfile.uploadChunkStatus = [];
			upfile.token = +new Date();
			upfile.chunkData = fileChunkList.map(({ file }, index) => {
				return { chunk: file, filename: upfile.file.name, index, size: file.size };
			});
		}
		uploadQueue.push(upfile);
		this.setState({ uploadQueue }, this.upload);
	};

	// 所有文件一起上传
	startAll = async () => {
		const { uploadQueue, fileList } = this.state;
		fileList.forEach((item, idx) => {
			if (!item.uploadStatus && !this.isFileSplitToChunk(item)) {
				const fileChunkList = this.createFileChunk(item.file);
				item.loaded = [];
				item.uploadChunkStatus = [];
				item.token = +new Date() + idx;
				item.chunkData = fileChunkList.map(({ file }, index) => {
					return { chunk: file, filename: item.file.name, index, size: file.size };
				});
				uploadQueue.push(item);
			}
		});
		this.setState({ uploadQueue }, this.upload);
	};

	// 单文件停止上传
	stop = (item) => {
		this.cancelRequest = true;
		let source = this.state.request.shift();
		console.log("正在取消上传");
		while (source) {
			source.cancel("取消请求");
			console.log(this.state.request);
			source = this.state.request.shift();
		}
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
					<Button onClick={this.startAll}>全部开始</Button>
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
												<Progress percent={item.uploadProgress} status={item.uploadProgress === 100 ? null : "active"} />
											</div>
											{item.uploadProgress === 0 ? (
												<PlayCircleOutlined
													onClick={() => this.start(item)}
													style={{ marginLeft: "30px", fontSize: "20px", color: "#1890ff" }}
												/>
											) : item.uploadProgress < 100 ? (
												<PauseCircleOutlined
													onClick={() => this.stop(item)}
													style={{ marginLeft: "30px", fontSize: "20px", color: "#1890ff" }}
												/>
											) : null}
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
