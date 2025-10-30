// 类型守卫函数单元测试

import { describe, it, expect } from "vitest";
import {
    isValidEmail,
    isValidPhone,
    isValidDate,
    isValidUrl,
    isPersonalInfo,
    isSkill,
    isProject,
    isWorkExperience,
    isAchievement,
    isParticle,
    isPhysicsBody,
    isAnimationConfig,
    validateSkills,
    validateWorkExperiences,
    validateAchievements,
    validateResumeData,
    createDefaultCanvasConfig,
    createDefaultPhysicsWorldConfig,
    createDefaultParticleSystemConfig,
    createDefaultPerformanceConfig,
} from "./type-guards";
import {
    SkillCategory,
    SkillLevel,
    AchievementLevel,
    AchievementCategory,
    ParticleType,
    PhysicsBodyType,
} from "@/types";

describe("基础验证函数", () => {
    describe("isValidEmail", () => {
        it("应该验证有效的邮箱地址", () => {
            expect(isValidEmail("test@example.com")).toBe(true);
            expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
            expect(isValidEmail("user+tag@example.org")).toBe(true);
        });

        it("应该拒绝无效的邮箱地址", () => {
            expect(isValidEmail("invalid-email")).toBe(false);
            expect(isValidEmail("test@")).toBe(false);
            expect(isValidEmail("@example.com")).toBe(false);
            expect(isValidEmail("test..test@example.com")).toBe(false);
        });
    });

    describe("isValidPhone", () => {
        it("应该验证有效的中国大陆手机号", () => {
            expect(isValidPhone("13812345678")).toBe(true);
            expect(isValidPhone("15987654321")).toBe(true);
            expect(isValidPhone("18666666666")).toBe(true);
        });

        it("应该拒绝无效的手机号", () => {
            expect(isValidPhone("12345678901")).toBe(false);
            expect(isValidPhone("1381234567")).toBe(false);
            expect(isValidPhone("138123456789")).toBe(false);
            expect(isValidPhone("abc12345678")).toBe(false);
        });
    });

    describe("isValidDate", () => {
        it("应该验证有效的日期格式", () => {
            expect(isValidDate("2023-12-25")).toBe(true);
            expect(isValidDate("2024-01-01")).toBe(true);
            expect(isValidDate("2022-06-15")).toBe(true);
        });

        it("应该拒绝无效的日期格式", () => {
            expect(isValidDate("2023/12/25")).toBe(false);
            expect(isValidDate("25-12-2023")).toBe(false);
            expect(isValidDate("2023-13-01")).toBe(false);
            expect(isValidDate("2023-02-30")).toBe(false);
        });
    });

    describe("isValidUrl", () => {
        it("应该验证有效的 URL", () => {
            expect(isValidUrl("https://example.com")).toBe(true);
            expect(isValidUrl("http://localhost:3000")).toBe(true);
            expect(isValidUrl("https://github.com/user/repo")).toBe(true);
        });

        it("应该拒绝无效的 URL", () => {
            expect(isValidUrl("not-a-url")).toBe(false);
            expect(isValidUrl("ftp://invalid")).toBe(false);
            expect(isValidUrl("")).toBe(false);
        });
    });
});

