import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createAppRouter } from "./router";
import App from "./App.vue";

/**
 * app-vue3 是最里层的 Vue3 微应用
 * 特点：
 * - 可以被 main-vue3 通过 app-vue2 间接挂载
 * - 也可以被 app-vue2 独立挂载
 * - 也可以自己独立运行
 *
 * 所以这里通过 routerBase + parentApp 来判断自己的运行环境，
 * 决定 router 的 base。
 */

let app = null;
let router = null;

/**
 * 渲染函数
 * - qiankun 模式下由父应用（main-vue3 / app-vue2）传入 container / routerBase / parentApp
 * - 独立运行模式下不传 props，自己挂到 #app
 */
function render(props = {}) {
  const { container, routerBase, parentApp } = props;
  const mountPoint = container || document.getElementById("app");

  if (!mountPoint) {
    // eslint-disable-next-line no-console
    console.error("[app-vue3] 挂载点未找到");
    return;
  }

  // 如果已经有 app 实例，先卸载，避免重复挂载在同一个节点上
  if (app) {
    app.unmount();
    app = null;
  }

  // 只要 routerBase 或 parentApp 有变化，或者还没有创建 router，
  // 就重新创建一个 router 实例（内部会计算正确的 base）
  if (routerBase || parentApp || !router) {
    router = createAppRouter(routerBase, parentApp);
  }

  const appInstance = createApp(App);
  appInstance.use(ElementPlus);
  appInstance.use(router);
  appInstance.mount(mountPoint);
  app = appInstance;
}

/**
 * qiankun 生命周期：bootstrap
 * - 只在微应用初始化时调用一次
 */
export async function bootstrap() {
  // eslint-disable-next-line no-console
  console.log("[app-vue3] bootstraped");
}

/**
 * qiankun 生命周期：mount
 * - 每次微应用被激活时调用
 */
export async function mount(props) {
  // eslint-disable-next-line no-console
  console.log("[app-vue3] mount with props", props);
  render(props);
}

/**
 * qiankun 生命周期：unmount
 * - 微应用被卸载时调用，负责清理 Vue 实例
 */
export async function unmount() {
  if (app) {
    app.unmount();
    app = null;
  }
}

/**
 * 独立运行模式
 *
 * 条件：
 * - 没有被 qiankun 注入（__POWERED_BY_QIANKUN__ 为 false）
 * 行为：
 * - 自己创建 router（内部根据 window.__POWERED_BY_QIANKUN__ 和 URL 判断 base）
 * - 自己挂载到 #app
 */
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
