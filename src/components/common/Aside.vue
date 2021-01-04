<template>
  <div>
   
    <!-- <el-menu :default-active="onRoute" unique-opened @select="changeRoute">
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
    </el-menu> -->

 <label v-for="(navMenu,index) in navMenus" :key="index">
        <el-submenu v-if="navMenu.children&&navMenu.children.length>0" :index="navMenu.id">  
            <template slot="title">  
                <i style="width:15px;height:15px;" :class="navMenu.icon"></i>
                <span slot="title" >{{navMenu.name}}</span>  
            </template>  
            <el-menu-item-group >
                <Aside :navMenus="navMenu.children"></Aside>  
            </el-menu-item-group>
        </el-submenu> 
        
        <el-menu-item v-else :key="navMenu.id" :index="navMenu.id"  :route="navMenu.path" >  
            <i style="width:15px;height:15px;"  :class="navMenu.icon"></i>
            <span  slot="title">{{navMenu.name}}</span>  
        </el-menu-item>  
  
       
    </label>  

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
  props: ['navMenus'],  
  name: 'Aside',  
  computed: {
    // onRoute: function() {
    //   return this.$route.path.split('/')[1]
    // },
    // isSubRoot() {
    //   return this.$route.path.split('/').length === 2
    // },
  },
  methods: {
    changeRoute(index) {
      // if (index === this.onRoute && this.isSubRoot) {
      //   window.location.reload()
      // } else {
      //   this.$router.push('/' + index)
      // }
    },
    chackFirst(){
        console.log(111)
      }
  }
}
</script>
<style scoped>


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
