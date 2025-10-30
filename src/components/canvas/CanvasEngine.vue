<template>
    <div
        ref="containerRef"
        class="relative w-full h-full overflow-hidden"
        :class="containerClasses">
        <canvas
            ref="canvasRef"
            class="absolute inset-0 w-full h-full"
            :width="canvasWidth"
            :height="canvasHeight"
            :style="canvasStyle"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @click="handleClick" />

        <!-- 性能监控面板 -->
        <div
            v-if="showStats && stats"
            class="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm font-mono">
            <div>FPS: {{ stats.fps.toFixed(1) }}</div>
            <div>粒子: {{ stats.particleCount }}</div>
            <div>图形: {{ stats.shapeCount }}</div>
            <div>渲染时间: {{ stats.renderTime.toFixed(2) }}ms</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    watch,
    nextTick,
} from "vue";
import type { ICanvasConfig, ICanvasEvent, IRenderStats } from "@/types";

// 组件属性定义
interface Props {
    /** 画布配置 */
    config?: Partial<ICanvasConfig>;
    /** 是否显示性能统计 */
    showStats?: boolean;
    /** 是否启用交互 */
    enableInteraction?: boolean;
    /** 容器样式类 */
    containerClass?: string;
    /** 是否自动开始渲染 */
    autoStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    config: () => ({}),
    showStats: false,
    enableInteraction: true,
    containerClass: "",
    autoStart: true,
});

// 事件定义
interface Emits {
    canvasReady: [ctx: CanvasRenderingContext2D];
    canvasEvent: [event: ICanvasEvent];
    statsUpdate: [stats: IRenderStats];
    renderFrame: [deltaTime: number];
}

const emit = defineEmits<Emits>();

// 响应式引用
const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D>();

// 渲染状态
const isRendering = ref(false);
const animationId = ref<number>();
const lastFrameTime = ref(0);
const frameCount = ref(0);
const fpsUpdateTime = ref(0);

// 性能统计
const stats = ref<IRenderStats>({
    fps: 0,
    particleCount: 0,
    shapeCount: 0,
    renderTime: 0,
    memoryUsage: 0,
});

// 画布配置
const defaultConfig: ICanvasConfig = {
    width: 800,
    height: 600,
    pixelRatio: window.devicePixelRatio || 1,
    alpha: true,
    backgroundColor: "transparent",
};

const canvasConfig = computed<ICanvasConfig>(() => ({
    ...defaultConfig,
    ...props.config,
}));

// 计算属性
const canvasWidth = computed(
    () => canvasConfig.value.width * canvasConfig.value.pixelRatio,
);
const canvasHeight = computed(
    () => canvasConfig.value.height * canvasConfig.value.pixelRatio,
);

const canvasStyle = computed(() => ({
    width: `${canvasConfig.value.width}px`,
    height: `${canvasConfig.value.height}px`,
}));

const containerClasses = computed(() => [
    props.containerClass,
    {
        "cursor-pointer": props.enableInteraction,
    },
]);

// 初始化 Canvas
const initCanvas = async () => {
    if (!canvasRef.value) return;

    const canvas = canvasRef.value;
    const context = canvas.getContext("2d", {
        alpha: canvasConfig.value.alpha,
    });

    if (!context) {
        console.error("无法获取 Canvas 2D 上下文");
        return;
    }

    ctx.value = context;

    // 设置高分辨率适配
    const { width, height, pixelRatio } = canvasConfig.value;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // 缩放上下文以适配高分辨率
    context.scale(pixelRatio, pixelRatio);

    // 设置默认样式
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    // 清空画布
    clearCanvas();

    // 触发就绪事件
    emit("canvasReady", context);

    // 自动开始渲染
    if (props.autoStart) {
        startRenderLoop();
    }
};

// 清空画布
const clearCanvas = () => {
    if (!ctx.value) return;

    const { width, height, backgroundColor } = canvasConfig.value;

    if (backgroundColor && backgroundColor !== "transparent") {
        ctx.value.fillStyle = backgroundColor;
        ctx.value.fillRect(0, 0, width, height);
    } else {
        ctx.value.clearRect(0, 0, width, height);
    }
};

// 渲染循环
const renderLoop = (currentTime: number) => {
    if (!isRendering.value) return;

    const deltaTime = currentTime - lastFrameTime.value;
    lastFrameTime.value = currentTime;

    // 性能监控
    const renderStart = performance.now();

    // 清空画布
    clearCanvas();

    // 触发渲染帧事件
    emit("renderFrame", deltaTime);

    // 计算渲染时间
    const renderEnd = performance.now();
    stats.value.renderTime = renderEnd - renderStart;

    // 更新帧率统计
    frameCount.value++;
    if (currentTime - fpsUpdateTime.value >= 1000) {
        stats.value.fps = frameCount.value;
        frameCount.value = 0;
        fpsUpdateTime.value = currentTime;

        // 触发统计更新事件
        emit("statsUpdate", stats.value);
    }

    // 继续下一帧
    animationId.value = requestAnimationFrame(renderLoop);
};

