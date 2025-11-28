<template>
  <div class="home">
    <h1>main-vue3 主应用 - 首页</h1>
    <p>这是主应用的首页</p>
    <el-button type="primary" @click="goToPage1">跳转到 Page1</el-button>
    <el-button type="success" @click="goToPage2" style="margin-left: 12px">
      跳转到 Page2
    </el-button>
    <el-button type="warning" @click="goToAppVue2" style="margin-left: 12px">
      进入 app-vue2
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToPage1 = () => {
  router.push('/page1');
};

const goToPage2 = () => {
  router.push('/page2');
};

const goToAppVue2 = () => {
  router.push('/app-vue2/page1');
};
</script>

<style scoped>
.home {
  padding: 24px;
}
</style>

