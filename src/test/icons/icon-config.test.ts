// 图标配置工具测试

import { describe, it, expect } from "vitest";
import {
    TECH_ICON_CONFIG,
    ACHIEVEMENT_ICON_CONFIG,
    ICON_LIBRARY_CONFIG,
    getTechIconConfig,
    getAchievementIconConfig,
    searchIconsByTag,
    getAllIconTags,
} from "@/utils/icon-config";

describe("图标配置工具", () => {
    describe("TECH_ICON_CONFIG", () => {
        it("应该包含所有技术栈图标配置", () => {
            expect(TECH_ICON_CONFIG).toBeDefined();
            expect(Object.keys(TECH_ICON_CONFIG).length).toBeGreaterThan(0);
        });

        it("应该包含 Java 图标配置", () => {
            expect(TECH_ICON_CONFIG.java).toBeDefined();
            expect(TECH_ICON_CONFIG.java.name).toBe("java");
            expect(TECH_ICON_CONFIG.java.type).toBe("tech");
            expect(TECH_ICON_CONFIG.java.defaultColor).toBe("#ED8B00");
        });

        it("应该包含 Vue 图标配置", () => {
            expect(TECH_ICON_CONFIG.vue).toBeDefined();
            expect(TECH_ICON_CONFIG.vue.name).toBe("vue");
            expect(TECH_ICON_CONFIG.vue.defaultColor).toBe("#4FC08D");
        });

        it("每个图标配置应该有必需的属性", () => {
            Object.values(TECH_ICON_CONFIG).forEach((config) => {
                expect(config).toHaveProperty("name");
                expect(config).toHaveProperty("type");
                expect(config).toHaveProperty("defaultColor");
                expect(config).toHaveProperty("description");
                expect(config).toHaveProperty("tags");
                expect(Array.isArray(config.tags)).toBe(true);
            });
        });
    });

    describe("ACHIEVEMENT_ICON_CONFIG", () => {
        it("应该包含所有成就图标配置", () => {
            expect(ACHIEVEMENT_ICON_CONFIG).toBeDefined();
            expect(Object.keys(ACHIEVEMENT_ICON_CONFIG).length).toBeGreaterThan(
                0,
            );
        });

        it("应该包含奖杯图标配置", () => {
            expect(ACHIEVEMENT_ICON_CONFIG.trophy).toBeDefined();
            expect(ACHIEVEMENT_ICON_CONFIG.trophy.name).toBe("trophy");
            expect(ACHIEVEMENT_ICON_CONFIG.trophy.type).toBe("achievement");
            expect(ACHIEVEMENT_ICON_CONFIG.trophy.defaultColor).toBe("#FFD700");
        });

        it("每个图标配置应该有必需的属性", () => {
            Object.values(ACHIEVEMENT_ICON_CONFIG).forEach((config) => {
                expect(config).toHaveProperty("name");
                expect(config).toHaveProperty("type");
                expect(config).toHaveProperty("defaultColor");
                expect(config).toHaveProperty("description");
                expect(config).toHaveProperty("tags");
                expect(Array.isArray(config.tags)).toBe(true);
            });
        });
    });

    describe("ICON_LIBRARY_CONFIG", () => {
        it("应该包含技术栈和成就图标配置", () => {
            expect(ICON_LIBRARY_CONFIG).toBeDefined();
            expect(ICON_LIBRARY_CONFIG.techIcons).toBe(TECH_ICON_CONFIG);
            expect(ICON_LIBRARY_CONFIG.achievementIcons).toBe(
                ACHIEVEMENT_ICON_CONFIG,
            );
        });
    });

    describe("getTechIconConfig", () => {
        it("应该返回正确的技术栈图标配置", () => {
            const javaConfig = getTechIconConfig("java");
            expect(javaConfig).toBe(TECH_ICON_CONFIG.java);
        });

        it("应该对不存在的图标返回 null", () => {
            const unknownConfig = getTechIconConfig("unknown" as any);
            expect(unknownConfig).toBeNull();
        });
    });

    describe("getAchievementIconConfig", () => {
        it("应该返回正确的成就图标配置", () => {
            const trophyConfig = getAchievementIconConfig("trophy");
            expect(trophyConfig).toBe(ACHIEVEMENT_ICON_CONFIG.trophy);
        });

        it("应该对不存在的图标返回 null", () => {
            const unknownConfig = getAchievementIconConfig("unknown" as any);
            expect(unknownConfig).toBeNull();
        });
    });

    describe("searchIconsByTag", () => {
        it("应该根据标签搜索图标", () => {
            const frameworkIcons = searchIconsByTag("框架");
            expect(frameworkIcons.length).toBeGreaterThan(0);

            frameworkIcons.forEach((icon) => {
                expect(icon.tags).toContain("框架");
            });
        });

        it("应该搜索技术栈和成就图标", () => {
            const results = searchIconsByTag("编程语言");
            expect(results.length).toBeGreaterThan(0);
        });

        it("应该对不存在的标签返回空数组", () => {
            const results = searchIconsByTag("不存在的标签");
            expect(results).toEqual([]);
        });
    });

    describe("getAllIconTags", () => {
        it("应该返回所有图标标签", () => {
            const tags = getAllIconTags();
            expect(Array.isArray(tags)).toBe(true);
            expect(tags.length).toBeGreaterThan(0);
        });

        it("应该返回排序后的标签", () => {
            const tags = getAllIconTags();
            const sortedTags = [...tags].sort();
            expect(tags).toEqual(sortedTags);
        });

        it("应该包含技术栈和成就图标的标签", () => {
            const tags = getAllIconTags();
            expect(tags).toContain("编程语言");
            expect(tags).toContain("奖杯");
        });

        it("应该去重标签", () => {
            const tags = getAllIconTags();
            const uniqueTags = [...new Set(tags)];
            expect(tags.length).toBe(uniqueTags.length);
        });
    });
});
