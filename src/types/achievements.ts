// 成就奖项相关类型定义

/** 成就等级枚举 */
export enum AchievementLevel {
    GOLD = "gold",
    SILVER = "silver",
    BRONZE = "bronze",
    SPECIAL = "special",
}

/** 成就类别枚举 */
export enum AchievementCategory {
    COMPETITION = "competition",
    CERTIFICATION = "certification",
    AWARD = "award",
    RECOGNITION = "recognition",
    OTHER = "other",
}

/** 成就接口 */
export interface IAchievement {
    /** 成就 ID */
    id: string;
    /** 成就标题 */
    title: string;
    /** 颁发机构 */
    organization: string;
    /** 获得时间 */
    date: string;
    /** 成就等级 */
    level: AchievementLevel;
    /** 成就类别 */
    category: AchievementCategory;
    /** 成就描述 */
    description?: string;
    /** 成就图标 */
    icon: string;
    /** 证书链接 */
    certificateUrl?: string;
    /** 成就图片 */
    image?: string;
    /** 展示优先级 (1-10, 数值越高优先级越高) */
    priority?: number;
}

/** 证书接口 */
export interface ICertificate {
    /** 证书 ID */
    id: string;
    /** 证书名称 */
    name: string;
    /** 颁发机构 */
    issuer: string;
    /** 获得时间 */
    issueDate: string;
    /** 过期时间 */
    expiryDate?: string;
    /** 证书编号 */
    credentialId?: string;
    /** 证书链接 */
    url?: string;
    /** 证书图标 */
    icon: string;
    /** 展示优先级 (1-10, 数值越高优先级越高) */
    priority?: number;
}
