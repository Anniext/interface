// SVG 图标组件测试

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SvgIcon from "@/components/icons/SvgIcon.vue";

describe("SvgIcon", () => {
    it("应该正确渲染基础 SVG 图标", () => {
        const wrapper = mount(SvgIcon, {
            props: {
                size: "md",
                color: "#3B82F6",
            },
            slots: {
                default:
                    '<circle cx="12" cy="12" r="10" fill="currentColor" />',
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.exists()).toBe(true);
        expect(svg.classes()).toContain("svg-icon");
        expect(svg.classes()).toContain("svg-icon--md");
    });

    it("应该支持不同的尺寸", () => {
        const sizes = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

        sizes.forEach((size) => {
            const wrapper = mount(SvgIcon, {
                props: { size },
            });

            const svg = wrapper.find("svg");
            expect(svg.classes()).toContain(`svg-icon--${size}`);
        });
    });

    it("应该支持数字尺寸", () => {
        const wrapper = mount(SvgIcon, {
            props: {
                size: 48,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.attributes("width")).toBe("48");
        expect(svg.attributes("height")).toBe("48");
    });

    it("应该支持自定义颜色", () => {
        const wrapper = mount(SvgIcon, {
            props: {
                color: "#FF0000",
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.element.style.color).toBe("rgb(255, 0, 0)");
    });

    it("应该支持点击事件", async () => {
        const wrapper = mount(SvgIcon, {
            props: {
                clickable: true,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.classes()).toContain("svg-icon--clickable");

        await svg.trigger("click");
        expect(wrapper.emitted("click")).toBeTruthy();
    });

    it("应该支持旋转动画", () => {
        const wrapper = mount(SvgIcon, {
            props: {
                spinning: true,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.classes()).toContain("svg-icon--spinning");
    });

    it("应该支持无障碍属性", () => {
        const wrapper = mount(SvgIcon, {
            props: {
                ariaLabel: "测试图标",
                role: "img",
                ariaHidden: false,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.attributes("aria-label")).toBe("测试图标");
        expect(svg.attributes("role")).toBe("img");
        expect(svg.attributes("aria-hidden")).toBe("false");
    });

    it("应该支持背景颜色和边框", () => {
        const wrapper = mount(SvgIcon, {
            props: {
                backgroundColor: "#F0F0F0",
                borderColor: "#CCCCCC",
            },
        });

        const svg = wrapper.find("svg");
        const style = svg.element.style;
        expect(style.backgroundColor).toBe("rgb(240, 240, 240)");
        expect(style.border).toBe("1px solid rgb(204, 204, 204)");
    });
});
