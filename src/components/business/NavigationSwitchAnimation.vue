<template>
    <div :class="containerClasses" :style="containerStyle">
        <!-- 导航切换动画 -->
        <InteractionAnimation
            v-if="showAnimation"
            type="navigation-switch"
            :size="animationSize"
            :autoplay="autoplay"
            :loop="false"
            :clickable="false"
            :delay="delay"
            class="navigation-animation"
            @ready="handleAnimationReady"
            @complete="handleAnimationComplete"
            @error="handleAnimationError" />

        <!-- 导航指示器 -->
        <div v-if="showIndicator" class="navigation-indicator">
            <div class="indicator-line" :style="indicatorStyle"></div>
            <div class="indicator-dot" :style="dotStyle"></div>
        </div>

        <!-- 导航标签 -->
        <div v-if="showLabel && label" class="navigation-label">
            <span class="label-text">{{ label }}</span>
        </div>

        <!-- 方向箭头 -->
        <div v-if="showArrow" class="navigation-arrow" :class="arrowClasses">
            <SvgIcon :name="arrowIcon" size="sm" class="arrow-icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import InteractionAnimation from "./InteractionAnimation.vue";
import SvgIcon from "@/components/icons/SvgIcon.vue";

// 导航方向枚举
export type NavigationDirection = "left" | "right" | "up" | "down";

// 指示器类型枚举
export type IndicatorType = "line" | "dot" | "arrow" | "custom";

// 组件属性接口
interface Props {
    /** 是否显示动画 */
    active?: boolean;
    /** 导航方向 */
    direction?: NavigationDirection;
    /** 动画尺寸 */
    animationSize?: number;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 动画延迟（毫秒） */
    delay?: number;
    /** 导航标签 */
    label?: string;
    /** 是否显示标签 */
    showLabel?: boolean;
    /** 是否显示指示器 */
    showIndicator?: boolean;
    /** 指示器类型 */
    indicatorType?: IndicatorType;
    /** 指示器颜色 */
    indicatorColor?: string;
    /** 是否显示方向箭头 */
    showArrow?: boolean;
    /** 箭头图标名称 */
    arrowIcon?: string;
    /** 动画触发模式 */
    trigger?: "auto" | "manual";
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
    /** 导航切换开始 */
    (e: "switch-start", direction: NavigationDirection): void;
    /** 导航切换完成 */
    (e: "switch-complete", direction: NavigationDirection): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    active: false,
    direction: "right",
    animationSize: 40,
    autoplay: true,
    delay: 0,
    showLabel: false,
    showIndicator: true,
    indicatorType: "line",
    indicatorColor: "#3b82f6",
    showArrow: true,
    trigger: "auto",
});

const emit = defineEmits<Emits>();

// 响应式状态
const isAnimating = ref(false);
const animationCompleted = ref(false);

// 计算属性
const showAnimation = computed(() => {
    return props.active && (props.trigger === "auto" || isAnimating.value);
});

const containerClasses = computed(() => {
    return [
        "navigation-switch-animation",
        `navigation-${props.direction}`,
        `indicator-${props.indicatorType}`,
        props.class,
        {
            "navigation-active": props.active,
            "navigation-animating": isAnimating.value,
            "navigation-completed": animationCompleted.value,
        },
    ];
});

const containerStyle = computed(() => {
    return {
        // 可以在这里添加动态样式
    };
});

const arrowClasses = computed(() => {
    return [
        `arrow-${props.direction}`,
        {
            "arrow-active": props.active,
        },
    ];
});

const arrowIcon = computed(() => {
    if (props.arrowIcon) return props.arrowIcon;

    const iconMap: Record<NavigationDirection, string> = {
        left: "arrow-left",
        right: "arrow-right",
        up: "arrow-up",
        down: "arrow-down",
    };

    return iconMap[props.direction] || "arrow-right";
});

const indicatorStyle = computed(() => {
    return {
        backgroundColor: props.indicatorColor,
        transform: getIndicatorTransform(),
    };
});

const dotStyle = computed(() => {
    return {
        backgroundColor: props.indicatorColor,
        transform: getDotTransform(),
    };
});

// 方法
const getIndicatorTransform = () => {
    if (!props.active) return "scaleX(0)";

    switch (props.direction) {
        case "left":
            return "scaleX(1) translateX(-100%)";
        case "right":
            return "scaleX(1) translateX(0)";
        case "up":
            return "scaleY(1) translateY(-100%)";
        case "down":
            return "scaleY(1) translateY(0)";
        default:
            return "scaleX(1)";
    }
};

const getDotTransform = () => {
    if (!props.active) return "scale(0)";

    switch (props.direction) {
        case "left":
            return "scale(1) translateX(-200%)";
        case "right":
            return "scale(1) translateX(200%)";
        case "up":
            return "scale(1) translateY(-200%)";
        case "down":
            return "scale(1) translateY(200%)";
        default:
            return "scale(1)";
    }
};

