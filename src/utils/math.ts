// 数学工具函数

import type { IPoint } from "@/types";

/**
 * 将角度转换为弧度
 * @param degrees 角度
 * @returns 弧度
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * 将弧度转换为角度
 * @param radians 弧度
 * @returns 角度
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * 限制数值在指定范围内
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * 线性插值
 * @param start 起始值
 * @param end 结束值
 * @param t 插值参数 (0-1)
 * @returns 插值结果
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * 计算两点之间的距离
 * @param point1 点1
 * @param point2 点2
 * @returns 距离
 */
export const distance = (point1: IPoint, point2: IPoint): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * 计算两点之间的角度
 * @param point1 点1
 * @param point2 点2
 * @returns 角度（弧度）
 */
export const angle = (point1: IPoint, point2: IPoint): number => {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x);
};

/**
 * 生成指定范围内的随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成指定范围内的随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 标准化向量
 * @param vector 向量
 * @returns 标准化后的向量
 */
export const normalize = (vector: IPoint): IPoint => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
};

/**
 * 向量点积
 * @param vector1 向量1
 * @param vector2 向量2
 * @returns 点积结果
 */
export const dotProduct = (vector1: IPoint, vector2: IPoint): number => {
  return vector1.x * vector2.x + vector1.y * vector2.y;
};

/**
 * 缓动函数 - ease out
 * @param t 时间参数 (0-1)
 * @returns 缓动值
 */
export const easeOut = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

/**
 * 缓动函数 - ease in out
 * @param t 时间参数 (0-1)
 * @returns 缓动值
 */
export const easeInOut = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
