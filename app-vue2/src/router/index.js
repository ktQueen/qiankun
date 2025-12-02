import Vue from "vue";
import VueRouter from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";
import { getAppVue2RouterBase } from "../utils/router-base";

Vue.use(VueRouter);

/**
 * app-vue2 内部的业务路由
 *
 * 这里的 path 全部是「相对 base」的路径：
 * - base 在 main 模式下是 /main-vue3/app-vue2
 * - base 在独立模式下是 /app-vue2
 *
 * 所以：
 * - /page1 实际 URL：
 *   - 在 main 中：/main-vue3/app-vue2/page1
 *   - 独立时：   /app-vue2/page1
 * - /app-vue3/page1 实际 URL：
 *   - 在 main 中：/main-vue3/app-vue2/app-vue3/page1
 *   - 独立时：   /app-vue2/app-vue3/page1
 */
const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
  // 用于嵌套 app-vue3 的壳路由（自身不渲染内容，只提供占位和 URL）
  { path: "/app-vue3", redirect: "/app-vue3/page1" },
  { path: "/app-vue3/page1", name: "AppVue3Page1" },
];

/**
 * 创建 router 实例
 *
 * @param {string} routerBase - 路由 base，如果未提供则根据运行环境自动判断
 * - 由 main 通过 props 传入（/main-vue3/app-vue2）
 * - 或者独立运行时自己推断（/app-vue2）
 */
export function createRouter(routerBase) {
  const base = getAppVue2RouterBase(routerBase);

  return new VueRouter({
    mode: "history",
    base,
    routes,
  });
}

// 默认导出一个根据当前环境自动选择 base 的 router
// - 在 main 中：/main-vue3/app-vue2
// - 独立模式： /app-vue2
const router = createRouter();

export default router;
