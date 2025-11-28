<template>
  <div class="page2">
    <h1>app-vue2 - Page2</h1>
    <p>这是 app-vue2 的 Page2 页面</p>
    <el-button @click="goBack">返回 Page1</el-button>
  </div>
</template>

<script>
export default {
  name: "Page2",
  methods: {
    goBack() {
      this.$router.push("/app-vue2/page1");
    },
  },
};
</script>

<style scoped>
.page2 {
  padding: 24px;
}
</style>

