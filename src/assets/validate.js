const MoneyReg = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;

export const checkMoney = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("金额不能为空"));
  }
  if (!MoneyReg.test(value)) {
    callback(new Error("请输入有效金额（最多保留两位小数）"));
  } else {
    callback();
  }
};

export const checkAge = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("年龄不能为空"));
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error("请输入数字值"));
    } else {
      if (value < 18) {
        callback(new Error("必须年满18岁"));
      } else {
        callback();
      }
    }
  }, 1000);
};

export const checkNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("数量不能为空"));
  }
  if (!Number.isInteger(value)) {
    callback(new Error("请输入数字值"));
  } else {
    callback();
  }
};
