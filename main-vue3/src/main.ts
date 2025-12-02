import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { registerMicroApps, start, loadMicroApp, MicroApp } from "qiankun";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");

// 注册 app-vue2 子应用
registerMicroApps([
  {
    name: "app-vue2",
    entry: "//localhost:7200",
    container: "#subapp-container",
    activeRule: (location) =>
      location.pathname.startsWith("/main-vue3/app-vue2"),
  },
]);

// app-vue3 挂载在 app-vue2 内部容器中
let appVue3Instance: MicroApp | null = null;

const mountAppVue3 = () => {
  const container = document.getElementById("nested-app-vue3-container");
  if (!container) {
    // eslint-disable-next-line no-console
    console.warn("[main-vue3] app-vue3 容器未准备好");
    return;
  }
  if (appVue3Instance) return;

  appVue3Instance = loadMicroApp({
    name: "app-vue3",
    entry: "//localhost:7400",
    container: "#nested-app-vue3-container",
  });
};

const unmountAppVue3 = () => {
  if (appVue3Instance) {
    appVue3Instance.unmount().then(() => {
      appVue3Instance = null;
    });
  }
};

// 路由变化：离开 app-vue2 区域时卸载 app3
router.afterEach((to) => {
  const path = to.path;
  if (!path.startsWith("/app-vue2")) {
    unmountAppVue3();
  }
});

// app-vue2 通知容器已准备好时，如果当前是 app3 路由则挂载
window.addEventListener("app-vue2-container-ready", () => {
  if (window.location.pathname.startsWith("/main-vue3/app-vue2/app-vue3")) {
    mountAppVue3();
  }
});

start({ singular: false });
