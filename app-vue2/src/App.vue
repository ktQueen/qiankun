<template>
  <div class="app">
    <h1>app-vue2 子应用</h1>
    <p>这是一级 Vue2 系统，将来会在它下面挂 app-vue3。</p>
    <el-button type="primary">app-vue2 的 Element UI 按钮</el-button>
    <el-button type="success" @click="goAppVue3" style="margin-left: 12px">
      进入 app-vue3 子应用（第三级）1
    </el-button>
    <h3 style="margin-top: 24px">第三级 app-vue3 挂载区域</h3>
    <div id="nested-app-vue3-container" class="nested-vue3"></div>
  </div>
</template>

<script>
export default {
  name: "AppVue2",
  methods: {
    goAppVue3() {
      // 修改路径为 /app-vue2/app-vue3
      window.history.pushState({}, "", "/app-vue2/app-vue3");

      // 如果在主应用里（qiankun 环境），通过事件通知主应用立即挂载 app-vue3
      if (window.__POWERED_BY_QIANKUN__) {
        // 触发自定义事件，通知主应用容器已准备好
        window.dispatchEvent(
          new CustomEvent("app-vue2-container-ready", {
            detail: { containerId: "nested-app-vue3-container" },
          })
        );
      }
    },
  },
  mounted() {
    // 如果在主应用里，挂载完成后通知主应用容器已准备好
    if (window.__POWERED_BY_QIANKUN__) {
      // 延迟一下，确保 DOM 已渲染
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
.nested-vue3 {
  margin-top: 12px;
  min-height: 300px;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 16px;
}
</style>
