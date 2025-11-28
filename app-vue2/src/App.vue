<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/app-vue2/page1">Page1</router-link>
      <router-link to="/app-vue2/page2">Page2</router-link>
      <router-link to="/app-vue2/page3">Page3</router-link>
      <router-link to="/app-vue2/app-vue3/page1">app-vue3 Page1</router-link>
    </nav>

    <!-- app-vue2 路由视图 -->
    <router-view />

    <!-- 第三级 app-vue3 挂载区域 -->
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
    showNestedContainer() {
      // 当路由是 app-vue3 相关时，显示嵌套容器
      return this.$route.path.startsWith("/app-vue2/app-vue3");
    },
  },
  watch: {
    $route(to) {
      // 路由变化时，如果在主应用里，通知主应用
      if (window.__POWERED_BY_QIANKUN__) {
        if (to.path.startsWith("/app-vue2/app-vue3")) {
          this.$nextTick(() => {
            window.dispatchEvent(
              new CustomEvent("app-vue2-container-ready", {
                detail: { containerId: "nested-app-vue3-container" },
              })
            );
          });
        }
      }
    },
  },
  mounted() {
    // 如果在主应用里，挂载完成后通知主应用容器已准备好
    if (window.__POWERED_BY_QIANKUN__) {
      this.$nextTick(() => {
        window.dispatchEvent(
          new CustomEvent("app-vue2-mounted", {
            detail: { containerId: "nested-app-vue3-container" },
          })
        );
      });
    }
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

.nested-vue3 {
  margin-top: 12px;
  min-height: 300px;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 16px;
}
</style>
