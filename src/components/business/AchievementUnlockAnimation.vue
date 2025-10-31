<template>
    <div :class="containerClasses">
        <!-- 成就解锁动画 -->
        <div class="achievement-animation-wrapper">
            <LottiePlayer
                v-if="animationPath && !animationError"
                :key="`${achievementType}-${triggerKey}`"
                :path="animationPath"
                :autoplay="autoplay"
                :loop="false"
                :width="animationSize"
                :height="animationSize"
                class="achievement-unlock-animation"
                @ready="handleAnimationReady"
                @complete="handleAnimationComplete"
                @error="handleAnimationError" />

            <!-- 备用成就图标 -->
            <div v-else class="achievement-fallback-icon">
                <SvgIcon
                    :name="fallbackIcon"
                    :size="iconSize"
                    :color="iconColor"
                    class="achievement-icon" />
            </div>
        </div>

        <!-- 成就信息 -->
        <div v-if="showInfo && achievement" class="achievement-info">
            <h3 class="achievement-title">{{ achievement.title }}</h3>
            <p class="achievement-description">{{ achievement.description }}</p>
            <div class="achievement-meta">
                <span class="achievement-date">{{
                    formatDate(achievement.date)
                }}</span>
                <span
                    class="achievement-level"
                    :class="`level-${achievement.level}`">
                    {{ levelText }}
                </span>
            </div>
        </div>

        <!-- 成就通知弹窗 -->
        <Teleport to="body">
            <div
                v-if="showNotification"
                class="achievement-notification-overlay"
                @click="hideNotification">
                <div class="achievement-notification" @click.stop>
                    <div class="notification-header">
                        <SvgIcon
                            name="trophy"
                            size="lg"
                            color="#FFD700"
                            class="notification-icon" />
                        <h2 class="notification-title">成就解锁！</h2>
                    </div>
                    <div class="notification-content">
                        <div class="notification-animation">
                            <LottiePlayer
                                v-if="animationPath"
                                :path="animationPath"
                                :autoplay="true"
                                :loop="false"
                                :width="120"
                                :height="120"
                                class="notification-lottie" />
                        </div>
                        <div class="notification-details">
                            <h3 class="notification-achievement-title">
                                {{ achievement?.title }}
                            </h3>
                            <p class="notification-achievement-description">
                                {{ achievement?.description }}
                            </p>
                            <div
                                class="notification-achievement-level"
                                :class="`level-${achievement?.level}`">
                                {{ levelText }}
                            </div>
                        </div>
                    </div>
                    <button
                        @click="hideNotification"
                        class="notification-close-button">
                        确定
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import LottiePlayer from "@/components/lottie/LottiePlayer.vue";
import SvgIcon from "@/components/icons/SvgIcon.vue";
import type { Achievement } from "@/types/achievements";
import type { AnimationItem } from "lottie-web";

// 成就类型枚举
export type AchievementType =
    | "unlock"
    | "trophy"
    | "medal"
    | "certificate"
    | "badge";

// 组件属性接口
interface Props {
    /** 成就类型 */
    achievementType: AchievementType;
    /** 成就数据 */
    achievement?: Achievement;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 动画尺寸 */
    animationSize?: number | string;
    /** 备用图标尺寸 */
    iconSize?: "sm" | "md" | "lg";
    /** 是否显示成就信息 */
    showInfo?: boolean;
    /** 是否显示通知弹窗 */
    showNotification?: boolean;
    /** 自定义图标颜色 */
    iconColor?: string;
    /** 触发动画的键值（用于重新播放） */
    triggerKey?: string | number;
}

// 组件事件接口
interface Emits {
    /** 动画准备就绪 */
    (e: "ready", achievementType: AchievementType): void;
    /** 动画播放完成 */
    (e: "complete", achievementType: AchievementType): void;
    /** 动画错误 */
    (e: "error", achievementType: AchievementType, error: Error): void;
    /** 通知关闭 */
    (e: "notification-close"): void;
    /** 成就点击 */
    (e: "achievement-click", achievement: Achievement): void;
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
    autoplay: true,
    animationSize: 100,
    iconSize: "lg",
    showInfo: false,
    showNotification: false,
    iconColor: "#FFD700",
    triggerKey: 0,
});

const emit = defineEmits<Emits>();

// 响应式状态
const animationRef = ref<AnimationItem | null>(null);
const animationError = ref(false);
const isAnimating = ref(false);
const notificationVisible = ref(false);

// 计算属性
const animationPath = computed(() => {
    const animationMap: Record<AchievementType, string> = {
        unlock: "/animations/achievements/unlock.json",
        trophy: "/animations/achievements/trophy.json",
        medal: "/animations/achievements/medal.json",
        certificate: "/animations/achievements/certificate.json",
        badge: "/animations/achievements/badge.json",
    };

    return animationMap[props.achievementType] || null;
});

const fallbackIcon = computed(() => {
    const iconMap: Record<AchievementType, string> = {
        unlock: "unlock",
        trophy: "trophy",
        medal: "medal",
        certificate: "certificate",
        badge: "badge",
    };

    return iconMap[props.achievementType] || "star";
});

