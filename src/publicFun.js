// 全局函数
export default {
  install(Vue, options) {
    //权限检查方法
    Vue.prototype.$_has = function(value) {
      let isExist = false;
      let buttonpermsStr = sessionStorage.getItem("menu");
      if (buttonpermsStr == undefined || buttonpermsStr == null) {
        return false;
      }
      if (buttonpermsStr.indexOf(value) > -1) {
        isExist = true;
      }
      return isExist;
    };

    // 顶部message弹窗
    Vue.prototype.message = function(val, msg) {
      switch (val) {
        case "success":
          this.$message.success({
            title: "成功",
            duration: 2000,
            message: msg
          });
          break;
        case "warning":
          this.$message.warning({
            title: "警告",
            duration: 2000,
            message: msg
          });
          break;
        case "error":
          this.$message.error({
            title: "错误",
            duration: 2000,
            message: msg
          });
          break;
      }
    };
    // 表格格式化(适用于key,value)字典项
    Vue.prototype.filterTable = function(el, arr) {
      let Con = "";
      for (var i = 0; i < arr.length; i++) {
        arr[i].key == el ? (Con = arr[i].value) : "";
      }
      return Con;
    };
    // export const getField = (_this, params) => {
    //   let option = {};
    //   _this.$http
    //     .post(`${globalConfig.server1}dictionary/getDicts`, params).then(res => {
    //       if (res.data.code == 200) {
    //         let data = res.data.data;
    //         params.map(item => {
    //           data.map(val => {
    //             item == val.code ? option[item] = val.content : ''
    //           })
    //         })
    //       }
    //     })
    //   return option
    // }
  }
};
