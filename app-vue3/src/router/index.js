import { createRouter, createWebHistory } from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";

// app3 动态 base，需要区分三种运行环境：
// 1. 在 main 系统中：http://localhost:7100/main-vue3/app-vue2/app-vue3/page1 => base = '/main-vue3/app-vue2/app-vue3'
// 2. 在 app2 系统中（独立运行）：http://localhost:7200/app-vue2/app-vue3/page1 => base = '/app-vue2/app-vue3'
// 3. 自己独立运行：http://localhost:7400/app-vue3/page1 => base = '/app-vue3'
// eslint-disable-next-line no-underscore-dangle
let base = "/app-vue3"; // 默认独立运行

// eslint-disable-next-line no-underscore-dangle
if (window.__POWERED_BY_QIANKUN__) {
  // 在 Qiankun 环境中，通过路径判断是在 main 还是 app2 中
  const pathname = window.location.pathname;
  if (pathname.startsWith("/main-vue3/app-vue2/app-vue3")) {
    // 在 main 系统中
    base = "/main-vue3/app-vue2/app-vue3";
  } else if (pathname.startsWith("/app-vue2/app-vue3")) {
    // 在 app2 系统中（app2 独立运行时）
    base = "/app-vue2/app-vue3";
  } else {
    // 默认情况（可能是刚加载时路径还没更新），假设在 main 中
    base = "/main-vue3/app-vue2/app-vue3";
  }
}

const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export default router;
