<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, provide } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/stores";
import { usePageTransition } from "@/composables/usePageTransition";
import PageTransition from "@/components/animation/PageTransition.vue";
import LoadingIndicator from "@/components/animation/LoadingIndicator.vue";
import AnimationController from "@/components/animation/AnimationController.vue";

// 使用应用状态管理
const appStore = useAppStore();
const route = useRoute();

// 页面过渡系统
const pageTransition = usePageTransition({
    type: "geometric",
    duration: 1.2,
    showProgress: true,
    enableGeometricShapes: true,
});

// 响应式数据
const isLoading = ref(false);
const loadingProgress = ref(0);
const showPageTransition = ref(false);

// 页面过渡事件处理
function handleTransitionStart(event: CustomEvent) {
    const { from, to } = event.detail;
    showPageTransition.value = true;

    // 执行页面过渡动画
    pageTransition.executeTransition(from, to);
}

function handleTransitionComplete() {
    showPageTransition.value = false;
}

// 初始化应用
onMounted(() => {
    appStore.initializeApp();

    // 监听页面过渡事件
    window.addEventListener(
        "page-transition-start",
        handleTransitionStart as EventListener,
    );
    window.addEventListener(
        "page-transition-complete",
        handleTransitionComplete,
    );

    // 首次加载动画
    isLoading.value = true;
    loadingProgress.value = 0;

    // 模拟加载进度
    const loadingInterval = setInterval(() => {
        loadingProgress.value += Math.random() * 20;
        if (loadingProgress.value >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                isLoading.value = false;
            }, 500);
        }
    }, 200);
});

onBeforeUnmount(() => {
    // 清理事件监听器
    window.removeEventListener(
        "page-transition-start",
        handleTransitionStart as EventListener,
    );
    window.removeEventListener(
        "page-transition-complete",
        handleTransitionComplete,
    );
});

// 提供页面过渡状态给子组件
provide("pageTransition", pageTransition);
</script>

<template>
    <div class="app-container min-h-screen bg-bg-primary text-text-primary">
        <!-- 动画控制器 -->
        <AnimationController :debug-mode="false">
            <!-- 首次加载指示器 -->
            <LoadingIndicator
                :is-visible="isLoading"
                type="geometric"
                :progress="loadingProgress"
                :messages="[
                    '正在初始化应用...',
                    '加载动画系统...',
                    '准备用户界面...',
                    '即将为您呈现...',
                ]"
                variant="gaming"
                :show-percentage="true"
                :animated="true" />

            <!-- 页面过渡组件 -->
            <PageTransition
                v-if="showPageTransition"
                :transition-type="route.meta?.transition || 'geometric'"
                :duration="1.2"
                :show-progress="true"
                :enable-geometric-shapes="true">
                <!-- 过渡期间的内容 -->
                <div class="transition-placeholder">
                    <div class="text-center text-white">
                        <div class="text-xl font-semibold mb-2">
                            正在切换到 {{ route.meta?.title }}
                        </div>
                        <div class="text-sm opacity-70">请稍候...</div>
                    </div>
                </div>
            </PageTransition>

            <!-- 主要内容区域 -->
            <div
                class="main-content"
                :class="{ transitioning: showPageTransition }">
                <!-- 导航栏 -->
                <nav
                    class="app-nav p-4 border-b border-primary-500/20 backdrop-blur-sm bg-bg-primary/80 sticky top-0 z-40">
                    <div
                        class="container mx-auto flex items-center justify-between">
                        <router-link
                            to="/"
                            class="brand-logo text-2xl text-primary-400 hover:text-primary-300 transition-all duration-300 hover:scale-105">
                            <span
                                class="font-bold bg-linear-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                                交互式简历网站
                            </span>
                        </router-link>

                        <!-- 主导航 -->
                        <div class="nav-links flex items-center gap-2">
                            <!-- 业务页面导航 -->
                            <div
                                class="business-nav flex items-center gap-1 mr-4">
                                <router-link
                                    to="/"
                                    class="nav-link px-3 py-2 rounded-lg hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300 shadow-lg">
                                    🏠 首页
                                </router-link>
                                <router-link
                                    to="/skills"
                                    class="nav-link px-3 py-2 rounded-lg hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300 shadow-lg">
                                    💡 技能
                                </router-link>
                                <router-link
                                    to="/experience"
                                    class="nav-link px-3 py-2 rounded-lg hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300 shadow-lg">
                                    💼 经验
                                </router-link>
                                <router-link
                                    to="/projects"
                                    class="nav-link px-3 py-2 rounded-lg hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300 shadow-lg">
                                    🚀 项目
                                </router-link>
                                <router-link
                                    to="/achievements"
                                    class="nav-link px-3 py-2 rounded-lg hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300 shadow-lg">
                                    🏆 成就
                                </router-link>
                            </div>

                            <!-- 测试页面导航 -->
                            <div class="test-nav flex items-center gap-1">
                                <div class="text-xs text-gray-400 mr-2">
                                    测试:
                                </div>
                                <router-link
                                    to="/test"
                                    class="nav-link text-sm px-2 py-1 rounded hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300">
                                    路由测试
                                </router-link>
                                <router-link
                                    to="/canvas-test"
                                    class="nav-link text-sm px-2 py-1 rounded hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300">
                                    Canvas
                                </router-link>
                                <router-link
                                    to="/particle-test"
                                    class="nav-link text-sm px-2 py-1 rounded hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300">
                                    粒子
                                </router-link>
                                <router-link
                                    to="/physics-test"
                                    class="nav-link text-sm px-2 py-1 rounded hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300">
                                    物理
                                </router-link>
                                <router-link
                                    to="/animation-demo"
                                    class="nav-link text-sm px-2 py-1 rounded hover:bg-primary-500/20 transition-all duration-200"
                                    active-class="bg-primary-500/30 text-primary-300">
                                    动画
                                </router-link>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- 路由视图容器 -->
                <div class="page-content">
                    <router-view />
                </div>
            </div>
        </AnimationController>
    </div>
