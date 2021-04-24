<template>
  <div>
    <label v-for="(navMenu,index) in navMenus"
           :key="index">
      <el-submenu v-if="navMenu.children&&navMenu.children.length>0"
                  :index="navMenu.id">
        <template slot="title">
          <i style="width:15px;height:15px;"
             :class="navMenu.icon"></i>
          <span slot="title">{{navMenu.name}}</span>
        </template>
        <el-menu-item-group>
          <NavMenu :navMenus="navMenu.children"></NavMenu>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else
                    :key="navMenu.id"
                    :index="navMenu.id"
                    :route="navMenu.path">
        <i style="width:15px;height:15px;"
           :class="navMenu.icon"></i>
        <span slot="title">{{navMenu.label}}</span>
      </el-menu-item>
    </label>

  </div>
</template>  

<script>
export default {
  name: 'NavMenu',
  props: ['navMenus'],
  data() {
    return {}
  },
  methods: {},
}
</script>  
  
<style scoped>
.el-menu {
  height: 100%;
  background-color: #eb8600 !important;
  margin-top: 30px;
}
.el-menu-item {
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-box-align: center;
  padding-left: 0px !important;
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

.aside-title {
  width: 200px;
  height: 10px;
  background: url('../../assets/eg.png');
  background-size: 100% 100%;
  margin: 0 auto;
  margin-top: 8px;
}
</style>
