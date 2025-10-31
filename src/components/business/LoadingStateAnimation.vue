<template>
    <div :class="containerClasses" :style="containerStyle">
        <!-- 加载动画 -->
        <InteractionAnimation
            v-if="showAnimation"
            type="loading-spinner"
            :size="animationSize"
            :autoplay="autoplay"
            :loop="true"
            :clickable="false"
            class="loading-animation"
            @ready="handleAnimationReady"
            @error="handleAnimationError" />

        <!-- 加载文本 -->
        <div v-if="showText" class="loading-text">
            <p class="loading-message">{{ currentMessage }}</p>
            <div v-if="showProgress" class="loading-progress">
                <div class="progress-bar">
                    <div class="progress-fill" :style="progressStyle"></div>
                </div>
                <span class="progress-text">{{ progressText }}</span>
            </div>
        </div>

        <!-- 加载点动画 -->
        <div v-if="showDots" class="loading-dots">
            <span
                v-for="i in 3"
                :key="i"
                class="dot"
                :class="`dot-${i}`"></span>
        </div>

        <!-- 自定义内容插槽 -->
        <div v-if="$slots.content" class="loading-content">
            <slot name="content"></slot>
        </div>

        <!-- 背景遮罩 -->
        <div
            v-if="showOverlay"
            class="loading-overlay"
            :style="overlayStyle"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import InteractionAnimation from "./InteractionAnimation.vue";

// 加载状态枚举
export type LoadingState = "idle" | "loading" | "success" | "error";

// 显示模式枚举
export type LoadingMode = "inline" | "overlay" | "fullscreen" | "button";

// 组件属性接口
interface Props {
    /** 是否显示加载动画 */
    loading?: boolean;
    /** 加载状态 */
    state?: LoadingState;
    /** 显示模式 */
    mode?: LoadingMode;
    /** 动画尺寸 */
    animationSize?: number;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 加载消息 */
    message?: string;
    /** 加载消息列表（用于轮播） */
    messages?: string[];
    /** 消息轮播间隔（毫秒） */
    messageInterval?: number;
    /** 是否显示文本 */
    showText?: boolean;
    /** 是否显示进度条 */
    showProgress?: boolean;
    /** 进度值（0-100） */
    progress?: number;
    /** 是否显示加载点动画 */
    showDots?: boolean;
    /** 是否显示背景遮罩 */
    showOverlay?: boolean;
    /** 遮罩颜色 */
    overlayColor?: string;
    /** 遮罩透明度 */
    overlayOpacity?: number;
    /** 最小显示时间（毫秒） */
    minDuration?: number;
    /** 自定义样式类 */
    class?: string;
}

// 组件事件接口
interface Emits {
    /** 动画准备就绪 */
    (e: "ready"): void;
    /** 动画错误 */
    (e: "error", error: Error): void;
    /** 加载开始 */
    (e: "loading-start"): void;
    /** 加载结束 */
    (e: "loading-end"): void;
    /** 状态变化 */
    (e: "state-change", state: LoadingState): void;
    /** 进度变化 */
    (e: "progress-change", progress: number): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    loading: false,
    state: "idle",
    mode: "inline",
    animationSize: 40,
    autoplay: true,
    message: "加载中...",
    messages: () => ["加载中...", "请稍候...", "正在处理..."],
    messageInterval: 2000,
    showText: true,
    showProgress: false,
    progress: 0,
    showDots: false,
    showOverlay: false,
    overlayColor: "#000000",
    overlayOpacity: 0.5,
    minDuration: 500,
});

const emit = defineEmits<Emits>();

// 响应式状态
const currentState = ref<LoadingState>(props.state);
const currentMessageIndex = ref(0);
const startTime = ref<number | null>(null);
const messageTimer = ref<number | null>(null);
const minDurationTimer = ref<number | null>(null);

// 计算属性
const showAnimation = computed(() => {
    return props.loading && currentState.value === "loading";
});

const containerClasses = computed(() => {
    return [
        "loading-state-animation",
        `loading-mode-${props.mode}`,
        `loading-state-${currentState.value}`,
        props.class,
        {
            "loading-active": props.loading,
            "loading-with-overlay": props.showOverlay,
            "loading-with-progress": props.showProgress,
        },
    ];
});

const containerStyle = computed(() => {
    return {
        // 可以在这里添加动态样式
    };
});

const currentMessage = computed(() => {
    if (props.message) return props.message;
    if (props.messages.length > 0) {
        return props.messages[currentMessageIndex.value] || props.messages[0];
    }
    return "加载中...";
});

const progressStyle = computed(() => {
    return {
        width: `${Math.max(0, Math.min(100, props.progress))}%`,
    };
});

const progressText = computed(() => {
    return `${Math.round(props.progress)}%`;
});

const overlayStyle = computed(() => {
    return {
        backgroundColor: props.overlayColor,
        opacity: props.overlayOpacity,
    };
});

// 方法
const startLoading = () => {
    if (currentState.value === "loading") return;

    currentState.value = "loading";
    startTime.value = Date.now();
    emit("loading-start");
    emit("state-change", "loading");

    // 开始消息轮播
    if (props.messages.length > 1) {
        startMessageRotation();
    }

    // 设置最小显示时间
    if (props.minDuration > 0) {
        minDurationTimer.value = window.setTimeout(() => {
            minDurationTimer.value = null;
        }, props.minDuration);
    }
};

const stopLoading = () => {
    if (currentState.value !== "loading") return;

    const checkMinDuration = () => {
        if (minDurationTimer.value) {
            // 还没有达到最小显示时间，延迟停止
            setTimeout(checkMinDuration, 100);
            return;
        }

        currentState.value = "idle";
        startTime.value = null;
        stopMessageRotation();
        emit("loading-end");
        emit("state-change", "idle");
    };

    checkMinDuration();
};

