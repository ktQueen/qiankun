import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { loadMicroApp, start } from "qiankun";
import router from "./router";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.use(ElementUI);

let instance = null;

function render(props = {}) {
  const { container } = props;
  instance = new Vue({
    router,
    render: (h) => h(App),
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

  const mountAppVue3 = () => {
    const container = document.getElementById("nested-app-vue3-container");
    if (!container) {
      // eslint-disable-next-line no-console
      console.warn("[app-vue2] app-vue3 容器未准备好");
      return;
    }
    if (appVue3Instance) return;

    appVue3Instance = loadMicroApp({
      name: "app-vue3",
      entry: "//localhost:7400",
      container: "#nested-app-vue3-container",
    });
  };

  const unmountAppVue3 = () => {
    if (appVue3Instance) {
      appVue3Instance.unmount().then(() => {
        appVue3Instance = null;
      });
    }
  };

  router.afterEach((to) => {
    if (to.path === "/app-vue3") {
      mountAppVue3();
    } else {
      unmountAppVue3();
    }
  });

  if (router.currentRoute.path === "/app-vue3") {
    mountAppVue3();
  }
}
