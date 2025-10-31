<!-- 交互确认动画管理器 -->
<template>
    <div :class="containerClasses" :style="containerStyle">
        <!-- 按钮点击确认动画 -->
        <ButtonClickAnimation
            v-if="showButtonClick"
            v-bind="buttonClickProps"
            @click="handleButtonClick"
            @animation-complete="handleButtonAnimationComplete"
            @state-change="handleButtonStateChange" />

        <!-- 表单提交成功动画 -->
        <FormSuccessAnimation
            v-if="showFormSuccess"
            v-bind="formSuccessProps"
            @complete="handleFormSuccessComplete"
            @continue="handleFormSuccessContinue"
            @close="handleFormSuccessClose" />

        <!-- 导航切换指示动画 -->
        <NavigationSwitchAnimation
            v-if="showNavigationSwitch"
            v-bind="navigationSwitchProps"
            @switch-start="handleNavigationSwitchStart"
            @switch-complete="handleNavigationSwitchComplete" />

        <!-- 加载状态动画 -->
        <LoadingStateAnimation
            v-if="showLoadingState"
            v-bind="loadingStateProps"
            @loading-start="handleLoadingStart"
            @loading-end="handleLoadingEnd"
            @state-change="handleLoadingStateChange" />

        <!-- 自定义交互动画插槽 -->
        <div v-if="$slots.custom" class="custom-animations">
            <slot name="custom" :manager="animationManager"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick } from "vue";
import ButtonClickAnimation from "./ButtonClickAnimation.vue";
import FormSuccessAnimation from "./FormSuccessAnimation.vue";
import NavigationSwitchAnimation from "./NavigationSwitchAnimation.vue";
import LoadingStateAnimation from "./LoadingStateAnimation.vue";

// 动画类型枚举
export type ConfirmationAnimationType =
    | "button-click"
    | "form-success"
    | "navigation-switch"
    | "loading-state"
    | "all";

// 动画状态枚举
export type ConfirmationAnimationStatus =
    | "idle"
    | "preparing"
    | "playing"
    | "completed"
    | "error";

// 组件属性接口
interface Props {
    /** 要显示的动画类型 */
    type?: ConfirmationAnimationType;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 动画配置 */
    config?: {
        buttonClick?: any;
        formSuccess?: any;
        navigationSwitch?: any;
        loadingState?: any;
    };
    /** 是否禁用所有动画 */
    disabled?: boolean;
    /** 动画延迟（毫秒） */
    delay?: number;
    /** 自定义样式类 */
    class?: string;
}

// 组件事件接口
interface Emits {
    /** 动画开始播放 */
    (e: "animation-start", type: ConfirmationAnimationType): void;
    /** 动画播放完成 */
    (e: "animation-complete", type: ConfirmationAnimationType): void;
    /** 按钮点击事件 */
    (e: "button-click"): void;
    /** 表单提交成功 */
    (e: "form-success"): void;
    /** 导航切换 */
    (e: "navigation-switch", direction: string): void;
    /** 加载状态变化 */
    (e: "loading-change", loading: boolean): void;
    /** 状态变化 */
    (e: "status-change", status: ConfirmationAnimationStatus): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    type: "all",
    autoplay: false,
    config: () => ({}),
    disabled: false,
    delay: 0,
});

const emit = defineEmits<Emits>();

// 响应式状态
const currentStatus = ref<ConfirmationAnimationStatus>("idle");
const activeAnimations = reactive(new Set<ConfirmationAnimationType>());
const animationQueue = ref<ConfirmationAnimationType[]>([]);

// 动画管理器
const animationManager = reactive({
    // 播放指定类型的动画
    play: (type: ConfirmationAnimationType) => {
        playAnimation(type);
    },
    // 停止所有动画
    stopAll: () => {
        stopAllAnimations();
    },
    // 获取当前状态
    getStatus: () => currentStatus.value,
    // 获取活跃的动画
    getActiveAnimations: () => Array.from(activeAnimations),
    // 清空动画队列
    clearQueue: () => {
        animationQueue.value = [];
    },
});

// 计算属性
const showButtonClick = computed(() => {
    return (
        !props.disabled &&
        (props.type === "button-click" || props.type === "all")
    );
});

const showFormSuccess = computed(() => {
    return (
        !props.disabled &&
        (props.type === "form-success" || props.type === "all")
    );
});

const showNavigationSwitch = computed(() => {
    return (
        !props.disabled &&
        (props.type === "navigation-switch" || props.type === "all")
    );
});

const showLoadingState = computed(() => {
    return (
        !props.disabled &&
        (props.type === "loading-state" || props.type === "all")
    );
});

const containerClasses = computed(() => {
    return [
        "interaction-confirmation-manager",
        `manager-type-${props.type}`,
        `manager-status-${currentStatus.value}`,
        props.class,
        {
            "manager-disabled": props.disabled,
            "manager-autoplay": props.autoplay,
            "manager-has-active": activeAnimations.size > 0,
        },
    ];
});

const containerStyle = computed(() => {
    return {
        // 可以在这里添加动态样式
    };
});

// 动画属性配置
const buttonClickProps = computed(() => {
    return {
        autoplay: props.autoplay,
        showClickAnimation: true,
        ...props.config.buttonClick,
    };
});

const formSuccessProps = computed(() => {
    return {
        visible: activeAnimations.has("form-success"),
        autoplay: props.autoplay,
        ...props.config.formSuccess,
    };
});

const navigationSwitchProps = computed(() => {
    return {
        active: activeAnimations.has("navigation-switch"),
        autoplay: props.autoplay,
        ...props.config.navigationSwitch,
    };
});

