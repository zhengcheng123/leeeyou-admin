<template>
  <div class="login-box">
    <div class="login-bg"></div>
    <div class="login-text"
         @keyup.enter="login">
      <!-- <i class="iconfont icon-shopping icon-4x" aria-hidden="true"></i> -->
      <div class="login-boxsha">
        <div class="login-herder">welcome</div>
        <h3>乐有商城后台系统</h3>
        <el-form class="login-form"
                 :model="loginForm"
                 ref="loginForm"
                 :rules="loginFormRules">
          <el-row :gutter="0">
            <el-col :span="16"
                    :offset="4">
              <el-form-item prop="name">
                <el-input v-model="loginForm.username"
                          placeholder="账号">
                  <template slot="prepend">
                    <!-- <i class="fa fa-user icon" aria-hidden="true"></i> -->
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="16"
                    :offset="4">
              <el-form-item prop="password">
                <el-input v-model="loginForm.password"
                          placeholder="密码"
                          type="password">
                  <template slot="prepend">
                    <!-- <i class="fa fa-lock icon" aria-hidden="true"></i> -->
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0"
                  class="remember-me">
            <el-col :span="4"
                    :offset="4">
              <el-checkbox v-model="isRemember">记住我</el-checkbox>
            </el-col>
            <el-col :span="4"
                    :offset="9">
              <!-- <router-link :to="'register'" class="link">注册</router-link> -->
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="16"
                    :offset="4">
              <el-form-item>
                <button @click.prevent="login"
                        class="lg-btn"
                        type="primary">登录</button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <span class="version right">{{version}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      personal: {},
      loginForm: {
        username: '',
        password: '',
      },
      loginFormRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
      isRemember: true,
      version: '0.0.0',
    }
  },
  mounted: function () {
    this.getVersion()
    this.setUserName()
  },
  methods: {
    getVersion() {
      console.log(APIHOST)
      this.$http
        .ajax({
          url: APIHOST + 'cgi/system/getVersion',
          dataType: 'json',
          context: this,
        })
        .done(function (res) {
          if (res.result === 1) {
            this.version = res.object
          } else {
            console.log({ message: '获取版本号失败', type: 'error' })
          }
        })
        .fail(function (error) {
          // console.log(res.message, error);
        })
    },
    setUserName() {
      if (localStorage.getItem('userName') !== null) {
        this.loginForm.username = localStorage.getItem('userName')
      }
    },
    login() {
      this.$refs['loginForm'].validate((validateResult) => {
        if (validateResult) {
          const formData = new FormData()
          formData.append('username', this.loginForm.username)
          formData.append('password', this.loginForm.password)
          this.$http
            .ajax({
              url: `${APIHOST}login`,
              type: 'post',
              contentType: false,
              processData: false,
              data: formData,
              context: this,
            })
            .done((res) => {
              if (res.code === 200) {
                this.$message({ message: '登录成功', type: 'success' })
                this.personal = res.data.meu.children
                sessionStorage.setItem('userName', this.loginForm.username)
                sessionStorage.setItem('personal', JSON.stringify(this.personal))
                if (this.isRemember) {
                  localStorage.setItem('userName', this.loginForm.username)
                } else {
                  localStorage.removeItem('userName')
                }
                // 所有可见路由
                let path = [res.data.meu.children]
                const debutPage = path.some((ele) => ele.path === '/index') ? '/index' : path[0]
                let pathArr = debutPage.map((item, index) => {
                  return item.path
                })

                // if (!res.haveStore) {
                //   this.$router.push("/store/create");
                //   return false;
                // }
                // this.$router.push("/index");
                this.$router.push(pathArr[0])
                // sessionStorage.removeItem("logout");
              } else {
                this.$message({ message: res.message, type: 'error' })
              }
            })
            .fail((res) => {
              this.$message({
                message: JSON.parse(res.responseText).message,
                type: 'warning',
              })
            })
        } else {
          this.$message({ message: '登录信息填写错误', type: 'error' })
        }
      })
    },
  },
}
</script>
<style scoped>
.login-box {
  -webkit-box-pack: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  min-width: 1200px !important;
  min-height: 500px !important;
}
.login-bg {
  background: url('../../assets/bg.jpeg');
  background-size: 100% 100%;
  width: 70%;
  height: 100%;
  background-repeat: no-repeat;
}
.login-text {
  width: 36%;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: unset;
  right: 0;
  margin: auto;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-box-align: center;
}

.login-herder {
  position: absolute;
  top: -100px;
  width: 399px;
  height: 100px;
  font-size: 80px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(255, 120, 13, 1);
  /* line-height: 200px; */
  opacity: 0.15;
}
.el-row i {
  margin-top: 3px;
}

.lg-btn {
  width: 220px;
  height: 35px;
  background: rgba(255, 120, 13, 1);
  border: 1px solid rgba(255, 120, 13, 1);
  border-radius: 6px;
  margin-top: 30px;
  color: #fff;
  cursor: pointer;
}

.version {
  color: #aaa;
  position: absolute;
  bottom: 8px;
  right: 10px;
}

.icon {
  font-size: 22px;
}

.remember-me {
  margin-bottom: 5px;
}

.link {
  font-size: 14px;
  color: #ff780d;
  text-decoration: none;
}
h3 {
  width: 293px;
  height: 35px;
  font-size: 36px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: rgba(27, 27, 27, 1);
  /* line-height: 215px; */
  margin-left: 25px;
}
.login-form {
  position: relative;
  top: 80px;
}
</style>
<style>
.login-text .el-input__inner {
  border: none;
  border-bottom: 1px solid #999;
  border-radius: initial;
}
.login-text .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #999;
  border-color: #999;
}
.login-text .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1b0e0e;
}
.login-boxsha {
  /* height: 100%; */
  position: relative;
}
</style>

