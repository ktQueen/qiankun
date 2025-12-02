/**
 * 路由 Base 判断工具函数（app-vue2 专用）
 *
 * 目标：
 * - 统一管理 app-vue2 在不同运行模式下的 history base
 * - 避免在多个文件中硬编码 "/main-vue3/app-vue2"、"/app-vue2"
 */

/**
 * 获取 app-vue2 的路由 base
 *
 * 优先级：
 * 1. 如果父应用通过 props 传入了 routerBase，则直接使用（最精确）
 * 2. 否则根据当前是否在 qiankun 环境中自动判断：
 *    - 在 main 中：/main-vue3/app-vue2
 *    - 独立模式： /app-vue2
 *
 * @param {string} routerBase - 从 props 传递的 routerBase（优先级最高）
 * @returns {string} 路由 base
 */
export function getAppVue2RouterBase(routerBase) {
  // ① 优先使用 props 传递的 routerBase
  if (routerBase) {
    return routerBase;
  }

  // ② 降级：根据运行环境自动判断
  // eslint-disable-next-line no-underscore-dangle
  if (window.__POWERED_BY_QIANKUN__) {
    // 在 main-vue3 中被挂载时，app2 对外的前缀是 /main-vue3/app-vue2
    return "/main-vue3/app-vue2";
  }

  // ③ 最后兜底：独立运行时的前缀
  return "/app-vue2";
}

