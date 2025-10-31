<!-- 图标测试页面 -->
<template>
    <div class="icon-test-page min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div class="container mx-auto px-4">
            <h1
                class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                SVG 图标库测试
            </h1>

            <!-- 技术栈图标展示 -->
            <section class="mb-12">
                <h2
                    class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    技术栈图标
                </h2>
                <div
                    class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                    <div
                        v-for="iconName in techIcons"
                        :key="iconName"
                        class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <IconLibrary
                            type="tech"
                            :name="iconName"
                            size="xl"
                            clickable
                            class="mb-2"
                            @click="handleIconClick('tech', iconName)" />
                        <span
                            class="text-xs text-gray-600 dark:text-gray-400 text-center">
                            {{ iconName }}
                        </span>
                    </div>
                </div>
            </section>

            <!-- 成就图标展示 -->
            <section class="mb-12">
                <h2
                    class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    成就图标
                </h2>
                <div
                    class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                    <div
                        v-for="iconName in achievementIcons"
                        :key="iconName"
                        class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <IconLibrary
                            type="achievement"
                            :name="iconName"
                            size="xl"
                            clickable
                            class="mb-2"
                            @click="handleIconClick('achievement', iconName)" />
                        <span
                            class="text-xs text-gray-600 dark:text-gray-400 text-center">
                            {{ iconName }}
                        </span>
                    </div>
                </div>
            </section>

            <!-- 不同等级的成就图标 -->
            <section class="mb-12">
                <h2
                    class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    成就等级展示
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div
                        v-for="level in achievementLevels"
                        :key="level"
                        class="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <h3
                            class="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200 capitalize">
                            {{ level }}
                        </h3>
                        <div class="flex space-x-4">
                            <IconLibrary
                                type="achievement"
                                name="trophy"
                                :level="level"
                                size="2xl"
                                clickable />
                            <IconLibrary
                                type="achievement"
                                name="medal"
                                :level="level"
                                size="2xl"
                                clickable />
                            <IconLibrary
                                type="achievement"
                                name="star"
                                :level="level"
                                size="2xl"
                                clickable />
                        </div>
                    </div>
                </div>
            </section>

            <!-- 图标尺寸展示 -->
            <section class="mb-12">
                <h2
                    class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    图标尺寸展示
                </h2>
                <div
                    class="flex items-center justify-center space-x-8 p-8 bg-white dark:bg-gray-800 rounded-lg">
                    <div
                        v-for="size in iconSizes"
                        :key="size"
                        class="flex flex-col items-center space-y-2">
                        <IconLibrary
                            type="tech"
                            name="vue"
                            :size="size"
                            clickable />
                        <span class="text-xs text-gray-600 dark:text-gray-400">
                            {{ size }}
                        </span>
                    </div>
                </div>
            </section>

            <!-- 点击信息显示 -->
            <div
                v-if="clickedIcon"
                class="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg">
                <p class="font-medium">点击了图标:</p>
                <p>类型: {{ clickedIcon.type }}</p>
                <p>名称: {{ clickedIcon.name }}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IconLibrary } from "@/components/icons";
import type {
    TechIconName,
    AchievementIconName,
    IconSize,
} from "@/types/icons";
import type { AchievementLevel } from "@/types/achievements";

/** 技术栈图标列表 */
const techIcons: TechIconName[] = [
    "java",
    "python",
    "go",
    "spring",
    "mysql",
    "redis",
    "docker",
    "git",
    "vue",
    "react",
    "nodejs",
    "typescript",
    "javascript",
    "html",
    "css",
];

/** 成就图标列表 */
const achievementIcons: AchievementIconName[] = [
    "trophy",
    "medal",
    "star",
    "certificate",
    "award",
    "badge",
    "crown",
];

/** 成就等级列表 */
const achievementLevels: AchievementLevel[] = [
    "gold",
    "silver",
    "bronze",
    "special",
];

/** 图标尺寸列表 */
const iconSizes: IconSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

/** 点击的图标信息 */
const clickedIcon = ref<{ type: string; name: string } | null>(null);

/** 处理图标点击事件 */
const handleIconClick = (type: string, name: string) => {
    clickedIcon.value = { type, name };

    // 3秒后自动隐藏
    setTimeout(() => {
        clickedIcon.value = null;
    }, 3000);
};
</script>

<style scoped>
.icon-test-page {
    /* 页面特定样式 */
}

/* 图标悬停效果 */
.icon-hover-effect {
    @apply transition-all duration-300 hover:scale-110 hover:drop-shadow-lg;
}

/* 响应式网格调整 */
@media (max-width: 640px) {
    .grid-cols-4 {
        @apply grid-cols-3;
    }
}
</style>
