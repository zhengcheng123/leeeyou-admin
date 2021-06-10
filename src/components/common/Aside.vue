<template>
  <div>
    <el-menu :default-active="activeRouter"
             background-color="#003459"
             active-text-color="var(--primary)"
             unique-opened
             router>
      <div v-for="items in navMenus"
           :key="items.id">
        <el-submenu v-if="items.children.length"
                    :index="items.path">
          <template slot="title"><i :class="items.icon || 'el-icon-menu'"></i>{{items.name}}</template>
          <el-menu-item v-for="subItems in items.children"
                        :key="subItems.id"
                        :index="subItems.path">{{subItems.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item v-if="!items.children.length"
                      :index="items.path">
          <i :class="items.icon || 'el-icon-menu'"></i>
          <span slot="title">{{items.name}}</span>
        </el-menu-item>
      </div>

    </el-menu>

  </div>
</template>

<script>
export default {
  name: 'Aside',
  props: ['navMenus'],
  data() {
    return {
      accessUrl: '',
      subMenuUrl: '',
    }
  },
  computed: {
    activeRouter() {
      return this.$route.path
    },
  },
  mounted() {
    console.log(this.navMenus)
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-menu {
  color: #bfbfc0;
  overflow-y: scroll !important;
  border: none !important;
  width: var(--nav-width);

  &::-webkit-scrollbar {
    display: none;
  }

  .el-scrollbar {
    height: 100%;
  }

  .el-scrollbar__wrap {
    height: 100%;
  }

  .el-menu-item {
    color: #bfbfc0;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
      color: var(--white);
      background-color: var(--primary-light);

      i {
        color: var(--white);
      }
    }

    &.is-active {
      color: var(--white) !important;
      background-color: var(--primary) !important;
      background-color: var(--primary-light);
      font-weight: 500;
    }
  }

  .el-submenu__title {
    color: #bfbfc0;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    font-size: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
      color: var(--white);
    }
  }

  .el-menu--inline {
    .el-menu-item {
      font-size: 14px;
      padding-left: 49px !important;
    }
  }
}
</style>
