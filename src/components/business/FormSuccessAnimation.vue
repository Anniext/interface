<template>
    <div :class="containerClasses" :style="containerStyle">
        <!-- 成功动画 -->
        <InteractionAnimation
            v-if="showAnimation"
            type="form-success"
            :size="animationSize"
            :autoplay="autoplay"
            :loop="false"
            :clickable="false"
            :delay="delay"
            class="success-animation"
            @ready="handleAnimationReady"
            @complete="handleAnimationComplete"
            @error="handleAnimationError" />

        <!-- 成功消息 -->
        <div v-if="showMessage" class="success-message">
            <h3 v-if="title" class="success-title">{{ title }}</h3>
            <p v-if="message" class="success-text">{{ message }}</p>

            <!-- 额外内容插槽 -->
            <div v-if="$slots.content" class="success-content">
                <slot name="content"></slot>
            </div>

            <!-- 操作按钮 -->
            <div v-if="showActions" class="success-actions">
                <slot name="actions">
                    <ButtonClickAnimation
                        v-if="showContinueButton"
                        :text="continueButtonText"
                        variant="primary"
                        size="sm"
                        @click="handleContinue" />

                    <ButtonClickAnimation
                        v-if="showCloseButton"
                        :text="closeButtonText"
                        variant="ghost"
                        size="sm"
                        @click="handleClose" />
                </slot>
            </div>
        </div>

        <!-- 背景装饰 -->
        <div v-if="showBackground" class="success-background">
            <div class="background-circle circle-1"></div>
            <div class="background-circle circle-2"></div>
            <div class="background-circle circle-3"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from "vue";
import InteractionAnimation from "./InteractionAnimation.vue";
import ButtonClickAnimation from "./ButtonClickAnimation.vue";

// 显示模式枚举
export type DisplayMode = "inline" | "modal" | "toast" | "fullscreen";

// 组件属性接口
interface Props {
    /** 是否显示动画 */
    visible?: boolean;
    /** 显示模式 */
    mode?: DisplayMode;
    /** 动画尺寸 */
    animationSize?: number;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 动画延迟（毫秒） */
    delay?: number;
    /** 成功标题 */
    title?: string;
    /** 成功消息 */
    message?: string;
    /** 是否显示消息 */
    showMessage?: boolean;
    /** 是否显示操作按钮 */
    showActions?: boolean;
    /** 是否显示继续按钮 */
    showContinueButton?: boolean;
    /** 继续按钮文本 */
    continueButtonText?: string;
    /** 是否显示关闭按钮 */
    showCloseButton?: boolean;
    /** 关闭按钮文本 */
    closeButtonText?: string;
    /** 是否显示背景装饰 */
    showBackground?: boolean;
    /** 自动隐藏延迟（毫秒，0 表示不自动隐藏） */
    autoHideDelay?: number;
    /** 自定义样式类 */
    class?: string;
}

// 组件事件接口
interface Emits {
    /** 动画准备就绪 */
    (e: "ready"): void;
    /** 动画播放完成 */
    (e: "complete"): void;
    /** 动画错误 */
    (e: "error", error: Error): void;
    /** 继续按钮点击 */
    (e: "continue"): void;
    /** 关闭按钮点击 */
    (e: "close"): void;
    /** 自动隐藏 */
    (e: "auto-hide"): void;
    /** 显示状态变化 */
    (e: "visibility-change", visible: boolean): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    visible: false,
    mode: "inline",
    animationSize: 80,
    autoplay: true,
    delay: 0,
    title: "操作成功！",
    message: "您的操作已成功完成。",
    showMessage: true,
    showActions: true,
    showContinueButton: true,
    continueButtonText: "继续",
    showCloseButton: false,
    closeButtonText: "关闭",
    showBackground: true,
    autoHideDelay: 0,
});

const emit = defineEmits<Emits>();

// 响应式状态
const isVisible = ref(props.visible);
const animationCompleted = ref(false);
const autoHideTimer = ref<number | null>(null);

// 计算属性
const showAnimation = computed(() => {
    return isVisible.value;
});

const containerClasses = computed(() => {
    return [
        "form-success-animation",
        `success-mode-${props.mode}`,
        props.class,
        {
            "success-visible": isVisible.value,
            "success-completed": animationCompleted.value,
        },
    ];
});

const containerStyle = computed(() => {
    return {
        // 可以在这里添加动态样式
    };
});

// 方法
const show = () => {
    isVisible.value = true;
    animationCompleted.value = false;
    emit("visibility-change", true);

    // 设置自动隐藏
    if (props.autoHideDelay > 0) {
        startAutoHideTimer();
    }
};

