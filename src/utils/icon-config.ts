// 图标配置和管理工具

import type {
    IIconLibraryConfig,
    TechIconName,
    AchievementIconName,
    IIconAnimationConfig,
} from "@/types/icons";

/** 技术栈图标配置 */
export const TECH_ICON_CONFIG: Record<TechIconName, any> = {
    java: {
        name: "java",
        type: "tech",
        defaultColor: "#ED8B00",
        description: "Java 编程语言",
        tags: ["编程语言", "后端", "企业级"],
    },
    python: {
        name: "python",
        type: "tech",
        defaultColor: "#3776AB",
        description: "Python 编程语言",
        tags: ["编程语言", "AI", "数据科学"],
    },
    go: {
        name: "go",
        type: "tech",
        defaultColor: "#00ADD8",
        description: "Go 编程语言",
        tags: ["编程语言", "后端", "云原生"],
    },
    spring: {
        name: "spring",
        type: "tech",
        defaultColor: "#6DB33F",
        description: "Spring 框架",
        tags: ["框架", "Java", "后端"],
    },
    mysql: {
        name: "mysql",
        type: "tech",
        defaultColor: "#4479A1",
        description: "MySQL 数据库",
        tags: ["数据库", "关系型", "存储"],
    },
    redis: {
        name: "redis",
        type: "tech",
        defaultColor: "#DC382D",
        description: "Redis 缓存数据库",
        tags: ["数据库", "缓存", "内存"],
    },
    docker: {
        name: "docker",
        type: "tech",
        defaultColor: "#2496ED",
        description: "Docker 容器化",
        tags: ["容器", "DevOps", "部署"],
    },
    git: {
        name: "git",
        type: "tech",
        defaultColor: "#F05032",
        description: "Git 版本控制",
        tags: ["版本控制", "协作", "开发工具"],
    },
    vue: {
        name: "vue",
        type: "tech",
        defaultColor: "#4FC08D",
        description: "Vue.js 前端框架",
        tags: ["框架", "前端", "JavaScript"],
    },
    react: {
        name: "react",
        type: "tech",
        defaultColor: "#61DAFB",
        description: "React 前端框架",
        tags: ["框架", "前端", "JavaScript"],
    },
    nodejs: {
        name: "nodejs",
        type: "tech",
        defaultColor: "#339933",
        description: "Node.js 运行时",
        tags: ["运行时", "后端", "JavaScript"],
    },
    typescript: {
        name: "typescript",
        type: "tech",
        defaultColor: "#3178C6",
        description: "TypeScript 编程语言",
        tags: ["编程语言", "类型安全", "JavaScript"],
    },
    javascript: {
        name: "javascript",
        type: "tech",
        defaultColor: "#F7DF1E",
        description: "JavaScript 编程语言",
        tags: ["编程语言", "前端", "后端"],
    },
    html: {
        name: "html",
        type: "tech",
        defaultColor: "#E34F26",
        description: "HTML 标记语言",
        tags: ["标记语言", "前端", "网页"],
    },
    css: {
        name: "css",
        type: "tech",
        defaultColor: "#1572B6",
        description: "CSS 样式表",
        tags: ["样式", "前端", "设计"],
    },
    kubernetes: {
        name: "kubernetes",
        type: "tech",
        defaultColor: "#326CE5",
        description: "Kubernetes 容器编排",
        tags: ["容器编排", "云原生", "DevOps"],
    },
    aws: {
        name: "aws",
        type: "tech",
        defaultColor: "#FF9900",
        description: "Amazon Web Services",
        tags: ["云服务", "AWS", "基础设施"],
    },
    linux: {
        name: "linux",
        type: "tech",
        defaultColor: "#FCC624",
        description: "Linux 操作系统",
        tags: ["操作系统", "服务器", "开源"],
    },
    nginx: {
        name: "nginx",
        type: "tech",
        defaultColor: "#009639",
        description: "Nginx 网络服务器",
        tags: ["网络服务器", "反向代理", "负载均衡"],
    },
};

/** 成就图标配置 */
export const ACHIEVEMENT_ICON_CONFIG: Record<AchievementIconName, any> = {
    trophy: {
        name: "trophy",
        type: "achievement",
        defaultColor: "#FFD700",
        description: "奖杯图标",
        tags: ["奖杯", "胜利", "成就"],
    },
    medal: {
        name: "medal",
        type: "achievement",
        defaultColor: "#FF6B35",
        description: "奖牌图标",
        tags: ["奖牌", "荣誉", "认可"],
    },
    star: {
        name: "star",
        type: "achievement",
        defaultColor: "#FFC107",
        description: "星星图标",
        tags: ["星星", "评级", "优秀"],
    },
    certificate: {
        name: "certificate",
        type: "achievement",
        defaultColor: "#4ECDC4",
        description: "证书图标",
        tags: ["证书", "认证", "资质"],
    },
    award: {
        name: "award",
        type: "achievement",
        defaultColor: "#45B7D1",
        description: "奖项图标",
        tags: ["奖项", "表彰", "荣誉"],
    },
    badge: {
        name: "badge",
        type: "achievement",
        defaultColor: "#96CEB4",
        description: "徽章图标",
        tags: ["徽章", "标识", "成就"],
    },
    crown: {
        name: "crown",
        type: "achievement",
        defaultColor: "#FFD700",
        description: "皇冠图标",
        tags: ["皇冠", "王者", "顶级"],
    },
};

/** 图标库完整配置 */
export const ICON_LIBRARY_CONFIG: IIconLibraryConfig = {
    techIcons: TECH_ICON_CONFIG,
    achievementIcons: ACHIEVEMENT_ICON_CONFIG,
};

/** 图标动画配置 */
export const ICON_ANIMATION_CONFIG: IIconAnimationConfig = {
    hover: {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
    },
    click: {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
    },
    loading: {
        rotation: 360,
        duration: 1,
        ease: "none",
    },
};

/** 获取技术栈图标配置 */
export function getTechIconConfig(name: TechIconName) {
    return TECH_ICON_CONFIG[name] || null;
}

/** 获取成就图标配置 */
export function getAchievementIconConfig(name: AchievementIconName) {
    return ACHIEVEMENT_ICON_CONFIG[name] || null;
}

/** 根据标签搜索图标 */
export function searchIconsByTag(tag: string) {
    const results: any[] = [];

    // 搜索技术栈图标
    Object.values(TECH_ICON_CONFIG).forEach((config) => {
        if (config.tags?.includes(tag)) {
            results.push(config);
        }
    });

    // 搜索成就图标
    Object.values(ACHIEVEMENT_ICON_CONFIG).forEach((config) => {
        if (config.tags?.includes(tag)) {
            results.push(config);
        }
    });

    return results;
}

/** 获取所有可用的图标标签 */
export function getAllIconTags() {
    const tags = new Set<string>();

    // 收集技术栈图标标签
    Object.values(TECH_ICON_CONFIG).forEach((config) => {
        config.tags?.forEach((tag: string) => tags.add(tag));
    });

    // 收集成就图标标签
    Object.values(ACHIEVEMENT_ICON_CONFIG).forEach((config) => {
        config.tags?.forEach((tag: string) => tags.add(tag));
    });

    return Array.from(tags).sort();
}
