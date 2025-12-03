/**
 * 预加载工具函数（JavaScript 版本）
 * 用于提前下载微应用的资源，提升首次加载速度
 */

/**
 * 预加载微应用资源
 *
 * 原理：
 * - prefetchApps 会提前 fetch 微应用的 entry HTML
 * - 解析 HTML 中的 <script> 和 <link> 标签，提前下载 JS/CSS 资源
 * - 资源会被浏览器缓存，但不会执行 JS，也不会创建 DOM
 * - 当真正需要 loadMicroApp 时，资源已经在缓存中，加载速度会快很多
 *
 * 使用场景：
 * - 用户很可能访问的微应用（比如常用功能）
 * - 资源体积较大的微应用（预加载收益更明显）
 * - 需要快速响应的关键路径
 *
 * 注意事项：
 * - 必须在 qiankun start() 之后调用
 * - 会消耗带宽，但不会消耗 CPU/内存（因为不执行 JS）
 * - 如果用户永远不会访问该应用，预加载就是"浪费"的
 *
 * @param {Array} apps 需要预加载的微应用配置数组，每个元素包含 { name, entry }
 * @param {number} delay 延迟执行时间（毫秒），默认 500ms，确保 start 完成
 */
export function prefetchMicroApps(apps, delay = 500) {
  // 动态导入 prefetchApps，避免在文件顶部导入（因为 start 必须在 prefetch 之前调用）
  import("qiankun").then(({ prefetchApps }) => {
    setTimeout(() => {
      prefetchApps(apps);
      // eslint-disable-next-line no-console
      console.log(
        `[prefetch] 已预加载 ${apps.length} 个微应用:`,
        apps.map((app) => app.name).join(", ")
      );
    }, delay);
  });
}

