import { log } from "core-js";
import { nextTick } from "q";

const app = {
  state: {
    visitedViews: [],//标签
    menuStatus: false,//右键
    super_admin: 0,//右键
    resources: {},
    routeTiaoVal: {},
    isProjectInfo: false,
    rebuild: true,
    productionId:'',
  },
  // 计算属性
  getters: {},
  // 声明函数
  mutations: {
    // 两次改变 rebuild 属性
    CHANGE_REBUILD(state) {
      // console.log('调用')
      state.rebuild = false
      nextTick(() => {
        state.rebuild = true
      })
    },

    //资源管理
    UPDATE_RESOURCES(state, view) {
      if (state.resources.path === view.path) return
      let resource = {
        name: view.label,
        path: view.path,
        id: view.id
      }
      state.resources = resource
    },
    //路由跳转的资源
    UPDATE_ROUTETIAOVAL(state, view) {
      state.routeTiaoVal = view
    },
    // 管理员权限
    MANGER_ADMIN(state) {
      // state.super_admin = JSON.parse(localStorage.getItem('personal')).super_admin;
    },
    // ==========标签========
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.path === view.path)) return
      let tag = [{
        name: view.name,
        path: view.path
      }]

      state.visitedViews = tag
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break
        }
      }
    },
    CLOSE_ALL_VISITED: (state, view) => {
      state.visitedViews.splice(view + 1, state.visitedViews.length);
      state.visitedViews.splice(0, view);
    },
    CLOSE_LEFT_VISITED: (state, view) => {
      state.visitedViews.splice(0, view);
    },
    CLOSE_RIGHT_VISITED: (state, view) => {
      state.visitedViews.splice(view + 1, state.visitedViews.length);
    },
    // 右键关闭标签
    closeALLVisited({ commit }, view) {
      commit('CLOSE_ALL_VISITED', view);
    },
    closeLeftVisited({ commit }, view) {
      commit('CLOSE_LEFT_VISITED', view);
    },
    closeRightVisited({ commit }, view) {
      commit('CLOSE_RIGHT_VISITED', view);
    },
    //================右键==================
    CLOSE_MENU: (state) => {
      state.menuStatus = false;
    },
    OPEN_MENU: (state) => {
      state.menuStatus = true;
    }
  },
  // 待理执行
  actions: {
    // 两次改变 rebuild 属性
    changeRebuild({ commit }) {
      commit('CHANGE_REBUILD');
    },


    //==========资源管理========
    updateResource({ commit }, view) {
      commit('UPDATE_RESOURCES', view);
    },
    //======路由参数========
    updaterouteTiaoVal({ commit }, view) {
      commit('UPDATE_ROUTETIAOVAL', view);
    },
    // ==========管理员权限========
    manger_admin({ commit }, view) {
      commit('MANGER_ADMIN', view);
    },
    // ==========标签========
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view);
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view);
        resolve([...state.visitedViews])
      })
    },
    // 右键关闭标签
    closeALLVisited({ commit }, view) {
      commit('CLOSE_ALL_VISITED', view);
    },
    closeLeftVisited({ commit }, view) {
      commit('CLOSE_LEFT_VISITED', view);
    },
    closeRightVisited({ commit }, view) {
      commit('CLOSE_RIGHT_VISITED', view);
    },
    // ================右键=================
    closeMenu({ commit }) {
      commit('CLOSE_MENU');
    },
    openMenu({ commit }) {
      commit('OPEN_MENU');
    },
  }
};
export default app
