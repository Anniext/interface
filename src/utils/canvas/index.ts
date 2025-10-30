/**
 * Canvas 工具库导出
 */

export { CanvasRenderer } from "./CanvasRenderer";
export { PerformanceMonitor } from "./PerformanceMonitor";
export { ResponsiveCanvas } from "./ResponsiveCanvas";
export { Particle } from "./Particle";
export { ParticleSystem } from "./ParticleSystem";

// 图形系统
export { Shape, Circle, Rectangle, Polygon, ShapeManager } from "./shapes";

export type { IPerformanceConfig } from "./PerformanceMonitor";
export type { IResponsiveConfig, DeviceType } from "./ResponsiveCanvas";
export type { IEmitter } from "./ParticleSystem";
export type { IShapeManagerConfig } from "./shapes";

/**
 * Canvas 工具函数
 */

/**
 * 创建高分辨率 Canvas
 */
export function createHighDPICanvas(
    width: number,
    height: number,
    pixelRatio = window.devicePixelRatio,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // 设置实际大小
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    // 设置显示大小
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 缩放上下文
    ctx.scale(pixelRatio, pixelRatio);

    return { canvas, ctx };
}

/**
 * 计算两点之间的距离
 */
export function distance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两点之间的角度（弧度）
 */
export function angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 线性插值
 */
export function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
}

/**
 * 将角度转换为弧度
 */
export function degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * 将弧度转换为角度
 */
export function radToDeg(radians: number): number {
    return (radians * 180) / Math.PI;
}

/**
 * 限制数值在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * 生成随机数
 */
export function random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * 生成随机整数
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(random(min, max + 1));
}

/**
 * 检查点是否在圆形内
 */
export function isPointInCircle(
    px: number,
    py: number,
    cx: number,
    cy: number,
    radius: number,
): boolean {
    return distance(px, py, cx, cy) <= radius;
}

/**
 * 检查点是否在矩形内
 */
export function isPointInRect(
    px: number,
    py: number,
    rx: number,
    ry: number,
    width: number,
    height: number,
): boolean {
    return px >= rx && px <= rx + width && py >= ry && py <= ry + height;
}

/**
 * 颜色工具函数
 */
export const ColorUtils = {
    /**
     * 将十六进制颜色转换为 RGB
     */
    hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    },

    /**
     * 将 RGB 转换为十六进制颜色
     */
    rgbToHex(r: number, g: number, b: number): string {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)}`;
    },

    /**
     * 创建 RGBA 颜色字符串
     */
    rgba(r: number, g: number, b: number, a: number): string {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    },

    /**
     * 颜色插值
     */
    lerpColor(color1: string, color2: string, factor: number): string {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);

        if (!c1 || !c2) return color1;

        const r = Math.round(lerp(c1.r, c2.r, factor));
        const g = Math.round(lerp(c1.g, c2.g, factor));
        const b = Math.round(lerp(c1.b, c2.b, factor));

        return this.rgbToHex(r, g, b);
    },
};

/**
 * 缓动函数
 */
export const Easing = {
    linear: (t: number): number => t,

    easeInQuad: (t: number): number => t * t,
    easeOutQuad: (t: number): number => t * (2 - t),
    easeInOutQuad: (t: number): number =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    easeInCubic: (t: number): number => t * t * t,
    easeOutCubic: (t: number): number => --t * t * t + 1,
    easeInOutCubic: (t: number): number =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    easeInElastic: (t: number): number => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const p = 0.3;
        const s = p / 4;
        return -(
            Math.pow(2, 10 * (t -= 1)) * Math.sin(((t - s) * (2 * Math.PI)) / p)
        );
    },

    easeOutElastic: (t: number): number => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const p = 0.3;
        const s = p / 4;
        return (
            Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1
        );
    },
};
