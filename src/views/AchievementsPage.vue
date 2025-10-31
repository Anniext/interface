<template>
    <div
        class="achievements-page min-h-screen bg-linear-to-br from-gray-900 to-black text-white">
        <div class="container mx-auto px-4 py-12">
            <!-- 页面标题 -->
            <div class="text-center mb-16">
                <h1
                    class="text-5xl font-bold mb-6 bg-linear-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent">
                    获奖成就
                </h1>
                <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                    展示我在职业生涯中获得的奖项和认证
                </p>
            </div>

            <!-- 成就展示占位 -->
            <div class="achievements-container mb-16">
                <div
                    class="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
                    <div class="text-center text-gray-400">
                        <div class="text-4xl mb-4">🏆</div>
                        <div class="text-xl mb-2">成就展示区域</div>
                        <div class="text-sm">奖项展示组件开发中...</div>
                    </div>
                </div>
            </div>

            <!-- 返回导航 -->
            <div class="text-center">
                <router-link
                    to="/"
                    class="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors font-semibold">
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
    console.log("获奖成就页面已加载");
});
</script>

<style scoped>
.achievements-page {
    animation: fadeInUp 0.6s ease-out;
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
</style>
