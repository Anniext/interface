<template>
    <div
        class="skills-view min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        技能展示
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示我在前端开发、后端技术和工具使用方面的专业技能
                </p>
            </div>

            <!-- 技能分类 -->
            <div class="space-y-12">
                <!-- 前端技术 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2
                        class="text-2xl font-bold text-white mb-6 flex items-center">
                        <div
                            class="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                            <svg
                                class="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        前端技术
                    </h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                            <div class="flex items-center mb-3">
                                <div
                                    class="w-8 h-8 bg-green-500 rounded mr-3"></div>
                                <div>
                                    <h4 class="text-white font-semibold">
                                        Vue.js
                                    </h4>
                                    <span class="text-green-400 text-sm"
                                        >专家</span
                                    >
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-300">进度</span>
                                    <span class="text-white">95%</span>
                                </div>
                                <div
                                    class="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        class="bg-green-500 h-2 rounded-full"
                                        style="width: 95%"></div>
                                </div>
                            </div>
                            <p class="text-gray-300 text-sm">
                                Vue 3 Composition API, Pinia 状态管理
                            </p>
                        </div>
                        <div
                            class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                            <div class="flex items-center mb-3">
                                <div
                                    class="w-8 h-8 bg-blue-500 rounded mr-3"></div>
                                <div>
                                    <h4 class="text-white font-semibold">
                                        TypeScript
                                    </h4>
                                    <span class="text-blue-400 text-sm"
                                        >高级</span
                                    >
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-300">进度</span>
                                    <span class="text-white">90%</span>
                                </div>
                                <div
                                    class="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        class="bg-blue-500 h-2 rounded-full"
                                        style="width: 90%"></div>
                                </div>
                            </div>
                            <p class="text-gray-300 text-sm">
                                类型系统设计，泛型编程
                            </p>
                        </div>
                        <div
                            class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                            <div class="flex items-center mb-3">
                                <div
                                    class="w-8 h-8 bg-yellow-500 rounded mr-3"></div>
                                <div>
                                    <h4 class="text-white font-semibold">
                                        JavaScript
                                    </h4>
                                    <span class="text-yellow-400 text-sm"
                                        >专家</span
                                    >
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-300">进度</span>
                                    <span class="text-white">95%</span>
                                </div>
                                <div
                                    class="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        class="bg-yellow-500 h-2 rounded-full"
                                        style="width: 95%"></div>
                                </div>
                            </div>
                            <p class="text-gray-300 text-sm">
                                ES6+, 异步编程，模块化开发
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 动画与图形 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2
                        class="text-2xl font-bold text-white mb-6 flex items-center">
                        <div
                            class="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                            <svg
                                class="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        动画与图形
                    </h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <h4 class="text-white font-semibold mb-2">GSAP</h4>
                            <div
                                class="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    class="bg-green-500 h-2 rounded-full"
                                    style="width: 88%"></div>
                            </div>
                            <span class="text-green-400 text-sm">高级 88%</span>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <h4 class="text-white font-semibold mb-2">
                                Canvas
                            </h4>
                            <div
                                class="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    class="bg-blue-500 h-2 rounded-full"
                                    style="width: 75%"></div>
                            </div>
                            <span class="text-blue-400 text-sm">中级 75%</span>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <h4 class="text-white font-semibold mb-2">SVG</h4>
                            <div
                                class="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    class="bg-purple-500 h-2 rounded-full"
                                    style="width: 85%"></div>
                            </div>
                            <span class="text-purple-400 text-sm"
                                >高级 85%</span
                            >
                        </div>
                    </div>
                </div>

                <!-- 后端技术 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                    <h2
                        class="text-2xl font-bold text-white mb-6 flex items-center">
                        <div
                            class="w-8 h-8 bg-orange-500 rounded-full mr-3 flex items-center justify-center">
                            <svg
                                class="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        后端技术
                    </h2>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <h4 class="text-white font-semibold mb-2">
                                Node.js
                            </h4>
                            <div
                                class="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    class="bg-green-500 h-2 rounded-full"
                                    style="width: 85%"></div>
                            </div>
                            <span class="text-green-400 text-sm">高级 85%</span>
                        </div>
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <h4 class="text-white font-semibold mb-2">
                                Python
                            </h4>
                            <div
                                class="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    class="bg-yellow-500 h-2 rounded-full"
                                    style="width: 70%"></div>
                            </div>
                            <span class="text-yellow-400 text-sm"
                                >中级 70%</span
                            >
                        </div>
                        <div class="bg-white/5 rounded-lg p-4 text-center">
                            <h4 class="text-white font-semibold mb-2">MySQL</h4>
                            <div
                                class="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div
                                    class="bg-blue-500 h-2 rounded-full"
                                    style="width: 75%"></div>
                            </div>
                            <span class="text-blue-400 text-sm">中级 75%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center mt-12">
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
import { onMounted } from "vue";
import { useAppStore } from "@/stores";

// 使用应用状态
const appStore = useAppStore();

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("skills");

    // 设置页面标题
    document.title = "技能展示 - 交互式简历网站";
});
</script>

<style scoped>
.container {
    max-width: 1200px;
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

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-3 {
        grid-template-columns: 1fr;
    }
}
</style>
