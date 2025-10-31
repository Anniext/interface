// 装饰性 SVG 元素预设配置

import type { CSSProperties } from "vue";

/** 装饰元素配置接口 */
export interface IDecorativePreset {
    type: "background-pattern" | "divider" | "border" | "geometric" | "logo";
    variant: string;
    width?: number;
    height?: number;
    color?: string;
    textColor?: string;
    opacity?: number;
    strokeWidth?: number;
    borderRadius?: number;
    dashArray?: string;
    animated?: boolean;
    logoText?: string;
    fontSize?: number;
    customStyles?: CSSProperties;
    description?: string;
}

/** 背景图案预设 */
export const BACKGROUND_PATTERN_PRESETS: Record<string, IDecorativePreset> = {
    grid: {
        type: "background-pattern",
        variant: "grid",
        color: "#E5E7EB",
        opacity: 0.5,
        description: "网格背景图案",
    },
    dots: {
        type: "background-pattern",
        variant: "dots",
        color: "#D1D5DB",
        opacity: 0.3,
        description: "点状背景图案",
    },
    lines: {
        type: "background-pattern",
        variant: "lines",
        color: "#F3F4F6",
        opacity: 0.8,
        description: "线条背景图案",
    },
};

/** 分割线预设 */
export const DIVIDER_PRESETS: Record<string, IDecorativePreset> = {
    simple: {
        type: "divider",
        variant: "simple",
        width: 300,
        height: 2,
        color: "#E5E7EB",
        strokeWidth: 1,
        description: "简单分割线",
    },
    decorative: {
        type: "divider",
        variant: "decorative",
        width: 300,
        height: 20,
        color: "#3B82F6",
        strokeWidth: 2,
        description: "装饰性分割线",
    },
    wave: {
        type: "divider",
        variant: "wave",
        width: 300,
        height: 20,
        color: "#10B981",
        strokeWidth: 2,
        description: "波浪分割线",
    },
    gradient: {
        type: "divider",
        variant: "gradient",
        width: 300,
        height: 4,
        color: "url(#gradient)",
        description: "渐变分割线",
    },
};

/** 边框预设 */
export const BORDER_PRESETS: Record<string, IDecorativePreset> = {
    simple: {
        type: "border",
        variant: "simple",
        width: 200,
        height: 150,
        color: "#6B7280",
        strokeWidth: 1,
        borderRadius: 4,
        description: "简单边框",
    },
    decorative: {
        type: "border",
        variant: "decorative",
        width: 200,
        height: 150,
        color: "#8B5CF6",
        strokeWidth: 2,
        borderRadius: 8,
        description: "装饰性边框",
    },
    dashed: {
        type: "border",
        variant: "dashed",
        width: 200,
        height: 150,
        color: "#F59E0B",
        strokeWidth: 2,
        dashArray: "8,4",
        borderRadius: 6,
        description: "虚线边框",
    },
    rounded: {
        type: "border",
        variant: "simple",
        width: 200,
        height: 150,
        color: "#EF4444",
        strokeWidth: 2,
        borderRadius: 20,
        description: "圆角边框",
    },
};

/** 几何图形预设 */
export const GEOMETRIC_PRESETS: Record<string, IDecorativePreset> = {
    triangle: {
        type: "geometric",
        variant: "triangle",
        width: 80,
        height: 80,
        color: "#3B82F6",
        opacity: 0.8,
        animated: true,
        description: "三角形",
    },
    hexagon: {
        type: "geometric",
        variant: "hexagon",
        width: 80,
        height: 80,
        color: "#10B981",
        opacity: 0.7,
        animated: true,
        description: "六边形",
    },
    circle: {
        type: "geometric",
        variant: "circle",
        width: 80,
        height: 80,
        color: "#8B5CF6",
        opacity: 0.6,
        animated: true,
        description: "圆形",
    },
    diamond: {
        type: "geometric",
        variant: "diamond",
        width: 80,
        height: 80,
        color: "#F59E0B",
        opacity: 0.8,
        animated: true,
        description: "菱形",
    },
    star: {
        type: "geometric",
        variant: "star",
        width: 80,
        height: 80,
        color: "#EF4444",
        opacity: 0.7,
        animated: true,
        description: "星形",
    },
};