const loadingStateProps = computed(() => {
    return {
        loading: activeAnimations.has("loading-state"),
        autoplay: props.autoplay,
        ...props.config.loadingState,
    };
});

// 方法
const setStatus = (status: ConfirmationAnimationStatus) => {
    if (currentStatus.value !== status) {
        currentStatus.value = status;
        emit("status-change", status);
    }
};

const playAnimation = async (type: ConfirmationAnimationType) => {
    if (props.disabled) return;

    try {
        // 设置延迟
        if (props.delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, props.delay));
        }

        // 添加到活跃动画集合
        activeAnimations.add(type);
        setStatus("playing");

        emit("animation-start", type);

        // 根据类型触发相应的动画
        switch (type) {
            case "button-click":
                // 按钮点击动画会自动触发
                break;
            case "form-success":
                // 表单成功动画通过 visible 属性控制
                break;
            case "navigation-switch":
                // 导航切换动画通过 active 属性控制
                break;
            case "loading-state":
                // 加载状态动画通过 loading 属性控制
                break;
            case "all":
                // 播放所有动画
                playAnimation("button-click");
                await new Promise((resolve) => setTimeout(resolve, 200));
                playAnimation("form-success");
                await new Promise((resolve) => setTimeout(resolve, 200));
                playAnimation("navigation-switch");
                await new Promise((resolve) => setTimeout(resolve, 200));
                playAnimation("loading-state");
                break;
        }
    } catch (error) {
        console.error("播放交互确认动画失败:", error);
        setStatus("error");
        activeAnimations.delete(type);
    }
};

const stopAnimation = (type: ConfirmationAnimationType) => {
    activeAnimations.delete(type);

    if (activeAnimations.size === 0) {
        setStatus("idle");
    }

    emit("animation-complete", type);
};

const stopAllAnimations = () => {
    activeAnimations.clear();
    animationQueue.value = [];
    setStatus("idle");
};

const queueAnimation = (type: ConfirmationAnimationType) => {
    if (!animationQueue.value.includes(type)) {
        animationQueue.value.push(type);
    }
};

const processQueue = async () => {
    if (animationQueue.value.length === 0) return;

    const nextAnimation = animationQueue.value.shift();
    if (nextAnimation) {
        await playAnimation(nextAnimation);
        // 递归处理队列中的下一个动画
        setTimeout(processQueue, 100);
    }
};

// 事件处理方法
const handleButtonClick = () => {
    emit("button-click");
};

const handleButtonAnimationComplete = () => {
    stopAnimation("button-click");
};

const handleButtonStateChange = () => {
    // 处理按钮状态变化
};

const handleFormSuccessComplete = () => {
    stopAnimation("form-success");
    emit("form-success");
};

const handleFormSuccessContinue = () => {
    emit("form-success");
};

const handleFormSuccessClose = () => {
    stopAnimation("form-success");
};

const handleNavigationSwitchStart = (direction: string) => {
    emit("navigation-switch", direction);
};

const handleNavigationSwitchComplete = () => {
    stopAnimation("navigation-switch");
};

const handleLoadingStart = () => {
    emit("loading-change", true);
};

const handleLoadingEnd = () => {
    stopAnimation("loading-state");
    emit("loading-change", false);
};

const handleLoadingStateChange = () => {
    // 处理加载状态变化
};

// 监听属性变化
watch(
    () => props.type,
    (newType) => {
        // 当类型改变时，停止所有动画并重新开始
        stopAllAnimations();
        if (props.autoplay && newType !== "all") {
            nextTick(() => {
                playAnimation(newType);
            });
        }
    },
);

watch(
    () => props.autoplay,
    (autoplay) => {
        if (autoplay && props.type !== "all") {
            playAnimation(props.type);
        }
    },
);

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) {
            stopAllAnimations();
        }
    },
);

// 暴露方法给父组件
defineExpose({
    playAnimation,
    stopAnimation,
    stopAllAnimations,
    queueAnimation,
    animationManager,
    currentStatus,
    activeAnimations,
});
</script>

<style scoped>
.interaction-confirmation-manager {
    @apply relative flex flex-col items-center justify-center;
    @apply transition-all duration-300 ease-out;
}

/* 管理器类型样式 */
.manager-type-button-click {
    @apply inline-flex;
}

.manager-type-form-success {
    @apply w-full;
}

.manager-type-navigation-switch {
    @apply inline-flex;
}

.manager-type-loading-state {
    @apply w-full;
}

.manager-type-all {
    @apply w-full space-y-4;
}

/* 管理器状态样式 */
.manager-status-idle {
    @apply opacity-100;
}

.manager-status-preparing {
    @apply opacity-90;
}

.manager-status-playing {
    @apply opacity-100 scale-105;
}

.manager-status-completed {
    @apply opacity-100;
}

.manager-status-error {
    @apply opacity-75;
}

/* 禁用状态 */
.manager-disabled {
    @apply opacity-50 pointer-events-none;
}

/* 自动播放状态 */
.manager-autoplay {
    @apply cursor-default;
}

/* 有活跃动画时的样式 */
.manager-has-active {
    @apply ring-2 ring-blue-500 ring-opacity-30 rounded-lg;
}

/* 自定义动画容器 */
.custom-animations {
    @apply mt-4 w-full;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .interaction-confirmation-manager {
        @apply scale-90;
    }

    .manager-type-all {
        @apply space-y-2;
    }
}

/* 动画效果 */
@keyframes manager-pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.02);
        opacity: 0.9;
    }
}

.manager-status-playing {
    animation: manager-pulse 2s ease-in-out infinite;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .manager-has-active {
        @apply ring-blue-400 ring-opacity-40;
    }
}
</style>
