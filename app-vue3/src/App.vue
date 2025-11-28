<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/app-vue2/app-vue3/page1">Page1</router-link>
      <router-link to="/app-vue2/app-vue3/page2">Page2</router-link>
      <router-link to="/app-vue2/app-vue3/page3">Page3</router-link>
    </nav>

    <!-- app-vue3 路由视图 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "AppVue3",
};
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
</style>
