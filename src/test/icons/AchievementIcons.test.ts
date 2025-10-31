// 成就图标组件测试

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AchievementIcons from "@/components/icons/AchievementIcons.vue";
import { AchievementLevel } from "@/types/achievements";

describe("AchievementIcons", () => {
    it("应该正确渲染奖杯图标", () => {
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "trophy",
            },
        });

        const svg = wrapper.findComponent({ name: "SvgIcon" });
        expect(svg.exists()).toBe(true);

        // 检查是否包含奖杯图标的路径
        const trophyPath = wrapper.find("g[v-if=\"name === 'trophy'\"] path");
        expect(trophyPath.exists()).toBe(true);
    });

    it("应该正确渲染奖牌图标", () => {
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "medal",
            },
        });

        const svg = wrapper.findComponent({ name: "SvgIcon" });
        expect(svg.exists()).toBe(true);

        // 检查奖牌图标的圆形和路径
        const medalCircle = wrapper.find(
            "g[v-else-if=\"name === 'medal'\"] circle",
        );
        const medalPath = wrapper.find(
            "g[v-else-if=\"name === 'medal'\"] path",
        );
        expect(medalCircle.exists()).toBe(true);
        expect(medalPath.exists()).toBe(true);
    });

    it("应该根据等级使用正确的颜色", () => {
        const levels: AchievementLevel[] = [
            "gold",
            "silver",
            "bronze",
            "special",
        ];
        const expectedColors = {
            gold: "#FFD700",
            silver: "#C0C0C0",
            bronze: "#CD7F32",
            special: "#9932CC",
        };

        levels.forEach((level) => {
            const wrapper = mount(AchievementIcons, {
                props: {
                    name: "trophy",
                    level,
                    color: "currentColor",
                },
            });

            const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
            expect(svgIcon.props("color")).toBe(expectedColors[level]);
        });
    });

    it("应该支持自定义颜色覆盖等级颜色", () => {
        const customColor = "#FF0000";
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "trophy",
                level: "gold",
                color: customColor,
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("color")).toBe(customColor);
    });

    it("应该使用图标类型的默认颜色", () => {
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "star",
                color: "currentColor",
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("color")).toBe("#FFC107"); // 星星的默认颜色
    });

    it("应该渲染默认图标当名称不匹配时", () => {
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "unknown-achievement",
            },
        });

        const svg = wrapper.findComponent({ name: "SvgIcon" });
        expect(svg.exists()).toBe(true);

        // 应该渲染默认的圆形和十字图标
        const defaultCircle = wrapper.find("circle");
        expect(defaultCircle.exists()).toBe(true);
    });

    it("应该生成正确的无障碍标签", () => {
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "medal",
                level: "gold",
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("ariaLabel")).toBe("gold级medal成就图标");
    });

    it("应该支持自定义无障碍标签", () => {
        const customLabel = "自定义成就图标";
        const wrapper = mount(AchievementIcons, {
            props: {
                name: "trophy",
                ariaLabel: customLabel,
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("ariaLabel")).toBe(customLabel);
    });

    it("应该支持所有成就图标类型", () => {
        const iconTypes = [
            "trophy",
            "medal",
            "star",
            "certificate",
            "award",
            "badge",
            "crown",
        ];

        iconTypes.forEach((iconType) => {
            const wrapper = mount(AchievementIcons, {
                props: {
                    name: iconType,
                },
            });

            const svg = wrapper.findComponent({ name: "SvgIcon" });
            expect(svg.exists()).toBe(true);
        });
    });
});
