import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { registerMicroApps, start, loadMicroApp } from "qiankun";
import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus);
app.mount("#app");

// 注册 app-vue2 子应用
registerMicroApps([
  {
    name: "app-vue2",
    entry: "//localhost:7200",
    container: "#subapp-container",
    // 以 /app-vue2 开头的路径都激活 Vue2（包括 /app-vue2/app-vue3），这样二级始终存在
    activeRule: (location) => location.pathname.startsWith("/app-vue2"),
  },
]);

// 使用 loadMicroApp 动态加载 app-vue3（而不是预先注册）
let appVue3Instance: any = null;

const loadAppVue3 = async () => {
  // 如果已经加载，直接返回
  if (appVue3Instance) {
    return;
  }

  // 等待容器存在
  let attempts = 0;
  const maxAttempts = 30; // 最多等待 3 秒
  while (attempts < maxAttempts) {
    const container = document.getElementById("nested-app-vue3-container");
    if (container) {
      // 容器存在，加载 app-vue3
      try {
        appVue3Instance = loadMicroApp({
          name: "app-vue3",
          entry: "//localhost:7400",
          container: "#nested-app-vue3-container",
        });
        await appVue3Instance.mountPromise;
        console.log("[main-vue3] app-vue3 挂载成功");
      } catch (error) {
        console.error("[main-vue3] app-vue3 挂载失败:", error);
        appVue3Instance = null;
      }
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    attempts++;
  }
  console.warn(
    "[main-vue3] app-vue3: 嵌套容器未找到，app-vue2 可能还未挂载完成"
  );
};

const unloadAppVue3 = async () => {
  if (appVue3Instance) {
    try {
      await appVue3Instance.unmount();
      appVue3Instance = null;
      console.log("[main-vue3] app-vue3 卸载成功");
    } catch (error) {
      console.error("[main-vue3] app-vue3 卸载失败:", error);
    }
  }
};

// 监听路由变化
const handleRouteChange = () => {
  const path = window.location.pathname;
  if (path.startsWith("/app-vue2/app-vue3")) {
    loadAppVue3();
  } else {
    unloadAppVue3();
  }
};

// 监听 app-vue2 的事件通知
window.addEventListener("app-vue2-mounted", () => {
  // app-vue2 挂载完成，如果路由匹配，立即尝试挂载 app-vue3
  if (window.location.pathname.startsWith("/app-vue2/app-vue3")) {
    loadAppVue3();
  }
});

window.addEventListener("app-vue2-container-ready", () => {
  // app-vue2 通知容器已准备好，立即挂载 app-vue3
  loadAppVue3();
});

window.addEventListener("popstate", handleRouteChange);
// 初始检查
handleRouteChange();

// 启动 qiankun
start({ singular: false });
