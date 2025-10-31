// 图标组件导出索引

export { default as SvgIcon } from "./SvgIcon.vue";
export { default as TechStackIcons } from "./TechStackIcons.vue";
export { default as AchievementIcons } from "./AchievementIcons.vue";
export { default as IconLibrary } from "./IconLibrary.vue";
export { default as AnimatedSvgIcon } from "./AnimatedSvgIcon.vue";
export { default as DecorativeSvg } from "./DecorativeSvg.vue";
export { default as IconAnimationDemo } from "./IconAnimationDemo.vue";
export { default as DecorativeShowcase } from "./DecorativeShowcase.vue";

// 导出图标相关类型
export type {
    IconSize,
    IconType,
    TechIconName,
    AchievementIconName,
    IBaseIconProps,
    ISvgIconProps,
    ITechIconProps,
    IAchievementIconProps,
    IIconConfig,
    IIconLibraryConfig,
    IIconAnimationConfig,
} from "@/types/icons";

// 导出图标配置工具
export {
    TECH_ICON_CONFIG,
    ACHIEVEMENT_ICON_CONFIG,
    ICON_LIBRARY_CONFIG,
    ICON_ANIMATION_CONFIG,
    getTechIconConfig,
    getAchievementIconConfig,
    searchIconsByTag,
    getAllIconTags,
} from "@/utils/icon-config";
// 导出装饰元素配置工具
export {
    ALL_DECORATIVE_PRESETS,
    BACKGROUND_PATTERN_PRESETS,
    DIVIDER_PRESETS,
    BORDER_PRESETS,
    GEOMETRIC_PRESETS,
    LOGO_PRESETS,
    THEME_COLORS,
    DECORATION_ANIMATIONS,
    getDecorativePreset,
    getAllPresetNames,
    createCustomPreset,
    getThemeColor,
    createGradient,
    getAnimationConfig,
} from "@/utils/decorative-presets";

// 导出 SVG 动画工具
export {
    createPathDrawAnimation,
    createMorphAnimation,
    createGlowAnimation,
    createBounceAnimation,
    createSpinAnimation,
    createPulseAnimation,
    createShakeAnimation,
    createFlipAnimation,
    createFadeInAnimation,
    createSlideInAnimation,
    createComboAnimation,
    ANIMATION_PRESETS,
} from "@/utils/svg-animations";
