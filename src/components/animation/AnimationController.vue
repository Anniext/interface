<template>
    <div class="animation-controller" :class="{ 'debug-mode': debugMode }">
        <!-- 调试面板 -->
        <div
            v-if="debugMode"
            class="debug-panel fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50">
            <h3 class="text-sm font-bold mb-2">动画控制器调试</h3>
            <div class="text-xs space-y-1">
                <div>活跃时间轴: {{ activeTimelines.length }}</div>
                <div>总动画数: {{ stats.totalAnimations }}</div>
                <div>平均帧率: {{ stats.averageFPS.toFixed(1) }}fps</div>
                <div>内存使用: {{ stats.memoryUsage.toFixed(1) }}MB</div>
            </div>
            <div class="mt-2 space-x-2">
                <button
                    @click="pauseAll"
                    class="px-2 py-1 bg-yellow-600 rounded text-xs">
                    暂停全部
                </button>
                <button
                    @click="resumeAll"
                    class="px-2 py-1 bg-green-600 rounded text-xs">
                    恢复全部
                </button>
                <button
                    @click="clearAll"
                    class="px-2 py-1 bg-red-600 rounded text-xs">
                    清理全部
                </button>
            </div>
        </div>

        <!-- 动画内容插槽 -->
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    reactive,
    onMounted,
    onBeforeUnmount,
    provide,
    computed,
} from "vue";
import { gsap } from "gsap";
import type {
    IAnimationManager,
    ITimeline,
    IAnimationStats,
} from "@/types/animation";
import { AnimationState } from "@/types/animation";

// 动态导入 ScrollTrigger 插件（避免测试环境问题）
let ScrollTrigger: any = null;
if (typeof window !== "undefined") {
    import("gsap/ScrollTrigger").then((module) => {
        ScrollTrigger = module.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
    });
}

interface Props {
    /** 是否启用调试模式 */
    debugMode?: boolean;
    /** 性能配置 */
    performanceConfig?: {
        maxConcurrentAnimations: number;
        enableHardwareAcceleration: boolean;
        quality: "low" | "medium" | "high";
    };
}

const props = withDefaults(defineProps<Props>(), {
    debugMode: false,
    performanceConfig: () => ({
        maxConcurrentAnimations: 50,
        enableHardwareAcceleration: true,
        quality: "high",
    }),
});

// 时间轴存储
const timelines = reactive(new Map<string, ITimeline>());
const gsapTimelines = reactive(new Map<string, gsap.core.Timeline>());

// 动画队列和优先级系统
const animationQueue = ref<
    Array<{ id: string; priority: number; callback: () => void }>
>([]);
const isProcessingQueue = ref(false);

// 性能统计
const stats = reactive<IAnimationStats>({
    activeAnimations: 0,
    totalAnimations: 0,
    averageFPS: 60,
    memoryUsage: 0,
});

// 计算属性
const activeTimelines = computed(() =>
    Array.from(timelines.values()).filter(
        (timeline) => timeline.state === AnimationState.PLAYING,
    ),
);

// 动画管理器实现
const animationManager: IAnimationManager = {
    createTimeline(id: string): ITimeline {
        // 检查是否超过最大并发数
        if (
            activeTimelines.value.length >=
            props.performanceConfig.maxConcurrentAnimations
        ) {
            console.warn(
                `已达到最大并发动画数量限制: ${props.performanceConfig.maxConcurrentAnimations}`,
            );
            return timelines.get(id) || createEmptyTimeline(id);
        }

        const gsapTimeline = gsap.timeline({
            paused: true,
            onStart: () => updateTimelineState(id, AnimationState.PLAYING),
            onComplete: () => updateTimelineState(id, AnimationState.COMPLETED),
            onUpdate: () => updateTimelineProgress(id),
        });

        const timeline: ITimeline = {
            id,
            animations: [],
            totalDuration: 0,
            state: AnimationState.IDLE,
            progress: 0,
        };

        timelines.set(id, timeline);
        gsapTimelines.set(id, gsapTimeline);
        stats.totalAnimations++;

        return timeline;
    },

    getTimeline(id: string): ITimeline | null {
        return timelines.get(id) || null;
    },

    play(timelineId: string): void {
        const gsapTimeline = gsapTimelines.get(timelineId);
        if (gsapTimeline) {
            gsapTimeline.play();
            stats.activeAnimations++;
        }
    },

    pause(timelineId: string): void {
        const gsapTimeline = gsapTimelines.get(timelineId);
        if (gsapTimeline) {
            gsapTimeline.pause();
            updateTimelineState(timelineId, AnimationState.PAUSED);
            stats.activeAnimations = Math.max(0, stats.activeAnimations - 1);
        }
    },

    stop(timelineId: string): void {
        const gsapTimeline = gsapTimelines.get(timelineId);
        if (gsapTimeline) {
            gsapTimeline.kill();
            updateTimelineState(timelineId, AnimationState.IDLE);
            stats.activeAnimations = Math.max(0, stats.activeAnimations - 1);
        }
    },

    reset(timelineId: string): void {
        const gsapTimeline = gsapTimelines.get(timelineId);
        if (gsapTimeline) {
            gsapTimeline.progress(0).pause();
            updateTimelineState(timelineId, AnimationState.IDLE);
            updateTimelineProgress(timelineId, 0);
        }
    },

    setProgress(timelineId: string, progress: number): void {
        const gsapTimeline = gsapTimelines.get(timelineId);
        if (gsapTimeline) {
            gsapTimeline.progress(Math.max(0, Math.min(1, progress)));
            updateTimelineProgress(timelineId, progress);
        }
    },

    clear(): void {
        gsapTimelines.forEach((timeline) => timeline.kill());
        timelines.clear();
        gsapTimelines.clear();
        animationQueue.value = [];
        stats.activeAnimations = 0;
        stats.totalAnimations = 0;
    },

    getStats(): IAnimationStats {
        return { ...stats };
    },
};

