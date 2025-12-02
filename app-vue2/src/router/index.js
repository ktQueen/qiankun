import Vue from "vue";
import VueRouter from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";

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
 * @param {string} base - 路由 base，如果未提供则根据运行环境自动判断
 * @returns {VueRouter} router 实例
 */
export function createRouter(base) {
  // 如果没有提供 base，则根据运行环境自动判断
  // eslint-disable-next-line no-underscore-dangle
  const routerBase =
    base ||
    (window.__POWERED_BY_QIANKUN__ ? "/main-vue3/app-vue2" : "/app-vue2");

  return new VueRouter({
    mode: "history",
    base: routerBase,
    routes,
  });
}

// 默认导出：根据运行环境创建 router
// eslint-disable-next-line no-underscore-dangle
const defaultBase = window.__POWERED_BY_QIANKUN__
  ? "/main-vue3/app-vue2"
  : "/app-vue2";
const router = createRouter(defaultBase);

export default router;
