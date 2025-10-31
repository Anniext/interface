<template>
    <div
        class="particle-test-view min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        粒子系统测试
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示粒子系统的各种效果和交互功能
                </p>
            </div>

            <!-- 粒子演示区域 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <div
                    class="bg-black/50 rounded-lg p-4 border border-white/10 mb-6">
                    <canvas
                        ref="particleCanvas"
                        class="w-full h-96 rounded-lg cursor-crosshair"
                        @mousemove="handleMouseMove"
                        @click="handleClick">
                    </canvas>
                </div>

                <!-- 控制面板 -->
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">粒子设置</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm text-gray-300 mb-1"
                                    >粒子数量: {{ particleCount }}</label
                                >
                                <input
                                    v-model="particleCount"
                                    type="range"
                                    min="10"
                                    max="500"
                                    class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm text-gray-300 mb-1"
                                    >粒子大小: {{ particleSize }}</label
                                >
                                <input
                                    v-model="particleSize"
                                    type="range"
                                    min="1"
                                    max="10"
                                    class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm text-gray-300 mb-1"
                                    >速度: {{ speed }}</label
                                >
                                <input
                                    v-model="speed"
                                    type="range"
                                    min="0.1"
                                    max="5"
                                    step="0.1"
                                    class="w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">效果控制</h3>
                        <div class="space-y-3">
                            <label class="flex items-center">
                                <input
                                    v-model="enableTrails"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300">拖尾效果</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="enableGravity"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300">重力效果</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="enableCollision"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300">碰撞检测</span>
                            </label>
                            <label class="flex items-center">
                                <input
                                    v-model="enableMouse"
                                    type="checkbox"
                                    class="mr-2" />
                                <span class="text-gray-300">鼠标交互</span>
                            </label>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">预设效果</h3>
                        <div class="space-y-2">
                            <button
                                @click="setPreset('fireworks')"
                                class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
                                烟花效果
                            </button>
                            <button
                                @click="setPreset('snow')"
                                class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                                雪花效果
                            </button>
                            <button
                                @click="setPreset('galaxy')"
                                class="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors">
                                星系效果
                            </button>
                            <button
                                @click="resetParticles"
                                class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                                重置
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
                            交互功能
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 鼠标移动：粒子跟随鼠标</li>
                            <li>• 点击：生成粒子爆炸</li>
                            <li>• 实时调整参数</li>
                            <li>• 多种预设效果</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-3">
                            物理效果
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 重力模拟</li>
                            <li>• 碰撞检测</li>
                            <li>• 拖尾渲染</li>
                            <li>• 生命周期管理</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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
const particleCanvas = ref<HTMLCanvasElement>();

// 控制参数
const particleCount = ref(100);
const particleSize = ref(3);
const speed = ref(1);
const enableTrails = ref(true);
const enableGravity = ref(false);
const enableCollision = ref(false);
const enableMouse = ref(true);

// 粒子系统变量
let ctx: CanvasRenderingContext2D | null = null;
let particles: any[] = [];
let animationId: number = 0;
let mouseX = 0;
let mouseY = 0;

/**
 * 粒子类
 */
class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    maxLife: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * speed.value * 2;
        this.vy = (Math.random() - 0.5) * speed.value * 2;
        this.size = Math.random() * particleSize.value + 1;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.life = 1;
        this.maxLife = Math.random() * 100 + 50;
    }

    update() {
        // 重力效果
        if (enableGravity.value) {
            this.vy += 0.1;
        }

        // 鼠标交互
        if (enableMouse.value) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx += (dx / distance) * force * 0.1;
                this.vy += (dy / distance) * force * 0.1;
            }
        }

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;

        // 边界碰撞
        if (enableCollision.value && particleCanvas.value) {
            if (this.x <= 0 || this.x >= particleCanvas.value.width) {
                this.vx *= -0.8;
                this.x = Math.max(
                    0,
                    Math.min(particleCanvas.value.width, this.x),
                );
            }
            if (this.y <= 0 || this.y >= particleCanvas.value.height) {
                this.vy *= -0.8;
                this.y = Math.max(
                    0,
                    Math.min(particleCanvas.value.height, this.y),
                );
            }
        }

        // 生命周期
        this.life -= 1 / this.maxLife;
    }

    draw() {
        if (!ctx) return;

        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

/**
 * 初始化粒子系统
 */
function initParticles() {
    if (!particleCanvas.value) return;

    ctx = particleCanvas.value.getContext("2d");
    if (!ctx) return;

    // 设置 Canvas 尺寸
    const rect = particleCanvas.value.getBoundingClientRect();
    particleCanvas.value.width = rect.width;
    particleCanvas.value.height = rect.height;

    // 创建初始粒子
    particles = [];
    for (let i = 0; i < particleCount.value; i++) {
        particles.push(
            new Particle(
                Math.random() * particleCanvas.value.width,
                Math.random() * particleCanvas.value.height,
            ),
        );
    }

    animate();
}

/**
 * 动画循环
 */
function animate() {
    if (!ctx || !particleCanvas.value) return;

    // 清空画布或创建拖尾效果
    if (enableTrails.value) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(
            0,
            0,
            particleCanvas.value.width,
            particleCanvas.value.height,
        );
    } else {
        ctx.clearRect(
            0,
            0,
            particleCanvas.value.width,
            particleCanvas.value.height,
        );
    }

    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        // 移除死亡的粒子
        if (particle.isDead()) {
            particles.splice(i, 1);
        }
    }

    // 补充粒子
    while (particles.length < particleCount.value) {
        particles.push(
            new Particle(
                Math.random() * particleCanvas.value.width,
                Math.random() * particleCanvas.value.height,
            ),
        );
    }

    animationId = requestAnimationFrame(animate);
}

/**
 * 处理鼠标移动
 */
function handleMouseMove(event: MouseEvent) {
    const rect = particleCanvas.value?.getBoundingClientRect();
    if (rect) {
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }
}

/**
 * 处理点击事件
 */
function handleClick(event: MouseEvent) {
    const rect = particleCanvas.value?.getBoundingClientRect();
    if (rect) {
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // 在点击位置创建爆炸效果
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle(clickX, clickY));
        }
    }
}

/**
 * 设置预设效果
 */
function setPreset(preset: string) {
    switch (preset) {
        case "fireworks":
            particleCount.value = 200;
            particleSize.value = 4;
            speed.value = 3;
            enableTrails.value = true;
            enableGravity.value = true;
            enableCollision.value = false;
            break;
        case "snow":
            particleCount.value = 150;
            particleSize.value = 2;
            speed.value = 0.5;
            enableTrails.value = false;
            enableGravity.value = true;
            enableCollision.value = false;
            break;
        case "galaxy":
            particleCount.value = 300;
            particleSize.value = 1;
            speed.value = 2;
            enableTrails.value = true;
            enableGravity.value = false;
            enableCollision.value = false;
            break;
    }
}

/**
 * 重置粒子系统
 */
function resetParticles() {
    particles = [];
    particleCount.value = 100;
    particleSize.value = 3;
    speed.value = 1;
    enableTrails.value = true;
    enableGravity.value = false;
    enableCollision.value = false;
    enableMouse.value = true;
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("particle-test");

    // 设置页面标题
    document.title = "粒子系统测试 - 交互式简历网站";

    // 初始化粒子系统
    setTimeout(initParticles, 100);
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

/* 滑块样式 */
input[type="range"] {
    accent-color: #8b5cf6;
}

/* 复选框样式 */
input[type="checkbox"] {
    accent-color: #8b5cf6;
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

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>
