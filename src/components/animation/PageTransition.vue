<template>
    <div class="page-transition-container">
        <!-- 页面过渡遮罩 -->
        <div
            ref="transitionOverlay"
            class="transition-overlay fixed inset-0 z-50 pointer-events-none"
            :class="{ active: isTransitioning }">
            <!-- 加载进度指示器 -->
            <div
                ref="progressContainer"
                class="progress-container absolute inset-0 flex items-center justify-center">
                <div class="progress-wrapper">
                    <!-- 圆形进度条 -->
                    <div class="circular-progress relative w-24 h-24">
                        <svg
                            class="w-full h-full transform -rotate-90"
                            viewBox="0 0 100 100">
                            <!-- 背景圆环 -->
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.1)"
                                stroke-width="8" />
                            <!-- 进度圆环 -->
                            <circle
                                ref="progressCircle"
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#3b82f6"
                                stroke-width="8"
                                stroke-linecap="round"
                                :stroke-dasharray="circumference"
                                :stroke-dashoffset="progressOffset"
                                class="transition-all duration-300 ease-out" />
                        </svg>
                        <!-- 进度文字 -->
                        <div
                            class="absolute inset-0 flex items-center justify-center">
                            <span
                                ref="progressText"
                                class="text-white font-bold text-lg">
                                {{ Math.round(progress) }}%
                            </span>
                        </div>
                    </div>

                    <!-- 加载文字 -->
                    <div
                        ref="loadingText"
                        class="loading-text mt-6 text-center">
                        <div class="text-white text-xl font-semibold mb-2">
                            {{ loadingMessage }}
                        </div>
                        <div class="text-gray-300 text-sm">
                            {{ loadingSubMessage }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 页面内容插槽 -->
        <div
            ref="pageContent"
            class="page-content"
            :class="{ transitioning: isTransitioning }">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, inject, watch } from "vue";
import { useRoute } from "vue-router";
import { gsap } from "gsap";
import type { IAnimationManager } from "@/types/animation";

interface Props {
    /** 过渡动画类型 */
    transitionType?: "slide" | "fade" | "geometric" | "liquid";
    /** 过渡持续时间（秒） */
    duration?: number;
    /** 是否显示加载进度 */
    showProgress?: boolean;
    /** 自定义加载消息 */
    customLoadingMessages?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    transitionType: "geometric",
    duration: 1.2,
    showProgress: true,
    customLoadingMessages: () => [
        "正在加载页面...",
        "准备精彩内容...",
        "即将为您呈现...",
    ],
});

// 响应式数据
const isTransitioning = ref(false);
const progress = ref(0);
const loadingMessage = ref("正在加载...");
const loadingSubMessage = ref("请稍候");

// DOM 引用
const transitionOverlay = ref<HTMLElement>();
const progressContainer = ref<HTMLElement>();
const progressCircle = ref<SVGCircleElement>();
const progressText = ref<HTMLElement>();
const loadingText = ref<HTMLElement>();
const pageContent = ref<HTMLElement>();

// 路由相关
const route = useRoute();

// 注入动画管理器
const animationManager = inject<IAnimationManager>("animationManager");

// 计算属性
const circumference = computed(() => 2 * Math.PI * 45);
const progressOffset = computed(
    () => circumference.value - (progress.value / 100) * circumference.value,
);

// 加载消息配置
const loadingMessages = [
    { main: "正在加载页面...", sub: "准备精彩内容" },
    { main: "渲染动画效果...", sub: "优化用户体验" },
    { main: "初始化组件...", sub: "即将为您呈现" },
    { main: "加载完成!", sub: "欢迎使用" },
];

/**
 * 页面进入动画
 */
async function pageEnterAnimation(): Promise<void> {
    const tl = gsap.timeline();

    // 1. 显示过渡遮罩
    if (transitionOverlay.value) {
        tl.set(transitionOverlay.value, {
            opacity: 1,
            pointerEvents: "all",
        });
    }

    // 2. 进度条动画
    if (props.showProgress && progressContainer.value) {
        tl.fromTo(
            progressContainer.value,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
            },
            0.3,
        );

        // 模拟加载进度
        await simulateLoadingProgress();
    }

    // 3. 页面内容淡入
    if (pageContent.value) {
        tl.fromTo(
            pageContent.value,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            },
            "-=0.3",
        );
    }
}

