<!-- 图标动画演示组件 -->
<template>
    <div
        class="icon-animation-demo p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {{ title }}
        </h3>

        <div class="flex flex-wrap gap-4 mb-6">
            <button
                v-for="animationType in animationTypes"
                :key="animationType"
                :class="[
                    'px-3 py-1 text-sm rounded-md transition-colors',
                    selectedAnimation === animationType
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
                ]"
                @click="selectAnimation(animationType)">
                {{ animationType }}
            </button>
        </div>

        <div
            class="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg mb-4">
            <AnimatedSvgIcon
                ref="animatedIcon"
                :size="iconSize"
                :color="iconColor"
                :animation-type="selectedAnimation"
                :animation-config="currentConfig"
                :auto-play="autoPlay"
                :play-on-hover="playOnHover"
                clickable
                @click="handleIconClick"
                @animation-start="handleAnimationStart"
                @animation-complete="handleAnimationComplete">
                <!-- 根据图标类型渲染不同的 SVG 内容 -->
                <g v-if="iconType === 'star'">
                    <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill="currentColor" />
                </g>
                <g v-else-if="iconType === 'heart'">
                    <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        fill="currentColor" />
                </g>
                <g v-else-if="iconType === 'gear'">
                    <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none" />
                    <path
                        d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24 4.24M6.74 17.26L2.5 21.5m15-15l-4.24 4.24M6.74 6.74L2.5 2.5"
                        stroke="currentColor"
                        stroke-width="2" />
                </g>
                <g v-else>
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none" />
                    <path
                        d="M8 12h8M12 8v8"
                        stroke="currentColor"
                        stroke-width="2" />
                </g>
            </AnimatedSvgIcon>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图标类型
                </label>
                <select
                    v-model="iconType"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="default">默认</option>
                    <option value="star">星星</option>
                    <option value="heart">心形</option>
                    <option value="gear">齿轮</option>
                </select>
            </div>

            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图标尺寸
                </label>
                <select
                    v-model="iconSize"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="sm">小</option>
                    <option value="md">中</option>
                    <option value="lg">大</option>
                    <option value="xl">特大</option>
                    <option value="2xl">超大</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    图标颜色
                </label>
                <input
                    v-model="iconColor"
                    type="color"
                    class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md" />
            </div>

            <div class="flex flex-col space-y-2">
                <label class="flex items-center">
                    <input v-model="autoPlay" type="checkbox" class="mr-2" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                        >自动播放</span
                    >
                </label>
                <label class="flex items-center">
                    <input v-model="playOnHover" type="checkbox" class="mr-2" />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                        >悬停播放</span
                    >
                </label>
            </div>
        </div>

        <div class="flex space-x-2">
            <button
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                @click="playAnimation">
                播放
            </button>
            <button
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                @click="pauseAnimation">
                暂停
            </button>
            <button
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                @click="resetAnimation">
                重置
            </button>
        </div>

        <div
            v-if="animationStatus"
            class="mt-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md">
            <p class="text-sm text-blue-800 dark:text-blue-200">
                状态: {{ animationStatus }}
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import AnimatedSvgIcon from "./AnimatedSvgIcon.vue";
import type { IconSize } from "@/types/icons";

/** 组件属性接口 */
interface IIconAnimationDemoProps {
    /** 演示标题 */
    title?: string;
}

// 定义属性
const props = withDefaults(defineProps<IIconAnimationDemoProps>(), {
    title: "图标动画演示",
});

// 组件引用
const animatedIcon = ref<InstanceType<typeof AnimatedSvgIcon>>();

// 动画类型列表
const animationTypes = [
    "hover",
    "pulse",
    "bounce",
    "rotate",
    "scale",
    "path-draw",
    "morph",
] as const;

// 响应式数据
const selectedAnimation = ref<(typeof animationTypes)[number]>("hover");
const iconType = ref("star");
const iconSize = ref<IconSize>("xl");
const iconColor = ref("#3B82F6");
const autoPlay = ref(false);
const playOnHover = ref(true);
const animationStatus = ref("");

// 动画配置
const currentConfig = computed(() => {
    const baseConfig = {
        duration: 1,
        ease: "power2.out",
    };

    switch (selectedAnimation.value) {
        case "pulse":
            return {
                ...baseConfig,
                repeat: -1,
                yoyo: true,
            };
        case "rotate":
            return {
                ...baseConfig,
                ease: "none",
                repeat: -1,
            };
        case "bounce":
            return {
                ...baseConfig,
                ease: "bounce.out",
            };
        case "path-draw":
            return {
                ...baseConfig,
                duration: 2,
                ease: "power2.inOut",
            };
        default:
            return baseConfig;
    }
});

/** 选择动画类型 */
const selectAnimation = (type: (typeof animationTypes)[number]) => {
    selectedAnimation.value = type;
    animationStatus.value = `已选择 ${type} 动画`;
};

/** 播放动画 */
const playAnimation = () => {
    animatedIcon.value?.playAnimation();
};

/** 暂停动画 */
const pauseAnimation = () => {
    animatedIcon.value?.pauseAnimation();
};

/** 重置动画 */
const resetAnimation = () => {
    animatedIcon.value?.resetAnimation();
};

/** 处理图标点击 */
const handleIconClick = () => {
    animationStatus.value = "图标被点击";
};

/** 处理动画开始 */
const handleAnimationStart = () => {
    animationStatus.value = "动画开始播放";
};

/** 处理动画完成 */
const handleAnimationComplete = () => {
    animationStatus.value = "动画播放完成";
};
</script>

<style scoped>
.icon-animation-demo {
    /* 演示组件特定样式 */
}

/* 按钮悬停效果 */
button:hover {
    @apply transform scale-105;
}

/* 选择框样式 */
select:focus,
input:focus {
    @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}
</style>
