<template>
  <div class="page1">
    <h1>app-vue3 - Page1</h1>
    <p>这是 app-vue3 的 Page1 页面</p>
    <el-button type="primary" @click="goToPage2">跳转到 Page2</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToPage2 = () => {
  router.push('/app-vue2/app-vue3/page2');
};
</script>

<style scoped>
.page1 {
  padding: 24px;
}
</style>

