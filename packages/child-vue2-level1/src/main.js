import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import createRouter from './router';

Vue.config.productionTip = false;
Vue.use(VueRouter);

let instance = null;
let router = null;

function render(props = {}) {
  const { container } = props;
  router = createRouter();
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

export async function bootstrap() {
  console.log('[vue2-l1] bootstraped');
}

export async function mount(props) {
  console.log('[vue2-l1] mount with props', props);
  render(props);
}

export async function unmount() {
  if (instance) {
    instance.$destroy();
    instance.$el.innerHTML = '';
    instance = null;
  }
  router = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}


