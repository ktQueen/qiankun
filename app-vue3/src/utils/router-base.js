/**
 * 路由 Base 判断工具函数（app-vue3 专用）
 *
 * 目标：
 * - 统一管理 app-vue3 在三种运行模式下的 history base
 *   1) 独立运行           → /app-vue3
 *   2) 在 main 下，通过 app2 嵌套 → /main-vue3/app-vue2/app-vue3
 *   3) 在 app2 独立模式下嵌套    → /app-vue2/app-vue3
 */

/**
 * 运行环境类型枚举
 */
export const RUN_MODE = {
  STANDALONE: "standalone", // 独立运行
  IN_MAIN: "in-main", // 在 main-vue3 中运行
  IN_APP2: "in-app2", // 在 app-vue2 中运行（app2 独立运行时）
};

/**
 * 检测 app-vue3 当前的运行环境
 *
 * 优先级：
 * 1. parentApp（从 props 传入）明确指定父应用是谁
 * 2. routerBase（从 props 传入）推断 base 所属环境
 * 3. window.__POWERED_BY_QIANKUN__ + pathname 兜底推断
 *
 * @param {string} routerBase - 从 props 传递的 routerBase
 * @param {string} parentApp  - 从 props 传递的父应用标识
 * @returns {string} 运行环境标识（RUN_MODE 中的一个值）
 */
export function detectRunMode(routerBase, parentApp) {
  // ① 如果明确指定了父应用，优先使用
  if (parentApp) {
    if (parentApp === "main-vue3") {
      return RUN_MODE.IN_MAIN;
    }
    if (parentApp === "app-vue2") {
      return RUN_MODE.IN_APP2;
    }
  }

  // ② 通过 routerBase 前缀判断
  if (routerBase) {
    if (routerBase.startsWith("/main-vue3/app-vue2/app-vue3")) {
      return RUN_MODE.IN_MAIN;
    }
    if (routerBase.startsWith("/app-vue2/app-vue3")) {
      return RUN_MODE.IN_APP2;
    }
    if (routerBase === "/app-vue3") {
      return RUN_MODE.STANDALONE;
    }
  }

  // ③ 降级：通过路径判断（仅作为最后兜底，不推荐在新逻辑中依赖）
  // eslint-disable-next-line no-underscore-dangle
  if (window.__POWERED_BY_QIANKUN__) {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/main-vue3/app-vue2/app-vue3")) {
      return RUN_MODE.IN_MAIN;
    }
    if (pathname.startsWith("/app-vue2/app-vue3")) {
      return RUN_MODE.IN_APP2;
    }
    // 默认假设在 main 中
    return RUN_MODE.IN_MAIN;
  }

  // ④ 全部判断失败时，认为是独立运行
  return RUN_MODE.STANDALONE;
}

/**
 * 获取 app-vue3 的 history base
 *
 * 优先级：
 * 1. routerBase（props）→ 最精确
 * 2. detectRunMode() 的运行环境 → 根据环境返回对应 base
 *
 * @param {string} routerBase - 从 props 传递的 routerBase（优先级最高）
 * @param {string} parentApp  - 从 props 传递的父应用标识
 * @returns {string} 路由 base
 */
export function getAppVue3RouterBase(routerBase, parentApp) {
  // ① 优先使用父应用明确传入的 routerBase
  if (routerBase) {
    return routerBase;
  }

  // ② 根据运行环境返回对应 base
  const runMode = detectRunMode(routerBase, parentApp);

  switch (runMode) {
    case RUN_MODE.IN_MAIN:
      return "/main-vue3/app-vue2/app-vue3";
    case RUN_MODE.IN_APP2:
      return "/app-vue2/app-vue3";
    case RUN_MODE.STANDALONE:
    default:
      return "/app-vue3";
  }
}

