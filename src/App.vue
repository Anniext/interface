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
        <!-- 导航栏 -->
        <nav class="p-4 border-b border-primary-500/20">
            <div class="container mx-auto flex items-center justify-between">
                <router-link
                    to="/"
                    class="title-game text-2xl text-primary-400 hover:text-primary-300 transition-colors">
                    交互式简历网站
                </router-link>

                <div class="flex items-center gap-4">
                    <router-link
                        to="/"
                        class="nav-link px-3 py-2 rounded hover:bg-primary-500/20 transition-colors"
                        active-class="bg-primary-500/30 text-primary-300">
                        首页
                    </router-link>
                    <router-link
                        to="/canvas-test"
                        class="nav-link px-3 py-2 rounded hover:bg-primary-500/20 transition-colors"
                        active-class="bg-primary-500/30 text-primary-300">
                        Canvas 测试
                    </router-link>
                    <router-link
                        to="/particle-test"
                        class="nav-link px-3 py-2 rounded hover:bg-primary-500/20 transition-colors"
                        active-class="bg-primary-500/30 text-primary-300">
                        粒子测试
                    </router-link>
                    <router-link
                        to="/shape-test"
                        class="nav-link px-3 py-2 rounded hover:bg-primary-500/20 transition-colors"
                        active-class="bg-primary-500/30 text-primary-300">
                        图形测试
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- 路由视图 -->
        <router-view />
    </div>
</template>

<style scoped>
/* 组件特定样式 */
.container {
    max-width: 1200px;
}
</style>
