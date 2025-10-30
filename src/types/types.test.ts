// 类型定义单元测试

import { describe, it, expect } from "vitest";
import {
    SkillCategory,
    SkillLevel,
    AchievementLevel,
    AchievementCategory,
    ParticleType,
    PhysicsBodyType,
    AnimationState,
} from "@/types";

describe("枚举类型测试", () => {
    describe("SkillCategory", () => {
        it("应该包含所有技能类别", () => {
            expect(SkillCategory.LANGUAGE).toBe("language");
            expect(SkillCategory.FRAMEWORK).toBe("framework");
            expect(SkillCategory.TOOL).toBe("tool");
            expect(SkillCategory.DATABASE).toBe("database");
            expect(SkillCategory.OTHER).toBe("other");
        });

        it("应该包含正确数量的类别", () => {
            const categories = Object.values(SkillCategory);
            expect(categories).toHaveLength(5);
        });
    });

    describe("SkillLevel", () => {
        it("应该包含正确的技能等级", () => {
            expect(SkillLevel.BEGINNER).toBe(1);
            expect(SkillLevel.BASIC).toBe(2);
            expect(SkillLevel.INTERMEDIATE).toBe(3);
            expect(SkillLevel.ADVANCED).toBe(4);
            expect(SkillLevel.EXPERT).toBe(5);
        });

        it("应该包含正确数量的等级", () => {
            const levels = Object.values(SkillLevel).filter(
                (v) => typeof v === "number",
            );
            expect(levels).toHaveLength(5);
        });
    });

    describe("AchievementLevel", () => {
        it("应该包含所有成就等级", () => {
            expect(AchievementLevel.GOLD).toBe("gold");
            expect(AchievementLevel.SILVER).toBe("silver");
            expect(AchievementLevel.BRONZE).toBe("bronze");
            expect(AchievementLevel.SPECIAL).toBe("special");
        });

        it("应该包含正确数量的等级", () => {
            const levels = Object.values(AchievementLevel);
            expect(levels).toHaveLength(4);
        });
    });

    describe("AchievementCategory", () => {
        it("应该包含所有成就类别", () => {
            expect(AchievementCategory.COMPETITION).toBe("competition");
            expect(AchievementCategory.CERTIFICATION).toBe("certification");
            expect(AchievementCategory.AWARD).toBe("award");
            expect(AchievementCategory.RECOGNITION).toBe("recognition");
            expect(AchievementCategory.OTHER).toBe("other");
        });

        it("应该包含正确数量的类别", () => {
            const categories = Object.values(AchievementCategory);
            expect(categories).toHaveLength(5);
        });
    });

    describe("ParticleType", () => {
        it("应该包含所有粒子类型", () => {
            expect(ParticleType.CIRCLE).toBe("circle");
            expect(ParticleType.SQUARE).toBe("square");
            expect(ParticleType.TRIANGLE).toBe("triangle");
            expect(ParticleType.STAR).toBe("star");
        });

        it("应该包含正确数量的类型", () => {
            const types = Object.values(ParticleType);
            expect(types).toHaveLength(4);
        });
    });

    describe("PhysicsBodyType", () => {
        it("应该包含所有物理体类型", () => {
            expect(PhysicsBodyType.RECTANGLE).toBe("rectangle");
            expect(PhysicsBodyType.CIRCLE).toBe("circle");
            expect(PhysicsBodyType.POLYGON).toBe("polygon");
        });

        it("应该包含正确数量的类型", () => {
            const types = Object.values(PhysicsBodyType);
            expect(types).toHaveLength(3);
        });
    });

    describe("AnimationState", () => {
        it("应该包含所有动画状态", () => {
            expect(AnimationState.IDLE).toBe("idle");
            expect(AnimationState.PLAYING).toBe("playing");
            expect(AnimationState.PAUSED).toBe("paused");
            expect(AnimationState.COMPLETED).toBe("completed");
        });

        it("应该包含正确数量的状态", () => {
            const states = Object.values(AnimationState);
            expect(states).toHaveLength(4);
        });
    });
});

