<!-- 装饰元素展示组件 -->
<template>
    <div
        class="decorative-showcase p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 class="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            装饰性 SVG 元素展示
        </h3>

        <!-- 分类选择 -->
        <div class="mb-6">
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="category in categories"
                    :key="category.key"
                    :class="[
                        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                        selectedCategory === category.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                    ]"
                    @click="selectCategory(category.key)">
                    {{ category.name }}
                </button>
            </div>
        </div>

        <!-- 背景图案展示 -->
        <section v-if="selectedCategory === 'backgroundPatterns'" class="mb-8">
            <h4
                class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                背景图案
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                    v-for="(preset, name) in backgroundPatternPresets"
                    :key="name"
                    class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <div class="h-32 mb-3 relative overflow-hidden rounded">
                        <DecorativeSvg
                            v-bind="preset"
                            :width="200"
                            :height="120"
                            class="absolute inset-0 w-full h-full" />
                    </div>
                    <h5
                        class="font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {{ name }}
                    </h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ preset.description }}
                    </p>
                </div>
            </div>
        </section>

        <!-- 分割线展示 -->
        <section v-if="selectedCategory === 'dividers'" class="mb-8">
            <h4
                class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                分割线
            </h4>
            <div class="space-y-6">
                <div
                    v-for="(preset, name) in dividerPresets"
                    :key="name"
                    class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
                    <h5
                        class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                        {{ name }} - {{ preset.description }}
                    </h5>
                    <div class="flex justify-center">
                        <DecorativeSvg v-bind="preset" />
                    </div>
                </div>
            </div>
        </section>

        <!-- 边框展示 -->
        <section v-if="selectedCategory === 'borders'" class="mb-8">
            <h4
                class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                边框元素
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    v-for="(preset, name) in borderPresets"
                    :key="name"
                    class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                    <h5
                        class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                        {{ name }} - {{ preset.description }}
                    </h5>
                    <div class="flex justify-center">
                        <DecorativeSvg v-bind="preset" />
                    </div>
                </div>
            </div>
        </section>

        <!-- 几何图形展示 -->
        <section v-if="selectedCategory === 'geometric'" class="mb-8">
            <h4
                class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                几何装饰图形
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div
                    v-for="(preset, name) in geometricPresets"
                    :key="name"
                    class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border text-center">
                    <div class="flex justify-center mb-3">
                        <DecorativeSvg v-bind="preset" />
                    </div>
                    <h5
                        class="font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {{ name }}
                    </h5>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ preset.description }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Logo 展示 -->
        <section v-if="selectedCategory === 'logos'" class="mb-8">
            <h4
                class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                品牌标识和 Logo
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    v-for="(preset, name) in logoPresets"
                    :key="name"
                    class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border text-center">
                    <div class="flex justify-center mb-3">
                        <DecorativeSvg v-bind="preset" />
                    </div>
                    <h5
                        class="font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {{ name }}
                    </h5>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ preset.description }}
                    </p>
                </div>
            </div>
        </section>

        <!-- 自定义配置区域 -->
        <section class="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4
                class="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                自定义配置
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label
                        class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                        颜色
                    </label>
                    <input
                        v-model="customColor"
                        type="color"
                        class="w-full h-10 border border-blue-300 dark:border-blue-600 rounded-md" />
                </div>
                <div>
                    <label
                        class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                        透明度
                    </label>
                    <input
                        v-model="customOpacity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        class="w-full" />
                    <span class="text-xs text-blue-600 dark:text-blue-400">
                        {{ customOpacity }}
                    </span>
                </div>
                <div>
                    <label
                        class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                        尺寸
                    </label>
                    <input
                        v-model="customSize"
                        type="range"
                        min="50"
                        max="200"
                        step="10"
                        class="w-full" />
                    <span class="text-xs text-blue-600 dark:text-blue-400">
                        {{ customSize }}px
                    </span>
                </div>
                <div class="flex items-center">
                    <label class="flex items-center">
                        <input
                            v-model="customAnimated"
                            type="checkbox"
                            class="mr-2" />
                        <span class="text-sm text-blue-700 dark:text-blue-300"
                            >启用动画</span
                        >
                    </label>
                </div>
            </div>

            <div class="mt-4 flex justify-center">
                <DecorativeSvg
                    type="geometric"
                    variant="circle"
                    :width="customSize"
                    :height="customSize"
                    :color="customColor"
                    :opacity="parseFloat(customOpacity)"
                    :animated="customAnimated" />
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import DecorativeSvg from "./DecorativeSvg.vue";
import {
    BACKGROUND_PATTERN_PRESETS,
    DIVIDER_PRESETS,
    BORDER_PRESETS,
    GEOMETRIC_PRESETS,
    LOGO_PRESETS,
} from "@/utils/decorative-presets";

// 分类配置
const categories = [
    { key: "backgroundPatterns", name: "背景图案" },
    { key: "dividers", name: "分割线" },
    { key: "borders", name: "边框" },
    { key: "geometric", name: "几何图形" },
    { key: "logos", name: "Logo" },
] as const;

// 响应式数据
const selectedCategory = ref<(typeof categories)[number]["key"]>("geometric");

// 预设配置
const backgroundPatternPresets = BACKGROUND_PATTERN_PRESETS;
const dividerPresets = DIVIDER_PRESETS;
const borderPresets = BORDER_PRESETS;
const geometricPresets = GEOMETRIC_PRESETS;
const logoPresets = LOGO_PRESETS;

// 自定义配置
const customColor = ref("#3B82F6");
const customOpacity = ref("0.8");
const customSize = ref(80);
const customAnimated = ref(true);

/** 选择分类 */
const selectCategory = (category: (typeof categories)[number]["key"]) => {
    selectedCategory.value = category;
};
</script>

<style scoped>
.decorative-showcase {
    /* 展示组件特定样式 */
}

/* 分类按钮动画 */
button {
    @apply transition-all duration-200;
}

button:hover {
    @apply transform scale-105;
}

/* 卡片悬停效果 */
.grid > div {
    @apply transition-all duration-300;
}

.grid > div:hover {
    @apply transform scale-105 shadow-lg;
}

/* 滑块样式 */
input[type="range"] {
    @apply appearance-none bg-blue-200 dark:bg-blue-700 h-2 rounded-lg outline-none;
}

input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
    @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-none;
}
</style>
