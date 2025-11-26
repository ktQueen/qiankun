import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { registerMicroApps, start } from 'qiankun';

const app = createApp(App);
app.use(router);
app.mount('#app');

registerMicroApps([
  {
    name: 'child-vue2-level1',
    entry: '//localhost:7200',
    container: '#subapp-container',
    activeRule: '/vue2-l1'
  },
  {
    name: 'child-vue3-level1',
    entry: '//localhost:7300',
    container: '#subapp-container',
    activeRule: '/vue3-l1'
  },
  {
    name: 'child-vue3-nested',
    entry: '//localhost:7400',
    container: '#subapp-container',
    activeRule: '/nested-vue3'
  }
]);

start();


