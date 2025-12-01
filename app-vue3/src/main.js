import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import App from "./App.vue";

let app = null;

function render(props = {}) {
  const { container } = props;

  // 计算挂载点：
  // - 在 qiankun 环境中：挂到外层传入的 container 下
  // - 独立运行时：挂到 document.getElementById('app')
  let mountPoint;
  if (container) {
    mountPoint = container;
  } else {
    mountPoint = document.getElementById("app");
  }

  if (!mountPoint) {
    // eslint-disable-next-line no-console
    console.error("[app-vue3] 挂载点未找到");
    return;
  }

  if (app) {
    app.unmount();
    app = null;
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

// 独立运行时（不在 qiankun 里）直接挂载
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