describe("数据模型类型守卫", () => {
    describe("isPersonalInfo", () => {
        const validPersonalInfo = {
            name: "徐思宏",
            age: 28,
            location: "北京",
            email: "xusihong@example.com",
            phone: "13812345678",
            salary: "25K-30K",
            avatar: "https://example.com/avatar.jpg",
            bio: "4年游戏后端开发经验",
            position: "高级后端工程师",
            experience: 4,
        };

        it("应该验证有效的个人信息", () => {
            expect(isPersonalInfo(validPersonalInfo)).toBe(true);
        });

        it("应该验证必填字段缺失的情况", () => {
            const invalidInfo = { ...validPersonalInfo };
            delete invalidInfo.name;
            expect(isPersonalInfo(invalidInfo)).toBe(false);
        });

        it("应该验证邮箱格式", () => {
            const invalidInfo = {
                ...validPersonalInfo,
                email: "invalid-email",
            };
            expect(isPersonalInfo(invalidInfo)).toBe(false);
        });

        it("应该验证手机号格式", () => {
            const invalidInfo = { ...validPersonalInfo, phone: "12345" };
            expect(isPersonalInfo(invalidInfo)).toBe(false);
        });

        it("应该验证年龄范围", () => {
            const invalidInfo1 = { ...validPersonalInfo, age: 0 };
            const invalidInfo2 = { ...validPersonalInfo, age: 200 };
            expect(isPersonalInfo(invalidInfo1)).toBe(false);
            expect(isPersonalInfo(invalidInfo2)).toBe(false);
        });
    });

    describe("isSkill", () => {
        const validSkill = {
            id: "skill-1",
            name: "TypeScript",
            category: SkillCategory.LANGUAGE,
            level: 8,
            icon: "typescript-icon",
            color: "#3178c6",
            experience: 3,
            description: "TypeScript 开发经验",
        };

        it("应该验证有效的技能数据", () => {
            expect(isSkill(validSkill)).toBe(true);
        });

        it("应该验证技能等级范围", () => {
            const invalidSkill1 = { ...validSkill, level: 0 };
            const invalidSkill2 = { ...validSkill, level: 11 };
            expect(isSkill(invalidSkill1)).toBe(false);
            expect(isSkill(invalidSkill2)).toBe(false);
        });

        it("应该验证技能类别", () => {
            const invalidSkill = {
                ...validSkill,
                category: "invalid-category",
            };
            expect(isSkill(invalidSkill)).toBe(false);
        });

        it("应该验证经验年限", () => {
            const invalidSkill = { ...validSkill, experience: -1 };
            expect(isSkill(invalidSkill)).toBe(false);
        });
    });

    describe("isProject", () => {
        const validProject = {
            id: "project-1",
            name: "游戏后端系统",
            description: "大型多人在线游戏后端架构",
            technologies: ["Node.js", "Redis", "MongoDB"],
            highlights: ["高并发处理", "实时通信"],
            role: "后端负责人",
            url: "https://github.com/user/project",
            startDate: "2023-01-01",
            endDate: "2023-12-31",
        };

        it("应该验证有效的项目数据", () => {
            expect(isProject(validProject)).toBe(true);
        });

        it("应该验证技术栈数组", () => {
            const invalidProject = {
                ...validProject,
                technologies: "not-array",
            };
            expect(isProject(invalidProject)).toBe(false);
        });

        it("应该验证项目 URL", () => {
            const invalidProject = { ...validProject, url: "invalid-url" };
            expect(isProject(invalidProject)).toBe(false);
        });

        it("应该验证日期格式", () => {
            const invalidProject = { ...validProject, startDate: "2023/01/01" };
            expect(isProject(invalidProject)).toBe(false);
        });
    });

    describe("isWorkExperience", () => {
        const validExperience = {
            id: "exp-1",
            company: "腾讯游戏",
            position: "高级后端工程师",
            startDate: "2020-01-01",
            endDate: "2024-01-01",
            description: "负责游戏后端开发",
            projects: [],
            technologies: ["Node.js", "Redis"],
            logo: "tencent-logo.png",
            location: "深圳",
        };

        it("应该验证有效的工作经验", () => {
            expect(isWorkExperience(validExperience)).toBe(true);
        });

        it("应该允许 endDate 为 null（当前工作）", () => {
            const currentJob = { ...validExperience, endDate: null };
            expect(isWorkExperience(currentJob)).toBe(true);
        });

        it("应该验证项目数组", () => {
            const invalidExperience = {
                ...validExperience,
                projects: "not-array",
            };
            expect(isWorkExperience(invalidExperience)).toBe(false);
        });
    });

    describe("isAchievement", () => {
        const validAchievement = {
            id: "achievement-1",
            title: "优秀员工奖",
            organization: "腾讯游戏",
            date: "2023-12-31",
            level: AchievementLevel.GOLD,
            category: AchievementCategory.AWARD,
            icon: "trophy-icon",
            description: "年度优秀员工",
            certificateUrl: "https://example.com/certificate.pdf",
        };

        it("应该验证有效的成就数据", () => {
            expect(isAchievement(validAchievement)).toBe(true);
        });

        it("应该验证成就等级", () => {
            const invalidAchievement = {
                ...validAchievement,
                level: "invalid-level",
            };
            expect(isAchievement(invalidAchievement)).toBe(false);
        });

        it("应该验证成就类别", () => {
            const invalidAchievement = {
                ...validAchievement,
                category: "invalid-category",
            };
            expect(isAchievement(invalidAchievement)).toBe(false);
        });

        it("应该验证证书 URL", () => {
            const invalidAchievement = {
                ...validAchievement,
                certificateUrl: "invalid-url",
            };
            expect(isAchievement(invalidAchievement)).toBe(false);
        });
    });
});

