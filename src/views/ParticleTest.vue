<template>
    <div class="particle-test-page min-h-screen bg-gray-900 text-white p-4">
        <div class="max-w-6xl mx-auto">
            <h1 class="text-3xl font-bold mb-6 text-center">粒子系统测试</h1>

            <!-- 控制面板 -->
            <div class="mb-6 p-4 bg-gray-800 rounded-lg">
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <button
                        @click="toggleParticleSystem"
                        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                        {{ isActive ? "暂停粒子" : "启动粒子" }}
                    </button>

                    <button
                        @click="clearParticles"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors">
                        清空粒子
                    </button>

                    <button
                        @click="createBurst"
                        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors">
                        爆发效果
                    </button>

                    <button
                        @click="toggleCollision"
                        class="px-4 py-2 rounded transition-colors"
                        :class="
                            enableCollision
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gray-600 hover:bg-gray-700'
                        ">
                        {{ enableCollision ? "碰撞开启" : "碰撞关闭" }}
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >发射速率: {{ emissionRate }}</label
                        >
                        <input
                            v-model.number="emissionRate"
                            type="range"
                            min="10"
                            max="200"
                            step="10"
                            class="w-full"
                            @input="updateEmissionRate" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >重力强度: {{ gravityStrength }}</label
                        >
                        <input
                            v-model.number="gravityStrength"
                            type="range"
                            min="0"
                            max="200"
                            step="10"
                            class="w-full"
                            @input="updateGravity" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2"
                            >粒子类型</label
                        >
                        <select
                            v-model="selectedParticleType"
                            @change="updateParticleType"
                            class="w-full px-2 py-1 bg-gray-700 rounded">
                            <option value="circle">圆形</option>
                            <option value="square">方形</option>
                            <option value="triangle">三角形</option>
                            <option value="star">星形</option>
                            <option value="mixed">混合</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Canvas 容器 -->
            <div
                class="canvas-container bg-black rounded-lg overflow-hidden"
                style="height: 600px">
                <CanvasEngine
                    ref="canvasEngineRef"
                    :config="canvasConfig"
                    :show-stats="true"
                    :enable-interaction="true"
                    container-class="w-full h-full"
                    @canvas-ready="onCanvasReady"
                    @canvas-event="onCanvasEvent"
                    @render-frame="onRenderFrame" />
            </div>

            <!-- 粒子系统统计 -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        活跃粒子
                    </h4>
                    <div class="text-2xl font-bold text-green-400">
                        {{ particleStats.activeParticles }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        对象池
                    </h4>
                    <div class="text-2xl font-bold text-blue-400">
                        {{ particleStats.pooledParticles }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        本帧发射
                    </h4>
                    <div class="text-2xl font-bold text-purple-400">
                        {{ particleStats.emittedThisFrame }}
                    </div>
                </div>

                <div class="p-4 bg-gray-800 rounded-lg">
                    <h4 class="text-sm font-semibold text-gray-400 mb-1">
                        本帧回收
                    </h4>
                    <div class="text-2xl font-bold text-orange-400">
                        {{ particleStats.recycledThisFrame }}
                    </div>
                </div>
            </div>

            <!-- 预设效果 -->
            <div class="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 class="text-lg font-semibold mb-3">预设效果</h3>
                <div class="flex flex-wrap gap-2">
                    <button
                        @click="createFountain"
                        class="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors">
                        喷泉效果
                    </button>
                    <button
                        @click="createRain"
                        class="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                        粒子雨
                    </button>
                    <button
                        @click="createFireworks"
                        class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors">
                        烟花效果
                    </button>
                    <button
                        @click="createSnow"
                        class="px-3 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded text-sm transition-colors">
                        雪花效果
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import CanvasEngine from "@/components/canvas/CanvasEngine.vue";
import { ParticleSystem } from "@/utils/canvas/index";
import { ParticleType } from "@/types";
import type { ICanvasConfig, ICanvasEvent } from "@/types";

// 响应式数据
const canvasEngineRef = ref<InstanceType<typeof CanvasEngine>>();
const isActive = ref(true);
const enableCollision = ref(false);
const emissionRate = ref(50);
const gravityStrength = ref(50);
const selectedParticleType = ref("circle");

// Canvas 配置
const canvasConfig = reactive<Partial<ICanvasConfig>>({
    width: 800,
    height: 600,
    pixelRatio: window.devicePixelRatio,
    alpha: true,
    backgroundColor: "#000000",
});

// 粒子系统
let particleSystem: ParticleSystem | null = null;
let mainEmitterIndex = -1;

// 粒子统计
const particleStats = ref({
    activeParticles: 0,
    pooledParticles: 0,
    emittedThisFrame: 0,
    recycledThisFrame: 0,
});

// Canvas 就绪回调
const onCanvasReady = (_ctx: CanvasRenderingContext2D) => {
    initParticleSystem();
};

// 初始化粒子系统
const initParticleSystem = () => {
    particleSystem = new ParticleSystem({
        maxParticles: 1000,
        emissionRate: emissionRate.value,
        lifeRange: [2, 5],
        sizeRange: [3, 8],
        velocityRange: {
            x: [-100, 100],
            y: [-50, 50],
        },
        colors: [
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
            "#ff9ff3",
        ],
        gravity: { x: 0, y: gravityStrength.value },
        enableCollision: enableCollision.value,
    });

    particleSystem.setBounds(canvasConfig.width!, canvasConfig.height!);

    // 添加主发射器
    mainEmitterIndex = particleSystem.getEmitters().length;
    particleSystem.addEmitter({
        position: { x: canvasConfig.width! / 2, y: canvasConfig.height! / 2 },
        size: { width: 50, height: 50 },
        rate: emissionRate.value,
        active: isActive.value,
        angleRange: [0, Math.PI * 2],
        speedRange: [50, 150],
        particleTypes: getParticleTypes(),
        colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
    });
};

// 获取粒子类型数组
const getParticleTypes = () => {
    switch (selectedParticleType.value) {
        case "circle":
            return [ParticleType.CIRCLE];
        case "square":
            return [ParticleType.SQUARE];
        case "triangle":
            return [ParticleType.TRIANGLE];
        case "star":
            return [ParticleType.STAR];
        case "mixed":
            return [
                ParticleType.CIRCLE,
                ParticleType.SQUARE,
                ParticleType.TRIANGLE,
                ParticleType.STAR,
            ];
        default:
            return [ParticleType.CIRCLE];
    }
};

// Canvas 事件回调
const onCanvasEvent = (event: ICanvasEvent) => {
    if (!particleSystem) return;

    const { type, canvasPosition } = event;

    if (type === "click") {
        // 在点击位置创建爆发效果
        createBurstAt(canvasPosition.x, canvasPosition.y);
    } else if (type === "mousemove") {
        // 更新主发射器位置
        if (particleSystem) {
            const emitters = particleSystem.getEmitters();
            const emitter = emitters[mainEmitterIndex];
            if (emitter) {
                emitter.position = {
                    x: canvasPosition.x,
                    y: canvasPosition.y,
                };
            }
        }
    }
};

// 渲染帧回调
const onRenderFrame = (_deltaTime: number) => {
    if (!particleSystem) return;

    const ctx = canvasEngineRef.value?.getContext();
    if (!ctx) return;

    // 更新粒子系统
    particleSystem.update(_deltaTime);

    // 渲染粒子系统
    particleSystem.render(ctx);

    // 更新统计信息
    particleStats.value = particleSystem.getStats();
};

// 控制方法
const toggleParticleSystem = () => {
    isActive.value = !isActive.value;
    if (particleSystem) {
        particleSystem.setActive(isActive.value);
    }
};

const clearParticles = () => {
    if (particleSystem) {
        particleSystem.clear();
    }
};

const createBurst = () => {
    if (!particleSystem) return;

    const centerX = canvasConfig.width! / 2;
    const centerY = canvasConfig.height! / 2;
    createBurstAt(centerX, centerY);
};

const createBurstAt = (x: number, y: number) => {
    if (!particleSystem) return;

    particleSystem.burst({ x, y }, 30, {
        speedRange: [100, 300],
        lifeRange: [1, 3],
        sizeRange: [4, 12],
        particleTypes: getParticleTypes(),
        colors: ["#ff6b6b", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd"],
    });
};

const toggleCollision = () => {
    enableCollision.value = !enableCollision.value;
    if (particleSystem) {
        particleSystem.updateConfig({ enableCollision: enableCollision.value });
    }
};

const updateEmissionRate = () => {
    if (particleSystem) {
        const emitters = particleSystem.getEmitters();
        const emitter = emitters[mainEmitterIndex];
        if (emitter) {
            emitter.rate = emissionRate.value;
        }
    }
};

const updateGravity = () => {
    if (particleSystem) {
        particleSystem.updateConfig({
            gravity: { x: 0, y: gravityStrength.value },
        });
    }
};

const updateParticleType = () => {
    if (particleSystem) {
        const emitters = particleSystem.getEmitters();
        const emitter = emitters[mainEmitterIndex];
        if (emitter) {
            emitter.particleTypes = getParticleTypes();
        }
    }
};

// 预设效果
const createFountain = () => {
    if (!particleSystem) return;

    particleSystem.createFountain(
        { x: canvasConfig.width! / 2, y: canvasConfig.height! - 50 },
        {
            colors: ["#4ecdc4", "#45b7d1", "#96ceb4", "#00d2d3"],
            particleTypes: [ParticleType.CIRCLE],
            sizeRange: [2, 6],
        },
    );
};

const createRain = () => {
    if (!particleSystem) return;

    particleSystem.createRain({
        colors: ["#87ceeb", "#b0e0e6", "#add8e6", "#e0f6ff"],
        particleTypes: [ParticleType.CIRCLE],
        sizeRange: [1, 3],
    });
};

const createFireworks = () => {
    if (!particleSystem) return;

    // 创建多个烟花爆发
    const positions = [
        { x: canvasConfig.width! * 0.2, y: canvasConfig.height! * 0.3 },
        { x: canvasConfig.width! * 0.5, y: canvasConfig.height! * 0.2 },
        { x: canvasConfig.width! * 0.8, y: canvasConfig.height! * 0.4 },
    ];

    positions.forEach((pos, index) => {
        setTimeout(() => {
            particleSystem!.burst(pos, 50, {
                speedRange: [150, 400],
                lifeRange: [2, 4],
                sizeRange: [3, 8],
                particleTypes: [ParticleType.STAR, ParticleType.CIRCLE],
                colors: [
                    "#ff6b6b",
                    "#feca57",
                    "#ff9ff3",
                    "#54a0ff",
                    "#5f27cd",
                    "#ffffff",
                ],
            });
        }, index * 500);
    });
};

const createSnow = () => {
    if (!particleSystem) return;

    particleSystem.addEmitter({
        position: { x: canvasConfig.width! / 2, y: -10 },
        size: { width: canvasConfig.width!, height: 10 },
        rate: 100,
        active: true,
        angleRange: [Math.PI / 2 - 0.3, Math.PI / 2 + 0.3],
        speedRange: [30, 80],
        lifeRange: [5, 8],
        sizeRange: [2, 6],
        particleTypes: [ParticleType.CIRCLE, ParticleType.STAR],
        colors: ["#ffffff", "#f8f9fa", "#e9ecef"],
    });
};

// 组件挂载
onMounted(() => {
    console.log("粒子系统测试页面已加载");
});
</script>

<style scoped>
.canvas-container {
    border: 2px solid #374151;
}

/* 自定义滑块样式 */
input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #374151;
    border-radius: 3px;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}
</style>
