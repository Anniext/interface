// 简化的物理动画效果管理器
import { gsap } from "gsap";

/**
 * 技能标签物理掉落配置
 */
export interface ISkillDropConfig {
    /** 标签数据 */
    skills: Array<{
        id: string;
        name: string;
        level: number;
        color: string;
        icon?: string;
    }>;
    /** 掉落区域 */
    dropArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** 物理属性 */
    physics: {
        gravity: number;
        bounce: number;
        friction: number;
        mass: number;
    };
    /** 动画配置 */
    animation: {
        staggerDelay: number;
        fallDuration: number;
        bounceCount: number;
    };
}

/**
 * 奖项碰撞动画配置
 */
export interface IAwardCollisionConfig {
    /** 奖项数据 */
    awards: Array<{
        id: string;
        title: string;
        level: "gold" | "silver" | "bronze" | "special";
        icon: string;
        year: string;
    }>;
    /** 碰撞效果 */
    collision: {
        sparkleCount: number;
        shakeIntensity: number;
        glowDuration: number;
        soundEnabled: boolean;
    };
    /** 物理属性 */
    physics: {
        restitution: number;
        friction: number;
        density: number;
    };
}

/**
 * 导航元素物理交互配置
 */
export interface INavigationPhysicsConfig {
    /** 导航项 */
    items: Array<{
        id: string;
        label: string;
        icon: string;
        path: string;
    }>;
    /** 交互效果 */
    interaction: {
        hoverForce: number;
        clickImpulse: number;
        magneticRange: number;
        dampingFactor: number;
    };
    /** 连接效果 */
    connections: {
        enabled: boolean;
        maxDistance: number;
        springStiffness: number;
        lineOpacity: number;
    };
}

/**
 * 页面过渡物理效果配置
 */
export interface IPageTransitionConfig {
    /** 过渡类型 */
    type: "slide" | "fade" | "morph" | "particle" | "liquid";
    /** 物理参数 */
    physics: {
        velocity: number;
        friction: number;
        elasticity: number;
        turbulence: number;
    };
    /** 视觉效果 */
    visual: {
        particleCount: number;
        trailLength: number;
        colorGradient: string[];
        blendMode: string;
    };
}

/**
 * 简化的物理动画效果管理器
 */
export class SimplePhysicsAnimationEffects {
    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private activeEffects = new Map<string, any>();

    constructor(canvas: HTMLCanvasElement | null) {
        this.canvas = canvas;
        this.ctx = canvas?.getContext("2d") || null;
    }

    /**
     * 创建技能标签物理掉落效果
     */
    createSkillDropEffect(config: ISkillDropConfig): string {
        const effectId = `skill-drop-${Date.now()}`;

        // 存储效果配置
        this.activeEffects.set(effectId, {
            type: "skill-drop",
            config,
            startTime: performance.now(),
        });

        console.log("创建技能掉落效果", effectId);
        return effectId;
    }

    /**
     * 创建奖项物理碰撞动画
     */
    createAwardCollisionEffect(config: IAwardCollisionConfig): string {
        const effectId = `award-collision-${Date.now()}`;

        // 存储效果配置
        this.activeEffects.set(effectId, {
            type: "award-collision",
            config,
            startTime: performance.now(),
        });

        console.log("创建奖项碰撞效果", effectId);
        return effectId;
    }

    /**
     * 创建导航元素物理交互
     */
    createNavigationPhysicsEffect(config: INavigationPhysicsConfig): string {
        const effectId = `navigation-physics-${Date.now()}`;

        // 存储效果配置
        this.activeEffects.set(effectId, {
            type: "navigation-physics",
            config,
            startTime: performance.now(),
        });

        console.log("创建导航物理交互效果", effectId);
        return effectId;
    }

    /**
     * 创建物理驱动的页面过渡效果
     */
    createPageTransitionEffect(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): Promise<void> {
        return new Promise((resolve) => {
            const effectId = `page-transition-${Date.now()}`;

            // 简化的过渡效果实现
            const timeline = gsap.timeline({
                onComplete: resolve,
            });

            switch (config.type) {
                case "slide":
                    timeline
                        .to(fromElement, {
                            x: "-100%",
                            duration: 0.8,
                            ease: "power2.inOut",
                        })
                        .fromTo(
                            toElement,
                            { x: "100%" },
                            {
                                x: "0%",
                                duration: 0.8,
                                ease: "power2.inOut",
                            },
                            "-=0.4",
                        );
                    break;
                case "fade":
                    timeline
                        .to(fromElement, {
                            opacity: 0,
                            duration: 0.4,
                            ease: "power2.out",
                        })
                        .fromTo(
                            toElement,
                            { opacity: 0 },
                            {
                                opacity: 1,
                                duration: 0.4,
                                ease: "power2.in",
                            },
                        );
                    break;
                case "particle":
                    // 简化的粒子效果
                    this.createParticleTransition(
                        fromElement,
                        toElement,
                        config,
                    );
                    setTimeout(resolve, 1000);
                    break;
                default:
                    resolve();
            }

            console.log("创建页面过渡效果", effectId);
        });
    }

    /**
     * 创建简化的粒子过渡效果
     */
    private createParticleTransition(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): void {
        // 创建粒子容器
        const particleContainer = document.createElement("div");
        particleContainer.style.position = "fixed";
        particleContainer.style.top = "0";
        particleContainer.style.left = "0";
        particleContainer.style.width = "100%";
        particleContainer.style.height = "100%";
        particleContainer.style.pointerEvents = "none";
        particleContainer.style.zIndex = "9999";
        document.body.appendChild(particleContainer);

        // 创建粒子
        const particleCount = config.visual.particleCount || 50;
        const particles: HTMLElement[] = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.style.position = "absolute";
            particle.style.width = "4px";
            particle.style.height = "4px";
            particle.style.backgroundColor =
                config.visual.colorGradient[
                    Math.floor(
                        Math.random() * config.visual.colorGradient.length,
                    )
                ] || "#3b82f6";
            particle.style.borderRadius = "50%";
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${Math.random() * window.innerHeight}px`;

            particleContainer.appendChild(particle);
            particles.push(particle);
        }

        // 动画粒子
        particles.forEach((particle, index) => {
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                scale: 0,
                opacity: 0,
                duration: 1,
                delay: index * 0.01,
                ease: "power2.out",
                onComplete: () => {
                    if (index === particles.length - 1) {
                        // 清理粒子容器
                        document.body.removeChild(particleContainer);
                    }
                },
            });
        });
    }

    /**
     * 移除效果
     */
    removeEffect(effectId: string): void {
        const effect = this.activeEffects.get(effectId);
        if (effect) {
            this.activeEffects.delete(effectId);
            console.log("移除效果", effectId);
        }
    }

    /**
     * 清理所有效果
     */
    clearAllEffects(): void {
        this.activeEffects.clear();
        console.log("清理所有动画效果");
    }

    /**
     * 获取活跃效果列表
     */
    getActiveEffects(): string[] {
        return Array.from(this.activeEffects.keys());
    }
}

// 为了兼容性，导出原名称
export { SimplePhysicsAnimationEffects as PhysicsAnimationEffects };
