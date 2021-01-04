<template>
  <div class="not-found">
    <h1>404</h1>
    <br>
    <h2>
      啊，页面找不到了！
    </h2>
    <br>
    <el-button type="primary" @click="backLogin">去登陆</el-button>
  </div>
</template>
<script>
  export default {
    methods: {
      backLogin () {
        this.$router.push('/')
      }
    }
  }
</script>
<style>
  .not-found {
    margin-top: 15%;
    text-align: center;
  }
</style>
