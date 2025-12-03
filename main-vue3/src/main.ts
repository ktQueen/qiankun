import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { registerMicroApps, start, loadMicroApp, MicroApp } from "qiankun";
import router from "./router";
import App from "./App.vue";
import { waitForContainer } from "./utils/container";
import { prefetchMicroApps } from "./utils/prefetch";
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
 * 内部工具：显示 app3 容器（用于缓存/隐藏策略）
 */
const showAppVue3Container = () => {
  const container = document.querySelector(
    "#nested-app-vue3-container"
  ) as HTMLElement | null;
  if (container && container.style.display === "none") {
    // 还原为默认显示，由样式控制具体布局
    container.style.display = "";
  }
};

/**
 * 内部工具：隐藏 app3 容器（但不销毁实例）
 * - 用于在 main 中从 /app-vue2/app-vue3/... 切回 /app-vue2/page1 这类场景
 */
const hideAppVue3Container = () => {
  const container = document.querySelector(
    "#nested-app-vue3-container"
  ) as HTMLElement | null;
  if (container && container.style.display !== "none") {
    container.style.display = "none";
  }
};

/**
 * 检查容器是否有有效内容（用于判断是否需要重新挂载）
 * - 如果容器是空的，说明之前的实例可能已经丢失了挂载点
 */
const isContainerEmpty = (container: HTMLElement): boolean => {
  // 检查容器是否有子节点（app3 挂载后会创建子节点）
  // 如果容器是空的，说明需要重新挂载
  return container.children.length === 0;
};

/**
 * 挂载 app-vue3（支持缓存复用 + 自动恢复）
 *
 * 策略：
 * 1. 如果已有实例且容器有内容：直接显示容器（缓存复用）
 * 2. 如果已有实例但容器为空：说明实例丢失了挂载点，需要重新挂载
 * 3. 如果没有实例：首次挂载
 */
const mountAppVue3 = async () => {
  try {
    // 确保容器存在且可见
    const container = (await waitForContainer("#nested-app-vue3-container", {
      timeout: 2000,
      useObserver: true,
      waitForVisible: true,
    })) as HTMLElement;

    // 如果已有实例，检查容器是否有内容
    if (appVue3Instance) {
      // 检查容器是否为空（可能因为 app2 路由切换导致内容被清空）
      if (isContainerEmpty(container)) {
        // 容器为空，说明实例丢失了挂载点，需要重新挂载
        // eslint-disable-next-line no-console
        console.log("[main-vue3] 检测到容器为空，重新挂载 app-vue3");
        // 先销毁旧实例
        await appVue3Instance.unmount();
        appVue3Instance = null;
        // 继续执行下面的挂载逻辑
      } else {
        // 容器有内容，直接显示即可（缓存复用）
        showAppVue3Container();
        return;
      }
    }

    // 首次挂载或重新挂载
    appVue3Instance = loadMicroApp({
      name: "app-vue3",
      entry: "//localhost:7400",
      container: "#nested-app-vue3-container",
      props: {
        routerBase: "/main-vue3/app-vue2/app-vue3",
        parentApp: "main-vue3",
      } as QiankunProps,
    });

    // 新实例挂载完成后，确保容器是可见的
    showAppVue3Container();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[main-vue3] app-vue3 容器未准备好:", error);
  }
};

/**
 * 卸载 app-vue3 实例
 *
 * 当前策略：
 * - 完全销毁实例（用于「真正离开 app2」的场景）
 * - 与之对比，hideAppVue3Container 只隐藏 DOM，不销毁实例（缓存复用）
 */
const destroyAppVue3 = () => {
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
 * - main 自己的路由里：
 *   - app2 占位：/app-vue2/...
 *   - app3 占位：/app-vue2/app-vue3/...
 * - 策略：
 *   - 仍在 /app-vue2/app-vue3/...：保持 app3 挂载且容器可见（由挂载逻辑控制）
 *   - 在 /app-vue2/... 但不在 /app-vue2/app-vue3/...：只隐藏容器，保留实例（缓存）
 *   - 完全离开 /app-vue2/...：彻底销毁 app3 实例
 */
router.afterEach((to) => {
  const path = to.path;
  if (path.startsWith("/app-vue2/app-vue3")) {
    // 在 app3 区域：不做额外处理，挂载流程由 onContainerReady + mountAppVue3 控制
    showAppVue3Container();
  } else if (path.startsWith("/app-vue2")) {
    // 仍在 app2 内，但不在 app3 占位路由：只隐藏 app3（缓存实例）
    hideAppVue3Container();
  } else {
    // 完全离开 app2：彻底销毁 app3 实例
    destroyAppVue3();
  }
});

// 启动 qiankun，允许多个微应用同时激活（singular: false）
start({ singular: false });

/**
 * 预加载策略：提前下载 app-vue3 的资源，但不挂载
 *
 * 为什么预加载 app-vue3：
 * - app-vue3 是嵌套在 app-vue2 内部的第 3 级应用
 * - 用户进入 /app-vue2/... 后，很可能下一步就会进入 /app-vue2/app-vue3/...
 * - 提前预加载可以显著减少首次进入 app3 的等待时间
 *
 * 预加载时机：
 * - 在 start() 之后立即开始（延迟 500ms 确保 start 完成）
 * - 此时用户可能还在浏览 main 的首页，或者刚进入 app2
 * - 在用户真正需要 app3 之前，资源已经在浏览器缓存中了
 *
 * 性能影响：
 * - 带宽：会提前下载 app3 的 HTML/JS/CSS（通常几百 KB 到几 MB）
 * - CPU/内存：几乎无影响（只下载，不执行）
 * - 用户体验：首次进入 app3 时，加载时间从「下载 + 解析」变成「仅解析」，快很多
 */
prefetchMicroApps([
  { name: "app-vue2", entry: "//localhost:7200" },
  {
    name: "app-vue3",
    entry: "//localhost:7400",
  },
]);
