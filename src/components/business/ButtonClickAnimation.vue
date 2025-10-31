<template>
    <div :class="buttonClasses" :style="buttonStyle" @click="handleButtonClick">
        <!-- 按钮内容 -->
        <div class="button-content">
            <slot name="icon" v-if="!isAnimating">
                <SvgIcon
                    v-if="icon"
                    :name="icon"
                    :size="iconSize"
                    class="button-icon" />
            </slot>

            <span v-if="!isAnimating && text" class="button-text">
                {{ text }}
            </span>

            <!-- 点击确认动画 -->
            <InteractionAnimation
                v-if="isAnimating"
                type="button-click"
                :size="animationSize"
                :autoplay="true"
                :loop="false"
                :clickable="false"
                class="button-animation"
                @complete="handleAnimationComplete"
                @error="handleAnimationError" />
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="button-loading">
            <InteractionAnimation
                type="loading-spinner"
                :size="24"
                :autoplay="true"
                :loop="true"
                :clickable="false"
                class="loading-animation" />
        </div>

        <!-- 成功状态 -->
        <div v-if="success" class="button-success">
            <InteractionAnimation
                type="form-success"
                :size="animationSize"
                :autoplay="true"
                :loop="false"
                :clickable="false"
                class="success-animation"
                @complete="handleSuccessComplete" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import InteractionAnimation from "./InteractionAnimation.vue";
import SvgIcon from "@/components/icons/SvgIcon.vue";

// 按钮状态枚举
export type ButtonState =
    | "idle"
    | "animating"
    | "loading"
    | "success"
    | "error";

// 按钮尺寸枚举
export type ButtonSize = "sm" | "md" | "lg" | "xl";

// 按钮变体枚举
export type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "ghost";

// 组件属性接口
interface Props {
    /** 按钮文本 */
    text?: string;
    /** 按钮图标 */
    icon?: string;
    /** 按钮尺寸 */
    size?: ButtonSize;
    /** 按钮变体 */
    variant?: ButtonVariant;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否加载中 */
    loading?: boolean;
    /** 是否成功状态 */
    success?: boolean;
    /** 是否显示点击动画 */
    showClickAnimation?: boolean;
    /** 动画持续时间（毫秒） */
    animationDuration?: number;
    /** 成功状态持续时间（毫秒） */
    successDuration?: number;
    /** 是否为块级按钮 */
    block?: boolean;
    /** 自定义样式类 */
    class?: string;
}

// 组件事件接口
interface Emits {
    /** 按钮点击事件 */
    (e: "click"): void;
    /** 动画完成事件 */
    (e: "animation-complete"): void;
    /** 成功动画完成事件 */
    (e: "success-complete"): void;
    /** 状态变化事件 */
    (e: "state-change", state: ButtonState): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    size: "md",
    variant: "primary",
    disabled: false,
    loading: false,
    success: false,
    showClickAnimation: true,
    animationDuration: 800,
    successDuration: 2000,
    block: false,
});

const emit = defineEmits<Emits>();

// 响应式状态
const currentState = ref<ButtonState>("idle");
const isAnimating = ref(false);
const animationTimer = ref<number | null>(null);

// 计算属性
const buttonClasses = computed(() => {
    return [
        "button-click-animation",
        `button-${props.size}`,
        `button-${props.variant}`,
        `button-state-${currentState.value}`,
        props.class,
        {
            "button-disabled": props.disabled,
            "button-loading": props.loading,
            "button-success": props.success,
            "button-animating": isAnimating.value,
            "button-block": props.block,
        },
    ];
});

const buttonStyle = computed(() => {
    return {
        // 可以在这里添加动态样式
    };
});

const iconSize = computed(() => {
    const sizeMap: Record<ButtonSize, "sm" | "md" | "lg"> = {
        sm: "sm",
        md: "sm",
        lg: "md",
        xl: "lg",
    };
    return sizeMap[props.size];
});

const animationSize = computed(() => {
    const sizeMap: Record<ButtonSize, number> = {
        sm: 20,
        md: 24,
        lg: 28,
        xl: 32,
    };
    return sizeMap[props.size];
});

// 方法
const setState = (newState: ButtonState) => {
    if (currentState.value !== newState) {
        currentState.value = newState;
        emit("state-change", newState);
    }
};

const startClickAnimation = () => {
    if (!props.showClickAnimation || props.disabled) return;

    isAnimating.value = true;
    setState("animating");

    // 设置动画超时
    if (animationTimer.value) {
        clearTimeout(animationTimer.value);
    }

    animationTimer.value = window.setTimeout(() => {
        handleAnimationComplete();
    }, props.animationDuration);
};

const handleButtonClick = () => {
    if (props.disabled || props.loading || isAnimating.value) return;

    emit("click");

    // 开始点击动画
    if (props.showClickAnimation) {
        startClickAnimation();
    }
};

