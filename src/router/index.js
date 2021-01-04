import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/common/Index.vue'
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            component: resolve =>
                import ('@/components/common/Login')
        },

        {
            path: '/register',
            component: resolve =>
                import ('@/components/common/Register')
        },
        {
            path: '/',
            component: resolve =>
                import ('@/components/common/Index'),
            children: [{
                    path: '/api/goods',
                    component: resolve =>
                        import ('@/components/module/goods')
                },
                {
                    path: '/api/goods/add',
                    component: resolve =>
                        import ('@/components/module/goodsForm')
                },
                {
                    path: '/goods/info',
                    component: resolve =>
                        import ('@/components/module/goodsInfo')
                },
                {
                    path: '/goods/edit',
                    component: resolve =>
                        import ('@/components/module/goodsInfo')
                },
                {
                    path: '/store',
                    component: resolve =>
                        import ('@/components/module/store')
                },
                {
                    path: '/store/create',
                    component: resolve =>
                        import ('@/components/module/storeForm')
                },
                {
                    path: '/api/trade',
                    component: resolve =>
                        import ('@/components/module/trade')
                },
                {
                    path: '/trade/:id',
                    component: resolve =>
                        import ('@/components/module/tradeDetail')
                },
                {
                    path: '/api/afterSell',
                    component: resolve =>
                        import ('@/components/module/afterSell')
                },
                {
                    path: '/usersManage',
                    component: resolve =>
                        import ('../components/module/setting/userManger')
                },
                {
                    path: '/roleManage',
                    component: resolve =>
                        import ('../components/module/setting/roleManage')
                },
                {
                    path: '/systemVersion',
                    component: resolve =>
                        import ('../components/module/setting/systemVersion')
                },
                {
                    path: '/menuManage',
                    component: resolve =>
                        import ('../components/module/setting/menuManage')
                },
                {
                    path: '/traceLog',
                    component: resolve =>
                        import ('../components/module/setting/logManage')
                },
                {
                    path: '/index',
                    component: resolve =>
                        import ('@/components/common/index')
                },
                {
                    path: '/sendRemove',
                    component: resolve =>
                        import ('@/components/module/sendRemove')
                },
                {
                    path: '/postage',
                    component: resolve =>
                        import ('@/components/module/setStore')
                },
                {
                    path: '/returnAdress',
                    component: resolve =>
                        import ('@/components/module/returnAdress')
                },
                {
                    path: '/api/store/myStore',
                    component: resolve =>
                        import ('@/components/module/coupon')
                },

                {
                    path: '/counponDetail',
                    component: resolve =>
                        import ('@/components/module/counponDetail')
                },
                {
                    path: '/editCounpon',
                    component: resolve =>
                        import ('@/components/module/editCounpon')
                },

            ]
        }
    ]
})