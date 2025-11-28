import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/page1',
    name: 'Page1',
    component: () => import('../views/Page1.vue'),
  },
  {
    path: '/page2',
    name: 'Page2',
    component: () => import('../views/Page2.vue'),
  },
  // app-vue2 的路由（主应用只使用 page1 和 page2）
  {
    path: '/app-vue2',
    redirect: '/app-vue2/page1', // 默认跳转到 page1
  },
  {
    path: '/app-vue2/page1',
    name: 'AppVue2Page1',
    meta: { microApp: 'app-vue2' },
  },
  {
    path: '/app-vue2/page2',
    name: 'AppVue2Page2',
    meta: { microApp: 'app-vue2' },
  },
  // app-vue3 的路由（通过 app-vue2 访问）
  {
    path: '/app-vue2/app-vue3',
    redirect: '/app-vue2/app-vue3/page1', // 默认跳转到 page1
  },
  {
    path: '/app-vue2/app-vue3/page1',
    name: 'AppVue3Page1',
    meta: { microApp: 'app-vue3' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

