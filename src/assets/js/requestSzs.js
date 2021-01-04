import { log } from "util";

// 封装的方法系列
// 封装的方法系列
// 封装的方法系列

/***
 * [获取当前是第几周for年]
 */
export const getYearWeek = (a, b, c) => {
  var date1 = new Date(a, parseInt(b) - 1, c),
    date2 = new Date(a, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
};


/**
* 根据日期获取当前周一日期
   * @param date 指定日期
   * @returns {string}当前周一日期
   */
export const getFirstDayOfWeek = (date) => {
  var day = date.getDay() || 7;
  var date1;
  date.getDate() + 1 > 7 ? date1 = date.getDate() + 1 - day : date1 = date.getDate() + 1;
  return (date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date1)
}


/**
 * 获取本周末日期
 * @param {new Date()} time
 */
export const GetWeekDate = (time) => {
  let now = time; //当前日期
  let nowDayOfWeek = now.getDay(); //今天本周的第几天
  let nowYear = now.getYear(); //当前年
  let nowMonth = now.getMonth(); //月
  let nowDay = now.getDate(); //日
  let beginHour = "09:00:00";
  let endHour = "23:59:59";
  nowYear += (nowYear < 2000) ? 1900 : 0; //
  nowDayOfWeek = nowDayOfWeek == 0 ? 7 : nowDayOfWeek; // 如果是周日，就变成周七
  let weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
  return weekEndDate;
}


/**
 * [数组去重]
 */
export const deleteRepeat1 = (arr) => {
  let newArray = [];
  let newArr = [];
  for (let index = 0; index < arr.length; index++) {
    if (arr[index].value == null) {
      arr.splice(index, 1)
    } else {
      newArr.push(JSON.stringify(arr[index]))
    }
  }
  // index是目标数组中的每一个元素
  newArr.forEach(function (index) {
    if (newArray.indexOf(index) == -1) {
      newArray.push(index);
    }
  });
  let handerArr = [];
  newArray.map(val => {
    handerArr.push(JSON.parse(val))
  })
  return handerArr;
}


/***
 * [路由返回]
 */
export const goBack = (_this) => {
  setTimeout(() => {
    _this.$router.go(-1)
  }, 100);
}


/**
 * [根据登录人ID判断编辑和详情的权限]
 * isEdit 是否展示编辑删除
 */
export const editJurisdiction = (tabData) => {
  tabData.map(item => {
    item.status == "0" &&
      (item.creator == JSON.parse(sessionStorage.getItem("personal")).id || item.creater == JSON.parse(sessionStorage.getItem("personal")).id || item.designer ==
        JSON.parse(sessionStorage.getItem("personal")).nameCn)
      ? (item.isEdit = true)
      : (item.isEdit = false);
  });
  return tabData
}


/***
 * [删除数组内索引值]
 */
export const deleteArrByIndex = (arr, delIndex) => {
  let temArray = [];
  for (var i = 0; i < arr.length; i++) {
    if (i != delIndex) {
      temArray.push(arr[i]);
    }
  }
  return temArray;
}


/**
 * 并且保留两位小数
 * 设置金额千分位展示
 */
export const comdify = (n) => {
  n = returnFloat(n)
  n = n.toString()
  var re = /\d{1,3}(?=(\d{3})+$)/g;
  var n1 = n.replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => {
    return s1.replace(re, "$&,") + s2
  })
  return n1
}




/**
 * [提示信息]
 */
export const alentMessage = (val, type, _this) => {
  _this.$message({
    dangerouslyUseHTMLString: true,
    message: val,
    type: type
  })
}


/**
 * [删除操作二次确认]
 */
export const delAlent = (_this) => {
  return _this.$confirm("确定删除选中项?", "提示", {
    customClass: "userMangerDel",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    type: "warning"
  })
}


/**
 * [提交校验]
 */
export const Validation = (val, arr) => {
  let bol = true;
  arr.map(item => {
    if (!val[item]) {
      bol = false
    }
  })
  return bol
}

// 封装的请求系列
// 封装的请求系列
// 封装的请求系列
/**
 * [获取字典字段]
 */
export const getField = (_this, params, option) => {
  option = option || {};
  _this.$http
    .post(`${globalConfig.server1}dictionary/getDicts`, params).then(res => {
      if (res.data.code == 200) {
        let data = res.data.data;
        params.map(item => {
          data.map(val => {
            item == val.code ? option[item] = val.content : ''
          })
        })
        return option
      }
    })
}
/**
 * Array去重
 */
export const distinct = (arr, type) => {
  if (arr.length == 0) {
    return arr;
  } else {
    if (type) {
      var obj = {}
      var newArr = arr.reduce((cur, next) => {
        obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
        return cur;
      }, [])
      return newArr;
    } else {
      return Array.from(new Set(arr));
    }
  }
}

