import axios from "./service";

// 上传文件chunk
export const uploadFileChunk = (requestParams) => {
    return axios.post("/upload/picture", requestParams).then((res) => {
        if (res.code === 200) {
            return res.data;
        }
    });
};
