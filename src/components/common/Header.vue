<template>
  <div>
    <div class="oper">
      <div class="inline-block logout" @click="logout">
        <i class="fa fa-sign-out" aria-hidden="true"></i>
        <span>退出</span>
      </div>
      <div class="editPass" @click="editPass">
        <i class="el-icon-edit-outline editOutline"></i>
        <span>修改密码</span>
      </div>
    </div>
    <div class="info">
      <span>欢迎你</span>
      <span>{{userName}}</span>
    </div>

    <el-dialog
      width="400px"
      top="30vh"
      title="修改密码"
      class="dialog-common-style"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @closed="resetForm('modifyPassForm')"
    >
      <el-form :model="modifyPassForm" :rules="rules" ref="modifyPassForm" label-width="81px">
        <el-form-item label="账号" prop="age">
          <span style="font-size: 18px;">{{userName}}</span>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-col :span="23">
            <el-input
              type="password"
              size="small"
              show-password
              v-model.trim="modifyPassForm.oldPassword"
              placeholder="请输入新密码"
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-col :span="23">
            <el-input
              type="password"
              size="small"
              show-password
              v-model.trim="modifyPassForm.newPassword"
              placeholder="请输入新密码"
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-col :span="23">
            <el-input
              type="password"
              size="small"
              show-password
              v-model.trim="modifyPassForm.checkPass"
              placeholder="请再次输入密码"
              autocomplete="off"
            ></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="btnSure" @click="submitPassword(modifyPassForm)">确 定</el-button>
        <el-button type="info" @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else {
        if (this.modifyPassForm.checkPass) {
          this.$refs.modifyPassForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.modifyPassForm.newPassword) {
        this.btnSure = true;
        callback(new Error("两次输入密码不一致!"));
      } else {
        this.btnSure = false;
        callback();
      }
    };
    return {
      btnSure: false,
      dialogVisible: false,
      modifyPassForm: {
        // id: "",
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      },
      rules: {
        newPassword: [{ required: true, validator: validatePass }],
        checkPass: [{ required: true, validator: validateCheckPass }],
        oldPassword:[{ required: true, message: "请输入原密码" }]
      }
    };
  },
  computed: {
    userName() {
      let userName = sessionStorage.getItem("userName");
      if (userName !== null) {
        return userName;
      } else {
        return "未登录";
      }
    }
  },
  methods: {
    logout() {
      this.$http
        .ajax({
          url: APIHOST + "logout",
          dataType: "json",
          type: "post",
          context: this
        })
        .done(function(res) {
          if (res.code === 200) {
            sessionStorage.removeItem("userName");
            this.$message({ message: "注销成功", type: "success" });
            this.$router.push("/");
          } else {
            this.$message({ message: "注销失败", type: "error" });
          }
        });
    },
    editPass() {
      this.dialogVisible = true;
    },
    /**
     * 提交密码修改
     * @param formName
     */
    submitPassword(formName) {
        this.$refs["modifyPassForm"].validate(valid => {
        if (valid) {
          const formData = new FormData();
      formData.append("oldPassword", this.modifyPassForm.oldPassword);
      formData.append("newPassword", this.modifyPassForm.newPassword);
          this.$axios
            .post(globalConfig.server1 + "auth/app/updatePassword",
              formData
            )
            .then(res => {
              if (res.result === 1) {
                this.$message.success("修改成功,请重新登陆");
                this.$router.push("/");
              } else {
                this.dialogVisible = false;
              }
            });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.modifyPassForm = {
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      };
      this.$refs["modifyPassForm"].resetFields();
      this.dialogVisible = false;
    },
    resetForm() {}
  }
};
</script>

<style scoped>
.logo {
  float: left;
  color: #fff;
  font-size: 24px;
  line-height: 50px;
  text-decoration: none;
  margin-left: 20px;
}

.info,
.oper {
  float: right;
  line-height: 50px;
  margin-right: 50px;
}

.oper {
  cursor: pointer;
}

.logout {
  margin-left: 20px;
  float: left;
}
.editPass {
  float: left;
  margin-left: 50px;
}
.editOutline {
  color: #eb8600;
}

</style>
