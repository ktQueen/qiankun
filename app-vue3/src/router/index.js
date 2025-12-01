import { createRouter, createWebHashHistory } from "vue-router";
import Page1 from "../views/Page1.vue";
import Page2 from "../views/Page2.vue";
import Page3 from "../views/Page3.vue";

const routes = [
  { path: "/", redirect: "/page1" },
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
