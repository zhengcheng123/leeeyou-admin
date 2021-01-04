<template>
  <div>
    <h3>欢迎注册比心优选商家</h3>
    <el-form label-width="80px" :model="registerForm" class="register-form"
             :rules="registerFormRules" ref="register-form">
      <el-form-item label="用户名" prop="name">
        <el-input v-model.trim="registerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="registerForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="registerForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="QQ号" prop="qq">
        <el-input v-model.trim="registerForm.qq"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="registerForm.sex">
          <el-option :value="1" label="男"></el-option>
          <el-option :value="2" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="registerForm.age"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="signUp" class="lg-btn" type="primary">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        registerForm: {
          name: '',
          password: '',
          phone: '',
          qq: '',
          sex: '',
          age: ''
        },
        registerFormRules: {
          name: [{required: true, message: '请输入用户名'}],
          password: [{required: true, message: '请输入密码'}],
          phone: [{required: true, message: '请输入手机号'}],
          qq: [{required: true, message: '请输入QQ'}],
          sex: [{required: true, message: '请选择性别'}],
          age: [
            {required: true, message: '请输入年龄'},
            {type: 'number', message: '请输入数字'}
          ]
        }
      }
    },
    methods: {
      signUp () {
        this.$refs['register-form'].validate(valid => {
          if (!valid) {
            this.$message.error('信息填写错误')
            return false
          }
          this.$http.ajax({
            url: APIHOST + 'auth/api/register',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            type: 'post',
            data: JSON.stringify(this.registerForm)
          }).done(res => {
            if (res.result === 1) {
              this.$message({message: '注册成功', type: 'success'})
              localStorage.setItem('userName', this.registerForm.name)
              this.$router.push('/')
            } else {
              this.$message({message: res.msg, type: 'error'})
            }
          }).fail(() => {
            this.$message({message: '注册接口出错，请联系管理员！', type: 'warning'})
          })
        })
      }
    }
  }
</script>
<style scoped>
  .register-form {
    margin: 40px auto;
    width: 400px;
  }

  h3 {
    text-align: center;
    margin-top: 5%;
  }
</style>
