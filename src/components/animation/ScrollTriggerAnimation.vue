<template>
    <div class="scroll-trigger-container">
        <!-- 滚动进度指示器 -->
        <div
            v-if="showProgress"
            class="scroll-progress-indicator"
            :class="progressClasses">
            <!-- 水平进度条 -->
            <div
                v-if="progressType === 'horizontal'"
                ref="progressBarRef"
                class="progress-bar horizontal"
                :style="progressStyle"></div>

            <!-- 垂直进度条 -->
            <div
                v-else-if="progressType === 'vertical'"
                ref="progressBarRef"
                class="progress-bar vertical"
                :style="progressStyle"></div>

            <!-- 圆形进度条 -->
            <svg
                v-else-if="progressType === 'circular'"
                class="progress-circle"
                :width="circularSize"
                :height="circularSize"
                viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    stroke-width="2" />
                <circle
                    ref="progressBarRef"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    :stroke="progressColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    class="progress-stroke" />
            </svg>
        </div>

        <!-- 内容插槽 -->
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import {
    useScrollTrigger,
    type IScrollTriggerConfig,
    type IParallaxConfig,
} from "@/composables/useScrollTrigger";

interface Props {
    /** 是否显示滚动进度指示器 */
    showProgress?: boolean;
    /** 进度条类型 */
    progressType?: "horizontal" | "vertical" | "circular";
    /** 进度条位置 */
    progressPosition?:
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "top-right"
        | "bottom-right";
    /** 进度条颜色 */
    progressColor?: string;
    /** 圆形进度条大小 */
    circularSize?: number;
    /** 是否启用调试模式 */
    debug?: boolean;
    /** 自动创建进入动画的选择器 */
    autoAnimateSelector?: string;
    /** 视差配置 */
    parallaxConfig?: IParallaxConfig[];
}

const props = withDefaults(defineProps<Props>(), {
    showProgress: false,
    progressType: "horizontal",
    progressPosition: "top",
    progressColor: "#3b82f6",
    circularSize: 60,
    debug: false,
    autoAnimateSelector: "",
    parallaxConfig: () => [],
});

// 组件引用
const progressBarRef = ref<HTMLElement>();

// 使用 ScrollTrigger 组合式函数
const {
    createScrollTrigger,
    createEnterAnimation,
    createParallax,
    createScrollProgress,
    createBatchAnimation,
    refresh,
    cleanup,
    getScrollProgress,
} = useScrollTrigger();

// 计算属性
const progressClasses = computed(() => [
    "progress-indicator",
    `position-${props.progressPosition}`,
    {
        "debug-mode": props.debug,
    },
]);

const progressStyle = computed(() => ({
    backgroundColor: props.progressColor,
    "--progress-color": props.progressColor,
}));

// 响应式数据
const scrollProgress = ref(0);
const isScrolling = ref(false);

// 滚动事件处理
let scrollTimeout: number;

const handleScroll = () => {
    isScrolling.value = true;
    scrollProgress.value = getScrollProgress();

    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(() => {
        isScrolling.value = false;
    }, 150);
};

// 初始化滚动动画
const initializeScrollAnimations = () => {
    // 创建滚动进度指示器
    if (props.showProgress && progressBarRef.value) {
        createScrollProgress({
            progressBar: progressBarRef.value,
            type: props.progressType,
            style: {
                backgroundColor: props.progressColor,
            },
        });
    }

    // 自动创建进入动画
    if (props.autoAnimateSelector) {
        createEnterAnimation(
            props.autoAnimateSelector,
            {
                duration: 0.8,
                ease: "power2.out",
            },
            {
                markers: props.debug,
            },
        );
    }

    // 创建视差效果
    if (props.parallaxConfig.length > 0) {
        createParallax(props.parallaxConfig);
    }
};

// 公共方法
const addScrollTrigger = (config: IScrollTriggerConfig) => {
    return createScrollTrigger({
        ...config,
        markers: props.debug || config.markers,
    });
};

const addEnterAnimation = (
    selector: string,
    animation?: any,
    triggerConfig?: Partial<IScrollTriggerConfig>,
) => {
    return createEnterAnimation(selector, animation, {
        ...triggerConfig,
        markers: props.debug || triggerConfig?.markers,
    });
};

const addParallaxEffect = (configs: IParallaxConfig[]) => {
    return createParallax(configs);
};

const addBatchAnimation = (
    selector: string,
    animation: any,
    batchConfig?: any,
) => {
    return createBatchAnimation(selector, animation, batchConfig);
};

// 监听属性变化
watch(
    () => props.parallaxConfig,
    (newConfig) => {
        if (newConfig.length > 0) {
            createParallax(newConfig);
        }
    },
    { deep: true },
);

// 生命周期
onMounted(() => {
    // 添加滚动事件监听
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 延迟初始化以确保 DOM 完全加载
    setTimeout(() => {
        initializeScrollAnimations();
        refresh();
    }, 100);
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
    clearTimeout(scrollTimeout);
    cleanup();
});

// 暴露方法给父组件
defineExpose({
    addScrollTrigger,
    addEnterAnimation,
    addParallaxEffect,
    addBatchAnimation,
    refresh,
    cleanup,
    scrollProgress,
    isScrolling,
});
</script>

<style scoped>
.scroll-trigger-container {
    position: relative;
    width: 100%;
    height: 100%;
}

/* 进度指示器基础样式 */
.scroll-progress-indicator {
    position: fixed;
    z-index: 1000;
    pointer-events: none;
}

/* 水平进度条 */
.progress-indicator.position-top {
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
}

.progress-indicator.position-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
}

.progress-bar.horizontal {
    width: 100%;
    height: 100%;
    transform-origin: left center;
    transition: background-color 0.3s ease;
}

/* 垂直进度条 */
.progress-indicator.position-left {
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
}

.progress-indicator.position-right {
    top: 0;
    right: 0;
    bottom: 0;
    width: 3px;
}

.progress-bar.vertical {
    width: 100%;
    height: 100%;
    transform-origin: center top;
    transition: background-color 0.3s ease;
}

/* 圆形进度条 */
.progress-indicator.position-top-right {
    top: 20px;
    right: 20px;
}

.progress-indicator.position-bottom-right {
    bottom: 20px;
    right: 20px;
}

.progress-circle {
    transform: rotate(-90deg);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.progress-stroke {
    transition: stroke 0.3s ease;
}

/* 调试模式样式 */
.debug-mode {
    border: 2px dashed rgba(255, 0, 0, 0.5);
}

.debug-mode::before {
    content: "ScrollTrigger Debug";
    position: absolute;
    top: -25px;
    left: 0;
    font-size: 12px;
    color: red;
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .progress-indicator.position-top-right,
    .progress-indicator.position-bottom-right {
        right: 10px;
    }

    .progress-indicator.position-top-right {
        top: 10px;
    }

    .progress-indicator.position-bottom-right {
        bottom: 10px;
    }

    .progress-circle {
        width: 40px;
        height: 40px;
    }
}

/* 动画效果 */
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}

.progress-bar,
.progress-stroke {
    animation: pulse 2s ease-in-out infinite;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    .progress-circle circle:first-child {
        stroke: rgba(255, 255, 255, 0.2);
    }
}
</style>
