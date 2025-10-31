<template>
    <div
        :class="cardClasses"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="handleClick">
        <!-- Lottie 动画容器 -->
        <div class="skill-animation-container">
            <LottiePlayer
                v-if="animationId && shouldShowAnimation"
                :key="animationId"
                :path="animationPath"
                :autoplay="autoplay"
                :loop="loop"
                :hover-play="hoverPlay"
                :width="animationSize"
                :height="animationSize"
                class="skill-lottie-animation"
                @ready="handleAnimationReady"
                @complete="handleAnimationComplete"
                @error="handleAnimationError" />

            <!-- 备用图标 -->
            <div
                v-if="!shouldShowAnimation || animationError"
                class="skill-fallback-icon">
                <SvgIcon
                    :name="skill.icon"
                    :size="iconSize"
                    :color="skill.color"
                    class="skill-icon" />
            </div>
        </div>

        <!-- 技能信息 -->
        <div class="skill-info">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <div class="skill-level">
                <div class="skill-level-bar">
                    <div
                        class="skill-level-fill"
                        :style="{
                            width: `${skill.level * 10}%`,
                            backgroundColor: skill.color,
                        }"></div>
                </div>
                <span class="skill-level-text">{{ skill.level }}/10</span>
            </div>
            <p class="skill-description">{{ skill.description }}</p>
            <div class="skill-experience">
                <span class="experience-text"
                    >{{ skill.experience }} 年经验</span
                >
            </div>
        </div>

        <!-- 动画状态指示器 -->
        <div v-if="showDebugInfo" class="animation-debug-info">
            <span class="debug-status" :class="animationStatus">
                {{ animationStatusText }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import LottiePlayer from "@/components/lottie/LottiePlayer.vue";
import SvgIcon from "@/components/icons/SvgIcon.vue";
import { useLottie } from "@/composables/useLottie";
import type { Skill } from "@/types/skills";

// 组件属性接口
interface Props {
    /** 技能数据 */
    skill: Skill;
    /** 是否自动播放动画 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean;
    /** 是否启用悬停播放 */
    hoverPlay?: boolean;
    /** 动画尺寸 */
    animationSize?: number | string;
    /** 备用图标尺寸 */
    iconSize?: "sm" | "md" | "lg";
    /** 是否显示调试信息 */
    showDebugInfo?: boolean;
    /** 是否禁用动画 */
    disableAnimation?: boolean;
    /** 卡片变体 */
    variant?: "default" | "compact" | "detailed";
}

// 组件事件接口
interface Emits {
    /** 卡片点击事件 */
    (e: "click", skill: Skill): void;
    /** 动画准备就绪 */
    (e: "animation-ready", skill: Skill): void;
    /** 动画播放完成 */
    (e: "animation-complete", skill: Skill): void;
    /** 动画错误 */
    (e: "animation-error", skill: Skill, error: Error): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    autoplay: false,
    loop: true,
    hoverPlay: true,
    animationSize: 80,
    iconSize: "md",
    showDebugInfo: false,
    disableAnimation: false,
    variant: "default",
});

const emit = defineEmits<Emits>();

// 响应式状态
const isHovered = ref(false);
const isClicked = ref(false);
const animationError = ref(false);
const animationReady = ref(false);

// 计算属性
const animationId = computed(() => {
    // 根据技能 ID 映射到对应的动画 ID
    const animationMap: Record<string, string> = {
        // 编程语言动画
        javascript: "skill-javascript",
        typescript: "skill-typescript",
        vue3: "skill-vue",
        java: "skill-java",
        python: "skill-python",
        golang: "skill-go",
        cpp: "skill-cpp",
        rust: "skill-rust",
        csharp: "skill-csharp",

        // 技术栈工具动画
        mysql: "skill-database",
        redis: "skill-database",
        elasticsearch: "skill-database",
        nodejs: "skill-nodejs",
        gin: "skill-nodejs",
        docker: "skill-cloud",
        nginx: "skill-cloud",

        // 项目类型动画
        "web-development": "project-web",
        "game-development": "project-game",
        "api-development": "project-api",
    };

    return animationMap[props.skill.id] || null;
});

const animationPath = computed(() => {
    if (!animationId.value) return null;

    // 根据动画 ID 生成路径
    if (animationId.value.startsWith("skill-")) {
        const skillName = animationId.value.replace("skill-", "");
        return `/animations/skills/${skillName}.json`;
    } else if (animationId.value.startsWith("project-")) {
        const projectType = animationId.value.replace("project-", "");
        return `/animations/projects/${projectType}-development.json`;
    } else if (animationId.value.startsWith("achievement-")) {
        const achievementType = animationId.value.replace("achievement-", "");
        return `/animations/achievements/${achievementType}.json`;
    }

    return null;
});

const shouldShowAnimation = computed(() => {
    return (
        !props.disableAnimation &&
        animationId.value &&
        animationPath.value &&
        !animationError.value
    );
});

