<template>
  <div class="home">
    <section class="intro">
      <h2>主应用首页</h2>
      <p>左侧选择不同菜单，可以在下方容器中加载对应的子应用。</p>
    </section>
    <section class="subapp">
      <h3>子应用挂载容器</h3>
      <div id="subapp-container" class="subapp-container"></div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.subapp-container {
  min-height: 400px;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 16px;
  background: #fafafa;
}
</style>


