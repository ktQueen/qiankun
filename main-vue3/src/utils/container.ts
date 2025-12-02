/**
 * 容器等待工具函数
 * 用于等待 DOM 容器准备就绪
 */

export interface WaitForContainerOptions {
  /**
   * 超时时间（毫秒）
   * @default 5000
   */
  timeout?: number;

  /**
   * 轮询间隔（毫秒）
   * @default 50
   */
  interval?: number;

  /**
   * 是否使用 MutationObserver（更高效）
   * @default true
   */
  useObserver?: boolean;

  /**
   * 是否等待容器可见（检查 offsetParent 不为 null）
   * @default false
   */
  waitForVisible?: boolean;

  /**
   * 是否检查容器是否有内容（检查 children.length > 0）
   * @default false
   */
  waitForContent?: boolean;
}

/**
 * 检查容器是否满足条件（可见性、内容等）
 */
function checkContainerReady(
  element: HTMLElement | null,
  options: WaitForContainerOptions
): boolean {
  if (!element) return false;

  // 检查是否可见
  if (options.waitForVisible) {
    // offsetParent 为 null 表示元素不可见（display: none 或不在 DOM 中）
    if (element.offsetParent === null && element !== document.body) {
      return false;
    }
  }

  // 检查是否有内容（某些场景下需要等待内容渲染）
  if (options.waitForContent) {
    if (element.children.length === 0) {
      return false;
    }
  }

  return true;
}

export function waitForContainer(
  selector: string,
  options: WaitForContainerOptions = {}
): Promise<HTMLElement> {
  const {
    timeout = 5000,
    interval = 50,
    useObserver = true,
    waitForVisible = false,
    waitForContent = false,
  } = options;

  return new Promise((resolve, reject) => {
    // 先尝试直接查找并检查条件
    const element = document.querySelector(selector) as HTMLElement;
    if (element && checkContainerReady(element, options)) {
      resolve(element);
      return;
    }

    // 如果使用 MutationObserver（推荐）
    if (useObserver && typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector) as HTMLElement;
        if (el && checkContainerReady(el, options)) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true, // 监听属性变化（如 style、class 可能影响可见性）
      });

      // 设置超时
      setTimeout(() => {
        observer.disconnect();
        reject(
          new Error(
            `Container "${selector}" not ready within ${timeout}ms timeout`
          )
        );
      }, timeout);
    } else {
      // 降级到轮询方式
      let attempts = 0;
      const maxAttempts = Math.floor(timeout / interval);

      const timer = setInterval(() => {
        attempts++;
        const el = document.querySelector(selector) as HTMLElement;

        if (el && checkContainerReady(el, options)) {
          clearInterval(timer);
          resolve(el);
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
          reject(
            new Error(
              `Container "${selector}" not ready after ${maxAttempts} attempts`
            )
          );
        }
      }, interval);
    }
  });
}