</template>

<style scoped>
/* 应用容器样式 */
.app-container {
    position: relative;
    overflow-x: hidden;
}

.main-content {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.main-content.transitioning {
    opacity: 0.8;
    pointer-events: none;
}

/* 导航栏样式 */
.app-nav {
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.container {
    max-width: 1200px;
}

.brand-logo {
    font-family: "Orbitron", sans-serif;
    text-decoration: none;
    display: inline-block;
}

.nav-links {
    font-size: 14px;
}

.business-nav .nav-link {
    font-weight: 500;
    border: 1px solid transparent;
}

.business-nav .nav-link:hover {
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-1px);
}

.test-nav .nav-link {
    font-size: 12px;
    opacity: 0.8;
}

.test-nav .nav-link:hover {
    opacity: 1;
}

/* 页面内容样式 */
.page-content {
    position: relative;
    min-height: calc(100vh - 80px);
}

.transition-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.4s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.geometric-enter-active,
.geometric-leave-active {
    transition: all 0.5s ease;
}

.geometric-enter-from {
    opacity: 0;
    transform: scale(0.9) rotate(5deg);
}

.geometric-leave-to {
    opacity: 0;
    transform: scale(1.1) rotate(-5deg);
}

.liquid-enter-active,
.liquid-leave-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.liquid-enter-from {
    opacity: 0;
    transform: scale(0.8);
    filter: blur(10px);
}

.liquid-leave-to {
    opacity: 0;
    transform: scale(1.2);
    filter: blur(10px);
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .nav-links {
        flex-direction: column;
        gap: 8px;
    }

    .business-nav {
        margin-right: 0;
        margin-bottom: 8px;
    }

    .test-nav {
        flex-wrap: wrap;
    }
}

@media (max-width: 768px) {
    .app-nav {
        padding: 12px 16px;
    }

    .container {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .brand-logo {
        font-size: 18px;
    }

    .nav-links {
        width: 100%;
        justify-content: space-between;
    }

    .business-nav .nav-link {
        padding: 8px 12px;
        font-size: 12px;
    }

    .test-nav {
        display: none; /* 移动端隐藏测试导航 */
    }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
    .app-nav {
        background: #000;
        border-bottom-color: #fff;
    }

    .nav-link {
        border: 1px solid #fff;
    }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
    .main-content,
    .nav-link,
    .brand-logo,
    .fade-enter-active,
    .fade-leave-active,
    .slide-enter-active,
    .slide-leave-active,
    .geometric-enter-active,
    .geometric-leave-active,
    .liquid-enter-active,
    .liquid-leave-active {
        transition: none;
    }

    .fade-enter-from,
    .fade-leave-to,
    .slide-enter-from,
    .slide-leave-to,
    .geometric-enter-from,
    .geometric-leave-to,
    .liquid-enter-from,
    .liquid-leave-to {
        transform: none;
        filter: none;
    }
}

/* 焦点样式 */
.nav-link:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

.brand-logo:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 4px;
    border-radius: 4px;
}
</style>
