// 类型守卫和数据验证函数

import type {
    IPersonalInfo,
    ISkill,
    IWorkExperience,
    IProject,
    IAchievement,
    IParticle,
    IPhysicsBody,
    IAnimationConfig,
} from "@/types";
import {
    SkillCategory,
    SkillLevel,
    AchievementLevel,
    AchievementCategory,
    ParticleType,
    PhysicsBodyType,
    AnimationState,
} from "@/types";

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
    // 支持常见的邮箱格式，包括 + 号
    const emailRegex =
        /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && !email.includes("..");
}

/**
 * 验证手机号格式（中国大陆）
 */
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 */
export function isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    const isValidDateObject =
        parsedDate instanceof Date && !isNaN(parsedDate.getTime());

    // 额外检查：确保解析后的日期与输入字符串一致
    if (isValidDateObject) {
        const [year, month, day] = date.split("-").map(Number);
        return (
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day
        );
    }

    return false;
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
    if (!url || url.trim().length === 0) return false;

    try {
        const urlObj = new URL(url);
        // 只允许 http 和 https 协议
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * 个人信息类型守卫
 */
export function isPersonalInfo(obj: any): obj is IPersonalInfo {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.name === "string" &&
        obj.name.trim().length > 0 &&
        typeof obj.age === "number" &&
        obj.age > 0 &&
        obj.age < 150 &&
        typeof obj.location === "string" &&
        obj.location.trim().length > 0 &&
        typeof obj.email === "string" &&
        isValidEmail(obj.email) &&
        typeof obj.phone === "string" &&
        isValidPhone(obj.phone) &&
        typeof obj.salary === "string" &&
        obj.salary.trim().length > 0 &&
        (obj.avatar === undefined || typeof obj.avatar === "string") &&
        (obj.bio === undefined || typeof obj.bio === "string") &&
        (obj.position === undefined || typeof obj.position === "string") &&
        (obj.experience === undefined ||
            (typeof obj.experience === "number" && obj.experience >= 0))
    );
}

/**
 * 技能类型守卫
 */
export function isSkill(obj: any): obj is ISkill {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        obj.id.trim().length > 0 &&
        typeof obj.name === "string" &&
        obj.name.trim().length > 0 &&
        Object.values(SkillCategory).includes(obj.category) &&
        typeof obj.level === "number" &&
        obj.level >= 1 &&
        obj.level <= 10 &&
        typeof obj.icon === "string" &&
        obj.icon.trim().length > 0 &&
        typeof obj.color === "string" &&
        obj.color.trim().length > 0 &&
        typeof obj.experience === "number" &&
        obj.experience >= 0 &&
        (obj.description === undefined || typeof obj.description === "string")
    );
}

/**
 * 项目类型守卫
 */
export function isProject(obj: any): obj is IProject {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        obj.id.trim().length > 0 &&
        typeof obj.name === "string" &&
        obj.name.trim().length > 0 &&
        typeof obj.description === "string" &&
        obj.description.trim().length > 0 &&
        Array.isArray(obj.technologies) &&
        obj.technologies.every((tech: any) => typeof tech === "string") &&
        Array.isArray(obj.highlights) &&
        obj.highlights.every(
            (highlight: any) => typeof highlight === "string",
        ) &&
        typeof obj.role === "string" &&
        obj.role.trim().length > 0 &&
        (obj.architecture === undefined ||
            typeof obj.architecture === "string") &&
        (obj.url === undefined ||
            (typeof obj.url === "string" && isValidUrl(obj.url))) &&
        (obj.images === undefined ||
            (Array.isArray(obj.images) &&
                obj.images.every((img: any) => typeof img === "string"))) &&
        (obj.startDate === undefined ||
            (typeof obj.startDate === "string" &&
                isValidDate(obj.startDate))) &&
        (obj.endDate === undefined ||
            (typeof obj.endDate === "string" && isValidDate(obj.endDate)))
    );
}

/**
 * 工作经验类型守卫
 */
export function isWorkExperience(obj: any): obj is IWorkExperience {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        obj.id.trim().length > 0 &&
        typeof obj.company === "string" &&
        obj.company.trim().length > 0 &&
        typeof obj.position === "string" &&
        obj.position.trim().length > 0 &&
        typeof obj.startDate === "string" &&
        isValidDate(obj.startDate) &&
        (obj.endDate === null ||
            (typeof obj.endDate === "string" && isValidDate(obj.endDate))) &&
        typeof obj.description === "string" &&
        obj.description.trim().length > 0 &&
        Array.isArray(obj.projects) &&
        obj.projects.every((project: any) => isProject(project)) &&
        Array.isArray(obj.technologies) &&
        obj.technologies.every((tech: any) => typeof tech === "string") &&
        (obj.logo === undefined || typeof obj.logo === "string") &&
        (obj.location === undefined || typeof obj.location === "string")
    );
}

