/**
 * 路由 Base 判断工具函数
 * 统一管理路由 base 的判断逻辑
 */

/**
 * 获取 app-vue2 的路由 base
 * @param {string} routerBase - 从 props 传递的 routerBase（优先级最高）
 * @returns {string} 路由 base
 */
export function getAppVue2RouterBase(routerBase) {
  // 优先使用 props 传递的 routerBase
  if (routerBase) {
    return routerBase;
  }

  // 降级：根据运行环境自动判断
  // eslint-disable-next-line no-underscore-dangle
  if (window.__POWERED_BY_QIANKUN__) {
    // 在 main 中运行
    return "/main-vue3/app-vue2";
  }

  // 独立运行
  return "/app-vue2";
}

