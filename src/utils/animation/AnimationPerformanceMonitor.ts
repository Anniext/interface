// 动画性能监控工具
import type { IAnimationStats } from "@/types/animation";

/** 性能监控配置 */
export interface IPerformanceMonitorConfig {
    /** 是否启用监控 */
    enabled: boolean;
    /** 采样间隔（毫秒） */
    sampleInterval: number;
    /** 历史数据保留数量 */
    historySize: number;
    /** 性能警告阈值 */
    thresholds: {
        /** 最低帧率警告阈值 */
        minFPS: number;
        /** 最大内存使用警告阈值（MB） */
        maxMemoryMB: number;
        /** 最大动画数量警告阈值 */
        maxAnimations: number;
    };
}

/** 性能数据点 */
export interface IPerformanceDataPoint {
    /** 时间戳 */
    timestamp: number;
    /** 帧率 */
    fps: number;
    /** 内存使用（MB） */
    memoryMB: number;
    /** 活跃动画数量 */
    activeAnimations: number;
    /** 总动画数量 */
    totalAnimations: number;
    /** CPU 使用率（估算） */
    cpuUsage: number;
}

/** 性能警告类型 */
export enum PerformanceWarningType {
    LOW_FPS = "low_fps",
    HIGH_MEMORY = "high_memory",
    TOO_MANY_ANIMATIONS = "too_many_animations",
    HIGH_CPU = "high_cpu",
}

/** 性能警告 */
export interface IPerformanceWarning {
    type: PerformanceWarningType;
    message: string;
    value: number;
    threshold: number;
    timestamp: number;
}

/** 动画性能监控器 */
export class AnimationPerformanceMonitor {
    private config: IPerformanceMonitorConfig;
    private isRunning = false;
    private intervalId: number | null = null;
    private dataHistory: IPerformanceDataPoint[] = [];
    private warnings: IPerformanceWarning[] = [];
    private frameCount = 0;
    private lastFrameTime = 0;
    private lastCPUTime = 0;
    private animationStatsProvider: (() => IAnimationStats) | null = null;

    constructor(config: Partial<IPerformanceMonitorConfig> = {}) {
        this.config = {
            enabled: true,
            sampleInterval: 1000, // 1秒采样一次
            historySize: 60, // 保留60个数据点（1分钟历史）
            thresholds: {
                minFPS: 30,
                maxMemoryMB: 100,
                maxAnimations: 50,
            },
            ...config,
        };
    }

    /**
     * 设置动画统计数据提供者
     * @param provider 统计数据提供函数
     */
    setAnimationStatsProvider(provider: () => IAnimationStats): void {
        this.animationStatsProvider = provider;
    }

