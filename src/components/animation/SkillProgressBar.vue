<template>
    <div class="skill-progress-container">
        <!-- 技能信息 -->
        <div class="skill-info">
            <div class="skill-header">
                <span class="skill-name">{{ skillName }}</span>
                <span class="skill-level">{{ displayLevel }}</span>
            </div>
            <div v-if="showExperience" class="skill-experience">
                {{ experience }}年经验
            </div>
        </div>

        <!-- 进度条容器 -->
        <div
            ref="progressContainer"
            class="progress-bar-container"
            :class="{ 'is-animating': isAnimating }">
            <!-- 背景轨道 -->
            <div class="progress-track" :style="trackStyle">
                <!-- 进度条 -->
                <div
                    ref="progressBar"
                    class="progress-bar"
                    :class="progressBarClass"
                    :style="progressBarStyle">
                    <!-- 进度条内的光效 -->
                    <div v-if="showGlow" class="progress-glow"></div>

                    <!-- 进度条纹理 -->
                    <div v-if="showTexture" class="progress-texture"></div>
                </div>

                <!-- 进度指示器 -->
                <div
                    v-if="showIndicator"
                    ref="progressIndicator"
                    class="progress-indicator"
                    :style="indicatorStyle">
                    <div class="indicator-dot"></div>
                    <div class="indicator-pulse"></div>
                </div>
            </div>

            <!-- 进度标签 -->
            <div
                v-if="showProgressLabel"
                ref="progressLabel"
                class="progress-label"
                :style="labelStyle">
                {{ Math.round(currentProgress) }}%
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { gsap } from "gsap";

interface Props {
    /** 技能名称 */
    skillName: string;
    /** 技能等级 (0-100) */
    level: number;
    /** 技能经验年数 */
    experience?: number;
    /** 进度条颜色 */
    color?: string;
    /** 进度条渐变色 */
    gradient?: string[];
    /** 动画持续时间 */
    duration?: number;
    /** 动画延迟 */
    delay?: number;
    /** 是否显示发光效果 */
    showGlow?: boolean;
    /** 是否显示纹理 */
    showTexture?: boolean;
    /** 是否显示进度指示器 */
    showIndicator?: boolean;
    /** 是否显示进度标签 */
    showProgressLabel?: boolean;
    /** 是否显示经验年数 */
    showExperience?: boolean;
    /** 进度条高度 */
    height?: string;
    /** 进度条圆角 */
    borderRadius?: string;
    /** 动画缓动函数 */
    ease?: string;
    /** 是否自动开始动画 */
    autoStart?: boolean;
}

interface Emits {
    (e: "animationStart"): void;
    (e: "animationUpdate", progress: number): void;
    (e: "animationComplete"): void;
}

const props = withDefaults(defineProps<Props>(), {
    level: 0,
    experience: 0,
    color: "#3b82f6",
    gradient: () => ["#3b82f6", "#1d4ed8"],
    duration: 2,
    delay: 0,
    showGlow: true,
    showTexture: false,
    showIndicator: true,
    showProgressLabel: true,
    showExperience: true,
    height: "12px",
    borderRadius: "6px",
    ease: "power2.out",
    autoStart: true,
});

const emit = defineEmits<Emits>();

// 组件引用
const progressContainer = ref<HTMLElement>();
const progressBar = ref<HTMLElement>();
const progressIndicator = ref<HTMLElement>();
const progressLabel = ref<HTMLElement>();

// 状态管理
const currentProgress = ref(0);
const isAnimating = ref(false);
const animationTimeline = ref<gsap.core.Timeline>();

// 计算属性
const displayLevel = computed(() => {
    const level = props.level;
    if (level >= 90) return "专家";
    if (level >= 75) return "熟练";
    if (level >= 60) return "了解";
    return "入门";
});

// 进度条轨道样式
const trackStyle = computed(() => ({
    height: props.height,
    borderRadius: props.borderRadius,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
}));

const progressBarClass = computed(() => ({
    "has-glow": props.showGlow,
    "has-texture": props.showTexture,
}));

