/**
 * Qiankun 微前端 Props 类型定义
 */

/**
 * 主应用传递给子应用的 Props
 */
export interface QiankunProps {
  /**
   * 容器准备就绪的回调函数
   * @param containerId 容器 ID
   */
  onContainerReady?: (containerId: string) => void;

  /**
   * 路由 base 配置
   * 用于动态设置子应用的 router base
   */
  routerBase?: string;
}

/**
 * 子应用生命周期 Props（Qiankun 标准）
 */
export interface MicroAppProps {
  container?: HTMLElement;
  [key: string]: any;
}
