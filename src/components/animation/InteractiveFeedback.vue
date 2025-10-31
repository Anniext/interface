<template>
    <div
        ref="container"
        class="interactive-feedback"
        :class="[
            `feedback-${type}`,
            { 'is-disabled': disabled, 'is-animating': isAnimating },
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        @click="handleClick"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd">
        <!-- 内容插槽 -->
        <div ref="content" class="feedback-content">
            <slot></slot>
        </div>

        <!-- 涟漪效果 -->
        <div
            v-if="showRipple"
            ref="rippleContainer"
            class="ripple-container"></div>

        <!-- 粒子效果容器 -->
        <div
            v-if="showParticles"
            ref="particleContainer"
            class="particle-container"></div>

        <!-- 发光效果 -->
        <div v-if="showGlow" ref="glowEffect" class="glow-effect"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

interface Props {
    /** 反馈类型 */
    type?: "button" | "card" | "icon" | "text";
    /** 是否禁用交互 */
    disabled?: boolean;
    /** 悬停缩放比例 */
    hoverScale?: number;
    /** 点击缩放比例 */
    clickScale?: number;
    /** 是否显示涟漪效果 */
    showRipple?: boolean;
    /** 是否显示粒子效果 */
    showParticles?: boolean;
    /** 是否显示发光效果 */
    showGlow?: boolean;
    /** 动画持续时间 */
    duration?: number;
    /** 悬停动画缓动函数 */
    hoverEase?: string;
    /** 点击动画缓动函数 */
    clickEase?: string;
    /** 涟漪颜色 */
    rippleColor?: string;
    /** 发光颜色 */
    glowColor?: string;
    /** 粒子颜色 */
    particleColor?: string;
}

interface Emits {
    (e: "hover", isHovering: boolean): void;
    (e: "click", event: MouseEvent): void;
    (e: "animationStart", type: string): void;
    (e: "animationComplete", type: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    type: "button",
    disabled: false,
    hoverScale: 1.05,
    clickScale: 0.95,
    showRipple: true,
    showParticles: false,
    showGlow: true,
    duration: 0.3,
    hoverEase: "power2.out",
    clickEase: "power2.out",
    rippleColor: "rgba(255, 255, 255, 0.3)",
    glowColor: "rgba(59, 130, 246, 0.5)",
    particleColor: "#3b82f6",
});

const emit = defineEmits<Emits>();

// 组件引用
const container = ref<HTMLElement>();
const content = ref<HTMLElement>();
const rippleContainer = ref<HTMLElement>();
const particleContainer = ref<HTMLElement>();
const glowEffect = ref<HTMLElement>();

// 状态管理
const isHovering = ref(false);
const isPressed = ref(false);
const isAnimating = ref(false);

// 动画时间轴
let hoverTimeline: gsap.core.Timeline | null = null;
let clickTimeline: gsap.core.Timeline | null = null;

/**
 * 创建涟漪效果
 */
