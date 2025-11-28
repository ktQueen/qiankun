<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/page1">Page1</router-link>
      <router-link to="/page2">Page2</router-link>
      <router-link to="/app-vue2/page1">app-vue2 Page1</router-link>
      <router-link to="/app-vue2/page2">app-vue2 Page2</router-link>
    </nav>

    <!-- 主应用路由视图 -->
    <router-view v-if="!isMicroAppRoute" />

    <!-- 子应用挂载容器 -->
    <div id="subapp-container" class="subapp-container"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 判断当前路由是否是子应用路由
const isMicroAppRoute = computed(() => {
  return route.path.startsWith("/app-vue2");
});
</script>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
}

.nav {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.nav a {
  margin-right: 16px;
  color: #409eff;
  text-decoration: none;
}

.nav a.router-link-active {
  color: #67c23a;
  font-weight: bold;
}

.subapp-container {
  margin-top: 12px;
  min-height: 300px;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 16px;
}
</style>
