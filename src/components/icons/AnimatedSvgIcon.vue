<!-- 带动画效果的 SVG 图标组件 -->
<template>
    <div
        ref="iconContainer"
        class="animated-svg-icon"
        :class="[
            `animated-svg-icon--${animationType}`,
            {
                'animated-svg-icon--playing': isPlaying,
                'animated-svg-icon--paused': isPaused,
            },
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="handleClick">
        <SvgIcon
            ref="svgIcon"
            :size="size"
            :color="color"
            :clickable="clickable"
            :spinning="spinning"
            :aria-label="ariaLabel">
            <slot></slot>
        </SvgIcon>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { gsap } from "gsap";
import SvgIcon from "./SvgIcon.vue";
import type { IconSize } from "@/types/icons";

/** 动画类型 */
type AnimationType =
    | "hover"
    | "pulse"
    | "bounce"
    | "rotate"
    | "scale"
    | "path-draw"
    | "morph";

/** 动画配置接口 */
interface IAnimationConfig {
    duration?: number;
    ease?: string;
    repeat?: number;
    yoyo?: boolean;
    delay?: number;
}

/** 组件属性接口 */
interface IAnimatedSvgIconProps {
    /** 图标尺寸 */
    size?: IconSize;
    /** 图标颜色 */
    color?: string;
    /** 是否可点击 */
    clickable?: boolean;
    /** 是否旋转 */
    spinning?: boolean;
    /** 无障碍标签 */
    ariaLabel?: string;
    /** 动画类型 */
    animationType?: AnimationType;
    /** 动画配置 */
    animationConfig?: IAnimationConfig;
    /** 是否自动播放 */
    autoPlay?: boolean;
    /** 是否在悬停时播放 */
    playOnHover?: boolean;
}

/** 组件事件接口 */
interface IAnimatedSvgIconEmits {
    (e: "click", event: MouseEvent): void;
    (e: "animation-start"): void;
    (e: "animation-complete"): void;
    (e: "animation-pause"): void;
    (e: "animation-resume"): void;
}

// 定义属性和事件
const props = withDefaults(defineProps<IAnimatedSvgIconProps>(), {
    size: "md",
    color: "currentColor",
    clickable: false,
    spinning: false,
    animationType: "hover",
    autoPlay: false,
    playOnHover: true,
});

const emit = defineEmits<IAnimatedSvgIconEmits>();

// 组件引用
const iconContainer = ref<HTMLElement>();
const svgIcon = ref<InstanceType<typeof SvgIcon>>();

// 动画状态
const isPlaying = ref(false);
const isPaused = ref(false);
const timeline = ref<gsap.core.Timeline>();

/** 默认动画配置 */
const DEFAULT_ANIMATION_CONFIGS: Record<AnimationType, IAnimationConfig> = {
    hover: {
        duration: 0.3,
        ease: "power2.out",
    },
    pulse: {
        duration: 1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
    },
    bounce: {
        duration: 0.6,
        ease: "bounce.out",
    },
    rotate: {
        duration: 1,
        ease: "none",
        repeat: -1,
    },
    scale: {
        duration: 0.5,
        ease: "back.out(1.7)",
    },
    "path-draw": {
        duration: 2,
        ease: "power2.inOut",
    },
    morph: {
        duration: 1,
        ease: "power2.inOut",
    },
};

/** 获取动画配置 */
const getAnimationConfig = (): IAnimationConfig => {
    const defaultConfig = DEFAULT_ANIMATION_CONFIGS[props.animationType];
    return { ...defaultConfig, ...props.animationConfig };
};

/** 创建悬停动画 */
const createHoverAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    tl.to(iconContainer.value, {
        scale: 1.1,
        duration: config.duration,
        ease: config.ease,
    });

    return tl;
};

/** 创建脉冲动画 */
const createPulseAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    tl.to(iconContainer.value, {
        scale: 1.2,
        opacity: 0.8,
        duration: config.duration,
        ease: config.ease,
        repeat: config.repeat,
        yoyo: config.yoyo,
    });

    return tl;
};

/** 创建弹跳动画 */
const createBounceAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    tl.to(iconContainer.value, {
        y: -20,
        duration: config.duration,
        ease: config.ease,
    }).to(iconContainer.value, {
        y: 0,
        duration: config.duration! * 0.5,
        ease: "bounce.out",
    });

    return tl;
};

/** 创建旋转动画 */
const createRotateAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    tl.to(iconContainer.value, {
        rotation: 360,
        duration: config.duration,
        ease: config.ease,
        repeat: config.repeat,
    });

    return tl;
};

/** 创建缩放动画 */
const createScaleAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
        iconContainer.value,
        { scale: 0 },
        {
            scale: 1,
            duration: config.duration,
            ease: config.ease,
        },
    );

    return tl;
};

