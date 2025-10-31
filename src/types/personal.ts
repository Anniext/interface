// 个人信息相关类型定义

/** 语言能力接口 */
export interface ILanguage {
    /** 语言名称 */
    name: string;
    /** 水平描述 */
    level: string;
    /** 熟练程度 (0-100) */
    proficiency: number;
}

/** 个人总结接口 */
export interface IPersonalSummary {
    /** 工作经验描述 */
    experience: string;
    /** 专业特长 */
    specialties: string[];
    /** 行业经验 */
    industries: string[];
    /** 团队规模经验 */
    teamSize: string;
}

/** 工作可用性接口 */
export interface IAvailability {
    /** 当前状态 */
    status: string;
    /** 通知期 */
    noticePeriod: string;
    /** 工作类型偏好 */
    workType: string[];
    /** 期望工作地点 */
    preferredLocation: string[];
}

/** 个人基本信息接口 */
export interface IPersonalInfo {
    /** 姓名 */
    name: string;
    /** 年龄 */
    age: number;
    /** 出生日期 */
    birthDate: string;
    /** 所在地 */
    location: string;
    /** 邮箱 */
    email: string;
    /** 电话 */
    phone: string;
    /** 期望薪资 */
    expectedSalary: string;
    /** 出生地 */
    birthPlace: string;
    /** 头像 URL */
    avatar?: string;
    /** 个人简介 */
    bio?: string;
    /** 职业目标 */
    careerObjective?: string;
    /** 个人网站 */
    personalWebsite?: string;
    /** GitHub 地址 */
    github?: string;
    /** LinkedIn 地址 */
    linkedin?: string;
    /** 微信号 */
    wechat?: string;
    /** 个人总结 */
    summary: IPersonalSummary;
    /** 个人特质 */
    personalTraits: string[];
    /** 语言能力 */
    languages: ILanguage[];
    /** 工作可用性 */
    availability: IAvailability;
}

/** 联系方式接口 */
export interface IContactInfo {
    type: "email" | "phone" | "wechat" | "github" | "linkedin" | "website";
    value: string;
    label: string;
    icon: string;
}

/** 个人数据根接口 */
export interface IPersonalData {
    personalInfo: IPersonalInfo;
}
