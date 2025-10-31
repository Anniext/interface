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
        :aria-label="ariaLabel"
        :aria-hidden="ariaHidden"
        @click="handleClick">
        <slot />
    </svg>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from "vue";

/** SVG 图标组件属性接口 */
interface ISvgIconProps {
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
