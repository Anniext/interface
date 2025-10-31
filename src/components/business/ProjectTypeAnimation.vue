<template>
    <div :class="containerClasses">
        <!-- 项目类型动画 -->
        <div class="project-animation-wrapper">
            <LottiePlayer
                v-if="animationPath && !animationError"
                :key="projectType"
                :path="animationPath"
                :autoplay="autoplay"
                :loop="loop"
                :hover-play="hoverPlay"
                :width="animationSize"
                :height="animationSize"
                class="project-type-animation"
                @ready="handleAnimationReady"
                @complete="handleAnimationComplete"
                @error="handleAnimationError" />

            <!-- 备用图标 -->
            <div v-else class="project-fallback-icon">
                <SvgIcon
                    :name="fallbackIcon"
                    :size="iconSize"
                    :color="iconColor"
                    class="project-icon" />
            </div>
        </div>

        <!-- 项目类型标签 -->
        <div v-if="showLabel" class="project-type-label">
            <span class="project-type-text">{{ projectTypeLabel }}</span>
        </div>

        <!-- 动画控制按钮 -->
        <div v-if="showControls" class="animation-controls">
            <button
                @click="toggleAnimation"
                class="control-button"
                :class="{ active: isPlaying }">
                <SvgIcon
                    :name="isPlaying ? 'pause' : 'play'"
                    size="sm"
                    class="control-icon" />
            </button>
            <button @click="restartAnimation" class="control-button">
                <SvgIcon name="refresh" size="sm" class="control-icon" />
            </button>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import LottiePlayer from "@/components/lottie/LottiePlayer.vue";
import SvgIcon from "@/components/icons/SvgIcon.vue";
import type { AnimationItem } from "lottie-web";

// 项目类型枚举
export type ProjectType = "web" | "mobile" | "game" | "api" | "desktop" | "ai";

// 组件属性接口
interface Props {
    /** 项目类型 */
    projectType: ProjectType;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean;
    /** 是否启用悬停播放 */
    hoverPlay?: boolean;
    /** 动画尺寸 */
    animationSize?: number | string;
    /** 备用图标尺寸 */
    iconSize?: "sm" | "md" | "lg";
    /** 是否显示标签 */
    showLabel?: boolean;
    /** 是否显示控制按钮 */
    showControls?: boolean;
    /** 自定义图标颜色 */
    iconColor?: string;
    /** 组件变体 */
    variant?: "default" | "minimal" | "detailed";
}

// 组件事件接口
interface Emits {
    /** 动画准备就绪 */
    (e: "ready", projectType: ProjectType): void;
    /** 动画播放完成 */
    (e: "complete", projectType: ProjectType): void;
    /** 动画错误 */
    (e: "error", projectType: ProjectType, error: Error): void;
    /** 动画状态变化 */
    (e: "state-change", projectType: ProjectType, isPlaying: boolean): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    autoplay: true,
    loop: true,
    hoverPlay: false,
    animationSize: 120,
    iconSize: "lg",
    showLabel: true,
    showControls: false,
    iconColor: "#3B82F6",
    variant: "default",
});

const emit = defineEmits<Emits>();

// 响应式状态
const animationRef = ref<AnimationItem | null>(null);
const isLoading = ref(false);
const animationError = ref(false);
const isPlaying = ref(props.autoplay);

// 计算属性
const animationPath = computed(() => {
    const animationMap: Record<ProjectType, string> = {
        web: "/animations/projects/web-development.json",
        mobile: "/animations/projects/mobile-app.json",
        game: "/animations/projects/game-development.json",
        api: "/animations/projects/api-development.json",
        desktop: "/animations/projects/desktop-app.json",
        ai: "/animations/projects/ai-development.json",
    };

    return animationMap[props.projectType] || null;
});

const projectTypeLabel = computed(() => {
    const labelMap: Record<ProjectType, string> = {
        web: "Web 开发",
        mobile: "移动应用",
        game: "游戏开发",
        api: "API 开发",
        desktop: "桌面应用",
        ai: "AI 开发",
    };

    return labelMap[props.projectType] || "未知类型";
});

