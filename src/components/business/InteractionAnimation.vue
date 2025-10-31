<template>
    <div :class="containerClasses" :style="containerStyle" @click="handleClick">
        <!-- Lottie 动画播放器 -->
        <LottiePlayer
            v-if="shouldShowAnimation"
            :key="animationKey"
            :path="animationPath || undefined"
            :autoplay="autoplay"
            :loop="loop"
            :width="size"
            :height="size"
            :class="animationClasses"
            @ready="handleAnimationReady"
            @complete="handleAnimationComplete"
            @error="handleAnimationError" />

        <!-- 备用内容插槽 -->
        <div
            v-if="!shouldShowAnimation || animationError"
            class="fallback-content">
            <slot name="fallback">
                <SvgIcon
                    :name="fallbackIcon"
                    :size="iconSize"
                    :color="iconColor"
                    class="fallback-icon" />
            </slot>
        </div>

        <!-- 动画覆盖层 -->
        <div
            v-if="showOverlay"
            class="animation-overlay"
            :style="overlayStyle"></div>

        <!-- 状态指示器 -->
        <div v-if="showStatus && status" :class="statusClasses">
            <span class="status-text">{{ statusText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import LottiePlayer from "@/components/lottie/LottiePlayer.vue";
import SvgIcon from "@/components/icons/SvgIcon.vue";

// 动画类型枚举
export type InteractionAnimationType =
    | "button-click"
    | "form-success"
    | "navigation-switch"
    | "loading-spinner"
    | "custom";

// 动画状态枚举
export type AnimationStatus =
    | "idle"
    | "loading"
    | "playing"
    | "completed"
    | "error";

// 组件属性接口
interface Props {
    /** 动画类型 */
    type: InteractionAnimationType;
    /** 自定义动画路径（当 type 为 custom 时使用） */
    customPath?: string;
    /** 动画尺寸 */
    size?: number | string;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean;
    /** 是否可点击触发 */
    clickable?: boolean;
    /** 是否禁用动画 */
    disabled?: boolean;
    /** 备用图标名称 */
    fallbackIcon?: string;
    /** 图标尺寸 */
    iconSize?: "sm" | "md" | "lg";
    /** 图标颜色 */
    iconColor?: string;
    /** 是否显示状态指示器 */
    showStatus?: boolean;
    /** 是否显示覆盖层 */
    showOverlay?: boolean;
    /** 覆盖层颜色 */
    overlayColor?: string;
    /** 动画延迟（毫秒） */
    delay?: number;
    /** 动画持续时间（毫秒，仅用于状态管理） */
    duration?: number;
    /** 自定义样式类 */
    class?: string;
}

// 组件事件接口
interface Emits {
    /** 动画开始播放 */
    (e: "play"): void;
    /** 动画播放完成 */
    (e: "complete"): void;
    /** 动画准备就绪 */
    (e: "ready"): void;
    /** 动画错误 */
    (e: "error", error: Error): void;
    /** 点击事件 */
    (e: "click"): void;
    /** 状态变化 */
    (e: "status-change", status: AnimationStatus): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    size: 60,
    autoplay: false,
    loop: false,
    clickable: true,
    disabled: false,
    fallbackIcon: "check",
    iconSize: "md",
    iconColor: "currentColor",
    showStatus: false,
    showOverlay: false,
    overlayColor: "rgba(0, 0, 0, 0.1)",
    delay: 0,
    duration: 1000,
});

const emit = defineEmits<Emits>();

// 响应式状态
const status = ref<AnimationStatus>("idle");
const animationError = ref(false);
const animationReady = ref(false);
const isPlaying = ref(false);
const animationKey = ref(0);

// 计算属性
const animationPath = computed(() => {
    if (props.type === "custom" && props.customPath) {
        return props.customPath;
    }

    // 根据动画类型映射到对应的文件路径
    const animationMap: Record<string, string> = {
        "button-click": "/animations/interactions/button-click.json",
        "form-success": "/animations/interactions/form-success.json",
        "navigation-switch": "/animations/interactions/navigation-switch.json",
        "loading-spinner": "/animations/interactions/loading-spinner.json",
    };

    return animationMap[props.type] || null;
});

const shouldShowAnimation = computed(() => {
    return !props.disabled && animationPath.value && !animationError.value;
});

const containerClasses = computed(() => {
    return [
        "interaction-animation",
        `animation-${props.type}`,
        `animation-status-${status.value}`,
        props.class,
        {
            "animation-clickable": props.clickable && !props.disabled,
            "animation-disabled": props.disabled,
            "animation-playing": isPlaying.value,
            "animation-error": animationError.value,
        },
    ];
});

const containerStyle = computed(() => {
    const size =
        typeof props.size === "number" ? `${props.size}px` : props.size;
    return {
        width: size,
        height: size,
    };
});

const animationClasses = computed(() => {
    return ["interaction-lottie", `lottie-${props.type}`];
});

const statusClasses = computed(() => {
    return ["animation-status", `status-${status.value}`];
});

const statusText = computed(() => {
    const statusMap: Record<AnimationStatus, string> = {
        idle: "就绪",
        loading: "加载中",
        playing: "播放中",
        completed: "完成",
        error: "错误",
    };

    return statusMap[status.value] || "未知";
});

const overlayStyle = computed(() => {
    return {
        backgroundColor: props.overlayColor,
    };
});

// 方法
const playAnimation = async () => {
    if (props.disabled || !shouldShowAnimation.value) return;

    try {
        // 设置延迟
        if (props.delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, props.delay));
        }

        // 更新状态
        setStatus("playing");
        isPlaying.value = true;

        // 强制重新渲染动画
        animationKey.value++;

        emit("play");
    } catch (error) {
        console.error("播放交互动画失败:", error);
        setStatus("error");
        emit("error", error as Error);
    }
};

