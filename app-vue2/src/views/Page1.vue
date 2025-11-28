<template>
  <div class="page1">
    <h1>app-vue2 - Page1</h1>
    <p>这是 app-vue2 的 Page1 页面</p>
    <el-button type="primary" @click="goToPage2">跳转到 Page2</el-button>
    <el-button type="success" @click="goToAppVue3" style="margin-left: 12px">
      进入 app-vue3
    </el-button>
  </div>
</template>

<script>
export default {
  name: "Page1",
  methods: {
    goToPage2() {
      this.$router.push("/app-vue2/page2");
    },
    goToAppVue3() {
      this.$router.push("/app-vue2/app-vue3/page1");
    },
  },
};
</script>

<style scoped>
.page1 {
  padding: 24px;
}
</style>

