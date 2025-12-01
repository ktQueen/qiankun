<template>
  <div class="app">
    <!-- 在 qiankun 环境中不显示内部导航，只展示页面内容 -->
    <nav class="nav" v-if="!isQiankun">
      <router-link to="/page1">Page1</router-link>
      <router-link to="/page2">Page2</router-link>
      <router-link to="/page3">Page3</router-link>
    </nav>

    <!-- app-vue3 路由视图 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "AppVue3",
  computed: {
    isQiankun() {
      // 在 qiankun 环境中由主应用控制导航
      // eslint-disable-next-line no-underscore-dangle
      return !!window.__POWERED_BY_QIANKUN__;
    },
  },
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
