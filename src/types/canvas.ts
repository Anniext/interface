// Canvas 渲染相关类型定义

import type { IPoint, ISize } from "./common";

/** Canvas 配置接口 */
export interface ICanvasConfig {
    /** 画布宽度 */
    width: number;
    /** 画布高度 */
    height: number;
    /** 像素比 */
    pixelRatio: number;
    /** 是否启用透明度 */
    alpha: boolean;
    /** 背景色 */
    backgroundColor?: string;
}

/** 粒子类型枚举 */
export enum ParticleType {
    CIRCLE = "circle",
    SQUARE = "square",
    TRIANGLE = "triangle",
    STAR = "star",
}

/** 粒子接口 */
export interface IParticle {
    /** X 坐标 */
    x: number;
    /** Y 坐标 */
    y: number;
    /** X 方向速度 */
    vx: number;
    /** Y 方向速度 */
    vy: number;
    /** 粒子大小 */
    size: number;
    /** 粒子颜色 */
    color: string;
    /** 当前生命值 */
    life: number;
    /** 最大生命值 */
    maxLife: number;
    /** 粒子类型 */
    type: ParticleType;
    /** 透明度 */
    alpha?: number;
    /** 旋转角度 */
    rotation?: number;
    /** 旋转速度 */
    rotationSpeed?: number;
}

/** 几何图形基础接口 */
export interface IShape {
    /** 图形 ID */
    id: string;
    /** 位置 */
    position: IPoint;
    /** 颜色 */
    color: string;
    /** 是否可见 */
    visible: boolean;
    /** 透明度 */
    alpha: number;
    /** 旋转角度 */
    rotation: number;
}

/** 圆形接口 */
export interface ICircle extends IShape {
    /** 半径 */
    radius: number;
}

/** 矩形接口 */
export interface IRectangle extends IShape {
    /** 尺寸 */
    size: ISize;
}

/** 多边形接口 */
export interface IPolygon extends IShape {
    /** 顶点数组 */
    vertices: IPoint[];
}

/** 渲染器接口 */
export interface IRenderer {
    /** 初始化渲染器 */
    init(canvas: HTMLCanvasElement, config: ICanvasConfig): void;
    /** 清空画布 */
    clear(): void;
    /** 渲染粒子 */
    renderParticle(particle: IParticle): void;
    /** 渲染图形 */
    renderShape(shape: IShape): void;
    /** 开始渲染循环 */
    startRenderLoop(): void;
    /** 停止渲染循环 */
    stopRenderLoop(): void;
    /** 获取当前帧率 */
    getFPS(): number;
    /** 设置渲染质量 */
    setQuality(quality: "low" | "medium" | "high"): void;
}

/** 粒子系统配置接口 */
export interface IParticleSystemConfig {
    /** 最大粒子数量 */
    maxParticles: number;
    /** 粒子生成速率（每秒） */
    emissionRate: number;
    /** 粒子生命周期范围 */
    lifeRange: [number, number];
    /** 粒子大小范围 */
    sizeRange: [number, number];
    /** 粒子速度范围 */
    velocityRange: {
        x: [number, number];
        y: [number, number];
    };
    /** 粒子颜色数组 */
    colors: string[];
    /** 重力影响 */
    gravity: IPoint;
    /** 是否启用碰撞 */
    enableCollision: boolean;
}

/** 渲染统计信息接口 */
export interface IRenderStats {
    /** 当前帧率 */
    fps: number;
    /** 渲染的粒子数量 */
    particleCount: number;
    /** 渲染的图形数量 */
    shapeCount: number;
    /** 渲染时间（毫秒） */
    renderTime: number;
    /** 内存使用量（MB） */
    memoryUsage: number;
}

/** Canvas 事件接口 */
export interface ICanvasEvent {
    /** 事件类型 */
    type:
        | "click"
        | "mousemove"
        | "mousedown"
        | "mouseup"
        | "touchstart"
        | "touchmove"
        | "touchend";
    /** 画布坐标 */
    canvasPosition: IPoint;
    /** 屏幕坐标 */
    screenPosition: IPoint;
    /** 事件时间戳 */
    timestamp: number;
    /** 原始事件对象 */
    originalEvent: Event;
}
