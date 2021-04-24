<template>
  <div class="index">
    <v-header class="header" />
    <aside class="aside">
      <div class="aside-top">
        <h3 class="aside-header">乐有商城</h3>
      </div>
      <el-menu default-active="0"
               background-color="#1D3557"
               active-text-color="var(--primary)"
               unique-opened
               router>
        <el-scrollbar>
          <v-NavMenu :navMenus="menuList"></v-NavMenu>
        </el-scrollbar>
      </el-menu>
    </aside>
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

<style lang='scss' scoped>
.index {
  width: 100vw;
  background-color: var(--background);
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  height: 50px;
  width: calc(100vw - 200px);
  color: var(--title3);
  background-color: var(--white);
  z-index: 200;
}

.aside {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;

  .aside-header {
    width: 200px;
    color: var(--white);
    font-size: var(--font-huge);
    background-color: #1d3557;
    font-weight: bold;
    line-height: 50px;
    margin: 0;
    text-align: center;
  }

  /deep/ .el-menu {
    color: #e8eaee;
    overflow-y: scroll !important;
    border: none !important;
    height: calc(100vh - 50px);
    width: 200px;

    &::-webkit-scrollbar {
      display: none;
    }

    .el-scrollbar {
      height: 100%;
    }

    .el-scrollbar__wrap {
      height: 100%;
    }

    .el-submenu .el-menu-item {
      color: var(--white);
      color: #fff;
      font-size: 14px;
    }

    .el-submenu__title {
      color: var(--white);
      font-size: 15px;
      text-align: center;
      line-height: 50px;

      // &:hover {
      //   color: var(--white);
      //   background-color: var(--primary-light);
      // }

      i {
        color: var(--white);
        display: block;
      }
    }

    .el-menu-item {
      color: #ffffff !important;
      font-size: 15px;
      text-align: center;

      &:hover {
        color: var(--white);
        background-color: var(--primary-light);
      }

      &.is-active {
        color: var(--white);
        background-color: var(--primary-light);
      }
    }
  }
}
</style>
