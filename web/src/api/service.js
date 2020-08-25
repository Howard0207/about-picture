import Axios from "axios";

// 创建axios实例
const instance = Axios.create({ timeout: 10000 });

const checkStatus = (response) => {
    switch (response.status) {
        case 401:
            console.log("没有权限---------------------------------------");
            return false;
        case 500:
            console.log("服务器出错-------------------------------------");
            return false;
        default:
            return true;
    }
};

// request AOP
instance.interceptors.request.use(
    (config) => config,
    (error) => {}
);

// response AOP
instance.interceptors.response.use(
    (response) => {
        const statusPass = checkStatus(response);
        if (statusPass) {
            return response.data;
        }
        return Promise.reject(response);
    },
    (error) => Promise.reject(error)
);

export default instance;
