import { createRouter, createWebHistory } from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";
import { getAppVue3RouterBase } from "../utils/router-base";

const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

/**
 * 创建 router 实例
 * @param {string} routerBase - 路由 base，如果未提供则根据运行环境自动判断
 * @param {string} parentApp - 父应用标识（"main-vue3" | "app-vue2"），用于更精确判断
 * @returns {Router} router 实例
 */
export function createAppRouter(routerBase, parentApp) {
  const base = getAppVue3RouterBase(routerBase, parentApp);

  return createRouter({
    history: createWebHistory(base),
    routes,
  });
}

// 默认导出：根据运行环境创建 router
const router = createAppRouter();

export default router;
