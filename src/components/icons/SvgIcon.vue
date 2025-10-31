<!-- SVG 图标基础组件 -->
<template>
    <svg
        :class="[
            'svg-icon',
            sizeClasses,
            {
                'svg-icon--clickable': clickable,
                'svg-icon--spinning': spinning,
            },
        ]"
        :style="iconStyles"
        :viewBox="viewBox"
        :width="actualSize"
        :height="actualSize"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        :role="role"
        :aria-label="ariaLabel || name"
        :aria-hidden="ariaHidden"
        @click="handleClick">
        <!-- 动态渲染图标内容 -->
        <component :is="iconComponent" v-if="iconComponent" />
        <!-- 备用插槽 -->
        <slot v-else />
    </svg>
</template>

<script setup lang="ts">
import { computed, h, type CSSProperties } from "vue";

/** SVG 图标组件属性接口 */
interface ISvgIconProps {
    /** 图标名称 */
    name?: string;
    /** 图标尺寸 */
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
    /** 图标颜色 */
    color?: string;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 边框颜色 */
    borderColor?: string;
    /** 视图框 */
    viewBox?: string;
    /** 是否可点击 */
    clickable?: boolean;
    /** 是否旋转 */
    spinning?: boolean;
    /** 无障碍角色 */
    role?: string;
    /** 无障碍标签 */
    ariaLabel?: string;
    /** 是否对屏幕阅读器隐藏 */
    ariaHidden?: boolean;
    /** 自定义类名 */
    customClass?: string;
}

/** 组件事件接口 */
interface ISvgIconEmits {
    (e: "click", event: MouseEvent): void;
}

// 定义属性和事件
const props = withDefaults(defineProps<ISvgIconProps>(), {
    name: "",
    size: "md",
    color: "currentColor",
    viewBox: "0 0 24 24",
    clickable: false,
    spinning: false,
    role: "img",
    ariaHidden: false,
});

const emit = defineEmits<ISvgIconEmits>();

/** 尺寸映射 */
const SIZE_MAP = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    "2xl": 48,
} as const;

/** 计算实际尺寸 */
const actualSize = computed(() => {
    if (typeof props.size === "number") {
        return props.size;
    }
    return SIZE_MAP[props.size];
});

/** 尺寸类名 */
const sizeClasses = computed(() => {
    if (typeof props.size === "number") {
        return "";
    }
    return `svg-icon--${props.size}`;
});

/** 图标组件 */
const iconComponent = computed(() => {
    if (!props.name) return null;

    // 这里可以根据图标名称返回对应的 SVG 内容
    // 为了简化，我们返回一些基础图标的 SVG 路径
    const iconPaths: Record<string, string> = {
        // 基础图标
        star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
        trophy: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18m-7 13v4m-5 0h10M8 9l4-7 4 7-4 2-4-2z",
        medal: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.61 2.14a2 2 0 0 1 .13 2.2L16.79 15M11 12L5.12 2.2M13 12l5.88-9.8M8 7h8M12 17v5M8 22h8",
        code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
        database:
            "M4 6v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M4 6v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6",
        server: "M6 10H4a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 10l6 6 6-6M6 10l6-6 6 6",
        globe: "M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9",
        smartphone:
            "M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
        gamepad:
            "M6 12h4m-2-2v4m8-4h.01M16 16h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
        monitor:
            "M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8 21h8",
        brain: "M9.5 2A2.5 2.5 0 0 0 7 4.5v.55a2.5 2.5 0 0 0-2 2.45v.55A2.5 2.5 0 0 0 2.5 10H2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h.5A2.5 2.5 0 0 0 5 18.5v.55a2.5 2.5 0 0 0 2 2.45v.55A2.5 2.5 0 0 0 9.5 24h5a2.5 2.5 0 0 0 2.5-2.45v-.55a2.5 2.5 0 0 0 2-2.45v-.55A2.5 2.5 0 0 0 21.5 16H22a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-.5A2.5 2.5 0 0 0 19 7.5v-.55a2.5 2.5 0 0 0-2-2.45V4.5A2.5 2.5 0 0 0 14.5 2h-5z",
        play: "M8 5v14l11-7z",
        pause: "M6 4h4v16H6zM14 4h4v16h-4z",
        refresh:
            "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15",
        unlock: "M7 11V7a5 5 0 0 1 9.9-1M15 21H9a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z",
        certificate:
            "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
        badge: "M8.21 13.89L7 23l5-3 5 3-1.21-9.12L21 9l-9-1L8 2 5 9l-9 1 5.21 4.89z",
        lightbulb:
            "M9 21h6M12 3a6 6 0 0 0-6 6c0 1 .2 2 .6 2.8L9 15h6l2.4-3.2c.4-.8.6-1.8.6-2.8a6 6 0 0 0-6-6z",
    };

    const path = iconPaths[props.name];
    if (!path) return null;

    // 返回一个简单的函数组件
    return () =>
        h("path", {
            d: path,
            fill: props.color === "currentColor" ? "currentColor" : "none",
            stroke: props.color === "currentColor" ? "none" : props.color,
            "stroke-width": props.color === "currentColor" ? 0 : 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
        });
});

/** 图标样式 */
const iconStyles = computed((): CSSProperties => {
    const styles: CSSProperties = {
        color: props.color,
    };

    if (props.backgroundColor) {
        styles.backgroundColor = props.backgroundColor;
    }

    if (props.borderColor) {
        styles.border = `1px solid ${props.borderColor}`;
    }

    if (typeof props.size === "number") {
        styles.width = `${props.size}px`;
        styles.height = `${props.size}px`;
    }

    return styles;
});

/** 处理点击事件 */
const handleClick = (event: MouseEvent) => {
    if (props.clickable) {
        emit("click", event);
    }
};
</script>

<style scoped>
.svg-icon {
    @apply inline-block shrink-0 transition-all duration-200;
}

/* 尺寸类 */
.svg-icon--xs {
    @apply w-3 h-3;
}

.svg-icon--sm {
    @apply w-4 h-4;
}

.svg-icon--md {
    @apply w-5 h-5;
}

.svg-icon--lg {
    @apply w-6 h-6;
}

.svg-icon--xl {
    @apply w-8 h-8;
}

.svg-icon--2xl {
    @apply w-12 h-12;
}

/* 可点击状态 */
.svg-icon--clickable {
    @apply cursor-pointer hover:scale-110 active:scale-95;
}

/* 旋转动画 */
.svg-icon--spinning {
    @apply animate-spin;
}

/* 悬停效果 */
.svg-icon:hover {
    @apply drop-shadow-sm;
}

/* 焦点状态 */
.svg-icon:focus {
    @apply outline-none ring-2 ring-blue-500 ring-opacity-50 rounded;
}
</style>