/**
 * 成就类型守卫
 */
export function isAchievement(obj: any): obj is IAchievement {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        obj.id.trim().length > 0 &&
        typeof obj.title === "string" &&
        obj.title.trim().length > 0 &&
        typeof obj.organization === "string" &&
        obj.organization.trim().length > 0 &&
        typeof obj.date === "string" &&
        isValidDate(obj.date) &&
        Object.values(AchievementLevel).includes(obj.level) &&
        Object.values(AchievementCategory).includes(obj.category) &&
        typeof obj.icon === "string" &&
        obj.icon.trim().length > 0 &&
        (obj.description === undefined ||
            typeof obj.description === "string") &&
        (obj.certificateUrl === undefined ||
            (typeof obj.certificateUrl === "string" &&
                isValidUrl(obj.certificateUrl))) &&
        (obj.image === undefined || typeof obj.image === "string")
    );
}

/**
 * 粒子类型守卫
 */
export function isParticle(obj: any): obj is IParticle {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.x === "number" &&
        typeof obj.y === "number" &&
        typeof obj.vx === "number" &&
        typeof obj.vy === "number" &&
        typeof obj.size === "number" &&
        obj.size > 0 &&
        typeof obj.color === "string" &&
        obj.color.trim().length > 0 &&
        typeof obj.life === "number" &&
        obj.life >= 0 &&
        typeof obj.maxLife === "number" &&
        obj.maxLife > 0 &&
        obj.life <= obj.maxLife &&
        Object.values(ParticleType).includes(obj.type) &&
        (obj.alpha === undefined ||
            (typeof obj.alpha === "number" &&
                obj.alpha >= 0 &&
                obj.alpha <= 1)) &&
        (obj.rotation === undefined || typeof obj.rotation === "number") &&
        (obj.rotationSpeed === undefined ||
            typeof obj.rotationSpeed === "number")
    );
}

/**
 * 物理体类型守卫
 */
export function isPhysicsBody(obj: any): obj is IPhysicsBody {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.id === "string" &&
        obj.id.trim().length > 0 &&
        Object.values(PhysicsBodyType).includes(obj.type) &&
        typeof obj.position === "object" &&
        obj.position !== null &&
        typeof obj.position.x === "number" &&
        typeof obj.position.y === "number" &&
        typeof obj.velocity === "object" &&
        obj.velocity !== null &&
        typeof obj.velocity.x === "number" &&
        typeof obj.velocity.y === "number" &&
        typeof obj.mass === "number" &&
        obj.mass > 0 &&
        typeof obj.restitution === "number" &&
        obj.restitution >= 0 &&
        obj.restitution <= 1 &&
        typeof obj.friction === "number" &&
        obj.friction >= 0 &&
        typeof obj.isStatic === "boolean" &&
        typeof obj.isSleeping === "boolean" &&
        typeof obj.angle === "number" &&
        typeof obj.angularVelocity === "number"
    );
}

/**
 * 动画配置类型守卫
 */
export function isAnimationConfig(obj: any): obj is IAnimationConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.duration === "number" &&
        obj.duration > 0 &&
        typeof obj.ease === "string" &&
        obj.ease.trim().length > 0 &&
        typeof obj.delay === "number" &&
        obj.delay >= 0 &&
        (obj.stagger === undefined ||
            (typeof obj.stagger === "number" && obj.stagger >= 0)) &&
        (obj.repeat === undefined ||
            (typeof obj.repeat === "number" && obj.repeat >= 0)) &&
        (obj.yoyo === undefined || typeof obj.yoyo === "boolean") &&
        (obj.autoplay === undefined || typeof obj.autoplay === "boolean")
    );
}

/**
 * 验证技能数组
 */
