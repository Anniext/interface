import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTrigger 配置接口
 */
export interface IScrollTriggerConfig {
    /** 触发元素选择器或元素引用 */
    trigger: string | HTMLElement | Ref<HTMLElement | undefined>;
    /** 动画开始位置 */
    start?: string;
    /** 动画结束位置 */
    end?: string;
    /** 是否固定元素 */
    pin?: boolean;
    /** 是否启用刷新 */
    scrub?: boolean | number;
    /** 动画配置 */
    animation?: gsap.TweenVars;
    /** 回调函数 */
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
    /** 是否启用标记（调试用） */
    markers?: boolean;
}

/**
 * 视差滚动配置接口
 */
export interface IParallaxConfig {
    /** 视差元素 */
    element: string | HTMLElement | Ref<HTMLElement | undefined>;
    /** 视差速度 (-1 到 1) */
    speed: number;
    /** 视差方向 */
    direction?: "vertical" | "horizontal";
}

/**
 * 滚动进度指示器配置
 */
export interface IScrollProgressConfig {
    /** 进度条元素 */
    progressBar: string | HTMLElement | Ref<HTMLElement | undefined>;
    /** 进度条类型 */
    type?: "horizontal" | "vertical" | "circular";
    /** 自定义样式 */
    style?: {
        backgroundColor?: string;
        height?: string;
        borderRadius?: string;
    };
}

/**
 * ScrollTrigger 组合式函数
 */