// 辅助函数
function createEmptyTimeline(id: string): ITimeline {
    return {
        id,
        animations: [],
        totalDuration: 0,
        state: AnimationState.IDLE,
        progress: 0,
    };
}

function updateTimelineState(id: string, state: AnimationState): void {
    const timeline = timelines.get(id);
    if (timeline) {
        timeline.state = state;
    }
}

function updateTimelineProgress(id: string, progress?: number): void {
    const timeline = timelines.get(id);
    const gsapTimeline = gsapTimelines.get(id);

    if (timeline && gsapTimeline) {
        timeline.progress =
            progress !== undefined ? progress : gsapTimeline.progress();
    }
}

// 动画队列处理
async function processAnimationQueue(): Promise<void> {
    if (isProcessingQueue.value || animationQueue.value.length === 0) {
        return;
    }

    isProcessingQueue.value = true;

    // 按优先级排序
    animationQueue.value.sort((a, b) => b.priority - a.priority);

    while (animationQueue.value.length > 0) {
        const animation = animationQueue.value.shift();
        if (animation) {
            try {
                animation.callback();
                // 添加小延迟以避免阻塞主线程
                await new Promise((resolve) => setTimeout(resolve, 0));
            } catch (error) {
                console.error(`动画执行错误 (ID: ${animation.id}):`, error);
            }
        }
    }

    isProcessingQueue.value = false;
}

// 添加动画到队列
function addToQueue(
    id: string,
    callback: () => void,
    priority: number = 0,
): void {
    animationQueue.value.push({ id, priority, callback });
    processAnimationQueue();
}

// 性能监控
function startPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    function updateStats() {
        const currentTime = performance.now();
        frameCount++;

        // 每秒更新一次统计信息
        if (currentTime - lastTime >= 1000) {
            stats.averageFPS = frameCount;
            frameCount = 0;
            lastTime = currentTime;

            // 估算内存使用（简化版本）
            if ("memory" in performance) {
                const memory = (performance as any).memory;
                if (memory) {
                    stats.memoryUsage = memory.usedJSHeapSize / 1024 / 1024;
                }
            }
        }

        requestAnimationFrame(updateStats);
    }

    requestAnimationFrame(updateStats);
}

// 控制方法
function pauseAll(): void {
    gsapTimelines.forEach((timeline, id) => {
        animationManager.pause(id);
    });
}

function resumeAll(): void {
    timelines.forEach((timeline, id) => {
        if (timeline.state === AnimationState.PAUSED) {
            animationManager.play(id);
        }
    });
}

function clearAll(): void {
    animationManager.clear();
}

// 生命周期
onMounted(() => {
    // 配置 GSAP 性能设置
    if (props.performanceConfig.enableHardwareAcceleration) {
        gsap.config({ force3D: true });
    }

    // 根据质量设置调整 GSAP 配置
    switch (props.performanceConfig.quality) {
        case "low":
            gsap.config({ autoSleep: 60 });
            break;
        case "medium":
            gsap.config({ autoSleep: 120 });
            break;
        case "high":
            gsap.config({ autoSleep: 0 });
            break;
    }

    // 启动性能监控
    if (props.debugMode) {
        startPerformanceMonitoring();
    }

    // 刷新 ScrollTrigger 以确保正确计算
    if (ScrollTrigger) {
        ScrollTrigger.refresh();
    }
});

onBeforeUnmount(() => {
    // 清理所有动画
    animationManager.clear();
    // 清理所有 ScrollTrigger 实例
    if (ScrollTrigger) {
        ScrollTrigger.killAll();
    }
});

// 提供动画管理器给子组件
provide("animationManager", animationManager);
provide("addToQueue", addToQueue);

// 暴露给父组件的方法
defineExpose({
    animationManager,
    addToQueue,
    pauseAll,
    resumeAll,
    clearAll,
    stats: computed(() => stats),
});
</script>

<style scoped>
.animation-controller {
    position: relative;
    width: 100%;
    height: 100%;
}

.debug-panel {
    font-family: "JetBrains Mono", monospace;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.debug-panel button {
    transition: all 0.2s ease;
}

.debug-panel button:hover {
    transform: scale(1.05);
}
</style>
