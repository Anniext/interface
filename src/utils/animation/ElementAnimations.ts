// 元素动画效果工具函数
import { gsap } from "gsap";
import type { IAnimationConfig } from "@/types/animation";

/** 卡片翻转动画配置 */
export interface ICardFlipConfig extends Partial<IAnimationConfig> {
    /** 翻转轴 */
    axis?: "x" | "y";
    /** 是否启用3D效果 */
    enable3D?: boolean;
    /** 翻转角度 */
    angle?: number;
}

/** 卡片展开动画配置 */
export interface ICardExpandConfig extends Partial<IAnimationConfig> {
    /** 最大高度 */
    maxHeight?: number;
    /** 是否同时动画透明度 */
    animateOpacity?: boolean;
    /** 内容选择器 */
    contentSelector?: string;
}

/** 悬停反馈动画配置 */
export interface IHoverFeedbackConfig extends Partial<IAnimationConfig> {
    /** 悬停缩放比例 */
    scale?: number;
    /** 是否显示阴影 */
    showShadow?: boolean;
    /** 阴影颜色 */
    shadowColor?: string;
    /** 是否显示发光效果 */
    showGlow?: boolean;
    /** 发光颜色 */
    glowColor?: string;
}

/** 点击反馈动画配置 */
export interface IClickFeedbackConfig extends Partial<IAnimationConfig> {
    /** 点击缩放比例 */
    scale?: number;
    /** 是否创建涟漪效果 */
    createRipple?: boolean;
    /** 涟漪颜色 */
    rippleColor?: string;
    /** 是否创建粒子效果 */
    createParticles?: boolean;
    /** 粒子数量 */
    particleCount?: number;
}

/** 打字机效果配置 */
export interface ITypewriterConfig extends Partial<IAnimationConfig> {
    /** 打字速度（字符/秒） */
    speed?: number;
    /** 是否显示光标 */
    showCursor?: boolean;
    /** 光标字符 */
    cursorChar?: string;
    /** 是否随机速度 */
    randomSpeed?: boolean;
    /** 暂停字符 */
    pauseChars?: string[];
    /** 暂停时长 */
    pauseDuration?: number;
}

/** 进度条动画配置 */
export interface IProgressBarConfig extends Partial<IAnimationConfig> {
    /** 目标进度 (0-100) */
    progress: number;
    /** 进度条颜色 */
    color?: string;
    /** 是否显示数字 */
    showNumber?: boolean;
    /** 数字格式化函数 */
    numberFormatter?: (value: number) => string;
}

/**
 * 创建卡片翻转动画
 * @param element 目标元素
 * @param config 动画配置
 * @returns GSAP时间轴
 */
export function createCardFlipAnimation(
    element: HTMLElement,
    config: ICardFlipConfig = {},
): gsap.core.Timeline {
    const {
        duration = 0.6,
        ease = "power2.inOut",
        axis = "y",
        enable3D = true,
        angle = 180,
        delay = 0,
    } = config;

    const tl = gsap.timeline({ delay });

    // 设置3D变换
    if (enable3D) {
        gsap.set(element, {
            perspective: 1000,
            transformStyle: "preserve-3d",
        });
    }

    // 执行翻转动画
    const rotationProperty = axis === "x" ? "rotationX" : "rotationY";
    tl.to(element, {
        [rotationProperty]: angle,
        duration,
        ease,
    });

    return tl;
}

/**
 * 创建卡片展开动画
 * @param element 目标元素
 * @param config 动画配置
 * @returns GSAP时间轴
 */
export function createCardExpandAnimation(
    element: HTMLElement,
    config: ICardExpandConfig = {},
): gsap.core.Timeline {
    const {
        duration = 0.4,
        ease = "power2.out",
        maxHeight = "auto",
        animateOpacity = true,
        contentSelector = ".card-content",
        delay = 0,
    } = config;

    const tl = gsap.timeline({ delay });
    const content = element.querySelector(contentSelector) as HTMLElement;

    if (!content) {
        console.warn("未找到卡片内容元素");
        return tl;
    }

    // 测量内容高度
    const originalHeight = content.style.height;
    const originalOverflow = content.style.overflow;

    gsap.set(content, { height: "auto", overflow: "visible" });
    const targetHeight =
        typeof maxHeight === "number"
            ? Math.min(content.offsetHeight, maxHeight)
            : content.offsetHeight;
    gsap.set(content, { height: originalHeight, overflow: originalOverflow });

    // 展开动画
    tl.to(content, {
        height: targetHeight,
        duration,
        ease,
    });

    if (animateOpacity) {
        tl.to(
            content,
            {
                opacity: 1,
                duration: duration * 0.6,
                ease,
            },
            "-=0.2",
        );
    }

    return tl;
}

/**
 * 创建悬停反馈动画
 * @param element 目标元素
 * @param config 动画配置
 * @returns 动画控制对象
 */
