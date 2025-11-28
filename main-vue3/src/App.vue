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
import { onMounted, onUnmounted } from "vue";

const goVue2 = () => {
  // 修改浏览器路径为 /app-vue2，触发 qiankun activeRule
  window.history.pushState({}, "", "/app-vue2");
};

// 监听路由变化，确保嵌套容器存在
const checkNestedContainer = () => {
  const path = window.location.pathname;
  if (path.startsWith("/app-vue2/app-vue3")) {
    // 等待 app-vue2 挂载完成，确保容器存在
    let attempts = 0;
    const maxAttempts = 30; // 最多等待 3 秒
    const interval = setInterval(() => {
      const container = document.getElementById("nested-app-vue3-container");
      if (container) {
        clearInterval(interval);
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn("嵌套容器未找到，app-vue2 可能还未挂载完成");
      }
    }, 100);
  }
};

onMounted(() => {
  // 监听 popstate 事件（浏览器前进/后退）
  window.addEventListener("popstate", checkNestedContainer);
  // 初始检查
  checkNestedContainer();
});

onUnmounted(() => {
  window.removeEventListener("popstate", checkNestedContainer);
});
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
