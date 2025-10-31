// 动画队列和优先级系统
import type { IAnimationConfig } from "@/types/animation";

/** 动画队列项接口 */
export interface IAnimationQueueItem {
    /** 唯一标识 */
    id: string;
    /** 优先级 (数值越大优先级越高) */
    priority: number;
    /** 动画执行函数 */
    execute: () => Promise<void> | void;
    /** 动画配置 */
    config?: Partial<IAnimationConfig>;
    /** 创建时间戳 */
    timestamp: number;
    /** 是否可以被中断 */
    interruptible: boolean;
    /** 分组标识 */
    group?: string;
}

/** 动画优先级枚举 */
export enum AnimationPriority {
    /** 低优先级 - 装饰性动画 */
    LOW = 1,
    /** 普通优先级 - 常规动画 */
    NORMAL = 5,
    /** 高优先级 - 用户交互动画 */
    HIGH = 10,
    /** 紧急优先级 - 关键动画 */
    URGENT = 20,
    /** 系统优先级 - 系统级动画 */
    SYSTEM = 50,
}

/** 动画队列管理器 */
export class AnimationQueue {
    private queue: IAnimationQueueItem[] = [];
    private isProcessing = false;
    private maxConcurrentAnimations: number;
    private currentlyRunning = new Set<string>();
    private groupLimits = new Map<string, number>();
    private groupCounts = new Map<string, number>();

    constructor(maxConcurrentAnimations: number = 10) {
        this.maxConcurrentAnimations = maxConcurrentAnimations;
    }

    /**
     * 添加动画到队列
     * @param item 动画队列项
     */
    add(item: Omit<IAnimationQueueItem, "timestamp">): void {
        const queueItem: IAnimationQueueItem = {
            ...item,
            timestamp: performance.now(),
        };

        // 检查是否已存在相同ID的动画
        const existingIndex = this.queue.findIndex(
            (existing) => existing.id === item.id,
        );
        if (existingIndex !== -1) {
            // 如果新动画优先级更高，替换现有动画
            if (item.priority > this.queue[existingIndex].priority) {
                this.queue[existingIndex] = queueItem;
            }
            return;
        }

        // 添加到队列并排序
        this.queue.push(queueItem);
        this.sortQueue();

        // 尝试处理队列
        this.processQueue();
    }

    /**
     * 添加动画组到队列
     * @param items 动画队列项数组
     * @param groupId 组标识
     */
    addGroup(
        items: Omit<IAnimationQueueItem, "timestamp" | "group">[],
        groupId: string,
    ): void {
        const timestamp = performance.now();

        items.forEach((item, index) => {
            const queueItem: IAnimationQueueItem = {
                ...item,
                id: `${groupId}_${item.id}`,
                group: groupId,
                timestamp: timestamp + index, // 确保组内顺序
            };

            this.queue.push(queueItem);
        });

        this.sortQueue();
        this.processQueue();
    }

