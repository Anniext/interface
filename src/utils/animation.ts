// 动画相关工具函数
import { gsap } from "gsap";
import type { IAnimationConfig, IEasingFunction } from "@/types/animation";

/** 常用缓动函数配置 */
export const EASING_FUNCTIONS: Record<string, string> = {
    // 基础缓动
    linear: "none",
    easeIn: "power2.in",
    easeOut: "power2.out",
    easeInOut: "power2.inOut",

    // 弹性缓动
    elasticIn: "elastic.in(1, 0.3)",
    elasticOut: "elastic.out(1, 0.3)",
    elasticInOut: "elastic.inOut(1, 0.3)",

    // 反弹缓动
    bounceIn: "bounce.in",
    bounceOut: "bounce.out",
    bounceInOut: "bounce.inOut",

    // 回退缓动
    backIn: "back.in(1.7)",
    backOut: "back.out(1.7)",
    backInOut: "back.inOut(1.7)",

    // 指数缓动
    expoIn: "expo.in",
    expoOut: "expo.out",
    expoInOut: "expo.inOut",

    // 圆形缓动
    circIn: "circ.in",
    circOut: "circ.out",
    circInOut: "circ.inOut",
};

/** 默认动画配置 */
export const DEFAULT_ANIMATION_CONFIG: IAnimationConfig = {
    duration: 0.3,
    ease: "power2.out",
    delay: 0,
    stagger: 0,
    repeat: 0,
    yoyo: false,
    autoplay: true,
};

/**
 * 创建标准化的动画配置
 * @param config 部分配置
 * @returns 完整的动画配置
 */
export function createAnimationConfig(
    config: Partial<IAnimationConfig> = {},
): IAnimationConfig {
    return {
        ...DEFAULT_ANIMATION_CONFIG,
        ...config,
        ease:
            EASING_FUNCTIONS[config.ease as string] ||
            config.ease ||
            DEFAULT_ANIMATION_CONFIG.ease,
    };
}

/**
 * 淡入动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function fadeIn(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig(config);

    return gsap.fromTo(
        target,
        { opacity: 0 },
        {
            opacity: 1,
            duration: animConfig.duration,
            ease: animConfig.ease,
            delay: animConfig.delay,
            stagger: animConfig.stagger,
        },
    );
}

/**
 * 淡出动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function fadeOut(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig(config);

    return gsap.to(target, {
        opacity: 0,
        duration: animConfig.duration,
        ease: animConfig.ease,
        delay: animConfig.delay,
        stagger: animConfig.stagger,
    });
}

/**
 * 滑入动画（从下方）
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function slideInUp(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig(config);

    return gsap.fromTo(
        target,
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: animConfig.duration,
            ease: animConfig.ease,
            delay: animConfig.delay,
            stagger: animConfig.stagger,
        },
    );
}

/**
 * 滑入动画（从左侧）
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function slideInLeft(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig(config);

    return gsap.fromTo(
        target,
        { x: -50, opacity: 0 },
        {
            x: 0,
            opacity: 1,
            duration: animConfig.duration,
            ease: animConfig.ease,
            delay: animConfig.delay,
            stagger: animConfig.stagger,
        },
    );
}

/**
 * 缩放进入动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function scaleIn(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig(config);

    return gsap.fromTo(
        target,
        { scale: 0, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: animConfig.duration,
            ease: animConfig.ease,
            delay: animConfig.delay,
            stagger: animConfig.stagger,
        },
    );
}

/**
 * 旋转进入动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function rotateIn(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig(config);

    return gsap.fromTo(
        target,
        { rotation: -180, scale: 0, opacity: 0 },
        {
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: animConfig.duration,
            ease: animConfig.ease,
            delay: animConfig.delay,
            stagger: animConfig.stagger,
        },
    );
}

/**
 * 弹跳动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function bounce(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({ ...config, ease: "bounce.out" });

    return gsap.fromTo(
        target,
        { y: -30 },
        {
            y: 0,
            duration: animConfig.duration,
            ease: animConfig.ease,
            delay: animConfig.delay,
            stagger: animConfig.stagger,
        },
    );
}

/**
 * 摇摆动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function shake(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({ ...config, duration: 0.6 });

    return gsap.to(target, {
        x: [-10, 10, -8, 8, -6, 6, -4, 4, -2, 2, 0],
        duration: animConfig.duration,
        ease: animConfig.ease,
        delay: animConfig.delay,
    });
}

/**
 * 脉冲动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function pulse(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({
        ...config,
        duration: 1,
        repeat: -1,
        yoyo: true,
    });

    return gsap.to(target, {
        scale: 1.1,
        duration: animConfig.duration,
        ease: animConfig.ease,
        delay: animConfig.delay,
        repeat: animConfig.repeat,
        yoyo: animConfig.yoyo,
    });
}

/**
 * 呼吸动画
 * @param target 目标元素
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function breathe(
    target: gsap.TweenTarget,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({
        ...config,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
    });

    return gsap.to(target, {
        opacity: 0.6,
        scale: 0.95,
        duration: animConfig.duration,
        ease: animConfig.ease,
        delay: animConfig.delay,
        repeat: animConfig.repeat,
        yoyo: animConfig.yoyo,
    });
}

/**
 * 打字机效果
 * @param target 目标元素
 * @param text 要显示的文本
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function typewriter(
    target: HTMLElement,
    text: string,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({
        ...config,
        duration: text.length * 0.05,
    });

    // 清空初始内容
    target.textContent = "";

    return gsap.to(target, {
        duration: animConfig.duration,
        ease: "none",
        delay: animConfig.delay,
        onUpdate: function () {
            const progress = this.progress();
            const currentLength = Math.floor(progress * text.length);
            target.textContent = text.substring(0, currentLength);
        },
    });
}

/**
 * 数字计数动画
 * @param target 目标元素
 * @param endValue 结束值
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function countUp(
    target: HTMLElement,
    endValue: number,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({ ...config, duration: 2 });
    const startValue = 0;

    const obj = { value: startValue };

    return gsap.to(obj, {
        value: endValue,
        duration: animConfig.duration,
        ease: animConfig.ease,
        delay: animConfig.delay,
        onUpdate: function () {
            target.textContent = Math.floor(obj.value).toString();
        },
    });
}

/**
 * 进度条动画
 * @param target 目标元素
 * @param progress 进度值 (0-100)
 * @param config 动画配置
 * @returns GSAP动画实例
 */