const cardClasses = computed(() => {
    return [
        "skill-animation-card",
        `skill-card-${props.variant}`,
        {
            "skill-card-hovered": isHovered.value,
            "skill-card-clicked": isClicked.value,
            "skill-card-animated": shouldShowAnimation.value,
            "skill-card-fallback": !shouldShowAnimation.value,
        },
    ];
});

const animationStatus = computed(() => {
    if (animationError.value) return "error";
    if (animationReady.value) return "ready";
    if (shouldShowAnimation.value) return "loading";
    return "disabled";
});

const animationStatusText = computed(() => {
    switch (animationStatus.value) {
        case "ready":
            return "动画就绪";
        case "loading":
            return "加载中";
        case "error":
            return "动画错误";
        case "disabled":
            return "动画禁用";
        default:
            return "未知状态";
    }
});

// 事件处理方法
const handleMouseEnter = () => {
    isHovered.value = true;
};

const handleMouseLeave = () => {
    isHovered.value = false;
};

const handleClick = () => {
    isClicked.value = true;
    setTimeout(() => {
        isClicked.value = false;
    }, 200);

    emit("click", props.skill);
};

const handleAnimationReady = () => {
    animationReady.value = true;
    animationError.value = false;
    emit("animation-ready", props.skill);
};

const handleAnimationComplete = () => {
    emit("animation-complete", props.skill);
};

const handleAnimationError = (error: Error) => {
    console.warn(`技能动画加载失败 (${props.skill.name}):`, error);
    animationError.value = true;
    animationReady.value = false;
    emit("animation-error", props.skill, error);
};

// 生命周期
onMounted(() => {
    // 组件挂载时的初始化逻辑
});

onBeforeUnmount(() => {
    // 清理工作
});
</script>

<style scoped>
.skill-animation-card {
    @apply relative flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 cursor-pointer;
    @apply hover:shadow-lg hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700;
}

.skill-animation-card.skill-card-hovered {
    @apply shadow-xl scale-105;
}

.skill-animation-card.skill-card-clicked {
    @apply scale-95;
}

.skill-animation-card.skill-card-animated {
    @apply border-2 border-blue-200 dark:border-blue-600;
}

/* 动画容器 */
.skill-animation-container {
    @apply relative flex items-center justify-center mb-3;
    width: 80px;
    height: 80px;
}

.skill-lottie-animation {
    @apply w-full h-full;
}

.skill-fallback-icon {
    @apply flex items-center justify-center w-full h-full;
}

.skill-icon {
    @apply transition-transform duration-300;
}

.skill-animation-card:hover .skill-icon {
    @apply scale-110;
}

/* 技能信息 */
.skill-info {
    @apply flex flex-col items-center text-center w-full;
}

.skill-name {
    @apply text-lg font-semibold text-gray-900 dark:text-white mb-2;
}

.skill-level {
    @apply flex items-center gap-2 mb-2 w-full;
}

.skill-level-bar {
    @apply flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden;
}

.skill-level-fill {
    @apply h-full transition-all duration-500 ease-out;
}

.skill-level-text {
    @apply text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[40px];
}

.skill-description {
    @apply text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2;
}

.skill-experience {
    @apply flex items-center gap-1;
}

.experience-text {
    @apply text-xs text-gray-500 dark:text-gray-500 font-medium;
}

/* 卡片变体样式 */
.skill-card-compact {
    @apply p-3;
}

.skill-card-compact .skill-animation-container {
    width: 60px;
    height: 60px;
    @apply mb-2;
}

.skill-card-compact .skill-name {
    @apply text-base mb-1;
}

.skill-card-compact .skill-description {
    @apply hidden;
}

.skill-card-detailed {
    @apply p-6;
}

.skill-card-detailed .skill-animation-container {
    width: 100px;
    height: 100px;
    @apply mb-4;
}

.skill-card-detailed .skill-name {
    @apply text-xl mb-3;
}

.skill-card-detailed .skill-description {
    @apply text-base line-clamp-3;
}

/* 调试信息 */
.animation-debug-info {
    @apply absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700;
}

.debug-status {
    @apply font-mono;
}

.debug-status.ready {
    @apply text-green-600 dark:text-green-400;
}

.debug-status.loading {
    @apply text-yellow-600 dark:text-yellow-400;
}

.debug-status.error {
    @apply text-red-600 dark:text-red-400;
}

.debug-status.disabled {
    @apply text-gray-500 dark:text-gray-500;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .skill-animation-card {
        @apply p-3;
    }

    .skill-animation-container {
        width: 60px;
        height: 60px;
        @apply mb-2;
    }

    .skill-name {
        @apply text-base;
    }

    .skill-description {
        @apply text-xs line-clamp-1;
    }
}

/* 动画效果 */
@keyframes skill-card-appear {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.skill-animation-card {
    animation: skill-card-appear 0.5s ease-out;
}

/* 技能等级颜色 */
.skill-level-fill {
    background: linear-gradient(90deg, currentColor 0%, currentColor 100%);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .skill-animation-card {
        @apply border-gray-700;
    }

    .skill-card-animated {
        @apply border-blue-500;
    }
}
</style>
