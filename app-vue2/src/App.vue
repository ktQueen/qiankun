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
  props: {
    // 从 main-vue3 传递过来的容器准备就绪回调函数
    onContainerReady: {
      type: Function,
      default: null,
    },
  },
  computed: {
    isQiankun() {
      // eslint-disable-next-line no-underscore-dangle
      return !!window.__POWERED_BY_QIANKUN__;
    },
    showNestedContainer() {
      const path = this.$route.path;
      // 独立运行：/app-vue2/app-vue3；在 main 中：/main-vue3/app-vue2/app-vue3
      // 因为 base 已经处理了前缀，所以这里只需要判断相对路径
      return path.startsWith("/app-vue3");
    },
  },
  watch: {
    showNestedContainer(val) {
      if (this.isQiankun && val) {
        this.$nextTick(() => {
          this.notifyContainerReady();
        });
      }
    },
  },
  mounted() {
    // 首次进入时如果就是 /app-vue2/app-vue3，需要主动通知一次
    if (this.isQiankun && this.showNestedContainer) {
      this.$nextTick(() => {
        this.notifyContainerReady();
      });
    }
  },
  methods: {
    // 通知容器已准备好（使用 props 回调替代 CustomEvent）
    // 注意：独立运行时不需要这个通知，因为 app-vue2 的 main.js 通过 router.afterEach 直接处理
    notifyContainerReady() {
      const container = document.getElementById("nested-app-vue3-container");
      if (
        container &&
        this.onContainerReady &&
        typeof this.onContainerReady === "function"
      ) {
        // 在 main 中运行时，通过 props 回调通知主应用
        this.onContainerReady("nested-app-vue3-container");
      }
    },
  },
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