const hide = () => {
    isVisible.value = false;
    animationCompleted.value = false;
    clearAutoHideTimer();
    emit("visibility-change", false);
};

const startAutoHideTimer = () => {
    clearAutoHideTimer();
    autoHideTimer.value = window.setTimeout(() => {
        hide();
        emit("auto-hide");
    }, props.autoHideDelay);
};

const clearAutoHideTimer = () => {
    if (autoHideTimer.value) {
        clearTimeout(autoHideTimer.value);
        autoHideTimer.value = null;
    }
};

// 事件处理方法
const handleAnimationReady = () => {
    emit("ready");
};

const handleAnimationComplete = () => {
    animationCompleted.value = true;
    emit("complete");

    // 如果设置了自动隐藏且还没有开始计时，现在开始
    if (props.autoHideDelay > 0 && !autoHideTimer.value) {
        startAutoHideTimer();
    }
};

const handleAnimationError = (error: Error) => {
    console.warn("表单成功动画错误:", error);
    emit("error", error);
};

const handleContinue = () => {
    emit("continue");
    hide();
};

const handleClose = () => {
    emit("close");
    hide();
};

// 监听属性变化
watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            show();
        } else {
            hide();
        }
    },
    { immediate: true },
);

watch(
    () => props.autoHideDelay,
    (delay) => {
        if (delay > 0 && isVisible.value && animationCompleted.value) {
            startAutoHideTimer();
        } else {
            clearAutoHideTimer();
        }
    },
);

// 暴露方法给父组件
defineExpose({
    show,
    hide,
    isVisible,
    animationCompleted,
});

// 组件卸载时清理
onBeforeUnmount(() => {
    clearAutoHideTimer();
});
</script>

<style scoped>
.form-success-animation {
    @apply relative flex flex-col items-center justify-center;
    @apply transition-all duration-300 ease-out;
}

/* 显示模式样式 */
.success-mode-inline {
    @apply p-4;
}

.success-mode-modal {
    @apply fixed inset-0 z-50 flex items-center justify-center;
    @apply bg-black bg-opacity-50 backdrop-blur-sm;
}

.success-mode-modal .success-content-wrapper {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-xl;
    @apply p-6 max-w-md mx-4;
}

.success-mode-toast {
    @apply fixed top-4 right-4 z-50;
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-lg;
    @apply p-4 max-w-sm;
    @apply border border-green-200 dark:border-green-700;
}

.success-mode-fullscreen {
    @apply fixed inset-0 z-50 flex items-center justify-center;
    @apply bg-green-50 dark:bg-green-900 dark:bg-opacity-20;
}

/* 动画容器 */
.success-animation {
    @apply mb-4;
}

/* 成功消息 */
.success-message {
    @apply text-center space-y-3;
}

.success-title {
    @apply text-xl font-semibold text-green-700 dark:text-green-300;
}

.success-text {
    @apply text-gray-600 dark:text-gray-400;
}

.success-content {
    @apply mt-4;
}

.success-actions {
    @apply flex items-center justify-center gap-3 mt-4;
}

/* 背景装饰 */
.success-background {
    @apply absolute inset-0 pointer-events-none overflow-hidden;
}

.background-circle {
    @apply absolute rounded-full bg-green-200 dark:bg-green-700 opacity-20;
    @apply animate-pulse;
}

.circle-1 {
    @apply w-32 h-32 -top-16 -left-16;
    animation-delay: 0s;
}

.circle-2 {
    @apply w-24 h-24 -bottom-12 -right-12;
    animation-delay: 0.5s;
}

.circle-3 {
    @apply w-16 h-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
    animation-delay: 1s;
}

/* 显示/隐藏动画 */
.form-success-animation {
    @apply opacity-0 scale-95 transform;
}

.success-visible {
    @apply opacity-100 scale-100;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .success-mode-modal .success-content-wrapper {
        @apply mx-2 p-4;
    }

    .success-mode-toast {
        @apply top-2 right-2 left-2 max-w-none;
    }

    .success-title {
        @apply text-lg;
    }

    .success-actions {
        @apply flex-col gap-2;
    }
}

/* 动画效果 */
@keyframes success-bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
        transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
        transform: translate3d(0, -10px, 0);
    }
    70% {
        transform: translate3d(0, -5px, 0);
    }
    90% {
        transform: translate3d(0, -2px, 0);
    }
}

.success-completed .success-animation {
    animation: success-bounce 1s ease-out;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .success-mode-modal .success-content-wrapper {
        @apply bg-gray-800 border border-gray-700;
    }

    .success-mode-toast {
        @apply bg-gray-800 border-gray-700;
    }

    .background-circle {
        @apply bg-green-600 opacity-10;
    }
}
</style>
