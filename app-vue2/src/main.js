import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { loadMicroApp, start } from "qiankun";
import { createRouter } from "./router";
import App from "./App.vue";
import { waitForContainer } from "./utils/container";

// 创建默认 router（独立运行时使用）
// eslint-disable-next-line no-underscore-dangle
let router = createRouter(
  window.__POWERED_BY_QIANKUN__ ? "/main-vue3/app-vue2" : "/app-vue2"
);

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

  let appVue3Instance = null;

  start({ singular: false });

  const mountAppVue3 = async () => {
    if (appVue3Instance) return;

    try {
      // 使用工具函数等待容器准备就绪（包括可见性检查）
      await waitForContainer("#nested-app-vue3-container", {
        timeout: 5000,
        useObserver: true,
        waitForVisible: true, // 等待容器可见（因为使用了 v-if 条件渲染）
      });

      appVue3Instance = loadMicroApp({
        name: "app-vue3",
        entry: "//localhost:7400",
        container: "#nested-app-vue3-container",
        props: {
          // 传递路由 base 配置给 app-vue3（独立运行时）
          routerBase: "/app-vue2/app-vue3",
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[app-vue2] app-vue3 容器未准备好:", error);
    }
  };

  const unmountAppVue3 = () => {
    if (appVue3Instance) {
      appVue3Instance.unmount().then(() => {
        appVue3Instance = null;
      });
    }
  };

  router.afterEach((to) => {
    // 独立运行时：/app-vue3 或 /app-vue3/xxx 都视为需要挂载 app3
    if (to.path.startsWith("/app-vue3")) {
      mountAppVue3();
    } else {
      unmountAppVue3();
    }
  });

  if (router.currentRoute.path.startsWith("/app-vue3")) {
    mountAppVue3();
  }
}
