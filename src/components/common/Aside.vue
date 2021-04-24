<template>
  <div>
    <label v-for="(navMenu,index) in navMenus"
           :key="index">
      <el-submenu v-if="navMenu.children&&navMenu.children.length>0"
                  :index="navMenu.id">
        <template slot="title">
          <!-- <i style="width:15px;height:15px;"
             :class="navMenu.icon"></i> -->
          <span slot="title">{{navMenu.name}}</span>
        </template>
        <el-menu-item-group>
          <Aside :navMenus="navMenu.children"></Aside>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else
                    :key="navMenu.id"
                    :index="navMenu.id"
                    :route="navMenu.path">
        <!-- <i style="width:15px;height:15px;"
           :class="navMenu.icon"></i> -->
        <span slot="title">{{navMenu.name}}</span>
      </el-menu-item>

    </label>

  </div>
</template>
<script>
export default {
  data() {
    return {
      accessUrl: '',
      subMenuUrl: '',
    }
  },
  props: ['navMenus'],
  name: 'Aside',
  methods: {
    chackFirst() {
      console.log(111)
    },
  },
}
</script>