export function createHoverFeedbackAnimation(
    element: HTMLElement,
    config: IHoverFeedbackConfig = {},
) {
    const {
        duration = 0.3,
        ease = "power2.out",
        scale = 1.05,
        showShadow = true,
        shadowColor = "rgba(0, 0, 0, 0.15)",
        showGlow = false,
        glowColor = "rgba(59, 130, 246, 0.5)",
    } = config;

    let hoverTl: gsap.core.Timeline | null = null;

    const animateIn = () => {
        if (hoverTl) hoverTl.kill();
        hoverTl = gsap.timeline();

        // 缩放动画
        hoverTl.to(element, {
            scale,
            duration,
            ease,
        });

        // 阴影效果
        if (showShadow) {
            hoverTl.to(
                element,
                {
                    boxShadow: `0 8px 25px ${shadowColor}`,
                    duration,
                    ease,
                },
                0,
            );
        }

        // 发光效果
        if (showGlow) {
            hoverTl.to(
                element,
                {
                    filter: `drop-shadow(0 0 10px ${glowColor})`,
                    duration,
                    ease,
                },
                0,
            );
        }
    };

    const animateOut = () => {
        if (hoverTl) hoverTl.kill();
        hoverTl = gsap.timeline();

        hoverTl.to(element, {
            scale: 1,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            filter: "none",
            duration,
            ease,
        });
    };

    // 添加事件监听器
    element.addEventListener("mouseenter", animateIn);
    element.addEventListener("mouseleave", animateOut);

    return {
        destroy: () => {
            element.removeEventListener("mouseenter", animateIn);
            element.removeEventListener("mouseleave", animateOut);
            if (hoverTl) hoverTl.kill();
        },
        animateIn,
        animateOut,
    };
}

/**
 * 创建点击反馈动画
 * @param element 目标元素
 * @param config 动画配置
 * @returns 动画控制对象
 */
export function createClickFeedbackAnimation(
    element: HTMLElement,
    config: IClickFeedbackConfig = {},
) {
    const {
        duration = 0.2,
        ease = "power2.out",
        scale = 0.95,
        createRipple = true,
        rippleColor = "rgba(255, 255, 255, 0.3)",
        createParticles = false,
        particleCount = 8,
    } = config;

    let clickTl: gsap.core.Timeline | null = null;

    const createRippleEffect = (event: MouseEvent) => {
        if (!createRipple) return;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const ripple = document.createElement("div");
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background-color: ${rippleColor};
            pointer-events: none;
            transform: translate(-50%, -50%);
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            z-index: 1000;
        `;

        element.style.position = "relative";
        element.style.overflow = "hidden";
        element.appendChild(ripple);

        const maxSize = Math.max(rect.width, rect.height) * 2;

        gsap.to(ripple, {
            width: maxSize,
            height: maxSize,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove(),
        });
    };

    const createParticleEffect = () => {
        if (!createParticles) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background-color: #3b82f6;
                border-radius: 50%;
                pointer-events: none;
                left: ${centerX}px;
                top: ${centerY}px;
                z-index: 1001;
            `;

            element.appendChild(particle);

            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            gsap.to(particle, {
                x,
                y,
                opacity: 0,
                scale: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: Math.random() * 0.1,
                onComplete: () => particle.remove(),
            });
        }
    };

    const handleMouseDown = (event: MouseEvent) => {
        if (clickTl) clickTl.kill();
        clickTl = gsap.timeline();

        clickTl.to(element, {
            scale,
            duration: duration * 0.5,
            ease,
        });

        createRippleEffect(event);
    };

    const handleMouseUp = () => {
        if (clickTl) {
            clickTl.to(element, {
                scale: 1,
                duration: duration * 0.5,
                ease,
            });
        }
    };

    const handleClick = () => {
        createParticleEffect();
    };

    // 添加事件监听器
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("click", handleClick);

    return {
        destroy: () => {
            element.removeEventListener("mousedown", handleMouseDown);
            element.removeEventListener("mouseup", handleMouseUp);
            element.removeEventListener("click", handleClick);
            if (clickTl) clickTl.kill();
        },
    };
}

/**
 * 创建打字机效果动画
 * @param element 目标元素
 * @param text 要显示的文本
 * @param config 动画配置
 * @returns 动画控制对象
 */
