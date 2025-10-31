<template>
    <div
        class="achievement-card relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        :class="cardClasses"
        @click="handleClick"
        @mouseenter="handleHover">
        <!-- 背景装饰 -->
        <div
            class="absolute inset-0 opacity-10"
            :style="{ backgroundColor: levelConfig.color }"></div>

        <!-- 等级指示器 -->
        <div
            class="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            :style="{ backgroundColor: levelConfig.color }">
            {{ levelBadge }}
        </div>

        <!-- 主要内容 -->
        <div class="relative p-4 z-10">
            <!-- 图标和标题 -->
            <div class="flex items-start gap-3 mb-3">
                <div
                    class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                    :style="{ backgroundColor: levelConfig.color }">
                    <i
                        :class="`icon-${achievement.icon}`"
                        v-if="achievement.icon"></i>
                    <span v-else>🏆</span>
                </div>

                <div class="flex-1 min-w-0">
                    <h3
                        class="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                        {{ achievement.title }}
                    </h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                        {{ achievement.organization }}
                    </p>
                </div>
            </div>

            <!-- 描述 -->
            <p
                v-if="achievement.description"
                class="text-xs text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                {{ achievement.description }}
            </p>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500 dark:text-gray-400">
                    {{ formatDate(achievement.date) }}
                </span>

                <div class="flex items-center gap-1">
                    <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :style="{
                            backgroundColor: categoryConfig.color + '20',
                            color: categoryConfig.color,
                        }">
                        {{ categoryConfig.description }}
                    </span>
                </div>
            </div>
        </div>

        <!-- 发光效果 -->
        <div
            v-if="isHighlighted"
            class="absolute inset-0 rounded-lg pointer-events-none"
            :style="{
                boxShadow: `0 0 20px ${levelConfig.glow}40`,
                border: `2px solid ${levelConfig.glow}60`,
            }"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IAchievement } from "@/types/achievements";
import {
    getAchievementLevelConfig,
    getAchievementCategoryConfig,
} from "@/utils/achievement-icons";

interface Props {
    achievement: IAchievement;
    isHighlighted?: boolean;
    size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
    isHighlighted: false,
    size: "medium",
});

const emit = defineEmits<{
    click: [achievement: IAchievement];
    hover: [achievement: IAchievement];
}>();

// 获取等级配置
const levelConfig = computed(() =>
    getAchievementLevelConfig(props.achievement.level),
);

// 获取类别配置
const categoryConfig = computed(() =>
    getAchievementCategoryConfig(props.achievement.category),
);

// 等级徽章
const levelBadge = computed(() => {
    const levelMap = {
        gold: "G",
        silver: "S",
        bronze: "B",
        special: "★",
    };
    return levelMap[props.achievement.level] || "A";
});

// 卡片样式类
const cardClasses = computed(() => {
    const baseClasses = "bg-white dark:bg-gray-800 cursor-pointer";
    const sizeClasses = {
        small: "p-3",
        medium: "p-4",
        large: "p-6",
    };

    return [
        baseClasses,
        sizeClasses[props.size],
        `border-${props.achievement.level}`,
        props.isHighlighted ? "ring-2 ring-offset-2" : "",
    ]
        .filter(Boolean)
        .join(" ");
});

// 格式化日期
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
    });
}

// 处理点击事件
function handleClick() {
    emit("click", props.achievement);
}

// 处理悬停事件
function handleHover() {
    emit("hover", props.achievement);
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.border-gold {
    border-color: #ffd700;
}

.border-silver {
    border-color: #c0c0c0;
}

.border-bronze {
    border-color: #cd7f32;
}

.border-special {
    border-color: #9932cc;
}

.achievement-card:hover {
    transform: translateY(-2px);
}
</style>