const startMessageRotation = () => {
    stopMessageRotation();
    if (props.messages.length <= 1) return;

    messageTimer.value = window.setInterval(() => {
        currentMessageIndex.value =
            (currentMessageIndex.value + 1) % props.messages.length;
    }, props.messageInterval);
};

const stopMessageRotation = () => {
    if (messageTimer.value) {
        clearInterval(messageTimer.value);
        messageTimer.value = null;
    }
    currentMessageIndex.value = 0;
};

const clearTimers = () => {
    stopMessageRotation();
    if (minDurationTimer.value) {
        clearTimeout(minDurationTimer.value);
        minDurationTimer.value = null;
    }
};

// 事件处理方法
const handleAnimationReady = () => {
    emit("ready");
};

const handleAnimationError = (error: Error) => {
    console.warn("加载状态动画错误:", error);
    emit("error", error);
};

// 监听属性变化
watch(
    () => props.loading,
    (loading) => {
        if (loading) {
            startLoading();
        } else {
            stopLoading();
        }
    },
    { immediate: true },
);

watch(
    () => props.state,
    (state) => {
        currentState.value = state;
        emit("state-change", state);
    },
);

watch(
    () => props.progress,
    (progress) => {
        emit("progress-change", progress);
    },
);

watch(
    () => props.messages,
    () => {
        currentMessageIndex.value = 0;
        if (currentState.value === "loading" && props.messages.length > 1) {
            startMessageRotation();
        }
    },
);

// 暴露方法给父组件
defineExpose({
    startLoading,
    stopLoading,
    currentState,
    currentMessage,
});

// 组件卸载时清理
onBeforeUnmount(() => {
    clearTimers();
});
</script>

<style scoped>
.loading-state-animation {
    @apply relative flex flex-col items-center justify-center;
    @apply transition-all duration-300 ease-out;
}

/* 显示模式样式 */
.loading-mode-inline {
    @apply p-4;
}

.loading-mode-overlay {
    @apply fixed inset-0 z-50 flex items-center justify-center;
}

.loading-mode-fullscreen {
    @apply fixed inset-0 z-50 flex items-center justify-center;
    @apply bg-white dark:bg-gray-900;
}

.loading-mode-button {
    @apply inline-flex items-center justify-center;
    @apply px-4 py-2;
}

/* 加载动画 */
.loading-animation {
    @apply mb-3;
}

/* 加载文本 */
.loading-text {
    @apply text-center space-y-2;
}

.loading-message {
    @apply text-gray-600 dark:text-gray-400 font-medium;
    @apply transition-opacity duration-300;
}

.loading-progress {
    @apply space-y-1;
}

.progress-bar {
    @apply w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden;
}

.progress-fill {
    @apply h-full bg-blue-500 rounded-full transition-all duration-300 ease-out;
}

.progress-text {
    @apply text-sm text-gray-500 dark:text-gray-500 font-mono;
}

/* 加载点动画 */
.loading-dots {
    @apply flex items-center justify-center space-x-1 mt-2;
}

.dot {
    @apply w-2 h-2 bg-blue-500 rounded-full;
    @apply animate-pulse;
}

.dot-1 {
    animation-delay: 0s;
}

.dot-2 {
    animation-delay: 0.2s;
}

.dot-3 {
    animation-delay: 0.4s;
}

/* 自定义内容 */
.loading-content {
    @apply mt-4;
}

/* 背景遮罩 */
.loading-overlay {
    @apply absolute inset-0 pointer-events-none;
}

.loading-mode-overlay .loading-overlay,
.loading-mode-fullscreen .loading-overlay {
    @apply fixed inset-0 z-40;
}

/* 状态样式 */
.loading-state-idle {
    @apply opacity-0 scale-95;
}

.loading-state-loading {
    @apply opacity-100 scale-100;
}

.loading-state-success {
    @apply opacity-100 scale-100;
}

.loading-state-error {
    @apply opacity-100 scale-100;
}

/* 激活状态 */
.loading-active {
    @apply opacity-100 scale-100;
}

/* 不同模式的特定样式 */
.loading-mode-button.loading-active {
    @apply cursor-wait;
}

.loading-mode-button .loading-message {
    @apply text-sm;
}

.loading-mode-button .loading-animation {
    @apply mb-0 mr-2;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .loading-text {
        @apply px-4;
    }

    .loading-message {
        @apply text-sm;
    }

    .progress-bar {
        @apply w-32;
    }

    .loading-mode-overlay,
    .loading-mode-fullscreen {
        @apply p-4;
    }
}

/* 动画效果 */
@keyframes loading-fade-in {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.loading-active {
    animation: loading-fade-in 0.3s ease-out;
}

@keyframes dots-wave {
    0%,
    60%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    30% {
        transform: scale(1.2);
        opacity: 0.7;
    }
}

.dot {
    animation: dots-wave 1.4s ease-in-out infinite both;
}

/* 进度条动画 */
@keyframes progress-shimmer {
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.progress-fill {
    background-image: linear-gradient(
        90deg,
        currentColor 0%,
        rgba(255, 255, 255, 0.2) 50%,
        currentColor 100%
    );
    background-size: 200px 100%;
    animation: progress-shimmer 2s infinite;
}

/* 消息切换动画 */
.loading-message {
    animation: message-fade 0.5s ease-in-out;
}

@keyframes message-fade {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .loading-mode-fullscreen {
        @apply bg-gray-900;
    }

    .progress-bar {
        @apply bg-gray-700;
    }

    .progress-fill {
        @apply bg-blue-400;
    }

    .dot {
        @apply bg-blue-400;
    }
}
</style>
