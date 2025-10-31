<template>
    <div
        ref="containerRef"
        :class="containerClasses"
        :style="containerStyle"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import lottie, { type AnimationItem } from "lottie-web";

// 定义组件属性接口
interface Props {
    /** 动画数据源，可以是 JSON 对象或文件路径 */
    animationData?: object;
    /** 动画文件路径 */
    path?: string;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean | number;
    /** 播放速度 */
    speed?: number;
    /** 渲染器类型 */
    renderer?: "svg" | "canvas" | "html";
    /** 组件宽度 */
    width?: number | string;
    /** 组件高度 */
    height?: number | string;
    /** 自定义样式类 */
    class?: string;
    /** 是否启用悬停播放 */
    hoverPlay?: boolean;
    /** 播放方向 */
    direction?: 1 | -1;
    /** 播放段落 [开始帧, 结束帧] */
    segments?: [number, number];
}

// 定义事件接口
interface Emits {
    /** 动画加载完成 */
    (e: "ready", animation: AnimationItem): void;
    /** 动画播放完成 */
    (e: "complete"): void;
    /** 动画播放开始 */
    (e: "play"): void;
    /** 动画暂停 */
    (e: "pause"): void;
    /** 动画停止 */
    (e: "stop"): void;
    /** 动画加载错误 */
    (e: "error", error: Error): void;
    /** 动画帧更新 */
    (e: "frame", frame: number): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    autoplay: true,
    loop: true,
    speed: 1,
    renderer: "svg",
    width: "100%",
    height: "100%",
    hoverPlay: false,
    direction: 1,
});

const emit = defineEmits<Emits>();

// 响应式引用
const containerRef = ref<HTMLDivElement>();
const animation = ref<AnimationItem | null>(null);
const isLoading = ref(false);
const isPlaying = ref(false);
const currentFrame = ref(0);

// 计算属性
const containerClasses = computed(() => {
    return [
        "lottie-container",
        props.class,
        {
            "lottie-loading": isLoading.value,
            "lottie-playing": isPlaying.value,
        },
    ];
});

const containerStyle = computed(() => {
    return {
        width:
            typeof props.width === "number" ? `${props.width}px` : props.width,
        height:
            typeof props.height === "number"
                ? `${props.height}px`
                : props.height,
    };
});

// 初始化动画
const initAnimation = async () => {
    if (!containerRef.value) return;

    try {
        isLoading.value = true;

        // 清理现有动画
        if (animation.value) {
            animation.value.destroy();
            animation.value = null;
        }

        // 准备动画配置
        const config: any = {
            container: containerRef.value,
            renderer: props.renderer,
            loop: props.loop,
            autoplay: props.autoplay,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
                clearCanvas: true,
                progressiveLoad: true,
                hideOnTransparent: true,
            },
        };

        // 设置动画数据源
        if (props.animationData) {
            config.animationData = props.animationData;
        } else if (props.path) {
            config.path = props.path;
        } else {
            throw new Error("必须提供 animationData 或 path 属性");
        }

        // 创建动画实例
        animation.value = lottie.loadAnimation(config);

        // 设置播放参数
        animation.value.setSpeed(props.speed);
        animation.value.setDirection(props.direction);

        // 绑定事件监听器
        setupEventListeners();

        // 如果指定了播放段落，设置播放范围
        if (props.segments) {
            animation.value.playSegments(props.segments, true);
        }

        emit("ready", animation.value);
    } catch (error) {
        console.error("Lottie 动画初始化失败:", error);
        emit("error", error as Error);
    } finally {
        isLoading.value = false;
    }
};

// 设置事件监听器
const setupEventListeners = () => {
    if (!animation.value) return;

    animation.value.addEventListener("complete", () => {
        isPlaying.value = false;
        emit("complete");
    });

    animation.value.addEventListener("loopComplete", () => {
        emit("complete");
    });

    animation.value.addEventListener("enterFrame", (event: any) => {
        currentFrame.value = event.currentTime;
        emit("frame", event.currentTime);
    });

    animation.value.addEventListener("segmentStart", () => {
        isPlaying.value = true;
        emit("play");
    });

    animation.value.addEventListener("data_ready", () => {
        isLoading.value = false;
    });

    animation.value.addEventListener("data_failed", (error: any) => {
        isLoading.value = false;
        emit("error", new Error("动画数据加载失败"));
    });
};

// 播放控制方法
const play = () => {
    if (animation.value) {
        animation.value.play();
        isPlaying.value = true;
        emit("play");
    }
};

const pause = () => {
    if (animation.value) {
        animation.value.pause();
        isPlaying.value = false;
        emit("pause");
    }
};

const stop = () => {
    if (animation.value) {
        animation.value.stop();
        isPlaying.value = false;
        currentFrame.value = 0;
        emit("stop");
    }
};

const goToAndStop = (frame: number) => {
    if (animation.value) {
        animation.value.goToAndStop(frame, true);
        currentFrame.value = frame;
        isPlaying.value = false;
    }
};

const goToAndPlay = (frame: number) => {
    if (animation.value) {
        animation.value.goToAndPlay(frame, true);
        currentFrame.value = frame;
        isPlaying.value = true;
        emit("play");
    }
};

const setSpeed = (speed: number) => {
    if (animation.value) {
        animation.value.setSpeed(speed);
    }
};

const setDirection = (direction: 1 | -1) => {
    if (animation.value) {
        animation.value.setDirection(direction);
    }
};

const playSegments = (segments: [number, number], forceFlag?: boolean) => {
    if (animation.value) {
        animation.value.playSegments(segments, forceFlag);
        isPlaying.value = true;
        emit("play");
    }
};

// 悬停事件处理
const handleMouseEnter = () => {
    if (props.hoverPlay && !isPlaying.value) {
        play();
    }
};

const handleMouseLeave = () => {
    if (props.hoverPlay && isPlaying.value) {
        pause();
    }
};

// 监听属性变化
watch(
    () => props.speed,
    (newSpeed) => {
        setSpeed(newSpeed);
    },
);

watch(
    () => props.direction,
    (newDirection) => {
        setDirection(newDirection);
    },
);

watch(
    () => [props.animationData, props.path],
    () => {
        initAnimation();
    },
    { deep: true },
);

// 暴露方法给父组件
defineExpose({
    play,
    pause,
    stop,
    goToAndStop,
    goToAndPlay,
    setSpeed,
    setDirection,
    playSegments,
    animation: animation.value,
    isPlaying,
    currentFrame,
});

// 生命周期钩子
onMounted(() => {
    initAnimation();
});

onBeforeUnmount(() => {
    if (animation.value) {
        animation.value.destroy();
        animation.value = null;
    }
});
</script>

<style scoped>
.lottie-container {
    @apply relative overflow-hidden;
}

.lottie-loading {
    @apply opacity-50;
}

.lottie-playing {
    @apply opacity-100;
}

/* 确保 SVG 渲染器的样式 */
.lottie-container :deep(svg) {
    @apply w-full h-full;
}

/* Canvas 渲染器的样式 */
.lottie-container :deep(canvas) {
    @apply w-full h-full;
}
</style>
