// 动画状态跟踪和控制系统
import { reactive, ref, computed } from "vue";
import type {
    IAnimationStats,
    IAnimationEvent,
    IPerformanceConfig,
} from "@/types/animation";
import { AnimationState } from "@/types/animation";

/** 动画实例状态 */
export interface IAnimationInstanceState {
    /** 动画ID */
    id: string;
    /** 动画名称 */
    name: string;
    /** 当前状态 */
    state: AnimationState;
    /** 进度 (0-1) */
    progress: number;
    /** 持续时间（毫秒） */
    duration: number;
    /** 开始时间戳 */
    startTime: number;
    /** 结束时间戳 */
    endTime?: number;
    /** 动画类型 */
    type: "timeline" | "tween" | "lottie" | "css";
    /** 目标元素 */
    target?: HTMLElement | string;
    /** 分组 */
    group?: string;
    /** 优先级 */
    priority: number;
    /** 是否循环 */
    loop: boolean;
    /** 错误信息 */
    error?: string;
}

/** 性能指标 */
export interface IPerformanceMetrics {
    /** 当前帧率 */
    currentFPS: number;
    /** 平均帧率 */
    averageFPS: number;
    /** 最低帧率 */
    minFPS: number;
    /** 最高帧率 */
    maxFPS: number;
    /** 内存使用量（MB） */
    memoryUsage: number;
    /** CPU使用率估算 */
    cpuUsage: number;
    /** 动画数量统计 */
    animationCounts: {
        total: number;
        active: number;
        paused: number;
        completed: number;
        failed: number;
    };
}

/** 动画状态跟踪器类 */
export class AnimationStateTracker {
    private animations = reactive(new Map<string, IAnimationInstanceState>());
    private eventHistory = ref<IAnimationEvent[]>([]);
    private performanceMetrics = reactive<IPerformanceMetrics>({
        currentFPS: 60,
        averageFPS: 60,
        minFPS: 60,
        maxFPS: 60,
        memoryUsage: 0,
        cpuUsage: 0,
        animationCounts: {
            total: 0,
            active: 0,
            paused: 0,
            completed: 0,
            failed: 0,
        },
    });

    private performanceConfig: IPerformanceConfig;
    private frameCount = 0;
    private lastFrameTime = performance.now();
    private fpsHistory: number[] = [];
    private isMonitoring = false;
    private monitoringInterval?: number;

    constructor(config: IPerformanceConfig) {
        this.performanceConfig = config;
        this.startPerformanceMonitoring();
    }

    /**
     * 注册动画实例
     * @param animation 动画实例状态
     */
    registerAnimation(
        animation: Omit<IAnimationInstanceState, "startTime" | "progress">,
    ): void {
        const fullAnimation: IAnimationInstanceState = {
            ...animation,
            startTime: performance.now(),
            progress: 0,
        };

        this.animations.set(animation.id, fullAnimation);
        this.updateAnimationCounts();

        this.addEvent({
            type: "start",
            target: {
                target: animation.target || "",
                properties: {},
                config: {
                    duration: animation.duration / 1000,
                    ease: "none",
                    delay: 0,
                },
            },
            progress: 0,
            timestamp: performance.now(),
        });
    }

    /**
     * 更新动画状态
     * @param id 动画ID
     * @param updates 更新的状态
     */
    updateAnimation(
        id: string,
        updates: Partial<IAnimationInstanceState>,
    ): void {
        const animation = this.animations.get(id);
        if (animation) {
            Object.assign(animation, updates);

            // 如果动画完成，记录结束时间
            if (updates.state === "completed" && !animation.endTime) {
                animation.endTime = performance.now();
            }

            this.updateAnimationCounts();

            // 添加更新事件
            this.addEvent({
                type: "update",
                target: {
                    target: animation.target || "",
                    properties: {},
                    config: {
                        duration: animation.duration / 1000,
                        ease: "none",
                        delay: 0,
                    },
                },
                progress: animation.progress,
                timestamp: performance.now(),
            });
        }
    }

