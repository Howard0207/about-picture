import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Upload, Progress, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import QueueAnim from "rc-queue-anim";
import axios from "axios";
import "_less/compress";

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

var chunkSize = 200 * 1024; // 切片大小

class Compress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { fileList: [], waitUploadList: [] };
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
        if (size < Math.pow(num, 2)) {
            return (size / num).toFixed(2) + "K";
        } // kb
        if (size < Math.pow(num, 3)) {
            return (size / Math.pow(num, 2)).toFixed(2) + "M";
        } // M
        if (size < Math.pow(num, 4)) {
            return (size / Math.pow(num, 3)).toFixed(2) + "G";
        } // G
        return (size / Math.pow(num, 4)).toFixed(2) + "T"; // T
    };

    // 清空列表
    emptyFile = () => {
        this.setState({ fileList: [] });
    };

    handleUpload = async () => {
        const { waitUploadList } = this.state;
        if (waitUploadList.length === 0) {
            return false;
        }
        console.log("handleupload ----------------------- start");
        for (let i = 0; i < waitUploadList.length; i++) {
            fileIndex = i;
            if (["secondPass", "success"].includes(filesArr[i].status)) {
                console.log("跳过已上传成功或已秒传的");
                continue;
            }
            const fileChunkList = this.createFileChunk(filesArr[i]);
        }
    };

    // 文件分片
    createFileChunk = (file, size = chunkSize) => {
        const fileChunkList = [];
        var count = 0;
        while (count < file.size) {
            fileChunkList.push({
                file: file.slice(count, count + size),
            });
            count += size;
        }
        console.log("createFileChunk -> fileChunkList", fileChunkList);
        return fileChunkList;
    };

    calculateFileHash = (fileChunkList) => {};

    uploadChunk = async (chunk) => {
        axios.post(url, {});
    };

    render() {
        const { fileList } = this.state;
        console.log(fileList);
        const props = {
            beforeUpload: (file) => {
                this.setState((state) => ({
                    fileList: [...state.fileList, file],
                    waitUploadList: [...state.waitUploadList, file],
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
                    <Button>上传</Button>
                    <Button>暂停</Button>
                    <Button>恢复</Button>
                    <Button onClick={this.emptyFile}>清空</Button>
                </header>
                <main className="main">
                    {fileList.length > 0 ? (
                        <QueueAnim delay={300} className="queue-simple">
                            {fileList.map((item) => {
                                return (
                                    <div key={item.uid} className="upload-item">
                                        <div className="upload-name">名称：{item.name}</div>
                                        <div className="upload-size">大小：{this.transformByte(item.size)}</div>
                                        <div className="upload-progress">
                                            <span className="label">进度：</span>
                                            <div className="content">
                                                <Progress percent={50} status="active" />
                                            </div>
                                        </div>
                                        <div className="upload-status">待上传</div>
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
