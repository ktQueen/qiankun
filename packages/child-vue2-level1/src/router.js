import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import NestedVue3Placeholder from './views/NestedVue3Placeholder.vue';

export default function createRouter() {
  return new VueRouter({
    mode: 'history',
    base: '/vue2-l1',
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/nested-vue3',
        name: 'NestedVue3',
        component: NestedVue3Placeholder
      }
    ]
  });
}


