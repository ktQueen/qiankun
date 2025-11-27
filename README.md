## 多项目 qiankun 学习示例（3 级链路）

当前目录下有 3 个**完全独立**的前端项目：

- `main-vue3`：Vue3 主应用（将来作为 qiankun 基座）
- `app-vue2`：一级 Vue2 系统
- `app-vue3`：挂在 Vue2 下面的 Vue3 系统

第一阶段你只需要让 3 个项目**各自单独跑起来**，暂时**不接 qiankun**，先熟悉每个技术栈；后面我们再一步步把它们用 qiankun 串成“单链路 3 级嵌套”。

### 启动方式（第一阶段：各自独立运行）

在每个项目目录下分别执行：

- `main-vue3`（Vue3 主应用，端口 7100）

  ```bash
  cd main-vue3
  npm install
  npm run dev
  # 浏览器访问：http://localhost:7100
  ```

- `app-vue2`（Vue2 子应用，端口 7200）

  ```bash
  cd app-vue2
  npm install
  npm run dev
  # 浏览器访问：http://localhost:7200
  ```

- `app-vue3`（Vue3 子应用，端口 7400）
  ```bash
  cd app-vue3
  npm install
  npm run dev
  # 浏览器访问：http://localhost:7400
  ```

确认这 3 个项目都能单独访问之后，我们再从 `main-vue3` 开始，一步步接入 qiankun 把它们串起来。

## qiankun 多级微前端示例

这个示例工程展示了使用 **qiankun** 搭建多级微前端的典型场景：

- 顶层：Vue3 主应用（基座）
- 一级子应用：
  - Vue2 系统（再挂载一个 Vue3 系统）
  - Vue3 系统（业务上再挂一个 Vue2 和一个 Vue3 系统）
- 二级子应用：
  - 由 Vue2 子应用再挂载的 Vue3 系统

每个 Vue3 应用版本可以不同，用来模拟线上真实场景。

> 下面只给出项目结构和关键代码，你在本地进入各应用目录后执行 `npm install` / `pnpm install`，再运行启动命令即可。

### 启动方式（先跑简单版：主应用 + 一个 Vue3 子应用）

在项目根目录：

- **安装依赖**
  - `npm install`
- **先只启动 2 个应用**
  - 主应用（Vue3 基座）：`npm run start:root` （端口 7100）
  - 一级 Vue3 子应用：`npm run start:vue3-l1`（端口 7300）

然后打开浏览器访问：`http://localhost:7100`

- **菜单说明（当前简化版）**
  - “主应用首页” → `/`
  - “一级 Vue3 子应用” → `/vue3-l1`

等你对 qiankun 跑通流程熟悉之后，可以再逐步启动和接入：

- Vue2 子应用：`npm run start:vue2-l1`
- 嵌套 Vue3 子应用：`npm run start:vue3-nested`

再配合主应用中注释掉的菜单和 `registerMicroApps` 里的配置，一步步恢复多级挂载场景。
