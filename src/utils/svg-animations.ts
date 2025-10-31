// SVG 动画工具函数

import { gsap } from "gsap";

/** 动画配置接口 */
export interface ISvgAnimationConfig {
    duration?: number;
    ease?: string;
    repeat?: number;
    yoyo?: boolean;
    delay?: number;
    stagger?: number;
}

/** 路径描边动画 */
export function createPathDrawAnimation(
    element: SVGElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();
    const paths = element.querySelectorAll("path");

    if (paths.length === 0) return tl;

    // 设置默认配置
    const defaultConfig = {
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1,
        ...config,
    };

    // 初始化路径
    paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            stroke: "currentColor",
            fill: "none",
        });
    });

    // 创建描边动画
    tl.to(paths, {
        strokeDashoffset: 0,
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
        stagger: defaultConfig.stagger,
    });

    // 填充动画
    tl.to(
        paths,
        {
            fill: "currentColor",
            duration: defaultConfig.duration * 0.3,
            ease: "power2.out",
            stagger: defaultConfig.stagger * 0.5,
        },
        "-=0.5",
    );

    return tl;
}

/** 图标变形动画 */
export function createMorphAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        ...config,
    };

    tl.to(element, {
        scaleX: 1.2,
        scaleY: 0.8,
        duration: defaultConfig.duration * 0.3,
        ease: "power2.inOut",
    })
        .to(element, {
            scaleX: 0.8,
            scaleY: 1.2,
            duration: defaultConfig.duration * 0.3,
            ease: "power2.inOut",
        })
        .to(element, {
            scaleX: 1,
            scaleY: 1,
            duration: defaultConfig.duration * 0.4,
            ease: defaultConfig.ease,
        });

    return tl;
}

/** 图标闪烁动画 */
export function createGlowAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        ...config,
    };

    tl.to(element, {
        filter: "drop-shadow(0 0 10px currentColor)",
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
        repeat: defaultConfig.repeat,
        yoyo: defaultConfig.yoyo,
    });

    return tl;
}

/** 图标弹跳动画 */
export function createBounceAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 0.6,
        ease: "bounce.out",
        ...config,
    };

    tl.fromTo(
        element,
        { y: -50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: defaultConfig.duration,
            ease: defaultConfig.ease,
        },
    );

    return tl;
}

/** 图标旋转动画 */
export function createSpinAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 1,
        ease: "none",
        repeat: -1,
        ...config,
    };

    tl.to(element, {
        rotation: 360,
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
        repeat: defaultConfig.repeat,
    });

    return tl;
}

/** 图标缩放脉冲动画 */
export function createPulseAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        ...config,
    };

    tl.to(element, {
        scale: 1.1,
        opacity: 0.8,
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
        repeat: defaultConfig.repeat,
        yoyo: defaultConfig.yoyo,
    });

    return tl;
}

/** 图标摇摆动画 */
export function createShakeAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 0.5,
        ease: "power2.inOut",
        ...config,
    };

    tl.to(element, {
        x: -5,
        duration: defaultConfig.duration * 0.1,
        ease: defaultConfig.ease,
    })
        .to(element, {
            x: 5,
            duration: defaultConfig.duration * 0.1,
            ease: defaultConfig.ease,
        })
        .to(element, {
            x: -3,
            duration: defaultConfig.duration * 0.1,
            ease: defaultConfig.ease,
        })
        .to(element, {
            x: 3,
            duration: defaultConfig.duration * 0.1,
            ease: defaultConfig.ease,
        })
        .to(element, {
            x: 0,
            duration: defaultConfig.duration * 0.6,
            ease: "elastic.out(1, 0.3)",
        });

    return tl;
}

/** 图标翻转动画 */
export function createFlipAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 0.6,
        ease: "power2.inOut",
        ...config,
    };

    tl.to(element, {
        rotationY: 90,
        duration: defaultConfig.duration * 0.5,
        ease: defaultConfig.ease,
    }).to(element, {
        rotationY: 0,
        duration: defaultConfig.duration * 0.5,
        ease: defaultConfig.ease,
    });

    return tl;
}

/** 图标淡入动画 */
export function createFadeInAnimation(
    element: HTMLElement,
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 0.5,
        ease: "power2.out",
        ...config,
    };

    tl.fromTo(
        element,
        { opacity: 0, scale: 0.8 },
        {
            opacity: 1,
            scale: 1,
            duration: defaultConfig.duration,
            ease: defaultConfig.ease,
        },
    );

    return tl;
}

/** 图标滑入动画 */
export function createSlideInAnimation(
    element: HTMLElement,
    direction: "left" | "right" | "top" | "bottom" = "left",
    config: ISvgAnimationConfig = {},
): gsap.core.Timeline {
    const tl = gsap.timeline();

    const defaultConfig = {
        duration: 0.5,
        ease: "power2.out",
        ...config,
    };

    const fromProps: any = { opacity: 0 };
    const toProps: any = { opacity: 1 };

    switch (direction) {
        case "left":
            fromProps.x = -50;
            toProps.x = 0;
            break;
        case "right":
            fromProps.x = 50;
            toProps.x = 0;
            break;
        case "top":
            fromProps.y = -50;
            toProps.y = 0;
            break;
        case "bottom":
            fromProps.y = 50;
            toProps.y = 0;
            break;
    }

    tl.fromTo(element, fromProps, {
        ...toProps,
        duration: defaultConfig.duration,
        ease: defaultConfig.ease,
    });

    return tl;
}

/** 创建组合动画 */
export function createComboAnimation(
    element: HTMLElement,
    animations: Array<{
        type: string;
        config?: ISvgAnimationConfig;
        delay?: number;
    }>,
): gsap.core.Timeline {
    const masterTl = gsap.timeline();

    animations.forEach(({ type, config = {}, delay = 0 }) => {
        let animation: gsap.core.Timeline;

        switch (type) {
            case "bounce":
                animation = createBounceAnimation(element, config);
                break;
            case "spin":
                animation = createSpinAnimation(element, config);
                break;
            case "pulse":
                animation = createPulseAnimation(element, config);
                break;
            case "shake":
                animation = createShakeAnimation(element, config);
                break;
            case "flip":
                animation = createFlipAnimation(element, config);
                break;
            case "glow":
                animation = createGlowAnimation(element, config);
                break;
            case "morph":
                animation = createMorphAnimation(element, config);
                break;
            case "fadeIn":
                animation = createFadeInAnimation(element, config);
                break;
            default:
                animation = gsap.timeline();
        }

        masterTl.add(animation, delay);
    });

    return masterTl;
}

/** 动画预设配置 */
export const ANIMATION_PRESETS = {
    // 悬停效果
    hover: {
        duration: 0.3,
        ease: "power2.out",
    },
    // 点击效果
    click: {
        duration: 0.1,
        ease: "power2.out",
    },
    // 加载效果
    loading: {
        duration: 1,
        ease: "none",
        repeat: -1,
    },
    // 成功效果
    success: {
        duration: 0.6,
        ease: "back.out(1.7)",
    },
    // 错误效果
    error: {
        duration: 0.5,
        ease: "power2.inOut",
    },
    // 警告效果
    warning: {
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
    },
} as const;