const handleAnimationComplete = () => {
    isAnimating.value = false;
    setState("idle");

    if (animationTimer.value) {
        clearTimeout(animationTimer.value);
        animationTimer.value = null;
    }

    emit("animation-complete");
};

const handleAnimationError = (error: Error) => {
    console.warn("按钮点击动画错误:", error);
    handleAnimationComplete();
};

const handleSuccessComplete = () => {
    emit("success-complete");

    // 自动重置成功状态
    setTimeout(() => {
        if (props.success) {
            setState("idle");
        }
    }, props.successDuration);
};

// 监听属性变化
watch(
    () => props.loading,
    (loading) => {
        setState(loading ? "loading" : "idle");
    },
);

watch(
    () => props.success,
    (success) => {
        setState(success ? "success" : "idle");
    },
);

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled && isAnimating.value) {
            handleAnimationComplete();
        }
    },
);

// 清理定时器
const cleanup = () => {
    if (animationTimer.value) {
        clearTimeout(animationTimer.value);
        animationTimer.value = null;
    }
};

// 暴露方法给父组件
defineExpose({
    startClickAnimation,
    currentState,
    isAnimating,
});

// 组件卸载时清理
onBeforeUnmount(() => {
    cleanup();
});
</script>

<style scoped>
.button-click-animation {
    @apply relative inline-flex items-center justify-center;
    @apply font-medium rounded-lg transition-all duration-200;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
    @apply select-none cursor-pointer;
}

/* 按钮尺寸 */
.button-sm {
    @apply px-3 py-1.5 text-sm;
}

.button-md {
    @apply px-4 py-2 text-base;
}

.button-lg {
    @apply px-6 py-3 text-lg;
}

.button-xl {
    @apply px-8 py-4 text-xl;
}

/* 按钮变体 */
.button-primary {
    @apply bg-blue-600 text-white border border-blue-600;
    @apply hover:bg-blue-700 hover:border-blue-700;
    @apply focus:ring-blue-500;
}

.button-secondary {
    @apply bg-gray-600 text-white border border-gray-600;
    @apply hover:bg-gray-700 hover:border-gray-700;
    @apply focus:ring-gray-500;
}

.button-success {
    @apply bg-green-600 text-white border border-green-600;
    @apply hover:bg-green-700 hover:border-green-700;
    @apply focus:ring-green-500;
}

.button-warning {
    @apply bg-yellow-600 text-white border border-yellow-600;
    @apply hover:bg-yellow-700 hover:border-yellow-700;
    @apply focus:ring-yellow-500;
}

.button-danger {
    @apply bg-red-600 text-white border border-red-600;
    @apply hover:bg-red-700 hover:border-red-700;
    @apply focus:ring-red-500;
}

.button-ghost {
    @apply bg-transparent text-gray-700 border border-gray-300;
    @apply hover:bg-gray-50 hover:border-gray-400;
    @apply focus:ring-gray-500;
    @apply dark:text-gray-300 dark:border-gray-600;
    @apply dark:hover:bg-gray-800 dark:hover:border-gray-500;
}

/* 按钮状态 */
.button-disabled {
    @apply opacity-50 cursor-not-allowed;
    @apply hover:bg-current hover:border-current;
}

.button-loading {
    @apply cursor-wait;
}

.button-animating {
    @apply cursor-default;
}

.button-block {
    @apply w-full;
}

/* 按钮内容 */
.button-content {
    @apply flex items-center justify-center gap-2;
    @apply transition-all duration-200;
}

.button-icon {
    @apply shrink-0;
}

.button-text {
    @apply whitespace-nowrap;
}

/* 动画容器 */
.button-animation {
    @apply shrink-0;
}

.loading-animation {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-current bg-opacity-20 rounded-lg;
}

.success-animation {
    @apply absolute inset-0 flex items-center justify-center;
    @apply bg-green-500 bg-opacity-90 rounded-lg;
}

/* 状态过渡效果 */
.button-state-animating .button-content {
    @apply opacity-0 scale-95;
}

.button-state-loading .button-content {
    @apply opacity-30;
}

.button-state-success .button-content {
    @apply opacity-0;
}

/* 悬停效果 */
.button-click-animation:not(.button-disabled):not(.button-loading):not(
        .button-animating
    ):hover {
    @apply transform scale-105 shadow-lg;
}

.button-click-animation:not(.button-disabled):not(.button-loading):not(
        .button-animating
    ):active {
    @apply transform scale-95;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .button-lg {
        @apply px-4 py-2 text-base;
    }

    .button-xl {
        @apply px-6 py-3 text-lg;
    }
}

/* 动画效果 */
@keyframes button-pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.02);
    }
}

.button-state-animating {
    animation: button-pulse 0.8s ease-in-out;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .button-ghost {
        @apply text-gray-300 border-gray-600;
        @apply hover:bg-gray-800 hover:border-gray-500;
    }
}
</style>
