// Canvas 相关工具函数

import type { ICanvasConfig, IPoint } from "@/types";

/**
 * 初始化 Canvas 上下文
 * @param canvas Canvas 元素
 * @param config Canvas 配置
 * @returns Canvas 2D 上下文
 */
export const initCanvas = (
  canvas: HTMLCanvasElement,
  config: ICanvasConfig
): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext("2d", { alpha: config.alpha });

  if (!ctx) {
    console.error("无法获取 Canvas 2D 上下文");
    return null;
  }

  // 设置高分辨率适配
  canvas.width = config.width * config.pixelRatio;
  canvas.height = config.height * config.pixelRatio;
  canvas.style.width = `${config.width}px`;
  canvas.style.height = `${config.height}px`;

  // 缩放上下文以适配像素比
  ctx.scale(config.pixelRatio, config.pixelRatio);

  // 设置背景色
  if (config.backgroundColor) {
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.width, config.height);
  }

  return ctx;
};

/**
 * 清空 Canvas
 * @param ctx Canvas 2D 上下文
 * @param width 宽度
 * @param height 高度
 */
export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  ctx.clearRect(0, 0, width, height);
};

/**
 * 绘制圆形
 * @param ctx Canvas 2D 上下文
 * @param center 圆心
 * @param radius 半径
 * @param color 颜色
 * @param fill 是否填充
 */
export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  center: IPoint,
  radius: number,
  color: string,
  fill: boolean = true
): void => {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);

  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};

/**
 * 绘制矩形
 * @param ctx Canvas 2D 上下文
 * @param position 位置
 * @param width 宽度
 * @param height 高度
 * @param color 颜色
 * @param fill 是否填充
 */
export const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  position: IPoint,
  width: number,
  height: number,
  color: string,
  fill: boolean = true
): void => {
  if (fill) {
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, width, height);
  } else {
    ctx.strokeStyle = color;
    ctx.strokeRect(position.x, position.y, width, height);
  }
};

/**
 * 绘制线条
 * @param ctx Canvas 2D 上下文
 * @param start 起点
 * @param end 终点
 * @param color 颜色
 * @param lineWidth 线宽
 */
export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: IPoint,
  end: IPoint,
  color: string,
  lineWidth: number = 1
): void => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

/**
 * 绘制文本
 * @param ctx Canvas 2D 上下文
 * @param text 文本内容
 * @param position 位置
 * @param font 字体
 * @param color 颜色
 * @param align 对齐方式
 */
export const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  position: IPoint,
  font: string,
  color: string,
  align: CanvasTextAlign = "left"
): void => {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, position.x, position.y);
};

/**
 * 创建渐变
 * @param ctx Canvas 2D 上下文
 * @param start 起点
 * @param end 终点
 * @param colors 颜色数组
 * @returns 渐变对象
 */
export const createLinearGradient = (
  ctx: CanvasRenderingContext2D,
  start: IPoint,
  end: IPoint,
  colors: { offset: number; color: string }[]
): CanvasGradient => {
  const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);

  colors.forEach(({ offset, color }) => {
    gradient.addColorStop(offset, color);
  });

  return gradient;
};

/**
 * 获取像素数据
 * @param ctx Canvas 2D 上下文
 * @param x X 坐标
 * @param y Y 坐标
 * @param width 宽度
 * @param height 高度
 * @returns 像素数据
 */
export const getImageData = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData => {
  return ctx.getImageData(x, y, width, height);
};

/**
 * 设置像素数据
 * @param ctx Canvas 2D 上下文
 * @param imageData 像素数据
 * @param x X 坐标
 * @param y Y 坐标
 */
export const putImageData = (
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  x: number,
  y: number
): void => {
  ctx.putImageData(imageData, x, y);
};
