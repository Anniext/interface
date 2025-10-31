// 成就数据处理工具

import type { IAchievement, ICertificate } from "@/types/achievements";
import {
    sortAchievementsByPriority,
    calculateAchievementStats,
} from "./achievement-icons";

/** 成就数据接口 */
export interface AchievementData {
    achievements: IAchievement[];
    certificates: ICertificate[];
    achievementSummary: {
        totalAchievements: number;
        totalCertificates: number;
        goldAchievements: number;
        silverAchievements: number;
        bronzeAchievements: number;
        specialAchievements: number;
        categories: Record<string, number>;
        recentAchievements: string[];
        topAchievements: string[];
        achievementsByYear: Record<string, number>;
        competitionStats: {
            mathModeling: number;
            technical: number;
            totalParticipations: number;
            winRate: number;
        };
        certificationStats: {
            active: number;
            expired: number;
            nearExpiry: number;
            averageValidityYears: number;
        };
        displayPriority: string[];
    };
}

/** 加载成就数据 */
export async function loadAchievementData(): Promise<AchievementData> {
    try {
        // 动态导入成就数据
        const achievementModule = await import("@/data/achievements.json");
        return achievementModule.default as AchievementData;
    } catch (error) {
        console.error("加载成就数据失败:", error);
        return getDefaultAchievementData();
    }
}

/** 获取默认成就数据 */
function getDefaultAchievementData(): AchievementData {
    return {
        achievements: [],
        certificates: [],
        achievementSummary: {
            totalAchievements: 0,
            totalCertificates: 0,
            goldAchievements: 0,
            silverAchievements: 0,
            bronzeAchievements: 0,
            specialAchievements: 0,
            categories: {},
            recentAchievements: [],
            topAchievements: [],
            achievementsByYear: {},
            competitionStats: {
                mathModeling: 0,
                technical: 0,
                totalParticipations: 0,
                winRate: 0,
            },
            certificationStats: {
                active: 0,
                expired: 0,
                nearExpiry: 0,
                averageValidityYears: 0,
            },
            displayPriority: [],
        },
    };
}

/** 根据ID获取成就 */
export function getAchievementById(
    achievements: IAchievement[],
    id: string,
): IAchievement | undefined {
    return achievements.find((achievement) => achievement.id === id);
}

/** 根据ID获取证书 */
export function getCertificateById(
    certificates: ICertificate[],
    id: string,
): ICertificate | undefined {
    return certificates.find((certificate) => certificate.id === id);
}

/** 获取顶级成就 */
export function getTopAchievements(
    achievements: IAchievement[],
    count: number = 5,
): IAchievement[] {
    const sorted = sortAchievementsByPriority(achievements);
    return sorted.slice(0, count);
}

/** 获取最近成就 */
export function getRecentAchievements(
    achievements: IAchievement[],
    months: number = 12,
): IAchievement[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    return achievements
        .filter((achievement) => new Date(achievement.date) >= cutoffDate)
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
}

/** 按类别分组成就 */
export function groupAchievementsByCategory(
    achievements: IAchievement[],
): Record<string, IAchievement[]> {
    return achievements.reduce(
        (groups, achievement) => {
            const category = achievement.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(achievement);
            return groups;
        },
        {} as Record<string, IAchievement[]>,
    );
}

/** 按年份分组成就 */
export function groupAchievementsByYear(
    achievements: IAchievement[],
): Record<string, IAchievement[]> {
    return achievements.reduce(
        (groups, achievement) => {
            const year = new Date(achievement.date).getFullYear().toString();
            if (!groups[year]) {
                groups[year] = [];
            }
            groups[year].push(achievement);
            return groups;
        },
        {} as Record<string, IAchievement[]>,
    );
}

/** 获取有效证书 */
export function getActiveCertificates(
    certificates: ICertificate[],
): ICertificate[] {
    const now = new Date();
    return certificates.filter((cert) => {
        if (!cert.expiryDate) return true; // 无过期时间的证书视为永久有效
        return new Date(cert.expiryDate) > now;
    });
}

/** 获取即将过期的证书 */
export function getExpiringCertificates(
    certificates: ICertificate[],
    months: number = 6,
): ICertificate[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + months);

    return certificates.filter((cert) => {
        if (!cert.expiryDate) return false;
        const expiryDate = new Date(cert.expiryDate);
        return expiryDate > now && expiryDate <= futureDate;
    });
}

/** 搜索成就 */
export function searchAchievements(
    achievements: IAchievement[],
    query: string,
): IAchievement[] {
    const lowerQuery = query.toLowerCase();
    return achievements.filter(
        (achievement) =>
            achievement.title.toLowerCase().includes(lowerQuery) ||
            achievement.organization.toLowerCase().includes(lowerQuery) ||
            achievement.description?.toLowerCase().includes(lowerQuery),
    );
}

/** 过滤成就 */
export interface AchievementFilter {
    level?: string[];
    category?: string[];
    year?: string[];
    organization?: string[];
}

export function filterAchievements(
    achievements: IAchievement[],
    filter: AchievementFilter,
): IAchievement[] {
    return achievements.filter((achievement) => {
        // 按等级过滤
        if (filter.level && filter.level.length > 0) {
            if (!filter.level.includes(achievement.level)) {
                return false;
            }
        }

        // 按类别过滤
        if (filter.category && filter.category.length > 0) {
            if (!filter.category.includes(achievement.category)) {
                return false;
            }
        }

        // 按年份过滤
        if (filter.year && filter.year.length > 0) {
            const achievementYear = new Date(achievement.date)
                .getFullYear()
                .toString();
            if (!filter.year.includes(achievementYear)) {
                return false;
            }
        }

        // 按机构过滤
        if (filter.organization && filter.organization.length > 0) {
            if (!filter.organization.includes(achievement.organization)) {
                return false;
            }
        }

        return true;
    });
}

/** 生成成就时间轴数据 */
export function generateAchievementTimeline(achievements: IAchievement[]) {
    const sortedAchievements = achievements.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sortedAchievements.map((achievement, index) => ({
        ...achievement,
        timelineIndex: index,
        isFirst: index === 0,
        isLast: index === sortedAchievements.length - 1,
        yearGroup: new Date(achievement.date).getFullYear(),
    }));
}

/** 计算成就统计信息 */
export function getAchievementStatistics(
    achievements: IAchievement[],
    certificates: ICertificate[],
) {
    const achievementStats = calculateAchievementStats(achievements);
    const activeCerts = getActiveCertificates(certificates);
    const expiringCerts = getExpiringCertificates(certificates);

    return {
        achievements: achievementStats,
        certificates: {
            total: certificates.length,
            active: activeCerts.length,
            expiring: expiringCerts.length,
            expired: certificates.length - activeCerts.length,
        },
        combined: {
            total: achievements.length + certificates.length,
            recentCount: getRecentAchievements(achievements, 12).length,
            topLevelCount: achievements.filter(
                (a) => a.level === "gold" || a.level === "special",
            ).length,
        },
    };
}
