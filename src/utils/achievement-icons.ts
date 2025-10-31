// 成就图标配置工具

import type {
    AchievementLevel,
    AchievementCategory,
} from "@/types/achievements";

/** 成就等级图标配置 */
export const ACHIEVEMENT_LEVEL_ICONS = {
    gold: {
        icon: "medal",
        color: "#FFD700",
        bgColor: "#FFF8DC",
        borderColor: "#DAA520",
        glow: "#FFD700",
        priority: 10,
    },
    silver: {
        icon: "trophy",
        color: "#C0C0C0",
        bgColor: "#F8F8FF",
        borderColor: "#A9A9A9",
        glow: "#C0C0C0",
        priority: 8,
    },
    bronze: {
        icon: "trophy",
        color: "#CD7F32",
        bgColor: "#FDF5E6",
        borderColor: "#A0522D",
        glow: "#CD7F32",
        priority: 6,
    },
    special: {
        icon: "star",
        color: "#9932CC",
        bgColor: "#F0E6FF",
        borderColor: "#8A2BE2",
        glow: "#9932CC",
        priority: 9,
    },
} as const;

/** 成就类别图标配置 */
export const ACHIEVEMENT_CATEGORY_ICONS = {
    competition: {
        icon: "trophy",
        color: "#FF6B35",
        description: "竞赛奖项",
    },
    certification: {
        icon: "certificate",
        color: "#4ECDC4",
        description: "专业认证",
    },
    award: {
        icon: "award",
        color: "#45B7D1",
        description: "荣誉奖项",
    },
    recognition: {
        icon: "star",
        color: "#96CEB4",
        description: "表彰认可",
    },
    other: {
        icon: "badge",
        color: "#FFEAA7",
        description: "其他成就",
    },
} as const;

/** 证书图标配置 */
export const CERTIFICATE_ICONS = {
    certificate: {
        icon: "certificate",
        color: "#4ECDC4",
        bgColor: "#E8F8F5",
        borderColor: "#26D0CE",
    },
    diploma: {
        icon: "diploma",
        color: "#FF6B35",
        bgColor: "#FFF2E8",
        borderColor: "#FF8C42",
    },
    badge: {
        icon: "badge",
        color: "#FFEAA7",
        bgColor: "#FFFBF0",
        borderColor: "#FDCB6E",
    },
} as const;

/** 获取成就等级配置 */
export function getAchievementLevelConfig(level: AchievementLevel) {
    return ACHIEVEMENT_LEVEL_ICONS[level] || ACHIEVEMENT_LEVEL_ICONS.bronze;
}

/** 获取成就类别配置 */
export function getAchievementCategoryConfig(category: AchievementCategory) {
    return (
        ACHIEVEMENT_CATEGORY_ICONS[category] || ACHIEVEMENT_CATEGORY_ICONS.other
    );
}

/** 获取证书图标配置 */
export function getCertificateIconConfig(iconType: string = "certificate") {
    return (
        CERTIFICATE_ICONS[iconType as keyof typeof CERTIFICATE_ICONS] ||
        CERTIFICATE_ICONS.certificate
    );
}

/** 成就动画配置 */
export const ACHIEVEMENT_ANIMATIONS = {
    // 入场动画
    entrance: {
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.1,
    },
    // 悬停动画
    hover: {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
    },
    // 点击动画
    click: {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
    },
    // 发光效果
    glow: {
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
    },
    // 掉落物理效果配置
    physics: {
        restitution: 0.6,
        friction: 0.3,
        frictionAir: 0.01,
        density: 0.001,
    },
} as const;

/** 成就展示优先级排序 */
export function sortAchievementsByPriority(achievements: any[]) {
    return achievements.sort((a, b) => {
        // 首先按优先级排序
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;

        if (priorityA !== priorityB) {
            return priorityB - priorityA; // 优先级高的在前
        }

        // 优先级相同时按日期排序（新的在前）
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return dateB - dateA;
    });
}

/** 成就统计工具 */
export function calculateAchievementStats(achievements: any[]) {
    const stats = {
        total: achievements.length,
        byLevel: {
            gold: 0,
            silver: 0,
            bronze: 0,
            special: 0,
        },
        byCategory: {
            competition: 0,
            certification: 0,
            award: 0,
            recognition: 0,
            other: 0,
        },
        byYear: {} as Record<string, number>,
        recent: achievements.filter((a) => {
            const achievementDate = new Date(a.date);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            return achievementDate >= oneYearAgo;
        }).length,
    };

    achievements.forEach((achievement) => {
        // 按等级统计
        if (achievement.level in stats.byLevel) {
            stats.byLevel[achievement.level as keyof typeof stats.byLevel]++;
        }

        // 按类别统计
        if (achievement.category in stats.byCategory) {
            stats.byCategory[
                achievement.category as keyof typeof stats.byCategory
            ]++;
        }

        // 按年份统计
        const year = new Date(achievement.date).getFullYear().toString();
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
    });

    return stats;
}

/** 成就展示模式配置 */
export const ACHIEVEMENT_DISPLAY_MODES = {
    grid: {
        name: "网格模式",
        columns: 3,
        spacing: 20,
        cardSize: "medium",
    },
    timeline: {
        name: "时间轴模式",
        orientation: "vertical",
        spacing: 30,
        showDates: true,
    },
    showcase: {
        name: "展示模式",
        featured: 5,
        layout: "hero",
        animations: true,
    },
    compact: {
        name: "紧凑模式",
        columns: 4,
        spacing: 10,
        cardSize: "small",
    },
} as const;
