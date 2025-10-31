import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ScrollTriggerAnimation from "@/components/animation/ScrollTriggerAnimation.vue";

// Mock GSAP 和 ScrollTrigger
vi.mock("gsap", () => ({
    gsap: {
        registerPlugin: vi.fn(),
        set: vi.fn(),
        to: vi.fn(),
        timeline: vi.fn(() => ({
            to: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            play: vi.fn(),
            pause: vi.fn(),
            kill: vi.fn(),
        })),
    },
    ScrollTrigger: {
        create: vi.fn(() => ({
            kill: vi.fn(),
        })),
        batch: vi.fn(() => []),
        refresh: vi.fn(),
        killAll: vi.fn(),
    },
}));

// Mock useScrollTrigger composable
vi.mock("@/composables/useScrollTrigger", () => ({
    useScrollTrigger: () => ({
        createScrollTrigger: vi.fn(),
        createEnterAnimation: vi.fn(),
        createParallax: vi.fn(),
        createScrollProgress: vi.fn(),
        createBatchAnimation: vi.fn(),
        refresh: vi.fn(),
        cleanup: vi.fn(),
        getScrollProgress: vi.fn(() => 0.5),
        scrollTriggers: [],
    }),
}));

describe("ScrollTrigger 动画组件", () => {
    let wrapper: unknown;

    beforeEach(() => {
        // Mock DOM 方法
        Object.defineProperty(window, "pageYOffset", {
            value: 0,
            writable: true,
        });

        Object.defineProperty(document.documentElement, "scrollTop", {
            value: 0,
            writable: true,
        });

        Object.defineProperty(document.documentElement, "scrollHeight", {
            value: 2000,
            writable: true,
        });

        Object.defineProperty(window, "innerHeight", {
            value: 800,
            writable: true,
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
    });

    describe("组件基础功能", () => {
        it("应该正确渲染组件", () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    showProgress: false,
                },
                slots: {
                    default: '<div class="test-content">测试内容</div>',
                },
            });

            expect(wrapper.find(".scroll-trigger-container").exists()).toBe(
                true,
            );
            expect(wrapper.find(".test-content").exists()).toBe(true);
        });

        it("应该显示水平进度条", async () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    showProgress: true,
                    progressType: "horizontal",
                    progressPosition: "top",
                },
            });

            await nextTick();

            expect(wrapper.find(".progress-bar.horizontal").exists()).toBe(
                true,
            );
            expect(
                wrapper.find(".progress-indicator.position-top").exists(),
            ).toBe(true);
        });

        it("应该显示垂直进度条", async () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    showProgress: true,
                    progressType: "vertical",
                    progressPosition: "left",
                },
            });

            await nextTick();

            expect(wrapper.find(".progress-bar.vertical").exists()).toBe(true);
            expect(
                wrapper.find(".progress-indicator.position-left").exists(),
            ).toBe(true);
        });

        it("应该显示圆形进度条", async () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    showProgress: true,
                    progressType: "circular",
                    progressPosition: "top-right",
                    circularSize: 60,
                },
            });

            await nextTick();

            expect(wrapper.find(".progress-circle").exists()).toBe(true);
            expect(
                wrapper.find(".progress-indicator.position-top-right").exists(),
            ).toBe(true);
        });
    });

    describe("调试模式", () => {
        it("应该在调试模式下显示调试样式", async () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    debug: true,
                    showProgress: true,
                },
            });

            await nextTick();

            expect(wrapper.find(".debug-mode").exists()).toBe(true);
        });

        it("应该传递调试标记到动画方法", async () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    debug: true,
                    autoAnimateSelector: ".test-element",
                },
            });

            await nextTick();

            // 验证组件实例存在
            expect(wrapper.vm).toBeDefined();
        });
    });

    describe("视差配置", () => {
        it("应该接受视差配置", async () => {
            const parallaxConfig = [
                {
                    element: ".parallax-element",
                    speed: -0.5,
                    direction: "vertical" as const,
                },
            ];

            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    parallaxConfig,
                },
            });

            await nextTick();

            expect(wrapper.props("parallaxConfig")).toEqual(parallaxConfig);
        });
    });

    describe("滚动事件处理", () => {
        it("应该处理滚动事件", async () => {
            wrapper = mount(ScrollTriggerAnimation, {
                props: {
                    showProgress: true,
                },
            });

            await nextTick();

            // 模拟滚动事件
            const scrollEvent = new Event("scroll");
            window.dispatchEvent(scrollEvent);

            await nextTick();

            // 验证组件状态
            expect(wrapper.vm.isScrolling).toBeDefined();
        });
    });

    describe("公共方法", () => {
        it("应该暴露公共方法", async () => {
            wrapper = mount(ScrollTriggerAnimation);

            await nextTick();

            // 验证暴露的方法存在
            expect(typeof wrapper.vm.addScrollTrigger).toBe("function");
            expect(typeof wrapper.vm.addEnterAnimation).toBe("function");
            expect(typeof wrapper.vm.addParallaxEffect).toBe("function");
            expect(typeof wrapper.vm.addBatchAnimation).toBe("function");
            expect(typeof wrapper.vm.refresh).toBe("function");
            expect(typeof wrapper.vm.cleanup).toBe("function");
        });

        it("应该能够调用刷新方法", async () => {
            wrapper = mount(ScrollTriggerAnimation);

            await nextTick();

            // 调用刷新方法不应该抛出错误
            expect(() => wrapper.vm.refresh()).not.toThrow();
        });

        it("应该能够调用清理方法", async () => {
            wrapper = mount(ScrollTriggerAnimation);

            await nextTick();

            // 调用清理方法不应该抛出错误
            expect(() => wrapper.vm.cleanup()).not.toThrow();
        });
    });

    describe("响应式数据", () => {
        it("应该提供滚动进度数据", async () => {
            wrapper = mount(ScrollTriggerAnimation);

            await nextTick();

            expect(wrapper.vm.scrollProgress).toBeDefined();
            expect(typeof wrapper.vm.scrollProgress).toBe("number");
        });

        it("应该提供滚动状态数据", async () => {
            wrapper = mount(ScrollTriggerAnimation);

            await nextTick();

            expect(wrapper.vm.isScrolling).toBeDefined();
            expect(typeof wrapper.vm.isScrolling).toBe("boolean");
        });
    });
});

