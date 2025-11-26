import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from './views/Home.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/vue2-l1/:pathMatch(.*)*',
    name: 'Vue2L1',
    component: Home
  },
  {
    path: '/vue3-l1/:pathMatch(.*)*',
    name: 'Vue3L1',
    component: Home
  },
  {
    path: '/nested-vue3/:pathMatch(.*)*',
    name: 'NestedVue3',
    component: Home
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


