import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Upload, Progress, Empty } from "antd";
import { UploadOutlined, PlayCircleOutlined, PauseCircleOutlined, RedoOutlined } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
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
	enqueue: "enqueue",
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
	success: "已上传",
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
			fileChunkList.push({ chunk: file.slice(count, count + size) });
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

	updateProgress = () => this.forceUpdate();

	releaseRequest = (source) => {
		const idx = this.state.request.findIndex((item) => item === source);
		this.state.request.splice(idx, 1);
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

	releaseFileInfoThread = (threads, source) => {
		const idx = threads.findIndex((item) => item === source);
		threads.splice(idx, 1);
	};

	uploadChunkF = (requestParams, data, cur) => {
		const { file, chunkData, uploadChunkStatus, threads } = data;
		const { request } = this.state;
		data.loaded[cur] = data.loaded[cur] || 0;
		if (chunkData[cur].size >= data.loaded[cur]) {
			const source = CancelToken.source();
			request.push(source);
			threads.push(source);
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
					this.releaseFileInfoThread(threads, source);
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
				if (!findResult) {
					const idx = uploadQueue.findIndex((item) => item === file);
					uploadQueue.splice(idx, 1);
					axios.post("/upload/picture", { type: "merge", count: chunkData.length, token, ext }).then(() => {
						file.status = fileStatus.success;
						this.updateProgress();
						this.setState({ uploadQueue }, () => {
							if (request.length < threads) {
								this.upload();
							}
						});
					});
				}
			}
		});
	};

	// 文件上传
	upload = () => {
		const { uploadQueue, threads, request } = this.state;
		let left = 0; // 上传队列指针
		let count = 0; // 资源再分配计数器， 防止死循环
		for (let idx = 0; idx < uploadQueue.length && request.length < threads; idx++) {
			const file = uploadQueue[idx];
			if (file.status === fileStatus.enqueue) {
				file.cur = 0;
				file.status = fileStatus.uploading;
				this.handleUploadFile(file);
				file.cur++;
			}
		}
		while (request.length < threads && uploadQueue.length > 0 && count < 4) {
			left = left < uploadQueue.length ? left : 0;
			const file = uploadQueue[left];
			if (file.cur < file.chunkData.length) {
				this.handleUploadFile(file);
				file.cur++;
			}
			count++;
			left++;
		}
	};

	// 初始化上传文件信息
	initFileInfo = (fileInfo) => {
		const { file } = fileInfo;
		const { uid, name } = file;
		if (fileInfo.status === "wait" || !this.isFileSplitToChunk(fileInfo)) {
			const fileChunkList = this.createFileChunk(fileInfo.file);
			fileInfo.loaded = [];
			fileInfo.uploadChunkStatus = [];
			fileInfo.token = uid;
			fileInfo.threads = [];
			fileInfo.leftIndexList = [];
			fileInfo.status = fileStatus.enqueue;
			fileInfo.chunkData = fileChunkList.map(({ chunk }, index) => ({ chunk: chunk, filename: name, index, size: chunk.size }));
		}
	};

	// 单文件上传
	start = async (fileInfo) => {
		const { uploadQueue } = this.state;

		// 初始化文件信息
		this.initFileInfo(fileInfo);
		// 将文件压入上传队列
		uploadQueue.push(fileInfo);
		// 启动上传任务
		this.setState({ uploadQueue }, this.upload);
	};

	// 所有文件一起上传
	startAll = async () => {
		const { uploadQueue, fileList } = this.state;

		// 将所有待上传文件压入队列
		fileList.forEach((item) => {
			if (item.status === "wait") {
				this.initFileInfo(item);
				uploadQueue.push(item);
			}
		});
		this.setState({ uploadQueue }, this.upload);
	};

	// 释放上传文件所占线程资源
	releaseFileThreads = (fileInfo) => {
		const { threads } = fileInfo;
		const { request } = this.state;
		let source = threads.shift();
		while (source) {
			source.cancel("取消上传");
			const idx = request.findIndex((item) => item === source);
			if (idx > -1) {
				request.splice(idx, 1);
			}
			source = threads.shift();
		}
	};

	// 上传文件出栈
	fileInfoDequeue = (fileInfo) => {
		const { uploadQueue } = this.state;
		const idx = uploadQueue.findIndex((item) => item === fileInfo);
		if (idx > -1) {
			uploadQueue.splice(idx, 1);
		}
	};

	// 重置指针
	resetFileInfoPointer = (fileInfo) => {
		const { uploadChunkStatus } = fileInfo;
		const idx = uploadChunkStatus.findIndex((status) => status === Status.uploading);
		fileInfo.cur = idx > -1 ? idx : 0;
	};

	// 单文件停止上传
	stop = (fileInfo) => {
		fileInfo.status = fileStatus.pause;
		this.fileInfoDequeue(fileInfo);
		this.releaseFileThreads(fileInfo);
		this.upload();
		this.resetFileInfoPointer(fileInfo);
		this.forceUpdate();
	};

	resume = (fileInfo) => {
		const { uploadQueue } = this.state;
		console.log(fileInfo);
		fileInfo.status = fileStatus.uploading;
		// 将文件压入上传队列
		uploadQueue.push(fileInfo);
		// 启动上传任务
		this.setState({ uploadQueue }, this.upload);
	};

	// 单文件操作按钮
	operationBtn = (item) => {
		switch (item.status) {
			case fileStatus.pause:
				return <RedoOutlined onClick={() => this.resume(item)} className="operationBtn" />;
			case fileStatus.wait:
				return <PlayCircleOutlined onClick={() => this.start(item)} className="operationBtn" />;
			case fileStatus.uploading:
			case fileStatus.enqueue:
				return <PauseCircleOutlined onClick={() => this.stop(item)} className="operationBtn" />;
			case fileStatus.success:
			default:
				return <div className="operationBtn"></div>;
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
										</div>
										{this.operationBtn(item)}
										<div className="upload-status">{fileStatusStr[item.status]}</div>
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
