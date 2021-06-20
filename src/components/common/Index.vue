<template>
  <div class="index">
    <Header class="header" />
    <aside class="aside">
      <div class="aside-top">
        <img src="../../assets/logo.png"
             alt="">
        <h3>乐有商城管理平台</h3>
      </div>
      <el-scrollbar>
        <Aside :navMenus="menuList"></Aside>
      </el-scrollbar>
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
import Header from './Header'
import Aside from './Aside'

export default {
  name: 'Index',
  components: { Header, Aside },
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
  width: calc(100vw - var(--nav-width));
  color: var(--title3);
  background-color: var(--white);
  z-index: 999;
}

.aside {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #003459;

  .aside-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #1d3557;
    padding-left: 20px;
    margin-bottom: 5px;

    img {
      width: 24px;
    }

    h3 {
      color: var(--white);
      font-size: var(--font-large);
      font-weight: bold;
      line-height: 50px;
      margin: 0;
      padding-left: 5px;
    }
  }
}
</style>
