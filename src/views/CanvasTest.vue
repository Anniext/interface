<template>
    <div class="canvas-test-page min-h-screen bg-gray-900 text-white p-4">
        <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">
                Canvas 渲染引擎测试
            </h1>

            <!-- 控制面板 -->
            <div class="mb-6 p-4 bg-gray-800 rounded-lg">
                <div class="flex flex-wrap gap-4 items-center">
                    <button
                        @click="toggleRendering"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                        {{ isRendering ? "停止渲染" : "开始渲染" }}
                    </button>

                    <button
                        @click="clearCanvas"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                        清空画布
                    </button>

                    <button
                        @click="toggleStats"
                        class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors">
                        {{ showStats ? "隐藏统计" : "显示统计" }}
                    </button>

                    <label class="flex items-center gap-2">
                        <span>渲染质量:</span>
                        <select
                            v-model="renderQuality"
                            @change="updateRenderQuality"
                            class="px-2 py-1 bg-gray-700 rounded">
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                    </label>
                </div>
            </div>

            <!-- Canvas 容器 -->
            <div
                class="canvas-container bg-black rounded-lg overflow-hidden"
                style="height: 600px">
                <CanvasEngine
                    ref="canvasEngineRef"
                    :config="canvasConfig"
                    :show-stats="showStats"
                    :enable-interaction="true"
                    container-class="w-full h-full"
                    @canvas-ready="onCanvasReady"
                    @canvas-event="onCanvasEvent"
                    @stats-update="onStatsUpdate"
                    @render-frame="onRenderFrame" />
            </div>

            <!-- 事件日志 -->
            <div class="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">事件日志</h3>
                <div class="max-h-40 overflow-y-auto">
                    <div
                        v-for="(log, index) in eventLogs"
                        :key="index"
                        class="text-sm text-gray-300 mb-1">
                        <span class="text-blue-400">[{{ log.time }}]</span>
                        <span class="text-green-400 ml-2">{{ log.type }}:</span>
                        <span class="ml-2">{{ log.message }}</span>
                    </div>
                </div>
            </div>

            <!-- 性能信息 -->
            <div
                v-if="currentStats"
                class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        帧率
                    </h4>
                    <div class="text-2xl font-bold text-green-400">
                        {{ currentStats.fps.toFixed(1) }} FPS
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        渲染时间
                    </h4>
                    <div class="text-2xl font-bold text-blue-400">
                        {{ currentStats.renderTime.toFixed(2) }}ms
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        粒子数量
                    </h4>
                    <div class="text-2xl font-bold text-purple-400">
                        {{ currentStats.particleCount }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        内存使用
                    </h4>
                    <div class="text-2xl font-bold text-orange-400">
                        {{ currentStats.memoryUsage.toFixed(1) }}MB
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import CanvasEngine from "@/components/canvas/CanvasEngine.vue";
import { CanvasRenderer, PerformanceMonitor } from "@/utils/canvas/index";
import type { ICanvasConfig, ICanvasEvent, IRenderStats } from "@/types";

// 响应式数据
const canvasEngineRef = ref<InstanceType<typeof CanvasEngine>>();
const showStats = ref(true);
const isRendering = ref(false);
const renderQuality = ref<"low" | "medium" | "high">("high");
const currentStats = ref<IRenderStats>();

// Canvas 配置
const canvasConfig = reactive<Partial<ICanvasConfig>>({
    width: 800,
    height: 600,
    pixelRatio: window.devicePixelRatio,
    alpha: true,
    backgroundColor: "#000000",
});

// 事件日志
interface EventLog {
    time: string;
    type: string;
    message: string;
}

const eventLogs = ref<EventLog[]>([]);
const maxLogs = 50;

// 渲染器和性能监控
let renderer: CanvasRenderer | null = null;
let performanceMonitor: PerformanceMonitor | null = null;

// 添加日志
const addLog = (type: string, message: string) => {
    const time = new Date().toLocaleTimeString();
    eventLogs.value.unshift({ time, type, message });

    // 限制日志数量
    if (eventLogs.value.length > maxLogs) {
        eventLogs.value = eventLogs.value.slice(0, maxLogs);
    }
};

// Canvas 就绪回调
const onCanvasReady = (_ctx: CanvasRenderingContext2D) => {
    addLog("系统", "Canvas 渲染引擎初始化完成");

    // 初始化渲染器
    const canvas = canvasEngineRef.value?.getCanvas();
    if (canvas) {
        renderer = new CanvasRenderer();
        renderer.init(canvas, canvasConfig as ICanvasConfig);

        // 初始化性能监控
        performanceMonitor = new PerformanceMonitor({
            enabled: true,
            verbose: true,
            thresholds: {
                minFps: 30,
                maxRenderTime: 16.67,
                maxMemoryUsage: 100,
            },
        });

        // 设置性能警告回调
        performanceMonitor.setWarningCallback(
            (type: string, value: number, threshold: number) => {
                addLog(
                    "性能警告",
                    `${type}: ${value.toFixed(2)} (阈值: ${threshold})`,
                );
            },
        );
    }

    isRendering.value = canvasEngineRef.value?.isRenderingActive() || false;
};

// Canvas 事件回调
const onCanvasEvent = (event: ICanvasEvent) => {
    const { type, canvasPosition } = event;
    const message = `${type} at (${canvasPosition.x.toFixed(
        0,
    )}, ${canvasPosition.y.toFixed(0)})`;
    addLog("交互", message);

    // 在点击位置绘制一个简单的圆形
    if (type === "click" && renderer) {
        drawClickEffect(canvasPosition.x, canvasPosition.y);
    }
};

// 统计更新回调
const onStatsUpdate = (stats: IRenderStats) => {
    currentStats.value = stats;
};

// 渲染帧回调
const onRenderFrame = (_deltaTime: number) => {
    if (!performanceMonitor) return;

    const startTime = performanceMonitor.startFrame();

    // 这里可以添加自定义渲染逻辑
    drawTestPattern();

    performanceMonitor.endFrame(startTime, 0, 1);
};

// 绘制测试图案
const drawTestPattern = () => {
    const ctx = canvasEngineRef.value?.getContext();
    if (!ctx) return;

    const time = Date.now() * 0.001;
    const centerX = canvasConfig.width! / 2;
    const centerY = canvasConfig.height! / 2;

    // 绘制旋转的彩色圆圈
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const radius = 100;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = `hsl(${(i * 45 + time * 50) % 360}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // 绘制中心文字
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Canvas 渲染引擎测试", centerX, centerY);
    ctx.restore();
};

// 绘制点击效果
const drawClickEffect = (x: number, y: number) => {
    const ctx = canvasEngineRef.value?.getContext();
    if (!ctx) return;

    // 绘制点击波纹效果
    let radius = 0;
    const maxRadius = 50;
    const animate = () => {
        ctx.save();
        ctx.globalAlpha = 1 - radius / maxRadius;
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        radius += 2;
        if (radius < maxRadius) {
            requestAnimationFrame(animate);
        }
    };

    animate();
};

// 控制方法
const toggleRendering = () => {
    if (isRendering.value) {
        canvasEngineRef.value?.stopRenderLoop();
        addLog("系统", "渲染循环已停止");
    } else {
        canvasEngineRef.value?.startRenderLoop();
        addLog("系统", "渲染循环已开始");
    }
    isRendering.value = !isRendering.value;
};

const clearCanvas = () => {
    canvasEngineRef.value?.clearCanvas();
    addLog("系统", "画布已清空");
};

const toggleStats = () => {
    showStats.value = !showStats.value;
    addLog("系统", `性能统计${showStats.value ? "已显示" : "已隐藏"}`);
};

const updateRenderQuality = () => {
    if (renderer) {
        renderer.setQuality(renderQuality.value);
        addLog("系统", `渲染质量已设置为: ${renderQuality.value}`);
    }
};

// 组件挂载
onMounted(() => {
    addLog("系统", "Canvas 测试页面已加载");
});
</script>

<style scoped>
.canvas-container {
    border: 2px solid #374151;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #374151;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: #6b7280;
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
