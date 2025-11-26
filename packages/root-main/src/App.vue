<template>
  <div class="layout">
    <header class="header">
      <h1>Qiankun 多级微前端示例 - 主应用(Vue3)</h1>
    </header>
    <main class="main">
      <nav class="sidebar">
        <router-link to="/">主应用首页</router-link>
        <router-link to="/vue2-l1">一级 Vue2 子应用</router-link>
        <router-link to="/vue3-l1">一级 Vue3 子应用</router-link>
        <router-link to="/nested-vue3">二级 Vue3 子应用（由 Vue2 再挂载）</router-link>
      </nav>
      <section class="content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  padding: 12px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #fff;
}
.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.sidebar {
  width: 220px;
  padding: 16px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sidebar a {
  color: #333;
}
.sidebar a.router-link-active {
  color: #1677ff;
}
.content {
  flex: 1;
  padding: 16px;
  overflow: auto;
}
</style>