export function useScrollTrigger() {
    // 存储所有 ScrollTrigger 实例
    const scrollTriggers = ref<ScrollTrigger[]>([]);

    /**
     * 获取元素引用
     */
    const getElement = (
        target: string | HTMLElement | Ref<HTMLElement | undefined>,
    ): HTMLElement | null => {
        if (typeof target === "string") {
            return document.querySelector(target);
        }
        if (target instanceof HTMLElement) {
            return target;
        }
        if (target && "value" in target) {
            return target.value || null;
        }
        return null;
    };

    /**
     * 创建基础滚动触发动画
     */
    const createScrollTrigger = (config: IScrollTriggerConfig) => {
        const element = getElement(config.trigger);
        if (!element) {
            console.warn("ScrollTrigger: 未找到触发元素", config.trigger);
            return null;
        }

        const scrollTrigger = ScrollTrigger.create({
            trigger: element,
            start: config.start || "top 80%",
            end: config.end || "bottom 20%",
            pin: config.pin || false,
            scrub: config.scrub || false,
            markers: config.markers || false,
            onEnter: config.onEnter,
            onLeave: config.onLeave,
            onEnterBack: config.onEnterBack,
            onLeaveBack: config.onLeaveBack,
            animation: config.animation
                ? gsap.to(element, config.animation)
                : undefined,
        });

        scrollTriggers.value.push(scrollTrigger);
        return scrollTrigger;
    };

    /**
     * 创建元素进入视口动画
     */
    const createEnterAnimation = (
        selector: string,
        animation: gsap.TweenVars = {},
        triggerConfig: Partial<IScrollTriggerConfig> = {},
    ) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn("ScrollTrigger: 未找到动画元素", selector);
            return [];
        }

        const triggers: ScrollTrigger[] = [];

        elements.forEach((element, index) => {
            // 设置初始状态
            gsap.set(element, {
                opacity: 0,
                y: 50,
                scale: 0.8,
                ...animation.from,
            });

            const scrollTrigger = ScrollTrigger.create({
                trigger: element,
                start: triggerConfig.start || "top 85%",
                end: triggerConfig.end || "bottom 15%",
                markers: triggerConfig.markers || false,
                onEnter: () => {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        delay: index * 0.1, // 错开动画
                        ease: "power2.out",
                        ...animation,
                    });
                    triggerConfig.onEnter?.();
                },
                onLeave: triggerConfig.onLeave,
                onEnterBack: triggerConfig.onEnterBack,
                onLeaveBack: triggerConfig.onLeaveBack,
            });

            triggers.push(scrollTrigger);
            scrollTriggers.value.push(scrollTrigger);
        });

        return triggers;
    };

    /**
     * 创建视差滚动效果
     */
    const createParallax = (configs: IParallaxConfig[]) => {
        const triggers: ScrollTrigger[] = [];

        configs.forEach((config) => {
            const element = getElement(config.element);
            if (!element) {
                console.warn("ScrollTrigger: 未找到视差元素", config.element);
                return;
            }

            const direction = config.direction || "vertical";
            const speed = Math.max(-1, Math.min(1, config.speed)); // 限制速度范围

            const scrollTrigger = ScrollTrigger.create({
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const movement = (progress - 0.5) * speed * 100;

                    if (direction === "vertical") {
                        gsap.set(element, { y: movement });
                    } else {
                        gsap.set(element, { x: movement });
                    }
                },
            });

            triggers.push(scrollTrigger);
            scrollTriggers.value.push(scrollTrigger);
        });

        return triggers;
    };

    /**
     * 创建滚动进度指示器
     */
    const createScrollProgress = (config: IScrollProgressConfig) => {
        const progressElement = getElement(config.progressBar);
        if (!progressElement) {
            console.warn("ScrollTrigger: 未找到进度条元素", config.progressBar);
            return null;
        }

        const type = config.type || "horizontal";

        // 应用自定义样式
        if (config.style) {
            Object.assign(progressElement.style, config.style);
        }

        let scrollTrigger: ScrollTrigger;

        if (type === "circular") {
            // 圆形进度条
            const circumference = 2 * Math.PI * 45; // 假设半径为 45
            gsap.set(progressElement, {
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
            });

            scrollTrigger = ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const offset = circumference * (1 - progress);
                    gsap.set(progressElement, { strokeDashoffset: offset });
                },
            });
        } else {
            // 水平或垂直进度条
            gsap.set(progressElement, {
                scaleX: type === "horizontal" ? 0 : 1,
                scaleY: type === "vertical" ? 0 : 1,
                transformOrigin:
                    type === "horizontal" ? "left center" : "center top",
            });

            scrollTrigger = ScrollTrigger.create({
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (type === "horizontal") {
                        gsap.set(progressElement, { scaleX: progress });
                    } else {
                        gsap.set(progressElement, { scaleY: progress });
                    }
                },
            });
        }

        scrollTriggers.value.push(scrollTrigger);
        return scrollTrigger;
    };

    /**
     * 创建批量滚动动画
     */
    const createBatchAnimation = (
        selector: string,
        animation: gsap.TweenVars,
        batchConfig: {
            batchMax?: number;
            interval?: number;
            randomize?: boolean;
        } = {},
    ) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn("ScrollTrigger: 未找到批量动画元素", selector);
            return null;
        }

        const batchMax = batchConfig.batchMax || 3;
        const interval = batchConfig.interval || 0.1;

        const scrollTrigger = ScrollTrigger.batch(elements, {
            onEnter: (elements) => {
                gsap.from(elements, {
                    opacity: 0,
                    y: 50,
                    stagger: batchConfig.randomize ? "random" : interval,
                    duration: 0.8,
                    ease: "power2.out",
                    ...animation,
                });
            },
            onLeave: (elements) => {
                gsap.to(elements, {
                    opacity: 0,
                    y: -50,
                    stagger: interval,
                    duration: 0.3,
                });
            },
            onEnterBack: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    stagger: interval,
                    duration: 0.8,
                });
            },
            batchMax,
            start: "top 85%",
            end: "bottom 15%",
        });

        scrollTriggers.value.push(...scrollTrigger);
        return scrollTrigger;
    };

    /**
     * 刷新所有 ScrollTrigger
     */
    const refresh = () => {
        ScrollTrigger.refresh();
    };

    /**
     * 清理所有 ScrollTrigger
     */
    const cleanup = () => {
        scrollTriggers.value.forEach((trigger) => trigger.kill());
        scrollTriggers.value = [];
    };

    /**
     * 获取滚动进度
     */
    const getScrollProgress = () => {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        return Math.min(scrollTop / scrollHeight, 1);
    };

    // 生命周期管理
    onMounted(() => {
        // 确保 DOM 加载完成后刷新
        ScrollTrigger.refresh();
    });

    onBeforeUnmount(() => {
        cleanup();
    });

    return {
        // 核心方法
        createScrollTrigger,
        createEnterAnimation,
        createParallax,
        createScrollProgress,
        createBatchAnimation,

        // 工具方法
        refresh,
        cleanup,
        getScrollProgress,

        // 响应式数据
        scrollTriggers: scrollTriggers.value,
    };
}

/**
 * 预设动画配置
 */
export const scrollAnimationPresets = {
    // 淡入动画
    fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1, duration: 0.8, ease: "power2.out" },
    },

    // 从下方滑入
    slideUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    },

    // 从左侧滑入
    slideLeft: {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
    },

    // 从右侧滑入
    slideRight: {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
    },

    // 缩放动画
    scale: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
    },

    // 旋转动画
    rotate: {
        from: { opacity: 0, rotation: -10, scale: 0.9 },
        to: {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
        },
    },
};