const startAnimation = () => {
    if (isAnimating.value) return;

    isAnimating.value = true;
    animationCompleted.value = false;
    emit("switch-start", props.direction);
};

const stopAnimation = () => {
    isAnimating.value = false;
    emit("switch-complete", props.direction);
};

// 事件处理方法
const handleAnimationReady = () => {
    emit("ready");
};

const handleAnimationComplete = () => {
    animationCompleted.value = true;
    isAnimating.value = false;
    emit("complete");
    emit("switch-complete", props.direction);
};

const handleAnimationError = (error: Error) => {
    console.warn("导航切换动画错误:", error);
    isAnimating.value = false;
    emit("error", error);
};

// 监听属性变化
watch(
    () => props.active,
    (active) => {
        if (active && props.trigger === "auto") {
            startAnimation();
        } else if (!active) {
            stopAnimation();
        }
    },
    { immediate: true },
);

// 暴露方法给父组件
defineExpose({
    startAnimation,
    stopAnimation,
    isAnimating,
    animationCompleted,
});
</script>

<style scoped>
.navigation-switch-animation {
    @apply relative inline-flex items-center justify-center;
    @apply transition-all duration-300 ease-out;
}

/* 动画容器 */
.navigation-animation {
    @apply shrink-0;
}

/* 导航指示器 */
.navigation-indicator {
    @apply absolute inset-0 pointer-events-none;
}

.indicator-line {
    @apply absolute bg-blue-500 transition-transform duration-300 ease-out;
    transform-origin: left center;
}

.navigation-right .indicator-line,
.navigation-left .indicator-line {
    @apply h-0.5 w-full top-1/2 left-0;
    @apply transform -translate-y-1/2;
}

.navigation-up .indicator-line,
.navigation-down .indicator-line {
    @apply w-0.5 h-full left-1/2 top-0;
    @apply transform -translate-x-1/2;
    transform-origin: center top;
}

.indicator-dot {
    @apply absolute w-2 h-2 rounded-full bg-blue-500;
    @apply transition-transform duration-300 ease-out;
    @apply top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
}

/* 导航标签 */
.navigation-label {
    @apply absolute -bottom-6 left-1/2 transform -translate-x-1/2;
    @apply whitespace-nowrap;
}

.label-text {
    @apply text-xs text-gray-600 dark:text-gray-400 font-medium;
}

/* 方向箭头 */
.navigation-arrow {
    @apply absolute transition-all duration-300;
}

.arrow-right {
    @apply -right-6 top-1/2 transform -translate-y-1/2;
}

.arrow-left {
    @apply -left-6 top-1/2 transform -translate-y-1/2;
}

.arrow-up {
    @apply -top-6 left-1/2 transform -translate-x-1/2;
}

.arrow-down {
    @apply -bottom-6 left-1/2 transform -translate-x-1/2;
}

.arrow-icon {
    @apply text-gray-400 transition-colors duration-200;
}

.arrow-active .arrow-icon {
    @apply text-blue-500;
}

/* 状态样式 */
.navigation-active {
    @apply scale-110;
}

.navigation-animating {
    @apply scale-105;
}

.navigation-completed {
    @apply scale-100;
}

/* 指示器类型样式 */
.indicator-dot .indicator-line {
    @apply hidden;
}

.indicator-line .indicator-dot {
    @apply hidden;
}

.indicator-arrow .indicator-line,
.indicator-arrow .indicator-dot {
    @apply hidden;
}

.indicator-custom .indicator-line,
.indicator-custom .indicator-dot {
    @apply hidden;
}

/* 方向特定样式 */
.navigation-left {
    @apply transform rotate-180;
}

.navigation-up {
    @apply transform -rotate-90;
}

.navigation-down {
    @apply transform rotate-90;
}

/* 悬停效果 */
.navigation-switch-animation:hover {
    @apply scale-105;
}

.navigation-switch-animation:hover .arrow-icon {
    @apply text-blue-600;
}

.navigation-switch-animation:hover .label-text {
    @apply text-gray-800 dark:text-gray-200;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .navigation-arrow {
        @apply hidden;
    }

    .navigation-label {
        @apply -bottom-5;
    }

    .label-text {
        @apply text-xs;
    }
}

/* 动画效果 */
@keyframes navigation-pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

.navigation-animating .navigation-animation {
    animation: navigation-pulse 0.6s ease-in-out;
}

/* 指示器动画 */
@keyframes indicator-slide {
    0% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
}

.navigation-active .indicator-line {
    animation: indicator-slide 0.3s ease-out;
}

@keyframes dot-bounce {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.navigation-active .indicator-dot {
    animation: dot-bounce 0.4s ease-out;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .indicator-line,
    .indicator-dot {
        @apply bg-blue-400;
    }

    .arrow-active .arrow-icon {
        @apply text-blue-400;
    }
}
</style>
