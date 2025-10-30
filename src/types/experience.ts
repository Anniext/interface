// 工作经验相关类型定义

/** 项目接口 */
export interface IProject {
  /** 项目 ID */
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目描述 */
  description: string;
  /** 使用技术 */
  technologies: string[];
  /** 项目亮点 */
  highlights: string[];
  /** 技术架构 */
  architecture?: string;
  /** 担任角色 */
  role: string;
  /** 项目链接 */
  url?: string;
  /** 项目图片 */
  images?: string[];
  /** 开始时间 */
  startDate?: string;
  /** 结束时间 */
  endDate?: string;
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
  /** 工作描述 */
  description: string;
  /** 参与项目 */
  projects: IProject[];
  /** 使用技术 */
  technologies: string[];
  /** 公司 Logo */
  logo?: string;
  /** 工作地点 */
  location?: string;
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
