<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/stores";

// 使用应用状态管理
const appStore = useAppStore();

// 初始化应用
onMounted(() => {
    appStore.initializeApp();
});
</script>

<template>
    <div class="min-h-screen bg-bg-primary text-text-primary">
        <!-- 头部 -->
        <header class="p-6 border-b border-primary-500/20">
            <div class="container mx-auto">
                <h1 class="title-game text-4xl">交互式游戏风格简历网站</h1>
                <p class="text-text-secondary mt-2">
                    项目基础设置完成 - 徐思宏
                </p>
            </div>
        </header>

        <!-- 主要内容 -->
        <main class="container mx-auto p-6">
            <!-- 状态信息卡片 -->
            <div class="card-game p-6 mb-6">
                <h2
                    class="text-2xl font-bold mb-4 text-primary-400"
                    style="
                        font-family: 'Orbitron', 'Inter', system-ui, sans-serif;
                    ">
                    项目状态
                </h2>
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-bg-tertiary/50 p-4 rounded-lg">
                        <h3 class="font-semibold text-accent-400 mb-2">
                            当前主题
                        </h3>
                        <p class="text-text-secondary">{{ appStore.theme }}</p>
                        <button
                            @click="appStore.toggleTheme()"
                            class="btn-game mt-2 text-sm px-4 py-2">
                            切换主题
                        </button>
                    </div>

                    <div class="bg-bg-tertiary/50 p-4 rounded-lg">
                        <h3 class="font-semibold text-accent-400 mb-2">
                            设备类型
                        </h3>
                        <p class="text-text-secondary">
                            {{ appStore.deviceType }}
                        </p>
                    </div>

                    <div class="bg-bg-tertiary/50 p-4 rounded-lg">
                        <h3 class="font-semibold text-accent-400 mb-2">
                            动画状态
                        </h3>
                        <p class="text-text-secondary">
                            {{ appStore.animationsEnabled ? "启用" : "禁用" }}
                        </p>
                        <button
                            @click="appStore.toggleAnimations()"
                            class="btn-game mt-2 text-sm px-4 py-2">
                            切换动画
                        </button>
                    </div>
                </div>
            </div>

            <!-- 技术栈展示 -->
            <div class="card-game p-6 mb-6">
                <h2
                    class="text-2xl font-bold mb-4 text-primary-400"
                    style="
                        font-family: 'Orbitron', 'Inter', system-ui, sans-serif;
                    ">
                    技术栈
                </h2>
                <div class="flex flex-wrap gap-2">
                    <span class="skill-tag">Vue 3</span>
                    <span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">Vite</span>
                    <span class="skill-tag">Tailwind CSS V4</span>
                    <span class="skill-tag">Pinia</span>
                    <span class="skill-tag">Matter.js</span>
                    <span class="skill-tag">GSAP</span>
                    <span class="skill-tag">Lottie</span>
                    <span class="skill-tag">Canvas 2D</span>
                </div>
            </div>

            <!-- 项目结构展示 -->
            <div class="card-game p-6">
                <h2
                    class="text-2xl font-bold mb-4 text-primary-400"
                    style="
                        font-family: 'Orbitron', 'Inter', system-ui, sans-serif;
                    ">
                    项目结构
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="font-semibold text-accent-400 mb-2">
                            核心目录
                        </h3>
                        <ul
                            class="text-text-secondary space-y-1 text-sm font-mono">
                            <li>📁 src/components/ - 组件</li>
                            <li>📁 src/views/ - 页面</li>
                            <li>📁 src/stores/ - 状态管理</li>
                            <li>📁 src/types/ - 类型定义</li>
                            <li>📁 src/utils/ - 工具函数</li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="font-semibold text-accent-400 mb-2">
                            资源目录
                        </h3>
                        <ul
                            class="text-text-secondary space-y-1 text-sm font-mono">
                            <li>📁 src/assets/styles/ - 样式</li>
                            <li>📁 src/assets/images/ - 图片</li>
                            <li>📁 src/assets/icons/ - 图标</li>
                            <li>📁 src/assets/animations/ - 动画</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>

        <!-- 底部 -->
        <footer class="p-6 border-t border-primary-500/20 mt-12">
            <div class="container mx-auto text-center text-text-muted">
                <p>项目基础设置和依赖安装已完成 ✅</p>
            </div>
        </footer>
    </div>
</template>

<style scoped>
/* 组件特定样式 */
.container {
    max-width: 1200px;
}
</style>