describe("Canvas 和物理引擎类型守卫", () => {
    describe("isParticle", () => {
        const validParticle = {
            x: 100,
            y: 200,
            vx: 10,
            vy: -20,
            size: 5,
            color: "#ff0000",
            life: 50,
            maxLife: 100,
            type: ParticleType.CIRCLE,
            alpha: 0.8,
            rotation: 0,
            rotationSpeed: 0.1,
        };

        it("应该验证有效的粒子数据", () => {
            expect(isParticle(validParticle)).toBe(true);
        });

        it("应该验证粒子大小", () => {
            const invalidParticle = { ...validParticle, size: 0 };
            expect(isParticle(invalidParticle)).toBe(false);
        });

        it("应该验证生命值范围", () => {
            const invalidParticle = {
                ...validParticle,
                life: 150,
                maxLife: 100,
            };
            expect(isParticle(invalidParticle)).toBe(false);
        });

        it("应该验证透明度范围", () => {
            const invalidParticle = { ...validParticle, alpha: 1.5 };
            expect(isParticle(invalidParticle)).toBe(false);
        });

        it("应该验证粒子类型", () => {
            const invalidParticle = { ...validParticle, type: "invalid-type" };
            expect(isParticle(invalidParticle)).toBe(false);
        });
    });

    describe("isPhysicsBody", () => {
        const validPhysicsBody = {
            id: "body-1",
            type: PhysicsBodyType.CIRCLE,
            position: { x: 100, y: 200 },
            velocity: { x: 10, y: -5 },
            mass: 1.0,
            restitution: 0.8,
            friction: 0.3,
            isStatic: false,
            isSleeping: false,
            angle: 0,
            angularVelocity: 0,
        };

        it("应该验证有效的物理体数据", () => {
            expect(isPhysicsBody(validPhysicsBody)).toBe(true);
        });

        it("应该验证质量大于零", () => {
            const invalidBody = { ...validPhysicsBody, mass: 0 };
            expect(isPhysicsBody(invalidBody)).toBe(false);
        });

        it("应该验证弹性系数范围", () => {
            const invalidBody1 = { ...validPhysicsBody, restitution: -0.1 };
            const invalidBody2 = { ...validPhysicsBody, restitution: 1.1 };
            expect(isPhysicsBody(invalidBody1)).toBe(false);
            expect(isPhysicsBody(invalidBody2)).toBe(false);
        });

        it("应该验证摩擦系数", () => {
            const invalidBody = { ...validPhysicsBody, friction: -0.1 };
            expect(isPhysicsBody(invalidBody)).toBe(false);
        });

        it("应该验证物理体类型", () => {
            const invalidBody = { ...validPhysicsBody, type: "invalid-type" };
            expect(isPhysicsBody(invalidBody)).toBe(false);
        });
    });

    describe("isAnimationConfig", () => {
        const validAnimationConfig = {
            duration: 1.0,
            ease: "power2.out",
            delay: 0.5,
            stagger: 0.1,
            repeat: 2,
            yoyo: true,
            autoplay: false,
        };

        it("应该验证有效的动画配置", () => {
            expect(isAnimationConfig(validAnimationConfig)).toBe(true);
        });

        it("应该验证持续时间大于零", () => {
            const invalidConfig = { ...validAnimationConfig, duration: 0 };
            expect(isAnimationConfig(invalidConfig)).toBe(false);
        });

        it("应该验证延迟时间非负", () => {
            const invalidConfig = { ...validAnimationConfig, delay: -1 };
            expect(isAnimationConfig(invalidConfig)).toBe(false);
        });

        it("应该验证交错时间非负", () => {
            const invalidConfig = { ...validAnimationConfig, stagger: -0.1 };
            expect(isAnimationConfig(invalidConfig)).toBe(false);
        });

        it("应该验证重复次数非负", () => {
            const invalidConfig = { ...validAnimationConfig, repeat: -1 };
            expect(isAnimationConfig(invalidConfig)).toBe(false);
        });
    });
});

