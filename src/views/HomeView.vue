<template>
    <div
        class="home-view min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <!-- 主页内容 -->
        <div class="container mx-auto px-4 py-16">
            <!-- 欢迎区域 -->
            <div class="text-center mb-16">
                <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
                    <span
                        class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        交互式简历网站
                    </span>
                </h1>
                <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    欢迎来到徐思宏的交互式简历网站，这里展示了现代前端技术的魅力
                </p>

                <!-- 导航按钮 -->
                <div class="flex flex-wrap justify-center gap-4">
                    <router-link
                        to="/skills"
                        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        技能展示
                    </router-link>
                    <router-link
                        to="/experience"
                        class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        工作经验
                    </router-link>
                    <router-link
                        to="/projects"
                        class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        项目作品
                    </router-link>
                </div>
            </div>

            <!-- 特色展示区域 -->
            <div class="grid md:grid-cols-3 gap-8 mb-16">
                <!-- 动画展示 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">
                            GSAP 动画
                        </h3>
                        <p class="text-gray-300 text-sm">
                            使用 GSAP 创建流畅的动画效果，提升用户体验
                        </p>
                    </div>
                </div>

                <!-- Canvas 图形 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">
                            Canvas 图形
                        </h3>
                        <p class="text-gray-300 text-sm">
                            利用 Canvas 技术创建复杂的图形和交互效果
                        </p>
                    </div>
                </div>

                <!-- 物理引擎 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-2">
                            Matter.js 物理
                        </h3>
                        <p class="text-gray-300 text-sm">
                            集成 Matter.js 物理引擎，创建真实的物理交互
                        </p>
                    </div>
                </div>
            </div>

            <!-- 测试页面导航 -->
            <div
                class="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    技术演示
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <router-link
                        to="/canvas-test"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h3 class="text-white font-semibold mb-2">
                            Canvas 测试
                        </h3>
                        <p class="text-gray-300 text-sm">Canvas 图形渲染演示</p>
                    </router-link>

                    <router-link
                        to="/particle-test"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h3 class="text-white font-semibold mb-2">粒子系统</h3>
                        <p class="text-gray-300 text-sm">粒子效果演示</p>
                    </router-link>

                    <router-link
                        to="/shape-test"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h3 class="text-white font-semibold mb-2">几何图形</h3>
                        <p class="text-gray-300 text-sm">几何图形动画演示</p>
                    </router-link>

                    <router-link
                        to="/physics-test"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h3 class="text-white font-semibold mb-2">物理引擎</h3>
                        <p class="text-gray-300 text-sm">Matter.js 物理演示</p>
                    </router-link>

                    <router-link
                        to="/animation-demo"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h3 class="text-white font-semibold mb-2">动画演示</h3>
                        <p class="text-gray-300 text-sm">GSAP 动画效果演示</p>
                    </router-link>

                    <router-link
                        to="/lottie-test"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h3 class="text-white font-semibold mb-2">
                            Lottie 动画
                        </h3>
                        <p class="text-gray-300 text-sm">Lottie 矢量动画演示</p>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/stores";

// 使用应用状态
const appStore = useAppStore();

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("home");

    // 设置页面标题
    document.title = "首页 - 交互式简历网站";
});
</script>

<style scoped>
/* 自定义样式 */
.container {
    max-width: 1200px;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .text-5xl {
        font-size: 2.5rem;
    }

    .md\:text-7xl {
        font-size: 3rem;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-3 {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 动画效果 */
@keyframes float {
    0%,
    100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

.hover\:scale-105:hover {
    animation: float 2s ease-in-out infinite;
}
</style>
