/**
 * 容器通知工具（JavaScript 版本）
 * 简化容器准备就绪的通知逻辑
 */

/**
 * 创建容器通知器
 * 用于简化容器准备就绪的通知逻辑
 * @param {Object} options 配置选项
 * @param {Function} options.onReady 容器准备就绪的回调函数
 * @param {string} options.containerId 容器 ID
 * @returns {Object} 通知器对象
 */
export function createContainerNotifier(options) {
  const { onReady, containerId } = options;

  if (!onReady || typeof onReady !== "function") {
    return {
      notify: () => {},
      check: () => false,
    };
  }

  let notified = false;

  /**
   * 通知容器已准备好
   * @param {HTMLElement} element 容器元素（可选）
   */
  const notify = (element) => {
    // 如果已经通知过，跳过
    if (notified) {
      return;
    }

    // 如果没有传入元素，尝试查找
    const container = element || document.getElementById(containerId);
    if (container) {
      onReady(containerId);
      notified = true;
    }
  };

  /**
   * 检查容器是否存在
   * @returns {boolean} 容器是否存在
   */
  const check = () => {
    const container = document.getElementById(containerId);
    return !!container;
  };

  /**
   * 重置通知状态（容器被销毁时调用）
   */
  const reset = () => {
    notified = false;
  };

  return {
    notify,
    check,
    reset,
  };
}

