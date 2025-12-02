import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { registerMicroApps, start, loadMicroApp, MicroApp } from "qiankun";
import router from "./router";
import App from "./App.vue";
import { waitForContainer } from "./utils/container";
import type { QiankunProps } from "./types/qiankun";

/**
 * main-vue3 是整个系统的「壳应用」
 * - 负责渲染自己的页面
 * - 负责注册 / 激活 app-vue2
 * - 负责在 app-vue2 内部再挂载 app-vue3（第 3 级）
 */
const app = createApp(App);
// 挂载全局 UI 组件库
app.use(ElementPlus);
// 挂载主应用路由（控制 /main-vue3/... 整体 URL）
app.use(router);
// 挂载到主应用的 DOM 根节点
app.mount("#app");

/**
 * app-vue3 容器就绪回调（来自 app-vue2）
 *
 * 设计思路：
 * - app-vue2 内部用 v-if 渲染一个 div#nested-app-vue3-container
 * - 渲染完成后，通过 props 回调 onContainerReady 通知 main
 * - main 收到后，根据当前 URL 判断是否需要挂载 app-vue3
 * - 为避免多次快速触发，用一个简单的防抖计时器 mountTimer
 */
let mountTimer: ReturnType<typeof setTimeout> | null = null;

const handleAppVue3ContainerReady = (containerId: string) => {
  // 只关心我们约定的容器 ID
  if (containerId === "nested-app-vue3-container") {
    // 当前 URL 必须在 app3 对应的路径下，才需要真正挂 app3
    // /main-vue3/app-vue2/app-vue3/...
    if (window.location.pathname.startsWith("/main-vue3/app-vue2/app-vue3")) {
      // 防抖：如果短时间内多次通知，只保留最后一次
      if (mountTimer) {
        clearTimeout(mountTimer);
      }
      mountTimer = setTimeout(() => {
        mountAppVue3();
        mountTimer = null;
      }, 50);
    }
  }
};

/**
 * 注册一级子应用 app-vue2
 *
 * 关键点：
 * - activeRule 控制在 /main-vue3/app-vue2/... 下激活 app-vue2
 * - props 中下发：
 *   - onContainerReady：app2 内部通知「嵌套容器准备好了」
 *   - routerBase：app2 自己的 history base
 *   - parentApp：父应用标识，用于 app2 内部进一步判断运行环境
 */
registerMicroApps([
  {
    name: "app-vue2",
    entry: "//localhost:7200",
    // app2 挂载到 main 的这个容器里
    container: "#subapp-container",
    // 当 URL 以 /main-vue3/app-vue2 开头时激活
    activeRule: (location) =>
      location.pathname.startsWith("/main-vue3/app-vue2"),
    props: {
      onContainerReady: handleAppVue3ContainerReady,
      routerBase: "/main-vue3/app-vue2",
      parentApp: "main-vue3",
    } as QiankunProps,
  },
]);

/**
 * app-vue3 在 main 中的生命周期管理
 *
 * 这里不直接通过 registerMicroApps 注册 app-vue3，
 * 而是手动用 loadMicroApp：
 * - 好处：完全由我们控制「什么时候挂载 / 卸载」
 * - 容器在 app-vue2 里，因此必须等 app-vue2 渲染完再挂
 */
let appVue3Instance: MicroApp | null = null;

/**
 * 挂载 app-vue3（如果还没有实例）
 */
const mountAppVue3 = async () => {
  // 已经有实例就不重复挂载
  if (appVue3Instance) return;

  try {
    // 再次确认容器存在且可见（多一层保险）
    await waitForContainer("#nested-app-vue3-container", {
      timeout: 2000, // 容器理论上已经准备好，超时时间可以短一点
      useObserver: true,
      waitForVisible: true, // 确保不是 display:none
    });

    // 手动加载 app-vue3 微应用
    appVue3Instance = loadMicroApp({
      name: "app-vue3",
      entry: "//localhost:7400",
      container: "#nested-app-vue3-container",
      props: {
        // 告诉 app3：在 main 中挂载时的 history base
        routerBase: "/main-vue3/app-vue2/app-vue3",
        parentApp: "main-vue3",
      } as QiankunProps,
    });
  } catch (error) {
    // 一般是容器在超时时间内没有准备好
    // eslint-disable-next-line no-console
    console.warn("[main-vue3] app-vue3 容器未准备好:", error);
  }
};

/**
 * 卸载 app-vue3 实例
 *
 * 当前策略：
 * - 一旦确认「路由不在 app3 占位路由下」就彻底 unmount
 * - 好处：逻辑简单、状态干净
 * - 后续你如果想要缓存复用，可以在这里做成「隐藏而不是卸载」
 */
const unmountAppVue3 = () => {
  if (appVue3Instance) {
    appVue3Instance.unmount().then(() => {
      appVue3Instance = null;
    });
  }
};

/**
 * 路由守卫：离开 app3 对应的占位路由时卸载 app3
 *
 * 注意：
 * - main 自己的路由里，app3 的占位路由写的是 /app-vue2/app-vue3/xxx
 * - 所以只要 to.path 不以这个前缀开头，就认为已经离开 app3 区域
 */
router.afterEach((to) => {
  const path = to.path;
  if (!path.startsWith("/app-vue2/app-vue3")) {
    unmountAppVue3();
  }
});

// 启动 qiankun，允许多个微应用同时激活（singular: false）
start({ singular: false });
