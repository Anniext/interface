// DOM 操作工具函数

import type { IPoint, ISize } from "@/types";

/**
 * 获取元素的边界矩形
 * @param element HTML 元素
 * @returns 边界矩形信息
 */
export const getElementBounds = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
};

/**
 * 获取鼠标相对于元素的坐标
 * @param event 鼠标事件
 * @param element 目标元素
 * @returns 相对坐标
 */
export const getRelativeMousePosition = (
  event: MouseEvent,
  element: HTMLElement
): IPoint => {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

/**
 * 获取触摸点相对于元素的坐标
 * @param touch 触摸点
 * @param element 目标元素
 * @returns 相对坐标
 */
export const getRelativeTouchPosition = (
  touch: Touch,
  element: HTMLElement
): IPoint => {
  const rect = element.getBoundingClientRect();
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
};

/**
 * 获取视口尺寸
 * @returns 视口尺寸
 */
export const getViewportSize = (): ISize => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * 检查元素是否在视口中
 * @param element HTML 元素
 * @returns 是否在视口中
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
};

/**
 * 平滑滚动到指定元素
 * @param element 目标元素
 * @param offset 偏移量
 */
export const scrollToElement = (
  element: HTMLElement,
  offset: number = 0
): void => {
  const elementTop = element.offsetTop - offset;
  window.scrollTo({
    top: elementTop,
    behavior: "smooth",
  });
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

/**
 * 检查设备类型
 * @returns 设备类型
 */
export const getDeviceType = (): "desktop" | "tablet" | "mobile" => {
  const width = window.innerWidth;
  if (width >= 1024) return "desktop";
  if (width >= 768) return "tablet";
  return "mobile";
};

/**
 * 检查是否支持触摸
 * @returns 是否支持触摸
 */
export const isTouchDevice = (): boolean => {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns 是否复制成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("复制到剪贴板失败:", error);
    return false;
  }
};