    /**
     * 移除动画实例
     * @param id 动画ID
     */
    unregisterAnimation(id: string): void {
        const animation = this.animations.get(id);
        if (animation) {
            this.animations.delete(id);
            this.updateAnimationCounts();

            this.addEvent({
                type: "complete",
                target: {
                    target: animation.target || "",
                    properties: {},
                    config: {
                        duration: animation.duration / 1000,
                        ease: "none",
                        delay: 0,
                    },
                },
                progress: 1,
                timestamp: performance.now(),
            });
        }
    }

    /**
     * 获取动画实例
     * @param id 动画ID
     * @returns 动画实例状态
     */
    getAnimation(id: string): IAnimationInstanceState | undefined {
        return this.animations.get(id);
    }

    /**
     * 获取所有动画实例
     * @returns 动画实例数组
     */
    getAllAnimations(): IAnimationInstanceState[] {
        return Array.from(this.animations.values());
    }

    /**
     * 按状态获取动画
     * @param state 动画状态
     * @returns 动画实例数组
     */
    getAnimationsByState(state: AnimationState): IAnimationInstanceState[] {
        return this.getAllAnimations().filter(
            (animation) => animation.state === state,
        );
    }

    /**
     * 按分组获取动画
     * @param group 分组名称
     * @returns 动画实例数组
     */
    getAnimationsByGroup(group: string): IAnimationInstanceState[] {
        return this.getAllAnimations().filter(
            (animation) => animation.group === group,
        );
    }

    /**
     * 按类型获取动画
     * @param type 动画类型
     * @returns 动画实例数组
     */
    getAnimationsByType(
        type: IAnimationInstanceState["type"],
    ): IAnimationInstanceState[] {
        return this.getAllAnimations().filter(
            (animation) => animation.type === type,
        );
    }

    /**
     * 获取性能指标
     * @returns 性能指标
     */
    getPerformanceMetrics(): IPerformanceMetrics {
        return { ...this.performanceMetrics };
    }

    /**
     * 获取动画统计信息
     * @returns 动画统计
     */
    getAnimationStats(): IAnimationStats {
        const animations = this.getAllAnimations();
        const activeAnimations = animations.filter(
            (a) => a.state === "playing",
        ).length;

        return {
            activeAnimations,
            totalAnimations: animations.length,
            averageFPS: this.performanceMetrics.averageFPS,
            memoryUsage: this.performanceMetrics.memoryUsage,
        };
    }

    /**
     * 获取事件历史
     * @param limit 限制数量
     * @returns 事件数组
     */
    getEventHistory(limit: number = 100): IAnimationEvent[] {
        return this.eventHistory.value.slice(-limit);
    }

    /**
     * 清理完成的动画
     */
    cleanupCompletedAnimations(): void {
        const completedAnimations = this.getAnimationsByState(
            AnimationState.COMPLETED,
        );
        completedAnimations.forEach((animation) => {
            // 保留最近完成的动画一段时间用于调试
            const timeSinceCompletion =
                performance.now() - (animation.endTime || 0);
            if (timeSinceCompletion > 5000) {
                // 5秒后清理
                this.unregisterAnimation(animation.id);
            }
        });
    }

    /**
     * 重置所有统计信息
     */
    reset(): void {
        this.animations.clear();
        this.eventHistory.value = [];
        this.fpsHistory = [];
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        this.updateAnimationCounts();
    }

    /**
     * 开始性能监控
     */
    startPerformanceMonitoring(): void {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.monitorFrame();

        // 定期更新内存使用情况
        this.monitoringInterval = window.setInterval(() => {
            this.updateMemoryUsage();
            this.cleanupCompletedAnimations();
        }, 1000);
    }