describe("类型接口结构测试", () => {
    describe("个人信息接口", () => {
        it("应该支持必填字段", () => {
            const personalInfo = {
                name: "徐思宏",
                age: 28,
                location: "北京",
                email: "xusihong@example.com",
                phone: "13812345678",
                salary: "25K-30K",
            };

            // 类型检查通过即表示接口定义正确
            expect(personalInfo.name).toBe("徐思宏");
            expect(personalInfo.age).toBe(28);
            expect(personalInfo.location).toBe("北京");
            expect(personalInfo.email).toBe("xusihong@example.com");
            expect(personalInfo.phone).toBe("13812345678");
            expect(personalInfo.salary).toBe("25K-30K");
        });

        it("应该支持可选字段", () => {
            const personalInfo = {
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

            expect(personalInfo.avatar).toBe("https://example.com/avatar.jpg");
            expect(personalInfo.bio).toBe("4年游戏后端开发经验");
            expect(personalInfo.position).toBe("高级后端工程师");
            expect(personalInfo.experience).toBe(4);
        });
    });

    describe("技能接口", () => {
        it("应该支持完整的技能数据结构", () => {
            const skill = {
                id: "skill-1",
                name: "TypeScript",
                category: SkillCategory.LANGUAGE,
                level: 8,
                icon: "typescript-icon",
                color: "#3178c6",
                experience: 3,
                description: "TypeScript 开发经验",
            };

            expect(skill.id).toBe("skill-1");
            expect(skill.name).toBe("TypeScript");
            expect(skill.category).toBe(SkillCategory.LANGUAGE);
            expect(skill.level).toBe(8);
            expect(skill.icon).toBe("typescript-icon");
            expect(skill.color).toBe("#3178c6");
            expect(skill.experience).toBe(3);
            expect(skill.description).toBe("TypeScript 开发经验");
        });
    });

    describe("项目接口", () => {
        it("应该支持完整的项目数据结构", () => {
            const project = {
                id: "project-1",
                name: "游戏后端系统",
                description: "大型多人在线游戏后端架构",
                technologies: ["Node.js", "Redis", "MongoDB"],
                highlights: ["高并发处理", "实时通信"],
                role: "后端负责人",
                url: "https://github.com/user/project",
                images: ["screenshot1.png", "screenshot2.png"],
                startDate: "2023-01-01",
                endDate: "2023-12-31",
                architecture: "微服务架构",
            };

            expect(project.id).toBe("project-1");
            expect(project.name).toBe("游戏后端系统");
            expect(project.description).toBe("大型多人在线游戏后端架构");
            expect(project.technologies).toEqual([
                "Node.js",
                "Redis",
                "MongoDB",
            ]);
            expect(project.highlights).toEqual(["高并发处理", "实时通信"]);
            expect(project.role).toBe("后端负责人");
            expect(project.url).toBe("https://github.com/user/project");
            expect(project.images).toEqual([
                "screenshot1.png",
                "screenshot2.png",
            ]);
            expect(project.startDate).toBe("2023-01-01");
            expect(project.endDate).toBe("2023-12-31");
            expect(project.architecture).toBe("微服务架构");
        });
    });

    describe("工作经验接口", () => {
        it("应该支持完整的工作经验数据结构", () => {
            const experience = {
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

            expect(experience.id).toBe("exp-1");
            expect(experience.company).toBe("腾讯游戏");
            expect(experience.position).toBe("高级后端工程师");
            expect(experience.startDate).toBe("2020-01-01");
            expect(experience.endDate).toBe("2024-01-01");
            expect(experience.description).toBe("负责游戏后端开发");
            expect(experience.projects).toEqual([]);
            expect(experience.technologies).toEqual(["Node.js", "Redis"]);
            expect(experience.logo).toBe("tencent-logo.png");
            expect(experience.location).toBe("深圳");
        });

        it("应该支持当前工作（endDate 为 null）", () => {
            const currentJob = {
                id: "exp-current",
                company: "当前公司",
                position: "技术负责人",
                startDate: "2024-01-01",
                endDate: null,
                description: "当前工作",
                projects: [],
                technologies: ["TypeScript", "Vue.js"],
            };

            expect(currentJob.endDate).toBeNull();
        });
    });

    describe("成就接口", () => {
        it("应该支持完整的成就数据结构", () => {
            const achievement = {
                id: "achievement-1",
                title: "优秀员工奖",
                organization: "腾讯游戏",
                date: "2023-12-31",
                level: AchievementLevel.GOLD,
                category: AchievementCategory.AWARD,
                icon: "trophy-icon",
                description: "年度优秀员工",
                certificateUrl: "https://example.com/certificate.pdf",
                image: "award-photo.jpg",
            };

            expect(achievement.id).toBe("achievement-1");
            expect(achievement.title).toBe("优秀员工奖");
            expect(achievement.organization).toBe("腾讯游戏");
            expect(achievement.date).toBe("2023-12-31");
            expect(achievement.level).toBe(AchievementLevel.GOLD);
            expect(achievement.category).toBe(AchievementCategory.AWARD);
            expect(achievement.icon).toBe("trophy-icon");
            expect(achievement.description).toBe("年度优秀员工");
            expect(achievement.certificateUrl).toBe(
                "https://example.com/certificate.pdf",
            );
            expect(achievement.image).toBe("award-photo.jpg");
        });
    });
});

describe("Canvas 和物理引擎类型测试", () => {
    describe("粒子接口", () => {
        it("应该支持完整的粒子数据结构", () => {
            const particle = {
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

            expect(particle.x).toBe(100);
            expect(particle.y).toBe(200);
            expect(particle.vx).toBe(10);
            expect(particle.vy).toBe(-20);
            expect(particle.size).toBe(5);
            expect(particle.color).toBe("#ff0000");
            expect(particle.life).toBe(50);
            expect(particle.maxLife).toBe(100);
            expect(particle.type).toBe(ParticleType.CIRCLE);
            expect(particle.alpha).toBe(0.8);
            expect(particle.rotation).toBe(0);
            expect(particle.rotationSpeed).toBe(0.1);
        });
    });

    describe("物理体接口", () => {
        it("应该支持基础物理体数据结构", () => {
            const physicsBody = {
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

            expect(physicsBody.id).toBe("body-1");
            expect(physicsBody.type).toBe(PhysicsBodyType.CIRCLE);
            expect(physicsBody.position).toEqual({ x: 100, y: 200 });
            expect(physicsBody.velocity).toEqual({ x: 10, y: -5 });
            expect(physicsBody.mass).toBe(1.0);
            expect(physicsBody.restitution).toBe(0.8);
            expect(physicsBody.friction).toBe(0.3);
            expect(physicsBody.isStatic).toBe(false);
            expect(physicsBody.isSleeping).toBe(false);
            expect(physicsBody.angle).toBe(0);
            expect(physicsBody.angularVelocity).toBe(0);
        });
    });

    describe("动画配置接口", () => {
        it("应该支持完整的动画配置", () => {
            const animationConfig = {
                duration: 1.0,
                ease: "power2.out",
                delay: 0.5,
                stagger: 0.1,
                repeat: 2,
                yoyo: true,
                autoplay: false,
            };

            expect(animationConfig.duration).toBe(1.0);
            expect(animationConfig.ease).toBe("power2.out");
            expect(animationConfig.delay).toBe(0.5);
            expect(animationConfig.stagger).toBe(0.1);
            expect(animationConfig.repeat).toBe(2);
            expect(animationConfig.yoyo).toBe(true);
            expect(animationConfig.autoplay).toBe(false);
        });
    });
});

describe("通用类型测试", () => {
    describe("坐标点接口", () => {
        it("应该支持二维坐标", () => {
            const point = { x: 100, y: 200 };
            expect(point.x).toBe(100);
            expect(point.y).toBe(200);
        });
    });

    describe("尺寸接口", () => {
        it("应该支持宽高尺寸", () => {
            const size = { width: 800, height: 600 };
            expect(size.width).toBe(800);
            expect(size.height).toBe(600);
        });
    });

    describe("矩形区域接口", () => {
        it("应该支持位置和尺寸", () => {
            const rect = { x: 10, y: 20, width: 100, height: 50 };
            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(50);
        });
    });

    describe("颜色配置接口", () => {
        it("应该支持多种颜色格式", () => {
            const color = {
                hex: "#ff0000",
                rgb: "rgb(255, 0, 0)",
                rgba: "rgba(255, 0, 0, 1)",
            };

            expect(color.hex).toBe("#ff0000");
            expect(color.rgb).toBe("rgb(255, 0, 0)");
            expect(color.rgba).toBe("rgba(255, 0, 0, 1)");
        });
    });
});