/** Logo 预设 */
export const LOGO_PRESETS: Record<string, IDecorativePreset> = {
    simple: {
        type: "logo",
        variant: "simple",
        width: 120,
        height: 120,
        color: "#1F2937",
        textColor: "#FFFFFF",
        logoText: "LOGO",
        fontSize: 16,
        description: "简单 Logo",
    },
    complex: {
        type: "logo",
        variant: "complex",
        width: 150,
        height: 80,
        color: "#3B82F6",
        textColor: "#FFFFFF",
        logoText: "BRAND",
        fontSize: 18,
        borderRadius: 8,
        description: "复杂 Logo",
    },
    circular: {
        type: "logo",
        variant: "circular",
        width: 100,
        height: 100,
        color: "#10B981",
        textColor: "#FFFFFF",
        logoText: "XU",
        fontSize: 24,
        description: "圆形 Logo",
    },
    minimal: {
        type: "logo",
        variant: "minimal",
        width: 80,
        height: 30,
        color: "transparent",
        textColor: "#374151",
        logoText: "minimal",
        fontSize: 14,
        description: "极简 Logo",
    },
};

/** 所有预设配置 */
export const ALL_DECORATIVE_PRESETS = {
    backgroundPatterns: BACKGROUND_PATTERN_PRESETS,
    dividers: DIVIDER_PRESETS,
    borders: BORDER_PRESETS,
    geometric: GEOMETRIC_PRESETS,
    logos: LOGO_PRESETS,
};

/** 获取预设配置 */
export function getDecorativePreset(
    category: keyof typeof ALL_DECORATIVE_PRESETS,
    name: string,
): IDecorativePreset | null {
    const presets = ALL_DECORATIVE_PRESETS[category];
    return presets[name] || null;
}

/** 获取所有预设名称 */
export function getAllPresetNames(): Record<string, string[]> {
    return {
        backgroundPatterns: Object.keys(BACKGROUND_PATTERN_PRESETS),
        dividers: Object.keys(DIVIDER_PRESETS),
        borders: Object.keys(BORDER_PRESETS),
        geometric: Object.keys(GEOMETRIC_PRESETS),
        logos: Object.keys(LOGO_PRESETS),
    };
}

/** 创建自定义预设 */
export function createCustomPreset(
    basePreset: IDecorativePreset,
    overrides: Partial<IDecorativePreset>,
): IDecorativePreset {
    return {
        ...basePreset,
        ...overrides,
    };
}

/** 主题色彩配置 */
export const THEME_COLORS = {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
    gray: "#6B7280",
    dark: "#1F2937",
    light: "#F9FAFB",
} as const;

/** 根据主题获取颜色 */
export function getThemeColor(theme: keyof typeof THEME_COLORS): string {
    return THEME_COLORS[theme];
}

/** 生成渐变色 */
export function createGradient(
    startColor: string,
    endColor: string,
    direction: "horizontal" | "vertical" | "diagonal" = "horizontal",
): string {
    const directions = {
        horizontal: "to right",
        vertical: "to bottom",
        diagonal: "to bottom right",
    };

    return `linear-gradient(${directions[direction]}, ${startColor}, ${endColor})`;
}

/** 装饰元素动画预设 */
export const DECORATION_ANIMATIONS = {
    float: {
        name: "float",
        duration: "3s",
        timing: "ease-in-out",
        iteration: "infinite",
        description: "浮动动画",
    },
    pulse: {
        name: "pulse",
        duration: "2s",
        timing: "ease-in-out",
        iteration: "infinite",
        description: "脉冲动画",
    },
    rotate: {
        name: "rotate",
        duration: "20s",
        timing: "linear",
        iteration: "infinite",
        description: "旋转动画",
    },
    bounce: {
        name: "bounce",
        duration: "1s",
        timing: "ease-in-out",
        iteration: "infinite",
        description: "弹跳动画",
    },
    fade: {
        name: "fade",
        duration: "2s",
        timing: "ease-in-out",
        iteration: "infinite",
        description: "淡入淡出动画",
    },
} as const;

/** 获取动画配置 */
export function getAnimationConfig(name: keyof typeof DECORATION_ANIMATIONS) {
    return DECORATION_ANIMATIONS[name];
}
