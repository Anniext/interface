// 图标相关类型定义

/** 图标尺寸类型 */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;

/** 图标类型 */
export type IconType = "tech" | "achievement" | "custom";

/** 技术栈图标名称 */
export type TechIconName =
    | "java"
    | "python"
    | "go"
    | "spring"
    | "mysql"
    | "redis"
    | "docker"
    | "git"
    | "vue"
    | "react"
    | "nodejs"
    | "typescript"
    | "javascript"
    | "html"
    | "css"
    | "kubernetes"
    | "aws"
    | "linux"
    | "nginx";

/** 成就图标名称 */
export type AchievementIconName =
    | "trophy"
    | "medal"
    | "star"
    | "certificate"
    | "award"
    | "badge"
    | "crown";

/** 基础图标属性接口 */
export interface IBaseIconProps {
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
}

/** SVG 图标属性接口 */
export interface ISvgIconProps extends IBaseIconProps {
    /** 背景颜色 */
    backgroundColor?: string;
    /** 边框颜色 */
    borderColor?: string;
    /** 视图框 */
    viewBox?: string;
    /** 无障碍角色 */
    role?: string;
    /** 是否对屏幕阅读器隐藏 */
    ariaHidden?: boolean;
    /** 自定义类名 */
    customClass?: string;
}

/** 技术栈图标属性接口 */
export interface ITechIconProps extends IBaseIconProps {
    /** 图标名称 */
    name: TechIconName;
}

/** 成就图标属性接口 */
export interface IAchievementIconProps extends IBaseIconProps {
    /** 图标名称 */
    name: AchievementIconName;
    /** 成就等级 */
    level?: "gold" | "silver" | "bronze" | "special";
}

/** 图标配置接口 */
export interface IIconConfig {
    /** 图标名称 */
    name: string;
    /** 图标类型 */
    type: IconType;
    /** 默认颜色 */
    defaultColor?: string;
    /** 图标描述 */
    description?: string;
    /** 图标标签 */
    tags?: string[];
}

/** 图标库配置 */
export interface IIconLibraryConfig {
    /** 技术栈图标配置 */
    techIcons: Record<TechIconName, IIconConfig>;
    /** 成就图标配置 */
    achievementIcons: Record<AchievementIconName, IIconConfig>;
}

/** 图标动画配置 */
export interface IIconAnimationConfig {
    /** 悬停动画 */
    hover?: {
        scale?: number;
        duration?: number;
        ease?: string;
    };
    /** 点击动画 */
    click?: {
        scale?: number;
        duration?: number;
        ease?: string;
    };
    /** 加载动画 */
    loading?: {
        rotation?: number;
        duration?: number;
        ease?: string;
    };
}
