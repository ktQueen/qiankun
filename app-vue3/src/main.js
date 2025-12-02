import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createAppRouter } from "./router";
import App from "./App.vue";

let app = null;
let router = null;

function render(props = {}) {
  const { container, routerBase } = props;
  const mountPoint = container || document.getElementById("app");

  if (!mountPoint) {
    // eslint-disable-next-line no-console
    console.error("[app-vue3] 挂载点未找到");
    return;
  }

  if (app) {
    app.unmount();
    app = null;
  }

  // 如果传递了 routerBase，重新创建 router 实例
  if (routerBase) {
    router = createAppRouter(routerBase);
  } else if (!router) {
    // 首次创建，使用默认配置
    router = createAppRouter();
  }

  const appInstance = createApp(App);
  appInstance.use(ElementPlus);
  appInstance.use(router);
  appInstance.mount(mountPoint);
  app = appInstance;
}

export async function bootstrap() {
  // eslint-disable-next-line no-console
  console.log("[app-vue3] bootstraped");
}

export async function mount(props) {
  // eslint-disable-next-line no-console
  console.log("[app-vue3] mount with props", props);
  render(props);
}

export async function unmount() {
  if (app) {
    app.unmount();
    app = null;
  }
}

// 独立运行时直接挂载
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
