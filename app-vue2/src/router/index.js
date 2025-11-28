import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/app-vue2',
    redirect: '/app-vue2/page1', // 默认跳转到 page1
  },
  {
    path: '/app-vue2/page1',
    name: 'Page1',
    // 路由懒加载：按需加载页面组件
    component: () => import(/* webpackChunkName: "page1" */ '../views/Page1.vue'),
  },
  {
    path: '/app-vue2/page2',
    name: 'Page2',
    // 路由懒加载：按需加载页面组件
    component: () => import(/* webpackChunkName: "page2" */ '../views/Page2.vue'),
  },
  {
    path: '/app-vue2/page3',
    name: 'Page3',
    // 路由懒加载：按需加载页面组件（主应用不使用，但独立运行时需要）
    component: () => import(/* webpackChunkName: "page3" */ '../views/Page3.vue'),
  },
  // app-vue3 的路由（app-vue2 只使用 page1）
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

const router = new VueRouter({
  mode: 'history',
  base: window.__POWERED_BY_QIANKUN__ ? '/app-vue2' : '/',
  routes,
});

export default router;

