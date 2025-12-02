import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { loadMicroApp, start } from "qiankun";
import { createRouter } from "./router";
import App from "./App.vue";
import { waitForContainer } from "./utils/container";

/**
 * app-vue2 是一个既能独立运行、又能被 main-vue3 聚合的 Vue2 应用
 * 这里负责：
 * - 初始化自身的 Vue 实例和 router
 * - 在独立运行模式下，作为「宿主」再挂载 app-vue3（第 3 级）
 * - 在被 main 挂载时，通过 props 接收 routerBase / onContainerReady
 */

// 默认情况下，根据运行环境自动选择合适的 base（封装在 createRouter 里）
let router = createRouter();

Vue.config.productionTip = false;
Vue.use(ElementUI);

let instance = null;

/**
 * 渲染函数
 * - 在 qiankun 模式下由主应用传入 container / routerBase / onContainerReady
 * - 在独立模式下不传 props，自己挂到 #app
 */
function render(props = {}) {
  const { container, onContainerReady, routerBase } = props;

  // 如果主应用通过 props 指定了 routerBase，则用它重新创建 router
  // 这样 app-vue2 就可以在 main 下复用同一套路由配置，只是 base 不同
  if (routerBase) {
    router = createRouter(routerBase);
  }

  instance = new Vue({
    router,
    // 把 onContainerReady 透传给 App.vue，用于 app2 内部通知 main「嵌套容器就绪」
    render: (h) => h(App, { props: { onContainerReady } }),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

/**
 * qiankun 生命周期：bootstrap
 * 只会在微应用初始化时调用一次
 */
export async function bootstrap() {
  // eslint-disable-next-line no-console
  console.log("[app-vue2] bootstraped");
}

/**
 * qiankun 生命周期：mount
 * 每次微应用被激活时调用
 */
export async function mount(props) {
  // eslint-disable-next-line no-console
  console.log("[app-vue2] mount with props", props);
  render(props);
}

/**
 * qiankun 生命周期：unmount
 * 微应用被卸载时调用，负责清理 Vue 实例
 */
export async function unmount() {
  if (instance) {
    instance.$destroy();
    instance.$el.innerHTML = "";
    instance = null;
  }
}

/**
 * 独立运行模式
 *
 * 条件：
 * - 没有被 qiankun 注入（__POWERED_BY_QIANKUN__ 为 false）
 * 行为：
 * - 自己挂载到 #app
 * - 自己通过 qiankun 的 loadMicroApp 再加载 app-vue3
 */
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  // 自己先渲染出来
  render();

  // 用于保存 app-vue3 的微应用实例
  let appVue3Instance = null;

  // 独立模式下也可以启用 qiankun 的运行时（只是不注册自己）
  start({ singular: false });

  /**
   * 在 app2 独立模式下挂载 app3
   * 逻辑和 main 中类似：
   * - 先等待容器 #nested-app-vue3-container 准备好并且可见
   * - 再通过 loadMicroApp 加载 app-vue3
   */
  const mountAppVue3 = async () => {
    if (appVue3Instance) return;

    try {
      await waitForContainer("#nested-app-vue3-container", {
        timeout: 5000,
        useObserver: true,
        waitForVisible: true, // 因为容器是 v-if 渲染的，必须等它真正出现
      });

      appVue3Instance = loadMicroApp({
        name: "app-vue3",
        entry: "//localhost:7400",
        container: "#nested-app-vue3-container",
        props: {
          // 在 app2 独立模式下，app3 的 history base
          routerBase: "/app-vue2/app-vue3",
          parentApp: "app-vue2",
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[app-vue2] app-vue3 容器未准备好:", error);
    }
  };

  /**
   * 卸载 app3（独立模式下）
   * - 当路由离开 /app-vue3/... 区域时调用
   */
  const unmountAppVue3 = () => {
    if (appVue3Instance) {
      appVue3Instance.unmount().then(() => {
        appVue3Instance = null;
      });
    }
  };

  /**
   * 路由守卫（独立模式）
   * - 进入 /app-vue3 或其子路由时挂载 app3
   * - 离开该区域时卸载 app3
   */
  router.afterEach((to) => {
    // 独立运行时：/app-vue3 或 /app-vue3/xxx 都视为需要挂载 app3
    if (to.path.startsWith("/app-vue3")) {
      mountAppVue3();
    } else {
      unmountAppVue3();
    }
  });

  // 如果刷新时当前就在 /app-vue3/...，需要主动挂一次 app3
  if (router.currentRoute.path.startsWith("/app-vue3")) {
    mountAppVue3();
  }
}
