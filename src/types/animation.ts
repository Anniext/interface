// 动画相关类型定义

import type { EasingType } from "./common";

/** 动画状态枚举 */
export enum AnimationState {
    IDLE = "idle",
    PLAYING = "playing",
    PAUSED = "paused",
    COMPLETED = "completed",
}

/** 动画配置接口 */
export interface IAnimationConfig {
    /** 动画持续时间（秒） */
    duration: number;
    /** 缓动函数 */
    ease: EasingType | string;
    /** 延迟时间（秒） */
    delay: number;
    /** 交错时间（秒） */
    stagger?: number;
    /** 重复次数 */
    repeat?: number;
    /** 是否往返播放 */
    yoyo?: boolean;
    /** 是否自动播放 */
    autoplay?: boolean;
}

/** 动画目标接口 */
export interface IAnimationTarget {
    /** 目标元素或选择器 */
    target: HTMLElement | string;
    /** 动画属性 */
    properties: Record<string, any>;
    /** 动画配置 */
    config: IAnimationConfig;
}

/** 时间轴接口 */
export interface ITimeline {
    /** 时间轴 ID */
    id: string;
    /** 动画列表 */
    animations: IAnimationTarget[];
    /** 总持续时间 */
    totalDuration: number;
    /** 当前状态 */
    state: AnimationState;
    /** 当前进度 (0-1) */
    progress: number;
}

/** Lottie 动画配置接口 */
export interface ILottieConfig {
    /** 动画数据 */
    animationData: any;
    /** 渲染器类型 */
    renderer: "svg" | "canvas" | "html";
    /** 是否循环播放 */
    loop: boolean;
    /** 是否自动播放 */
    autoplay: boolean;
    /** 渲染设置 */
    rendererSettings?: {
        preserveAspectRatio?: string;
        clearCanvas?: boolean;
        progressiveLoad?: boolean;
        hideOnTransparent?: boolean;
    };
}

/** 滚动触发动画配置接口 */
export interface IScrollTriggerConfig {
    /** 触发元素 */
    trigger: HTMLElement | string;
    /** 开始位置 */
    start: string;
    /** 结束位置 */
    end: string;
    /** 是否固定元素 */
    pin?: boolean;
    /** 是否启用刷新 */
    scrub?: boolean | number;
    /** 标记显示 */
    markers?: boolean;
}

/** 动画事件接口 */
export interface IAnimationEvent {
    /** 事件类型 */
    type: "start" | "update" | "complete" | "reverse";
    /** 动画目标 */
    target: IAnimationTarget;
    /** 当前进度 */
    progress: number;
    /** 事件时间戳 */
    timestamp: number;
}

/** 动画管理器接口 */
export interface IAnimationManager {
    /** 创建时间轴 */
    createTimeline(id: string): ITimeline;
    /** 获取时间轴 */
    getTimeline(id: string): ITimeline | null;
    /** 播放动画 */
    play(timelineId: string): void;
    /** 暂停动画 */
    pause(timelineId: string): void;
    /** 停止动画 */
    stop(timelineId: string): void;
    /** 重置动画 */
    reset(timelineId: string): void;
    /** 设置动画进度 */
    setProgress(timelineId: string, progress: number): void;
    /** 清理所有动画 */
    clear(): void;
    /** 获取动画统计信息 */
    getStats(): IAnimationStats;
}

/** 动画统计信息接口 */
export interface IAnimationStats {
    /** 活跃动画数量 */
    activeAnimations: number;
    /** 总动画数量 */
    totalAnimations: number;
    /** 平均帧率 */
    averageFPS: number;
    /** 内存使用量（MB） */
    memoryUsage: number;
}

/** 缓动函数接口 */
export interface IEasingFunction {
    /** 缓动函数名称 */
    name: string;
    /** 缓动计算函数 */
    calculate: (t: number) => number;
    /** 缓动函数描述 */
    description?: string;
}

/** 动画预设接口 */
export interface IAnimationPreset {
    /** 预设名称 */
    name: string;
    /** 动画配置 */
    config: IAnimationConfig;
    /** 动画属性 */
    properties: Record<string, any>;
    /** 预设描述 */
    description?: string;
}

/** 性能配置接口 */
export interface IPerformanceConfig {
    /** 是否启用硬件加速 */
    enableHardwareAcceleration: boolean;
    /** 最大同时动画数量 */
    maxConcurrentAnimations: number;
    /** 动画质量等级 */
    quality: "low" | "medium" | "high";
    /** 是否启用动画 */
    enableAnimations: boolean;
    /** 减少动画效果 */
    reduceMotion: boolean;
}
