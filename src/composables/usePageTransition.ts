// 页面过渡动画组合式函数
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter, type RouteLocationNormalized } from "vue-router";
import { gsap } from "gsap";
import type { IAnimationManager } from "@/types/animation";

export interface PageTransitionConfig {
    /** 过渡类型 */
    type: "slide" | "fade" | "geometric" | "liquid" | "curtain";
    /** 过渡方向 */
    direction: "left" | "right" | "up" | "down";
    /** 持续时间（秒） */
    duration: number;
    /** 缓动函数 */
    ease: string;
    /** 是否显示加载进度 */
    showProgress: boolean;
    /** 是否启用几何图形效果 */
    enableGeometricShapes: boolean;
}

export interface TransitionState {
    /** 是否正在过渡 */
    isTransitioning: boolean;
    /** 过渡进度 (0-100) */
    progress: number;
    /** 当前过渡类型 */
    currentType: string;
    /** 过渡方向 */
    direction: string;
}

/**
 * 页面过渡动画组合式函数
 * @param config 过渡配置
 * @returns 过渡状态和控制方法
 */
export function usePageTransition(config: Partial<PageTransitionConfig> = {}) {
    // 默认配置
    const defaultConfig: PageTransitionConfig = {
        type: "geometric",
        direction: "right",
        duration: 1.2,
        ease: "power2.out",
        showProgress: true,
        enableGeometricShapes: true,
    };

    const transitionConfig = { ...defaultConfig, ...config };

    // 响应式状态
    const state = ref<TransitionState>({
        isTransitioning: false,
        progress: 0,
        currentType: transitionConfig.type,
        direction: transitionConfig.direction,
    });

    // 路由相关
    const route = useRoute();
    const router = useRouter();

    // 注入动画管理器（可选，如果没有提供则不使用）
    const animationManager = inject<IAnimationManager>(
        "animationManager",
        null,
    );

    // 过渡历史记录
    const transitionHistory = ref<
        Array<{
            from: string;
            to: string;
            type: string;
            timestamp: number;
        }>
    >([]);

    /**
     * 根据路由变化确定过渡方向
     */
    function determineTransitionDirection(
        from: RouteLocationNormalized,
        to: RouteLocationNormalized,
    ): string {
        // 路由层级映射
        const routeLevels: Record<string, number> = {
            "/": 0,
            "/skills": 1,
            "/experience": 2,
            "/projects": 3,
            "/achievements": 4,
            "/canvas-test": 10,
            "/particle-test": 11,
            "/shape-test": 12,
            "/physics-test": 13,
            "/animation-demo": 14,
        };

        const fromLevel = routeLevels[from.path] ?? 0;
        const toLevel = routeLevels[to.path] ?? 0;

        // 根据层级确定方向
        if (toLevel > fromLevel) {
            return "left"; // 向前导航，从右侧滑入
        } else if (toLevel < fromLevel) {
            return "right"; // 向后导航，从左侧滑入
        } else {
            return "fade"; // 同级导航，淡入淡出
        }
    }

    /**
     * 根据路由确定过渡类型
     */
    function determineTransitionType(
        from: RouteLocationNormalized,
        to: RouteLocationNormalized,
    ): string {
        // 测试页面使用几何图形过渡
        if (to.path.includes("test") || to.path.includes("demo")) {
            return "geometric";
        }

        // 主要业务页面使用滑动过渡
        if (
            ["/skills", "/experience", "/projects", "/achievements"].includes(
                to.path,
            )
        ) {
            return "slide";
        }

        // 首页使用液体过渡
        if (to.path === "/") {
            return "liquid";
        }

        return transitionConfig.type;
    }

    /**
     * 滑动过渡动画
     */
    async function slideTransition(
        exitElement: HTMLElement,
        enterElement: HTMLElement,
        direction: string,
    ): Promise<void> {
        const tl = gsap.timeline();

        // 确定滑动距离
        const distance = window.innerWidth;
        const exitX = direction === "left" ? -distance : distance;
        const enterX = direction === "left" ? distance : -distance;

        // 设置初始状态
        gsap.set(enterElement, { x: enterX, opacity: 1 });

        // 执行过渡动画
        tl.to(exitElement, {
            x: exitX,
            opacity: 0,
            duration: transitionConfig.duration * 0.6,
            ease: "power2.in",
        }).to(
            enterElement,
            {
                x: 0,
                opacity: 1,
                duration: transitionConfig.duration * 0.8,
                ease: transitionConfig.ease,
            },
            "-=0.2",
        );

        return new Promise((resolve) => {
            tl.eventCallback("onComplete", resolve);
        });
    }

    /**
     * 淡入淡出过渡动画
     */
    async function fadeTransition(
        exitElement: HTMLElement,
        enterElement: HTMLElement,
    ): Promise<void> {
        const tl = gsap.timeline();

        // 设置初始状态
        gsap.set(enterElement, { opacity: 0, y: 20 });

        // 执行过渡动画
        tl.to(exitElement, {
            opacity: 0,
            y: -20,
            duration: transitionConfig.duration * 0.5,
            ease: "power2.in",
        }).to(
            enterElement,
            {
                opacity: 1,
                y: 0,
                duration: transitionConfig.duration * 0.7,
                ease: transitionConfig.ease,
            },
            "-=0.1",
        );

        return new Promise((resolve) => {
            tl.eventCallback("onComplete", resolve);
        });
    }

    /**
     * 几何图形过渡动画
     */
    async function geometricTransition(
        exitElement: HTMLElement,
        enterElement: HTMLElement,
    ): Promise<void> {
        const tl = gsap.timeline();

        // 创建几何图形遮罩
        const shapes = createGeometricShapes();

        // 设置初始状态
        gsap.set(enterElement, { opacity: 0, scale: 0.9 });
        gsap.set(shapes, { scale: 0, rotation: 0 });

        // 执行过渡动画
        tl.to(exitElement, {
            opacity: 0,
            scale: 1.1,
            duration: transitionConfig.duration * 0.4,
            ease: "power2.in",
        })
            .to(
                shapes,
                {
                    scale: 1,
                    rotation: 360,
                    duration: transitionConfig.duration * 0.6,
                    ease: "back.out(1.7)",
                    stagger: 0.1,
                },
                "-=0.2",
            )
            .to(
                enterElement,
                {
                    opacity: 1,
                    scale: 1,
                    duration: transitionConfig.duration * 0.6,
                    ease: transitionConfig.ease,
                },
                "-=0.3",
            )
            .to(
                shapes,
                {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in",
                    stagger: 0.05,
                },
                "-=0.2",
            );

        return new Promise((resolve) => {
            tl.eventCallback("onComplete", () => {
                // 清理几何图形
                shapes.forEach((shape) => shape.remove());
                resolve();
            });
        });
    }

    /**
     * 液体过渡动画
     */
    async function liquidTransition(
        exitElement: HTMLElement,
        enterElement: HTMLElement,
    ): Promise<void> {
        const tl = gsap.timeline();

        // 创建液体效果遮罩
        const liquidMask = createLiquidMask();

        // 设置初始状态
        gsap.set(enterElement, { opacity: 0 });
        gsap.set(liquidMask, { scaleY: 0, transformOrigin: "bottom" });

        // 执行过渡动画
        tl.to(liquidMask, {
            scaleY: 1,
            duration: transitionConfig.duration * 0.5,
            ease: "power2.out",
        })
            .to(
                exitElement,
                {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                },
                "-=0.2",
            )
            .to(
                enterElement,
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out",
                },
                "-=0.1",
            )
            .to(liquidMask, {
                scaleY: 0,
                transformOrigin: "top",
                duration: transitionConfig.duration * 0.4,
                ease: "power2.in",
                onComplete: () => liquidMask.remove(),
            });

        return new Promise((resolve) => {
            tl.eventCallback("onComplete", resolve);
        });
    }

    /**
     * 窗帘过渡动画
     */
    async function curtainTransition(
        exitElement: HTMLElement,
        enterElement: HTMLElement,
    ): Promise<void> {
        const tl = gsap.timeline();

        // 创建窗帘效果
        const curtains = createCurtainEffect();

        // 设置初始状态
        gsap.set(enterElement, { opacity: 0 });
        gsap.set(curtains.left, { x: "-100%" });
        gsap.set(curtains.right, { x: "100%" });

        // 执行过渡动画
        tl.to([curtains.left, curtains.right], {
            x: "0%",
            duration: transitionConfig.duration * 0.4,
            ease: "power2.out",
        })
            .to(
                exitElement,
                {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.in",
                },
                "-=0.1",
            )
            .to(
                enterElement,
                {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                },
                "-=0.1",
            )
            .to([curtains.left, curtains.right], {
                x: (index: number) => (index === 0 ? "-100%" : "100%"),
                duration: transitionConfig.duration * 0.4,
                ease: "power2.in",
                onComplete: () => {
                    curtains.left.remove();
                    curtains.right.remove();
                },
            });

        return new Promise((resolve) => {
            tl.eventCallback("onComplete", resolve);
        });
    }

    /**
     * 创建几何图形
     */
    function createGeometricShapes(): HTMLElement[] {
        const shapes: HTMLElement[] = [];
        const container = document.createElement("div");
        container.className = "geometric-transition-shapes";
        container.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9999;
            pointer-events: none;
        `;

        const shapeTypes = ["circle", "square", "triangle"];
        const colors = ["#3b82f6", "#8b5cf6", "#06d6a0", "#f72585"];

        for (let i = 0; i < 8; i++) {
            const shape = document.createElement("div");
            const shapeType =
                shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            shape.className = `shape-${shapeType}`;
            shape.style.cssText = `
                position: absolute;
                width: ${30 + Math.random() * 40}px;
                height: ${30 + Math.random() * 40}px;
                background-color: ${color};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0.8;
                ${shapeType === "circle" ? "border-radius: 50%;" : ""}
                ${shapeType === "square" ? "border-radius: 8px;" : ""}
            `;

            container.appendChild(shape);
            shapes.push(shape);
        }

        document.body.appendChild(container);
        return shapes;
    }

    /**
     * 创建液体遮罩
     */
    function createLiquidMask(): HTMLElement {
        const mask = document.createElement("div");
        mask.className = "liquid-transition-mask";
        mask.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            pointer-events: none;
            border-radius: 0 0 50% 50%;
        `;

        document.body.appendChild(mask);
        return mask;
    }

    /**
     * 创建窗帘效果
     */
    function createCurtainEffect(): { left: HTMLElement; right: HTMLElement } {
        const left = document.createElement("div");
        const right = document.createElement("div");

        const curtainStyle = `
            position: fixed;
            top: 0;
            bottom: 0;
            width: 50%;
            z-index: 9999;
            background: linear-gradient(45deg, #1e293b, #334155);
            pointer-events: none;
        `;

        left.style.cssText = curtainStyle + "left: 0;";
        right.style.cssText = curtainStyle + "right: 0;";

        document.body.appendChild(left);
        document.body.appendChild(right);

        return { left, right };
    }

    /**
     * 执行页面过渡
     */
    async function executeTransition(
        from: RouteLocationNormalized,
        to: RouteLocationNormalized,
    ): Promise<void> {
        state.value.isTransitioning = true;
        state.value.progress = 0;

        // 确定过渡类型和方向
        const transitionType = determineTransitionType(from, to);
        const direction = determineTransitionDirection(from, to);

        state.value.currentType = transitionType;
        state.value.direction = direction;

        // 记录过渡历史
        transitionHistory.value.push({
            from: from.path,
            to: to.path,
            type: transitionType,
            timestamp: Date.now(),
        });

        // 模拟进度更新
        const progressInterval = setInterval(() => {
            state.value.progress = Math.min(
                100,
                state.value.progress + Math.random() * 20,
            );
            if (state.value.progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);

        try {
            // 获取页面元素
            const exitElement = document.querySelector(
                ".page-content",
            ) as HTMLElement;
            const enterElement = document.querySelector(
                ".page-content",
            ) as HTMLElement;

            if (!exitElement || !enterElement) {
                console.warn("页面元素未找到，跳过过渡动画");
                return;
            }

            // 根据类型执行对应的过渡动画
            switch (transitionType) {
                case "slide":
                    await slideTransition(exitElement, enterElement, direction);
                    break;
                case "fade":
                    await fadeTransition(exitElement, enterElement);
                    break;
                case "geometric":
                    await geometricTransition(exitElement, enterElement);
                    break;
                case "liquid":
                    await liquidTransition(exitElement, enterElement);
                    break;
                case "curtain":
                    await curtainTransition(exitElement, enterElement);
                    break;
                default:
                    await fadeTransition(exitElement, enterElement);
            }
        } catch (error) {
            console.error("页面过渡动画执行失败:", error);
        } finally {
            state.value.isTransitioning = false;
            state.value.progress = 100;
            clearInterval(progressInterval);
        }
    }

    /**
     * 更新过渡配置
     */
    function updateConfig(newConfig: Partial<PageTransitionConfig>): void {
        Object.assign(transitionConfig, newConfig);
    }

    /**
     * 获取过渡历史
     */
    function getTransitionHistory() {
        return transitionHistory.value;
    }

    /**
     * 清理过渡历史
     */
    function clearTransitionHistory(): void {
        transitionHistory.value = [];
    }

    // 计算属性
    const isTransitioning = computed(() => state.value.isTransitioning);
    const progress = computed(() => state.value.progress);
    const currentType = computed(() => state.value.currentType);
    const direction = computed(() => state.value.direction);

    return {
        // 状态
        state: computed(() => state.value),
        isTransitioning,
        progress,
        currentType,
        direction,

        // 方法
        executeTransition,
        updateConfig,
        getTransitionHistory,
        clearTransitionHistory,

        // 配置
        config: transitionConfig,
    };
}