/**
 * 页面退出动画
 */
async function pageExitAnimation(): Promise<void> {
    const tl = gsap.timeline();

    // 1. 页面内容淡出
    if (pageContent.value) {
        tl.to(pageContent.value, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: "power2.in",
        });
    }

    // 2. 隐藏过渡遮罩
    if (transitionOverlay.value) {
        tl.to(
            transitionOverlay.value,
            {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    if (transitionOverlay.value) {
                        transitionOverlay.value.style.pointerEvents = "none";
                    }
                },
            },
            "-=0.1",
        );
    }

    // 等待动画完成
    return new Promise((resolve) => {
        tl.eventCallback("onComplete", resolve);
    });
}

/**
 * 模拟加载进度
 */
async function simulateLoadingProgress(): Promise<void> {
    return new Promise((resolve) => {
        let currentProgress = 0;
        let messageIndex = 0;

        const progressInterval = setInterval(() => {
            // 更新进度
            const increment = Math.random() * 15 + 5; // 5-20% 随机增量
            currentProgress = Math.min(100, currentProgress + increment);
            progress.value = currentProgress;

            // 更新加载消息
            const newMessageIndex = Math.floor(
                (currentProgress / 100) * loadingMessages.length,
            );
            if (
                newMessageIndex !== messageIndex &&
                newMessageIndex < loadingMessages.length
            ) {
                messageIndex = newMessageIndex;
                loadingMessage.value =
                    loadingMessages[messageIndex]?.main || "正在加载...";
                loadingSubMessage.value =
                    loadingMessages[messageIndex]?.sub || "请稍候";

                // 文字动画
                if (loadingText.value) {
                    gsap.fromTo(
                        loadingText.value,
                        { opacity: 0.7, y: 5 },
                        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
                    );
                }
            }

            // 进度完成
            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                setTimeout(resolve, 500); // 额外延迟确保用户看到100%
            }
        }, 100);
    });
}

/**
 * 开始页面过渡
 */
async function startTransition(): Promise<void> {
    isTransitioning.value = true;
    progress.value = 0;

    // 执行进入动画
    await pageEnterAnimation();

    // 过渡完成后隐藏遮罩
    setTimeout(() => {
        isTransitioning.value = false;
        if (transitionOverlay.value) {
            transitionOverlay.value.style.opacity = "0";
            transitionOverlay.value.style.pointerEvents = "none";
        }
    }, 300);
}

/**
 * 结束页面过渡
 */
async function endTransition(): Promise<void> {
    await pageExitAnimation();
}

// 监听路由变化
watch(
    () => route.path,
    async (newPath, oldPath) => {
        if (oldPath && newPath !== oldPath) {
            await startTransition();
        }
    },
);

// 生命周期
onMounted(() => {
    // 页面首次加载时执行进入动画
    startTransition();
});

onBeforeUnmount(() => {
    if (animationManager) {
        animationManager.clear();
    }
});

// 暴露方法给父组件
defineExpose({
    startTransition,
    endTransition,
    isTransitioning: computed(() => isTransitioning.value),
    progress: computed(() => progress.value),
});
</script>

<style scoped>
.page-transition-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.transition-overlay {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.transition-overlay.active {
    opacity: 1;
    pointer-events: all;
}

.progress-container {
    backdrop-filter: blur(10px);
}

.progress-wrapper {
    text-align: center;
}

.circular-progress {
    filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3));
}

.loading-text {
    opacity: 0.9;
}

.page-content {
    transition:
        opacity 0.3s ease,
        transform 0.3s ease;
}

.page-content.transitioning {
    opacity: 0.7;
    pointer-events: none;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .circular-progress {
        width: 80px;
        height: 80px;
    }

    .loading-text .text-xl {
        font-size: 18px;
    }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
    .page-content,
    .transition-overlay {
        transition: none;
    }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
    .transition-overlay {
        background: #000;
    }
}
</style>