    /**
     * 移除队列中的动画
     * @param id 动画ID
     */
    remove(id: string): boolean {
        const index = this.queue.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.queue.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * 移除指定组的所有动画
     * @param groupId 组标识
     */
    removeGroup(groupId: string): number {
        const initialLength = this.queue.length;
        this.queue = this.queue.filter((item) => item.group !== groupId);
        return initialLength - this.queue.length;
    }

    /**
     * 中断正在运行的动画
     * @param id 动画ID
     */
    interrupt(id: string): boolean {
        if (this.currentlyRunning.has(id)) {
            // 这里应该调用具体的动画中断逻辑
            // 由于GSAP动画的中断需要具体的timeline引用，这里只是标记
            this.currentlyRunning.delete(id);
            return true;
        }
        return false;
    }

    /**
     * 中断指定组的所有动画
     * @param groupId 组标识
     */
    interruptGroup(groupId: string): number {
        let interruptedCount = 0;

        // 中断队列中的动画
        this.queue = this.queue.filter((item) => {
            if (item.group === groupId && item.interruptible) {
                interruptedCount++;
                return false;
            }
            return true;
        });

        // 中断正在运行的动画
        Array.from(this.currentlyRunning).forEach((id) => {
            if (id.startsWith(`${groupId}_`)) {
                this.interrupt(id);
                interruptedCount++;
            }
        });

        return interruptedCount;
    }

    /**
     * 设置组的并发限制
     * @param groupId 组标识
     * @param limit 并发限制数量
     */
    setGroupLimit(groupId: string, limit: number): void {
        this.groupLimits.set(groupId, limit);
    }

    /**
     * 清空队列
     */
    clear(): void {
        this.queue = [];
        this.currentlyRunning.clear();
        this.groupCounts.clear();
    }

    /**
     * 暂停队列处理
     */
    pause(): void {
        this.isProcessing = false;
    }

    /**
     * 恢复队列处理
     */
    resume(): void {
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    /**
     * 获取队列状态
     */
    getStatus() {
        return {
            queueLength: this.queue.length,
            currentlyRunning: this.currentlyRunning.size,
            maxConcurrent: this.maxConcurrentAnimations,
            isProcessing: this.isProcessing,
            groups: Array.from(this.groupCounts.entries()).map(
                ([group, count]) => ({
                    group,
                    count,
                    limit: this.groupLimits.get(group) || Infinity,
                }),
            ),
        };
    }

    /**
     * 获取队列中的动画列表
     */
    getQueueItems(): IAnimationQueueItem[] {
        return [...this.queue];
    }

    /**
     * 处理队列
     * @private
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (
            this.queue.length > 0 &&
            this.currentlyRunning.size < this.maxConcurrentAnimations
        ) {
            const item = this.queue.shift();
            if (!item) break;

            // 检查组并发限制
            if (item.group) {
                const groupLimit = this.groupLimits.get(item.group) || Infinity;
                const groupCount = this.groupCounts.get(item.group) || 0;

                if (groupCount >= groupLimit) {
                    // 将动画放回队列前端
                    this.queue.unshift(item);
                    break;
                }
            }

            // 执行动画
            this.executeAnimation(item);
        }

        this.isProcessing = false;

        // 如果还有动画在队列中，继续处理
        if (
            this.queue.length > 0 &&
            this.currentlyRunning.size < this.maxConcurrentAnimations
        ) {
            // 使用 setTimeout 避免递归调用栈过深
            setTimeout(() => this.processQueue(), 0);
        }
    }

    /**
     * 执行单个动画
     * @private
     */
    private async executeAnimation(item: IAnimationQueueItem): Promise<void> {
        this.currentlyRunning.add(item.id);

        // 更新组计数
        if (item.group) {
            const currentCount = this.groupCounts.get(item.group) || 0;
            this.groupCounts.set(item.group, currentCount + 1);
        }

        try {
            await item.execute();
        } catch (error) {
            console.error(`动画执行失败 (ID: ${item.id}):`, error);
        } finally {
            // 清理
            this.currentlyRunning.delete(item.id);

            if (item.group) {
                const currentCount = this.groupCounts.get(item.group) || 0;
                this.groupCounts.set(item.group, Math.max(0, currentCount - 1));
            }

            // 继续处理队列
            this.processQueue();
        }
    }

    /**
     * 队列排序
     * @private
     */
    private sortQueue(): void {
        this.queue.sort((a, b) => {
            // 首先按优先级排序（高优先级在前）
            if (a.priority !== b.priority) {
                return b.priority - a.priority;
            }

            // 优先级相同时按时间戳排序（早创建的在前）
            return a.timestamp - b.timestamp;
        });
    }
}

// 创建全局动画队列实例
export const globalAnimationQueue = new AnimationQueue(10);

// 便捷方法
export const addAnimation = (
    id: string,
    execute: () => Promise<void> | void,
    priority: AnimationPriority = AnimationPriority.NORMAL,
    options: Partial<
        Pick<IAnimationQueueItem, "interruptible" | "group" | "config">
    > = {},
) => {
    globalAnimationQueue.add({
        id,
        execute,
        priority,
        interruptible: true,
        ...options,
    });
};

export const addAnimationGroup = (
    items: Array<{
        id: string;
        execute: () => Promise<void> | void;
        priority?: AnimationPriority;
        interruptible?: boolean;
        config?: Partial<IAnimationConfig>;
    }>,
    groupId: string,
) => {
    const queueItems = items.map((item) => ({
        ...item,
        priority: item.priority || AnimationPriority.NORMAL,
        interruptible: item.interruptible !== false,
    }));

    globalAnimationQueue.addGroup(queueItems, groupId);
};

export const removeAnimation = (id: string) => globalAnimationQueue.remove(id);
export const removeAnimationGroup = (groupId: string) =>
    globalAnimationQueue.removeGroup(groupId);
export const interruptAnimation = (id: string) =>
    globalAnimationQueue.interrupt(id);
export const interruptAnimationGroup = (groupId: string) =>
    globalAnimationQueue.interruptGroup(groupId);
export const clearAnimationQueue = () => globalAnimationQueue.clear();
export const pauseAnimationQueue = () => globalAnimationQueue.pause();
export const resumeAnimationQueue = () => globalAnimationQueue.resume();
export const getAnimationQueueStatus = () => globalAnimationQueue.getStatus();
