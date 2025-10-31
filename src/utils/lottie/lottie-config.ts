import type { LottieAnimationConfig } from "./LottieManager";

/**
 * Lottie 动画配置
 * 定义所有可用的动画资源
 */
export const lottieAnimations: LottieAnimationConfig[] = [
    // 技能相关动画
    {
        id: "skill-javascript",
        path: "/animations/skills/javascript.json",
        preload: true,
        priority: "high",
        description: "JavaScript 编程语言动画",
    },
    {
        id: "skill-typescript",
        path: "/animations/skills/typescript.json",
        preload: true,
        priority: "high",
        description: "TypeScript 编程语言动画",
    },
    {
        id: "skill-vue",
        path: "/animations/skills/vue.json",
        preload: true,
        priority: "high",
        description: "Vue.js 框架动画",
    },
    {
        id: "skill-react",
        path: "/animations/skills/react.json",
        preload: false,
        priority: "medium",
        description: "React 框架动画",
    },
    {
        id: "skill-nodejs",
        path: "/animations/skills/nodejs.json",
        preload: true,
        priority: "medium",
        description: "Node.js 运行时动画",
    },
    {
        id: "skill-python",
        path: "/animations/skills/python.json",
        preload: true,
        priority: "medium",
        description: "Python 编程语言动画",
    },
    {
        id: "skill-java",
        path: "/animations/skills/java.json",
        preload: true,
        priority: "high",
        description: "Java 编程语言动画",
    },
    {
        id: "skill-go",
        path: "/animations/skills/go.json",
        preload: true,
        priority: "medium",
        description: "Go 编程语言动画",
    },
    {
        id: "skill-database",
        path: "/animations/skills/database.json",
        preload: true,
        priority: "medium",
        description: "数据库技术动画",
    },
    {
        id: "skill-cloud",
        path: "/animations/skills/cloud.json",
        preload: false,
        priority: "low",
        description: "云计算技术动画",
    },

    // 项目类型指示动画
    {
        id: "project-web",
        path: "/animations/projects/web-development.json",
        preload: true,
        priority: "medium",
        description: "Web 开发项目动画",
    },
    {
        id: "project-mobile",
        path: "/animations/projects/mobile-app.json",
        preload: false,
        priority: "low",
        description: "移动应用项目动画",
    },
    {
        id: "project-game",
        path: "/animations/projects/game-development.json",
        preload: true,
        priority: "high",
        description: "游戏开发项目动画",
    },
    {
        id: "project-api",
        path: "/animations/projects/api-development.json",
        preload: true,
        priority: "medium",
        description: "API 开发项目动画",
    },

    // 成就解锁动画
    {
        id: "achievement-unlock",
        path: "/animations/achievements/unlock.json",
        preload: true,
        priority: "high",
        description: "成就解锁动画",
    },
    {
        id: "achievement-trophy",
        path: "/animations/achievements/trophy.json",
        preload: true,
        priority: "medium",
        description: "奖杯成就动画",
    },
    {
        id: "achievement-medal",
        path: "/animations/achievements/medal.json",
        preload: true,
        priority: "medium",
        description: "奖牌成就动画",
    },
    {
        id: "achievement-certificate",
        path: "/animations/achievements/certificate.json",
        preload: false,
        priority: "low",
        description: "证书成就动画",
    },

    // 交互确认动画
    {
        id: "button-click",
        path: "/animations/interactions/button-click.json",
        preload: true,
        priority: "high",
        description: "按钮点击确认动画",
    },
    {
        id: "form-success",
        path: "/animations/interactions/form-success.json",
        preload: true,
        priority: "medium",
        description: "表单提交成功动画",
    },
    {
        id: "navigation-switch",
        path: "/animations/interactions/navigation-switch.json",
        preload: true,
        priority: "medium",
        description: "导航切换指示动画",
    },
    {
        id: "loading-spinner",
        path: "/animations/interactions/loading-spinner.json",
        preload: true,
        priority: "high",
        description: "加载状态动画",
    },
    {
        id: "loading-dots",
        path: "/animations/interactions/loading-dots.json",
        preload: true,
        priority: "medium",
        description: "点状加载动画",
    },
    {
        id: "loading-progress",
        path: "/animations/interactions/loading-progress.json",
        preload: false,
        priority: "low",
        description: "进度条加载动画",
    },

    // 装饰性动画
    {
        id: "particle-effect",
        path: "/animations/decorative/particle-effect.json",
        preload: false,
        priority: "low",
        description: "粒子效果动画",
    },
    {
        id: "background-pattern",
        path: "/animations/decorative/background-pattern.json",
        preload: false,
        priority: "low",
        description: "背景图案动画",
    },
];

/**
 * 根据 ID 获取动画配置
 */
export function getAnimationConfig(
    id: string,
): LottieAnimationConfig | undefined {
    return lottieAnimations.find((config) => config.id === id);
}

/**
 * 根据类别获取动画配置
 */
export function getAnimationsByCategory(
    category: string,
): LottieAnimationConfig[] {
    return lottieAnimations.filter((config) => config.id.startsWith(category));
}

/**
 * 获取需要预加载的动画配置
 */
export function getPreloadAnimations(): LottieAnimationConfig[] {
    return lottieAnimations.filter((config) => config.preload);
}

/**
 * 获取高优先级动画配置
 */
export function getHighPriorityAnimations(): LottieAnimationConfig[] {
    return lottieAnimations.filter((config) => config.priority === "high");
}

/**
 * 动画类别枚举
 */
export enum AnimationCategory {
    SKILL = "skill",
    PROJECT = "project",
    ACHIEVEMENT = "achievement",
    INTERACTION = "button",
    LOADING = "loading",
    DECORATIVE = "particle",
}

/**
 * 常用动画 ID 常量
 */
export const ANIMATION_IDS = {
    // 技能动画
    SKILL_JAVASCRIPT: "skill-javascript",
    SKILL_TYPESCRIPT: "skill-typescript",
    SKILL_VUE: "skill-vue",
    SKILL_JAVA: "skill-java",
    SKILL_PYTHON: "skill-python",
    SKILL_GO: "skill-go",

    // 项目动画
    PROJECT_WEB: "project-web",
    PROJECT_GAME: "project-game",
    PROJECT_API: "project-api",

    // 成就动画
    ACHIEVEMENT_UNLOCK: "achievement-unlock",
    ACHIEVEMENT_TROPHY: "achievement-trophy",
    ACHIEVEMENT_MEDAL: "achievement-medal",

    // 交互动画
    BUTTON_CLICK: "button-click",
    FORM_SUCCESS: "form-success",
    NAVIGATION_SWITCH: "navigation-switch",

    // 加载动画
    LOADING_SPINNER: "loading-spinner",
    LOADING_DOTS: "loading-dots",
    LOADING_PROGRESS: "loading-progress",
} as const;

export type AnimationId = (typeof ANIMATION_IDS)[keyof typeof ANIMATION_IDS];
