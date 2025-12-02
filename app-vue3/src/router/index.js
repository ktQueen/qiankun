import { createRouter, createWebHistory } from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";
import { getAppVue3RouterBase } from "../utils/router-base";

/**
 * app-vue3 内部的业务路由
 *
 * 这里的 path 也是相对 base 的：
 * - base 在 main 下：/main-vue3/app-vue2/app-vue3
 * - base 在 app2 下：/app-vue2/app-vue3
 * - base 独立时：    /app-vue3
 *
 * 所以 /page1 实际 URL：
 * - main 中：/main-vue3/app-vue2/app-vue3/page1
 * - app2 中：/app-vue2/app-vue3/page1
 * - 独立时：/app-vue3/page1
 */
const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

/**
 * 创建 app-vue3 的 router 实例
 *
 * @param {string} routerBase - 路由 base（优先级最高，来自父应用 props）
 * @param {string} parentApp  - 父应用标识（"main-vue3" | "app-vue2"），用于更精确判断
 */
export function createAppRouter(routerBase, parentApp) {
  // 通过工具函数统一计算 base，避免在多个地方硬编码路径前缀
  const base = getAppVue3RouterBase(routerBase, parentApp);

  return createRouter({
    history: createWebHistory(base),
    routes,
  });
}

// 默认导出：在独立运行或直接被 qiankun 加载时，自动推断 base
const router = createAppRouter();

export default router;
