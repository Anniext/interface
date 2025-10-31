import type {
    IExperienceData,
    IWorkExperience,
    IPersonalProject,
    IProject,
} from "@/types/experience";

/**
 * 获取工作经验数据
 * @returns 工作经验数据
 */
export async function getExperienceData(): Promise<IExperienceData> {
    try {
        // 在实际项目中，这里可能从 API 获取数据
        const response = await fetch("/src/data/experience.json");
        const data = await response.json();
        return data as IExperienceData;
    } catch (error) {
        console.error("获取工作经验数据失败:", error);
        throw new Error("无法加载工作经验数据");
    }
}

/**
 * 根据ID获取工作经验
 * @param experienceData 经验数据
 * @param experienceId 经验ID
 * @returns 工作经验
 */
export function getWorkExperienceById(
    experienceData: IExperienceData,
    experienceId: string,
): IWorkExperience | undefined {
    return experienceData.workExperience.find((exp) => exp.id === experienceId);
}

/**
 * 根据ID获取个人项目
 * @param experienceData 经验数据
 * @param projectId 项目ID
 * @returns 个人项目
 */
export function getPersonalProjectById(
    experienceData: IExperienceData,
    projectId: string,
): IPersonalProject | undefined {
    return experienceData.personalProjects.find(
        (project) => project.id === projectId,
    );
}

/**
 * 获取所有项目列表（工作项目 + 个人项目）
 * @param experienceData 经验数据
 * @returns 所有项目的扁平列表
 */
export function getAllProjects(
    experienceData: IExperienceData,
): (IProject | IPersonalProject)[] {
    const workProjects = experienceData.workExperience.flatMap(
        (exp) => exp.projects,
    );
    const personalProjects = experienceData.personalProjects;
    return [...workProjects, ...personalProjects];
}

/**
 * 根据技术栈筛选项目
 * @param experienceData 经验数据
 * @param technology 技术名称
 * @returns 使用该技术的项目列表
 */
export function getProjectsByTechnology(
    experienceData: IExperienceData,
    technology: string,
): (IProject | IPersonalProject)[] {
    return getAllProjects(experienceData).filter((project) =>
        project.technologies.some((tech) =>
            tech.toLowerCase().includes(technology.toLowerCase()),
        ),
    );
}

/**
 * 获取最近的工作经验
 * @param experienceData 经验数据
 * @param count 数量限制
 * @returns 最近的工作经验列表
 */
export function getRecentWorkExperience(
    experienceData: IExperienceData,
    count: number = 3,
): IWorkExperience[] {
    return experienceData.workExperience
        .sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA; // 降序排列，最新的在前
        })
        .slice(0, count);
}

/**
 * 获取最近的个人项目
 * @param experienceData 经验数据
 * @param count 数量限制
 * @returns 最近的个人项目列表
 */
export function getRecentPersonalProjects(
    experienceData: IExperienceData,
    count: number = 5,
): IPersonalProject[] {
    return experienceData.personalProjects
        .sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA; // 降序排列，最新的在前
        })
        .slice(0, count);
}

/**
 * 计算工作经验总时长（月数）
 * @param workExperience 工作经验列表
 * @returns 总时长（月数）
 */
export function calculateTotalWorkMonths(
    workExperience: IWorkExperience[],
): number {
    return workExperience.reduce((total, exp) => {
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();

        const months =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

        return total + Math.max(0, months);
    }, 0);
}

/**
 * 格式化工作持续时间
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 格式化的持续时间字符串
 */
export function formatWorkDuration(
    startDate: string,
    endDate: string | null,
): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    if (months < 12) {
        return `${months}个月`;
    } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (remainingMonths === 0) {
            return `${years}年`;
        } else {
            return `${years}年${remainingMonths}个月`;
        }
    }
}

/**
 * 格式化日期显示
 * @param dateString 日期字符串
 * @returns 格式化的日期字符串
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return `${year}年${month}月`;
}

/**
 * 获取所有使用过的技术栈
 * @param experienceData 经验数据
 * @returns 技术栈列表（去重）
 */
export function getAllTechnologies(experienceData: IExperienceData): string[] {
    const workTechnologies = experienceData.workExperience.flatMap(
        (exp) => exp.technologies,
    );
    const projectTechnologies = experienceData.personalProjects.flatMap(
        (project) => project.technologies,
    );

    const allTechnologies = [...workTechnologies, ...projectTechnologies];

    // 去重并排序
    return Array.from(new Set(allTechnologies)).sort();
}

/**
 * 获取技术栈使用频率统计
 * @param experienceData 经验数据
 * @returns 技术栈使用频率映射
 */
