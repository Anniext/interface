<template>
    <div
        class="physics-test-view min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                        物理引擎测试
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示 Matter.js 物理引擎的各种效果和交互
                </p>
            </div>

            <!-- 物理世界展示区域 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <div
                    class="bg-black/50 rounded-lg p-4 border border-white/10 mb-6">
                    <div
                        ref="physicsContainer"
                        class="w-full h-96 rounded-lg relative overflow-hidden">
                        <!-- 物理世界将在这里渲染 -->
                    </div>
                </div>

                <!-- 控制面板 -->
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">物理设置</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm text-gray-300 mb-1"
                                    >重力: {{ gravity }}</label
                                >
                                <input
                                    v-model="gravity"
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm text-gray-300 mb-1"
                                    >弹性: {{ restitution }}</label
                                >
                                <input
                                    v-model="restitution"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm text-gray-300 mb-1"
                                    >摩擦: {{ friction }}</label
                                >
                                <input
                                    v-model="friction"
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    class="w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">添加物体</h3>
                        <div class="space-y-2">
                            <button
                                @click="addBox"
                                class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                                添加方块
                            </button>
                            <button
                                @click="addCircle"
                                class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                                添加圆球
                            </button>
                            <button
                                @click="addTriangle"
                                class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
                                添加三角形
                            </button>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">特殊效果</h3>
                        <div class="space-y-2">
                            <button
                                @click="createChain"
                                class="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                                创建链条
                            </button>
                            <button
                                @click="createSeesaw"
                                class="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors">
                                创建跷跷板
                            </button>
                            <button
                                @click="createPendulum"
                                class="w-full px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded text-sm transition-colors">
                                创建摆锤
                            </button>
                        </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-4">
                        <h3 class="text-white font-semibold mb-3">控制</h3>
                        <div class="space-y-2">
                            <button
                                @click="pausePhysics"
                                class="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                                {{ isPaused ? "继续" : "暂停" }}
                            </button>
                            <button
                                @click="resetWorld"
                                class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                                重置世界
                            </button>
                            <button
                                @click="explode"
                                class="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors">
                                爆炸效果
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
                            物理特性
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 真实的重力模拟</li>
                            <li>• 碰撞检测和响应</li>
                            <li>• 弹性和摩擦力</li>
                            <li>• 约束和连接</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-3">
                            交互功能
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 鼠标拖拽物体</li>
                            <li>• 实时调整参数</li>
                            <li>• 创建复杂结构</li>
                            <li>• 特殊效果演示</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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

// 物理世界容器引用
const physicsContainer = ref<HTMLElement>();

// 控制参数
const gravity = ref(1);
const restitution = ref(0.8);
const friction = ref(0.1);
const isPaused = ref(false);

// 模拟的物理引擎变量（实际项目中会使用 Matter.js）
let engine: any = null;
let world: any = null;
let render: any = null;
let bodies: any[] = [];

/**
 * 初始化物理世界
 */
function initPhysics() {
    if (!physicsContainer.value) return;

    // 这里是模拟的物理引擎初始化
    // 实际项目中会使用 Matter.js
    console.log("初始化物理世界");

    // 创建地面
    createGround();

    // 添加一些初始物体
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            addBox();
        }, i * 200);
    }
}

/**
 * 创建地面
 */
function createGround() {
    console.log("创建地面");
    // 模拟创建地面的逻辑
}

/**
 * 添加方块
 */
function addBox() {
    console.log("添加方块", {
        gravity: gravity.value,
        restitution: restitution.value,
        friction: friction.value,
    });

    // 模拟添加方块的视觉效果
    if (physicsContainer.value) {
        const box = document.createElement("div");
        box.className = "absolute bg-blue-500 border border-blue-400 rounded";
        box.style.width = "30px";
        box.style.height = "30px";
        box.style.left =
            Math.random() * (physicsContainer.value.clientWidth - 30) + "px";
        box.style.top = "10px";
        box.style.transition = "all 0.1s ease";

        physicsContainer.value.appendChild(box);
        bodies.push(box);

        // 模拟下落动画
        setTimeout(() => {
            box.style.top = physicsContainer.value!.clientHeight - 40 + "px";
        }, 100);

        // 清理
        setTimeout(() => {
            if (box.parentNode) {
                box.parentNode.removeChild(box);
            }
        }, 3000);
    }
}

/**
 * 添加圆球
 */
function addCircle() {
    console.log("添加圆球");

    if (physicsContainer.value) {
        const circle = document.createElement("div");
        circle.className =
            "absolute bg-green-500 border border-green-400 rounded-full";
        circle.style.width = "30px";
        circle.style.height = "30px";
        circle.style.left =
            Math.random() * (physicsContainer.value.clientWidth - 30) + "px";
        circle.style.top = "10px";
        circle.style.transition = "all 0.1s ease";

        physicsContainer.value.appendChild(circle);
        bodies.push(circle);

        // 模拟下落动画
        setTimeout(() => {
            circle.style.top = physicsContainer.value!.clientHeight - 40 + "px";
        }, 100);

        // 清理
        setTimeout(() => {
            if (circle.parentNode) {
                circle.parentNode.removeChild(circle);
            }
        }, 3000);
    }
}

/**
 * 添加三角形
 */
