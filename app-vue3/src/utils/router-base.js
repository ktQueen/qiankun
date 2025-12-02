/**
 * 路由 Base 判断工具函数
 * 统一管理路由 base 的判断逻辑
 */

/**
 * 运行环境类型
 */
export const RUN_MODE = {
  STANDALONE: "standalone", // 独立运行
  IN_MAIN: "in-main", // 在 main-vue3 中运行
  IN_APP2: "in-app2", // 在 app-vue2 中运行（app2 独立运行时）
};

/**
 * 检测运行环境
 * @param {string} routerBase - 从 props 传递的 routerBase
 * @param {string} parentApp - 从 props 传递的父应用标识
 * @returns {string} 运行环境标识
 */
export function detectRunMode(routerBase, parentApp) {
  // 如果明确指定了父应用，优先使用
  if (parentApp) {
    if (parentApp === "main-vue3") {
      return RUN_MODE.IN_MAIN;
    }
    if (parentApp === "app-vue2") {
      return RUN_MODE.IN_APP2;
    }
  }

  // 通过 routerBase 判断
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

  // 降级：通过路径判断（不推荐，但作为最后的手段）
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

  // 独立运行
  return RUN_MODE.STANDALONE;
}

/**
 * 获取 app-vue3 的路由 base
 * @param {string} routerBase - 从 props 传递的 routerBase（优先级最高）
 * @param {string} parentApp - 从 props 传递的父应用标识
 * @returns {string} 路由 base
 */
export function getAppVue3RouterBase(routerBase, parentApp) {
  // 优先使用 props 传递的 routerBase
  if (routerBase) {
    return routerBase;
  }

  // 根据运行环境判断
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

