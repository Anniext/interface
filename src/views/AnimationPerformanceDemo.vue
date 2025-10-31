<template>
    <div
        class="animation-performance-demo min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
        <!-- 性能监控面板 -->
        <div
            class="performance-panel bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 class="text-2xl font-bold mb-4 text-cyan-400">
                动画性能监控演示
            </h2>

            <!-- 控制按钮 -->
            <div class="controls mb-6 flex flex-wrap gap-4">
                <button
                    @click="toggleMonitoring"
                    :class="[
                        'px-4 py-2 rounded-lg font-medium transition-all',
                        isMonitoring
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700',
                    ]">
                    {{ isMonitoring ? "停止监控" : "开始监控" }}
                </button>

                <button
                    @click="startStressTest"
                    :disabled="isStressTesting"
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg font-medium transition-all">
                    {{ isStressTesting ? "压力测试中..." : "开始压力测试" }}
                </button>

                <button
                    @click="clearWarnings"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all">
                    清除警告
                </button>

                <button
                    @click="exportData"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all">
                    导出数据
                </button>
            </div>

            <!-- 实时性能指标 -->
            <div
                class="metrics grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="metric-card bg-slate-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-400 mb-1">帧率 (FPS)</div>
                    <div
                        class="text-2xl font-bold"
                        :class="getFPSColor(currentMetrics.fps)">
                        {{ currentMetrics.fps.toFixed(1) }}
                    </div>
                </div>

                <div class="metric-card bg-slate-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-400 mb-1">内存使用 (MB)</div>
                    <div
                        class="text-2xl font-bold"
                        :class="getMemoryColor(currentMetrics.memoryMB)">
                        {{ currentMetrics.memoryMB.toFixed(1) }}
                    </div>
                </div>

                <div class="metric-card bg-slate-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-400 mb-1">活跃动画</div>
                    <div
                        class="text-2xl font-bold"
                        :class="
                            getAnimationColor(currentMetrics.activeAnimations)
                        ">
                        {{ currentMetrics.activeAnimations }}
                    </div>
                </div>

                <div class="metric-card bg-slate-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-400 mb-1">CPU 使用率</div>
                    <div
                        class="text-2xl font-bold"
                        :class="getCPUColor(currentMetrics.cpuUsage)">
                        {{ currentMetrics.cpuUsage.toFixed(1) }}%
                    </div>
                </div>
            </div>

            <!-- 性能摘要 -->
            <div
                v-if="performanceSummary"
                class="summary bg-slate-800/50 rounded-lg p-4 mb-6">
                <h3 class="text-lg font-semibold mb-3 text-cyan-300">
                    性能摘要
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span class="text-gray-400">平均帧率:</span>
                        <span class="ml-2 font-medium"
                            >{{ performanceSummary.averageFPS }}fps</span
                        >
                    </div>
                    <div>
                        <span class="text-gray-400">平均内存:</span>
                        <span class="ml-2 font-medium"
                            >{{ performanceSummary.averageMemoryMB }}MB</span
                        >
                    </div>
                    <div>
                        <span class="text-gray-400">最大动画数:</span>
                        <span class="ml-2 font-medium">{{
                            performanceSummary.maxActiveAnimations
                        }}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">健康状态:</span>
                        <span
                            :class="[
                                'ml-2 font-medium',
                                performanceSummary.isHealthy
                                    ? 'text-green-400'
                                    : 'text-red-400',
                            ]">
                            {{
                                performanceSummary.isHealthy
                                    ? "良好"
                                    : "需要优化"
                            }}
                        </span>
                    </div>
                    <div>
                        <span class="text-gray-400">警告数量:</span>
                        <span class="ml-2 font-medium text-yellow-400">{{
                            performanceSummary.warningCount
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- 性能警告 -->
            <div
                v-if="warnings.length > 0"
                class="warnings bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
                <h3 class="text-lg font-semibold mb-3 text-red-400">
                    性能警告
                </h3>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                    <div
                        v-for="warning in warnings.slice(-5)"
                        :key="warning.timestamp"
                        class="text-sm bg-red-800/30 rounded p-2">
                        <div class="font-medium">{{ warning.message }}</div>
                        <div class="text-xs text-gray-400 mt-1">
                            {{
                                new Date(warning.timestamp).toLocaleTimeString()
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 动画演示区域 -->
        <div
            class="demo-area bg-black/30 rounded-lg p-6 relative overflow-hidden"
            style="height: 400px">
            <h3 class="text-xl font-semibold mb-4 text-cyan-300">
                动画演示区域
            </h3>

            <!-- 动画元素 -->
            <div
                v-for="(particle, index) in particles"
                :key="index"
                :ref="(el: any) => (particleRefs[index] = el as HTMLElement)"
                class="particle absolute w-4 h-4 bg-cyan-400 rounded-full"
                :style="{
                    left: particle.x + 'px',
                    top: particle.y + 'px',
                    transform: `scale(${particle.scale})`,
                    opacity: particle.opacity,
                }"></div>

            <!-- 性能图表占位符 -->
            <div
                class="chart-placeholder absolute bottom-4 right-4 w-48 h-24 bg-slate-800/50 rounded border border-cyan-500/30">
                <div class="p-2 text-xs text-gray-400">性能图表</div>
                <div class="px-2 pb-2">
                    <div
                        class="w-full h-12 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-30 rounded"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";
import {
    globalPerformanceMonitor,
    type IPerformanceWarning,
} from "@/utils/animation/AnimationPerformanceMonitor";

// 响应式数据
const isMonitoring = ref(false);
const isStressTesting = ref(false);
const currentMetrics = reactive({
    fps: 0,
    memoryMB: 0,
    activeAnimations: 0,
    cpuUsage: 0,
});
const performanceSummary = ref<any>(null);
const warnings = ref<IPerformanceWarning[]>([]);
const particles = ref<
    Array<{
        x: number;
        y: number;
        scale: number;
        opacity: number;
    }>
>([]);
const particleRefs = ref<HTMLElement[]>([]);

// 动画相关
let animationTimelines: gsap.core.Timeline[] = [];
let updateInterval: number | null = null;

// 颜色辅助函数
const getFPSColor = (fps: number) => {
    if (fps >= 50) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
};

const getMemoryColor = (memory: number) => {
    if (memory <= 50) return "text-green-400";
    if (memory <= 100) return "text-yellow-400";
    return "text-red-400";
};

const getAnimationColor = (count: number) => {
    if (count <= 20) return "text-green-400";
    if (count <= 50) return "text-yellow-400";
    return "text-red-400";
};

const getCPUColor = (cpu: number) => {
    if (cpu <= 50) return "text-green-400";
    if (cpu <= 80) return "text-yellow-400";
    return "text-red-400";
};

// 切换监控状态
const toggleMonitoring = () => {
    if (isMonitoring.value) {
        stopMonitoring();
    } else {
        startMonitoring();
    }
};

// 开始监控
const startMonitoring = () => {
    isMonitoring.value = true;

    // 设置动画统计提供者
    globalPerformanceMonitor.setAnimationStatsProvider(() => ({
        activeAnimations: animationTimelines.filter((tl) => tl.isActive())
            .length,
        totalAnimations: animationTimelines.length,
        averageFPS: currentMetrics.fps,
        memoryUsage: currentMetrics.memoryMB,
    }));

    globalPerformanceMonitor.start();

    // 启动数据更新
    updateInterval = window.setInterval(updateMetrics, 100);
};

// 停止监控
const stopMonitoring = () => {
    isMonitoring.value = false;
    globalPerformanceMonitor.stop();

    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
};

// 更新指标
const updateMetrics = () => {
    const current = globalPerformanceMonitor.getCurrentPerformance();
    if (current) {
        currentMetrics.fps = current.fps;
        currentMetrics.memoryMB = current.memoryMB;
        currentMetrics.activeAnimations = current.activeAnimations;
        currentMetrics.cpuUsage = current.cpuUsage;
    }

    performanceSummary.value = globalPerformanceMonitor.getPerformanceSummary();
    warnings.value = globalPerformanceMonitor.getWarnings();
};

// 开始压力测试
const startStressTest = async () => {
    if (isStressTesting.value) return;

    isStressTesting.value = true;

    try {
        // 创建大量粒子
        const particleCount = 100;
        particles.value = Array.from({ length: particleCount }, () => ({
            x: Math.random() * 600,
            y: Math.random() * 300,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0.5 + Math.random() * 0.5,
        }));

        await nextTick();

        // 创建动画
        particleRefs.value.forEach((el, index) => {
            if (el) {
                const tl = gsap.timeline({ repeat: -1, yoyo: true });

                tl.to(el, {
                    x: Math.random() * 600,
                    y: Math.random() * 300,
                    rotation: 360,
                    scale: 0.5 + Math.random() * 1.5,
                    duration: 2 + Math.random() * 3,
                    ease: "power2.inOut",
                });

                animationTimelines.push(tl);
            }
        });

        // 5秒后停止压力测试
        setTimeout(() => {
            stopStressTest();
        }, 5000);
    } catch (error) {
        console.error("压力测试失败:", error);
        isStressTesting.value = false;
    }
};

// 停止压力测试
const stopStressTest = () => {
    isStressTesting.value = false;

    // 清理动画
    animationTimelines.forEach((tl) => tl.kill());
    animationTimelines = [];

    // 清理粒子
    particles.value = [];
};

// 清除警告
const clearWarnings = () => {
    globalPerformanceMonitor.clearWarnings();
    warnings.value = [];
};

// 导出数据
const exportData = () => {
    const data = {
        performanceHistory: globalPerformanceMonitor.getPerformanceHistory(),
        warnings: globalPerformanceMonitor.getWarnings(),
        summary: globalPerformanceMonitor.getPerformanceSummary(),
        timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `animation-performance-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// 生命周期
onMounted(() => {
    // 自动开始监控
    startMonitoring();
});

onBeforeUnmount(() => {
    stopMonitoring();
    stopStressTest();
});
</script>

<style scoped>
.particle {
    transition: all 0.1s ease-out;
}

.metric-card {
    transition: all 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.performance-panel {
    animation: slideInDown 0.6s ease-out;
}

.demo-area {
    animation: slideInUp 0.6s ease-out 0.2s both;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
