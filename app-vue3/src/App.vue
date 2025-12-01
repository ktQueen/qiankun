<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/page1">Page1</router-link>
      <router-link to="/page2">Page2</router-link>
      <router-link to="/page3">Page3</router-link>
    </nav>
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
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.nav {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
.nav a {
  margin-right: 12px;
  color: #409eff;
  text-decoration: none;
}
.nav a.router-link-active {
  font-weight: bold;
  color: #67c23a;
}
</style>
