/**
 * 容器管理器
 * 统一管理容器的生命周期和准备状态
 */

import { waitForContainer, WaitForContainerOptions } from "./container";

export interface ContainerConfig {
  selector: string;
  options?: WaitForContainerOptions;
}

/**
 * 容器管理器类
 * 用于统一管理容器的准备状态，避免重复等待和时序问题
 */
export class ContainerManager {
  private containers = new Map<string, Promise<HTMLElement>>();
  private readyContainers = new Map<string, HTMLElement>();

  /**
   * 注册容器并等待其准备就绪
   * @param config 容器配置
   * @returns Promise<HTMLElement> 容器元素
   */
  async waitForContainer(config: ContainerConfig): Promise<HTMLElement> {
    const { selector, options } = config;

    // 如果容器已经准备好，直接返回
    if (this.readyContainers.has(selector)) {
      return this.readyContainers.get(selector)!;
    }

    // 如果已经在等待中，返回同一个 Promise（避免重复等待）
    if (this.containers.has(selector)) {
      return this.containers.get(selector)!;
    }

    // 创建新的等待 Promise
    const promise = waitForContainer(selector, {
      timeout: 5000,
      useObserver: true,
      waitForVisible: true,
      ...options,
    }).then((element) => {
      // 容器准备好后，缓存结果
      this.readyContainers.set(selector, element);
      this.containers.delete(selector); // 清理等待中的 Promise
      return element;
    });

    // 缓存等待中的 Promise
    this.containers.set(selector, promise);

    return promise;
  }

  /**
   * 标记容器已准备好（由子应用主动标记）
   * @param selector 容器选择器
   * @param element 容器元素
   */
  markContainerReady(selector: string, element: HTMLElement): void {
    this.readyContainers.set(selector, element);
    this.containers.delete(selector);
  }

  /**
   * 检查容器是否已准备好
   * @param selector 容器选择器
   * @returns 容器元素或 null
   */
  getContainer(selector: string): HTMLElement | null {
    return this.readyContainers.get(selector) || null;
  }

  /**
   * 清除容器缓存（容器被销毁时调用）
   * @param selector 容器选择器
   */
  clearContainer(selector: string): void {
    this.readyContainers.delete(selector);
    this.containers.delete(selector);
  }
}

// 单例实例
export const containerManager = new ContainerManager();
