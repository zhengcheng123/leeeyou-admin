<template>
  <div class="header"
       :style="{borderBottom: '1px solid #ebeef0'}">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="i in breadcrumbAry"
                            :key="i.path"
                            :to="{ path: i.path }">{{i.name ? i.name : '首页'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <div>
        <span>欢迎你</span>
        <span>{{userName}}</span>
      </div>
      <div @click="editPass">
        <i class="el-icon-edit-outline editOutline"></i>
        <span>修改密码</span>
      </div>
      <div @click="logout">
        <i class="fa fa-sign-out"
           aria-hidden="true"></i>
        <span>注销</span>
      </div>
    </div>
    <el-dialog width="400px"
               top="30vh"
               title="修改密码"
               class="dialog-common-style"
               append-to-body
               :close-on-click-modal="false"
               :visible.sync="dialogVisible"
               @closed="resetForm('modifyPassForm')">
      <el-form :model="modifyPassForm"
               :rules="rules"
               ref="modifyPassForm"
               label-width="81px">
        <el-form-item label="账号"
                      prop="age">
          <span style="font-size: 18px;">{{userName}}</span>
        </el-form-item>
        <el-form-item label="原密码"
                      prop="oldPassword">
          <el-col :span="23">
            <el-input type="password"
                      size="mini"
                      show-password
                      v-model.trim="modifyPassForm.oldPassword"
                      placeholder="请输入新密码"
                      autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="newPassword">
          <el-col :span="23">
            <el-input type="password"
                      size="mini"
                      show-password
                      v-model.trim="modifyPassForm.newPassword"
                      placeholder="请输入新密码"
                      autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="checkPass">
          <el-col :span="23">
            <el-input type="password"
                      size="mini"
                      show-password
                      v-model.trim="modifyPassForm.checkPass"
                      placeholder="请再次输入密码"
                      autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   :disabled="btnSure"
                   @click="submitPassword(modifyPassForm)">确 定</el-button>
        <el-button type="info"
                   @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        if (this.modifyPassForm.checkPass) {
          this.$refs.modifyPassForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.modifyPassForm.newPassword) {
        this.btnSure = true
        callback(new Error('两次输入密码不一致!'))
      } else {
        this.btnSure = false
        callback()
      }
    }
    return {
      breadcrumbAry: [],
      btnSure: false,
      dialogVisible: false,
      modifyPassForm: {
        // id: "",
        oldPassword: '',
        newPassword: '',
        checkPass: '',
      },
      rules: {
        newPassword: [{ required: true, validator: validatePass }],
        checkPass: [{ required: true, validator: validateCheckPass }],
        oldPassword: [{ required: true, message: '请输入原密码' }],
      },
    }
  },
  computed: {
    userName() {
      let userName = sessionStorage.getItem('userName')
      if (userName !== null) {
        return userName
      } else {
        return '未登录'
      }
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(a, b) {
        this.breadcrumbAry = a.matched
      },
    },
  },
  methods: {
    logout() {
      this.$http
        .ajax({
          url: APIHOST + 'logout',
          dataType: 'json',
          type: 'post',
          context: this,
        })
        .done(function (res) {
          if (res.code === 200) {
            sessionStorage.removeItem('userName')
            this.$message({ message: '注销成功', type: 'success' })
            this.$router.push('/')
          } else {
            this.$message({ message: '注销失败', type: 'error' })
          }
        })
    },
    editPass() {
      this.dialogVisible = true
    },
    /**
     * 提交密码修改
     * @param formName
     */
    submitPassword(formName) {
      this.$refs['modifyPassForm'].validate((valid) => {
        if (valid) {
          const formData = new FormData()
          formData.append('oldPassword', this.modifyPassForm.oldPassword)
          formData.append('newPassword', this.modifyPassForm.newPassword)
          this.$axios.post(globalConfig.server1 + 'auth/app/updatePassword', formData).then((res) => {
            if (res.result === 1) {
              this.$message.success('修改成功,请重新登陆')
              this.$router.push('/')
            } else {
              this.dialogVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    cancel() {
      this.modifyPassForm = {
        oldPassword: '',
        newPassword: '',
        checkPass: '',
      }
      this.$refs['modifyPassForm'].resetFields()
      this.dialogVisible = false
    },
    resetForm() {},
  },
}
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .breadcrumb {
    float: left;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    color: var(--title6);

    > div {
      margin-left: 20px;

      &:first-child {
        color: var(--title3);
        font-weight: 500;
        margin-right: 30px;
      }
    }
  }
}
</style>
