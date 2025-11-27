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

// 独立运行时直接挂载
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
