<template>
    <div
        class="canvas-test-view min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Canvas 图形测试
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示 Canvas 2D 图形渲染能力和交互效果
                </p>
            </div>

            <!-- Canvas 容器 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Canvas 画布 -->
                    <div class="flex-1">
                        <div
                            class="bg-black/50 rounded-lg p-4 border border-white/10">
                            <CanvasEngine
                                ref="canvasRef"
                                :width="800"
                                :height="600"
                                :enable-interaction="true"
                                :show-fps="true"
                                class="w-full h-auto" />
                        </div>
                    </div>

                    <!-- 控制面板 -->
                    <div class="lg:w-80">
                        <div
                            class="bg-white/5 rounded-lg p-6 border border-white/10">
                            <h3 class="text-lg font-semibold text-white mb-4">
                                控制面板
                            </h3>

                            <!-- 图形类型选择 -->
                            <div class="mb-6">
                                <label
                                    class="block text-sm font-medium text-gray-300 mb-2"
                                    >图形类型</label
                                >
                                <select
                                    v-model="selectedShape"
                                    @change="updateShape"
                                    class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="circle">圆形</option>
                                    <option value="rectangle">矩形</option>
                                    <option value="triangle">三角形</option>
                                    <option value="star">星形</option>
                                    <option value="polygon">多边形</option>
                                </select>
                            </div>

                            <!-- 颜色选择 -->
                            <div class="mb-6">
                                <label
                                    class="block text-sm font-medium text-gray-300 mb-2"
                                    >颜色</label
                                >
                                <div class="grid grid-cols-4 gap-2">
                                    <button
                                        v-for="color in colors"
                                        :key="color"
                                        @click="selectedColor = color"
                                        :class="[
                                            'w-12 h-12 rounded-lg border-2 transition-all duration-200',
                                            selectedColor === color
                                                ? 'border-white scale-110'
                                                : 'border-transparent',
                                        ]"
                                        :style="{
                                            backgroundColor: color,
                                        }"></button>
                                </div>
                            </div>

                            <!-- 大小控制 */
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-300 mb-2">
                                    大小: {{ shapeSize }}
                                </label>
                                <input
                                    v-model="shapeSize"
                                    type="range"
                                    min="10"
                                    max="100"
                                    class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider" />
                            </div>

                            <!-- 动画控制 -->
                            <div class="mb-6">
                                <label
                                    class="block text-sm font-medium text-gray-300 mb-2"
                                    >动画效果</label
                                >
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input
                                            v-model="enableRotation"
                                            type="checkbox"
                                            class="mr-2 rounded" />
                                        <span class="text-gray-300"
                                            >旋转动画</span
                                        >
                                    </label>
                                    <label class="flex items-center">
                                        <input
                                            v-model="enablePulsing"
                                            type="checkbox"
                                            class="mr-2 rounded" />
                                        <span class="text-gray-300"
                                            >脉冲效果</span
                                        >
                                    </label>
                                    <label class="flex items-center">
                                        <input
                                            v-model="enableTrail"
                                            type="checkbox"
                                            class="mr-2 rounded" />
                                        <span class="text-gray-300"
                                            >拖尾效果</span
                                        >
                                    </label>
                                </div>
                            </div>

                            <!-- 操作按钮 -->
                            <div class="space-y-3">
                                <button
                                    @click="addRandomShape"
                                    class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200">
                                    添加随机图形
                                </button>
                                <button
                                    @click="clearCanvas"
                                    class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200">
                                    清空画布
                                </button>
                                <button
                                    @click="saveCanvas"
                                    class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200">
                                    保存图片
                                </button>
                            </div>

                            <!-- 统计信息 -->
                            <div class="mt-6 pt-6 border-t border-white/10">
                                <h4
                                    class="text-sm font-medium text-gray-300 mb-2">
                                    统计信息
                                </h4>
                                <div class="text-xs text-gray-400 space-y-1">
                                    <div>图形数量: {{ shapeCount }}</div>
                                    <div>FPS: {{ fps }}</div>
                                    <div>
                                        鼠标位置: ({{ mouseX }}, {{ mouseY }})
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 功能说明 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <h2 class="text-2xl font-bold text-white mb-6">功能说明</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-3">
                            交互功能
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 鼠标点击添加图形</li>
                            <li>• 鼠标拖拽移动图形</li>
                            <li>• 滚轮缩放图形大小</li>
                            <li>• 双击删除图形</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-3">
                            动画效果
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 旋转动画效果</li>
                            <li>• 脉冲缩放效果</li>
                            <li>• 鼠标拖尾效果</li>
                            <li>• 碰撞检测反弹</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回首页
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAppStore } from "@/stores";
import CanvasEngine from "@/components/canvas/CanvasEngine.vue";

