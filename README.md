## 项目简介

这是一个基于 **qiankun** 的微前端学习示例，包含一个完整的 **3 级嵌套链路**：

- `main-vue3`：Vue3 主应用（Vite），负责聚合与路由总控制；
- `app-vue2`：一级 Vue2 子应用（Webpack），既能独立运行，又能被 main 聚合；
- `app-vue3`：二级 Vue3 子应用（Webpack），既能挂在 app2 下面，也能独立运行。

目标：

- 在 **history 模式** 下跑通：  
  `main-vue3 → app-vue2 → app-vue3` 的 3 级嵌套；
- 3 个应用都能 **独立启动、独立调试**；
- 掌握：qiankun 生命周期、路由 base 设计、容器时机、缓存与预加载策略。

---

## 目录结构（核心部分）

- `main-vue3/`：主应用（Vue3 + Vite）
  - `src/main.ts`：注册子应用、挂载 app-vue3、路由守卫、预加载等核心逻辑
  - `src/router/index.ts`：主应用路由（占位 app2 / app3）
  - `src/App.vue`：主应用布局与子应用容器 `#subapp-container`
  - `src/utils/container.ts`：等待容器工具 `waitForContainer`
  - `src/utils/prefetch.ts`：预加载工具 `prefetchMicroApps`
  - `src/types/qiankun.d.ts`：qiankun 相关 props 类型定义

- `app-vue2/`：一级 Vue2 子应用
  - `src/main.js`：qiankun 生命周期 + 独立模式下挂载 app3
  - `src/router/index.js`：只写「相对 path」的业务路由，base 由工具统一计算
  - `src/App.vue`：内嵌 app3 的容器 `#nested-app-vue3-container` + 容器就绪通知
  - `src/utils/container.js`：等待容器工具（JS 版本）
  - `src/utils/router-base.js`：app2 路由 base 计算工具
  - `src/utils/prefetch.js`：app2 独立模式下的预加载工具

- `app-vue3/`：二级 Vue3 子应用
  - `src/main.js`：qiankun 生命周期 + 根据 `routerBase/parentApp` 创建 router
  - `src/router/index.js`：只写「相对 path」的业务路由
  - `src/utils/router-base.js`：app3 路由 base 计算与运行环境检测
  - `src/App.vue`：app3 的 tab 导航与业务页面挂载点

---

## 一、URL 层级关系：base + 相对 path

### 1.1 各应用的 base

- **main-vue3**
  - `history = createWebHistory("/main-vue3")`
- **app-vue2**
  - 在 main 中：`base = "/main-vue3/app-vue2"`
  - 独立模式：`base = "/app-vue2"`
- **app-vue3**
  - main ⟶ app2 ⟶ app3：`base = "/main-vue3/app-vue2/app-vue3"`
  - app2（独立）⟶ app3：`base = "/app-vue2/app-vue3"`
  - app3 独立运行：`base = "/app-vue3"`

### 1.2 URL 映射关系（关键场景）

**main 自己的页面**

- `/main-vue3/` → main 首页  
- `/main-vue3/page1` → main Page1  
- `/main-vue3/page2` → main Page2  

**main 里的 app2 / app3 占位路由**

- `/main-vue3/app-vue2/page1` → app2 Page1（内容由 app2 渲染）  
- `/main-vue3/app-vue2/page2` → app2 Page2  
- `/main-vue3/app-vue2/app-vue3/page1` → app3 Page1（内容由 app3 渲染）  

> 注意：main 的 `router/index.ts` 里只做「占位」，真正的内容由 qiankun 子应用渲染。

**app2 内部（只写相对路径）**

- `base = "/main-vue3/app-vue2"` 时：
  - `/page1` → `/main-vue3/app-vue2/page1`
  - `/app-vue3/page1` → `/main-vue3/app-vue2/app-vue3/page1`
- `base = "/app-vue2"` 时：
  - `/page1` → `/app-vue2/page1`
  - `/app-vue3/page1` → `/app-vue2/app-vue3/page1`

**app3 内部（只写 /page1|2|3）**

- 在 main 下：`/page1` → `/main-vue3/app-vue2/app-vue3/page1`
- 在 app2 独立下：`/page1` → `/app-vue2/app-vue3/page1`
- 独立运行：`/page1` → `/app-vue3/page1`

> 统一心智：**子应用的 router 只关心「相对 path」，前缀全部交给 base 和父应用 props 控制。**

---

## 二、app-vue3 生命周期 + 路由变化（时序图文字版）

