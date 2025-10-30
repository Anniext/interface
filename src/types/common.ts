// 通用类型定义

/** 基础响应接口 */
export interface IApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

/** 坐标点接口 */
export interface IPoint {
  x: number;
  y: number;
}

/** 尺寸接口 */
export interface ISize {
  width: number;
  height: number;
}

/** 矩形区域接口 */
export interface IRect extends IPoint, ISize {}

/** 颜色配置接口 */
export interface IColor {
  hex: string;
  rgb: string;
  rgba: string;
}

/** 主题类型 */
export type ThemeType = "light" | "dark";

/** 设备类型 */
export type DeviceType = "desktop" | "tablet" | "mobile";

/** 动画缓动类型 */
export type EasingType =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "elastic"
  | "bounce"
  | "back"
  | "power2"
  | "expo"
  | "circ";
