import axios from "axios";

// 统一处理 接口错误
// // eslint-disable-next-line no-unused-vars
// function checkCode(res) {
//     if (res) {
//         if (res.data.response.success) {
//             // res.data.data.success 这里是我们后端数据是这样
//             return res;
//         }
//         // throw '具体接口错误'; // 比如：登录密码错误等，所有接口错误 都在这里处理了
//         return false;
//     }
//     return false;
// }

// function checkStatus(status) {
//     switch (status) {
//         case 200:
//             // alert(200);
//             return true;
//         case 401:
//             window.location.href = '/';
//             // alert('403'); // 我们后台 是处理登录过期
//             return false;
//         case 500:
//             // alert('500'); // 处理500错误
//             return false;
//         default:
//             return true;
//     }
// }

/**
 * 自定义实例默认值
 */
const instance = axios.create({
    // baseURL: 'http://yapi.demo.qunar.com/mock/1152', // 公	共接口url（如果有多个的公共接口的话，需要处理）
    timeout: 10000, // 请求超时
});
// /api/getUserById

// 请求拦截器, 进行一个全局loading  加载，这种情况下所有的接口请求前 都会加载一个loading

/**
 * 添加请求拦截器 ，意思就是发起请求接口之前做什么事，一般都会发起加载一个loading
 * */

//  如果不想每个接口都加载loading ，就注释掉请求前拦截器,在http这个类中处理

instance.interceptors.request.use(
    (config) => {
        const extendConfig = config;
        // 在发送请求之前做些什么（这里写展示loading的逻辑代码 ）
        // 获取token，配置请求头
        const TOKEN = localStorage.getItem("andianu_token");
        let curFactory = localStorage.getItem("currentFactory");
        let factoryId = "";
        try {
            curFactory = JSON.parse(curFactory);
            factoryId = curFactory.cid;
        } catch (e) {
            factoryId = "";
        }
        if (TOKEN) {
            // 配置请求头 token
            extendConfig.headers["Content-Type"] = "application/json";
            extendConfig.headers.Authorization = TOKEN;
        }
        if (extendConfig.method === "post") {
            if (extendConfig.data !== undefined) {
                extendConfig.data.cid = factoryId;
            } else {
                extendConfig.data = `{"cid":${factoryId}}`;
            }
        } else if (extendConfig.method === "get") {
            if (extendConfig.params) {
                extendConfig.params.cid = factoryId;
            } else {
                extendConfig.params = { cid: factoryId };
            }
        }

        return extendConfig;
    },
    (error) => {
        // 对请求错误做些什么，处理这个错误
        // 可以直接处理或者展示出去,toast show()
        // console.warn(error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        // 根据后端定义请求过期后返回的参数，处理token过期问题
        // 我这个接口木有token啊，这里演示下
        // 判断
        const { status } = response.data;
        // 判断状态码401或者其它条件
        // checkStatus(status);
        if (status === 401) {
            localStorage.removeItem("andianu_token");
            window.location.href = "/login";
        }
        // if (Object.is(status, 401)) {
        // token过期后处理
        // 1.删除你本地存储的那个过期的token
        // 2. 跳转到登陆页（因为没有装路由，不写了，重新登陆赋值）
        //  todo...
        // }
        return response.data;
    },
    (error) => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default instance;