const setStatus = (newStatus: AnimationStatus) => {
    if (status.value !== newStatus) {
        status.value = newStatus;
        emit("status-change", newStatus);
    }
};

// 事件处理方法
const handleClick = () => {
    if (!props.clickable || props.disabled) return;

    emit("click");
    playAnimation();
};

const handleAnimationReady = () => {
    animationReady.value = true;
    animationError.value = false;
    setStatus("idle");
    emit("ready");

    // 如果设置了自动播放，则开始播放
    if (props.autoplay) {
        nextTick(() => {
            playAnimation();
        });
    }
};

const handleAnimationComplete = () => {
    isPlaying.value = false;
    setStatus("completed");
    emit("complete");

    // 如果不是循环播放，在完成后重置状态
    if (!props.loop) {
        setTimeout(() => {
            setStatus("idle");
        }, 500);
    }
};

const handleAnimationError = (error: Error) => {
    console.warn(`交互动画加载失败 (${props.type}):`, error);
    animationError.value = true;
    animationReady.value = false;
    isPlaying.value = false;
    setStatus("error");
    emit("error", error);
};

// 监听属性变化
watch(
    () => props.type,
    () => {
        // 重置状态
        animationError.value = false;
        animationReady.value = false;
        isPlaying.value = false;
        setStatus("idle");
        animationKey.value++;
    },
);

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled && isPlaying.value) {
            isPlaying.value = false;
            setStatus("idle");
        }
    },
);

// 暴露方法给父组件
defineExpose({
    playAnimation,
    status,
    isPlaying,
    animationReady,
    animationError,
});
</script>

<style scoped>
.interaction-animation {
    @apply relative inline-flex items-center justify-center;
    @apply transition-all duration-200 ease-out;
}

.interaction-animation.animation-clickable {
    @apply cursor-pointer;
}

.interaction-animation.animation-clickable:hover {
    @apply scale-105;
}

.interaction-animation.animation-clickable:active {
    @apply scale-95;
}

.interaction-animation.animation-disabled {
    @apply opacity-50 cursor-not-allowed;
}

.interaction-animation.animation-playing {
    @apply scale-110;
}

.interaction-animation.animation-error {
    @apply opacity-75;
}

/* 动画播放器样式 */
.interaction-lottie {
    @apply w-full h-full;
}

/* 备用内容样式 */
.fallback-content {
    @apply flex items-center justify-center w-full h-full;
}

.fallback-icon {
    @apply transition-transform duration-200;
}

.interaction-animation:hover .fallback-icon {
    @apply scale-110;
}

/* 覆盖层样式 */
.animation-overlay {
    @apply absolute inset-0 rounded-full pointer-events-none;
    @apply transition-opacity duration-300;
}

.animation-status-playing .animation-overlay {
    @apply opacity-100;
}

.animation-overlay {
    @apply opacity-0;
}

/* 状态指示器样式 */
.animation-status {
    @apply absolute -bottom-6 left-1/2 transform -translate-x-1/2;
    @apply px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800;
    @apply text-gray-600 dark:text-gray-400;
}

.status-text {
    @apply font-mono whitespace-nowrap;
}

.status-loading .status-text {
    @apply text-yellow-600 dark:text-yellow-400;
}

.status-playing .status-text {
    @apply text-blue-600 dark:text-blue-400;
}

.status-completed .status-text {
    @apply text-green-600 dark:text-green-400;
}

.status-error .status-text {
    @apply text-red-600 dark:text-red-400;
}

/* 特定动画类型的样式 */
.animation-button-click {
    @apply rounded-full;
}

.animation-form-success {
    @apply rounded-lg;
}

.animation-navigation-switch {
    @apply rounded-md;
}

.animation-loading-spinner {
    @apply rounded-full;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .interaction-animation {
        @apply scale-90;
    }

    .animation-status {
        @apply -bottom-5 text-xs;
    }
}

/* 动画效果 */
@keyframes interaction-pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }
}

.animation-status-playing {
    animation: interaction-pulse 1s ease-in-out infinite;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .animation-overlay {
        @apply bg-white bg-opacity-10;
    }
}
</style>
