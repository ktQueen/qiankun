<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/page1">Page1</router-link>
      <router-link to="/page2">Page2</router-link>
      <router-link to="/app-vue2/page1">app-vue2 Page1</router-link>
      <router-link to="/app-vue2/page2">app-vue2 Page2</router-link>
      <router-link to="/app-vue2/app-vue3/page1">app-vue3 Page1</router-link>
    </nav>

    <!-- 主应用自己的页面 -->
    <router-view v-if="!isMicroRoute" />

    <!-- 子应用容器：app-vue2 会挂载到这里 -->
    <div id="subapp-container" class="subapp-container"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 以 /app-vue2 开头的路由都交给子应用渲染
const isMicroRoute = computed(() => route.path.startsWith("/app-vue2"));
</script>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
}

.nav {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.nav a {
  margin-right: 16px;
  text-decoration: none;
  color: #409eff;
}

.nav a.router-link-active {
  font-weight: bold;
  color: #67c23a;
}

.subapp-container {
  margin-top: 16px;
  min-height: 300px;
  border: 1px dashed #bbb;
  border-radius: 4px;
}
</style>
