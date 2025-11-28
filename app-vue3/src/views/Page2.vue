<template>
  <div class="page2">
    <h1>app-vue3 - Page2</h1>
    <p>这是 app-vue3 的 Page2 页面</p>
    <el-button @click="goBack">返回 Page1</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.push('/app-vue2/app-vue3/page1');
};
</script>

<style scoped>
.page2 {
  padding: 24px;
}
</style>

