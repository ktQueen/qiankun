/**
 * 容器等待工具函数（JavaScript 版本）
 * 用于等待 DOM 容器准备就绪
 */

/**
 * 等待容器元素准备就绪
 * @param {string} selector CSS 选择器或元素 ID
 * @param {Object} options 配置选项
 * @param {number} options.timeout 超时时间（毫秒），默认 5000
 * @param {number} options.interval 轮询间隔（毫秒），默认 50
 * @param {boolean} options.useObserver 是否使用 MutationObserver，默认 true
 * @returns {Promise<HTMLElement>} 容器元素
 */
export function waitForContainer(selector, options = {}) {
  const { timeout = 5000, interval = 50, useObserver = true } = options;

  return new Promise((resolve, reject) => {
    // 先尝试直接查找
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    // 如果使用 MutationObserver（推荐）
    if (useObserver && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // 设置超时
      setTimeout(() => {
        observer.disconnect();
        reject(
          new Error(
            `Container "${selector}" not found within ${timeout}ms timeout`
          )
        );
      }, timeout);
    } else {
      // 降级到轮询方式
      let attempts = 0;
      const maxAttempts = Math.floor(timeout / interval);

      const timer = setInterval(() => {
        attempts++;
        const el = document.querySelector(selector);

        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
          reject(
            new Error(
              `Container "${selector}" not found after ${maxAttempts} attempts`
            )
          );
        }
      }, interval);
    }
  });
}
