<template>
    <div
        class="shape-test-view min-h-screen bg-linear-to-br from-slate-900 via-teal-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        几何图形测试
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示各种几何图形的绘制和动画效果
                </p>
            </div>

            <!-- 图形展示区域 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <div
                    class="bg-black/50 rounded-lg p-4 border border-white/10 mb-6">
                    <canvas
                        ref="shapeCanvas"
                        class="w-full h-96 rounded-lg"
                        @click="addShape">
                    </canvas>
                </div>

                <!-- 控制面板 -->
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">图形类型</h3>
                        <div class="space-y-2">
                            <button
                                v-for="shape in shapeTypes"
                                :key="shape.type"
                                @click="selectedShape = shape.type"
                                :class="[
                                    'w-full px-3 py-2 rounded text-sm transition-colors',
                                    selectedShape === shape.type
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20',
                                ]">
                                {{ shape.name }}
                            </button>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">颜色主题</h3>
                        <div class="grid grid-cols-3 gap-2">
                            <button
                                v-for="color in colorThemes"
                                :key="color"
                                @click="selectedColor = color"
                                :class="[
                                    'w-8 h-8 rounded border-2 transition-all',
                                    selectedColor === color
                                        ? 'border-white scale-110'
                                        : 'border-transparent',
                                ]"
                                :style="{ backgroundColor: color }"></button>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">动画效果</h3>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input
                                    v-model="enableRotation"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300 text-sm">旋转</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="enableScale"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300 text-sm">缩放</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="enableFloat"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300 text-sm">浮动</span>
                            </label>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">操作</h3>
                        <div class="space-y-2">
                            <button
                                @click="clearShapes"
                                class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                                清空
                            </button>
                            <button
                                @click="randomShapes"
                                class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                                随机生成
                            </button>
                            <button
                                @click="saveImage"
                                class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                                保存图片
                            </button>
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
                            支持的图形
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 圆形和椭圆</li>
                            <li>• 矩形和正方形</li>
                            <li>• 三角形和多边形</li>
                            <li>• 星形和复杂图形</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-3">
                            动画效果
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 平滑的旋转动画</li>
                            <li>• 缩放脉冲效果</li>
                            <li>• 浮动位移动画</li>
                            <li>• 颜色渐变过渡</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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

// 使用应用状态
const appStore = useAppStore();

// Canvas 引用
const shapeCanvas = ref<HTMLCanvasElement>();

// 控制状态
const selectedShape = ref("circle");
const selectedColor = ref("#14b8a6");
const enableRotation = ref(true);
const enableScale = ref(false);
const enableFloat = ref(false);

// 图形类型
const shapeTypes = [
    { type: "circle", name: "圆形" },
    { type: "rectangle", name: "矩形" },
    { type: "triangle", name: "三角形" },
    { type: "star", name: "星形" },
    { type: "hexagon", name: "六边形" },
    { type: "diamond", name: "菱形" },
];

// 颜色主题
const colorThemes = [
    "#14b8a6",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#10b981",
    "#f97316",
    "#ec4899",
];

// 图形数据
let ctx: CanvasRenderingContext2D | null = null;
let shapes: any[] = [];
let animationId: number = 0;

/**
 * 图形类
 */
class Shape {
    x: number;
    y: number;
    size: number;
    color: string;
    type: string;
    rotation: number;
    scale: number;
    floatOffset: number;
    baseY: number;

    constructor(x: number, y: number, type: string, color: string) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.size = Math.random() * 40 + 20;
        this.color = color;
        this.type = type;
        this.rotation = 0;
        this.scale = 1;
        this.floatOffset = Math.random() * Math.PI * 2;
    }

    update() {
        if (enableRotation.value) {
            this.rotation += 0.02;
        }

        if (enableScale.value) {
            this.scale =
                1 + Math.sin(Date.now() * 0.003 + this.floatOffset) * 0.2;
        }

        if (enableFloat.value) {
            this.y =
                this.baseY +
                Math.sin(Date.now() * 0.002 + this.floatOffset) * 10;
        }
    }

    draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        switch (this.type) {
            case "circle":
                this.drawCircle();
                break;
            case "rectangle":
                this.drawRectangle();
                break;
            case "triangle":
                this.drawTriangle();
                break;
            case "star":
                this.drawStar();
                break;
            case "hexagon":
                this.drawHexagon();
                break;
            case "diamond":
                this.drawDiamond();
                break;
        }

        ctx.restore();
    }

    drawCircle() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    drawRectangle() {
        if (!ctx) return;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    drawTriangle() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawStar() {
        if (!ctx) return;
        const spikes = 5;
        const outerRadius = this.size / 2;
        const innerRadius = outerRadius * 0.4;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawHexagon() {
        if (!ctx) return;
        const sides = 6;
        const radius = this.size / 2;

        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawDiamond() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, 0);
        ctx.lineTo(0, this.size / 2);
        ctx.lineTo(-this.size / 2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

/**
 * 初始化 Canvas
 */
function initCanvas() {
    if (!shapeCanvas.value) return;

    ctx = shapeCanvas.value.getContext("2d");
    if (!ctx) return;

    // 设置 Canvas 尺寸
    const rect = shapeCanvas.value.getBoundingClientRect();
    shapeCanvas.value.width = rect.width;
    shapeCanvas.value.height = rect.height;

    animate();
}

/**
 * 动画循环
 */
function animate() {
    if (!ctx || !shapeCanvas.value) return;

    // 清空画布
    ctx.clearRect(0, 0, shapeCanvas.value.width, shapeCanvas.value.height);

    // 更新和绘制图形
    shapes.forEach((shape) => {
        shape.update();
        shape.draw();
    });

    animationId = requestAnimationFrame(animate);
}

/**
 * 添加图形
 */
function addShape(event: MouseEvent) {
    const rect = shapeCanvas.value?.getBoundingClientRect();
    if (rect) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        shapes.push(new Shape(x, y, selectedShape.value, selectedColor.value));
    }
}

/**
 * 清空图形
 */
function clearShapes() {
    shapes = [];
}

/**
 * 随机生成图形
 */
function randomShapes() {
    if (!shapeCanvas.value) return;

    clearShapes();

    for (let i = 0; i < 10; i++) {
        const x = Math.random() * shapeCanvas.value.width;
        const y = Math.random() * shapeCanvas.value.height;
        const type =
            shapeTypes[Math.floor(Math.random() * shapeTypes.length)].type;
        const color =
            colorThemes[Math.floor(Math.random() * colorThemes.length)];

        shapes.push(new Shape(x, y, type, color));
    }
}

/**
 * 保存图片
 */
function saveImage() {
    if (!shapeCanvas.value) return;

    const link = document.createElement("a");
    link.download = "geometric-shapes.png";
    link.href = shapeCanvas.value.toDataURL();
    link.click();
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("shape-test");

    // 设置页面标题
    document.title = "几何图形测试 - 交互式简历网站";

    // 初始化 Canvas
    setTimeout(initCanvas, 100);
});

onBeforeUnmount(() => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
</script>

<style scoped>
.container {
    max-width: 1200px;
}

/* 复选框样式 */
input[type="checkbox"] {
    accent-color: #14b8a6;
}

/* 响应式适配 */
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

    .md\:grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>
