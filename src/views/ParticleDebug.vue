<template>
    <div class="min-h-screen bg-gray-900 text-white p-4">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-4">粒子系统调试</h1>

            <div class="mb-4">
                <button
                    @click="testImports"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded mr-2">
                    测试导入
                </button>
                <button
                    @click="testParticleSystem"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded mr-2">
                    测试粒子系统
                </button>
                <button
                    @click="initCanvas"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">
                    初始化Canvas
                </button>
            </div>

            <div class="mb-4 p-4 bg-gray-800 rounded">
                <h3 class="text-lg font-semibold mb-2">调试信息</h3>
                <div class="text-sm font-mono">
                    <div
                        v-for="(log, index) in debugLogs"
                        :key="index"
                        class="mb-1">
                        <span class="text-green-400">[{{ log.time }}]</span>
                        <span
                            class="ml-2"
                            :class="
                                log.type === 'error'
                                    ? 'text-red-400'
                                    : 'text-white'
                            ">
                            {{ log.message }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="bg-black rounded" style="height: 400px">
                <canvas
                    ref="canvasRef"
                    width="800"
                    height="400"
                    class="w-full h-full border border-gray-600"></canvas>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvasRef = ref<HTMLCanvasElement>();
const debugLogs = ref<Array<{ time: string; type: string; message: string }>>(
    [],
);

const addLog = (message: string, type = "info") => {
    const time = new Date().toLocaleTimeString();
    debugLogs.value.unshift({ time, type, message });
    console.log(`[${time}] ${message}`);
};

const testImports = async () => {
    try {
        addLog("开始测试导入...");

        // 测试类型导入
        const { ParticleType } = await import("@/types");
        addLog(`ParticleType 导入成功: ${JSON.stringify(ParticleType)}`);

        // 测试 Canvas 工具导入
        const canvasModule = await import("@/utils/canvas/index");
        addLog(
            `Canvas 模块导入成功，包含: ${Object.keys(canvasModule).join(
                ", ",
            )}`,
        );

        // 测试 ParticleSystem 导入
        const { ParticleSystem } = canvasModule;
        if (ParticleSystem) {
            addLog("ParticleSystem 类导入成功");

            // 尝试创建实例
            const particleSystem = new ParticleSystem();
            addLog("ParticleSystem 实例创建成功");

            // 测试基本方法
            particleSystem.setBounds(800, 400);
            addLog("setBounds 方法调用成功");

            const stats = particleSystem.getStats();
            addLog(`getStats 返回: ${JSON.stringify(stats)}`);
        } else {
            addLog("ParticleSystem 导入失败", "error");
        }
    } catch (error) {
        addLog(`导入测试失败: ${error}`, "error");
    }
};

const testParticleSystem = async () => {
    try {
        addLog("开始测试粒子系统...");

        const { ParticleSystem } = await import("@/utils/canvas/index");
        const { ParticleType } = await import("@/types");

        const particleSystem = new ParticleSystem({
            maxParticles: 100,
            emissionRate: 20,
            colors: ["#ff0000", "#00ff00", "#0000ff"],
        });

        particleSystem.setBounds(800, 400);

        // 添加发射器
        particleSystem.addEmitter({
            position: { x: 400, y: 200 },
            size: { width: 10, height: 10 },
            rate: 20,
            active: true,
            angleRange: [0, Math.PI * 2],
            speedRange: [50, 100],
            lifeRange: [1, 3],
            sizeRange: [3, 8],
            particleTypes: [ParticleType.CIRCLE],
            colors: ["#ff0000", "#00ff00", "#0000ff"],
        });

        addLog("发射器添加成功");

        // 更新几次
        for (let i = 0; i < 5; i++) {
            particleSystem.update(100); // 100ms
        }

        const stats = particleSystem.getStats();
        addLog(
            `更新后统计: 活跃粒子=${stats.activeParticles}, 发射=${stats.emittedThisFrame}`,
        );
    } catch (error) {
        addLog(`粒子系统测试失败: ${error}`, "error");
    }
};

const initCanvas = async () => {
    try {
        addLog("开始初始化Canvas...");

        if (!canvasRef.value) {
            addLog("Canvas 元素未找到", "error");
            return;
        }

        const ctx = canvasRef.value.getContext("2d");
        if (!ctx) {
            addLog("无法获取 2D 上下文", "error");
            return;
        }

        addLog("Canvas 2D 上下文获取成功");

        // 清空画布
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 800, 400);

        // 绘制测试图形
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(400, 200, 50, 0, Math.PI * 2);
        ctx.fill();

        addLog("测试图形绘制成功");

        // 测试粒子系统渲染
        const { ParticleSystem } = await import("@/utils/canvas/index");
        const { ParticleType } = await import("@/types");

        const particleSystem = new ParticleSystem({
            maxParticles: 50,
            emissionRate: 10,
        });

        particleSystem.setBounds(800, 400);
        particleSystem.addEmitter({
            position: { x: 400, y: 200 },
            size: { width: 10, height: 10 },
            rate: 10,
            active: true,
            angleRange: [0, Math.PI * 2],
            speedRange: [30, 80],
            lifeRange: [2, 4],
            sizeRange: [3, 6],
            particleTypes: [ParticleType.CIRCLE],
            colors: ["#ffffff", "#ffff00", "#ff00ff"],
        });

        // 渲染循环
        let frameCount = 0;
        const renderLoop = () => {
            if (frameCount > 300) return; // 5秒后停止

            // 清空画布
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, 800, 400);

            // 更新粒子系统
            particleSystem.update(16.67); // ~60fps

            // 渲染粒子系统
            particleSystem.render(ctx);

            frameCount++;
            requestAnimationFrame(renderLoop);
        };

        renderLoop();
        addLog("粒子系统渲染开始");
    } catch (error) {
        addLog(`Canvas 初始化失败: ${error}`, "error");
    }
};

onMounted(() => {
    addLog("调试页面已加载");
});
</script>
