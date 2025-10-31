import type {
    ISkillsData,
    ISkillCategory,
    ISkill,
    ISkillRadarData,
    SkillCategoryType,
} from "@/types/skills";
import { SKILL_LEVEL_LABELS } from "@/types/skills";

// 直接导入技能数据
import skillsDataJson from "@/data/skills.json";

/**
 * 获取技能数据
 * @returns 技能数据
 */
export async function getSkillsData(): Promise<ISkillsData> {
    try {
        // 直接返回导入的数据
        return skillsDataJson as ISkillsData;
    } catch (error) {
        console.error("获取技能数据失败:", error);
        throw new Error("无法加载技能数据");
    }
}

/**
 * 根据分类ID获取技能分类
 * @param skillsData 技能数据
 * @param categoryId 分类ID
 * @returns 技能分类
 */
export function getSkillCategoryById(
    skillsData: ISkillsData,
    categoryId: string,
): ISkillCategory | undefined {
    return skillsData.skillCategories.find(
        (category) => category.id === categoryId,
    );
}

/**
 * 根据技能ID获取技能
 * @param skillsData 技能数据
 * @param skillId 技能ID
 * @returns 技能信息
 */
export function getSkillById(
    skillsData: ISkillsData,
    skillId: string,
): ISkill | undefined {
    for (const category of skillsData.skillCategories) {
        const skill = category.skills.find((skill) => skill.id === skillId);
        if (skill) return skill;
    }
    return undefined;
}

/**
 * 获取所有技能列表
 * @param skillsData 技能数据
 * @returns 所有技能的扁平列表
 */
export function getAllSkills(skillsData: ISkillsData): ISkill[] {
    return skillsData.skillCategories.flatMap((category) => category.skills);
}

/**
 * 根据技能类别筛选技能
 * @param skillsData 技能数据
 * @param categoryType 技能类别
 * @returns 筛选后的技能列表
 */
export function getSkillsByCategory(
    skillsData: ISkillsData,
    categoryType: SkillCategoryType,
): ISkill[] {
    return getAllSkills(skillsData).filter(
        (skill) => skill.category === categoryType,
    );
}

/**
 * 根据技能等级筛选技能
 * @param skillsData 技能数据
 * @param minLevel 最低等级
 * @param maxLevel 最高等级
 * @returns 筛选后的技能列表
 */
export function getSkillsByLevel(
    skillsData: ISkillsData,
    minLevel: number = 1,
    maxLevel: number = 10,
): ISkill[] {
    return getAllSkills(skillsData).filter(
        (skill) => skill.level >= minLevel && skill.level <= maxLevel,
    );
}

/**
 * 获取顶级技能（等级8以上）
 * @param skillsData 技能数据
 * @returns 顶级技能列表
 */
export function getTopSkills(skillsData: ISkillsData): ISkill[] {
    return getSkillsByLevel(skillsData, 8, 10);
}

/**
 * 获取技能等级描述
 * @param level 技能等级
 * @returns 等级描述
 */
export function getSkillLevelLabel(level: number): string {
    return SKILL_LEVEL_LABELS[level] || "未知";
}

/**
 * 计算技能经验总和
 * @param skills 技能列表
 * @returns 经验总和（年）
 */
export function calculateTotalExperience(skills: ISkill[]): number {
    return skills.reduce((total, skill) => total + skill.experience, 0);
}

/**
 * 计算平均技能等级
 * @param skills 技能列表
 * @returns 平均等级
 */
export function calculateAverageLevel(skills: ISkill[]): number {
    if (skills.length === 0) return 0;
    const totalLevel = skills.reduce((total, skill) => total + skill.level, 0);
    return Math.round((totalLevel / skills.length) * 10) / 10;
}

/**
 * 生成技能雷达图数据
 * @param skillsData 技能数据
 * @param categoryIds 要包含的分类ID列表
 * @returns 雷达图数据
 */