export function getTechnologyFrequency(
    experienceData: IExperienceData,
): Record<string, number> {
    const allTechnologies = getAllTechnologies(experienceData);
    const frequency: Record<string, number> = {};

    allTechnologies.forEach((tech) => {
        frequency[tech] = 0;
    });

    // 统计工作经验中的技术使用
    experienceData.workExperience.forEach((exp) => {
        exp.technologies.forEach((tech) => {
            if (frequency[tech] !== undefined) {
                frequency[tech]++;
            }
        });
    });

    // 统计个人项目中的技术使用
    experienceData.personalProjects.forEach((project) => {
        project.technologies.forEach((tech) => {
            if (frequency[tech] !== undefined) {
                frequency[tech]++;
            }
        });
    });

    return frequency;
}

/**
 * 根据关键词搜索项目
 * @param experienceData 经验数据
 * @param keyword 搜索关键词
 * @returns 匹配的项目列表
 */
export function searchProjects(
    experienceData: IExperienceData,
    keyword: string,
): (IProject | IPersonalProject)[] {
    const lowerKeyword = keyword.toLowerCase();

    return getAllProjects(experienceData).filter(
        (project) =>
            project.name.toLowerCase().includes(lowerKeyword) ||
            project.description.toLowerCase().includes(lowerKeyword) ||
            project.technologies.some((tech) =>
                tech.toLowerCase().includes(lowerKeyword),
            ) ||
            project.highlights.some((highlight) =>
                highlight.toLowerCase().includes(lowerKeyword),
            ),
    );
}

/**
 * 获取职业发展时间轴
 * @param experienceData 经验数据
 * @returns 时间轴数据
 */
export function getCareerTimeline(experienceData: IExperienceData) {
    const timeline: Array<{
        date: string;
        type: "work" | "project";
        title: string;
        company?: string;
        description: string;
        technologies: string[];
    }> = [];

    // 添加工作经验
    experienceData.workExperience.forEach((exp) => {
        timeline.push({
            date: exp.startDate,
            type: "work",
            title: exp.position,
            company: exp.company,
            description: exp.description,
            technologies: exp.technologies,
        });
    });

    // 添加重要个人项目
    experienceData.personalProjects.forEach((project) => {
        timeline.push({
            date: project.startDate,
            type: "project",
            title: project.name,
            description: project.description,
            technologies: project.technologies,
        });
    });

    // 按日期排序
    return timeline.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

/**
 * 获取工作经验统计信息
 * @param experienceData 经验数据
 * @returns 统计信息
 */
export function getExperienceStatistics(experienceData: IExperienceData) {
    const workExperience = experienceData.workExperience;
    const personalProjects = experienceData.personalProjects;

    // 计算总工作时长
    const totalMonths = calculateTotalWorkMonths(workExperience);
    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    // 统计项目数量
    const totalWorkProjects = workExperience.reduce(
        (sum, exp) => sum + exp.projects.length,
        0,
    );
    const totalPersonalProjects = personalProjects.length;
    const totalProjects = totalWorkProjects + totalPersonalProjects;

    // 统计技术栈
    const allTechnologies = getAllTechnologies(experienceData);
    const technologyFrequency = getTechnologyFrequency(experienceData);

    // 获取最常用的技术栈（前10个）
    const topTechnologies = Object.entries(technologyFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tech, count]) => ({ technology: tech, count }));

    return {
        totalExperience: {
            years: totalYears,
            months: remainingMonths,
            totalMonths,
            formattedDuration:
                totalYears > 0
                    ? `${totalYears}年${
                          remainingMonths > 0 ? remainingMonths + "个月" : ""
                      }`
                    : `${remainingMonths}个月`,
        },
        companies: {
            total: workExperience.length,
            list: workExperience.map((exp) => ({
                name: exp.company,
                position: exp.position,
                duration: formatWorkDuration(exp.startDate, exp.endDate),
                location: exp.location,
            })),
        },
        projects: {
            total: totalProjects,
            work: totalWorkProjects,
            personal: totalPersonalProjects,
        },
        technologies: {
            total: allTechnologies.length,
            top: topTechnologies,
            all: allTechnologies,
        },
        industries: experienceData.experienceSummary.industryExperience,
    };
}

/**
 * 获取按年份分组的工作经验
 * @param experienceData 经验数据
 * @returns 按年份分组的经验数据
 */
export function getExperienceByYear(experienceData: IExperienceData) {
    const timeline = getCareerTimeline(experienceData);
    const yearGroups: Record<string, typeof timeline> = {};

    timeline.forEach((item) => {
        const year = new Date(item.date).getFullYear().toString();
        if (!yearGroups[year]) {
            yearGroups[year] = [];
        }
        yearGroups[year]!.push(item);
    });

    // 按年份排序
    const sortedYears = Object.keys(yearGroups).sort(
        (a, b) => parseInt(b) - parseInt(a),
    );

    return sortedYears.map((year) => ({
        year,
        items: yearGroups[year]!.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    }));
}

