<template>
  <div class="app">
    <h1>main-vue3 主应用</h1>
    <p>这里现在已经作为 qiankun 基座。</p>
    <p>下面演示先挂载一个 Vue2 子应用（app-vue2）。</p>
    <el-button type="primary" @click="goVue2">进入 app-vue2 子应用</el-button>

    <h2 style="margin-top: 24px">子应用挂载容器</h2>
    <div id="subapp-container" class="subapp-container"></div>
  </div>
</template>

<script setup lang="ts">
const goVue2 = () => {
  // 修改浏览器路径为 /app-vue2，触发 qiankun activeRule
  window.history.pushState({}, "", "/app-vue2");
};
</script>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
}

.subapp-container {
  margin-top: 12px;
  min-height: 300px;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 16px;
}
</style>
