<template>
    <div class="test-page min-h-screen bg-blue-500 text-white p-8">
        <h1 class="text-4xl font-bold mb-4">测试页面</h1>
        <p class="text-xl mb-8">如果你能看到这个页面，说明路由工作正常！</p>

        <div class="space-y-4">
            <router-link
                to="/"
                class="block px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
                返回首页
            </router-link>
            <router-link
                to="/skills"
                class="block px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
                技能页面
            </router-link>
        </div>

        <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">当前路由信息：</h2>
            <pre class="bg-black/20 p-4 rounded">{{ $route }}</pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
console.log("TestPage 组件已加载，当前路由:", route.path);
</script>