export function generateSkillRadarData(
    skillsData: ISkillsData,
    categoryIds?: string[],
): ISkillRadarData[] {
    const categories = categoryIds
        ? skillsData.skillCategories.filter((cat) =>
              categoryIds.includes(cat.id),
          )
        : skillsData.skillCategories;

    return categories.map((category) => {
        const averageLevel = calculateAverageLevel(category.skills);
        return {
            skill: category.name,
            value: averageLevel,
            max: 10,
        };
    });
}

/**
 * 根据关键词搜索技能
 * @param skillsData 技能数据
 * @param keyword 搜索关键词
 * @returns 匹配的技能列表
 */
export function searchSkills(
    skillsData: ISkillsData,
    keyword: string,
): ISkill[] {
    const lowerKeyword = keyword.toLowerCase();
    return getAllSkills(skillsData).filter(
        (skill) =>
            skill.name.toLowerCase().includes(lowerKeyword) ||
            skill.description?.toLowerCase().includes(lowerKeyword),
    );
}

/**
 * 按技能等级排序
 * @param skills 技能列表
 * @param ascending 是否升序排列
 * @returns 排序后的技能列表
 */
export function sortSkillsByLevel(
    skills: ISkill[],
    ascending: boolean = false,
): ISkill[] {
    return [...skills].sort((a, b) =>
        ascending ? a.level - b.level : b.level - a.level,
    );
}

/**
 * 按经验年限排序
 * @param skills 技能列表
 * @param ascending 是否升序排列
 * @returns 排序后的技能列表
 */
export function sortSkillsByExperience(
    skills: ISkill[],
    ascending: boolean = false,
): ISkill[] {
    return [...skills].sort((a, b) =>
        ascending ? a.experience - b.experience : b.experience - a.experience,
    );
}

/**
 * 获取技能统计信息
 * @param skillsData 技能数据
 * @returns 统计信息
 */
export function getSkillStatistics(skillsData: ISkillsData) {
    const allSkills = getAllSkills(skillsData);

    return {
        totalSkills: allSkills.length,
        totalCategories: skillsData.skillCategories.length,
        averageLevel: calculateAverageLevel(allSkills),
        totalExperience: calculateTotalExperience(allSkills),
        topSkills: getTopSkills(skillsData),
        skillsByCategory: skillsData.skillCategories.map((category) => ({
            name: category.name,
            count: category.skills.length,
            averageLevel: calculateAverageLevel(category.skills),
        })),
        levelDistribution: Array.from({ length: 10 }, (_, i) => {
            const level = i + 1;
            const count = allSkills.filter(
                (skill) => skill.level === level,
            ).length;
            return { level, count };
        }),
    };
}

/**
 * 验证技能数据完整性
 * @param data 技能数据
 * @returns 验证结果
 */
export function validateSkillsData(data: ISkillsData): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // 验证技能分类
    if (!data.skillCategories || data.skillCategories.length === 0) {
        errors.push("技能分类不能为空");
    }

    // 验证每个分类
    data.skillCategories.forEach((category, categoryIndex) => {
        if (!category.id?.trim()) {
            errors.push(`分类 ${categoryIndex + 1} 缺少ID`);
        }
        if (!category.name?.trim()) {
            errors.push(`分类 ${categoryIndex + 1} 缺少名称`);
        }
        if (!category.skills || category.skills.length === 0) {
            errors.push(`分类 "${category.name}" 没有技能`);
        }

        // 验证每个技能
        category.skills.forEach((skill, skillIndex) => {
            if (!skill.id?.trim()) {
                errors.push(
                    `分类 "${category.name}" 中的技能 ${skillIndex + 1} 缺少ID`,
                );
            }
            if (!skill.name?.trim()) {
                errors.push(
                    `分类 "${category.name}" 中的技能 ${
                        skillIndex + 1
                    } 缺少名称`,
                );
            }
            if (skill.level < 1 || skill.level > 10) {
                errors.push(`技能 "${skill.name}" 的等级应在1-10之间`);
            }
            if (skill.experience < 0) {
                errors.push(`技能 "${skill.name}" 的经验年限不能为负数`);
            }
        });
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
}
