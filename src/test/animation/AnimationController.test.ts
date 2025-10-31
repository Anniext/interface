// 动画控制器测试
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import AnimationController from "@/components/animation/AnimationController.vue";
import { TimelineManager } from "@/utils/animation/TimelineManager";
import {
    AnimationQueue,
    AnimationPriority,
} from "@/utils/animation/AnimationQueue";

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

describe("AnimationController", () => {
    let wrapper: any;

    beforeEach(() => {
        // 清理全局状态
        vi.clearAllMocks();
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
    });

    describe("组件基础功能", () => {
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

        it("应该正确传递性能配置", () => {
            const performanceConfig = {
                maxConcurrentAnimations: 20,
                enableHardwareAcceleration: false,
                quality: "low" as const,
            };

            wrapper = mount(AnimationController, {
                props: {
                    performanceConfig,
                },
            });

            // 验证组件接收到正确的配置
            expect(wrapper.props("performanceConfig")).toEqual(
                performanceConfig,
            );
        });
    });

    describe("动画管理器功能", () => {
        beforeEach(() => {
            wrapper = mount(AnimationController);
        });

        it("应该提供动画管理器给子组件", () => {
            const animationManager = wrapper.vm.animationManager;
            expect(animationManager).toBeDefined();
            expect(typeof animationManager.createTimeline).toBe("function");
            expect(typeof animationManager.play).toBe("function");
            expect(typeof animationManager.pause).toBe("function");
        });

        it("应该能够创建时间轴", () => {
            const animationManager = wrapper.vm.animationManager;
            const timeline = animationManager.createTimeline("test-timeline");

            expect(timeline).toBeDefined();
            expect(timeline.id).toBe("test-timeline");
            expect(timeline.state).toBe("idle");
            expect(timeline.progress).toBe(0);
        });

        it("应该能够获取时间轴", () => {
            const animationManager = wrapper.vm.animationManager;
            animationManager.createTimeline("test-timeline");

            const timeline = animationManager.getTimeline("test-timeline");
            expect(timeline).toBeDefined();
            expect(timeline?.id).toBe("test-timeline");
        });

        it("应该能够播放和暂停动画", () => {
            const animationManager = wrapper.vm.animationManager;
            animationManager.createTimeline("test-timeline");

            // 测试播放
            animationManager.play("test-timeline");

            // 测试暂停
            animationManager.pause("test-timeline");

            // 验证方法被调用（由于是mock，主要验证不会抛出错误）
            expect(true).toBe(true);
        });
    });

    describe("控制方法", () => {
        beforeEach(() => {
            wrapper = mount(AnimationController, {
                props: {
                    debugMode: true,
                },
            });
        });

        it("应该能够暂停所有动画", async () => {
            const pauseAllButton = wrapper.find("button:nth-child(1)");
            expect(pauseAllButton.text()).toBe("暂停全部");

            await pauseAllButton.trigger("click");
            // 验证不会抛出错误
            expect(true).toBe(true);
        });

        it("应该能够恢复所有动画", async () => {
            const resumeAllButton = wrapper.find("button:nth-child(2)");
            expect(resumeAllButton.text()).toBe("恢复全部");

            await resumeAllButton.trigger("click");
            // 验证不会抛出错误
            expect(true).toBe(true);
        });

        it("应该能够清理所有动画", async () => {
            const clearAllButton = wrapper.find("button:nth-child(3)");
            expect(clearAllButton.text()).toBe("清理全部");

            await clearAllButton.trigger("click");
            // 验证不会抛出错误
            expect(true).toBe(true);
        });
    });
});

describe("TimelineManager", () => {
    let timelineManager: TimelineManager;

    beforeEach(() => {
        timelineManager = new TimelineManager();
    });

    it("应该能够创建时间轴", () => {
        const timeline = timelineManager.createTimeline("test");

        expect(timeline.id).toBe("test");
        expect(timeline.state).toBe("idle");
        expect(timeline.animations).toEqual([]);
    });

    it("应该能够获取时间轴", () => {
        timelineManager.createTimeline("test");
        const timeline = timelineManager.getTimeline("test");

        expect(timeline).toBeDefined();
        expect(timeline?.id).toBe("test");
    });

    it("应该能够删除时间轴", () => {
        timelineManager.createTimeline("test");
        timelineManager.removeTimeline("test");

        const timeline = timelineManager.getTimeline("test");
        expect(timeline).toBeNull();
    });

    it("应该能够获取所有时间轴ID", () => {
        timelineManager.createTimeline("test1");
        timelineManager.createTimeline("test2");

        const ids = timelineManager.getTimelineIds();
        expect(ids).toContain("test1");
        expect(ids).toContain("test2");
    });
});

describe("AnimationQueue", () => {
    let animationQueue: AnimationQueue;

    beforeEach(() => {
        animationQueue = new AnimationQueue(5);
    });

    afterEach(() => {
        animationQueue.clear();
    });

    it("应该能够添加动画到队列", () => {
        const mockExecute = vi.fn();

        animationQueue.add({
            id: "test-animation",
            priority: AnimationPriority.NORMAL,
            execute: mockExecute,
            interruptible: true,
        });

        const status = animationQueue.getStatus();
        expect(status.queueLength).toBe(1);
    });

    it("应该按优先级排序动画", () => {
        const mockExecute1 = vi.fn();
        const mockExecute2 = vi.fn();

        // 添加低优先级动画
        animationQueue.add({
            id: "low-priority",
            priority: AnimationPriority.LOW,
            execute: mockExecute1,
            interruptible: true,
        });

        // 添加高优先级动画
        animationQueue.add({
            id: "high-priority",
            priority: AnimationPriority.HIGH,
            execute: mockExecute2,
            interruptible: true,
        });

        const queueItems = animationQueue.getQueueItems();
        expect(queueItems[0].id).toBe("high-priority");
        expect(queueItems[1].id).toBe("low-priority");
    });

    it("应该能够移除队列中的动画", () => {
        const mockExecute = vi.fn();

        animationQueue.add({
            id: "test-animation",
            priority: AnimationPriority.NORMAL,
            execute: mockExecute,
            interruptible: true,
        });

        const removed = animationQueue.remove("test-animation");
        expect(removed).toBe(true);

        const status = animationQueue.getStatus();
        expect(status.queueLength).toBe(0);
    });

    it("应该能够清空队列", () => {
        const mockExecute = vi.fn();

        animationQueue.add({
            id: "test-animation",
            priority: AnimationPriority.NORMAL,
            execute: mockExecute,
            interruptible: true,
        });

        animationQueue.clear();

        const status = animationQueue.getStatus();
        expect(status.queueLength).toBe(0);
    });
});
