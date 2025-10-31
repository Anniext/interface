// 全局动画时间轴管理器
import { gsap } from "gsap";
import type {
    ITimeline,
    IAnimationTarget,
    IAnimationConfig,
    IAnimationEvent,
} from "@/types/animation";
import { AnimationState } from "@/types/animation";

/** 时间轴管理器类 */
export class TimelineManager {
    private timelines = new Map<string, ITimeline>();
    private gsapTimelines = new Map<string, gsap.core.Timeline>();
    private eventListeners = new Map<
        string,
        Array<(event: IAnimationEvent) => void>
    >();
    private globalConfig: Partial<IAnimationConfig>;

    constructor(globalConfig: Partial<IAnimationConfig> = {}) {
        this.globalConfig = {
            duration: 0.3,
            ease: "power2.out",
            delay: 0,
            ...globalConfig,
        };
    }

    /**
     * 创建新的时间轴
     * @param id 时间轴唯一标识
     * @param config 时间轴配置
     * @returns 时间轴对象
     */
    createTimeline(
        id: string,
        config: Partial<IAnimationConfig> = {},
    ): ITimeline {
        if (this.timelines.has(id)) {
            console.warn(`时间轴 "${id}" 已存在，将返回现有时间轴`);
            return this.timelines.get(id)!;
        }

        const mergedConfig = { ...this.globalConfig, ...config };

        const gsapTimeline = gsap.timeline({
            paused: true,
            delay: mergedConfig.delay,
            repeat: mergedConfig.repeat || 0,
            yoyo: mergedConfig.yoyo || false,
            onStart: () => this.emitEvent(id, "start"),
            onUpdate: () => this.emitEvent(id, "update"),
            onComplete: () => this.emitEvent(id, "complete"),
            onReverseComplete: () => this.emitEvent(id, "reverse"),
        });

        const timeline: ITimeline = {
            id,
            animations: [],
            totalDuration: 0,
            state: AnimationState.IDLE,
            progress: 0,
        };

        this.timelines.set(id, timeline);
        this.gsapTimelines.set(id, gsapTimeline);

        return timeline;
    }

    /**
     * 获取时间轴
     * @param id 时间轴ID
     * @returns 时间轴对象或null
     */
    getTimeline(id: string): ITimeline | null {
        return this.timelines.get(id) || null;
    }

    /**
     * 获取GSAP时间轴
     * @param id 时间轴ID
     * @returns GSAP时间轴对象或null
     */
    getGSAPTimeline(id: string): gsap.core.Timeline | null {
        return this.gsapTimelines.get(id) || null;
    }

    /**
     * 向时间轴添加动画
     * @param timelineId 时间轴ID
     * @param target 动画目标
     * @param properties 动画属性
     * @param config 动画配置
     * @param position 插入位置
     */
    addAnimation(
        timelineId: string,
        target: HTMLElement | string,
        properties: Record<string, any>,
        config: Partial<IAnimationConfig> = {},
        position?: string | number,
    ): void {
        const timeline = this.timelines.get(timelineId);
        const gsapTimeline = this.gsapTimelines.get(timelineId);

        if (!timeline || !gsapTimeline) {
            console.error(`时间轴 "${timelineId}" 不存在`);
            return;
        }

        const mergedConfig = { ...this.globalConfig, ...config };

        // 创建动画目标对象
        const animationTarget: IAnimationTarget = {
            target,
            properties,
            config: mergedConfig as IAnimationConfig,
        };

        // 添加到时间轴
        timeline.animations.push(animationTarget);

        // 添加到GSAP时间轴
        gsapTimeline.to(
            target,
            {
                ...properties,
                duration: mergedConfig.duration,
                ease: mergedConfig.ease,
                delay: mergedConfig.delay,
                stagger: mergedConfig.stagger,
            },
            position,
        );

        // 更新总持续时间
        timeline.totalDuration = gsapTimeline.totalDuration();
    }

