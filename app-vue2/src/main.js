import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { loadMicroApp, start } from "qiankun";
import { createRouter } from "./router";
import App from "./App.vue";
import { waitForContainer } from "./utils/container";

// 创建默认 router（使用工具函数统一判断）
let router = createRouter();

Vue.config.productionTip = false;
Vue.use(ElementUI);

let instance = null;

function render(props = {}) {
  const { container, onContainerReady, routerBase } = props;

  // 如果传递了 routerBase，重新创建 router 实例
  if (routerBase) {
    router = createRouter(routerBase);
  }

  instance = new Vue({
    router,
    render: (h) => h(App, { props: { onContainerReady } }),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// qiankun 生命周期
export async function bootstrap() {
  // eslint-disable-next-line no-console
  console.log("[app-vue2] bootstraped");
}

export async function mount(props) {
  // eslint-disable-next-line no-console
  console.log("[app-vue2] mount with props", props);
  render(props);
}

export async function unmount() {
  if (instance) {
    instance.$destroy();
    instance.$el.innerHTML = "";
    instance = null;
  }
}

// 独立运行时：自己启动，并在 /app-vue3 路由下嵌套 app-vue3
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();

  start({ singular: false });

  let appVue3Instance = null;

  // 挂载 app-vue3
  const mountAppVue3 = async () => {
    if (appVue3Instance) return;

    try {
      // 等待容器准备就绪
      await waitForContainer("#nested-app-vue3-container", {
        timeout: 5000,
        useObserver: true,
        waitForVisible: true,
      });

      appVue3Instance = loadMicroApp({
        name: "app-vue3",
        entry: "//localhost:7400",
        container: "#nested-app-vue3-container",
        props: {
          routerBase: "/app-vue2/app-vue3",
          parentApp: "app-vue2",
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[app-vue2] app-vue3 容器未准备好:", error);
    }
  };

  // 卸载 app-vue3
  const unmountAppVue3 = async () => {
    if (appVue3Instance) {
      try {
        await appVue3Instance.unmount();
        appVue3Instance = null;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[app-vue2] app-vue3 卸载失败:", error);
        appVue3Instance = null;
      }
    }
  };

  // 路由监听：在 /app-vue3 路由下挂载 app3
  router.afterEach((to) => {
    if (to.path.startsWith("/app-vue3")) {
      mountAppVue3();
    } else {
      unmountAppVue3();
    }
  });

  // 检查初始路由
  if (router.currentRoute.path.startsWith("/app-vue3")) {
    mountAppVue3();
  }
}