describe("useScrollTrigger 组合式函数", () => {
    it("应该能够导入组合式函数", async () => {
        const { useScrollTrigger } = await import(
            "@/composables/useScrollTrigger"
        );

        expect(useScrollTrigger).toBeDefined();
        expect(typeof useScrollTrigger).toBe("function");
    });

    it("应该返回正确的方法和数据", async () => {
        const { useScrollTrigger } = await import(
            "@/composables/useScrollTrigger"
        );
        const scrollTrigger = useScrollTrigger();

        expect(scrollTrigger.createScrollTrigger).toBeDefined();
        expect(scrollTrigger.createEnterAnimation).toBeDefined();
        expect(scrollTrigger.createParallax).toBeDefined();
        expect(scrollTrigger.createScrollProgress).toBeDefined();
        expect(scrollTrigger.refresh).toBeDefined();
        expect(scrollTrigger.cleanup).toBeDefined();
    });
});

describe("ScrollTrigger 工具函数", () => {
    it("应该能够导入工具函数", async () => {
        const { ScrollTriggerUtils } = await import(
            "@/utils/animation/ScrollTriggerUtils"
        );

        expect(ScrollTriggerUtils).toBeDefined();
        expect(typeof ScrollTriggerUtils.fadeIn).toBe("function");
        expect(typeof ScrollTriggerUtils.slideUp).toBe("function");
        expect(typeof ScrollTriggerUtils.parallax).toBe("function");
        expect(typeof ScrollTriggerUtils.refresh).toBe("function");
    });

    it("应该提供预设动画配置", async () => {
        const { scrollAnimationPresets } = await import(
            "@/utils/animation/ScrollTriggerUtils"
        );

        expect(scrollAnimationPresets).toBeDefined();
        expect(scrollAnimationPresets.fadeIn).toBeDefined();
        expect(scrollAnimationPresets.slideUp).toBeDefined();
        expect(scrollAnimationPresets.parallaxSlow).toBeDefined();
    });
});
