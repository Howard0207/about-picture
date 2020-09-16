import axios from "_service";
const CancelToken = axios.CancelToken;

// 上传文件chunk
export const uploadFileChunk = (requestParams) => {
    return axios.post("/upload/picture", requestParams).then((res) => {
        if (res.code === 200) {
            return res.data;
        }
    });
};

export const testCancelToken = () => {
    let cancel;
    let request = axios
        .get("/primary-electrical/testCancelToken", {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
        })
        .then((res) => {
            console.log(res);
        });
    return [request, cancel];
};
