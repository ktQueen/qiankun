<template>
  <div class="page1">
    <h1>app-vue3 - Page1</h1>
    <p>这是 app-vue3 的 Page1 页面</p>
    <el-button type="primary" @click="goToPage2">跳转到 Page2</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

const goToPage2 = () => {
  router.push("/page2");
};

onMounted(() => {
  // 调试用：确认 Page1 组件是否真正渲染
  // eslint-disable-next-line no-console
  console.log(
    "[app-vue3] Page1 mounted, current route:",
    router.currentRoute.value.fullPath
  );
});
</script>

<style scoped>
.page1 {
  padding: 24px;
}
</style>
