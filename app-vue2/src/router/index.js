import Vue from "vue";
import VueRouter from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";

Vue.use(VueRouter);

// 在 main 中 base = '/app-vue2'；独立时 base = '/'
// eslint-disable-next-line no-underscore-dangle
const base = window.__POWERED_BY_QIANKUN__ ? "/app-vue2" : "/";

const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
  // 用于嵌套 app-vue3 的壳路由：
  // main 中完整路径为 /app-vue2/app-vue3，独立时为 /app-vue3
  { path: "/app-vue3", component: Page1 },
];

const router = new VueRouter({
  mode: "history",
  base,
  routes,
});

export default router;