export function validateSkills(skills: any[]): ISkill[] {
    if (!Array.isArray(skills)) {
        throw new Error("技能数据必须是数组格式");
    }

    const validSkills: ISkill[] = [];
    const errors: string[] = [];

    skills.forEach((skill, index) => {
        if (isSkill(skill)) {
            validSkills.push(skill);
        } else {
            errors.push(`技能数据第 ${index + 1} 项格式不正确`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`技能数据验证失败：${errors.join(", ")}`);
    }

    return validSkills;
}

/**
 * 验证工作经验数组
 */
export function validateWorkExperiences(experiences: any[]): IWorkExperience[] {
    if (!Array.isArray(experiences)) {
        throw new Error("工作经验数据必须是数组格式");
    }

    const validExperiences: IWorkExperience[] = [];
    const errors: string[] = [];

    experiences.forEach((experience, index) => {
        if (isWorkExperience(experience)) {
            validExperiences.push(experience);
        } else {
            errors.push(`工作经验数据第 ${index + 1} 项格式不正确`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`工作经验数据验证失败：${errors.join(", ")}`);
    }

    return validExperiences;
}

/**
 * 验证成就数组
 */
export function validateAchievements(achievements: any[]): IAchievement[] {
    if (!Array.isArray(achievements)) {
        throw new Error("成就数据必须是数组格式");
    }

    const validAchievements: IAchievement[] = [];
    const errors: string[] = [];

    achievements.forEach((achievement, index) => {
        if (isAchievement(achievement)) {
            validAchievements.push(achievement);
        } else {
            errors.push(`成就数据第 ${index + 1} 项格式不正确`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`成就数据验证失败：${errors.join(", ")}`);
    }

    return validAchievements;
}

/**
 * 验证完整的简历数据
 */
export function validateResumeData(data: any): {
    personalInfo: IPersonalInfo;
    skills: ISkill[];
    experiences: IWorkExperience[];
    achievements: IAchievement[];
} {
    const errors: string[] = [];

    // 验证个人信息
    if (!isPersonalInfo(data.personalInfo)) {
        errors.push("个人信息格式不正确");
    }

    // 验证技能数据
    let validSkills: ISkill[] = [];
    try {
        validSkills = validateSkills(data.skills || []);
    } catch (error) {
        errors.push((error as Error).message);
    }

    // 验证工作经验
    let validExperiences: IWorkExperience[] = [];
    try {
        validExperiences = validateWorkExperiences(data.experiences || []);
    } catch (error) {
        errors.push((error as Error).message);
    }

    // 验证成就数据
    let validAchievements: IAchievement[] = [];
    try {
        validAchievements = validateAchievements(data.achievements || []);
    } catch (error) {
        errors.push((error as Error).message);
    }

    if (errors.length > 0) {
        throw new Error(`简历数据验证失败：${errors.join("; ")}`);
    }

    return {
        personalInfo: data.personalInfo,
        skills: validSkills,
        experiences: validExperiences,
        achievements: validAchievements,
    };
}
/**
 * Canvas 配置类型守卫
 */
export function isCanvasConfig(
    obj: any,
): obj is import("@/types").ICanvasConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.width === "number" &&
        obj.width > 0 &&
        typeof obj.height === "number" &&
        obj.height > 0 &&
        typeof obj.pixelRatio === "number" &&
        obj.pixelRatio > 0 &&
        typeof obj.alpha === "boolean" &&
        (obj.backgroundColor === undefined ||
            typeof obj.backgroundColor === "string")
    );
}

/**
 * 粒子系统配置类型守卫
 */
export function isParticleSystemConfig(
    obj: any,
): obj is import("@/types").IParticleSystemConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.maxParticles === "number" &&
        obj.maxParticles > 0 &&
        typeof obj.emissionRate === "number" &&
        obj.emissionRate > 0 &&
        Array.isArray(obj.lifeRange) &&
        obj.lifeRange.length === 2 &&
        obj.lifeRange.every((val: any) => typeof val === "number" && val > 0) &&
        Array.isArray(obj.sizeRange) &&
        obj.sizeRange.length === 2 &&
        obj.sizeRange.every((val: any) => typeof val === "number" && val > 0) &&
        typeof obj.velocityRange === "object" &&
        obj.velocityRange !== null &&
        Array.isArray(obj.velocityRange.x) &&
        obj.velocityRange.x.length === 2 &&
        Array.isArray(obj.velocityRange.y) &&
        obj.velocityRange.y.length === 2 &&
        Array.isArray(obj.colors) &&
        obj.colors.every((color: any) => typeof color === "string") &&
        typeof obj.gravity === "object" &&
        obj.gravity !== null &&
        typeof obj.gravity.x === "number" &&
        typeof obj.gravity.y === "number" &&
        typeof obj.enableCollision === "boolean"
    );
}

/**
 * 物理世界配置类型守卫
 */
export function isPhysicsWorldConfig(
    obj: any,
): obj is import("@/types").IPhysicsWorldConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.gravity === "object" &&
        obj.gravity !== null &&
        typeof obj.gravity.x === "number" &&
        typeof obj.gravity.y === "number" &&
        typeof obj.enableCollision === "boolean" &&
        typeof obj.timeStep === "number" &&
        obj.timeStep > 0 &&
        typeof obj.velocityIterations === "number" &&
        obj.velocityIterations > 0 &&
        typeof obj.positionIterations === "number" &&
        obj.positionIterations > 0
    );
}

/**
 * 物理材质类型守卫
 */
