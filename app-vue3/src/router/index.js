import { createRouter, createWebHistory } from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";

const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

/**
 * 创建 router 实例
 * @param {string} base - 路由 base，如果未提供则根据运行环境自动判断
 * @returns {Router} router 实例
 */
export function createAppRouter(base) {
  // 如果没有提供 base，则根据运行环境自动判断
  // eslint-disable-next-line no-underscore-dangle
  let routerBase = base;

  if (!routerBase) {
    // eslint-disable-next-line no-underscore-dangle
    if (window.__POWERED_BY_QIANKUN__) {
      // 在 Qiankun 环境中，通过路径判断是在 main 还是 app2 中
      const pathname = window.location.pathname;
      if (pathname.startsWith("/main-vue3/app-vue2/app-vue3")) {
        // 在 main 系统中
        routerBase = "/main-vue3/app-vue2/app-vue3";
      } else if (pathname.startsWith("/app-vue2/app-vue3")) {
        // 在 app2 系统中（app2 独立运行时）
        routerBase = "/app-vue2/app-vue3";
      } else {
        // 默认情况（可能是刚加载时路径还没更新），假设在 main 中
        routerBase = "/main-vue3/app-vue2/app-vue3";
      }
    } else {
      // 独立运行
      routerBase = "/app-vue3";
    }
  }

  return createRouter({
    history: createWebHistory(routerBase),
    routes,
  });
}

// 默认导出：根据运行环境创建 router
const router = createAppRouter();

export default router;
