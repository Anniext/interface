<!-- 奖项和成就图标组件 -->
<template>
    <SvgIcon
        :size="size"
        :color="iconColor"
        :clickable="clickable"
        :spinning="spinning"
        :aria-label="ariaLabel"
        @click="$emit('click', $event)">
        <!-- 奖杯图标 -->
        <g v-if="name === 'trophy'">
            <path
                d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h1a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1v2a3 3 0 0 1-3 3h-2v2h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-2h-2a3 3 0 0 1-3-3V11H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h2zM5 6a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1V6H5zm14 0v3h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1zM9 3v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3H9z"
                fill="currentColor" />
        </g>

        <!-- 奖牌图标 -->
        <g v-else-if="name === 'medal'">
            <circle
                cx="12"
                cy="8"
                r="6"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            <path d="M15 13l-3-3-3 3v8l3-2 3 2v-8z" fill="currentColor" />
            <circle cx="12" cy="8" r="2" fill="currentColor" />
        </g>

        <!-- 星星图标 -->
        <g v-else-if="name === 'star'">
            <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor" />
        </g>

        <!-- 证书图标 -->
        <g v-else-if="name === 'certificate'">
            <rect
                x="3"
                y="4"
                width="18"
                height="12"
                rx="2"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            <path d="M8 10h8M8 12h6" stroke="currentColor" stroke-width="2" />
            <path
                d="M15 16l2 2 4-4"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
        </g>

        <!-- 奖项图标 -->
        <g v-else-if="name === 'award'">
            <circle
                cx="12"
                cy="8"
                r="7"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            <path
                d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            <circle cx="12" cy="8" r="3" fill="currentColor" />
        </g>

        <!-- 徽章图标 -->
        <g v-else-if="name === 'badge'">
            <path
                d="M12 2L8 6H3v5l4 4-4 4v5h5l4 4 4-4h5v-5l-4-4 4-4V6h-5l-4-4z"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
        </g>

        <!-- 皇冠图标 -->
        <g v-else-if="name === 'crown'">
            <path
                d="M2 18h20l-2-12-4 6-4-9-4 9-4-6-2 12z"
                stroke="currentColor"
                stroke-width="2"
                fill="currentColor"
                fill-opacity="0.3" />
            <circle cx="6" cy="6" r="2" fill="currentColor" />
            <circle cx="12" cy="3" r="2" fill="currentColor" />
            <circle cx="18" cy="6" r="2" fill="currentColor" />
        </g>

        <!-- 默认图标 -->
        <g v-else>
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="2"
                fill="none" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" />
        </g>
    </SvgIcon>
</template>
<script setup lang="ts">
import SvgIcon from "./SvgIcon.vue";
import { computed } from "vue";
import type { AchievementLevel } from "@/types/achievements";

/** 成就图标属性接口 */
interface IAchievementIconProps {
    /** 图标名称 */
    name: string;
    /** 图标尺寸 */
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
    /** 图标颜色 */
    color?: string;
    /** 成就等级 */
    level?: AchievementLevel;
    /** 是否可点击 */
    clickable?: boolean;
    /** 是否旋转 */
    spinning?: boolean;
    /** 无障碍标签 */
    ariaLabel?: string;
}

/** 组件事件接口 */
interface IAchievementIconEmits {
    (e: "click", event: MouseEvent): void;
}

// 定义属性和事件
const props = withDefaults(defineProps<IAchievementIconProps>(), {
    size: "md",
    color: "currentColor",
    clickable: false,
    spinning: false,
});

const emit = defineEmits<IAchievementIconEmits>();

/** 成就等级颜色映射 */
const LEVEL_COLORS = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    special: "#9932CC",
} as const;

/** 图标类型颜色映射 */
const ICON_COLORS = {
    trophy: "#FFD700",
    medal: "#FF6B35",
    star: "#FFC107",
    certificate: "#4ECDC4",
    award: "#45B7D1",
    badge: "#96CEB4",
    crown: "#FFD700",
} as const;

/** 计算图标颜色 */
const iconColor = computed(() => {
    if (props.color !== "currentColor") {
        return props.color;
    }

    // 优先使用等级颜色
    if (props.level && LEVEL_COLORS[props.level]) {
        return LEVEL_COLORS[props.level];
    }

    // 其次使用图标类型颜色
    if (ICON_COLORS[props.name as keyof typeof ICON_COLORS]) {
        return ICON_COLORS[props.name as keyof typeof ICON_COLORS];
    }

    return props.color;
});

/** 计算无障碍标签 */
const ariaLabel = computed(() => {
    if (props.ariaLabel) {
        return props.ariaLabel;
    }

    const levelText = props.level ? `${props.level}级` : "";
    return `${levelText}${props.name}成就图标`;
});
</script>

<style scoped>
/* 成就图标特定样式 */
.achievement-icon {
    @apply transition-all duration-300;
}

.achievement-icon:hover {
    @apply drop-shadow-lg scale-110;
}

/* 等级特效 */
.achievement-icon--gold {
    @apply drop-shadow-[0_0_10px_rgba(255,215,0,0.5)];
}

.achievement-icon--silver {
    @apply drop-shadow-[0_0_8px_rgba(192,192,192,0.5)];
}

.achievement-icon--bronze {
    @apply drop-shadow-[0_0_6px_rgba(205,127,50,0.5)];
}

.achievement-icon--special {
    @apply drop-shadow-[0_0_12px_rgba(153,50,204,0.5)];
}
</style>
