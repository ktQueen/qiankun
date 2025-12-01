<template>
  <div class="page3">
    <h1>app-vue3 - Page3</h1>
    <p>这是 app-vue3 的 Page3 页面</p>
    <el-button @click="goBack">返回 Page1</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.push("/page1");
};
</script>

<style scoped>
.page3 {
  padding: 24px;
}
</style>
