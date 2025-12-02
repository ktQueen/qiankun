import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { registerMicroApps, start, loadMicroApp, MicroApp } from "qiankun";
import router from "./router";
import App from "./App.vue";
import { containerManager } from "./utils/container-manager";
import type { QiankunProps } from "./types/qiankun";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.mount("#app");

// app-vue3 实例管理
let appVue3Instance: MicroApp | null = null;

// app-vue3 容器准备就绪的回调函数（简化版）
// 当 app-vue2 通知容器已准备好时，如果路由匹配则挂载 app-vue3
const handleAppVue3ContainerReady = async (containerId: string) => {
  // 只处理目标容器
  if (containerId !== "nested-app-vue3-container") {
    return;
  }

  // 检查路由是否需要挂载 app-vue3
  const shouldMount = window.location.pathname.startsWith(
    "/main-vue3/app-vue2/app-vue3"
  );
  if (!shouldMount || appVue3Instance) {
    return;
  }

  try {
    // 使用容器管理器等待容器（统一管理，避免重复等待）
    await containerManager.waitForContainer({
      selector: "#nested-app-vue3-container",
      options: {
        timeout: 3000,
        useObserver: true,
        waitForVisible: true,
      },
    });

    // 容器准备好后，直接挂载
    appVue3Instance = loadMicroApp({
      name: "app-vue3",
      entry: "//localhost:7400",
      container: "#nested-app-vue3-container",
      props: {
        routerBase: "/main-vue3/app-vue2/app-vue3",
        parentApp: "main-vue3",
      } as QiankunProps,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[main-vue3] app-vue3 容器等待失败:", error);
  }
};

// 卸载 app-vue3
const unmountAppVue3 = async () => {
  if (appVue3Instance) {
    try {
      await appVue3Instance.unmount();
      appVue3Instance = null;
      // 清除容器缓存
      containerManager.clearContainer("#nested-app-vue3-container");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("[main-vue3] app-vue3 卸载失败:", error);
      appVue3Instance = null;
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

// 路由监听：离开 app-vue2 区域时卸载 app3
router.afterEach((to) => {
  const path = to.path;
  if (!path.startsWith("/app-vue2")) {
    unmountAppVue3();
  }
});

start({ singular: false });
