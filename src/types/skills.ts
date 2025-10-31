// 技能相关类型定义

/** 技能类别类型 */
export type SkillCategoryType =
    | "language"
    | "framework"
    | "tool"
    | "database"
    | "architecture"
    | "other";

/** 技能接口 */
export interface ISkill {
    /** 技能 ID */
    id: string;
    /** 技能名称 */
    name: string;
    /** 技能等级 (1-10) */
    level: number;
    /** 使用年限 */
    experience: number;
    /** 技能类别 */
    category: SkillCategoryType;
    /** 图标 */
    icon: string;
    /** 颜色 */
    color: string;
    /** 描述 */
    description?: string;
}

/** 技能分类接口 */
export interface ISkillCategory {
    /** 分类 ID */
    id: string;
    /** 分类名称 */
    name: string;
    /** 分类颜色 */
    color: string;
    /** 分类图标 */
    icon: string;
    /** 分类下的技能列表 */
    skills: ISkill[];
}

/** 技能总结接口 */
export interface ISkillSummary {
    /** 技能总数 */
    totalSkills: number;
    /** 平均技能等级 */
    averageLevel: number;
    /** 总工作经验年限 */
    totalExperience: number;
    /** 最强技能分类 */
    strongestCategories: string[];
    /** 最近学习的技能 */
    recentlyLearned: string[];
    /** 认证证书 */
    certifications: string[];
    /** 学习目标 */
    learningGoals: string[];
}

/** 技能数据根接口 */
export interface ISkillsData {
    /** 技能分类列表 */
    skillCategories: ISkillCategory[];
    /** 技能总结 */
    skillSummary: ISkillSummary;
}

/** 技能雷达图数据接口 */
export interface ISkillRadarData {
    /** 技能名称 */
    skill: string;
    /** 技能值 */
    value: number;
    /** 最大值 */
    max: number;
}

/** 技能等级描述映射 */
export const SKILL_LEVEL_LABELS: Record<number, string> = {
    1: "入门",
    2: "初级",
    3: "初级+",
    4: "中级",
    5: "中级+",
    6: "高级",
    7: "高级+",
    8: "专家",
    9: "专家+",
    10: "大师",
};

/** 技能类别颜色映射 */
export const SKILL_CATEGORY_COLORS: Record<string, string> = {
    "programming-languages": "#3B82F6",
    "backend-frameworks": "#10B981",
    "frontend-frameworks": "#8B5CF6",
    databases: "#F59E0B",
    "devops-tools": "#EF4444",
    "message-queues": "#06B6D4",
    "game-development": "#EC4899",
    "ai-ml": "#7C3AED",
};