    /**
     * 停止性能监控
     */
    stopPerformanceMonitoring(): void {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = undefined;
        }
    }

    /**
     * 监控帧率
     * @private
     */
    private monitorFrame(): void {
        if (!this.isMonitoring) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime > 0) {
            const currentFPS = 1000 / deltaTime;
            this.performanceMetrics.currentFPS = Math.round(currentFPS);

            // 更新FPS历史
            this.fpsHistory.push(currentFPS);
            if (this.fpsHistory.length > 60) {
                // 保留最近60帧的数据
                this.fpsHistory.shift();
            }

            // 计算统计值
            this.performanceMetrics.averageFPS = Math.round(
                this.fpsHistory.reduce((sum, fps) => sum + fps, 0) /
                    this.fpsHistory.length,
            );
            this.performanceMetrics.minFPS = Math.round(
                Math.min(...this.fpsHistory),
            );
            this.performanceMetrics.maxFPS = Math.round(
                Math.max(...this.fpsHistory),
            );

            // 估算CPU使用率（基于帧率下降）
            const targetFPS = 60;
            const fpsRatio = this.performanceMetrics.averageFPS / targetFPS;
            this.performanceMetrics.cpuUsage = Math.round(
                (1 - Math.min(fpsRatio, 1)) * 100,
            );
        }

        this.lastFrameTime = currentTime;
        this.frameCount++;

        requestAnimationFrame(() => this.monitorFrame());
    }

    /**
     * 更新内存使用情况
     * @private
     */
    private updateMemoryUsage(): void {
        if ("memory" in performance) {
            const memory = (performance as any).memory;
            if (memory) {
                this.performanceMetrics.memoryUsage =
                    Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) /
                    100;
            }
        }
    }

    /**
     * 更新动画数量统计
     * @private
     */
    private updateAnimationCounts(): void {
        const animations = this.getAllAnimations();

        this.performanceMetrics.animationCounts = {
            total: animations.length,
            active: animations.filter((a) => a.state === "playing").length,
            paused: animations.filter((a) => a.state === "paused").length,
            completed: animations.filter((a) => a.state === "completed").length,
            failed: animations.filter((a) => a.error).length,
        };
    }

    /**
     * 添加事件到历史记录
     * @private
     */
    private addEvent(event: IAnimationEvent): void {
        this.eventHistory.value.push(event);

        // 限制事件历史记录数量
        if (this.eventHistory.value.length > 1000) {
            this.eventHistory.value = this.eventHistory.value.slice(-500);
        }
    }
}

// 创建全局状态跟踪器实例
export const globalAnimationStateTracker = new AnimationStateTracker({
    enableHardwareAcceleration: true,
    maxConcurrentAnimations: 50,
    quality: "high",
    enableAnimations: true,
    reduceMotion: false,
});

// 便捷方法
export const registerAnimation = (
    animation: Omit<IAnimationInstanceState, "startTime" | "progress">,
) => globalAnimationStateTracker.registerAnimation(animation);

export const updateAnimationState = (
    id: string,
    updates: Partial<IAnimationInstanceState>,
) => globalAnimationStateTracker.updateAnimation(id, updates);

export const unregisterAnimation = (id: string) =>
    globalAnimationStateTracker.unregisterAnimation(id);

export const getAnimationStats = () =>
    globalAnimationStateTracker.getAnimationStats();

export const getPerformanceMetrics = () =>
    globalAnimationStateTracker.getPerformanceMetrics();

// 响应式计算属性
export const useAnimationStats = () => {
    const stats = computed(() =>
        globalAnimationStateTracker.getAnimationStats(),
    );
    const metrics = computed(() =>
        globalAnimationStateTracker.getPerformanceMetrics(),
    );
    const activeAnimations = computed(() =>
        globalAnimationStateTracker.getAnimationsByState(
            AnimationState.PLAYING,
        ),
    );

    return {
        stats,
        metrics,
        activeAnimations,
    };
};
