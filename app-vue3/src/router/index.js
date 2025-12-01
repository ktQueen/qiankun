import { createRouter, createWebHistory } from "vue-router";

// app-vue3 使用 hash 路由，完全独立于外层 URL
// 无论是在 main/app2 里还是独立运行，自己的路由都控制在 # 后面
const routes = [
  {
    path: "/",
    redirect: "/page1",
  },
  {
    path: "/page1",
    name: "Page1",
    component: () =>
      import(/* webpackChunkName: "page1" */ "../views/Page1.vue"),
  },
  {
    path: "/page2",
    name: "Page2",
    component: () =>
      import(/* webpackChunkName: "page2" */ "../views/Page2.vue"),
  },
  {
    path: "/page3",
    name: "Page3",
    component: () =>
      import(/* webpackChunkName: "page3" */ "../views/Page3.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/app-vue3/"),
  routes,
});

export default router;
