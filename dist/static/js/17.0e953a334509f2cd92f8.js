webpackJsonp([17],{"6Tbr":function(e,r,t){"use strict";function s(e){t("kA9x")}Object.defineProperty(r,"__esModule",{value:!0});var a=t("AefN"),o=t("zqkd"),i=t("VU/8"),n=s,l=i(a.a,o.a,!1,n,"data-v-afe707e8",null);r.default=l.exports},"9GLn":function(e,r,t){r=e.exports=t("FZ+f")(!1),r.push([e.i,".register-form[data-v-afe707e8]{margin:40px auto;width:400px}h3[data-v-afe707e8]{text-align:center;margin-top:5%}",""])},AefN:function(e,r,t){"use strict";var s=t("mvHQ"),a=t.n(s);r.a={data:function(){return{registerForm:{name:"",password:"",phone:"",qq:"",sex:"",age:""},registerFormRules:{name:[{required:!0,message:"请输入用户名"}],password:[{required:!0,message:"请输入密码"}],phone:[{required:!0,message:"请输入手机号"}],qq:[{required:!0,message:"请输入QQ"}],sex:[{required:!0,message:"请选择性别"}],age:[{required:!0,message:"请输入年龄"},{type:"number",message:"请输入数字"}]}}},methods:{signUp:function(){var e=this;this.$refs["register-form"].validate(function(r){if(!r)return e.$message.error("信息填写错误"),!1;e.$http.ajax({url:APIHOST+"auth/api/register",dataType:"json",contentType:"application/json; charset=UTF-8",type:"post",data:a()(e.registerForm)}).done(function(r){1===r.result?(e.$message({message:"注册成功",type:"success"}),localStorage.setItem("userName",e.registerForm.name),e.$router.push("/")):e.$message({message:r.msg,type:"error"})}).fail(function(){e.$message({message:"注册接口出错，请联系管理员！",type:"warning"})})})}}}},kA9x:function(e,r,t){var s=t("9GLn");"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t("rjj0")("57af0107",s,!0,{})},mvHQ:function(e,r,t){e.exports={default:t("qkKv"),__esModule:!0}},qkKv:function(e,r,t){var s=t("FeBl"),a=s.JSON||(s.JSON={stringify:JSON.stringify});e.exports=function(e){return a.stringify.apply(a,arguments)}},zqkd:function(e,r,t){"use strict";var s=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",[t("h3",[e._v("欢迎注册比心优选商家")]),e._v(" "),t("el-form",{ref:"register-form",staticClass:"register-form",attrs:{"label-width":"80px",model:e.registerForm,rules:e.registerFormRules}},[t("el-form-item",{attrs:{label:"用户名",prop:"name"}},[t("el-input",{model:{value:e.registerForm.name,callback:function(r){e.$set(e.registerForm,"name","string"==typeof r?r.trim():r)},expression:"registerForm.name"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"密码",prop:"password"}},[t("el-input",{attrs:{type:"password"},model:{value:e.registerForm.password,callback:function(r){e.$set(e.registerForm,"password","string"==typeof r?r.trim():r)},expression:"registerForm.password"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"手机号",prop:"phone"}},[t("el-input",{model:{value:e.registerForm.phone,callback:function(r){e.$set(e.registerForm,"phone","string"==typeof r?r.trim():r)},expression:"registerForm.phone"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"QQ号",prop:"qq"}},[t("el-input",{model:{value:e.registerForm.qq,callback:function(r){e.$set(e.registerForm,"qq","string"==typeof r?r.trim():r)},expression:"registerForm.qq"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"性别",prop:"sex"}},[t("el-select",{model:{value:e.registerForm.sex,callback:function(r){e.$set(e.registerForm,"sex",r)},expression:"registerForm.sex"}},[t("el-option",{attrs:{value:1,label:"男"}}),e._v(" "),t("el-option",{attrs:{value:2,label:"女"}})],1)],1),e._v(" "),t("el-form-item",{attrs:{label:"年龄",prop:"age"}},[t("el-input",{model:{value:e.registerForm.age,callback:function(r){e.$set(e.registerForm,"age",e._n(r))},expression:"registerForm.age"}})],1),e._v(" "),t("el-form-item",[t("el-button",{staticClass:"lg-btn",attrs:{type:"primary"},on:{click:e.signUp}},[e._v("注册")])],1)],1)],1)},a=[],o={render:s,staticRenderFns:a};r.a=o}});