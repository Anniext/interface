// 装饰性 SVG 组件测试

import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DecorativeSvg from "@/components/icons/DecorativeSvg.vue";

describe("DecorativeSvg", () => {
    it("应该正确渲染几何图形", () => {
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "geometric",
                variant: "circle",
                width: 100,
                height: 100,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.exists()).toBe(true);
        expect(svg.classes()).toContain("decorative-svg--geometric");

        const circle = wrapper.find("circle");
        expect(circle.exists()).toBe(true);
    });

    it("应该正确渲染分割线", () => {
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "divider",
                variant: "simple",
                width: 300,
                height: 2,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.exists()).toBe(true);
        expect(svg.classes()).toContain("decorative-svg--divider");

        const line = wrapper.find("line");
        expect(line.exists()).toBe(true);
    });

    it("应该正确渲染边框", () => {
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "border",
                variant: "simple",
                width: 200,
                height: 150,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.exists()).toBe(true);
        expect(svg.classes()).toContain("decorative-svg--border");

        const rect = wrapper.find("rect");
        expect(rect.exists()).toBe(true);
    });

    it("应该正确设置 SVG 尺寸", () => {
        const width = 150;
        const height = 100;

        const wrapper = mount(DecorativeSvg, {
            props: {
                width,
                height,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.attributes("width")).toBe(width.toString());
        expect(svg.attributes("height")).toBe(height.toString());
        expect(svg.attributes("viewBox")).toBe(`0 0 ${width} ${height}`);
    });

    it("应该正确应用颜色", () => {
        const color = "#FF0000";
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "geometric",
                variant: "circle",
                color,
            },
        });

        const circle = wrapper.find("circle");
        expect(circle.attributes("fill")).toBe(color);
    });

    it("应该正确应用透明度", () => {
        const opacity = 0.5;
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "geometric",
                variant: "circle",
                opacity,
            },
        });

        const circle = wrapper.find("circle");
        expect(circle.attributes("opacity")).toBe(opacity.toString());
    });

    it("应该支持动画类", () => {
        const wrapper = mount(DecorativeSvg, {
            props: {
                animated: true,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.classes()).toContain("decorative-svg--animated");
    });

    it("应该正确渲染 Logo", () => {
        const logoText = "TEST";
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "logo",
                variant: "simple",
                logoText,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.exists()).toBe(true);
        expect(svg.classes()).toContain("decorative-svg--logo");

        const text = wrapper.find("text");
        expect(text.exists()).toBe(true);
        expect(text.text()).toBe(logoText);
    });

    it("应该支持虚线边框", () => {
        const dashArray = "10,5";
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "border",
                variant: "dashed",
                dashArray,
            },
        });

        const rect = wrapper.find("rect");
        expect(rect.attributes("stroke-dasharray")).toBe(dashArray);
    });

    it("应该支持边框圆角", () => {
        const borderRadius = 10;
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "border",
                variant: "simple",
                borderRadius,
            },
        });

        const rect = wrapper.find("rect");
        expect(rect.attributes("rx")).toBe(borderRadius.toString());
    });

    it("应该支持描边宽度", () => {
        const strokeWidth = 3;
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "divider",
                variant: "simple",
                strokeWidth,
            },
        });

        const line = wrapper.find("line");
        expect(line.attributes("stroke-width")).toBe(strokeWidth.toString());
    });

    it("应该渲染默认图形当类型不匹配时", () => {
        const wrapper = mount(DecorativeSvg, {
            props: {
                type: "unknown" as any,
            },
        });

        const svg = wrapper.find("svg");
        expect(svg.exists()).toBe(true);

        // 应该渲染默认的圆形
        const circle = wrapper.find("circle");
        expect(circle.exists()).toBe(true);
    });
});
