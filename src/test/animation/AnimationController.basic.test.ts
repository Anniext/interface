// 动画控制器基础测试
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import AnimationController from "@/components/animation/AnimationController.vue";

// Mock GSAP
vi.mock("gsap", () => ({
    gsap: {
        timeline: vi.fn(() => ({
            paused: true,
            play: vi.fn(),
            pause: vi.fn(),
            kill: vi.fn(),
            progress: vi.fn(() => 0),
            totalDuration: vi.fn(() => 1),
        })),
        config: vi.fn(),
        to: vi.fn(),
        from: vi.fn(),
        fromTo: vi.fn(),
        set: vi.fn(),
    },
}));

describe("AnimationController 基础功能", () => {
    let wrapper: any;

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
    });

    it("应该正确渲染组件", () => {
        wrapper = mount(AnimationController, {
            props: {
                debugMode: false,
            },
        });

        expect(wrapper.find(".animation-controller").exists()).toBe(true);
    });

    it("在调试模式下应该显示调试面板", () => {
        wrapper = mount(AnimationController, {
            props: {
                debugMode: true,
            },
        });

        expect(wrapper.find(".debug-panel").exists()).toBe(true);
        expect(wrapper.text()).toContain("动画控制器调试");
    });

    it("应该提供动画管理器", () => {
        wrapper = mount(AnimationController);

        const animationManager = wrapper.vm.animationManager;
        expect(animationManager).toBeDefined();
        expect(typeof animationManager.createTimeline).toBe("function");
        expect(typeof animationManager.play).toBe("function");
        expect(typeof animationManager.pause).toBe("function");
    });

    it("应该能够创建和管理时间轴", () => {
        wrapper = mount(AnimationController);

        const animationManager = wrapper.vm.animationManager;
        const timeline = animationManager.createTimeline("test-timeline");

        expect(timeline).toBeDefined();
        expect(timeline.id).toBe("test-timeline");
        expect(timeline.state).toBe("idle");

        const retrievedTimeline = animationManager.getTimeline("test-timeline");
        expect(retrievedTimeline).toBeDefined();
        expect(retrievedTimeline?.id).toBe("test-timeline");
    });
});