function addTriangle() {
    console.log("添加三角形");

    if (physicsContainer.value) {
        const triangle = document.createElement("div");
        triangle.className =
            "absolute border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-purple-500";
        triangle.style.left =
            Math.random() * (physicsContainer.value.clientWidth - 30) + "px";
        triangle.style.top = "10px";
        triangle.style.transition = "all 0.1s ease";

        physicsContainer.value.appendChild(triangle);
        bodies.push(triangle);

        // 模拟下落动画
        setTimeout(() => {
            triangle.style.top =
                physicsContainer.value!.clientHeight - 40 + "px";
        }, 100);

        // 清理
        setTimeout(() => {
            if (triangle.parentNode) {
                triangle.parentNode.removeChild(triangle);
            }
        }, 3000);
    }
}

/**
 * 创建链条
 */
function createChain() {
    console.log("创建链条");

    if (physicsContainer.value) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const link = document.createElement("div");
                link.className =
                    "absolute bg-yellow-500 border border-yellow-400 rounded";
                link.style.width = "20px";
                link.style.height = "20px";
                link.style.left = "200px";
                link.style.top = 50 + i * 25 + "px";

                physicsContainer.value!.appendChild(link);
                bodies.push(link);

                // 清理
                setTimeout(() => {
                    if (link.parentNode) {
                        link.parentNode.removeChild(link);
                    }
                }, 5000);
            }, i * 100);
        }
    }
}

/**
 * 创建跷跷板
 */
function createSeesaw() {
    console.log("创建跷跷板");

    if (physicsContainer.value) {
        const seesaw = document.createElement("div");
        seesaw.className = "absolute bg-orange-500 border border-orange-400";
        seesaw.style.width = "150px";
        seesaw.style.height = "10px";
        seesaw.style.left = "150px";
        seesaw.style.top = "200px";
        seesaw.style.transformOrigin = "center";

        physicsContainer.value.appendChild(seesaw);
        bodies.push(seesaw);

        // 模拟摇摆动画
        let angle = 0;
        const swayInterval = setInterval(() => {
            angle += 0.1;
            seesaw.style.transform = `rotate(${Math.sin(angle) * 15}deg)`;
        }, 50);

        // 清理
        setTimeout(() => {
            clearInterval(swayInterval);
            if (seesaw.parentNode) {
                seesaw.parentNode.removeChild(seesaw);
            }
        }, 5000);
    }
}

/**
 * 创建摆锤
 */
function createPendulum() {
    console.log("创建摆锤");

    if (physicsContainer.value) {
        // 摆线
        const line = document.createElement("div");
        line.className = "absolute bg-gray-400";
        line.style.width = "2px";
        line.style.height = "100px";
        line.style.left = "300px";
        line.style.top = "50px";
        line.style.transformOrigin = "top center";

        // 摆锤
        const bob = document.createElement("div");
        bob.className =
            "absolute bg-pink-500 border border-pink-400 rounded-full";
        bob.style.width = "20px";
        bob.style.height = "20px";
        bob.style.left = "290px";
        bob.style.top = "140px";

        physicsContainer.value.appendChild(line);
        physicsContainer.value.appendChild(bob);
        bodies.push(line, bob);

        // 模拟摆动动画
        let angle = Math.PI / 4;
        let velocity = 0;
        const pendulumInterval = setInterval(() => {
            const acceleration = -0.01 * Math.sin(angle);
            velocity += acceleration;
            angle += velocity;
            velocity *= 0.999; // 阻尼

            line.style.transform = `rotate(${angle}rad)`;
            const bobX = 300 + Math.sin(angle) * 100 - 10;
            const bobY = 50 + Math.cos(angle) * 100;
            bob.style.left = bobX + "px";
            bob.style.top = bobY + "px";
        }, 16);

        // 清理
        setTimeout(() => {
            clearInterval(pendulumInterval);
            if (line.parentNode) line.parentNode.removeChild(line);
            if (bob.parentNode) bob.parentNode.removeChild(bob);
        }, 8000);
    }
}

/**
 * 暂停/继续物理模拟
 */
function pausePhysics() {
    isPaused.value = !isPaused.value;
    console.log(isPaused.value ? "暂停物理模拟" : "继续物理模拟");
}

/**
 * 重置物理世界
 */
function resetWorld() {
    console.log("重置物理世界");

    // 清理所有物体
    if (physicsContainer.value) {
        while (physicsContainer.value.firstChild) {
            physicsContainer.value.removeChild(
                physicsContainer.value.firstChild,
            );
        }
    }
    bodies = [];
}

/**
 * 爆炸效果
 */
function explode() {
    console.log("爆炸效果");

    if (physicsContainer.value) {
        // 创建爆炸粒子
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement("div");
            particle.className = "absolute bg-red-500 rounded-full";
            particle.style.width = "5px";
            particle.style.height = "5px";
            particle.style.left = "200px";
            particle.style.top = "200px";
            particle.style.transition = "all 1s ease-out";

            physicsContainer.value.appendChild(particle);

            // 随机方向爆炸
            setTimeout(() => {
                const angle = (i / 20) * Math.PI * 2;
                const distance = 100 + Math.random() * 100;
                const x = 200 + Math.cos(angle) * distance;
                const y = 200 + Math.sin(angle) * distance;

                particle.style.left = x + "px";
                particle.style.top = y + "px";
                particle.style.opacity = "0";
            }, 50);

            // 清理
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("physics-test");

    // 设置页面标题
    document.title = "物理引擎测试 - 交互式简历网站";

    // 初始化物理世界
    setTimeout(initPhysics, 100);
});

onBeforeUnmount(() => {
    // 清理物理世界
    resetWorld();
});
</script>

<style scoped>
.container {
    max-width: 1200px;
}

/* 滑块样式 */
input[type="range"] {
    accent-color: #10b981;
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