### 2.1 main 模式：`main-vue3 ⟶ app-vue2 ⟶ app-vue3`

#### 1）启动 main

- 访问 `http://localhost:7100/main-vue3/`
- `main-vue3/src/main.ts`：
  - 创建并挂载 Vue 应用；
  - `registerMicroApps` 注册 app2；
  - `start({ singular:false })` 启动 qiankun；
  - `prefetchMicroApps([{ name:'app-vue3', entry:'//localhost:7400' }])`  
    → **开始预加载 app3 的 HTML/JS/CSS（只下载，不执行）**。

#### 2）进入 app2（不涉及 app3）

- main 路由：`/main-vue3/` → `/main-vue3/app-vue2/page1`
- main：
  - `App.vue` 判断 path 以 `/app-vue2` 开头 → 隐藏 main 自己的内容，只留 `#subapp-container`；
  - qiankun 根据 activeRule 激活 app2；
- app2：
  - `mount(props)` → `render(props)`；
  - `router = createRouter(routerBase="/main-vue3/app-vue2")`；
  - Vue2 应用挂载到 main 的 `#subapp-container`。

#### 3）首次进入 app3（mount）

- app2 内部路由：`/page1` → `/app-vue3/page1`  
  整体 URL：`/main-vue3/app-vue2/app-vue3/page1`
- app2：
  - `showNestedContainer === true`；
  - `notifyContainerReady()`（等待容器可见后，调用 `props.onContainerReady('nested-app-vue3-container')`）；
- main：
  - `handleAppVue3ContainerReady()` → 防抖 50ms 后 `mountAppVue3()`；
  - `mountAppVue3()`：
    - `waitForContainer('#nested-app-vue3-container', { waitForVisible:true })`；
    - 首次挂载：`loadMicroApp(app-vue3)`，props 中带：
      - `routerBase = "/main-vue3/app-vue2/app-vue3"`
      - `parentApp = "main-vue3"`
    - `showAppVue3Container()` 确保容器显示；
- app3：
  - `bootstrap()` → `mount(props)`；
  - `createAppRouter(routerBase, parentApp)` 决定 base；
  - Vue3 应用挂到 app2 的 `#nested-app-vue3-container`。

#### 4）在 app2 内从 app3 切回 app2（hide）

- app2 路由：`/app-vue3/page1` → `/page1`；
- 容器：
  - 在 qiankun 模式下 `containerVisible === true`（容器不删，只是 main 控制 display）；
- main 路由守卫：
  - `path` 以 `/app-vue2` 开头但不以 `/app-vue2/app-vue3` 开头 → `hideAppVue3Container()`；
  - **只隐藏容器，保留 app3 实例（缓存）**。

#### 5）再从 app2 回 app3（复用 / 自动恢复）

- 再次进入 `/app-vue2/app-vue3/page1`：
  - app2 再次 `notifyContainerReady()`；
  - main 再次调用 `mountAppVue3()`：
    - 取到容器后：
      - 若容器有子节点：说明 app3 DOM 还在 → 直接 `showAppVue3Container()`；
      - 若容器为空：说明之前 DOM 被清空 → 先 `unmount()` 旧实例，再重新 `loadMicroApp()`。

#### 6）完全离开 app2（destroy）

- main 路由：从 `/app-vue2/...` 变成 `/page1` 等；
- 路由守卫：
  - path 不以 `/app-vue2` 开头 → `destroyAppVue3()`：
    - `appVue3Instance.unmount()`；
    - `appVue3Instance = null`；
  - qiankun 内部也会卸载 app2。

### 2.2 app2 独立模式：`app-vue2 ⟶ app-vue3`

#### 1）启动 app2

- 访问 `http://localhost:7200/app-vue2/...`
- `app-vue2/src/main.js`：
  - `router = createRouter()`（base = `/app-vue2`）；
  - `render()` 挂到 `#app`；
  - `start({ singular:false })` 启动 qiankun 运行时；
  - `prefetchMicroApps([{ name:'app-vue3', entry:'//localhost:7400' }])` → **预加载 app3 资源**。

#### 2）进入 app3（首次挂载）

- app2 路由：`/app-vue2/page1` → `/app-vue2/app-vue3/page1`
- 路由守卫：
  - `to.path.startsWith('/app-vue3')` → `mountAppVue3()`；
  - `waitForContainer('#nested-app-vue3-container', { waitForVisible:true })`；
  - `loadMicroApp(app-vue3, { routerBase:'/app-vue2/app-vue3', parentApp:'app-vue2' })`。

