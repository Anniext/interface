import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 确保 ScrollTrigger 已注册
gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTrigger 工具函数集合
 */
export class ScrollTriggerUtils {
    /**
     * 创建淡入动画
     */
    static fadeIn(
        selector: string,
        options: {
            start?: string;
            end?: string;
            duration?: number;
            stagger?: number;
            markers?: boolean;
        } = {},
    ) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        // 设置初始状态
        gsap.set(elements, { opacity: 0 });

        return ScrollTrigger.batch(elements, {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    duration: options.duration || 0.8,
                    stagger: options.stagger || 0.1,
                    ease: "power2.out",
                });
            },
            start: options.start || "top 85%",
            end: options.end || "bottom 15%",
            markers: options.markers || false,
        });
    }

    /**
     * 创建从下方滑入动画
     */
    static slideUp(
        selector: string,
        options: {
            start?: string;
            end?: string;
            duration?: number;
            distance?: number;
            stagger?: number;
            markers?: boolean;
        } = {},
    ) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        const distance = options.distance || 50;

        // 设置初始状态
        gsap.set(elements, { opacity: 0, y: distance });

        return ScrollTrigger.batch(elements, {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    duration: options.duration || 0.8,
                    stagger: options.stagger || 0.1,
                    ease: "power2.out",
                });
            },
            start: options.start || "top 85%",
            end: options.end || "bottom 15%",
            markers: options.markers || false,
        });
    }

    /**
     * 创建缩放动画
     */
    static scaleIn(
        selector: string,
        options: {
            start?: string;
            end?: string;
            duration?: number;
            scale?: number;
            stagger?: number;
            markers?: boolean;
        } = {},
    ) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        const scale = options.scale || 0.8;

        // 设置初始状态
        gsap.set(elements, { opacity: 0, scale });

        return ScrollTrigger.batch(elements, {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    scale: 1,
                    duration: options.duration || 0.8,
                    stagger: options.stagger || 0.1,
                    ease: "back.out(1.7)",
                });
            },
            start: options.start || "top 85%",
            end: options.end || "bottom 15%",
            markers: options.markers || false,
        });
    }

    /**
     * 创建视差滚动效果
     */
    static parallax(
        selector: string,
        options: {
            speed?: number;
            direction?: "vertical" | "horizontal";
            start?: string;
            end?: string;
            markers?: boolean;
        } = {},
    ) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        const speed = Math.max(-1, Math.min(1, options.speed || -0.5));
        const direction = options.direction || "vertical";
        const triggers: ScrollTrigger[] = [];

        elements.forEach((element) => {
            const trigger = ScrollTrigger.create({
                trigger: element,
                start: options.start || "top bottom",
                end: options.end || "bottom top",
                scrub: true,
                markers: options.markers || false,
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
            triggers.push(trigger);
        });

        return triggers;
    }

    /**
     * 创建固定滚动效果
     */
    static pin(
        selector: string,
        options: {
            start?: string;
            end?: string;
            pinSpacing?: boolean;
            markers?: boolean;
        } = {},
    ) {
        const element = document.querySelector(selector);
        if (!element) return null;

        return ScrollTrigger.create({
            trigger: element,
            start: options.start || "top top",
            end: options.end || "bottom top",
            pin: true,
            pinSpacing: options.pinSpacing !== false,
            markers: options.markers || false,
        });
    }

    /**
     * 创建滚动进度条
     */
    static progressBar(
        selector: string,
        options: {
            type?: "horizontal" | "vertical" | "circular";
            start?: string;
            end?: string;
            markers?: boolean;
        } = {},
    ) {
        const element = document.querySelector(selector);
        if (!element) return null;

        const type = options.type || "horizontal";

        if (type === "circular") {
            // 圆形进度条
            const circumference = 2 * Math.PI * 45;
            gsap.set(element, {
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
            });

            return ScrollTrigger.create({
                trigger: document.body,
                start: options.start || "top top",
                end: options.end || "bottom bottom",
                scrub: true,
                markers: options.markers || false,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const offset = circumference * (1 - progress);
                    gsap.set(element, { strokeDashoffset: offset });
                },
            });
        } else {
            // 水平或垂直进度条
            gsap.set(element, {
                scaleX: type === "horizontal" ? 0 : 1,
                scaleY: type === "vertical" ? 0 : 1,
                transformOrigin:
                    type === "horizontal" ? "left center" : "center top",
            });

            return ScrollTrigger.create({
                trigger: document.body,
                start: options.start || "top top",
                end: options.end || "bottom bottom",
                scrub: true,
                markers: options.markers || false,
                onUpdate: (self) => {
                    const progress = self.progress;
                    if (type === "horizontal") {
                        gsap.set(element, { scaleX: progress });
                    } else {
                        gsap.set(element, { scaleY: progress });
                    }
                },
            });
        }
    }

    /**
     * 创建文字打字机效果
     */
    static typewriter(
        selector: string,
        options: {
            start?: string;
            end?: string;
            speed?: number;
            markers?: boolean;
        } = {},
    ) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        const triggers: ScrollTrigger[] = [];

        elements.forEach((element) => {
            const text = element.textContent || "";
            element.textContent = "";

            const trigger = ScrollTrigger.create({
                trigger: element,
                start: options.start || "top 80%",
                end: options.end || "bottom 20%",
                markers: options.markers || false,
                onEnter: () => {
                    let i = 0;
                    const speed = options.speed || 50;

                    const typeInterval = setInterval(() => {
                        element.textContent = text.slice(0, i + 1);
                        i++;

                        if (i >= text.length) {
                            clearInterval(typeInterval);
                        }
                    }, speed);
                },
            });

            triggers.push(trigger);
        });

        return triggers;
    }

    /**
     * 创建数字计数动画
     */
    static countUp(
        selector: string,
        options: {
            start?: string;
            end?: string;
            duration?: number;
            markers?: boolean;
        } = {},
    ) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return null;

        const triggers: ScrollTrigger[] = [];

        elements.forEach((element) => {
            const targetValue = parseFloat(element.textContent || "0");
            element.textContent = "0";

            const trigger = ScrollTrigger.create({
                trigger: element,
                start: options.start || "top 80%",
                end: options.end || "bottom 20%",
                markers: options.markers || false,
                onEnter: () => {
                    gsap.to(element, {
                        textContent: targetValue,
                        duration: options.duration || 2,
                        ease: "power2.out",
                        snap: { textContent: 1 },
                        onUpdate: function () {
                            element.textContent = Math.ceil(
                                this.targets()[0].textContent,
                            );
                        },
                    });
                },
            });

            triggers.push(trigger);
        });

        return triggers;
    }

    /**
     * 刷新所有 ScrollTrigger
     */
    static refresh() {
        ScrollTrigger.refresh();
    }

    /**
     * 清理所有 ScrollTrigger
     */
    static killAll() {
        ScrollTrigger.killAll();
    }

    /**
     * 获取滚动进度
     */
    static getScrollProgress(): number {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        return Math.min(scrollTop / scrollHeight, 1);
    }
}

/**
 * 预设动画配置
 */
export const scrollAnimationPresets = {
    // 基础淡入
    fadeIn: (selector: string, markers = false) =>
        ScrollTriggerUtils.fadeIn(selector, { markers }),

    // 从下方滑入
    slideUp: (selector: string, markers = false) =>
        ScrollTriggerUtils.slideUp(selector, { markers }),

    // 缩放进入
    scaleIn: (selector: string, markers = false) =>
        ScrollTriggerUtils.scaleIn(selector, { markers }),

    // 慢速视差
    parallaxSlow: (selector: string, markers = false) =>
        ScrollTriggerUtils.parallax(selector, { speed: -0.3, markers }),

    // 快速视差
    parallaxFast: (selector: string, markers = false) =>
        ScrollTriggerUtils.parallax(selector, { speed: -0.7, markers }),

    // 水平进度条
    progressHorizontal: (selector: string, markers = false) =>
        ScrollTriggerUtils.progressBar(selector, {
            type: "horizontal",
            markers,
        }),

    // 圆形进度条
    progressCircular: (selector: string, markers = false) =>
        ScrollTriggerUtils.progressBar(selector, { type: "circular", markers }),
};
