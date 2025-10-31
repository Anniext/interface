// 技术栈图标组件测试

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TechStackIcons from "@/components/icons/TechStackIcons.vue";

describe("TechStackIcons", () => {
    it("应该正确渲染 Java 图标", () => {
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "java",
            },
        });

        const svg = wrapper.findComponent({ name: "SvgIcon" });
        expect(svg.exists()).toBe(true);

        // 检查是否包含 Java 图标的路径
        const javaPath = wrapper.find("g[v-if=\"name === 'java'\"] path");
        expect(javaPath.exists()).toBe(true);
    });

    it("应该正确渲染 Python 图标", () => {
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "python",
            },
        });

        const svg = wrapper.findComponent({ name: "SvgIcon" });
        expect(svg.exists()).toBe(true);
    });

    it("应该使用正确的技术栈颜色", () => {
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "java",
                color: "currentColor",
            },
        });

        // Java 的默认颜色应该是 #ED8B00
        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("color")).toBe("#ED8B00");
    });

    it("应该支持自定义颜色覆盖", () => {
        const customColor = "#FF0000";
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "java",
                color: customColor,
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("color")).toBe(customColor);
    });

    it("应该渲染默认图标当名称不匹配时", () => {
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "unknown-tech",
            },
        });

        const svg = wrapper.findComponent({ name: "SvgIcon" });
        expect(svg.exists()).toBe(true);

        // 应该渲染默认的圆形和十字图标
        const defaultCircle = wrapper.find("circle");
        expect(defaultCircle.exists()).toBe(true);
    });

    it("应该支持点击事件", async () => {
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "vue",
                clickable: true,
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        await svgIcon.trigger("click");

        expect(wrapper.emitted("click")).toBeTruthy();
    });

    it("应该生成正确的无障碍标签", () => {
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "react",
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("ariaLabel")).toBe("react 技术图标");
    });

    it("应该支持自定义无障碍标签", () => {
        const customLabel = "自定义 React 图标";
        const wrapper = mount(TechStackIcons, {
            props: {
                name: "react",
                ariaLabel: customLabel,
            },
        });

        const svgIcon = wrapper.findComponent({ name: "SvgIcon" });
        expect(svgIcon.props("ariaLabel")).toBe(customLabel);
    });
});