const fallbackIcon = computed(() => {
    const iconMap: Record<ProjectType, string> = {
        web: "globe",
        mobile: "smartphone",
        game: "gamepad",
        api: "server",
        desktop: "monitor",
        ai: "brain",
    };

    return iconMap[props.projectType] || "code";
});

const containerClasses = computed(() => {
    return [
        "project-type-animation-container",
        `project-variant-${props.variant}`,
        {
            "project-loading": isLoading.value,
            "project-error": animationError.value,
            "project-playing": isPlaying.value,
        },
    ];
});

// 方法
const toggleAnimation = () => {
    if (animationRef.value) {
        if (isPlaying.value) {
            animationRef.value.pause();
        } else {
            animationRef.value.play();
        }
        isPlaying.value = !isPlaying.value;
        emit("state-change", props.projectType, isPlaying.value);
    }
};

const restartAnimation = () => {
    if (animationRef.value) {
        animationRef.value.goToAndPlay(0);
        isPlaying.value = true;
        emit("state-change", props.projectType, isPlaying.value);
    }
};

// 事件处理方法
const handleAnimationReady = (animation: AnimationItem) => {
    animationRef.value = animation;
    isLoading.value = false;
    animationError.value = false;
    emit("ready", props.projectType);
};

const handleAnimationComplete = () => {
    if (!props.loop) {
        isPlaying.value = false;
        emit("state-change", props.projectType, isPlaying.value);
    }
    emit("complete", props.projectType);
};

const handleAnimationError = (error: Error) => {
    console.warn(`项目类型动画加载失败 (${props.projectType}):`, error);
    animationError.value = true;
    isLoading.value = false;
    emit("error", props.projectType, error);
};

// 监听属性变化
watch(
    () => props.projectType,
    () => {
        isLoading.value = true;
        animationError.value = false;
        animationRef.value = null;
    },
);
</script>

<style scoped>
.project-type-animation-container {
    @apply relative flex flex-col items-center justify-center;
}

.project-animation-wrapper {
    @apply relative flex items-center justify-center;
}

.project-type-animation {
    @apply transition-transform duration-300;
}

.project-type-animation-container:hover .project-type-animation {
    @apply scale-105;
}

.project-fallback-icon {
    @apply flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg;
}

.project-icon {
    @apply transition-transform duration-300;
}

.project-type-animation-container:hover .project-icon {
    @apply scale-110;
}

/* 项目类型标签 */
.project-type-label {
    @apply mt-3 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full;
}

.project-type-text {
    @apply text-sm font-medium text-blue-800 dark:text-blue-200;
}

/* 动画控制按钮 */
.animation-controls {
    @apply flex items-center gap-2 mt-3;
}

.control-button {
    @apply flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full;
    @apply hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200;
}

.control-button.active {
    @apply bg-blue-500 text-white;
}

.control-icon {
    @apply text-gray-600 dark:text-gray-300;
}

.control-button.active .control-icon {
    @apply text-white;
}

/* 加载状态 */
.loading-overlay {
    @apply absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 rounded-lg;
}

.loading-spinner {
    @apply w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin;
}

/* 组件变体样式 */
.project-variant-minimal .project-type-label {
    @apply hidden;
}

.project-variant-minimal .animation-controls {
    @apply hidden;
}

.project-variant-detailed .project-animation-wrapper {
    @apply p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl;
}

.project-variant-detailed .project-type-label {
    @apply mt-4 px-4 py-2 text-base;
}

/* 状态样式 */
.project-loading {
    @apply opacity-75;
}

.project-error .project-animation-wrapper {
    @apply border-2 border-red-200 dark:border-red-600 rounded-lg;
}

.project-playing .project-type-animation {
    @apply shadow-lg;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .project-type-animation-container {
        @apply scale-90;
    }

    .project-type-label {
        @apply mt-2 px-2 py-1 text-xs;
    }

    .animation-controls {
        @apply mt-2 gap-1;
    }

    .control-button {
        @apply w-6 h-6;
    }
}

/* 动画效果 */
@keyframes project-appear {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.project-type-animation-container {
    animation: project-appear 0.6s ease-out;
}

/* 悬停效果 */
.project-type-animation-container:hover {
    @apply transform transition-transform duration-300;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .project-variant-detailed .project-animation-wrapper {
        @apply from-gray-800 to-gray-900;
    }
}
</style>
