<template>
    <div
        class="not-found-view min-h-screen bg-linear-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
            <!-- 404 图标 -->
            <div class="mb-8">
                <div
                    class="inline-flex items-center justify-center w-32 h-32 bg-red-500/20 rounded-full border border-red-500/30 mb-6">
                    <svg
                        class="w-16 h-16 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>

                <!-- 404 文字 -->
                <h1 class="text-8xl md:text-9xl font-bold text-white mb-4">
                    <span
                        class="bg-linear-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                        404
                    </span>
                </h1>
            </div>

            <!-- 错误信息 -->
            <div class="mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
                    页面未找到
                </h2>
                <p class="text-lg text-gray-300 max-w-md mx-auto mb-6">
                    抱歉，您访问的页面不存在或已被移动到其他位置。
                </p>
            </div>

            <!-- 操作按钮 -->
            <div
                class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    返回首页
                </router-link>

                <button
                    @click="goBack"
                    class="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105">
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
                    返回上页
                </button>
            </div>

            <!-- 建议链接 -->
            <div
                class="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-2xl mx-auto">
                <h3 class="text-lg font-semibold text-white mb-4">
                    您可能想要访问：
                </h3>
                <div class="grid sm:grid-cols-2 gap-4">
                    <router-link
                        to="/skills"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold mb-1">技能展示</h4>
                        <p class="text-gray-300 text-sm">查看我的专业技能</p>
                    </router-link>

                    <router-link
                        to="/experience"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold mb-1">工作经验</h4>
                        <p class="text-gray-300 text-sm">了解我的工作经历</p>
                    </router-link>

                    <router-link
                        to="/projects"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold mb-1">项目作品</h4>
                        <p class="text-gray-300 text-sm">查看我的项目作品</p>
                    </router-link>

                    <router-link
                        to="/canvas-test"
                        class="block p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold mb-1">技术演示</h4>
                        <p class="text-gray-300 text-sm">体验交互式演示</p>
                    </router-link>
                </div>
            </div>

            <!-- 联系信息 -->
            <div class="mt-8 text-gray-400 text-sm">
                <p>如果您认为这是一个错误，请联系我们</p>
                <p class="mt-2">
                    <a
                        href="mailto:contact@example.com"
                        class="text-red-400 hover:text-red-300 transition-colors">
                        contact@example.com
                    </a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores";

// 路由和状态
const router = useRouter();
const appStore = useAppStore();

/**
 * 返回上一页
 */
function goBack(): void {
    // 如果有历史记录，返回上一页，否则跳转到首页
    if (window.history.length > 1) {
        router.go(-1);
    } else {
        router.push("/");
    }
}

// 页面初始化
onMounted(() => {
    appStore.setCurrentSection("not-found");

    // 设置页面标题
    document.title = "页面未找到 - 交互式简历网站";
});
</script>

<style scoped>
.container {
    max-width: 800px;
}

/* 响应式适配 */
@media (max-width: 768px) {
    .text-8xl {
        font-size: 4rem;
    }

    .md\:text-9xl {
        font-size: 5rem;
    }

    .text-2xl {
        font-size: 1.5rem;
    }

    .md\:text-3xl {
        font-size: 1.75rem;
    }

    .sm\:flex-row {
        flex-direction: column;
    }

    .sm\:grid-cols-2 {
        grid-template-columns: 1fr;
    }
}

/* 动画效果 */
@keyframes bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
        transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
        transform: translate3d(0, -10px, 0);
    }
    70% {
        transform: translate3d(0, -5px, 0);
    }
    90% {
        transform: translate3d(0, -2px, 0);
    }
}

.hover\:scale-105:hover {
    animation: bounce 1s ease-in-out;
}
</style>
