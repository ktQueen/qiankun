import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { registerMicroApps, start, loadMicroApp, MicroApp } from "qiankun";
import router from "./router";
import App from "./App.vue";
import { waitForContainer } from "./utils/container";
import type { QiankunProps } from "./types/qiankun";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");

// app-vue3 容器准备就绪的回调函数（带防抖）
let mountTimer: ReturnType<typeof setTimeout> | null = null;

const handleAppVue3ContainerReady = (containerId: string) => {
  if (containerId === "nested-app-vue3-container") {
    // 检查当前路由是否需要挂载 app-vue3
    if (window.location.pathname.startsWith("/main-vue3/app-vue2/app-vue3")) {
      // 防抖：避免重复触发
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

// 注册 app-vue2 子应用，通过 props 传递通信回调和配置
registerMicroApps([
  {
    name: "app-vue2",
    entry: "//localhost:7200",
    container: "#subapp-container",
    activeRule: (location) =>
      location.pathname.startsWith("/main-vue3/app-vue2"),
    props: {
      // 传递容器准备就绪的回调函数
      onContainerReady: handleAppVue3ContainerReady,
      // 传递路由 base 配置
      routerBase: "/main-vue3/app-vue2",
      // 传递父应用标识，用于更精确的 base 判断
      parentApp: "main-vue3",
    } as QiankunProps,
  },
]);

// app-vue3 挂载在 app-vue2 内部容器中
let appVue3Instance: MicroApp | null = null;

const mountAppVue3 = async () => {
  if (appVue3Instance) return;

  try {
    // 使用工具函数等待容器准备就绪（容器已经在回调时确认存在，这里做二次确认）
    // 由于 app-vue2 已经通过 waitForContainer 确认容器可见，这里可以快速检查
    const container = await waitForContainer("#nested-app-vue3-container", {
      timeout: 2000, // 缩短超时时间，因为容器应该已经准备好了
      useObserver: true,
      waitForVisible: true, // 确保容器可见
    });

    appVue3Instance = loadMicroApp({
      name: "app-vue3",
      entry: "//localhost:7400",
      container: "#nested-app-vue3-container",
      props: {
        // 传递路由 base 配置给 app-vue3
        routerBase: "/main-vue3/app-vue2/app-vue3",
        // 传递父应用标识，用于更精确的 base 判断
        parentApp: "main-vue3",
      } as QiankunProps,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[main-vue3] app-vue3 容器未准备好:", error);
  }
};

const unmountAppVue3 = () => {
  if (appVue3Instance) {
    appVue3Instance.unmount().then(() => {
      appVue3Instance = null;
    });
  }
};

// 路由变化：离开 app-vue2/app-vue3 区域时卸载 app3
router.afterEach((to) => {
  const path = to.path;
  // 只要当前路由不是 app3 对应的占位路由，就卸载 app-vue3
  // main 的路由是以 /app-vue2/app-vue3 开头的
  if (!path.startsWith("/app-vue2/app-vue3")) {
    unmountAppVue3();
  }
});

start({ singular: false });
