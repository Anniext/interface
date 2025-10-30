// 格式化工具函数

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  date: string | Date,
  format: string = "YYYY-MM-DD"
): string => {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "无效日期";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day);
};

/**
 * 格式化工作时间段
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 格式化后的时间段
 */
export const formatWorkPeriod = (
  startDate: string,
  endDate: string | null
): string => {
  const start = formatDate(startDate, "YYYY.MM");
  const end = endDate ? formatDate(endDate, "YYYY.MM") : "至今";
  return `${start} - ${end}`;
};

/**
 * 计算工作年限
 * @param startDate 开始时间
 * @param endDate 结束时间
 * @returns 工作年限
 */
export const calculateWorkDuration = (
  startDate: string,
  endDate: string | null
): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;

  if (diffYears > 0) {
    return remainingMonths > 0
      ? `${diffYears}年${remainingMonths}个月`
      : `${diffYears}年`;
  } else {
    return `${diffMonths}个月`;
  }
};

/**
 * 格式化技能等级
 * @param level 技能等级 (1-10)
 * @returns 格式化后的等级描述
 */
export const formatSkillLevel = (level: number): string => {
  if (level >= 9) return "专家";
  if (level >= 7) return "高级";
  if (level >= 5) return "中级";
  if (level >= 3) return "初级";
  return "入门";
};

/**
 * 格式化百分比
 * @param value 数值
 * @param total 总数
 * @returns 百分比字符串
 */
export const formatPercentage = (value: number, total: number): string => {
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * 格式化数字
 * @param num 数字
 * @param decimals 小数位数
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString("zh-CN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * 截断文本
 * @param text 文本
 * @param maxLength 最大长度
 * @param suffix 后缀
 * @returns 截断后的文本
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = "..."
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 首字母大写
 * @param str 字符串
 * @returns 首字母大写的字符串
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * 驼峰转短横线
 * @param str 驼峰字符串
 * @returns 短横线字符串
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

/**
 * 短横线转驼峰
 * @param str 短横线字符串
 * @returns 驼峰字符串
 */
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};
