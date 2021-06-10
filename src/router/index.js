import Vue from "vue";
import Router from "vue-router";
import index from "../components/common/Index.vue";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "首页",
      component: resolve => import("@/components/common/Login")
    },

    {
      path: "/register",
      component: resolve => import("@/components/common/Register")
    },
    {
      path: "/",
      component: resolve => import("@/components/common/Index"),
      children: [
        {
          path: "/api/goods",
          name: "商品管理",
          meta: {
            iconName: 'el-icon-goods'
          },
          component: resolve => import("@/components/module/goods")
        },
        {
          path: "/api/goods/add",
          name: "添加商品",
          component: resolve => import("@/components/module/goodsForm")
        },
        {
          path: "/goods/info",
          name: "商品详情",
          component: resolve => import("@/components/module/goodsInfo")
        },
        {
          path: "/goods/edit",
          name: "编辑商品",
          component: resolve => import("@/components/module/goodsInfo")
        },
        {
          path: "/store",
          name: "我的店铺",
          component: resolve => import("@/components/module/store")
        },
        {
          path: "/store/create",
          component: resolve => import("@/components/module/storeForm")
        },
        {
          path: "/api/trade",
          name: "交易管理",
          component: resolve => import("@/components/module/trade")
        },
        {
          path: "/trade/:id",
          component: resolve => import("@/components/module/tradeDetail")
        },
        {
          path: "/api/afterSell",
          name: "售后管理",

          component: resolve => import("@/components/module/afterSell")
        },
        {
          path: "/usersManage",
          name: "用户管理",
          component: resolve =>
            import("../components/module/setting/userManger")
        },
        {
          path: "/roleManage",
          name: "角色管理",
          component: resolve =>
            import("../components/module/setting/roleManage")
        },
        {
          path: "/systemVersion",
          name: "系统版本",

          component: resolve =>
            import("../components/module/setting/systemVersion")
        },
        {
          path: "/menuManage",
          name: "菜单管理",
          component: resolve =>
            import("../components/module/setting/menuManage")
        },
        {
          path: "/traceLog",
          name: "日志管理",

          component: resolve => import("../components/module/setting/logManage")
        },
        {
          path: "/index",
          component: resolve => import("@/components/common/index")
        },
        {
          path: "/sendRemove",
          component: resolve => import("@/components/module/sendRemove")
        },
        {
          path: "/postage",
          name: "运费管理",
          component: resolve => import("@/components/module/setStore")
        },
        {
          path: "/returnAdress",
          component: resolve => import("@/components/module/returnAdress")
        },
        {
          path: "/api/store/myStore",
          component: resolve => import("@/components/module/coupon")
        },

        {
          path: "/counponDetail",
          component: resolve => import("@/components/module/counponDetail")
        },
        {
          path: "/editCounpon",
          component: resolve => import("@/components/module/editCounpon")
        },
        {
          path: "/coupon",
          name: "优惠券管理",
          component: resolve => import("@/components/module/coupon/list")
        },
        {
          path: "/coupon/add",
          name: "新增优惠券",
          component: resolve => import("@/components/module/coupon/add")
        },
        {
          path: "/coupon/edit/:id",
          name: "编辑优惠券",
          component: resolve => import("@/components/module/coupon/add")
        }
      ]
    }
  ]
});
