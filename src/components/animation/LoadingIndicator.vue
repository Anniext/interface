<template>
    <div
        class="loading-indicator"
        :class="{ active: isVisible, [variant]: true }"
        :style="{ zIndex: zIndex }">
        <!-- 背景遮罩 -->
        <div
            v-if="showOverlay"
            class="loading-overlay"
            :style="{ backgroundColor: overlayColor }" />

        <!-- 加载内容容器 -->
        <div class="loading-content">
            <!-- 圆形进度指示器 -->
            <div
                v-if="type === 'circular'"
                class="circular-loader"
                :style="{ width: size + 'px', height: size + 'px' }">
                <svg
                    class="circular-svg"
                    :width="size"
                    :height="size"
                    viewBox="0 0 100 100">
                    <!-- 背景圆环 -->
                    <circle
                        cx="50"
                        cy="50"
                        :r="radius"
                        fill="none"
                        :stroke="backgroundColor"
                        :stroke-width="strokeWidth"
                        class="background-circle" />
                    <!-- 进度圆环 -->
                    <circle
                        ref="progressCircle"
                        cx="50"
                        cy="50"
                        :r="radius"
                        fill="none"
                        :stroke="progressColor"
                        :stroke-width="strokeWidth"
                        stroke-linecap="round"
                        :stroke-dasharray="circumference"
                        :stroke-dashoffset="progressOffset"
                        class="progress-circle"
                        :class="{ animated: animated }" />
                </svg>

                <!-- 中心内容 -->
                <div class="circular-center">
                    <div
                        v-if="showPercentage"
                        class="percentage-text"
                        :style="{ fontSize: percentageSize + 'px' }">
                        {{ Math.round(progress) }}%
                    </div>
                </div>
            </div>

            <!-- 线性进度指示器 -->
            <div
                v-else-if="type === 'linear'"
                class="linear-loader"
                :style="{ width: width + 'px', height: height + 'px' }">
                <div
                    class="linear-track"
                    :style="{ backgroundColor: backgroundColor }">
                    <div
                        ref="progressBar"
                        class="linear-progress"
                        :class="{ animated: animated }"
                        :style="{
                            width: progress + '%',
                            backgroundColor: progressColor,
                        }" />
                </div>
            </div>

            <!-- 点状加载器 -->
            <div v-else-if="type === 'dots'" class="dots-loader">
                <div
                    v-for="(dot, index) in dotCount"
                    :key="index"
                    class="dot"
                    :class="{ active: activeDot === index }"
                    :style="{
                        backgroundColor: progressColor,
                        animationDelay: index * 0.2 + 's',
                    }" />
            </div>

            <!-- 几何图形加载器 -->
            <div v-else-if="type === 'geometric'" class="geometric-loader">
                <div
                    v-for="(shape, index) in geometricShapes"
                    :key="index"
                    class="geometric-shape"
                    :class="shape.type"
                    :style="{
                        backgroundColor: shape.color,
                        animationDelay: index * 0.1 + 's',
                        width: shape.size + 'px',
                        height: shape.size + 'px',
                    }" />
            </div>

            <!-- 加载文本 -->
            <div
                v-if="showText"
                class="loading-text"
                :style="{ marginTop: textMargin + 'px' }">
                <div
                    class="main-text"
                    :style="{ fontSize: textSize + 'px', color: textColor }">
                    {{ currentMessage }}
                </div>
                <div
                    v-if="subMessage"
                    class="sub-text"
                    :style="{
                        fontSize: subTextSize + 'px',
                        color: subTextColor,
                    }">
                    {{ subMessage }}
                </div>
            </div>

            <!-- 自定义插槽内容 -->
            <div v-if="$slots.default" class="custom-content">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
} from "vue";
import { gsap } from "gsap";

