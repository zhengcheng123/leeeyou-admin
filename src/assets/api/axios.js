/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
// import QS from 'qs'
import axios from "axios";
import router from "@/router";
import store from "@/store";
import { Message } from "element-ui";

// const serverLocal2 = 'http://10.219.11.196:9092/' // 张月飞-dev
// const serverProduction = 'http://10.219.11.81:9092/' // 张月飞-production

// // 环境的切换
// if (process.env.NODE_ENV == 'development') {
//     axios.defaults.baseURL = serverLocal2
// } else if (process.env.NODE_ENV == 'debug') {
//     axios.defaults.baseURL = serverLocal2
// } else if (process.env.NODE_ENV == 'production') {
//     axios.defaults.baseURL = serverProduction
// }

// global.downloadFileApiHost = serverProduction
// axios.defaults.withCredentials = true
// axios.defaults.headers = globalConfig.header

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: "/"
    // query: {
    //     redirect: router.currentRoute.fullPath
    // }
  });
};
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    case 302: // 302: 身份过期的重定向
      Message.error(other);
      toLogin();
      break;
    case 401: // 401: 未登录状态，跳转登录页
      Message.error(other);
      toLogin();
      break;
    case 403: // 403 token过期,清除token并跳转登录页
      Message.error("登录过期，请重新登录");
      localStorage.removeItem("token");
      store.commit("loginSuccess", null);
      setTimeout(() => {
        // toLogin()
      }, 1000);
      break;
    case 404: // 404请求不存在
      Message.error("请求的资源不存在");
      break;
    case 500:
      Message.error("服务器错误");
      break;
    default:
  }
};

// 创建axios 实例

const service = axios.create({
  baseURL: "http://www.leeeyou.com/jerry_server/",
  timeout: 10000,
  withCredentials: true
});

// request 拦截器
service.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    // console.log("response", response);
    return response.status === 200 ? response.data : response.data;
  },
  error => {
    // console.log("error");
    if (axios.isCancel(error)) {
      // 取消请求导致的error
      return new Promise(() => {});
    } else {
      if (error.response.data.message == "尚未登录，请登录!") {
        ElementUI.MessageBox.confirm("登录超时，请重新登录", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false
        })
          .then(() => {
            router.push("/");
          })
          .catch(() => {});
        storeCan._axiosPromiseCancel.forEach(e => {
          e && e();
        });
        storeCan._axiosPromiseCancel = [];
      }
      // return Promise.reject(error)
      return error.response;
    }
  }
);

export default service;