#### 3）离开 / 返回 app3（独立模式）

- 离开 `/app-vue3/...`：
  - 路由守卫 → `unmountAppVue3()` → **直接销毁实例**；
- 返回 `/app-vue3/...`：
  - 再次 `mountAppVue3()`，重新挂载。

> 独立模式下没有做缓存策略，逻辑更简单，便于对比理解 main 下的缓存版本。

---

## 三、为什么选「qiankun + 这套 history 策略」，而不是 MF / iframe / 全 hash？

### 3.1 相比 Module Federation（MF）

**MF 侧重点：**  
运行时模块共享（组件 / 库可以在多个应用中共用同一份实现）。

**你当前的现实约束：**

- main 用 Vite，app2/app3 用 Webpack，要上 MF 需要统一到 Webpack5，成本巨大；
- Node 版本是 18，之前尝试过与 Vite 生态相关方案（如 vite-plugin-qiankun）还有 Node20 依赖问题；
- 当前目标是「**理解 3 级嵌套、路由控制和生命周期**」，不是「跨应用动态共享模块」。

在这种前提下：

- qiankun 提供的是 **应用级生命周期**（bootstrap / mount / unmount）和 **HTML entry 加载**；
- 可以让每个子系统保持自己的构建栈（Vite / Webpack 混用）；
- 对你当前「多技术栈 + 需要嵌套 + 不想重构老项目」的场景，是更合适的选择。

### 3.2 相比 iframe

**iframe 优点：**

- 天然的 CSS/JS 隔离；
- 嵌套结构直观。

**缺点：**

- URL 不统一：每个 iframe 自己一条 URL，main 很难统一控制；
- 通信复杂：需要自己封装 postMessage 协议；
- 体验偏重：多进程、多套滚动区域。

而你需要的是：

- 一条统一的 history 路径：`/main-vue3/app-vue2/app-vue3/page1`；
- 单页应用式的切换体验；
- 能在一个 DevTools 里方便地调试嵌套关系。

qiankun 在这方面更像「**单页 + 多 entry**」的模式，比 iframe 更契合这个需求。

### 3.3 相比“全部 hash 模式”

**hash 的优点：**

- 实现简单，避免服务器对 history 的适配问题；
- 一般不会踩 Nginx / 静态服务的坑。

**但在你的要求里：**

- 想要一个 **结构清晰、可读性强的 URL**（`/main-vue3/app-vue2/app-vue3/page1`），  
  全 hash 会变成 `/#/main-vue3/...`，语义和层级感会模糊不少；
- 企业环境里，很多网关 / 埋点 / 监控都是看真实 path 的，history 更贴近真实上云场景。

这套设计的关键点是：

- **只有 main 控制真实 URL**；
- 子应用 **只管自己的相对 path**，通过 base + props 动态拼出完整路径；
- 所有「前缀」逻辑集中在 `router-base` 工具类里，避免「路径叠加」这种常见坑。

---

## 四、如果你以后从零搭类似架构，可以按这几个步骤走

1. **选主应用（Shell）**
   - 用它来跑 qiankun 的 `registerMicroApps + start`；
   - 用它来独占真实 URL（history base）。

2. **确定 URL 规则**
   - 先画出类似本 README 第 1 部分的「base + 相对 path」表；
   - 明确：**哪一层控制真实 URL，哪一层只控制相对 path**。

3. **为每个子应用设计 router-base 工具**
   - 输入：`routerBase`（props）+ `parentApp` + 环境变量；
   - 输出：该应用在当前模式下的 base。

4. **容器与生命周期**
   - 子应用：渲染容器（`#subapp-container` / `#nested-app-vue3-container`），并在合适时机通过 props 告知父应用「容器已就绪」；
   - 父应用：在回调里用 `waitForContainer + loadMicroApp` 挂载微应用；
   - 需要缓存时：只隐藏容器，不轻易销毁实例，必要时通过 DOM 内容检查自动恢复。

5. **性能优化（可选）**
   - 对常用的微应用，用 `prefetchApps` 做资源预加载；
   - 根据业务场景决定是「每次重挂」还是「缓存 + 隐藏」。

有了这套心智模型，你以后再遇到类似“主应用 + 多级嵌套子应用”的需求，可以很快地拎清楚：

- 谁控制 URL；
- 谁负责挂载谁；
- 容器在哪一层渲染；
- 什么时候该 mount / hide / destroy / prefetch。


