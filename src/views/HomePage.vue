<template>
    <div
        class="home-page min-h-screen bg-linear-to-br from-gray-900 to-black text-white">
        <div class="container mx-auto px-4 py-8">
            <div class="text-center mb-12">
                <h1
                    class="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    交互式游戏风格简历网站
                </h1>
                <p class="text-xl text-gray-300 mb-8">
                    基于 Vue 3 + Canvas + Matter.js + GSAP 的现代化简历展示
                </p>

                <div class="flex flex-wrap justify-center gap-4 mb-8">
                    <router-link
                        to="/canvas-test"
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-semibold">
                        Canvas 渲染引擎测试
                    </router-link>
                    <router-link
                        to="/particle-test"
                        class="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-semibold">
                        粒子系统测试
                    </router-link>
                    <router-link
                        to="/shape-test"
                        class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold">
                        几何图形测试
                    </router-link>
                </div>

                <!-- 新增动画演示链接 -->
                <div class="flex flex-wrap justify-center gap-4 mb-6">
                    <router-link
                        to="/element-animation-demo"
                        class="px-8 py-4 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                        🎭 元素动画效果演示
                    </router-link>
                    <router-link
                        to="/skills"
                        class="px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                        💼 技能展示页面
                    </router-link>
                </div>

                <!-- 高级动画演示链接 -->
                <div class="flex flex-wrap justify-center gap-4">
                    <router-link
                        to="/scroll-trigger-demo"
                        class="px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                        📜 ScrollTrigger 滚动动画
                    </router-link>
                    <router-link
                        to="/animation-performance-demo"
                        class="px-6 py-3 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                        📊 动画性能监控
                    </router-link>
                </div>
            </div>

            <!-- 技术栈展示 -->
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div
                    class="tech-card p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div class="text-2xl mb-3">🎨</div>
                    <h3 class="text-lg font-semibold mb-2">Canvas 2D 渲染</h3>
                    <p class="text-gray-400 text-sm">
                        高性能的 Canvas 2D 图形渲染引擎，支持粒子系统和几何图形
                    </p>
                </div>

                <div
                    class="tech-card p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div class="text-2xl mb-3">⚡</div>
                    <h3 class="text-lg font-semibold mb-2">
                        Matter.js 物理引擎
                    </h3>
                    <p class="text-gray-400 text-sm">
                        2D 物理模拟，实现重力、碰撞检测和物理交互效果
                    </p>
                </div>

                <div
                    class="tech-card p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div class="text-2xl mb-3">✨</div>
                    <h3 class="text-lg font-semibold mb-2">GSAP 动画</h3>
                    <p class="text-gray-400 text-sm">
                        专业级动画库，提供流畅的页面过渡和元素动画效果
                    </p>
                </div>

                <div
                    class="tech-card p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div class="text-2xl mb-3">🎭</div>
                    <h3 class="text-lg font-semibold mb-2">Lottie 动画</h3>
                    <p class="text-gray-400 text-sm">
                        矢量动画播放器，支持复杂的图标和插画动画效果
                    </p>
                </div>
            </div>

            <!-- 功能特性 -->
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-8">核心特性</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="feature-item">
                        <div
                            class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl">🚀</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">高性能渲染</h3>
                        <p class="text-gray-400">
                            优化的 Canvas 渲染引擎，支持高分辨率显示和流畅的
                            60fps 动画
                        </p>
                    </div>

                    <div class="feature-item">
                        <div
                            class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl">📱</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">响应式设计</h3>
                        <p class="text-gray-400">
                            完美适配桌面、平板和移动设备，提供一致的用户体验
                        </p>
                    </div>

                    <div class="feature-item">
                        <div
                            class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl">♿</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">无障碍访问</h3>
                        <p class="text-gray-400">
                            支持键盘导航、屏幕阅读器和动画禁用选项
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
    console.log("交互式简历网站首页已加载");
});
</script>

<style scoped>
.tech-card {
    transition: all 0.3s ease;
}

.tech-card:hover {
    transform: translateY(-4px);
    border-color: #3b82f6;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.feature-item {
    transition: transform 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-2px);
}
</style>
