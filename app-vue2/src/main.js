import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.use(ElementUI);

let instance = null;

function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// qiankun 生命周期
export async function bootstrap() {
  console.log("[app-vue2] bootstraped");
}

export async function mount(props) {
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

// 独立运行时直接挂载，并用 qiankun 嵌套 app-vue3
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();
  // 独立运行时，动态加载 qiankun（通过 CDN），然后挂载 app-vue3
  // 这样 package.json 里不需要 qiankun 依赖，保持代码干净
  loadQiankunFromCDN().then(({ registerMicroApps, start }) => {
    registerMicroApps([
      {
        name: "app-vue3",
        entry: "//localhost:7400",
        container: "#nested-app-vue3-container",
        activeRule: () => true, // 独立运行时始终激活
      },
    ]);
    start({ singular: false });
  });
}

// 从 CDN 动态加载 qiankun（只在独立运行时使用）
function loadQiankunFromCDN() {
  return new Promise((resolve, reject) => {
    // 如果已经加载过，直接使用
    if (window.qiankun && window.qiankun.registerMicroApps) {
      resolve(window.qiankun);
      return;
    }

    // 动态加载 qiankun CDN
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/qiankun@2.10.16/dist/index.umd.min.js";
    script.onload = () => {
      if (window.qiankun && window.qiankun.registerMicroApps) {
        resolve(window.qiankun);
      } else {
        reject(new Error("qiankun 加载失败"));
      }
    };
    script.onerror = () => {
      reject(new Error("qiankun CDN 加载失败"));
    };
    document.head.appendChild(script);
  });
}
