<template>
    <div
        class="skills-page min-h-screen bg-linear-to-br from-gray-900 to-black text-white">
        <div class="container mx-auto px-4 py-12">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <h1
                    class="text-5xl font-bold mb-6 bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    技能展示
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示我在游戏后端开发领域的技术技能和专业能力
                </p>
            </div>

            <!-- 技能分类 -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <!-- 编程语言 -->
                <div
                    class="skill-category p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-4">💻</div>
                        <h3 class="text-2xl font-bold text-blue-400">
                            编程语言
                        </h3>
                    </div>
                    <div class="space-y-4">
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">Java</span>
                                <span class="text-sm text-gray-400">4年</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full"
                                    style="width: 90%"></div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">Python</span>
                                <span class="text-sm text-gray-400">3年</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-green-500 to-green-600 h-full rounded-full"
                                    style="width: 80%"></div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">Go</span>
                                <span class="text-sm text-gray-400">2年</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-cyan-500 to-cyan-600 h-full rounded-full"
                                    style="width: 75%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 框架和工具 -->
                <div
                    class="skill-category p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-4">🛠️</div>
                        <h3 class="text-2xl font-bold text-purple-400">
                            框架工具
                        </h3>
                    </div>
                    <div class="space-y-4">
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">Spring Boot</span>
                                <span class="text-sm text-gray-400">专家</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-purple-500 to-purple-600 h-full rounded-full"
                                    style="width: 95%"></div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">Redis</span>
                                <span class="text-sm text-gray-400">熟练</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-red-500 to-red-600 h-full rounded-full"
                                    style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">Docker</span>
                                <span class="text-sm text-gray-400">熟练</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-blue-400 to-blue-500 h-full rounded-full"
                                    style="width: 80%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 数据库 -->
                <div
                    class="skill-category p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300">
                    <div class="text-center mb-6">
                        <div class="text-4xl mb-4">🗄️</div>
                        <h3 class="text-2xl font-bold text-green-400">
                            数据库
                        </h3>
                    </div>
                    <div class="space-y-4">
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">MySQL</span>
                                <span class="text-sm text-gray-400">专家</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-orange-500 to-orange-600 h-full rounded-full"
                                    style="width: 90%"></div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">MongoDB</span>
                                <span class="text-sm text-gray-400">熟练</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-green-500 to-green-600 h-full rounded-full"
                                    style="width: 75%"></div>
                            </div>
                        </div>
                        <div class="skill-item">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold">PostgreSQL</span>
                                <span class="text-sm text-gray-400">了解</span>
                            </div>
                            <div class="skill-bar bg-gray-700 rounded-full h-3">
                                <div
                                    class="skill-progress bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full"
                                    style="width: 60%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 技能雷达图占位 -->
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-8">技能雷达图</h2>
                <div
                    class="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
                    <div
                        class="w-80 h-80 mx-auto bg-gray-700/30 rounded-full flex items-center justify-center">
                        <div class="text-gray-400 text-center">
                            <div class="text-4xl mb-4">📊</div>
                            <div>技能雷达图</div>
                            <div class="text-sm mt-2">Canvas 渲染实现中...</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 返回导航 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
                    <span class="mr-2">←</span>
                    返回首页
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
    console.log("技能页面已加载");
});
</script>

<style scoped>
.skills-page {
    animation: fadeInUp 0.6s ease-out;
}

.skill-category {
    transform: translateY(20px);
    opacity: 0;
    animation: slideInUp 0.6s ease-out forwards;
}

.skill-category:nth-child(1) {
    animation-delay: 0.1s;
}

.skill-category:nth-child(2) {
    animation-delay: 0.2s;
}

.skill-category:nth-child(3) {
    animation-delay: 0.3s;
}

.skill-progress {
    animation: progressFill 1s ease-out 0.5s both;
    width: 0 !important;
}

.skill-category:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes progressFill {
    from {
        width: 0;
    }
    to {
        width: var(--progress-width, 0);
    }
}

/* 为每个进度条设置自定义属性 */
.skill-category:nth-child(1) .skill-item:nth-child(1) .skill-progress {
    --progress-width: 90%;
}

.skill-category:nth-child(1) .skill-item:nth-child(2) .skill-progress {
    --progress-width: 80%;
}

.skill-category:nth-child(1) .skill-item:nth-child(3) .skill-progress {
    --progress-width: 75%;
}

.skill-category:nth-child(2) .skill-item:nth-child(1) .skill-progress {
    --progress-width: 95%;
}

.skill-category:nth-child(2) .skill-item:nth-child(2) .skill-progress {
    --progress-width: 85%;
}

.skill-category:nth-child(2) .skill-item:nth-child(3) .skill-progress {
    --progress-width: 80%;
}

.skill-category:nth-child(3) .skill-item:nth-child(1) .skill-progress {
    --progress-width: 90%;
}

.skill-category:nth-child(3) .skill-item:nth-child(2) .skill-progress {
    --progress-width: 75%;
}

.skill-category:nth-child(3) .skill-item:nth-child(3) .skill-progress {
    --progress-width: 60%;
}
</style>
