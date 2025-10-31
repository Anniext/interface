<template>
    <div
        class="experience-view min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        工作经验
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    4年游戏后端开发经验，专注于高性能服务器架构和实时通信系统
                </p>
            </div>

            <!-- 时间轴 -->
            <div class="relative">
                <!-- 时间轴线 -->
                <div
                    class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 bg-gradient-to-b from-green-400 to-blue-400 h-full"></div>

                <!-- 经验项目 -->
                <div class="space-y-12">
                    <!-- 当前工作 -->
                    <div class="relative flex items-center">
                        <!-- 时间轴点 -->
                        <div
                            class="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                        <!-- 内容卡片 -->
                        <div class="ml-16 md:ml-0 md:w-5/12 md:mr-auto">
                            <div
                                class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div
                                    class="flex items-center justify-between mb-4">
                                    <span
                                        class="px-3 py-1 bg-green-500 text-white text-sm rounded-full"
                                        >当前</span
                                    >
                                    <span class="text-gray-300 text-sm"
                                        >2021 - 至今</span
                                    >
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2">
                                    高级游戏后端开发工程师
                                </h3>
                                <p class="text-green-400 mb-3">
                                    某知名游戏公司
                                </p>
                                <ul class="text-gray-300 text-sm space-y-2">
                                    <li>
                                        •
                                        负责大型多人在线游戏服务器架构设计与优化
                                    </li>
                                    <li>
                                        •
                                        实现高并发实时通信系统，支持万人同时在线
                                    </li>
                                    <li>
                                        •
                                        优化数据库查询性能，提升系统响应速度50%
                                    </li>
                                    <li>
                                        • 设计并实现游戏内经济系统和交易系统
                                    </li>
                                </ul>
                                <div class="flex flex-wrap gap-2 mt-4">
                                    <span
                                        class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                                        >Node.js</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                                        >Redis</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                                        >MySQL</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded"
                                        >Docker</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 前一份工作 -->
                    <div class="relative flex items-center">
                        <div
                            class="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                        <div class="ml-16 md:ml-0 md:w-5/12 md:ml-auto">
                            <div
                                class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div
                                    class="flex items-center justify-between mb-4">
                                    <span
                                        class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                                        >全职</span
                                    >
                                    <span class="text-gray-300 text-sm"
                                        >2019 - 2021</span
                                    >
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2">
                                    游戏后端开发工程师
                                </h3>
                                <p class="text-blue-400 mb-3">
                                    中型游戏开发公司
                                </p>
                                <ul class="text-gray-300 text-sm space-y-2">
                                    <li>• 开发手机游戏服务端逻辑和API接口</li>
                                    <li>• 实现游戏数据统计和分析系统</li>
                                    <li>• 参与游戏架构设计和技术选型</li>
                                    <li>• 负责服务器部署和运维工作</li>
                                </ul>
                                <div class="flex flex-wrap gap-2 mt-4">
                                    <span
                                        class="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded"
                                        >Python</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded"
                                        >Django</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                                        >PostgreSQL</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                                        >AWS</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 初级工作 -->
                    <div class="relative flex items-center">
                        <div
                            class="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                        <div class="ml-16 md:ml-0 md:w-5/12 md:mr-auto">
                            <div
                                class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div
                                    class="flex items-center justify-between mb-4">
                                    <span
                                        class="px-3 py-1 bg-purple-500 text-white text-sm rounded-full"
                                        >初级</span
                                    >
                                    <span class="text-gray-300 text-sm"
                                        >2018 - 2019</span
                                    >
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2">
                                    初级后端开发工程师
                                </h3>
                                <p class="text-purple-400 mb-3">
                                    互联网创业公司
                                </p>
                                <ul class="text-gray-300 text-sm space-y-2">
                                    <li>• 参与Web应用后端开发</li>
                                    <li>• 学习和实践RESTful API设计</li>
                                    <li>• 协助数据库设计和优化</li>
                                    <li>• 参与代码审查和技术分享</li>
                                </ul>
                                <div class="flex flex-wrap gap-2 mt-4">
                                    <span
                                        class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                                        >Node.js</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                                        >Express</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded"
                                        >MongoDB</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded"
                                        >Git</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 实习经历 -->
                    <div class="relative flex items-center">
                        <div
                            class="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-gray-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                        <div class="ml-16 md:ml-0 md:w-5/12 md:ml-auto">
                            <div
                                class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div
                                    class="flex items-center justify-between mb-4">
                                    <span
                                        class="px-3 py-1 bg-gray-500 text-white text-sm rounded-full"
                                        >实习</span
                                    >
                                    <span class="text-gray-300 text-sm"
                                        >2017 - 2018</span
                                    >
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2">
                                    后端开发实习生
                                </h3>
                                <p class="text-gray-400 mb-3">软件开发公司</p>
                                <ul class="text-gray-300 text-sm space-y-2">
                                    <li>• 学习后端开发基础知识</li>
                                    <li>• 参与小型项目开发</li>
                                    <li>• 掌握版本控制和团队协作</li>
                                    <li>• 建立编程规范和最佳实践</li>
                                </ul>
                                <div class="flex flex-wrap gap-2 mt-4">
                                    <span
                                        class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                                        >Java</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                                        >Spring</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded"
                                        >MySQL</span
                                    >
                                    <span
                                        class="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
                                        >Linux</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 核心技能总结 -->
            <div
                class="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    核心技能总结
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-white mb-2">
                            服务器架构
                        </h3>
                        <p class="text-gray-300 text-sm">
                            高并发、高可用系统设计
                        </p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-white mb-2">
                            API 开发
                        </h3>
                        <p class="text-gray-300 text-sm">
                            RESTful API 设计与实现
                        </p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                <path
                                    d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                <path
                                    d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-white mb-2">
                            数据库优化
                        </h3>
                        <p class="text-gray-300 text-sm">查询优化与性能调优</p>
                    </div>

                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-white mb-2">
                            性能优化
                        </h3>
                        <p class="text-gray-300 text-sm">系统性能监控与优化</p>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center mt-12">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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
    appStore.setCurrentSection("experience");

    // 设置页面标题
    document.title = "工作经验 - 交互式简历网站";
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

    .md\:left-1\/2 {
        left: 1rem;
    }

    .md\:w-5\/12 {
        width: 100%;
        margin-left: 0;
        margin-right: 0;
    }

    .grid {
        grid-template-columns: 1fr;
    }

    .md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .lg\:grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
