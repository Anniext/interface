<template>
    <div
        class="lottie-test-view min-h-screen bg-linear-to-br from-slate-900 via-rose-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-linear-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                        Lottie 动画测试
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示 Lottie 矢量动画的各种效果和控制功能
                </p>
            </div>

            <!-- Lottie 动画展示区域 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <div class="grid lg:grid-cols-2 gap-8">
                    <!-- 动画播放区域 -->
                    <div
                        class="bg-black/50 rounded-lg p-6 border border-white/10">
                        <div class="text-center mb-4">
                            <h3 class="text-lg font-semibold text-white">
                                动画播放器
                            </h3>
                        </div>
                        <div
                            ref="lottieContainer"
                            class="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center">
                            <!-- Lottie 动画将在这里渲染 -->
                            <div class="text-center text-gray-400">
                                <svg
                                    class="w-16 h-16 mx-auto mb-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clip-rule="evenodd" />
                                </svg>
                                <p>Lottie 动画播放区域</p>
                                <p class="text-sm mt-2">选择动画开始播放</p>
                            </div>
                        </div>
                    </div>

                    <!-- 控制面板 -->
                    <div class="space-y-6">
                        <!-- 动画选择 -->
                        <div class="bg-white/5 rounded-lg p-4">
                            <h3 class="text-white font-semibold mb-3">
                                动画选择
                            </h3>
                            <div class="grid grid-cols-2 gap-2">
                                <button
                                    v-for="animation in animations"
                                    :key="animation.name"
                                    @click="loadAnimation(animation)"
                                    :class="[
                                        'px-3 py-2 rounded text-sm transition-colors',
                                        currentAnimation?.name ===
                                        animation.name
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20',
                                    ]">
                                    {{ animation.name }}
                                </button>
                            </div>
                        </div>

                        <!-- 播放控制 -->
                        <div class="bg-white/5 rounded-lg p-4">
                            <h3 class="text-white font-semibold mb-3">
                                播放控制
                            </h3>
                            <div class="space-y-3">
                                <div class="flex gap-2">
                                    <button
                                        @click="playAnimation"
                                        class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
                                        播放
                                    </button>
                                    <button
                                        @click="pauseAnimation"
                                        class="flex-1 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors">
                                        暂停
                                    </button>
                                    <button
                                        @click="stopAnimation"
                                        class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                                        停止
                                    </button>
                                </div>

                                <div>
                                    <label
                                        class="block text-sm text-gray-300 mb-1"
                                        >播放速度: {{ speed }}x</label
                                    >
                                    <input
                                        v-model="speed"
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        @input="updateSpeed"
                                        class="w-full" />
                                </div>

                                <div>
                                    <label class="flex items-center">
                                        <input
                                            v-model="loop"
                                            type="checkbox"
                                            @change="updateLoop"
                                            class="mr-2" />
                                        <span class="text-gray-300"
                                            >循环播放</span
                                        >
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- 渲染设置 -->
                        <div class="bg-white/5 rounded-lg p-4">
                            <h3 class="text-white font-semibold mb-3">
                                渲染设置
                            </h3>
                            <div class="space-y-3">
                                <div>
                                    <label
                                        class="block text-sm text-gray-300 mb-1"
                                        >渲染器</label
                                    >
                                    <select
                                        v-model="renderer"
                                        @change="updateRenderer"
                                        class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white">
                                        <option value="svg">SVG</option>
                                        <option value="canvas">Canvas</option>
                                        <option value="html">HTML</option>
                                    </select>
                                </div>

                                <div>
                                    <label
                                        class="block text-sm text-gray-300 mb-1"
                                        >尺寸: {{ size }}px</label
                                    >
                                    <input
                                        v-model="size"
                                        type="range"
                                        min="100"
                                        max="400"
                                        step="10"
                                        @input="updateSize"
                                        class="w-full" />
                                </div>
                            </div>
                        </div>

                        <!-- 动画信息 -->
                        <div class="bg-white/5 rounded-lg p-4">
                            <h3 class="text-white font-semibold mb-3">
                                动画信息
                            </h3>
                            <div class="text-sm text-gray-300 space-y-1">
                                <div>
                                    名称:
                                    {{ currentAnimation?.name || "未选择" }}
                                </div>
                                <div>状态: {{ animationState }}</div>
                                <div>帧率: {{ fps }} FPS</div>
                                <div>总帧数: {{ totalFrames }}</div>
                                <div>当前帧: {{ currentFrame }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 预设动画展示 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <h2 class="text-2xl font-bold text-white mb-6">预设动画展示</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <div
                        v-for="preset in presetAnimations"
                        :key="preset.name"
                        class="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors cursor-pointer"
                        @click="loadAnimation(preset)">
                        <div
                            class="w-20 h-20 bg-white/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg
                                class="w-10 h-10 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-white font-semibold mb-1">
                            {{ preset.name }}
                        </h3>
                        <p class="text-gray-300 text-sm">
                            {{ preset.description }}
                        </p>
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
                            Lottie 特性
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 矢量动画，无损缩放</li>
                            <li>• 小文件体积，高质量</li>
                            <li>• 支持多种渲染器</li>
                            <li>• 丰富的交互控制</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-3">
                            控制功能
                        </h3>
                        <ul class="text-gray-300 space-y-2">
                            <li>• 播放/暂停/停止控制</li>
                            <li>• 播放速度调节</li>
                            <li>• 循环播放设置</li>
                            <li>• 渲染器切换</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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

// DOM 引用
const lottieContainer = ref<HTMLElement>();

// 控制状态
const currentAnimation = ref<any>(null);
const animationState = ref("停止");
const speed = ref(1);
const loop = ref(true);
const renderer = ref("svg");
const size = ref(200);
const fps = ref(30);
const totalFrames = ref(0);
const currentFrame = ref(0);

// 模拟的 Lottie 实例
let lottieInstance: any = null;

// 可用动画列表
const animations = [
    { name: "加载动画", type: "loading", description: "旋转加载效果" },
    { name: "成功动画", type: "success", description: "成功确认效果" },
    { name: "错误动画", type: "error", description: "错误提示效果" },
    { name: "心跳动画", type: "heart", description: "心跳脉冲效果" },
];

// 预设动画
const presetAnimations = [
    { name: "欢迎动画", type: "welcome", description: "欢迎页面动画" },
    { name: "庆祝动画", type: "celebration", description: "庆祝成功动画" },
    { name: "思考动画", type: "thinking", description: "思考加载动画" },
    { name: "完成动画", type: "complete", description: "任务完成动画" },
    { name: "警告动画", type: "warning", description: "警告提示动画" },
    { name: "信息动画", type: "info", description: "信息展示动画" },
];

/**
 * 加载动画
 */
function loadAnimation(animation: any) {
    currentAnimation.value = animation;
    animationState.value = "加载中";

    // 模拟加载 Lottie 动画
    setTimeout(() => {
        if (lottieContainer.value) {
            // 清空容器
            lottieContainer.value.innerHTML = "";

            // 创建模拟动画元素
            const animationElement = createMockAnimation(animation.type);
            lottieContainer.value.appendChild(animationElement);

            // 更新状态
            animationState.value = "已加载";
            totalFrames.value = 60; // 模拟60帧
            currentFrame.value = 0;

            console.log(`加载动画: ${animation.name}`);
        }
    }, 500);
}

/**
 * 创建模拟动画元素
 */
function createMockAnimation(type: string): HTMLElement {
    const element = document.createElement("div");
    element.className = "w-full h-full flex items-center justify-center";

    let content = "";
    let animation = "";

    switch (type) {
        case "loading":
            content = `
                <div class="w-16 h-16 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
            `;
            break;
        case "success":
            content = `
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
            `;
            break;
        case "error":
            content = `
                <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </div>
            `;
            break;
        case "heart":
            content = `
                <div class="w-16 h-16 text-pink-500 animate-pulse">
                    <svg class="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                    </svg>
                </div>
            `;
            break;
        default:
            content = `
                <div class="w-16 h-16 bg-blue-500 rounded-lg animate-pulse flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                </div>
            `;
    }

    element.innerHTML = content;
    return element;
}

/**
 * 播放动画
 */
function playAnimation() {
    if (!currentAnimation.value) return;

    animationState.value = "播放中";
    console.log("播放动画");

    // 模拟帧数更新
    const frameInterval = setInterval(() => {
        currentFrame.value = (currentFrame.value + 1) % totalFrames.value;

        if (!loop.value && currentFrame.value === 0) {
            clearInterval(frameInterval);
            animationState.value = "已停止";
        }
    }, 1000 / fps.value);
}

/**
 * 暂停动画
 */
function pauseAnimation() {
    animationState.value = "已暂停";
    console.log("暂停动画");
}

/**
 * 停止动画
 */
function stopAnimation() {
    animationState.value = "已停止";
    currentFrame.value = 0;
    console.log("停止动画");
}

/**
 * 更新播放速度
 */
function updateSpeed() {
    console.log(`更新播放速度: ${speed.value}x`);
}

/**
 * 更新循环设置
 */
function updateLoop() {
    console.log(`循环播放: ${loop.value}`);
}

/**
 * 更新渲染器
 */
function updateRenderer() {
    console.log(`切换渲染器: ${renderer.value}`);

    if (currentAnimation.value) {
        // 重新加载动画以应用新的渲染器
        loadAnimation(currentAnimation.value);
    }
}

/**
 * 更新尺寸
 */
function updateSize() {
    if (lottieContainer.value) {
        lottieContainer.value.style.width = size.value + "px";
        lottieContainer.value.style.height = size.value + "px";
    }
    console.log(`更新尺寸: ${size.value}px`);
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("lottie-test");

    // 设置页面标题
    document.title = "Lottie 动画测试 - 交互式简历网站";

    // 加载默认动画
    setTimeout(() => {
        loadAnimation(animations[0]);
    }, 1000);
});

onBeforeUnmount(() => {
    // 清理动画实例
    if (lottieInstance) {
        lottieInstance = null;
    }
});
</script>

<style scoped>
.container {
    max-width: 1200px;
}

/* 滑块样式 */
input[type="range"] {
    accent-color: #f43f5e;
}

/* 复选框样式 */
input[type="checkbox"] {
    accent-color: #f43f5e;
}

/* 选择框样式 */
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .lg\:grid-cols-2 {
        grid-template-columns: 1fr;
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

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}
</style>
