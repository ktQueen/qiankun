import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/page1",
    name: "Page1",
    component: () => import("../views/Page1.vue"),
  },
  {
    path: "/page2",
    name: "Page2",
    component: () => import("../views/Page2.vue"),
  },
  // app-vue2 部分页面（主应用只负责提供路由占位，内容由 qiankun 子应用渲染）
  // 完整路径：/main-vue3/app-vue2/page1
  {
    path: "/app-vue2/page1",
    name: "AppVue2Page1",
    component: () => import("../views/MicroAppPlaceholder.vue"),
  },
  {
    path: "/app-vue2/page2",
    name: "AppVue2Page2",
    component: () => import("../views/MicroAppPlaceholder.vue"),
  },
  // app-vue3（通过 app-vue2 访问，只挂 Page1）
  // 完整路径：/main-vue3/app-vue2/app-vue3/page1
  {
    path: "/app-vue2/app-vue3/page1",
    name: "AppVue3Page1",
    component: () => import("../views/MicroAppPlaceholder.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/main-vue3"),
  routes,
});

export default router;
