import Vue from "vue";
import VueRouter from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";
import { getAppVue2RouterBase } from "../utils/router-base";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
  // 用于嵌套 app-vue3 的壳路由：
  // main 中完整路径为 /main-vue3/app-vue2/app-vue3/page1，独立时为 /app-vue2/app-vue3/page1
  { path: "/app-vue3", redirect: "/app-vue3/page1" },
  { path: "/app-vue3/page1", name: "AppVue3Page1" },
];

/**
 * 创建 router 实例
 * @param {string} routerBase - 路由 base，如果未提供则根据运行环境自动判断
 * @returns {VueRouter} router 实例
 */
export function createRouter(routerBase) {
  const base = getAppVue2RouterBase(routerBase);

  return new VueRouter({
    mode: "history",
    base,
    routes,
  });
}

// 默认导出：根据运行环境创建 router
const router = createRouter();

export default router;