    /**
     * 开始监控
     */
    start(): void {
        if (!this.config.enabled || this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.lastCPUTime = performance.now();

        // 启动帧率监控
        this.startFrameRateMonitoring();

        // 启动定期采样
        this.intervalId = window.setInterval(() => {
            this.collectPerformanceData();
        }, this.config.sampleInterval);

        console.log("动画性能监控已启动");
    }

    /**
     * 停止监控
     */
    stop(): void {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        console.log("动画性能监控已停止");
    }

    /**
     * 获取当前性能数据
     */
    getCurrentPerformance(): IPerformanceDataPoint | null {
        if (this.dataHistory.length === 0) {
            return null;
        }
        return this.dataHistory[this.dataHistory.length - 1] || null;
    }

    /**
     * 获取性能历史数据
     */
    getPerformanceHistory(): IPerformanceDataPoint[] {
        return [...this.dataHistory];
    }

    /**
     * 获取性能警告
     */
    getWarnings(): IPerformanceWarning[] {
        return [...this.warnings];
    }

    /**
     * 清除警告
     */
    clearWarnings(): void {
        this.warnings = [];
    }

    /**
     * 获取性能统计摘要
     */
    getPerformanceSummary() {
        if (this.dataHistory.length === 0) {
            return null;
        }

        const recent = this.dataHistory.slice(-10); // 最近10个数据点
        const avgFPS =
            recent.reduce((sum, data) => sum + data.fps, 0) / recent.length;
        const avgMemory =
            recent.reduce((sum, data) => sum + data.memoryMB, 0) /
            recent.length;
        const avgCPU =
            recent.reduce((sum, data) => sum + data.cpuUsage, 0) /
            recent.length;
        const maxAnimations = Math.max(
            ...recent.map((data) => data.activeAnimations),
        );

        return {
            averageFPS: Math.round(avgFPS * 10) / 10,
            averageMemoryMB: Math.round(avgMemory * 10) / 10,
            averageCPUUsage: Math.round(avgCPU * 10) / 10,
            maxActiveAnimations: maxAnimations,
            warningCount: this.warnings.length,
            isHealthy:
                avgFPS >= this.config.thresholds.minFPS &&
                avgMemory <= this.config.thresholds.maxMemoryMB &&
                maxAnimations <= this.config.thresholds.maxAnimations,
        };
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig: Partial<IPerformanceMonitorConfig>): void {
        this.config = { ...this.config, ...newConfig };

        // 如果监控状态发生变化，重新启动或停止
        if (newConfig.enabled !== undefined) {
            if (newConfig.enabled && !this.isRunning) {
                this.start();
            } else if (!newConfig.enabled && this.isRunning) {
                this.stop();
            }
        }
    }

    /**
     * 手动记录性能事件
     */
    recordEvent(eventName: string, duration: number): void {
        if (!this.isRunning) {
            return;
        }

        console.log(`性能事件: ${eventName} - ${duration.toFixed(2)}ms`);

        // 如果事件耗时过长，记录警告
        if (duration > 16.67) {
            // 超过一帧的时间
            this.addWarning({
                type: PerformanceWarningType.HIGH_CPU,
                message: `事件 "${eventName}" 执行时间过长: ${duration.toFixed(
                    2,
                )}ms`,
                value: duration,
                threshold: 16.67,
                timestamp: performance.now(),
            });
        }
    }

    /**
     * 启动帧率监控
     * @private
     */
    private startFrameRateMonitoring(): void {
        const measureFrame = () => {
            if (!this.isRunning) {
                return;
            }

            this.frameCount++;
            requestAnimationFrame(measureFrame);
        };

        requestAnimationFrame(measureFrame);
    }

    /**
     * 收集性能数据
     * @private
     */
    private collectPerformanceData(): void {
        const currentTime = performance.now();
        const timeDelta = currentTime - this.lastFrameTime;

        // 计算帧率
        const fps = timeDelta > 0 ? (this.frameCount * 1000) / timeDelta : 0;
        this.frameCount = 0;
        this.lastFrameTime = currentTime;

        // 获取内存使用
        let memoryMB = 0;
        if ((performance as any).memory) {
            memoryMB =
                (performance as any).memory.usedJSHeapSize / (1024 * 1024);
        }

        // 估算CPU使用率（简化版本）
        const cpuDelta = currentTime - this.lastCPUTime;
        const cpuUsage = Math.min(
            100,
            Math.max(0, ((16.67 - cpuDelta) / 16.67) * 100),
        );
        this.lastCPUTime = currentTime;

        // 获取动画统计
        let animationStats: IAnimationStats = {
            activeAnimations: 0,
            totalAnimations: 0,
            averageFPS: fps,
            memoryUsage: memoryMB,
        };

        if (this.animationStatsProvider) {
            animationStats = this.animationStatsProvider();
        }

        // 创建数据点
        const dataPoint: IPerformanceDataPoint = {
            timestamp: currentTime,
            fps: Math.round(fps * 10) / 10,
            memoryMB: Math.round(memoryMB * 10) / 10,
            activeAnimations: animationStats.activeAnimations,
            totalAnimations: animationStats.totalAnimations,
            cpuUsage: Math.round(cpuUsage * 10) / 10,
        };

        // 添加到历史数据
        this.dataHistory.push(dataPoint);

        // 限制历史数据大小
        if (this.dataHistory.length > this.config.historySize) {
            this.dataHistory.shift();
        }

        // 检查性能警告
        this.checkPerformanceThresholds(dataPoint);
    }

    /**
     * 检查性能阈值
     * @private
     */
    private checkPerformanceThresholds(dataPoint: IPerformanceDataPoint): void {
        const { thresholds } = this.config;

        // 检查帧率
        if (dataPoint.fps < thresholds.minFPS) {
            this.addWarning({
                type: PerformanceWarningType.LOW_FPS,
                message: `帧率过低: ${dataPoint.fps}fps (阈值: ${thresholds.minFPS}fps)`,
                value: dataPoint.fps,
                threshold: thresholds.minFPS,
                timestamp: dataPoint.timestamp,
            });
        }

        // 检查内存使用
        if (dataPoint.memoryMB > thresholds.maxMemoryMB) {
            this.addWarning({
                type: PerformanceWarningType.HIGH_MEMORY,
                message: `内存使用过高: ${dataPoint.memoryMB}MB (阈值: ${thresholds.maxMemoryMB}MB)`,
                value: dataPoint.memoryMB,
                threshold: thresholds.maxMemoryMB,
                timestamp: dataPoint.timestamp,
            });
        }

        // 检查动画数量
        if (dataPoint.activeAnimations > thresholds.maxAnimations) {
            this.addWarning({
                type: PerformanceWarningType.TOO_MANY_ANIMATIONS,
                message: `活跃动画过多: ${dataPoint.activeAnimations} (阈值: ${thresholds.maxAnimations})`,
                value: dataPoint.activeAnimations,
                threshold: thresholds.maxAnimations,
                timestamp: dataPoint.timestamp,
            });
        }
    }

    /**
     * 添加警告
     * @private
     */
    private addWarning(warning: IPerformanceWarning): void {
        this.warnings.push(warning);

        // 限制警告数量
        if (this.warnings.length > 100) {
            this.warnings.shift();
        }

        // 在开发环境中输出警告
        if (process.env.NODE_ENV === "development") {
            console.warn(`[性能警告] ${warning.message}`);
        }
    }
}

// 创建全局性能监控器实例
export const globalPerformanceMonitor = new AnimationPerformanceMonitor({
    enabled: process.env.NODE_ENV === "development",
    sampleInterval: 1000,
    historySize: 60,
    thresholds: {
        minFPS: 30,
        maxMemoryMB: 100,
        maxAnimations: 50,
    },
});

// 便捷方法
export const startPerformanceMonitoring = () =>
    globalPerformanceMonitor.start();
export const stopPerformanceMonitoring = () => globalPerformanceMonitor.stop();
export const getPerformanceSummary = () =>
    globalPerformanceMonitor.getPerformanceSummary();
export const recordPerformanceEvent = (eventName: string, duration: number) =>
    globalPerformanceMonitor.recordEvent(eventName, duration);
export const getPerformanceWarnings = () =>
    globalPerformanceMonitor.getWarnings();
export const clearPerformanceWarnings = () =>
    globalPerformanceMonitor.clearWarnings();
