// 图标库组件测试

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import IconLibrary from "@/components/icons/IconLibrary.vue";

describe("IconLibrary", () => {
    it("应该渲染技术栈图标", () => {
        const wrapper = mount(IconLibrary, {
            props: {
                type: "tech",
                name: "vue",
            },
        });

        const techIcon = wrapper.findComponent({ name: "TechStackIcons" });
        expect(techIcon.exists()).toBe(true);
        expect(techIcon.props("name")).toBe("vue");
    });

    it("应该渲染成就图标", () => {
        const wrapper = mount(IconLibrary, {
            props: {
                type: "achievement",
                name: "trophy",
                level: "gold",
            },
        });

        const achievementIcon = wrapper.findComponent({
            name: "AchievementIcons",
        });
        expect(achievementIcon.exists()).toBe(true);
        expect(achievementIcon.props("name")).toBe("trophy");
        expect(achievementIcon.props("level")).toBe("gold");
    });

    it("应该渲染自定义 SVG 图标", () => {
        const wrapper = mount(IconLibrary, {
            props: {
                type: "custom",
                name: "custom-icon",
            },
            slots: {
                default:
                    '<circle cx="12" cy="12" r="10" fill="currentColor" />',
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.exists()).toBe(true);
    });

    it("应该传递所有属性到子组件", () => {
        const props = {
            type: "tech" as const,
            name: "react",
            size: "lg" as const,
            color: "#61DAFB",
            clickable: true,
            spinning: false,
            ariaLabel: "React 图标",
        };

        const wrapper = mount(IconLibrary, {
            props,
        });

        const techIcon = wrapper.findComponent({ name: "TechStackIcons" });
        expect(techIcon.props("name")).toBe(props.name);
        expect(techIcon.props("size")).toBe(props.size);
        expect(techIcon.props("color")).toBe(props.color);
        expect(techIcon.props("clickable")).toBe(props.clickable);
        expect(techIcon.props("spinning")).toBe(props.spinning);
        expect(techIcon.props("ariaLabel")).toBe(props.ariaLabel);
    });

    it("应该转发点击事件", async () => {
        const wrapper = mount(IconLibrary, {
            props: {
                type: "tech",
                name: "vue",
                clickable: true,
            },
        });

        const techIcon = wrapper.findComponent({ name: "TechStackIcons" });
        await techIcon.trigger("click");

        expect(wrapper.emitted("click")).toBeTruthy();
    });

    it("应该默认使用自定义类型", () => {
        const wrapper = mount(IconLibrary, {
            props: {
                name: "default-icon",
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.exists()).toBe(true);
    });

    it("应该支持所有图标类型", () => {
        const types = ["tech", "achievement", "custom"] as const;

        types.forEach((type) => {
            const wrapper = mount(IconLibrary, {
                props: {
                    type,
                    name: "test-icon",
                },
            });

            expect(wrapper.exists()).toBe(true);
        });
    });
});