function createRipple(event: MouseEvent | TouchEvent): void {
    if (!rippleContainer.value || props.disabled) return;

    const rect = container.value!.getBoundingClientRect();
    const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 创建涟漪元素
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background-color: ${props.rippleColor};
        pointer-events: none;
        transform: translate(-50%, -50%);
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
    `;

    rippleContainer.value.appendChild(ripple);

    // 计算涟漪最大尺寸
    const maxSize = Math.max(rect.width, rect.height) * 2;

    // 涟漪动画
    gsap.to(ripple, {
        width: maxSize,
        height: maxSize,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
            ripple.remove();
        },
    });
}

/**
 * 创建粒子效果
 */
function createParticles(): void {
    if (!particleContainer.value || props.disabled) return;

    const particleCount = 8;
    const particles: HTMLElement[] = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: ${props.particleColor};
            border-radius: 50%;
            pointer-events: none;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;

        particleContainer.value.appendChild(particle);
        particles.push(particle);

        // 随机方向和距离
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        // 粒子动画
        gsap.to(particle, {
            x,
            y,
            opacity: 0,
            scale: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: Math.random() * 0.1,
            onComplete: () => {
                particle.remove();
            },
        });
    }
}

/**
 * 悬停进入动画
 */
function animateHoverIn(): void {
    if (props.disabled || isHovering.value) return;

    isHovering.value = true;
    emit("hover", true);
    emit("animationStart", "hover");

    // 清理之前的动画
    if (hoverTimeline) {
        hoverTimeline.kill();
    }

    hoverTimeline = gsap.timeline({
        onComplete: () => {
            emit("animationComplete", "hover");
        },
    });

    // 缩放动画
    hoverTimeline.to(content.value, {
        scale: props.hoverScale,
        duration: props.duration,
        ease: props.hoverEase,
    });

    // 发光效果
    if (props.showGlow && glowEffect.value) {
        hoverTimeline.to(
            glowEffect.value,
            {
                opacity: 1,
                scale: 1.1,
                duration: props.duration,
                ease: props.hoverEase,
            },
            0,
        );
    }

    // 容器阴影效果
    hoverTimeline.to(
        container.value,
        {
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            duration: props.duration,
            ease: props.hoverEase,
        },
        0,
    );
}

/**
 * 悬停离开动画
 */
function animateHoverOut(): void {
    if (props.disabled || !isHovering.value) return;

    isHovering.value = false;
    emit("hover", false);

    // 清理之前的动画
    if (hoverTimeline) {
        hoverTimeline.kill();
    }

    hoverTimeline = gsap.timeline();

    // 恢复缩放
    hoverTimeline.to(content.value, {
        scale: 1,
        duration: props.duration,
        ease: props.hoverEase,
    });

    // 隐藏发光效果
    if (props.showGlow && glowEffect.value) {
        hoverTimeline.to(
            glowEffect.value,
            {
                opacity: 0,
                scale: 1,
                duration: props.duration,
                ease: props.hoverEase,
            },
            0,
        );
    }

    // 恢复阴影
    hoverTimeline.to(
        container.value,
        {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            duration: props.duration,
            ease: props.hoverEase,
        },
        0,
    );
}

/**
 * 点击按下动画
 */
function animateClickDown(): void {
    if (props.disabled) return;

    isPressed.value = true;
    isAnimating.value = true;
    emit("animationStart", "click");

    // 清理之前的动画
    if (clickTimeline) {
        clickTimeline.kill();
    }

    clickTimeline = gsap.timeline();

    // 按下缩放动画
    clickTimeline.to(content.value, {
        scale: props.clickScale,
        duration: props.duration * 0.5,
        ease: props.clickEase,
    });
}

/**
 * 点击释放动画
 */
function animateClickUp(): void {
    if (props.disabled) return;

    isPressed.value = false;

    // 恢复缩放
    if (clickTimeline) {
        clickTimeline.to(content.value, {
            scale: isHovering.value ? props.hoverScale : 1,
            duration: props.duration * 0.5,
            ease: props.clickEase,
            onComplete: () => {
                isAnimating.value = false;
                emit("animationComplete", "click");
            },
        });
    }
}

// 事件处理函数
function handleMouseEnter(): void {
    animateHoverIn();
}

function handleMouseLeave(): void {
    animateHoverOut();
}

function handleMouseDown(event: MouseEvent): void {
    animateClickDown();
    if (props.showRipple) {
        createRipple(event);
    }
}

function handleMouseUp(): void {
    animateClickUp();
}

function handleClick(event: MouseEvent): void {
    if (!props.disabled) {
        emit("click", event);
        if (props.showParticles) {
            createParticles();
        }
    }
}

function handleTouchStart(event: TouchEvent): void {
    if (props.showRipple) {
        createRipple(event);
    }
    animateClickDown();
}

function handleTouchEnd(): void {
    animateClickUp();
}

// 生命周期
onMounted(() => {
    // 初始化样式
    if (container.value) {
        gsap.set(container.value, {
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        });
    }

    if (glowEffect.value) {
        gsap.set(glowEffect.value, {
            opacity: 0,
            scale: 1,
        });
    }
});

onBeforeUnmount(() => {
    // 清理动画
    if (hoverTimeline) {
        hoverTimeline.kill();
    }
    if (clickTimeline) {
        clickTimeline.kill();
    }
});

// 暴露方法给父组件
defineExpose({
    triggerHover: animateHoverIn,
    triggerClick: () => {
        animateClickDown();
        setTimeout(animateClickUp, 150);
    },
    isHovering: () => isHovering.value,
    isPressed: () => isPressed.value,
    isAnimating: () => isAnimating.value,
});
</script>

<style scoped>
.interactive-feedback {
    position: relative;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    transition: filter 0.2s ease;
}

.interactive-feedback.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
    filter: grayscale(0.5);
}

.interactive-feedback.is-disabled:hover {
    transform: none;
}

.feedback-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
}

.ripple-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
}

.particle-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 3;
}

.glow-effect {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: radial-gradient(circle, v-bind(glowColor) 0%, transparent 70%);
    border-radius: inherit;
    pointer-events: none;
    z-index: 0;
    opacity: 0;
}

/* 不同类型的样式 */
.feedback-button {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
}

.feedback-card {
    border-radius: 0.75rem;
    padding: 1rem;
}

.feedback-icon {
    border-radius: 50%;
    padding: 0.5rem;
}

.feedback-text {
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
}

/* 动画状态样式 */
.interactive-feedback.is-animating {
    pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .interactive-feedback {
        touch-action: manipulation;
    }
}

/* 无障碍访问 */
.interactive-feedback:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

.interactive-feedback:focus:not(:focus-visible) {
    outline: none;
}

/* 减少动画选项支持 */
@media (prefers-reduced-motion: reduce) {
    .interactive-feedback * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
