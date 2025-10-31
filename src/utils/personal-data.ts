import type {
    IPersonalData,
    IPersonalInfo,
    IContactInfo,
} from "@/types/personal";

/**
 * 获取个人基本信息数据
 * @returns 个人信息数据
 */
export async function getPersonalData(): Promise<IPersonalData> {
    try {
        // 在实际项目中，这里可能从 API 获取数据
        const response = await fetch("/src/data/personal.json");
        const data = await response.json();
        return data as IPersonalData;
    } catch (error) {
        console.error("获取个人信息数据失败:", error);
        throw new Error("无法加载个人信息数据");
    }
}

/**
 * 获取联系方式列表
 * @param personalInfo 个人信息
 * @returns 联系方式数组
 */
export function getContactInfoList(
    personalInfo: IPersonalInfo,
): IContactInfo[] {
    const contacts: IContactInfo[] = [];

    // 邮箱
    if (personalInfo.email) {
        contacts.push({
            type: "email",
            value: personalInfo.email,
            label: "邮箱",
            icon: "email",
        });
    }

    // 电话
    if (personalInfo.phone) {
        contacts.push({
            type: "phone",
            value: personalInfo.phone,
            label: "电话",
            icon: "phone",
        });
    }

    // 个人网站
    if (personalInfo.personalWebsite) {
        contacts.push({
            type: "website",
            value: personalInfo.personalWebsite,
            label: "个人网站",
            icon: "website",
        });
    }

    // GitHub
    if (personalInfo.github) {
        contacts.push({
            type: "github",
            value: personalInfo.github,
            label: "GitHub",
            icon: "github",
        });
    }

    // LinkedIn
    if (personalInfo.linkedin) {
        contacts.push({
            type: "linkedin",
            value: personalInfo.linkedin,
            label: "LinkedIn",
            icon: "linkedin",
        });
    }

    // 微信
    if (personalInfo.wechat) {
        contacts.push({
            type: "wechat",
            value: personalInfo.wechat,
            label: "微信",
            icon: "wechat",
        });
    }

    return contacts;
}

/**
 * 格式化年龄显示
 * @param birthDate 出生日期
 * @returns 格式化的年龄字符串
 */
export function formatAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return `${age}岁`;
}

/**
 * 格式化工作经验
 * @param experience 经验描述
 * @returns 格式化的经验字符串
 */
export function formatExperience(experience: string): string {
    return experience;
}

/**
 * 获取头像 URL
 * @param avatar 头像路径
 * @returns 完整的头像 URL
 */
export function getAvatarUrl(avatar?: string): string {
    if (!avatar) {
        return "/images/avatar.jpg"; // 默认头像
    }

    // 如果是完整 URL，直接返回
    if (avatar.startsWith("http")) {
        return avatar;
    }

    // 如果是相对路径，添加前缀
    return avatar.startsWith("/") ? avatar : `/${avatar}`;
}

/**
 * 验证个人信息数据完整性
 * @param data 个人信息数据
 * @returns 验证结果
 */
export function validatePersonalData(data: IPersonalData): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const { personalInfo } = data;

    // 必填字段验证
    if (!personalInfo.name?.trim()) {
        errors.push("姓名不能为空");
    }

    if (!personalInfo.email?.trim()) {
        errors.push("邮箱不能为空");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
        errors.push("邮箱格式不正确");
    }

    if (!personalInfo.phone?.trim()) {
        errors.push("电话不能为空");
    } else if (!/^1[3-9]\d{9}$/.test(personalInfo.phone)) {
        errors.push("电话格式不正确");
    }

    if (personalInfo.age < 18 || personalInfo.age > 65) {
        errors.push("年龄应在18-65岁之间");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
