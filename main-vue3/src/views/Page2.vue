<template>
  <div class="page2">
    <h1>main-vue3 主应用 - Page2</h1>
    <p>这是主应用的 Page2 页面</p>
    <el-button @click="goBack">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.page2 {
  padding: 24px;
}
</style>

