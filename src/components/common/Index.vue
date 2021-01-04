<template>
  <div class="index">
    <v-header class="header"></v-header>
    <aside class="aside">
      <div class="aside-add">
        <!-- <p class="aside-img"></p> -->
        <h3 class="aside-header">乐有商城</h3>
        <!-- <h5 class="aside-title"></h5> -->
      </div>
      <!--导航菜单-->
      <el-menu default-active="0"
               class="menu-header"
               unique-opened
               router
               style="overflow-y:auto;">
        <el-scrollbar>
          <v-NavMenu :navMenus="menuList"></v-NavMenu>
        </el-scrollbar>
      </el-menu>
    </aside>
    <!-- <v-aside :navMenus="menuList" class="aside"></v-aside> -->
    <div class="container"
         ref="container">
      <transition>
        <router-view mode="out-in"></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import vNavMenu from './Aside'
import vHeader from './Header'
// import vAside from "./Aside";

export default {
  name: 'Index',
  components: { vHeader, vNavMenu },
  data() {
    return {
      menuList: [],
    }
  },
  mounted() {
    this.getMenu()
  },
  methods: {
    async getMenu() {
      this.menuList = JSON.parse(sessionStorage.getItem('personal'))
      // await  this.$axios
      //   .get(globalConfig.server1 + "menu-resource/select-menu")
      //   .then(res => {
      //     if (res.data.code === 200) {

      //       this.menuList = res.data.data.children;
      //     } else {
      //       this.$message.error(res.data.message);
      //     }
      //   });
    },
  },
}
</script>
<style>
.index {
  background-color: #e8eaee;
  width: 100%;
}
.header {
  background-color: #333333;
  position: fixed;
  top: 0;
  right: 0;
  height: 50px;
  width: calc(100vw - 200px);
  z-index: 200;
  color: #fff;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.aside {
  display: block;
  width: 200px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #eb8600;
}
.aside-header {
  width: 200px;
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
  background: url('../../assets/bg-logo.png');
  background-size: 100% 100%;
  width: 91px;
  height: 51px;
  margin: 0 auto;
}
.aside-add {
  margin-top: 22px;
  text-align: center;
}
.aside-title {
  width: 200px;
  height: 10px;
  background: url('../../assets/eg.png');
  background-size: 100% 100%;
  margin: 0 auto;
  margin-top: 8px;
}
.menu-header {
  background-color: #eb8600;
  color: #e8eaee;
  margin-top: 20px;
  overflow-y: scroll !important;
  height: 450px;
  width: 200px;
}
.menu-header::-webkit-scrollbar {
  display: none;
}
.el-submenu .el-menu {
  background-color: #eb8600;
}
.el-submenu .el-menu-item {
  font-size: 16px;
}
.el-submenu__title {
  font-size: 20px;
  color: #fff;
  text-align: center;
  padding-left: 20px !important;
  line-height: 24px;
}
.el-submenu__title:hover {
  color: #000;
}
.el-menu-item {
  font-size: 20px;
  color: #fff;
  text-align: center;
}
.el-menu-item:hover {
  color: #000;
}
.el-menu-item.is-active {
  color: #000 !important;
  background-color: #e8eaee !important;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: #e8eaee;
  color: #000;
}
.el-submenu__title i {
  display: block;
  color: #fff;
}

.el-menu {
  background-color: #eb8600;
}
</style>
