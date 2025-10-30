<template>
    <div class="min-h-screen bg-gray-900 text-white p-4">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-2xl font-bold mb-4">简单粒子测试</h1>

            <div class="mb-4">
                <button
                    @click="startTest"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded mr-2"
                    :disabled="isRunning">
                    {{ isRunning ? "运行中..." : "开始测试" }}
                </button>
                <button
                    @click="stopTest"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                    :disabled="!isRunning">
                    停止测试
                </button>
            </div>

            <div class="mb-4 p-4 bg-gray-800 rounded">
                <div class="text-sm">
                    <div>状态: {{ status }}</div>
                    <div>粒子数量: {{ particleCount }}</div>
                    <div>FPS: {{ fps.toFixed(1) }}</div>
                </div>
            </div>

            <div
                class="bg-black rounded border border-gray-600"
                style="height: 400px">
                <canvas
                    ref="canvasRef"
                    width="800"
                    height="400"
                    class="w-full h-full"></canvas>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvasRef = ref<HTMLCanvasElement>();
const isRunning = ref(false);
const status = ref("未开始");
const particleCount = ref(0);
const fps = ref(0);

let animationId: number | null = null;
let lastTime = 0;
let frameCount = 0;
let lastFpsTime = 0;

// 简单的粒子类
class SimpleParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 200;
        this.vy = (Math.random() - 0.5) * 200;
        this.life = 3;
        this.maxLife = 3;
        this.size = Math.random() * 5 + 2;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }

    update(deltaTime: number) {
        this.x += (this.vx * deltaTime) / 1000;
        this.y += (this.vy * deltaTime) / 1000;
        this.life -= deltaTime / 1000;

        // 边界反弹
        if (this.x < 0 || this.x > 800) this.vx *= -0.8;
        if (this.y < 0 || this.y > 400) this.vy *= -0.8;

        this.x = Math.max(0, Math.min(800, this.x));
        this.y = Math.max(0, Math.min(400, this.y));
    }

    draw(ctx: CanvasRenderingContext2D) {
        const alpha = Math.max(0, this.life / this.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isAlive() {
        return this.life > 0;
    }
}

const particles: SimpleParticle[] = [];

const startTest = () => {
    if (isRunning.value) return;

    status.value = "初始化中...";
    isRunning.value = true;

    const canvas = canvasRef.value;
    if (!canvas) {
        status.value = "错误: Canvas 未找到";
        isRunning.value = false;
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        status.value = "错误: 无法获取 2D 上下文";
        isRunning.value = false;
        return;
    }

    status.value = "运行中";
    lastTime = performance.now();
    lastFpsTime = lastTime;
    frameCount = 0;

    const animate = (currentTime: number) => {
        if (!isRunning.value) return;

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // 更新 FPS
        frameCount++;
        if (currentTime - lastFpsTime >= 1000) {
            fps.value = frameCount;
            frameCount = 0;
            lastFpsTime = currentTime;
        }

        // 添加新粒子
        if (particles.length < 100 && Math.random() < 0.3) {
            particles.push(new SimpleParticle(400, 200));
        }

        // 更新粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.update(deltaTime);

            if (!particle.isAlive()) {
                particles.splice(i, 1);
            }
        }

        // 清空画布
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 800, 400);

        // 绘制粒子
        particles.forEach((particle) => {
            particle.draw(ctx);
        });

        // 更新统计
        particleCount.value = particles.length;

        animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
};

const stopTest = () => {
    isRunning.value = false;
    status.value = "已停止";

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    particles.length = 0;
    particleCount.value = 0;
    fps.value = 0;
};

onMounted(() => {
    console.log("简单粒子测试页面已加载");
});

onBeforeUnmount(() => {
    stopTest();
});
</script>