const progressBarStyle = computed(() => {
    const style: Record<string, string> = {
        height: "100%",
        borderRadius: props.borderRadius,
        width: "0%", // 初始宽度为0，通过动画改变
    };

    if (props.gradient.length > 1) {
        style.background = `linear-gradient(90deg, ${props.gradient.join(
            ", ",
        )})`;
    } else {
        style.backgroundColor = props.color;
    }

    return style;
});

// 进度指示器样式
const indicatorStyle = computed(() => ({
    left: "0%", // 初始位置，通过动画改变
}));

// 进度标签样式
const labelStyle = computed(() => ({
    left: "0%", // 初始位置，通过动画改变
}));

/**
 * 开始进度条动画
 */
function startAnimation(): void {
    if (isAnimating.value || !progressBar.value) return;

    isAnimating.value = true;
    emit("animationStart");

    // 创建动画时间轴
    const tl = gsap.timeline({
        delay: props.delay,
        onComplete: () => {
            isAnimating.value = false;
            emit("animationComplete");
        },
    });

    // 进度条宽度动画
    tl.to(progressBar.value, {
        width: `${props.level}%`,
        duration: props.duration,
        ease: props.ease,
        onUpdate: () => {
            const progress = gsap.getProperty(
                progressBar.value!,
                "width",
            ) as string;
            const numericProgress = parseFloat(progress);
            currentProgress.value = numericProgress;
            emit("animationUpdate", numericProgress);
        },
    });

    animationTimeline.value = tl;
}

/**
 * 重置动画
 */
function resetAnimation(): void {
    if (animationTimeline.value) {
        animationTimeline.value.kill();
    }

    currentProgress.value = 0;
    isAnimating.value = false;

    if (progressBar.value) {
        gsap.set(progressBar.value, { width: "0%" });
    }
}

// 监听level变化
watch(
    () => props.level,
    () => {
        if (props.autoStart) {
            resetAnimation();
            startAnimation();
        }
    },
);

// 生命周期
onMounted(() => {
    if (props.autoStart) {
        startAnimation();
    }
});

onBeforeUnmount(() => {
    if (animationTimeline.value) {
        animationTimeline.value.kill();
    }
});

// 暴露方法给父组件
defineExpose({
    start: startAnimation,
    reset: resetAnimation,
    currentProgress: () => currentProgress.value,
    isAnimating: () => isAnimating.value,
});
</script>

<style scoped>
.skill-progress-container {
    width: 100%;
    margin-bottom: 1rem;
}

.skill-info {
    margin-bottom: 0.5rem;
}

.skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
}

.skill-name {
    font-weight: 600;
    color: #ffffff;
}

.skill-level {
    font-size: 0.875rem;
    color: #9ca3af;
    font-weight: 500;
}

.skill-experience {
    font-size: 0.75rem;
    color: #6b7280;
}

.progress-bar-container {
    position: relative;
    width: 100%;
}

.progress-track {
    position: relative;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    overflow: hidden;
}

.progress-bar {
    position: relative;
    height: 100%;
    border-radius: inherit;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
}

.progress-bar.has-glow {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.progress-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
    );
    opacity: 0;
}

.progress-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.1) 2px,
        rgba(255, 255, 255, 0.1) 4px
    );
}

.progress-indicator {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}

.indicator-dot {
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(59, 130, 246, 0.8);
}

.indicator-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: rgba(59, 130, 246, 0.6);
    border-radius: 50%;
    opacity: 0;
}

.progress-label {
    position: absolute;
    top: -1.5rem;
    transform: translateX(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: #ffffff;
    background-color: rgba(0, 0, 0, 0.8);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    white-space: nowrap;
    opacity: 0;
}

.progress-label::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.8);
}

/* 动画状态样式 */
.progress-bar-container.is-animating .progress-bar {
    animation: progressShimmer 2s ease-in-out infinite;
}

@keyframes progressShimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

/* 响应式设计 */
@media (max-width: 640px) {
    .skill-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }

    .progress-label {
        font-size: 0.625rem;
        padding: 0.125rem 0.375rem;
    }
}
</style>