interface Props {
    /** 是否显示加载器 */
    isVisible?: boolean;
    /** 加载器类型 */
    type?: "circular" | "linear" | "dots" | "geometric";
    /** 当前进度 (0-100) */
    progress?: number;
    /** 是否显示遮罩层 */
    showOverlay?: boolean;
    /** 遮罩层颜色 */
    overlayColor?: string;
    /** 加载器尺寸 */
    size?: number;
    /** 线性加载器宽度 */
    width?: number;
    /** 线性加载器高度 */
    height?: number;
    /** 进度颜色 */
    progressColor?: string;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 是否显示百分比 */
    showPercentage?: boolean;
    /** 百分比文字大小 */
    percentageSize?: number;
    /** 是否显示文本 */
    showText?: boolean;
    /** 主要文本 */
    message?: string;
    /** 副文本 */
    subMessage?: string;
    /** 文本颜色 */
    textColor?: string;
    /** 副文本颜色 */
    subTextColor?: string;
    /** 文本大小 */
    textSize?: number;
    /** 副文本大小 */
    subTextSize?: number;
    /** 文本边距 */
    textMargin?: number;
    /** 是否启用动画 */
    animated?: boolean;
    /** 变体样式 */
    variant?: "default" | "minimal" | "gaming" | "elegant";
    /** 层级 */
    zIndex?: number;
    /** 自定义消息列表 */
    messages?: string[];
    /** 消息切换间隔（毫秒） */
    messageInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
    isVisible: false,
    type: "circular",
    progress: 0,
    showOverlay: true,
    overlayColor: "rgba(15, 23, 42, 0.8)",
    size: 80,
    width: 300,
    height: 8,
    progressColor: "#3b82f6",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    showPercentage: true,
    percentageSize: 16,
    showText: true,
    message: "正在加载...",
    subMessage: "",
    textColor: "#ffffff",
    subTextColor: "#cbd5e1",
    textSize: 18,
    subTextSize: 14,
    textMargin: 20,
    animated: true,
    variant: "default",
    zIndex: 9999,
    messages: () => ["正在加载...", "准备内容...", "即将完成..."],
    messageInterval: 2000,
});

// 响应式数据
const progressCircle = ref<SVGCircleElement>();
const progressBar = ref<HTMLElement>();
const currentMessage = ref(props.message);
const activeDot = ref(0);

// 计算属性
const radius = computed(() => 40);
const strokeWidth = computed(() => 6);
const circumference = computed(() => 2 * Math.PI * radius.value);
const progressOffset = computed(
    () => circumference.value - (props.progress / 100) * circumference.value,
);

// 几何图形配置
const geometricShapes = computed(() => [
    { type: "circle", color: "#3b82f6", size: 12 },
    { type: "square", color: "#8b5cf6", size: 10 },
    { type: "triangle", color: "#06d6a0", size: 14 },
    { type: "hexagon", color: "#f72585", size: 11 },
]);

// 点状加载器配置
const dotCount = computed(() => 5);

// 消息轮播
let messageTimer: number | null = null;
let messageIndex = 0;

/**
 * 启动消息轮播
 */
function startMessageRotation(): void {
    if (props.messages.length <= 1) return;

    messageTimer = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % props.messages.length;

        // 文字切换动画
        gsap.to(".main-text", {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                currentMessage.value =
                    props.messages?.[messageIndex] || props.message || "";
                gsap.to(".main-text", {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out",
                });
            },
        });
    }, props.messageInterval);
}

/**
 * 停止消息轮播
 */
function stopMessageRotation(): void {
    if (messageTimer) {
        clearInterval(messageTimer);
        messageTimer = null;
    }
}

/**
 * 启动点状动画
 */
function startDotsAnimation(): void {
    if (props.type !== "dots") return;

    const dotsInterval = setInterval(() => {
        activeDot.value = (activeDot.value + 1) % dotCount.value;
    }, 300);

    // 清理函数
    onBeforeUnmount(() => {
        clearInterval(dotsInterval);
    });
}

/**
 * 启动几何图形动画
 */
function startGeometricAnimation(): void {
    if (props.type !== "geometric") return;

    nextTick(() => {
        const shapes = document.querySelectorAll(".geometric-shape");

        gsap.to(shapes, {
            rotation: 360,
            duration: 2,
            ease: "none",
            repeat: -1,
            stagger: 0.1,
        });

        gsap.to(shapes, {
            scale: 1.2,
            duration: 1,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            stagger: 0.05,
        });
    });
}

/**
 * 初始化动画
 */
function initializeAnimations(): void {
    if (!props.animated) return;

    switch (props.type) {
        case "dots":
            startDotsAnimation();
            break;
        case "geometric":
            startGeometricAnimation();
            break;
    }
}