export function createTypewriterAnimation(
    element: HTMLElement,
    text: string,
    config: ITypewriterConfig = {},
) {
    const {
        speed = 50,
        showCursor = true,
        cursorChar = "|",
        randomSpeed = false,
        pauseChars = [".", "!", "?", ","],
        pauseDuration = 0.5,
        delay = 0,
    } = config;

    let typingTl: gsap.core.Timeline | null = null;
    let cursorTl: gsap.core.Timeline | null = null;
    let currentIndex = 0;

    const startCursorBlink = () => {
        if (!showCursor) return;

        cursorTl = gsap.timeline({ repeat: -1 });
        cursorTl.to({}, { duration: 0.5 });
        cursorTl.call(() => {
            element.textContent =
                element.textContent?.replace(/[|_]$/, "") + cursorChar;
        });
        cursorTl.to({}, { duration: 0.5 });
        cursorTl.call(() => {
            element.textContent = element.textContent?.replace(/[|_]$/, "");
        });
    };

    const start = () => {
        if (typingTl) typingTl.kill();
        if (cursorTl) cursorTl.kill();

        element.textContent = "";
        currentIndex = 0;

        startCursorBlink();

        typingTl = gsap.timeline({
            delay,
            onComplete: () => {
                if (cursorTl) cursorTl.kill();
                if (showCursor) {
                    element.textContent = text + cursorChar;
                    gsap.to(
                        {},
                        {
                            duration: 2,
                            onComplete: () => {
                                element.textContent = text;
                            },
                        },
                    );
                }
            },
        });

        // 添加打字动画
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const baseDelay = i / speed;
            const randomDelay = randomSpeed ? (Math.random() - 0.5) * 0.1 : 0;
            const shouldPause = pauseChars.includes(char);
            const pauseDelay = shouldPause ? pauseDuration : 0;

            typingTl.call(
                () => {
                    currentIndex = i + 1;
                    const displayText = text.substring(0, currentIndex);
                    element.textContent =
                        displayText + (showCursor ? cursorChar : "");
                },
                [],
                baseDelay + randomDelay + pauseDelay,
            );
        }
    };

    const stop = () => {
        if (typingTl) typingTl.kill();
        if (cursorTl) cursorTl.kill();
    };

    const reset = () => {
        stop();
        element.textContent = "";
        currentIndex = 0;
    };

    return {
        start,
        stop,
        reset,
        destroy: stop,
        progress: () => currentIndex / text.length,
    };
}

/**
 * 创建进度条动画
 * @param element 目标元素
 * @param config 动画配置
 * @returns 动画控制对象
 */
export function createProgressBarAnimation(
    element: HTMLElement,
    config: IProgressBarConfig,
) {
    const {
        progress,
        duration = 2,
        ease = "power2.out",
        color = "#3b82f6",
        showNumber = true,
        numberFormatter = (value: number) => `${Math.round(value)}%`,
        delay = 0,
    } = config;

    let progressTl: gsap.core.Timeline | null = null;
    const progressBar = element.querySelector(".progress-bar") as HTMLElement;
    const progressNumber = element.querySelector(
        ".progress-number",
    ) as HTMLElement;

    if (!progressBar) {
        console.warn("未找到进度条元素 (.progress-bar)");
        return { start: () => {}, stop: () => {}, reset: () => {} };
    }

    // 设置初始样式
    gsap.set(progressBar, {
        width: "0%",
        backgroundColor: color,
    });

    if (showNumber && progressNumber) {
        gsap.set(progressNumber, { textContent: "0%" });
    }

    const start = () => {
        if (progressTl) progressTl.kill();

        progressTl = gsap.timeline({ delay });

        // 进度条宽度动画
        progressTl.to(progressBar, {
            width: `${progress}%`,
            duration,
            ease,
        });

        // 数字动画
        if (showNumber && progressNumber) {
            const numberObj = { value: 0 };
            progressTl.to(
                numberObj,
                {
                    value: progress,
                    duration,
                    ease,
                    onUpdate: () => {
                        progressNumber.textContent = numberFormatter(
                            numberObj.value,
                        );
                    },
                },
                0,
            );
        }
    };

    const stop = () => {
        if (progressTl) progressTl.kill();
    };

    const reset = () => {
        stop();
        gsap.set(progressBar, { width: "0%" });
        if (showNumber && progressNumber) {
            progressNumber.textContent = "0%";
        }
    };

    return {
        start,
        stop,
        reset,
        destroy: stop,
    };
}

/**
 * 批量创建元素动画
 * @param elements 目标元素数组
 * @param animationFn 动画函数
 * @param staggerDelay 交错延迟
 * @returns 动画控制对象数组
 */
export function createBatchAnimation<T>(
    elements: HTMLElement[],
    animationFn: (element: HTMLElement, index: number) => T,
    staggerDelay: number = 0.1,
): T[] {
    return elements.map((element, index) => {
        // 添加交错延迟
        setTimeout(() => {
            return animationFn(element, index);
        }, index * staggerDelay * 1000);

        return animationFn(element, index);
    });
}

/**
 * 创建序列动画
 * @param animations 动画函数数组
 * @param delay 每个动画之间的延迟
 * @returns GSAP时间轴
 */
export function createSequenceAnimation(
    animations: Array<() => gsap.core.Timeline>,
    delay: number = 0.2,
): gsap.core.Timeline {
    const masterTl = gsap.timeline();

    animations.forEach((animationFn, index) => {
        const tl = animationFn();
        masterTl.add(tl, index * delay);
    });

    return masterTl;
}

/**
 * 创建并行动画
 * @param animations 动画函数数组
 * @returns GSAP时间轴
 */
export function createParallelAnimation(
    animations: Array<() => gsap.core.Timeline>,
): gsap.core.Timeline {
    const masterTl = gsap.timeline();

    animations.forEach((animationFn) => {
        const tl = animationFn();
        masterTl.add(tl, 0);
    });

    return masterTl;
}