// 使用应用状态
const appStore = useAppStore();

// Canvas 引用
const canvasRef = ref<InstanceType<typeof CanvasEngine>>();

// 控制状态
const selectedShape = ref("circle");
const selectedColor = ref("#3b82f6");
const shapeSize = ref(50);
const enableRotation = ref(false);
const enablePulsing = ref(false);
const enableTrail = ref(false);

// 统计信息
const shapeCount = ref(0);
const fps = ref(60);
const mouseX = ref(0);
const mouseY = ref(0);

// 颜色选项
const colors = [
    "#3b82f6", // 蓝色
    "#8b5cf6", // 紫色
    "#06d6a0", // 绿色
    "#f72585", // 粉色
    "#ffd60a", // 黄色
    "#ff6b35", // 橙色
    "#003566", // 深蓝
    "#7209b7", // 深紫
];

/**
 * 更新图形类型
 */
function updateShape(): void {
    if (canvasRef.value) {
        canvasRef.value.setCurrentShape(selectedShape.value);
    }
}

/**
 * 添加随机图形
 */
function addRandomShape(): void {
    if (canvasRef.value) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = Math.random() * 50 + 20;
        const randomX = Math.random() * 600 + 100;
        const randomY = Math.random() * 400 + 100;

        canvasRef.value.addShape({
            type: selectedShape.value,
            x: randomX,
            y: randomY,
            size: randomSize,
            color: randomColor,
            rotation: 0,
            velocity: {
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4,
            },
        });

        shapeCount.value++;
    }
}

/**
 * 清空画布
 */
function clearCanvas(): void {
    if (canvasRef.value) {
        canvasRef.value.clearAll();
        shapeCount.value = 0;
    }
}

/**
 * 保存画布为图片
 */
function saveCanvas(): void {
    if (canvasRef.value) {
        canvasRef.value.saveAsImage("canvas-artwork.png");
    }
}

/**
 * 更新鼠标位置
 */
function updateMousePosition(event: MouseEvent): void {
    const canvas = canvasRef.value?.getCanvasElement();
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mouseX.value = Math.round(event.clientX - rect.left);
        mouseY.value = Math.round(event.clientY - rect.top);
    }
}

/**
 * 更新FPS
 */
function updateFPS(newFPS: number): void {
    fps.value = Math.round(newFPS);
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("canvas-test");

    // 设置页面标题
    document.title = "Canvas 测试 - 交互式简历网站";

    // 监听鼠标移动
    document.addEventListener("mousemove", updateMousePosition);

    // 初始化 Canvas
    if (canvasRef.value) {
        canvasRef.value.onFPSUpdate = updateFPS;
        canvasRef.value.onShapeCountChange = (count: number) => {
            shapeCount.value = count;
        };
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("mousemove", updateMousePosition);
});
</script>

<style scoped>
.container {
    max-width: 1400px;
}

/* 滑块样式 */
.slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* 复选框样式 */
input[type="checkbox"] {
    accent-color: #3b82f6;
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .lg\:flex-row {
        flex-direction: column;
    }

    .lg\:w-80 {
        width: 100%;
    }
}

@media (max-width: 768px) {
    .text-4xl {
        font-size: 2rem;
    }

    .md\:text-6xl {
        font-size: 2.5rem;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>
