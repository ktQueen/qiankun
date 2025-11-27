import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { registerMicroApps, start } from 'qiankun';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');

// 注册一个 Vue2 子应用 app-vue2
registerMicroApps([
  {
    name: 'app-vue2',
    entry: '//localhost:7200',
    container: '#subapp-container',
    activeRule: (location) => location.pathname.startsWith('/app-vue2')
  }
]);

start();


