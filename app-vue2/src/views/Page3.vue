<template>
  <div class="page3">
    <h1>app-vue2 - Page3</h1>
    <p>这是 app-vue2 的 Page3 页面</p>
    <el-button @click="goBack">返回 Page1</el-button>
  </div>
</template>

<script>
export default {
  name: "Page3",
  methods: {
    goBack() {
      this.$router.push("/app-vue2/page1");
    },
  },
};
</script>

<style scoped>
.page3 {
  padding: 24px;
}
</style>