describe("数据验证函数", () => {
    describe("validateSkills", () => {
        const validSkills = [
            {
                id: "skill-1",
                name: "TypeScript",
                category: SkillCategory.LANGUAGE,
                level: 8,
                icon: "typescript-icon",
                color: "#3178c6",
                experience: 3,
            },
            {
                id: "skill-2",
                name: "Vue.js",
                category: SkillCategory.FRAMEWORK,
                level: 7,
                icon: "vue-icon",
                color: "#4fc08d",
                experience: 2,
            },
        ];

        it("应该验证有效的技能数组", () => {
            expect(() => validateSkills(validSkills)).not.toThrow();
            const result = validateSkills(validSkills);
            expect(result).toHaveLength(2);
        });

        it("应该拒绝非数组输入", () => {
            expect(() => validateSkills("not-array" as any)).toThrow(
                "技能数据必须是数组格式",
            );
        });

        it("应该拒绝包含无效技能的数组", () => {
            const invalidSkills = [...validSkills, { invalid: "skill" }];
            expect(() => validateSkills(invalidSkills)).toThrow(
                "技能数据验证失败",
            );
        });
    });

    describe("validateResumeData", () => {
        const validResumeData = {
            personalInfo: {
                name: "徐思宏",
                age: 28,
                location: "北京",
                email: "xusihong@example.com",
                phone: "13812345678",
                salary: "25K-30K",
            },
            skills: [
                {
                    id: "skill-1",
                    name: "TypeScript",
                    category: SkillCategory.LANGUAGE,
                    level: 8,
                    icon: "typescript-icon",
                    color: "#3178c6",
                    experience: 3,
                },
            ],
            experiences: [
                {
                    id: "exp-1",
                    company: "腾讯游戏",
                    position: "高级后端工程师",
                    startDate: "2020-01-01",
                    endDate: "2024-01-01",
                    description: "负责游戏后端开发",
                    projects: [],
                    technologies: ["Node.js", "Redis"],
                },
            ],
            achievements: [
                {
                    id: "achievement-1",
                    title: "优秀员工奖",
                    organization: "腾讯游戏",
                    date: "2023-12-31",
                    level: AchievementLevel.GOLD,
                    category: AchievementCategory.AWARD,
                    icon: "trophy-icon",
                },
            ],
        };

        it("应该验证有效的简历数据", () => {
            expect(() => validateResumeData(validResumeData)).not.toThrow();
            const result = validateResumeData(validResumeData);
            expect(result.personalInfo).toBeDefined();
            expect(result.skills).toHaveLength(1);
            expect(result.experiences).toHaveLength(1);
            expect(result.achievements).toHaveLength(1);
        });

        it("应该拒绝无效的个人信息", () => {
            const invalidData = {
                ...validResumeData,
                personalInfo: { invalid: "data" },
            };
            expect(() => validateResumeData(invalidData)).toThrow(
                "个人信息格式不正确",
            );
        });
    });
});

describe("默认配置创建函数", () => {
    describe("createDefaultCanvasConfig", () => {
        it("应该创建有效的默认 Canvas 配置", () => {
            const config = createDefaultCanvasConfig();
            expect(config.width).toBe(800);
            expect(config.height).toBe(600);
            expect(config.pixelRatio).toBeGreaterThan(0);
            expect(config.alpha).toBe(true);
            expect(config.backgroundColor).toBe("transparent");
        });
    });

    describe("createDefaultPhysicsWorldConfig", () => {
        it("应该创建有效的默认物理世界配置", () => {
            const config = createDefaultPhysicsWorldConfig();
            expect(config.gravity).toEqual({ x: 0, y: 1 });
            expect(config.enableCollision).toBe(true);
            expect(config.timeStep).toBe(1 / 60);
            expect(config.velocityIterations).toBe(6);
            expect(config.positionIterations).toBe(2);
        });
    });

    describe("createDefaultParticleSystemConfig", () => {
        it("应该创建有效的默认粒子系统配置", () => {
            const config = createDefaultParticleSystemConfig();
            expect(config.maxParticles).toBe(100);
            expect(config.emissionRate).toBe(10);
            expect(config.lifeRange).toEqual([1, 3]);
            expect(config.sizeRange).toEqual([2, 8]);
            expect(config.colors).toHaveLength(4);
            expect(config.gravity).toEqual({ x: 0, y: 50 });
            expect(config.enableCollision).toBe(false);
        });
    });

    describe("createDefaultPerformanceConfig", () => {
        it("应该创建有效的默认性能配置", () => {
            const config = createDefaultPerformanceConfig();
            expect(config.enableHardwareAcceleration).toBe(true);
            expect(config.maxConcurrentAnimations).toBe(10);
            expect(config.quality).toBe("high");
            expect(config.enableAnimations).toBe(true);
            expect(config.reduceMotion).toBe(false);
        });
    });
});
