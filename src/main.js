import Vue from "vue";
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import App from "./App";
import router from "./router";
import jquery from "jquery";
import axios from "axios";
import storeCan from "./store/store.js";
import "font-awesome-webpack"; // font-awesome
import "./assets/element-variables.scss";
import "./assets/global.scss"; // global css
import "./assets/custom.scss";
import "./assets/iconfonts/iconfont.css"; // icon-font

import https from "./assets/api/axios";

Vue.use(ElementUI);
Vue.config.productionTip = false;
if (process.env.NODE_ENV == "development") {
  console.log(window.g.SERVICE_CONTEXT_PATH);
  global.globalConfig = {
    server1: "http://www.leeeyou.com/jerry_server/",
    // server1: "http://42.192.234.88:9500/jerry_server/",
    header: {
      "Content-Type": "application/json"
    }
  };
} else if (process.env.NODE_ENV == "production") {
  global.globalConfig = {
    server1: window.g.SERVICE_CONTEXT_PATH,
    header: {
      "Content-Type": "application/json"
    }
  };
}

global.downloadFileApiHost = "http://218.93.24.35/"; // 文件下载地址

axios.defaults.withCredentials = true;
axios.defaults.headers = globalConfig.header;

Vue.prototype.$http = jquery;

Vue.prototype.$axios = axios;
Vue.prototype.$https = https;

// const DEVSERVER = "http://42.192.234.88:9500/jerry_server/";
const DEVSERVER = "http://www.leeeyou.com/jerry_server/";
const PRODSERVER = "http://www.leeeyou.com/jerry_server/";

const FileDownlaod = "http://218.93.24.35/";
const FileUpload = "http://218.93.24.35/";

if (process.env.NODE_ENV === "development") {
  global.APIHOST = DEVSERVER;
} else if (process.env.NODE_ENV === "production") {
  global.APIHOST = PRODSERVER;
}

Vue.prototype.$IMGHOST = FileUpload;
Vue.prototype.$GETIMGHOST = FileDownlaod;

// 重定向router
router.beforeEach((to, from, next) => {
  // 页面切换取消上次请求
  storeCan._axiosPromiseCancel.forEach(e => {
    e && e();
  });
  storeCan._axiosPromiseCancel = [];

  if (to.path === "/") {
    sessionStorage.removeItem("personal");
  }
  let data = sessionStorage.getItem("personal");
  if (!data && to.path !== "/") {
    next({ path: "/" });
  } else if (data && to.path === "/") {
    next({ path: "/" });
  } else {
    next();
  }
});
// vue-router的错误处理函数 onError 捕获错误
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

jquery.ajaxSetup({
  crossDomain: true,
  xhrFields: { withCredentials: true },
  error: function(xhr, status, error) {
    console.log("xhr", xhr);
    if (xhr.status === 403) {
      let hasLogout = sessionStorage.getItem("logout");
      if (hasLogout) {
        return;
      }
      sessionStorage.setItem("logout", true);
      ElementUI.MessageBox.confirm("登录超时，请重新登录", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false
      })
        .then(() => {
          this.$router.push("/");
          sessionStorage.removeItem("logout");
        })
        .catch(() => {});
    }
  }
});

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: { App }
});