/**
 * 获取技能发展轨迹
 * @param experienceData 经验数据
 * @returns 技能发展轨迹
 */
export function getSkillDevelopmentPath(experienceData: IExperienceData) {
    const skillTimeline: Array<{
        date: string;
        company: string;
        position: string;
        newSkills: string[];
        allSkills: string[];
    }> = [];

    const accumulatedSkills = new Set<string>();

    // 按时间顺序处理工作经验
    const sortedExperience = experienceData.workExperience.sort(
        (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    sortedExperience.forEach((exp) => {
        const newSkills = exp.technologies.filter(
            (tech) => !accumulatedSkills.has(tech),
        );
        exp.technologies.forEach((tech) => accumulatedSkills.add(tech));

        skillTimeline.push({
            date: exp.startDate,
            company: exp.company,
            position: exp.position,
            newSkills,
            allSkills: Array.from(accumulatedSkills),
        });
    });

    return skillTimeline;
}

/**
 * 获取项目复杂度分析
 * @param experienceData 经验数据
 * @returns 项目复杂度分析
 */
export function getProjectComplexityAnalysis(experienceData: IExperienceData) {
    const allProjects = getAllProjects(experienceData);

    const analysis = allProjects.map((project) => {
        const techCount = project.technologies.length;
        const highlightCount = project.highlights.length;

        // 简单的复杂度评分算法
        let complexityScore = 0;
        complexityScore += techCount * 2; // 技术栈数量
        complexityScore += highlightCount * 3; // 亮点数量

        // 根据项目描述长度调整
        complexityScore += Math.min(project.description.length / 50, 10);

        let complexity: "simple" | "medium" | "complex" | "enterprise";
        if (complexityScore < 15) complexity = "simple";
        else if (complexityScore < 30) complexity = "medium";
        else if (complexityScore < 50) complexity = "complex";
        else complexity = "enterprise";

        return {
            name: project.name,
            technologies: project.technologies,
            highlights: project.highlights,
            complexityScore,
            complexity,
            techCount,
            highlightCount,
        };
    });

    // 按复杂度排序
    return analysis.sort((a, b) => b.complexityScore - a.complexityScore);
}

/**
 * 验证经验数据完整性
 * @param data 经验数据
 * @returns 验证结果
 */
export function validateExperienceData(data: IExperienceData): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    // 验证工作经验
    if (!data.workExperience || data.workExperience.length === 0) {
        errors.push("工作经验不能为空");
    }

    data.workExperience.forEach((exp, index) => {
        if (!exp.company?.trim()) {
            errors.push(`工作经验 ${index + 1} 缺少公司名称`);
        }
        if (!exp.position?.trim()) {
            errors.push(`工作经验 ${index + 1} 缺少职位信息`);
        }
        if (!exp.startDate) {
            errors.push(`工作经验 ${index + 1} 缺少开始日期`);
        }
        if (exp.technologies.length === 0) {
            errors.push(`工作经验 ${index + 1} 缺少技术栈信息`);
        }

        // 验证项目数据
        exp.projects.forEach((project, projectIndex) => {
            if (!project.name?.trim()) {
                errors.push(
                    `工作经验 ${index + 1} 的项目 ${
                        projectIndex + 1
                    } 缺少项目名称`,
                );
            }
            if (project.technologies.length === 0) {
                errors.push(
                    `工作经验 ${index + 1} 的项目 ${
                        projectIndex + 1
                    } 缺少技术栈信息`,
                );
            }
        });
    });

    // 验证个人项目
    data.personalProjects.forEach((project, index) => {
        if (!project.name?.trim()) {
            errors.push(`个人项目 ${index + 1} 缺少项目名称`);
        }
        if (!project.description?.trim()) {
            errors.push(`个人项目 ${index + 1} 缺少项目描述`);
        }
        if (project.technologies.length === 0) {
            errors.push(`个人项目 ${index + 1} 缺少技术栈信息`);
        }
    });

    // 验证经验总结
    if (!data.experienceSummary) {
        errors.push("缺少经验总结信息");
    } else {
        if (
            !data.experienceSummary.keyAchievements ||
            data.experienceSummary.keyAchievements.length === 0
        ) {
            errors.push("缺少关键成就信息");
        }
        if (
            !data.experienceSummary.industryExperience ||
            data.experienceSummary.industryExperience.length === 0
        ) {
            errors.push("缺少行业经验信息");
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
