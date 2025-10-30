// 个人信息相关类型定义

/** 个人基本信息接口 */
export interface IPersonalInfo {
  /** 姓名 */
  name: string;
  /** 年龄 */
  age: number;
  /** 所在地 */
  location: string;
  /** 邮箱 */
  email: string;
  /** 电话 */
  phone: string;
  /** 期望薪资 */
  salary: string;
  /** 头像 URL */
  avatar?: string;
  /** 个人简介 */
  bio?: string;
  /** 职位 */
  position?: string;
  /** 工作年限 */
  experience?: number;
}

/** 联系方式接口 */
export interface IContactInfo {
  type: "email" | "phone" | "wechat" | "github" | "linkedin";
  value: string;
  label: string;
  icon: string;
}
