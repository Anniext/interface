<template>
    <div
        class="achievements-view min-h-screen bg-linear-to-br from-slate-900 via-yellow-900 to-slate-900">
        <div class="container mx-auto px-4 py-16">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                    <span
                        class="bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        成就展示
                    </span>
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示我在职业生涯中获得的成就和认证
                </p>
            </div>

            <!-- 成就列表 -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <!-- 技术认证 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            技术专家认证
                        </h3>
                        <p class="text-gray-300 text-sm mb-4">
                            获得多项技术认证，包括云计算、数据库管理等领域
                        </p>
                        <div class="flex flex-wrap gap-2 justify-center">
                            <span
                                class="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded"
                                >AWS</span
                            >
                            <span
                                class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded"
                                >MongoDB</span
                            >
                            <span
                                class="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded"
                                >Docker</span
                            >
                        </div>
                    </div>
                </div>

                <!-- 项目成就 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            项目优秀奖
                        </h3>
                        <p class="text-gray-300 text-sm mb-4">
                            多个项目获得公司优秀项目奖，用户满意度超过95%
                        </p>
                        <div class="text-2xl font-bold text-green-400">
                            95%+
                        </div>
                        <div class="text-sm text-gray-400">用户满意度</div>
                    </div>
                </div>

                <!-- 团队贡献 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            团队协作奖
                        </h3>
                        <p class="text-gray-300 text-sm mb-4">
                            在团队协作中表现突出，多次获得最佳团队成员奖
                        </p>
                        <div class="text-2xl font-bold text-purple-400">
                            3次
                        </div>
                        <div class="text-sm text-gray-400">最佳团队成员</div>
                    </div>
                </div>

                <!-- 技术创新 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
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
                        <h3 class="text-xl font-bold text-white mb-2">
                            技术创新奖
                        </h3>
                        <p class="text-gray-300 text-sm mb-4">
                            提出创新技术方案，显著提升系统性能和用户体验
                        </p>
                        <div class="text-2xl font-bold text-orange-400">
                            50%+
                        </div>
                        <div class="text-sm text-gray-400">性能提升</div>
                    </div>
                </div>

                <!-- 学习成长 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            持续学习奖
                        </h3>
                        <p class="text-gray-300 text-sm mb-4">
                            积极学习新技术，参与技术分享，推动团队技术进步
                        </p>
                        <div class="text-2xl font-bold text-cyan-400">20+</div>
                        <div class="text-sm text-gray-400">技术分享</div>
                    </div>
                </div>

                <!-- 客户认可 -->
                <div
                    class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div class="text-center">
                        <div
                            class="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg
                                class="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">
                            客户满意奖
                        </h3>
                        <p class="text-gray-300 text-sm mb-4">
                            获得客户高度认可，多次收到客户表扬信
                        </p>
                        <div class="text-2xl font-bold text-pink-400">5星</div>
                        <div class="text-sm text-gray-400">客户评价</div>
                    </div>
                </div>
            </div>

            <!-- 成就统计 -->
            <div
                class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
                <h2 class="text-2xl font-bold text-white mb-6 text-center">
                    成就统计
                </h2>
                <div class="grid md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-400 mb-2">
                            15+
                        </div>
                        <div class="text-gray-300">获得奖项</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-400 mb-2">
                            8
                        </div>
                        <div class="text-gray-300">技术认证</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-blue-400 mb-2">
                            100%
                        </div>
                        <div class="text-gray-300">项目成功率</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-purple-400 mb-2">
                            4年
                        </div>
                        <div class="text-gray-300">专业经验</div>
                    </div>
                </div>
            </div>

            <!-- 返回按钮 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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
    appStore.setCurrentSection("achievements");

    // 设置页面标题
    document.title = "成就展示 - 交互式简历网站";
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

    .md\:grid-cols-4 {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
