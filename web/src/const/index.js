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