/** 创建路径描边动画 */
const createPathDrawAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    // 查找 SVG 路径元素
    const paths = iconContainer.value?.querySelectorAll("path");
    if (paths) {
        paths.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
            });

            tl.to(
                path,
                {
                    strokeDashoffset: 0,
                    duration: config.duration,
                    ease: config.ease,
                },
                0,
            );
        });
    }

    return tl;
};

/** 创建变形动画 */
const createMorphAnimation = () => {
    const config = getAnimationConfig();
    const tl = gsap.timeline({ paused: true });

    tl.to(iconContainer.value, {
        scaleX: 1.2,
        scaleY: 0.8,
        duration: config.duration! * 0.5,
        ease: config.ease,
    }).to(iconContainer.value, {
        scaleX: 1,
        scaleY: 1,
        duration: config.duration! * 0.5,
        ease: config.ease,
    });

    return tl;
};

/** 创建动画时间轴 */
const createAnimation = (): gsap.core.Timeline => {
    switch (props.animationType) {
        case "hover":
            return createHoverAnimation();
        case "pulse":
            return createPulseAnimation();
        case "bounce":
            return createBounceAnimation();
        case "rotate":
            return createRotateAnimation();
        case "scale":
            return createScaleAnimation();
        case "path-draw":
            return createPathDrawAnimation();
        case "morph":
            return createMorphAnimation();
        default:
            return createHoverAnimation();
    }
};

/** 播放动画 */
const playAnimation = () => {
    if (timeline.value && !isPlaying.value) {
        timeline.value.play();
        isPlaying.value = true;
        isPaused.value = false;
        emit("animation-start");
    }
};

/** 暂停动画 */
const pauseAnimation = () => {
    if (timeline.value && isPlaying.value) {
        timeline.value.pause();
        isPaused.value = true;
        emit("animation-pause");
    }
};

/** 恢复动画 */
const resumeAnimation = () => {
    if (timeline.value && isPaused.value) {
        timeline.value.resume();
        isPaused.value = false;
        emit("animation-resume");
    }
};

/** 重置动画 */
const resetAnimation = () => {
    if (timeline.value) {
        timeline.value.restart();
        isPlaying.value = false;
        isPaused.value = false;
    }
};

/** 处理鼠标进入事件 */
const handleMouseEnter = () => {
    if (props.playOnHover && props.animationType === "hover") {
        playAnimation();
    }
};

/** 处理鼠标离开事件 */
const handleMouseLeave = () => {
    if (props.playOnHover && props.animationType === "hover") {
        timeline.value?.reverse();
    }
};

/** 处理点击事件 */
const handleClick = (event: MouseEvent) => {
    if (props.clickable) {
        if (props.animationType !== "hover") {
            playAnimation();
        }
        emit("click", event);
    }
};

// 监听动画类型变化
watch(
    () => props.animationType,
    () => {
        if (timeline.value) {
            timeline.value.kill();
        }
        timeline.value = createAnimation();

        if (props.autoPlay) {
            playAnimation();
        }
    },
);

// 组件挂载时初始化动画
onMounted(() => {
    timeline.value = createAnimation();

    // 监听动画完成事件
    timeline.value.eventCallback("onComplete", () => {
        isPlaying.value = false;
        emit("animation-complete");
    });

    if (props.autoPlay) {
        playAnimation();
    }
});

// 组件卸载时清理动画
onUnmounted(() => {
    if (timeline.value) {
        timeline.value.kill();
    }
});

// 暴露方法给父组件
defineExpose({
    playAnimation,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
});
</script>
<style scoped>
.animated-svg-icon {
    @apply inline-block cursor-pointer;
    transform-origin: center;
}

/* 动画类型样式 */
.animated-svg-icon--hover {
    @apply transition-transform duration-300;
}

.animated-svg-icon--pulse {
    @apply animate-pulse;
}

.animated-svg-icon--bounce {
    @apply transition-transform duration-300;
}

.animated-svg-icon--rotate {
    @apply transition-transform duration-1000;
}

.animated-svg-icon--scale {
    @apply transition-transform duration-500;
}

.animated-svg-icon--path-draw {
    @apply transition-all duration-1000;
}

.animated-svg-icon--morph {
    @apply transition-transform duration-500;
}

/* 动画状态样式 */
.animated-svg-icon--playing {
    @apply pointer-events-none;
}

.animated-svg-icon--paused {
    @apply opacity-75;
}

/* 悬停效果 */
.animated-svg-icon:hover {
    @apply drop-shadow-lg;
}

/* 焦点状态 */
.animated-svg-icon:focus {
    @apply outline-none ring-2 ring-blue-500 ring-opacity-50 rounded;
}
</style>
