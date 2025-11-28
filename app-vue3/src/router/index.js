import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/app-vue2/app-vue3',
    redirect: '/app-vue2/app-vue3/page1', // 默认跳转到 page1
  },
  {
    path: '/app-vue2/app-vue3/page1',
    name: 'Page1',
    // 路由懒加载：按需加载页面组件（主应用和 app-vue2 都使用）
    component: () => import(/* webpackChunkName: "page1" */ '../views/Page1.vue'),
  },
  {
    path: '/app-vue2/app-vue3/page2',
    name: 'Page2',
    // 路由懒加载：按需加载页面组件（主应用不使用，但独立运行时需要）
    component: () => import(/* webpackChunkName: "page2" */ '../views/Page2.vue'),
  },
  {
    path: '/app-vue2/app-vue3/page3',
    name: 'Page3',
    // 路由懒加载：按需加载页面组件（主应用不使用，但独立运行时需要）
    component: () => import(/* webpackChunkName: "page3" */ '../views/Page3.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