const levelText = computed(() => {
    if (!props.achievement) return "";

    const levelMap: Record<string, string> = {
        gold: "金牌",
        silver: "银牌",
        bronze: "铜牌",
        special: "特殊",
    };

    return levelMap[props.achievement.level] || props.achievement.level;
});

const containerClasses = computed(() => {
    return [
        "achievement-unlock-container",
        `achievement-type-${props.achievementType}`,
        {
            "achievement-animating": isAnimating.value,
            "achievement-error": animationError.value,
            "achievement-with-info": props.showInfo,
        },
    ];
});

// 方法
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const triggerUnlockAnimation = async () => {
    if (animationRef.value) {
        isAnimating.value = true;
        animationRef.value.goToAndPlay(0);

        if (props.showNotification) {
            await nextTick();
            notificationVisible.value = true;
        }
    }
};

const hideNotification = () => {
    notificationVisible.value = false;
    emit("notification-close");
};

const handleAchievementClick = () => {
    if (props.achievement) {
        emit("achievement-click", props.achievement);
    }
};

// 事件处理方法
const handleAnimationReady = (animation: AnimationItem) => {
    animationRef.value = animation;
    animationError.value = false;
    emit("ready", props.achievementType);
};

const handleAnimationComplete = () => {
    isAnimating.value = false;
    emit("complete", props.achievementType);
};

const handleAnimationError = (error: Error) => {
    console.warn(`成就解锁动画加载失败 (${props.achievementType}):`, error);
    animationError.value = true;
    isAnimating.value = false;
    emit("error", props.achievementType, error);
};

// 监听属性变化
watch(
    () => props.triggerKey,
    () => {
        if (props.autoplay) {
            triggerUnlockAnimation();
        }
    },
);

watch(
    () => props.showNotification,
    (newValue) => {
        notificationVisible.value = newValue;
    },
);

// 暴露方法给父组件
defineExpose({
    triggerUnlockAnimation,
    hideNotification,
});
</script>

<style scoped>
.achievement-unlock-container {
    @apply relative flex flex-col items-center justify-center;
}

.achievement-animation-wrapper {
    @apply relative flex items-center justify-center;
}

.achievement-unlock-animation {
    @apply transition-transform duration-300;
}

.achievement-animating .achievement-unlock-animation {
    @apply scale-110;
}

.achievement-fallback-icon {
    @apply flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full;
}

.achievement-icon {
    @apply transition-transform duration-300;
}

.achievement-unlock-container:hover .achievement-icon {
    @apply scale-110;
}

/* 成就信息 */
.achievement-info {
    @apply mt-4 text-center max-w-xs;
}

.achievement-title {
    @apply text-lg font-bold text-gray-900 dark:text-white mb-2;
}

.achievement-description {
    @apply text-sm text-gray-600 dark:text-gray-400 mb-3;
}

.achievement-meta {
    @apply flex items-center justify-between text-xs text-gray-500 dark:text-gray-500;
}

.achievement-date {
    @apply font-medium;
}

.achievement-level {
    @apply px-2 py-1 rounded-full font-bold;
}

.achievement-level.level-gold {
    @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
}

.achievement-level.level-silver {
    @apply bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200;
}

.achievement-level.level-bronze {
    @apply bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200;
}

.achievement-level.level-special {
    @apply bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200;
}

/* 成就通知弹窗 */
.achievement-notification-overlay {
    @apply fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm;
    animation: notification-overlay-appear 0.3s ease-out;
}

.achievement-notification {
    @apply bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6;
    animation: notification-appear 0.5s ease-out;
}

.notification-header {
    @apply flex items-center justify-center gap-3 mb-6;
}

.notification-icon {
    @apply animate-bounce;
}

.notification-title {
    @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.notification-content {
    @apply flex flex-col items-center gap-4 mb-6;
}

.notification-animation {
    @apply flex items-center justify-center;
}

.notification-lottie {
    @apply drop-shadow-lg;
}

.notification-details {
    @apply text-center;
}

.notification-achievement-title {
    @apply text-xl font-bold text-gray-900 dark:text-white mb-2;
}

.notification-achievement-description {
    @apply text-gray-600 dark:text-gray-400 mb-3;
}

.notification-achievement-level {
    @apply inline-block px-3 py-1 rounded-full font-bold text-sm;
}

.notification-close-button {
    @apply w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg;
    @apply transition-colors duration-200;
}

/* 动画效果 */
@keyframes notification-overlay-appear {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes notification-appear {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes achievement-unlock {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.achievement-animating {
    animation: achievement-unlock 0.6s ease-out;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .achievement-notification {
        @apply mx-2 p-4;
    }

    .notification-title {
        @apply text-xl;
    }

    .notification-achievement-title {
        @apply text-lg;
    }

    .notification-animation {
        @apply scale-90;
    }
}

/* 状态样式 */
.achievement-error .achievement-animation-wrapper {
    @apply border-2 border-red-200 dark:border-red-600 rounded-lg p-2;
}

.achievement-with-info {
    @apply cursor-pointer;
}

.achievement-with-info:hover {
    @apply transform scale-105 transition-transform duration-300;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .achievement-notification-overlay {
        @apply bg-gray-900 bg-opacity-75;
    }
}
</style>
