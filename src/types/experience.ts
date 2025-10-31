// 工作经验相关类型定义

/** 项目接口 */
export interface IProject {
    /** 项目 ID */
    id: string;
    /** 项目名称 */
    name: string;
    /** 项目描述 */
    description: string;
    /** 担任角色 */
    role: string;
    /** 项目持续时间 */
    duration: string;
    /** 使用技术 */
    technologies: string[];
    /** 项目亮点 */
    highlights: string[];
    /** 技术架构 */
    architecture?: string;
    /** 项目影响 */
    impact?: string;
    /** 项目链接 */
    url?: string;
    /** 项目图片 */
    images?: string[];
    /** 开始时间 */
    startDate?: string;
    /** 结束时间 */
    endDate?: string;
}

/** 个人项目接口 */
export interface IPersonalProject {
    /** 项目 ID */
    id: string;
    /** 项目名称 */
    name: string;
    /** 项目描述 */
    description: string;
    /** 担任角色 */
    role: string;
    /** 开始时间 */
    startDate: string;
    /** 结束时间 */
    endDate: string;
    /** 项目状态 */
    status: string;
    /** 使用技术 */
    technologies: string[];
    /** 项目亮点 */
    highlights: string[];
    /** GitHub 链接 */
    github?: string;
    /** 演示链接 */
    demo?: string;
    /** 项目影响 */
    impact?: string;
}

/** 公司信息接口 */
export interface ICompanyInfo {
    /** 行业类型 */
    industry: string;
    /** 公司规模 */
    scale: string;
    /** 业务范围 */
    businessScope: string;
    /** 工作环境 */
    workEnvironment: string;
}

/** 工作经验接口 */
export interface IWorkExperience {
    /** 经验 ID */
    id: string;
    /** 公司名称 */
    company: string;
    /** 职位 */
    position: string;
    /** 开始时间 */
    startDate: string;
    /** 结束时间 */
    endDate: string | null;
    /** 工作持续时间 */
    duration: string;
    /** 工作地点 */
    location: string;
    /** 雇佣类型 */
    employmentType: string;
    /** 工作描述 */
    description: string;
    /** 工作职责 */
    responsibilities: string[];
    /** 工作成就 */
    achievements: string[];
    /** 使用技术 */
    technologies: string[];
    /** 参与项目 */
    projects: IProject[];
    /** 公司信息 */
    companyInfo?: ICompanyInfo;
    /** 公司 Logo */
    logo?: string;
}

/** 行业经验接口 */
export interface IIndustryExperience {
    /** 行业名称 */
    industry: string;
    /** 工作年限 */
    years: number;
    /** 行业描述 */
    description: string;
}

/** 时间轴项目接口 */
export interface ITimelineItem {
    /** 时间段 */
    period: string;
    /** 公司名称 */
    company: string;
    /** 职位 */
    position: string;
    /** 工作重点 */
    focus: string;
    /** 关键项目 */
    keyProjects: string[];
}

/** 职业里程碑接口 */
export interface ICareerMilestone {
    /** 年份 */
    year: string;
    /** 里程碑 */
    milestone: string;
    /** 成就 */
    achievement: string;
}

/** 职业发展接口 */
export interface ICareerProgression {
    /** 起始级别 */
    startLevel: string;
    /** 当前级别 */
    currentLevel: string;
    /** 下一个目标 */
    nextTarget: string;
    /** 关键里程碑 */
    keyMilestones: ICareerMilestone[];
}

/** 核心能力接口 */
export interface ICoreCompetency {
    /** 能力类别 */
    category: string;
    /** 技能列表 */
    skills: string[];
    /** 能力级别 */
    level: string;
}

/** 经验总结接口 */
export interface IExperienceSummary {
    /** 总工作年限 */
    totalYears: number;
    /** 总公司数量 */
    totalCompanies: number;
    /** 总项目数量 */
    totalProjects: number;
    /** 关键成就 */
    keyAchievements: string[];
    /** 职业时间轴 */
    timeline?: ITimelineItem[];
    /** 行业经验 */
    industryExperience: IIndustryExperience[];
    /** 技术成长 */
    technicalGrowth: string[];
    /** 职业发展 */
    careerProgression?: ICareerProgression;
    /** 核心能力 */
    coreCompetencies?: ICoreCompetency[];
}

/** 经验数据根接口 */
export interface IExperienceData {
    /** 工作经验列表 */
    workExperience: IWorkExperience[];
    /** 个人项目列表 */
    personalProjects: IPersonalProject[];
    /** 经验总结 */
    experienceSummary: IExperienceSummary;
}

/** 教育经历接口 */
export interface IEducation {
    /** 学校名称 */
    school: string;
    /** 专业 */
    major: string;
    /** 学历 */
    degree: string;
    /** 开始时间 */
    startDate: string;
    /** 结束时间 */
    endDate: string;
    /** GPA */
    gpa?: number;
    /** 描述 */
    description?: string;
}