// 监听可见性变化
watch(
    () => props.isVisible,
    (newValue) => {
        if (newValue) {
            currentMessage.value = props.message;
            messageIndex = 0;
            startMessageRotation();
            initializeAnimations();
        } else {
            stopMessageRotation();
        }
    },
);

// 监听进度变化
watch(
    () => props.progress,
    (newProgress) => {
        if (props.animated && progressCircle.value) {
            gsap.to(progressCircle.value, {
                strokeDashoffset:
                    circumference.value -
                    (newProgress / 100) * circumference.value,
                duration: 0.3,
                ease: "power2.out",
            });
        }

        if (props.animated && progressBar.value) {
            gsap.to(progressBar.value, {
                width: newProgress + "%",
                duration: 0.3,
                ease: "power2.out",
            });
        }
    },
);

// 生命周期
onMounted(() => {
    if (props.isVisible) {
        startMessageRotation();
        initializeAnimations();
    }
});

onBeforeUnmount(() => {
    stopMessageRotation();
});

// 暴露方法给父组件
defineExpose({
    startMessageRotation,
    stopMessageRotation,
    currentMessage: computed(() => currentMessage.value),
});
</script>

<style scoped>
.loading-indicator {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.loading-indicator.active {
    opacity: 1;
    visibility: visible;
}

.loading-overlay {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(8px);
}

.loading-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* 圆形加载器样式 */
.circular-loader {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.circular-svg {
    transform: rotate(-90deg);
    filter: drop-shadow(0 4px 20px rgba(59, 130, 246, 0.3));
}

.background-circle {
    opacity: 0.3;
}

.progress-circle {
    transition: stroke-dashoffset 0.3s ease;
}

.progress-circle.animated {
    animation: rotate 2s linear infinite;
}

.circular-center {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.percentage-text {
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 线性加载器样式 */
.linear-loader {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.linear-track {
    width: 100%;
    height: 100%;
    border-radius: inherit;
}

.linear-progress {
    height: 100%;
    border-radius: inherit;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
}

.linear-progress.animated::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    animation: shimmer 1.5s infinite;
}

/* 点状加载器样式 */
.dots-loader {
    display: flex;
    gap: 8px;
    align-items: center;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    opacity: 0.3;
    transition: all 0.3s ease;
}

.dot.active {
    opacity: 1;
    transform: scale(1.2);
}

/* 几何图形加载器样式 */
.geometric-loader {
    display: flex;
    gap: 12px;
    align-items: center;
}

.geometric-shape {
    opacity: 0.8;
}

.geometric-shape.circle {
    border-radius: 50%;
}

.geometric-shape.square {
    border-radius: 2px;
}

.geometric-shape.triangle {
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 12px solid currentColor;
}

.geometric-shape.hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

/* 文本样式 */
.loading-text {
    text-align: center;
}

.main-text {
    font-weight: 600;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.sub-text {
    opacity: 0.8;
}

/* 变体样式 */
.loading-indicator.minimal {
    background: rgba(0, 0, 0, 0.5);
}

.loading-indicator.gaming {
    background: linear-gradient(135deg, #0f172a, #1e293b);
}

.loading-indicator.gaming .circular-svg {
    filter: drop-shadow(0 0 20px #3b82f6) drop-shadow(0 0 40px #8b5cf6);
}

.loading-indicator.elegant {
    background: rgba(255, 255, 255, 0.95);
}

.loading-indicator.elegant .main-text {
    color: #1f2937;
}

.loading-indicator.elegant .sub-text {
    color: #6b7280;
}

/* 动画关键帧 */
@keyframes rotate {
    from {
        transform: rotate(-90deg);
    }
    to {
        transform: rotate(270deg);
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

/* 响应式适配 */
@media (max-width: 768px) {
    .loading-content {
        padding: 20px;
    }

    .circular-loader {
        transform: scale(0.8);
    }

    .linear-loader {
        width: 250px;
    }

    .main-text {
        font-size: 16px;
    }

    .sub-text {
        font-size: 12px;
    }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
    .progress-circle.animated,
    .geometric-shape {
        animation: none;
    }

    .loading-indicator,
    .progress-circle,
    .linear-progress,
    .dot {
        transition: none;
    }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
    .loading-overlay {
        background: #000;
    }

    .main-text,
    .percentage-text {
        color: #fff;
        text-shadow: none;
    }

    .geometric-shape {
        border: 2px solid #fff;
    }
}
</style>