    /**
     * 向时间轴添加From动画
     */
    addFromAnimation(
        timelineId: string,
        target: HTMLElement | string,
        properties: Record<string, any>,
        config: Partial<IAnimationConfig> = {},
        position?: string | number,
    ): void {
        const gsapTimeline = this.gsapTimelines.get(timelineId);
        if (!gsapTimeline) {
            console.error(`时间轴 "${timelineId}" 不存在`);
            return;
        }

        const mergedConfig = { ...this.globalConfig, ...config };

        gsapTimeline.from(
            target,
            {
                ...properties,
                duration: mergedConfig.duration,
                ease: mergedConfig.ease,
                delay: mergedConfig.delay,
                stagger: mergedConfig.stagger,
            },
            position,
        );

        this.updateTimelineDuration(timelineId);
    }

    /**
     * 向时间轴添加FromTo动画
     */
    addFromToAnimation(
        timelineId: string,
        target: HTMLElement | string,
        fromProperties: Record<string, any>,
        toProperties: Record<string, any>,
        config: Partial<IAnimationConfig> = {},
        position?: string | number,
    ): void {
        const gsapTimeline = this.gsapTimelines.get(timelineId);
        if (!gsapTimeline) {
            console.error(`时间轴 "${timelineId}" 不存在`);
            return;
        }

        const mergedConfig = { ...this.globalConfig, ...config };

        gsapTimeline.fromTo(
            target,
            fromProperties,
            {
                ...toProperties,
                duration: mergedConfig.duration,
                ease: mergedConfig.ease,
                delay: mergedConfig.delay,
                stagger: mergedConfig.stagger,
            },
            position,
        );

        this.updateTimelineDuration(timelineId);
    }

    /**
     * 添加标签到时间轴
     * @param timelineId 时间轴ID
     * @param label 标签名称
     * @param position 标签位置
     */
    addLabel(
        timelineId: string,
        label: string,
        position?: string | number,
    ): void {
        const gsapTimeline = this.gsapTimelines.get(timelineId);
        if (gsapTimeline) {
            gsapTimeline.addLabel(label, position);
        }
    }

    /**
     * 播放时间轴
     * @param id 时间轴ID
     * @param from 开始位置
     */
    play(id: string, from?: string | number): void {
        const timeline = this.timelines.get(id);
        const gsapTimeline = this.gsapTimelines.get(id);

        if (timeline && gsapTimeline) {
            timeline.state = AnimationState.PLAYING;
            gsapTimeline.play(from);
        }
    }

    /**
     * 暂停时间轴
     * @param id 时间轴ID
     */
    pause(id: string): void {
        const timeline = this.timelines.get(id);
        const gsapTimeline = this.gsapTimelines.get(id);

        if (timeline && gsapTimeline) {
            timeline.state = AnimationState.PAUSED;
            gsapTimeline.pause();
        }
    }

    /**
     * 停止时间轴
     * @param id 时间轴ID
     */
    stop(id: string): void {
        const timeline = this.timelines.get(id);
        const gsapTimeline = this.gsapTimelines.get(id);

        if (timeline && gsapTimeline) {
            timeline.state = AnimationState.IDLE;
            timeline.progress = 0;
            gsapTimeline.progress(0).pause();
        }
    }

    /**
     * 重置时间轴
     * @param id 时间轴ID
     */
    reset(id: string): void {
        this.stop(id);
    }

    /**
     * 反向播放时间轴
     * @param id 时间轴ID
     */
    reverse(id: string): void {
        const gsapTimeline = this.gsapTimelines.get(id);
        if (gsapTimeline) {
            gsapTimeline.reverse();
        }
    }

    /**
     * 设置时间轴进度
     * @param id 时间轴ID
     * @param progress 进度值 (0-1)
     */
    setProgress(id: string, progress: number): void {
        const timeline = this.timelines.get(id);
        const gsapTimeline = this.gsapTimelines.get(id);

        if (timeline && gsapTimeline) {
            const clampedProgress = Math.max(0, Math.min(1, progress));
            timeline.progress = clampedProgress;
            gsapTimeline.progress(clampedProgress);
        }
    }

    /**
     * 获取时间轴进度
     * @param id 时间轴ID
     * @returns 进度值 (0-1)
     */
    getProgress(id: string): number {
        const timeline = this.timelines.get(id);
        return timeline?.progress || 0;
    }