export function isPhysicsMaterial(
    obj: any,
): obj is import("@/types").IPhysicsMaterial {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.name === "string" &&
        obj.name.trim().length > 0 &&
        typeof obj.density === "number" &&
        obj.density > 0 &&
        typeof obj.restitution === "number" &&
        obj.restitution >= 0 &&
        obj.restitution <= 1 &&
        typeof obj.friction === "number" &&
        obj.friction >= 0 &&
        typeof obj.frictionAir === "number" &&
        obj.frictionAir >= 0
    );
}

/**
 * Lottie 配置类型守卫
 */
export function isLottieConfig(
    obj: any,
): obj is import("@/types").ILottieConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        obj.animationData !== null &&
        typeof obj.animationData === "object" &&
        ["svg", "canvas", "html"].includes(obj.renderer) &&
        typeof obj.loop === "boolean" &&
        typeof obj.autoplay === "boolean" &&
        (obj.rendererSettings === undefined ||
            typeof obj.rendererSettings === "object")
    );
}

/**
 * 滚动触发配置类型守卫
 */
export function isScrollTriggerConfig(
    obj: any,
): obj is import("@/types").IScrollTriggerConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        (typeof obj.trigger === "string" ||
            obj.trigger instanceof HTMLElement) &&
        typeof obj.start === "string" &&
        obj.start.trim().length > 0 &&
        typeof obj.end === "string" &&
        obj.end.trim().length > 0 &&
        (obj.pin === undefined || typeof obj.pin === "boolean") &&
        (obj.scrub === undefined ||
            typeof obj.scrub === "boolean" ||
            typeof obj.scrub === "number") &&
        (obj.markers === undefined || typeof obj.markers === "boolean")
    );
}

/**
 * 性能配置类型守卫
 */
export function isPerformanceConfig(
    obj: any,
): obj is import("@/types").IPerformanceConfig {
    return (
        typeof obj === "object" &&
        obj !== null &&
        typeof obj.enableHardwareAcceleration === "boolean" &&
        typeof obj.maxConcurrentAnimations === "number" &&
        obj.maxConcurrentAnimations > 0 &&
        ["low", "medium", "high"].includes(obj.quality) &&
        typeof obj.enableAnimations === "boolean" &&
        typeof obj.reduceMotion === "boolean"
    );
}

/**
 * 验证粒子数组
 */
export function validateParticles(
    particles: any[],
): import("@/types").IParticle[] {
    if (!Array.isArray(particles)) {
        throw new Error("粒子数据必须是数组格式");
    }

    const validParticles: import("@/types").IParticle[] = [];
    const errors: string[] = [];

    particles.forEach((particle, index) => {
        if (isParticle(particle)) {
            validParticles.push(particle);
        } else {
            errors.push(`粒子数据第 ${index + 1} 项格式不正确`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`粒子数据验证失败：${errors.join(", ")}`);
    }

    return validParticles;
}

/**
 * 验证物理体数组
 */
export function validatePhysicsBodies(
    bodies: any[],
): import("@/types").IPhysicsBody[] {
    if (!Array.isArray(bodies)) {
        throw new Error("物理体数据必须是数组格式");
    }

    const validBodies: import("@/types").IPhysicsBody[] = [];
    const errors: string[] = [];

    bodies.forEach((body, index) => {
        if (isPhysicsBody(body)) {
            validBodies.push(body);
        } else {
            errors.push(`物理体数据第 ${index + 1} 项格式不正确`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`物理体数据验证失败：${errors.join(", ")}`);
    }

    return validBodies;
}

/**
 * 创建默认的 Canvas 配置
 */
export function createDefaultCanvasConfig(): import("@/types").ICanvasConfig {
    return {
        width: 800,
        height: 600,
        pixelRatio: window.devicePixelRatio || 1,
        alpha: true,
        backgroundColor: "transparent",
    };
}

/**
 * 创建默认的物理世界配置
 */
export function createDefaultPhysicsWorldConfig(): import("@/types").IPhysicsWorldConfig {
    return {
        gravity: { x: 0, y: 1 },
        enableCollision: true,
        timeStep: 1 / 60,
        velocityIterations: 6,
        positionIterations: 2,
    };
}

/**
 * 创建默认的粒子系统配置
 */
export function createDefaultParticleSystemConfig(): import("@/types").IParticleSystemConfig {
    return {
        maxParticles: 100,
        emissionRate: 10,
        lifeRange: [1, 3],
        sizeRange: [2, 8],
        velocityRange: {
            x: [-50, 50],
            y: [-100, -50],
        },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        gravity: { x: 0, y: 50 },
        enableCollision: false,
    };
}

/**
 * 创建默认的性能配置
 */
export function createDefaultPerformanceConfig(): import("@/types").IPerformanceConfig {
    return {
        enableHardwareAcceleration: true,
        maxConcurrentAnimations: 10,
        quality: "high",
        enableAnimations: true,
        reduceMotion: false,
    };
}
