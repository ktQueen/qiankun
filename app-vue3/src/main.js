import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

let app = null;

function render(props = {}) {
  const { container } = props;
  const mountPoint =
    (container && container.querySelector('#app')) ||
    document.getElementById('app');

  app = createApp(App);
  app.use(ElementPlus);
  app.mount(mountPoint);
}

export async function bootstrap() {
  // eslint-disable-next-line no-console
  console.log('[app-vue3] bootstraped');
}

export async function mount(props) {
  // eslint-disable-next-line no-console
  console.log('[app-vue3] mount with props', props);
  render(props);
}

export async function unmount() {
  if (app) {
    app.unmount();
    app = null;
  }
}

// 独立运行时（不在 qiankun 里）直接挂载
// eslint-disable-next-line no-underscore-dangle
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}