    /**
     * 跳转到指定标签
     * @param id 时间轴ID
     * @param label 标签名称
     */
    seek(id: string, label: string): void {
        const gsapTimeline = this.gsapTimelines.get(id);
        if (gsapTimeline) {
            gsapTimeline.seek(label);
            this.updateTimelineProgress(id);
        }
    }

    /**
     * 删除时间轴
     * @param id 时间轴ID
     */
    removeTimeline(id: string): void {
        const gsapTimeline = this.gsapTimelines.get(id);
        if (gsapTimeline) {
            gsapTimeline.kill();
        }

        this.timelines.delete(id);
        this.gsapTimelines.delete(id);
        this.eventListeners.delete(id);
    }

    /**
     * 清理所有时间轴
     */
    clear(): void {
        this.gsapTimelines.forEach((timeline) => timeline.kill());
        this.timelines.clear();
        this.gsapTimelines.clear();
        this.eventListeners.clear();
    }

    /**
     * 获取所有时间轴ID
     * @returns 时间轴ID数组
     */
    getTimelineIds(): string[] {
        return Array.from(this.timelines.keys());
    }

    /**
     * 获取活跃的时间轴
     * @returns 活跃时间轴数组
     */
    getActiveTimelines(): ITimeline[] {
        return Array.from(this.timelines.values()).filter(
            (timeline) => timeline.state === "playing",
        );
    }

    /**
     * 添加事件监听器
     * @param timelineId 时间轴ID
     * @param callback 回调函数
     */
    addEventListener(
        timelineId: string,
        callback: (event: IAnimationEvent) => void,
    ): void {
        if (!this.eventListeners.has(timelineId)) {
            this.eventListeners.set(timelineId, []);
        }
        this.eventListeners.get(timelineId)!.push(callback);
    }

    /**
     * 移除事件监听器
     * @param timelineId 时间轴ID
     * @param callback 回调函数
     */
    removeEventListener(
        timelineId: string,
        callback: (event: IAnimationEvent) => void,
    ): void {
        const listeners = this.eventListeners.get(timelineId);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * 发射事件
     * @private
     */
    private emitEvent(timelineId: string, type: IAnimationEvent["type"]): void {
        const timeline = this.timelines.get(timelineId);
        const listeners = this.eventListeners.get(timelineId);

        if (timeline && listeners && timeline.animations.length > 0) {
            const event: IAnimationEvent = {
                type,
                target: timeline.animations[0]!, // 使用第一个动画目标（已检查长度）
                progress: this.getProgress(timelineId),
                timestamp: performance.now(),
            };

            listeners.forEach((callback) => {
                try {
                    callback(event);
                } catch (error) {
                    console.error(`时间轴事件处理错误 (${timelineId}):`, error);
                }
            });
        }

        // 更新时间轴状态
        this.updateTimelineProgress(timelineId);
    }

    /**
     * 更新时间轴进度
     * @private
     */
    private updateTimelineProgress(id: string): void {
        const timeline = this.timelines.get(id);
        const gsapTimeline = this.gsapTimelines.get(id);

        if (timeline && gsapTimeline) {
            timeline.progress = gsapTimeline.progress();
        }
    }

    /**
     * 更新时间轴持续时间
     * @private
     */
    private updateTimelineDuration(id: string): void {
        const timeline = this.timelines.get(id);
        const gsapTimeline = this.gsapTimelines.get(id);

        if (timeline && gsapTimeline) {
            timeline.totalDuration = gsapTimeline.totalDuration();
        }
    }
}

// 创建全局时间轴管理器实例
export const globalTimelineManager = new TimelineManager({
    duration: 0.3,
    ease: "power2.out",
    delay: 0,
});

// 导出便捷方法
export const createTimeline = (
    id: string,
    config?: Partial<IAnimationConfig>,
) => globalTimelineManager.createTimeline(id, config);

export const getTimeline = (id: string) =>
    globalTimelineManager.getTimeline(id);

export const playTimeline = (id: string, from?: string | number) =>
    globalTimelineManager.play(id, from);

export const pauseTimeline = (id: string) => globalTimelineManager.pause(id);

export const stopTimeline = (id: string) => globalTimelineManager.stop(id);
