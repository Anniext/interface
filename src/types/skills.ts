// 技能相关类型定义

/** 技能类别枚举 */
export enum SkillCategory {
  LANGUAGE = "language",
  FRAMEWORK = "framework",
  TOOL = "tool",
  DATABASE = "database",
  OTHER = "other",
}

/** 技能等级枚举 */
export enum SkillLevel {
  BEGINNER = 1,
  BASIC = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5,
}

/** 技能接口 */
export interface ISkill {
  /** 技能 ID */
  id: string;
  /** 技能名称 */
  name: string;
  /** 技能类别 */
  category: SkillCategory;
  /** 技能等级 (1-10) */
  level: number;
  /** 图标 */
  icon: string;
  /** 颜色 */
  color: string;
  /** 使用年限 */
  experience: number;
  /** 描述 */
  description?: string;
}

/** 技能分类接口 */
export interface ISkillGroup {
  /** 分类名称 */
  name: string;
  /** 分类下的技能列表 */
  skills: ISkill[];
  /** 分类颜色 */
  color: string;
  /** 分类图标 */
  icon?: string;
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
