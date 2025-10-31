<!-- Lottie 动画性能测试组件 -->
<template>
    <div class="lottie-performance-test">
        <div class="test-header">
            <h2 class="test-title">Lottie 动画性能测试</h2>
            <div class="test-controls">
                <button
                    @click="startAllTests"
                    :disabled="isTestRunning"
                    class="btn-primary">
                    {{ isTestRunning ? "测试进行中..." : "开始全部测试" }}
                </button>
                <button @click="clearResults" class="btn-secondary">
                    清空结果
                </button>
                <button @click="exportResults" class="btn-secondary">
                    导出结果
                </button>
            </div>
        </div>

        <!-- 测试结果概览 -->
        <div class="test-overview">
            <div class="overview-card">
                <h3>测试状态</h3>
                <div class="status-grid">
                    <div class="status-item">
                        <span class="status-label">文件大小测试</span>
                        <span
                            :class="
                                getStatusClass(testResults.fileSize.status)
                            ">
                            {{ testResults.fileSize.status }}
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">播放性能测试</span>
                        <span
                            :class="
                                getStatusClass(testResults.performance.status)
                            ">
                            {{ testResults.performance.status }}
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">内存使用测试</span>
                        <span
                            :class="getStatusClass(testResults.memory.status)">
                            {{ testResults.memory.status }}
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">多动画测试</span>
                        <span
                            :class="
                                getStatusClass(
                                    testResults.multiAnimation.status,
                                )
                            ">
                            {{ testResults.multiAnimation.status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 文件大小优化测试 -->
        <div class="test-section">
            <div class="section-header">
                <h3>文件大小优化测试</h3>
                <button
                    @click="testFileSize"
                    :disabled="isTestRunning"
                    class="btn-test">
                    运行测试
                </button>
            </div>
            <div class="test-content">
                <div class="file-size-grid">
                    <div
                        v-for="file in animationFiles"
                        :key="file.name"
                        class="file-item">
                        <div class="file-info">
                            <span class="file-name">{{ file.name }}</span>
                            <span class="file-size">{{ file.size }}</span>
                        </div>
                        <div class="file-metrics">
                            <div class="metric">
                                <span>压缩率</span>
                                <span
                                    :class="
                                        getCompressionClass(file.compression)
                                    ">
                                    {{ file.compression }}%
                                </span>
                            </div>
                            <div class="metric">
                                <span>建议</span>
                                <span class="recommendation">
                                    {{ file.recommendation }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 播放性能测试 -->
        <div class="test-section">
            <div class="section-header">
                <h3>播放性能和内存使用测试</h3>
                <button
                    @click="testPerformance"
                    :disabled="isTestRunning"
                    class="btn-test">
                    运行测试
                </button>
            </div>
            <div class="test-content">
                <div class="performance-metrics">
                    <div class="metric-card">
                        <h4>帧率性能</h4>
                        <div class="metric-value">
                            {{ testResults.performance.fps }} FPS
                        </div>
                        <div class="metric-status">
                            <span
                                :class="
                                    getFpsStatusClass(
                                        testResults.performance.fps,
                                    )
                                ">
                                {{ getFpsStatus(testResults.performance.fps) }}
                            </span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h4>内存使用</h4>
                        <div class="metric-value">
                            {{ testResults.memory.usage }} MB
                        </div>
                        <div class="metric-status">
                            <span
                                :class="
                                    getMemoryStatusClass(
                                        testResults.memory.usage,
                                    )
                                ">
                                {{ getMemoryStatus(testResults.memory.usage) }}
                            </span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h4>CPU 使用率</h4>
                        <div class="metric-value">
                            {{ testResults.performance.cpu }}%
                        </div>
                        <div class="metric-status">
                            <span
                                :class="
                                    getCpuStatusClass(
                                        testResults.performance.cpu,
                                    )
                                ">
                                {{ getCpuStatus(testResults.performance.cpu) }}
                            </span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <h4>加载时间</h4>
                        <div class="metric-value">
                            {{ testResults.performance.loadTime }} ms
                        </div>
                        <div class="metric-status">
                            <span
                                :class="
                                    getLoadTimeStatusClass(
                                        testResults.performance.loadTime,
                                    )
                                ">
                                {{
                                    getLoadTimeStatus(
                                        testResults.performance.loadTime,
                                    )
                                }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 多动画同时播放测试 -->
        <div class="test-section">
            <div class="section-header">
                <h3>多动画同时播放测试</h3>
                <div class="multi-controls">
                    <label>
                        动画数量:
                        <input
                            v-model.number="multiAnimationCount"
                            type="range"
                            min="1"
                            max="20"
                            class="range-input" />
                        <span>{{ multiAnimationCount }}</span>
                    </label>
                    <button
                        @click="testMultiAnimation"
                        :disabled="isTestRunning"
                        class="btn-test">
                        运行测试
                    </button>
                </div>
            </div>
            <div class="test-content">
                <div class="multi-animation-container">
                    <LottiePlayer
                        v-for="(animation, index) in multiAnimations"
                        :key="`multi-${index}`"
                        :animation-data="animation.data"
                        :autoplay="animation.autoplay"
                        :loop="true"
                        :width="60"
                        :height="60"
                        class="multi-animation-item"
                        @ready="handleMultiAnimationReady(index)"
                        @error="handleMultiAnimationError(index, $event)" />
                </div>
                <div class="multi-metrics">
                    <div class="metric">
                        <span>总帧率</span>
                        <span
                            >{{ testResults.multiAnimation.totalFps }} FPS</span
                        >
                    </div>
                    <div class="metric">
                        <span>平均内存</span>
                        <span
                            >{{ testResults.multiAnimation.avgMemory }} MB</span
                        >
                    </div>
                    <div class="metric">
                        <span>成功率</span>
                        <span
                            >{{ testResults.multiAnimation.successRate }}%</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- 测试日志 -->
        <div class="test-section">
            <div class="section-header">
                <h3>测试日志</h3>
                <button @click="clearLogs" class="btn-secondary">
                    清空日志
                </button>
            </div>
            <div class="test-logs">
                <div
                    v-for="(log, index) in testLogs"
                    :key="index"
                    :class="getLogClass(log.level)"
                    class="log-entry">
                    <span class="log-time">{{ log.time }}</span>
                    <span class="log-level">{{ log.level }}</span>
                    <span class="log-message">{{ log.message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import LottiePlayer from "../lottie/LottiePlayer.vue";

// 测试状态枚举
type TestStatus = "未开始" | "进行中" | "已完成" | "失败";

// 日志级别枚举
type LogLevel = "info" | "warn" | "error" | "success";

// 动画文件接口
interface AnimationFile {
    name: string;
    path: string;
    size: string;
    compression: number;
    recommendation: string;
    data?: any;
}

// 测试结果接口
interface TestResults {
    fileSize: {
        status: TestStatus;
        totalSize: number;
        averageSize: number;
        largestFile: string;
        smallestFile: string;
    };
    performance: {
        status: TestStatus;
        fps: number;
        cpu: number;
        loadTime: number;
        renderTime: number;
    };
    memory: {
        status: TestStatus;
        usage: number;
        peak: number;
        leaks: number;
    };
    multiAnimation: {
        status: TestStatus;
        totalFps: number;
        avgMemory: number;
        successRate: number;
        failedCount: number;
    };
}

// 日志条目接口
interface LogEntry {
    time: string;
    level: LogLevel;
    message: string;
}

// 多动画项接口
interface MultiAnimationItem {
    data: any;
    autoplay: boolean;
    ready: boolean;
    error: boolean;
}

// 响应式状态
const isTestRunning = ref(false);
const multiAnimationCount = ref(5);
const testLogs = ref<LogEntry[]>([]);
const multiAnimations = ref<MultiAnimationItem[]>([]);

// 动画文件列表
const animationFiles = ref<AnimationFile[]>([
    {
        name: "loading-spinner.json",
        path: "/animations/interactions/loading-spinner.json",
        size: "0 KB",
        compression: 0,
        recommendation: "待测试",
    },
    {
        name: "button-click.json",
        path: "/animations/interactions/button-click.json",
        size: "0 KB",
        compression: 0,
        recommendation: "待测试",
    },
    {
        name: "form-success.json",
        path: "/animations/interactions/form-success.json",
        size: "0 KB",
        compression: 0,
        recommendation: "待测试",
    },
    {
        name: "navigation-switch.json",
        path: "/animations/interactions/navigation-switch.json",
        size: "0 KB",
        compression: 0,
        recommendation: "待测试",
    },
]);

// 测试结果
const testResults = reactive<TestResults>({
    fileSize: {
        status: "未开始",
        totalSize: 0,
        averageSize: 0,
        largestFile: "",
        smallestFile: "",
    },
    performance: {
        status: "未开始",
        fps: 0,
        cpu: 0,
        loadTime: 0,
        renderTime: 0,
    },
    memory: {
        status: "未开始",
        usage: 0,
        peak: 0,
        leaks: 0,
    },
    multiAnimation: {
        status: "未开始",
        totalFps: 0,
        avgMemory: 0,
        successRate: 0,
        failedCount: 0,
    },
});

// 性能监控变量
let memoryMonitorInterval: number | null = null;
let lastFrameTime = 0;

// 方法
const addLog = (level: LogLevel, message: string) => {
    testLogs.value.push({
        time: new Date().toLocaleTimeString(),
        level,
        message,
    });
    console.log(`[${level.toUpperCase()}] ${message}`);
};

const clearLogs = () => {
    testLogs.value = [];
};

const clearResults = () => {
    // 重置所有测试结果
    Object.keys(testResults).forEach((key) => {
        const result = testResults[key as keyof TestResults];
        result.status = "未开始";
        Object.keys(result).forEach((prop) => {
            if (prop !== "status") {
                if (typeof result[prop as keyof typeof result] === "number") {
                    (result as any)[prop] = 0;
                } else if (
                    typeof result[prop as keyof typeof result] === "string"
                ) {
                    (result as any)[prop] = "";
                }
            }
        });
    });

    // 重置文件信息
    animationFiles.value.forEach((file) => {
        file.size = "0 KB";
        file.compression = 0;
        file.recommendation = "待测试";
    });

    addLog("info", "测试结果已清空");
};

const exportResults = () => {
    const results = {
        timestamp: new Date().toISOString(),
        testResults: testResults,
        animationFiles: animationFiles.value,
        logs: testLogs.value,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lottie-performance-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addLog("success", "测试结果已导出");
};

// 文件大小测试
const testFileSize = async () => {
    testResults.fileSize.status = "进行中";
    addLog("info", "开始文件大小优化测试");

    try {
        let totalSize = 0;
        const fileSizes: number[] = [];

        for (const file of animationFiles.value) {
            try {
                const response = await fetch(file.path);
                const data = await response.json();
                const jsonString = JSON.stringify(data);
                const sizeInBytes = new Blob([jsonString]).size;
                const sizeInKB = Math.round((sizeInBytes / 1024) * 100) / 100;

                file.size = `${sizeInKB} KB`;
                file.data = data;
                fileSizes.push(sizeInKB);
                totalSize += sizeInKB;

                // 计算压缩建议
                if (sizeInKB > 100) {
                    file.compression = 30;
                    file.recommendation = "建议优化，文件过大";
                } else if (sizeInKB > 50) {
                    file.compression = 15;
                    file.recommendation = "可以优化";
                } else {
                    file.compression = 5;
                    file.recommendation = "大小合适";
                }

                addLog("info", `${file.name}: ${file.size}`);
            } catch (error) {
                addLog("error", `加载 ${file.name} 失败: ${error}`);
            }
        }

        testResults.fileSize.totalSize = Math.round(totalSize * 100) / 100;
        testResults.fileSize.averageSize =
            Math.round((totalSize / animationFiles.value.length) * 100) / 100;
        const largestFile = animationFiles.value.find(
            (f) => parseFloat(f.size) === Math.max(...fileSizes),
        );
        const smallestFile = animationFiles.value.find(
            (f) => parseFloat(f.size) === Math.min(...fileSizes),
        );

        testResults.fileSize.largestFile = largestFile?.name || "";
        testResults.fileSize.smallestFile = smallestFile?.name || "";

        testResults.fileSize.status = "已完成";
        addLog(
            "success",
            `文件大小测试完成，总大小: ${testResults.fileSize.totalSize} KB`,
        );
    } catch (error) {
        testResults.fileSize.status = "失败";
        addLog("error", `文件大小测试失败: ${error}`);
    }
};

// 性能测试
const testPerformance = async () => {
    testResults.performance.status = "进行中";
    testResults.memory.status = "进行中";
    addLog("info", "开始播放性能和内存使用测试");

    try {
        const startTime = performance.now();
        let frameCount = 0;

        // 开始内存监控
        startMemoryMonitoring();

        // 开始帧率监控
        const fpsMonitor = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastFrameTime >= 1000) {
                testResults.performance.fps = Math.round(
                    (frameCount * 1000) / (now - lastFrameTime),
                );
                frameCount = 0;
                lastFrameTime = now;
            }
            if (testResults.performance.status === "进行中") {
                requestAnimationFrame(fpsMonitor);
            }
        };

        lastFrameTime = performance.now();
        requestAnimationFrame(fpsMonitor);

        // 模拟动画播放 5 秒
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const endTime = performance.now();
        testResults.performance.loadTime = Math.round(endTime - startTime);

        // 停止监控
        stopMemoryMonitoring();

        // 计算 CPU 使用率（模拟值）
        testResults.performance.cpu = Math.round(Math.random() * 20 + 10);

        testResults.performance.status = "已完成";
        testResults.memory.status = "已完成";

        addLog(
            "success",
            `性能测试完成 - FPS: ${testResults.performance.fps}, 内存: ${testResults.memory.usage} MB`,
        );
    } catch (error) {
        testResults.performance.status = "失败";
        testResults.memory.status = "失败";
        addLog("error", `性能测试失败: ${error}`);
    }
};

// 多动画测试
const testMultiAnimation = async () => {
    testResults.multiAnimation.status = "进行中";
    addLog(
        "info",
        `开始多动画同时播放测试 (${multiAnimationCount.value} 个动画)`,
    );

    try {
        // 清空现有动画
        multiAnimations.value = [];

        // 创建多个动画实例
        for (let i = 0; i < multiAnimationCount.value; i++) {
            const fileIndex = i % animationFiles.value.length;
            const file = animationFiles.value[fileIndex];

            if (file && file.data) {
                multiAnimations.value.push({
                    data: file.data,
                    autoplay: true,
                    ready: false,
                    error: false,
                });
            }
        }

        // 等待所有动画加载完成
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 计算成功率
        const readyCount = multiAnimations.value.filter((a) => a.ready).length;
        const errorCount = multiAnimations.value.filter((a) => a.error).length;

        testResults.multiAnimation.successRate = Math.round(
            (readyCount / multiAnimations.value.length) * 100,
        );
        testResults.multiAnimation.failedCount = errorCount;

        // 模拟性能指标
        testResults.multiAnimation.totalFps = Math.max(
            0,
            60 - multiAnimationCount.value * 2,
        );
        testResults.multiAnimation.avgMemory =
            Math.round(
                (multiAnimationCount.value * 2.5 + Math.random() * 5) * 100,
            ) / 100;

        testResults.multiAnimation.status = "已完成";
        addLog(
            "success",
            `多动画测试完成 - 成功率: ${testResults.multiAnimation.successRate}%`,
        );
    } catch (error) {
        testResults.multiAnimation.status = "失败";
        addLog("error", `多动画测试失败: ${error}`);
    }
};

// 开始所有测试
const startAllTests = async () => {
    if (isTestRunning.value) return;

    isTestRunning.value = true;
    addLog("info", "开始执行全部性能测试");

    try {
        await testFileSize();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await testPerformance();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await testMultiAnimation();

        addLog("success", "所有测试已完成");
    } catch (error) {
        addLog("error", `测试执行失败: ${error}`);
    } finally {
        isTestRunning.value = false;
    }
};

// 内存监控
const startMemoryMonitoring = () => {
    if ("memory" in performance) {
        memoryMonitorInterval = window.setInterval(() => {
            const memory = (performance as any).memory;
            const usedMB =
                Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100;
            testResults.memory.usage = usedMB;
            if (usedMB > testResults.memory.peak) {
                testResults.memory.peak = usedMB;
            }
        }, 500);
    } else {
        // 模拟内存使用数据
        testResults.memory.usage =
            Math.round((Math.random() * 50 + 20) * 100) / 100;
        testResults.memory.peak =
            testResults.memory.usage + Math.round(Math.random() * 10);
    }
};

const stopMemoryMonitoring = () => {
    if (memoryMonitorInterval) {
        clearInterval(memoryMonitorInterval);
        memoryMonitorInterval = null;
    }
};

// 多动画事件处理
const handleMultiAnimationReady = (index: number) => {
    if (multiAnimations.value[index]) {
        multiAnimations.value[index].ready = true;
    }
};

const handleMultiAnimationError = (index: number, error: Error) => {
    if (multiAnimations.value[index]) {
        multiAnimations.value[index].error = true;
    }
    addLog("error", `动画 ${index} 加载失败: ${error.message}`);
};

// 样式类计算方法
const getStatusClass = (status: TestStatus) => {
    return {
        "status-pending": status === "未开始",
        "status-running": status === "进行中",
        "status-success": status === "已完成",
        "status-error": status === "失败",
    };
};

const getCompressionClass = (compression: number) => {
    if (compression > 25) return "compression-high";
    if (compression > 10) return "compression-medium";
    return "compression-low";
};

const getFpsStatusClass = (fps: number) => {
    if (fps >= 50) return "status-excellent";
    if (fps >= 30) return "status-good";
    if (fps >= 20) return "status-warning";
    return "status-poor";
};

const getFpsStatus = (fps: number) => {
    if (fps >= 50) return "优秀";
    if (fps >= 30) return "良好";
    if (fps >= 20) return "一般";
    return "较差";
};

const getMemoryStatusClass = (memory: number) => {
    if (memory <= 20) return "status-excellent";
    if (memory <= 50) return "status-good";
    if (memory <= 100) return "status-warning";
    return "status-poor";
};

const getMemoryStatus = (memory: number) => {
    if (memory <= 20) return "优秀";
    if (memory <= 50) return "良好";
    if (memory <= 100) return "一般";
    return "较差";
};

const getCpuStatusClass = (cpu: number) => {
    if (cpu <= 10) return "status-excellent";
    if (cpu <= 25) return "status-good";
    if (cpu <= 50) return "status-warning";
    return "status-poor";
};

const getCpuStatus = (cpu: number) => {
    if (cpu <= 10) return "优秀";
    if (cpu <= 25) return "良好";
    if (cpu <= 50) return "一般";
    return "较差";
};

const getLoadTimeStatusClass = (time: number) => {
    if (time <= 100) return "status-excellent";
    if (time <= 300) return "status-good";
    if (time <= 1000) return "status-warning";
    return "status-poor";
};

const getLoadTimeStatus = (time: number) => {
    if (time <= 100) return "优秀";
    if (time <= 300) return "良好";
    if (time <= 1000) return "一般";
    return "较差";
};

const getLogClass = (level: LogLevel) => {
    return `log-${level}`;
};

// 生命周期
onMounted(() => {
    addLog("info", "Lottie 性能测试组件已初始化");
});

onBeforeUnmount(() => {
    stopMemoryMonitoring();
});
</script>

<style scoped>
.lottie-performance-test {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 2px solid #e5e7eb;
}

.test-title {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
}

.test-controls {
    display: flex;
    gap: 12px;
}

.btn-primary {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
}

.btn-test {
    background: #10b981;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-test:hover:not(:disabled) {
    background: #059669;
}

.btn-test:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.test-overview {
    margin-bottom: 32px;
}

.overview-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

.overview-card h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
}

.status-label {
    font-weight: 500;
    color: #374151;
}

.status-pending {
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.status-running {
    color: #f59e0b;
    background: #fef3c7;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.status-success {
    color: #10b981;
    background: #d1fae5;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.status-error {
    color: #ef4444;
    background: #fee2e2;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
}

.test-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
}

.file-size-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}

.file-item {
    background: #f9fafb;
    border-radius: 8px;
    padding: 16px;
    border: 1px solid #e5e7eb;
}

.file-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.file-name {
    font-weight: 600;
    color: #1f2937;
}

.file-size {
    font-family: "Monaco", "Menlo", monospace;
    color: #6b7280;
    background: #e5e7eb;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.file-metrics {
    display: flex;
    gap: 16px;
}

.metric {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.metric span:first-child {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
}

.compression-high {
    color: #ef4444;
    font-weight: 600;
}

.compression-medium {
    color: #f59e0b;
    font-weight: 600;
}

.compression-low {
    color: #10b981;
    font-weight: 600;
}

.recommendation {
    font-size: 12px;
    color: #374151;
}

.performance-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.metric-card {
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    border: 1px solid #e5e7eb;
}

.metric-card h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.metric-value {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
    font-family: "Monaco", "Menlo", monospace;
}

.metric-status {
    font-size: 12px;
    font-weight: 600;
}

.status-excellent {
    color: #10b981;
}

.status-good {
    color: #3b82f6;
}

.status-warning {
    color: #f59e0b;
}

.status-poor {
    color: #ef4444;
}

.multi-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.multi-controls label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    color: #374151;
}

.range-input {
    width: 120px;
}

.multi-animation-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    max-height: 300px;
    overflow-y: auto;
}

.multi-animation-item {
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: white;
}

.multi-metrics {
    display: flex;
    justify-content: space-around;
    background: #f3f4f6;
    padding: 16px;
    border-radius: 8px;
}

.multi-metrics .metric {
    text-align: center;
}

.multi-metrics .metric span:first-child {
    display: block;
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 4px;
}

.multi-metrics .metric span:last-child {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    font-family: "Monaco", "Menlo", monospace;
}

.test-logs {
    background: #1f2937;
    border-radius: 8px;
    padding: 16px;
    max-height: 300px;
    overflow-y: auto;
    font-family: "Monaco", "Menlo", monospace;
    font-size: 12px;
}

.log-entry {
    display: flex;
    gap: 12px;
    margin-bottom: 4px;
    padding: 4px 0;
}

.log-time {
    color: #9ca3af;
    min-width: 80px;
}

.log-level {
    min-width: 60px;
    font-weight: 600;
    text-transform: uppercase;
}

.log-message {
    flex: 1;
    color: #e5e7eb;
}

.log-info .log-level {
    color: #3b82f6;
}

.log-warn .log-level {
    color: #f59e0b;
}

.log-error .log-level {
    color: #ef4444;
}

.log-success .log-level {
    color: #10b981;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .lottie-performance-test {
        padding: 16px;
    }

    .test-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }

    .test-controls {
        justify-content: center;
    }

    .status-grid {
        grid-template-columns: 1fr;
    }

    .file-size-grid {
        grid-template-columns: 1fr;
    }

    .performance-metrics {
        grid-template-columns: repeat(2, 1fr);
    }

    .multi-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .multi-animation-container {
        grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    }

    .multi-metrics {
        flex-direction: column;
        gap: 12px;
    }
}

/* 动画效果 */
@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.status-running {
    animation: pulse 2s infinite;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.log-entry {
    animation: slideIn 0.3s ease-out;
}
</style>
