<template>
  <div>
     <div class="aside-add">
      <p class="aside-img"></p>
      <h3 class="aside-header">庆丰商城管理系统</h3>
      <h5 class="aside-title"></h5>
    </div>
    <el-menu :default-active="onRoute" unique-opened @select="changeRoute">
      <el-menu-item index="goods">
        <i class="fa fa-shopping-bag" aria-hidden="true"></i>
        商品管理
      </el-menu-item>
      <el-menu-item index="trade">
        <i class="fa fa-bars" aria-hidden="true"></i>
        交易管理
      </el-menu-item>
      <el-menu-item index="afterSell">
        <i class="fa fa-user-circle-o" aria-hidden="true"></i>
        售后管理
      </el-menu-item>
      <el-menu-item index="store">
        <i class="fa fa-archive" aria-hidden="true"></i>
        我的店铺
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      accessUrl: '',
      subMenuUrl: ''
    }
  },
  computed: {
    onRoute: function() {
      return this.$route.path.split('/')[1]
    },
    isSubRoot() {
      return this.$route.path.split('/').length === 2
    }
  },
  methods: {
    changeRoute(index) {
      if (index === this.onRoute && this.isSubRoot) {
        window.location.reload()
      } else {
        this.$router.push('/' + index)
      }
    }
  }
}
</script>
<style scoped>
.el-menu {
  height: 100%;
  background-color: #eb8600!important;
  margin-top:30px;
}
.el-menu-item {
      color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-box-align: center;
    padding-left: 0px!important;
    height: 80px;
}
.el-menu-item i {
  color: #fff;
  padding-right: 10px;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #e8eaee;
  color: #000;
}

.el-menu-item:focus,
.el-menu-item:hover i {
  color: #eb8600;
}

.aside-header {
  width: 196px;
  height: 23px;
  font-size: 24px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 20px;
  margin: 0 auto;
  margin-top: 25px;
}
.aside-img {
  background: url("../../assets/bg-logo.png");
  background-size: 100% 100%;
  width: 91px;
  height: 51px;
  margin: 0 auto;
}
.aside-add {
  margin-top: 22px;
}
.aside-title {
  width: 200px;
  height: 10px;
  background: url("../../assets/eg.png");
  background-size: 100% 100%;
  margin: 0 auto;
  margin-top: 8px;
}
</style>
