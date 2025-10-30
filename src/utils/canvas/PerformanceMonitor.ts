/**
 * Canvas 性能监控工具
 * 用于监控渲染性能和资源使用情况
 */

import type { IRenderStats } from "@/types";

export interface IPerformanceConfig {
    /** 是否启用性能监控 */
    enabled: boolean;
    /** 统计更新间隔（毫秒） */
    updateInterval: number;
    /** 是否记录详细日志 */
    verbose: boolean;
    /** 性能警告阈值 */
    thresholds: {
        /** 最低帧率警告阈值 */
        minFps: number;
        /** 最大渲染时间警告阈值（毫秒） */
        maxRenderTime: number;
        /** 最大内存使用警告阈值（MB） */
        maxMemoryUsage: number;
    };
}

export class PerformanceMonitor {
    private config: IPerformanceConfig;
    private stats: IRenderStats;
    private frameHistory: number[] = [];
    private renderTimeHistory: number[] = [];
    private lastUpdateTime = 0;
    private frameCount = 0;
    private totalFrameTime = 0;

    // 性能警告回调
    private onWarning?: (
        type: string,
        value: number,
        threshold: number,
    ) => void;

    constructor(config: Partial<IPerformanceConfig> = {}) {
        this.config = {
            enabled: true,
            updateInterval: 1000,
            verbose: false,
            thresholds: {
                minFps: 30,
                maxRenderTime: 16.67, // 60fps = 16.67ms per frame
                maxMemoryUsage: 100,
            },
            ...config,
        };

        this.stats = {
            fps: 0,
            particleCount: 0,
            shapeCount: 0,
            renderTime: 0,
            memoryUsage: 0,
        };
    }

    /**
     * 开始帧计时
     */
    startFrame(): number {
        if (!this.config.enabled) return 0;
        return performance.now();
    }

    /**
     * 结束帧计时并更新统计
     */
    endFrame(startTime: number, particleCount = 0, shapeCount = 0): void {
        if (!this.config.enabled) return;

        const currentTime = performance.now();
        const frameTime = currentTime - startTime;

        // 更新帧计数和时间
        this.frameCount++;
        this.totalFrameTime += frameTime;

        // 记录渲染时间历史
        this.renderTimeHistory.push(frameTime);
        if (this.renderTimeHistory.length > 60) {
            this.renderTimeHistory.shift();
        }

        // 更新统计信息
        this.stats.renderTime = frameTime;
        this.stats.particleCount = particleCount;
        this.stats.shapeCount = shapeCount;

        // 定期更新 FPS 和其他统计
        if (currentTime - this.lastUpdateTime >= this.config.updateInterval) {
            this.updateStats(currentTime);
            this.checkPerformanceWarnings();
            this.lastUpdateTime = currentTime;
        }
    }

    /**
     * 更新统计信息
     */
    private updateStats(currentTime: number): void {
        const deltaTime = currentTime - this.lastUpdateTime;

        // 计算 FPS
        this.stats.fps = (this.frameCount * 1000) / deltaTime;

        // 记录 FPS 历史
        this.frameHistory.push(this.stats.fps);
        if (this.frameHistory.length > 60) {
            this.frameHistory.shift();
        }

        // 更新内存使用量
        this.stats.memoryUsage = this.getMemoryUsage();

        // 重置计数器
        this.frameCount = 0;
        this.totalFrameTime = 0;

        // 详细日志
        if (this.config.verbose) {
            console.log("性能统计:", {
                fps: this.stats.fps.toFixed(1),
                avgRenderTime: this.getAverageRenderTime().toFixed(2),
                particleCount: this.stats.particleCount,
                shapeCount: this.stats.shapeCount,
                memoryUsage: this.stats.memoryUsage.toFixed(1),
            });
        }
    }

    /**
     * 检查性能警告
     */
    private checkPerformanceWarnings(): void {
        const { thresholds } = this.config;

        // 检查帧率
        if (this.stats.fps < thresholds.minFps) {
            this.triggerWarning("低帧率", this.stats.fps, thresholds.minFps);
        }

        // 检查渲染时间
        const avgRenderTime = this.getAverageRenderTime();
        if (avgRenderTime > thresholds.maxRenderTime) {
            this.triggerWarning(
                "渲染时间过长",
                avgRenderTime,
                thresholds.maxRenderTime,
            );
        }

        // 检查内存使用
        if (this.stats.memoryUsage > thresholds.maxMemoryUsage) {
            this.triggerWarning(
                "内存使用过高",
                this.stats.memoryUsage,
                thresholds.maxMemoryUsage,
            );
        }
    }

    /**
     * 触发性能警告
     */
    private triggerWarning(
        type: string,
        value: number,
        threshold: number,
    ): void {
        if (this.onWarning) {
            this.onWarning(type, value, threshold);
        } else if (this.config.verbose) {
            console.warn(`性能警告: ${type}`, {
                当前值: value,
                阈值: threshold,
            });
        }
    }

    /**
     * 获取平均渲染时间
     */
    private getAverageRenderTime(): number {
        if (this.renderTimeHistory.length === 0) return 0;

        const sum = this.renderTimeHistory.reduce((a, b) => a + b, 0);
        return sum / this.renderTimeHistory.length;
    }

    /**
     * 获取内存使用量
     */
    private getMemoryUsage(): number {
        if ("memory" in performance && (performance as any).memory) {
            return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
        }
        return 0;
    }

    /**
     * 获取当前统计信息
     */
    getStats(): IRenderStats {
        return { ...this.stats };
    }

    /**
     * 获取详细性能信息
     */
    getDetailedStats() {
        return {
            ...this.stats,
            averageRenderTime: this.getAverageRenderTime(),
            minFps: Math.min(...this.frameHistory),
            maxFps: Math.max(...this.frameHistory),
            frameHistory: [...this.frameHistory],
            renderTimeHistory: [...this.renderTimeHistory],
        };
    }

    /**
     * 重置统计信息
     */
    reset(): void {
        this.stats = {
            fps: 0,
            particleCount: 0,
            shapeCount: 0,
            renderTime: 0,
            memoryUsage: 0,
        };

        this.frameHistory = [];
        this.renderTimeHistory = [];
        this.frameCount = 0;
        this.totalFrameTime = 0;
        this.lastUpdateTime = performance.now();
    }

    /**
     * 设置警告回调
     */
    setWarningCallback(
        callback: (type: string, value: number, threshold: number) => void,
    ): void {
        this.onWarning = callback;
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<IPerformanceConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * 启用/禁用监控
     */
    setEnabled(enabled: boolean): void {
        this.config.enabled = enabled;
        if (!enabled) {
            this.reset();
        }
    }

    /**
     * 获取性能建议
     */
    getPerformanceRecommendations(): string[] {
        const recommendations: string[] = [];
        const stats = this.getDetailedStats();

        if (stats.fps < 30) {
            recommendations.push("帧率过低，建议减少粒子数量或降低渲染质量");
        }

        if (stats.averageRenderTime > 16.67) {
            recommendations.push(
                "渲染时间过长，建议优化绘制逻辑或使用离屏渲染",
            );
        }

        if (stats.memoryUsage > 100) {
            recommendations.push(
                "内存使用过高，建议清理未使用的对象或减少缓存",
            );
        }

        if (stats.particleCount > 1000) {
            recommendations.push(
                "粒子数量过多，建议实现对象池或减少同时存在的粒子",
            );
        }

        if (recommendations.length === 0) {
            recommendations.push("性能表现良好，无需优化");
        }

        return recommendations;
    }
}
