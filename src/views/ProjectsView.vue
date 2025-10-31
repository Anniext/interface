<template>
    <div
        class="projects-view min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        项目作品
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示我参与开发的项目和个人作品，涵盖游戏开发、Web应用等领域
                </p>
            </div>

            <!-- 项目列表 -->
            <div class="space-y-12">
                <!-- 大型多人在线游戏 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="lg:w-1/3">
                            <div
                                class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-center">
                                <svg
                                    class="w-16 h-16 text-white mx-auto mb-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 class="text-xl font-bold text-white">
                                    大型MMORPG
                                </h3>
                            </div>
                        </div>
                        <div class="lg:w-2/3">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-2xl font-bold text-white">
                                    大型多人在线角色扮演游戏
                                </h3>
                                <span
                                    class="px-3 py-1 bg-green-500 text-white text-sm rounded-full"
                                    >已上线</span
                                >
                            </div>
                            <p class="text-gray-300 mb-4">
                                负责游戏服务器架构设计与实现，支持万人同时在线的大型MMORPG项目。
                                实现了完整的游戏系统包括战斗、交易、公会、副本等核心功能。
                            </p>
                            <div class="mb-4">
                                <h4
                                    class="text-lg font-semibold text-white mb-2">
                                    核心功能
                                </h4>
                                <ul class="text-gray-300 space-y-1">
                                    <li>• 高并发实时战斗系统</li>
                                    <li>• 分布式服务器架构</li>
                                    <li>• 游戏内经济系统</li>
                                    <li>• 公会管理系统</li>
                                </ul>
                            </div>
                            <div class="flex flex-wrap gap-2 mb-4">
                                <span
                                    class="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded"
                                    >Node.js</span
                                >
                                <span
                                    class="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded"
                                    >Redis</span
                                >
                                <span
                                    class="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded"
                                    >MySQL</span
                                >
                                <span
                                    class="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded"
                                    >WebSocket</span
                                >
                                <span
                                    class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded"
                                    >Docker</span
                                >
                            </div>
                            <div class="text-sm text-gray-400">
                                项目时间: 2021年 - 2023年 | 团队规模: 15人
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 手机游戏项目 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="lg:w-1/3">
                            <div
                                class="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-center">
                                <svg
                                    class="w-16 h-16 text-white mx-auto mb-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                                <h3 class="text-xl font-bold text-white">
                                    手机游戏
                                </h3>
                            </div>
                        </div>
                        <div class="lg:w-2/3">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-2xl font-bold text-white">
                                    策略类手机游戏
                                </h3>
                                <span
                                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                                    >运营中</span
                                >
                            </div>
                            <p class="text-gray-300 mb-4">
                                开发策略类手机游戏的服务端系统，包括用户管理、游戏逻辑、数据统计等模块。
                                优化了数据库查询性能，提升了系统整体响应速度。
                            </p>
                            <div class="mb-4">
                                <h4
                                    class="text-lg font-semibold text-white mb-2">
                                    技术亮点
                                </h4>
                                <ul class="text-gray-300 space-y-1">
                                    <li>• RESTful API 设计</li>
                                    <li>• 数据库查询优化</li>
                                    <li>• 实时数据统计</li>
                                    <li>• 自动化部署流程</li>
                                </ul>
                            </div>
                            <div class="flex flex-wrap gap-2 mb-4">
                                <span
                                    class="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded"
                                    >Python</span
                                >
                                <span
                                    class="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded"
                                    >Django</span
                                >
                                <span
                                    class="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded"
                                    >PostgreSQL</span
                                >
                                <span
                                    class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded"
                                    >AWS</span
                                >
                            </div>
                            <div class="text-sm text-gray-400">
                                项目时间: 2019年 - 2021年 | 团队规模: 8人
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 个人项目 - 交互式简历网站 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="lg:w-1/3">
                            <div
                                class="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-center">
                                <svg
                                    class="w-16 h-16 text-white mx-auto mb-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V5zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"
                                        clip-rule="evenodd" />
                                </svg>
                                <h3 class="text-xl font-bold text-white">
                                    个人作品
                                </h3>
                            </div>
                        </div>
                        <div class="lg:w-2/3">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-2xl font-bold text-white">
                                    交互式简历网站
                                </h3>
                                <span
                                    class="px-3 py-1 bg-purple-500 text-white text-sm rounded-full"
                                    >当前项目</span
                                >
                            </div>
                            <p class="text-gray-300 mb-4">
                                使用现代前端技术栈开发的交互式简历网站，展示个人技能和项目经验。
                                集成了多种动画效果、Canvas图形、物理引擎等技术，提供丰富的用户体验。
                            </p>
                            <div class="mb-4">
                                <h4
                                    class="text-lg font-semibold text-white mb-2">
                                    技术特色
                                </h4>
                                <ul class="text-gray-300 space-y-1">
                                    <li>• Vue 3 + TypeScript 开发</li>
                                    <li>• GSAP 动画系统</li>
                                    <li>• Canvas 图形渲染</li>
                                    <li>• Matter.js 物理引擎</li>
                                </ul>
                            </div>
                            <div class="flex flex-wrap gap-2 mb-4">
                                <span
                                    class="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded"
                                    >Vue 3</span
                                >
                                <span
                                    class="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded"
                                    >TypeScript</span
                                >
                                <span
                                    class="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded"
                                    >Tailwind CSS</span
                                >
                                <span
                                    class="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded"
                                    >GSAP</span
                                >
                                <span
                                    class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded"
                                    >Vite</span
                                >
                            </div>
                            <div class="text-sm text-gray-400">
                                项目时间: 2024年 | 个人项目
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Web应用项目 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="lg:w-1/3">
                            <div
                                class="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-center">
                                <svg
                                    class="w-16 h-16 text-white mx-auto mb-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        fill-rule="evenodd"
                                        d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                                        clip-rule="evenodd" />
                                </svg>
                                <h3 class="text-xl font-bold text-white">
                                    Web应用
                                </h3>
                            </div>
                        </div>
                        <div class="lg:w-2/3">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-2xl font-bold text-white">
                                    企业管理系统
                                </h3>
                                <span
                                    class="px-3 py-1 bg-gray-500 text-white text-sm rounded-full"
                                    >已完成</span
                                >
                            </div>
                            <p class="text-gray-300 mb-4">
                                为中小企业开发的综合管理系统，包括用户管理、权限控制、数据统计等功能。
                                采用前后端分离架构，提供了良好的用户体验和系统性能。
                            </p>
                            <div class="mb-4">
                                <h4
                                    class="text-lg font-semibold text-white mb-2">
                                    主要功能
                                </h4>
                                <ul class="text-gray-300 space-y-1">
                                    <li>• 用户权限管理</li>
                                    <li>• 数据可视化</li>
                                    <li>• 文件上传下载</li>
                                    <li>• 系统日志记录</li>
                                </ul>
                            </div>
                            <div class="flex flex-wrap gap-2 mb-4">
                                <span
                                    class="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded"
                                    >Node.js</span
                                >
                                <span
                                    class="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded"
                                    >Express</span
                                >
                                <span
                                    class="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded"
                                    >MongoDB</span
                                >
                                <span
                                    class="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded"
                                    >React</span
                                >
                            </div>
                            <div class="text-sm text-gray-400">
                                项目时间: 2018年 - 2019年 | 团队规模: 5人
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 项目统计 -->
            <div
                class="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    项目统计
                </h2>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-cyan-400 mb-2">
                            10+
                        </div>
                        <div class="text-gray-300">参与项目</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-400 mb-2">
                            4
                        </div>
                        <div class="text-gray-300">年工作经验</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-400 mb-2">
                            50+
                        </div>
                        <div class="text-gray-300">技术栈掌握</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-orange-400 mb-2">
                            100%
                        </div>
                        <div class="text-gray-300">项目完成率</div>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center mt-12">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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
    appStore.setCurrentSection("projects");

    // 设置页面标题
    document.title = "项目作品 - 交互式简历网站";
});
</script>

<style scoped>
.container {
    max-width: 1200px;
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .lg\:flex-row {
        flex-direction: column;
    }

    .lg\:w-1\/3,
    .lg\:w-2\/3 {
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

    .md\:grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
