<template>
    <div
        ref="cardContainer"
        class="card-expand-container"
        :class="{ 'is-expanded': isExpanded, 'is-animating': isAnimating }"
        @click="handleClick">
        <!-- 卡片头部 -->
        <div ref="cardHeader" class="card-header">
            <slot name="header" />
            <div
                v-if="showExpandIcon"
                class="expand-icon"
                :class="{ 'is-expanded': isExpanded }">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">
                    <polyline points="6,9 12,15 18,9" />
                </svg>
            </div>
        </div>

        <!-- 可展开内容 -->
        <div ref="cardContent" class="card-content">
            <div ref="contentInner" class="card-content-inner">
                <slot name="content" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";

interface Props {
    /** 初始展开状态 */
    initialExpanded?: boolean;
    /** 展开动画持续时间 */
    duration?: number;
    /** 是否显示展开图标 */
    showExpandIcon?: boolean;
    /** 展开触发方式 */
    trigger?: "click" | "hover" | "manual";
    /** 动画缓动函数 */
    ease?: string;
    /** 最大高度（展开时） */
    maxHeight?: string;
}

interface Emits {
    (e: "expand", isExpanded: boolean): void;
    (e: "expandStart"): void;
    (e: "expandComplete"): void;
}

const props = withDefaults(defineProps<Props>(), {
    initialExpanded: false,
    duration: 0.4,
    showExpandIcon: true,
    trigger: "click",
    ease: "power2.out",
    maxHeight: "auto",
});

const emit = defineEmits<Emits>();

// 组件引用
const cardContainer = ref<HTMLElement>();
const cardHeader = ref<HTMLElement>();
const cardContent = ref<HTMLElement>();
const contentInner = ref<HTMLElement>();

// 状态管理
const isExpanded = ref(props.initialExpanded);
const isAnimating = ref(false);
const contentHeight = ref(0);

/**
 * 初始化卡片样式
 */
function initializeCard(): void {
    if (!cardContent.value || !contentInner.value) return;

    // 测量内容高度
    measureContentHeight();

    // 设置初始状态
    if (props.initialExpanded) {
        gsap.set(cardContent.value, {
            height: contentHeight.value,
            opacity: 1,
        });
    } else {
        gsap.set(cardContent.value, {
            height: 0,
            opacity: 0,
            overflow: "hidden",
        });
    }
}

/**
 * 测量内容高度
 */
function measureContentHeight(): void {
    if (!contentInner.value) return;

    // 临时显示内容以测量高度
    const content = cardContent.value!;
    const originalHeight = content.style.height;
    const originalOpacity = content.style.opacity;
    const originalOverflow = content.style.overflow;

    gsap.set(content, {
        height: "auto",
        opacity: 1,
        overflow: "visible",
    });

    contentHeight.value = contentInner.value.offsetHeight;

    // 恢复原始样式
    gsap.set(content, {
        height: originalHeight,
        opacity: originalOpacity,
        overflow: originalOverflow,
    });
}

/**
 * 执行展开/收起动画
 */
function performToggle(): void {
    if (!cardContent.value || isAnimating.value) return;

    isAnimating.value = true;
    emit("expandStart");

    const newExpandedState = !isExpanded.value;
    const targetHeight = newExpandedState ? contentHeight.value : 0;
    const targetOpacity = newExpandedState ? 1 : 0;

    // 重新测量内容高度（内容可能已变化）
    if (newExpandedState) {
        measureContentHeight();
    }

    // 创建展开/收起动画时间轴
    const tl = gsap.timeline({
        onComplete: () => {
            isExpanded.value = newExpandedState;
            isAnimating.value = false;
            emit("expand", isExpanded.value);
            emit("expandComplete");

            // 设置最终样式
            if (newExpandedState) {
                gsap.set(cardContent.value, {
                    height:
                        props.maxHeight === "auto" ? "auto" : props.maxHeight,
                    overflow: "visible",
                });
            } else {
                gsap.set(cardContent.value, {
                    overflow: "hidden",
                });
            }
        },
    });

    // 高度动画
    tl.to(cardContent.value, {
        height: targetHeight,
        duration: props.duration,
        ease: props.ease,
    });

    // 透明度动画（稍微延迟）
    tl.to(
        cardContent.value,
        {
            opacity: targetOpacity,
            duration: props.duration * 0.6,
            ease: props.ease,
        },
        newExpandedState ? "-=0.2" : "0",
    );

    // 展开图标旋转动画
    if (props.showExpandIcon) {
        const icon = cardContainer.value?.querySelector(".expand-icon");
        if (icon) {
            tl.to(
                icon,
                {
                    rotation: newExpandedState ? 180 : 0,
                    duration: props.duration,
                    ease: props.ease,
                },
                0,
            );
        }
    }
}

/**
 * 手动设置展开状态
 */
function setExpanded(expanded: boolean, animate: boolean = true): void {
    if (isExpanded.value === expanded) return;

    if (animate) {
        performToggle();
    } else {
        isExpanded.value = expanded;
        if (cardContent.value) {
            const height = expanded ? contentHeight.value : 0;
            const opacity = expanded ? 1 : 0;

            gsap.set(cardContent.value, {
                height,
                opacity,
                overflow: expanded ? "visible" : "hidden",
            });
        }

        // 设置图标状态
        if (props.showExpandIcon) {
            const icon = cardContainer.value?.querySelector(".expand-icon");
            if (icon) {
                gsap.set(icon, {
                    rotation: expanded ? 180 : 0,
                });
            }
        }

        emit("expand", isExpanded.value);
    }
}

/**
 * 点击事件处理
 */
function handleClick(): void {
    if (props.trigger === "click") {
        performToggle();
    }
}

/**
 * 更新内容高度
 */
function updateContentHeight(): void {
    measureContentHeight();
    if (isExpanded.value && cardContent.value) {
        gsap.set(cardContent.value, {
            height:
                props.maxHeight === "auto"
                    ? contentHeight.value
                    : props.maxHeight,
        });
    }
}

// 生命周期
onMounted(async () => {
    await nextTick();
    initializeCard();
});

onBeforeUnmount(() => {
    // 清理动画
    if (cardContainer.value) {
        gsap.killTweensOf(cardContainer.value);
    }
    if (cardContent.value) {
        gsap.killTweensOf(cardContent.value);
    }
});

// 暴露方法给父组件
defineExpose({
    toggle: performToggle,
    expand: () => setExpanded(true),
    collapse: () => setExpanded(false),
    setExpanded,
    updateContentHeight,
    isExpanded: () => isExpanded.value,
    isAnimating: () => isAnimating.value,
});
</script>

<style scoped>
.card-expand-container {
    position: relative;
    width: 100%;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
}

.card-expand-container:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
    position: relative;
    padding: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.2s ease;
}

.card-header:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s ease;
    flex-shrink: 0;
}

.expand-icon:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.expand-icon svg {
    transition: transform 0.2s ease;
}

.expand-icon.is-expanded svg {
    transform: rotate(180deg);
}

.card-content {
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.02);
}

.card-content-inner {
    padding: 0 1rem 1rem;
}

/* 动画状态样式 */
.card-expand-container.is-animating {
    pointer-events: none;
}

.card-expand-container.is-animating .card-header {
    pointer-events: none;
}

/* 展开状态样式 */
.card-expand-container.is-expanded .card-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 无图标模式 */
.card-expand-container.no-icon .card-header {
    justify-content: flex-start;
}

/* 手动触发模式 */
.card-expand-container.manual-trigger .card-header {
    cursor: default;
}

.card-expand-container.manual-trigger .card-header:hover {
    background-color: transparent;
}
</style>