export function progressBar(
    target: HTMLElement,
    progress: number,
    config: Partial<IAnimationConfig> = {},
) {
    const animConfig = createAnimationConfig({ ...config, duration: 1.5 });

    return gsap.to(target, {
        width: `${progress}%`,
        duration: animConfig.duration,
        ease: animConfig.ease,
        delay: animConfig.delay,
    });
}

/**
 * 创建交错动画
 * @param targets 目标元素数组
 * @param animationFn 动画函数
 * @param staggerDelay 交错延迟
 * @param config 动画配置
 * @returns GSAP时间轴
 */
export function createStaggerAnimation(
    targets: gsap.TweenTarget[],
    animationFn: (
        target: gsap.TweenTarget,
        config: Partial<IAnimationConfig>,
    ) => gsap.core.Tween,
    staggerDelay: number = 0.1,
    config: Partial<IAnimationConfig> = {},
) {
    const tl = gsap.timeline();

    targets.forEach((target, index) => {
        const animConfig = {
            ...config,
            delay: (config.delay || 0) + index * staggerDelay,
        };
        tl.add(animationFn(target, animConfig), 0);
    });

    return tl;
}

/**
 * 获取元素的变换原点
 * @param element HTML元素
 * @returns 变换原点字符串
 */
export function getTransformOrigin(element: HTMLElement): string {
    return window.getComputedStyle(element).transformOrigin;
}

/**
 * 设置元素的变换原点
 * @param element HTML元素
 * @param origin 变换原点
 */
export function setTransformOrigin(element: HTMLElement, origin: string): void {
    gsap.set(element, { transformOrigin: origin });
}

/**
 * 检查是否支持硬件加速
 * @returns 是否支持硬件加速
 */
export function supportsHardwareAcceleration(): boolean {
    const testElement = document.createElement("div");
    testElement.style.transform = "translateZ(0)";
    return testElement.style.transform !== "";
}

/**
 * 优化动画性能的工具函数
 * @param element 目标元素
 */
export function optimizeForAnimation(element: HTMLElement): void {
    gsap.set(element, {
        force3D: true,
        backfaceVisibility: "hidden",
        perspective: 1000,
    });
}

/**
 * 清理动画相关的样式
 * @param element 目标元素
 */
export function cleanupAnimation(element: HTMLElement): void {
    gsap.set(element, {
        clearProps: "all",
    });
}
