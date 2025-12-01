<template>
  <div class="app">
    <!-- 独立运行时显示导航；在 main 中由主应用控制导航 -->
    <nav class="nav" v-if="!isQiankun">
      <router-link to="/page1">Page1</router-link>
      <router-link to="/page2">Page2</router-link>
      <router-link to="/page3">Page3</router-link>
      <router-link to="/app-vue3">app-vue3 Page1</router-link>
    </nav>

    <router-view />

    <!-- app-vue3 的容器 -->
    <div
      v-if="showNestedContainer"
      id="nested-app-vue3-container"
      class="nested-vue3"
    ></div>
  </div>
</template>

<script>
export default {
  name: "AppVue2",
  computed: {
    isQiankun() {
      // eslint-disable-next-line no-underscore-dangle
      return !!window.__POWERED_BY_QIANKUN__;
    },
    showNestedContainer() {
      const path = this.$route.path;
      // 独立运行：/app-vue3；在 main 中：/app-vue2/app-vue3
      if (this.isQiankun) {
        return window.location.pathname.startsWith("/app-vue2/app-vue3");
      }
      return path === "/app-vue3";
    }
  },
  watch: {
    showNestedContainer(val) {
      if (this.isQiankun && val) {
        this.$nextTick(() => {
          const container = document.getElementById("nested-app-vue3-container");
          if (container) {
            window.dispatchEvent(
              new CustomEvent("app-vue2-container-ready", {
                detail: { containerId: "nested-app-vue3-container" }
              })
            );
          }
        });
      }
    }
  }
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
.nested-vue3 {
  margin-top: 16px;
  min-height: 300px;
  border: 1px dashed #bbb;
  border-radius: 4px;
}
</style>


