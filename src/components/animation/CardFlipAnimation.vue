<template>
    <div
        ref="cardContainer"
        class="card-flip-container"
        :class="{ 'is-flipped': isFlipped }"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- 卡片前面 -->
        <div class="card-face card-front">
            <slot name="front"></slot>
        </div>

        <!-- 卡片背面 -->
        <div class="card-face card-back">
            <slot name="back"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { gsap } from "gsap";
import type { IAnimationManager } from "@/types/animation";

interface Props {
    /** 是否自动翻转 */
    autoFlip?: boolean;
    /** 翻转触发方式 */
    trigger?: "click" | "hover" | "manual";
    /** 翻转动画持续时间 */
    duration?: number;
    /** 翻转轴 */
    axis?: "x" | "y";
    /** 是否启用3D效果 */
    enable3D?: boolean;
    /** 初始翻转状态 */
    initialFlipped?: boolean;
}

interface Emits {
    (e: "flip", isFlipped: boolean): void;
    (e: "flipStart"): void;
    (e: "flipComplete"): void;
}

const props = withDefaults(defineProps<Props>(), {
    autoFlip: false,
    trigger: "click",
    duration: 0.6,
    axis: "y",
    enable3D: true,
    initialFlipped: false,
});

const emit = defineEmits<Emits>();

// 组件引用
const cardContainer = ref<HTMLElement>();

// 状态管理
const isFlipped = ref(props.initialFlipped);
const isAnimating = ref(false);

// 注入动画管理器
const animationManager = inject<IAnimationManager>("animationManager");

// 动画时间轴ID
const timelineId = `card-flip-${Math.random().toString(36).substr(2, 9)}`;

/**
 * 初始化卡片样式
 */
function initializeCard(): void {
    if (!cardContainer.value) return;

    const container = cardContainer.value;
    const front = container.querySelector(".card-front") as HTMLElement;
    const back = container.querySelector(".card-back") as HTMLElement;

    if (!front || !back) return;

    // 设置3D变换样式
    gsap.set(container, {
        perspective: props.enable3D ? 1000 : "none",
        transformStyle: "preserve-3d",
    });

    gsap.set([front, back], {
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
    });

    // 设置背面初始旋转
    const backRotation =
        props.axis === "x" ? "rotateX(180deg)" : "rotateY(180deg)";
    gsap.set(back, {
        transform: backRotation,
    });

    // 如果初始状态是翻转的，设置容器旋转
    if (props.initialFlipped) {
        const containerRotation =
            props.axis === "x" ? "rotateX(180deg)" : "rotateY(180deg)";
        gsap.set(container, {
            transform: containerRotation,
        });
    }
}

/**
 * 执行翻转动画
 */
function performFlip(): void {
    if (!cardContainer.value || isAnimating.value) return;

    isAnimating.value = true;
    emit("flipStart");

    const container = cardContainer.value;
    const newFlippedState = !isFlipped.value;

    // 计算目标旋转角度
    const targetRotation = newFlippedState
        ? props.axis === "x"
            ? 180
            : 180
        : 0;

    const rotationProperty = props.axis === "x" ? "rotationX" : "rotationY";

    // 创建翻转动画
    gsap.to(container, {
        [rotationProperty]: targetRotation,
        duration: props.duration,
        ease: "power2.inOut",
        onComplete: () => {
            isFlipped.value = newFlippedState;
            isAnimating.value = false;
            emit("flip", isFlipped.value);
            emit("flipComplete");
        },
    });
}

/**
 * 手动设置翻转状态
 */
function setFlipped(flipped: boolean, animate: boolean = true): void {
    if (isFlipped.value === flipped) return;

    if (animate) {
        performFlip();
    } else {
        isFlipped.value = flipped;
        if (cardContainer.value) {
            const rotation = flipped ? (props.axis === "x" ? 180 : 180) : 0;
            const rotationProperty =
                props.axis === "x" ? "rotationX" : "rotationY";

            gsap.set(cardContainer.value, {
                [rotationProperty]: rotation,
            });
        }
        emit("flip", isFlipped.value);
    }
}

/**
 * 点击事件处理
 */
function handleClick(): void {
    if (props.trigger === "click") {
        performFlip();
    }
}

/**
 * 鼠标进入事件处理
 */
function handleMouseEnter(): void {
    if (props.trigger === "hover" && !isFlipped.value) {
        performFlip();
    }
}

/**
 * 鼠标离开事件处理
 */
function handleMouseLeave(): void {
    if (props.trigger === "hover" && isFlipped.value) {
        performFlip();
    }
}

// 生命周期
onMounted(() => {
    initializeCard();

    // 自动翻转
    if (props.autoFlip) {
        const interval = setInterval(() => {
            if (!isAnimating.value) {
                performFlip();
            }
        }, 3000);

        onBeforeUnmount(() => {
            clearInterval(interval);
        });
    }
});

onBeforeUnmount(() => {
    // 清理动画
    if (cardContainer.value) {
        gsap.killTweensOf(cardContainer.value);
    }
});

// 暴露方法给父组件
defineExpose({
    flip: performFlip,
    setFlipped,
    isFlipped: () => isFlipped.value,
    isAnimating: () => isAnimating.value,
});
</script>

<style scoped>
.card-flip-container {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.1s ease;
}

.card-flip-container:hover {
    transform: scale(1.02);
}

.card-face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: inherit;
    overflow: hidden;
}

.card-front {
    z-index: 2;
}

.card-back {
    z-index: 1;
}

/* 禁用翻转时的样式 */
.card-flip-container.no-flip {
    cursor: default;
}

.card-flip-container.no-flip:hover {
    transform: none;
}

/* 动画状态样式 */
.card-flip-container.is-animating {
    pointer-events: none;
}

/* 3D效果增强 */
.card-flip-container.enable-3d {
    perspective: 1000px;
}

.card-flip-container.enable-3d .card-face {
    transform-style: preserve-3d;
}
</style>
