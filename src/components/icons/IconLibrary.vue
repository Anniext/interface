<!-- 图标库统一管理组件 -->
<template>
    <component
        :is="iconComponent"
        :name="name"
        :size="size"
        :color="color"
        :level="level"
        :clickable="clickable"
        :spinning="spinning"
        :aria-label="ariaLabel"
        @click="$emit('click', $event)" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "./SvgIcon.vue";
import TechStackIcons from "./TechStackIcons.vue";
import AchievementIcons from "./AchievementIcons.vue";
import type { AchievementLevel } from "@/types/achievements";

/** 图标库属性接口 */
interface IIconLibraryProps {
    /** 图标类型 */
    type: "tech" | "achievement" | "custom";
    /** 图标名称 */
    name: string;
    /** 图标尺寸 */
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
    /** 图标颜色 */
    color?: string;
    /** 成就等级（仅成就图标使用） */
    level?: AchievementLevel;
    /** 是否可点击 */
    clickable?: boolean;
    /** 是否旋转 */
    spinning?: boolean;
    /** 无障碍标签 */
    ariaLabel?: string;
}

/** 组件事件接口 */
interface IIconLibraryEmits {
    (e: "click", event: MouseEvent): void;
}

// 定义属性和事件
const props = withDefaults(defineProps<IIconLibraryProps>(), {
    type: "custom",
    size: "md",
    color: "currentColor",
    clickable: false,
    spinning: false,
});

const emit = defineEmits<IIconLibraryEmits>();

/** 根据类型选择对应的图标组件 */
const iconComponent = computed(() => {
    switch (props.type) {
        case "tech":
            return TechStackIcons;
        case "achievement":
            return AchievementIcons;
        case "custom":
        default:
            return SvgIcon;
    }
});
</script>