// 开始渲染循环
const startRenderLoop = () => {
    if (isRendering.value) return;

    isRendering.value = true;
    lastFrameTime.value = performance.now();
    fpsUpdateTime.value = performance.now();
    frameCount.value = 0;

    animationId.value = requestAnimationFrame(renderLoop);
};

// 停止渲染循环
const stopRenderLoop = () => {
    isRendering.value = false;

    if (animationId.value) {
        cancelAnimationFrame(animationId.value);
        animationId.value = undefined;
    }
};

// 响应式尺寸调整
const resizeCanvas = () => {
    if (!containerRef.value || !canvasRef.value) return;

    const container = containerRef.value;
    container.getBoundingClientRect();

    // 重新初始化 Canvas
    nextTick(() => {
        initCanvas();
    });
};

// 坐标转换工具
const getCanvasPosition = (
    clientX: number,
    clientY: number,
): { x: number; y: number } => {
    if (!canvasRef.value) return { x: 0, y: 0 };

    const rect = canvasRef.value.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};

// 事件处理器
const createCanvasEvent = (
    type: ICanvasEvent["type"],
    originalEvent: Event,
): ICanvasEvent => {
    const mouseEvent = originalEvent as MouseEvent;
    const touchEvent = originalEvent as TouchEvent;

    let clientX = 0;
    let clientY = 0;

    if (mouseEvent.clientX !== undefined) {
        clientX = mouseEvent.clientX;
        clientY = mouseEvent.clientY!;
    } else if (touchEvent.touches && touchEvent.touches.length > 0) {
        const touch = touchEvent.touches[0];
        if (touch) {
            clientX = touch.clientX;
            clientY = touch.clientY;
        }
    }

    const canvasPosition = getCanvasPosition(clientX, clientY);

    return {
        type,
        canvasPosition,
        screenPosition: { x: clientX, y: clientY },
        timestamp: Date.now(),
        originalEvent,
    };
};

const handleMouseDown = (event: MouseEvent) => {
    if (!props.enableInteraction) return;
    emit("canvasEvent", createCanvasEvent("mousedown", event));
};

const handleMouseMove = (event: MouseEvent) => {
    if (!props.enableInteraction) return;
    emit("canvasEvent", createCanvasEvent("mousemove", event));
};

const handleMouseUp = (event: MouseEvent) => {
    if (!props.enableInteraction) return;
    emit("canvasEvent", createCanvasEvent("mouseup", event));
};

const handleTouchStart = (event: TouchEvent) => {
    if (!props.enableInteraction) return;
    event.preventDefault();
    emit("canvasEvent", createCanvasEvent("touchstart", event));
};

const handleTouchMove = (event: TouchEvent) => {
    if (!props.enableInteraction) return;
    event.preventDefault();
    emit("canvasEvent", createCanvasEvent("touchmove", event));
};

const handleTouchEnd = (event: TouchEvent) => {
    if (!props.enableInteraction) return;
    event.preventDefault();
    emit("canvasEvent", createCanvasEvent("touchend", event));
};

const handleClick = (event: MouseEvent) => {
    if (!props.enableInteraction) return;
    emit("canvasEvent", createCanvasEvent("click", event));
};

// 公共方法
const getContext = () => ctx.value;
const getCanvas = () => canvasRef.value;
const getStats = () => stats.value;
const isRenderingActive = () => isRendering.value;

// 监听配置变化
watch(
    () => canvasConfig.value,
    () => {
        nextTick(() => {
            initCanvas();
        });
    },
    { deep: true },
);

// 监听窗口大小变化
let resizeObserver: ResizeObserver | null = null;

// 生命周期
onMounted(() => {
    initCanvas();

    // 设置响应式监听
    if (containerRef.value && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
        });
        resizeObserver.observe(containerRef.value);
    }
});

onBeforeUnmount(() => {
    stopRenderLoop();

    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
});

// 暴露给父组件的方法
defineExpose({
    getContext,
    getCanvas,
    getStats,
    startRenderLoop,
    stopRenderLoop,
    clearCanvas,
    isRenderingActive,
    resizeCanvas,
});
</script>

<style scoped>
/* Canvas 容器样式 */
.canvas-container {
    /* 确保容器可以正确计算尺寸 */
    position: relative;
    display: block;
}

/* 禁用触摸设备上的默认行为 */
canvas {
    touch-action: none;
    user-select: none;
}
</style>
