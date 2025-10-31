// 物理动画效果管理器
import { gsap } from "gsap";
import type {
    IPhysicsEngine,
    IPhysicsBody,
    ICollisionEvent,
    PhysicsBodyType,
} from "@/types/physics";
import type { IPoint } from "@/types/common";
import type { IAnimationConfig } from "@/types/animation";
import { createPhysicsBody } from "@/utils/physics";

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
 * 物理动画效果管理器
 */
export class PhysicsAnimationEffects {
    private physicsEngine: IPhysicsEngine;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private activeEffects = new Map<string, any>();
    private animationId: number = 0;

    constructor(physicsEngine: IPhysicsEngine, canvas: HTMLCanvasElement) {
        this.physicsEngine = physicsEngine;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
    }

    /**
     * 创建技能标签物理掉落效果
     */
    createSkillDropEffect(config: ISkillDropConfig): string {
        const effectId = `skill-drop-${Date.now()}`;
        const skillBodies: IPhysicsBody[] = [];

        // 创建技能标签物理体
        config.skills.forEach((skill, index) => {
            const startX =
                config.dropArea.x + Math.random() * config.dropArea.width;
            const startY = config.dropArea.y - 50 - index * 20; // 错开高度

            // 创建圆形物理体代表技能标签
            const skillBody = createPhysicsBody.circle(
                startX,
                startY,
                15 + skill.level * 2, // 根据技能等级调整大小
                {
                    mass: config.physics.mass,
                    restitution: config.physics.bounce,
                    friction: config.physics.friction,
                    isStatic: false,
                    // 添加自定义属性
                    userData: {
                        type: "skill",
                        skill: skill,
                        color: skill.color,
                        glowIntensity: 0,
                    },
                },
            );

            skillBodies.push(skillBody);
            this.physicsEngine.addBody(skillBody);

            // 添加延迟掉落动画
            setTimeout(() => {
                // 给物理体一个初始的随机速度
                skillBody.velocity = {
                    x: (Math.random() - 0.5) * 100,
                    y: Math.random() * 50,
                };
            }, index * config.animation.staggerDelay);
        });

        // 注册碰撞响应
        this.registerSkillCollisionEffects(skillBodies, config);

        // 存储效果
        this.activeEffects.set(effectId, {
            type: "skill-drop",
            bodies: skillBodies,
            config,
            startTime: performance.now(),
        });

        return effectId;
    }

    /**
     * 注册技能标签碰撞效果
     */
    private registerSkillCollisionEffects(
        skillBodies: IPhysicsBody[],
        config: ISkillDropConfig,
    ): void {
        // 监听碰撞事件
        const handleCollision = (event: ICollisionEvent) => {
            const isSkillCollision = skillBodies.some(
                (body) =>
                    body.id === event.bodyA.id || body.id === event.bodyB.id,
            );

            if (isSkillCollision) {
                // 创建碰撞粒子效果
                this.createCollisionParticles(event.contactPoint, {
                    count: 8,
                    color: "#3b82f6",
                    velocity: 100,
                    life: 1000,
                });

                // 添加发光效果
                this.addGlowEffect(event.bodyA, 500);
                this.addGlowEffect(event.bodyB, 500);

                // 播放碰撞音效（如果启用）
                this.playCollisionSound("skill", event.impulse);
            }
        };

        // 这里需要与物理引擎的碰撞系统集成
        // 具体实现取决于物理引擎的事件系统
    }

    /**
     * 创建奖项物理碰撞动画
     */
    createAwardCollisionEffect(config: IAwardCollisionConfig): string {
        const effectId = `award-collision-${Date.now()}`;
        const awardBodies: IPhysicsBody[] = [];

        // 创建奖项物理体
        config.awards.forEach((award, index) => {
            const angle = (index / config.awards.length) * Math.PI * 2;
            const radius = 150;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // 根据奖项等级选择形状
            let awardBody: IPhysicsBody;
            switch (award.level) {
                case "gold":
                    awardBody = createPhysicsBody.circle(x, y, 25, {
                        mass: 2,
                        restitution: config.physics.restitution,
                        friction: config.physics.friction,
                        userData: {
                            type: "award",
                            award: award,
                            level: "gold",
                            color: "#ffd700",
                        },
                    });
                    break;
                case "silver":
                    awardBody = createPhysicsBody.circle(x, y, 20, {
                        mass: 1.5,
                        restitution: config.physics.restitution,
                        friction: config.physics.friction,
                        userData: {
                            type: "award",
                            award: award,
                            level: "silver",
                            color: "#c0c0c0",
                        },
                    });
                    break;
                case "bronze":
                    awardBody = createPhysicsBody.circle(x, y, 18, {
                        mass: 1.2,
                        restitution: config.physics.restitution,
                        friction: config.physics.friction,
                        userData: {
                            type: "award",
                            award: award,
                            level: "bronze",
                            color: "#cd7f32",
                        },
                    });
                    break;
                default:
                    awardBody = createPhysicsBody.polygon(
                        x,
                        y,
                        [
                            { x: 0, y: -15 },
                            { x: 12, y: -5 },
                            { x: 12, y: 5 },
                            { x: 0, y: 15 },
                            { x: -12, y: 5 },
                            { x: -12, y: -5 },
                        ],
                        {
                            mass: 1,
                            restitution: config.physics.restitution,
                            friction: config.physics.friction,
                            userData: {
                                type: "award",
                                award: award,
                                level: "special",
                                color: "#9333ea",
                            },
                        },
                    );
            }

            awardBodies.push(awardBody);
            this.physicsEngine.addBody(awardBody);

            // 给奖项一个初始的旋转速度
            awardBody.angularVelocity = (Math.random() - 0.5) * 0.2;
        });

        // 注册奖项碰撞效果
        this.registerAwardCollisionEffects(awardBodies, config);

        // 存储效果
        this.activeEffects.set(effectId, {
            type: "award-collision",
            bodies: awardBodies,
            config,
            startTime: performance.now(),
        });

        return effectId;
    }

    /**
     * 注册奖项碰撞效果
     */
    private registerAwardCollisionEffects(
        awardBodies: IPhysicsBody[],
        config: IAwardCollisionConfig,
    ): void {
        const handleCollision = (event: ICollisionEvent) => {
            const isAwardCollision = awardBodies.some(
                (body) =>
                    body.id === event.bodyA.id || body.id === event.bodyB.id,
            );

            if (isAwardCollision) {
                // 创建火花效果
                this.createSparkleEffect(event.contactPoint, {
                    count: config.collision.sparkleCount,
                    colors: ["#ffd700", "#ffed4e", "#fbbf24"],
                    duration: config.collision.glowDuration,
                });

                // 添加震动效果
                this.addShakeEffect(
                    event.bodyA,
                    config.collision.shakeIntensity,
                );
                this.addShakeEffect(
                    event.bodyB,
                    config.collision.shakeIntensity,
                );

                // 播放奖项碰撞音效
                if (config.collision.soundEnabled) {
                    this.playCollisionSound("award", event.impulse);
                }
            }
        };
    }

    /**
     * 创建导航元素物理交互
     */
    createNavigationPhysicsEffect(config: INavigationPhysicsConfig): string {
        const effectId = `navigation-physics-${Date.now()}`;
        const navBodies: IPhysicsBody[] = [];
        const constraints: string[] = [];

        // 创建导航项物理体
        config.items.forEach((item, index) => {
            const x = 100 + index * 120;
            const y = 100;

            const navBody = createPhysicsBody.rectangle(x, y, 80, 40, {
                mass: 0.5,
                restitution: 0.3,
                friction: 0.8,
                isStatic: false,
                userData: {
                    type: "navigation",
                    item: item,
                    originalPosition: { x, y },
                    isHovered: false,
                },
            });

            navBodies.push(navBody);
            this.physicsEngine.addBody(navBody);

            // 创建固定约束（类似弹簧）
            const pinConstraint = this.createPinConstraint(navBody, { x, y });
            constraints.push(pinConstraint);
        });

        // 如果启用连接效果，创建导航项之间的弹簧连接
        if (config.connections.enabled) {
            for (let i = 0; i < navBodies.length - 1; i++) {
                const bodyA = navBodies[i];
                const bodyB = navBodies[i + 1];
                const distance = Math.sqrt(
                    Math.pow(bodyB.position.x - bodyA.position.x, 2) +
                        Math.pow(bodyB.position.y - bodyA.position.y, 2),
                );

                if (distance <= config.connections.maxDistance) {
                    const springConstraint = this.createSpringConstraint(
                        bodyA,
                        bodyB,
                        distance,
                        config.connections.springStiffness,
                    );
                    constraints.push(springConstraint);
                }
            }
        }

        // 注册鼠标交互
        this.registerNavigationInteraction(navBodies, config);

        // 存储效果
        this.activeEffects.set(effectId, {
            type: "navigation-physics",
            bodies: navBodies,
            constraints,
            config,
            startTime: performance.now(),
        });

        return effectId;
    }

    /**
     * 注册导航交互事件
     */
    private registerNavigationInteraction(
        navBodies: IPhysicsBody[],
        config: INavigationPhysicsConfig,
    ): void {
        // 鼠标移动事件
        const handleMouseMove = (event: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const mousePos = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            navBodies.forEach((body) => {
                const distance = Math.sqrt(
                    Math.pow(mousePos.x - body.position.x, 2) +
                        Math.pow(mousePos.y - body.position.y, 2),
                );

                if (distance <= config.interaction.magneticRange) {
                    // 计算磁性吸引力
                    const force =
                        config.interaction.hoverForce / (distance + 1);
                    const direction = {
                        x: (mousePos.x - body.position.x) / distance,
                        y: (mousePos.y - body.position.y) / distance,
                    };

                    // 应用力到物理体
                    body.velocity.x += direction.x * force;
                    body.velocity.y += direction.y * force;

                    // 标记为悬停状态
                    if (body.userData) {
                        body.userData.isHovered = true;
                    }
                } else {
                    if (body.userData) {
                        body.userData.isHovered = false;
                    }
                }
            });
        };

        // 鼠标点击事件
        const handleMouseClick = (event: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickPos = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            navBodies.forEach((body) => {
                const distance = Math.sqrt(
                    Math.pow(clickPos.x - body.position.x, 2) +
                        Math.pow(clickPos.y - body.position.y, 2),
                );

                if (distance <= 50) {
                    // 应用点击冲量
                    const impulse = config.interaction.clickImpulse;
                    const direction = {
                        x: (Math.random() - 0.5) * 2,
                        y: (Math.random() - 0.5) * 2,
                    };

                    body.velocity.x += direction.x * impulse;
                    body.velocity.y += direction.y * impulse;

                    // 创建点击效果
                    this.createClickEffect(clickPos);
                }
            });
        };

        // 添加事件监听器
        this.canvas.addEventListener("mousemove", handleMouseMove);
        this.canvas.addEventListener("click", handleMouseClick);
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

            switch (config.type) {
                case "slide":
                    this.createSlideTransition(
                        fromElement,
                        toElement,
                        config,
                    ).then(resolve);
                    break;
                case "fade":
                    this.createFadeTransition(
                        fromElement,
                        toElement,
                        config,
                    ).then(resolve);
                    break;
                case "morph":
                    this.createMorphTransition(
                        fromElement,
                        toElement,
                        config,
                    ).then(resolve);
                    break;
                case "particle":
                    this.createParticleTransition(
                        fromElement,
                        toElement,
                        config,
                    ).then(resolve);
                    break;
                case "liquid":
                    this.createLiquidTransition(
                        fromElement,
                        toElement,
                        config,
                    ).then(resolve);
                    break;
                default:
                    resolve();
            }
        });
    }

    /**
     * 创建滑动过渡效果
     */
    private async createSlideTransition(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): Promise<void> {
        const timeline = gsap.timeline();

        // 创建物理驱动的滑动效果
        timeline
            .set(toElement, { x: "100%", opacity: 0 })
            .to(fromElement, {
                x: "-100%",
                duration: 0.8,
                ease: "power2.inOut",
                physics2D: {
                    velocity: config.physics.velocity,
                    friction: config.physics.friction,
                },
            })
            .to(
                toElement,
                {
                    x: "0%",
                    opacity: 1,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)",
                },
                "-=0.4",
            );

        return timeline.then();
    }

    /**
     * 创建淡入淡出过渡效果
     */
    private async createFadeTransition(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): Promise<void> {
        const timeline = gsap.timeline();

        timeline
            .to(fromElement, {
                opacity: 0,
                scale: 0.95,
                duration: 0.4,
                ease: "power2.out",
            })
            .set(toElement, { opacity: 0, scale: 1.05 })
            .to(toElement, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
            });

        return timeline.then();
    }

    /**
     * 创建变形过渡效果
     */
    private async createMorphTransition(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): Promise<void> {
        // 实现复杂的变形过渡效果
        // 这里可以使用 SVG morphing 或 Canvas 变形
        const timeline = gsap.timeline();

        timeline.to(fromElement, {
            morphSVG: toElement,
            duration: 1.2,
            ease: "elastic.inOut(1, 0.3)",
        });

        return timeline.then();
    }

    /**
     * 创建粒子过渡效果
     */
    private async createParticleTransition(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): Promise<void> {
        // 创建粒子分解和重组效果
        const particles = this.createTransitionParticles(
            fromElement,
            config.visual.particleCount,
        );

        const timeline = gsap.timeline();

        // 分解阶段
        timeline.to(particles, {
            x: "random(-200, 200)",
            y: "random(-200, 200)",
            rotation: "random(0, 360)",
            scale: "random(0.1, 0.3)",
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.01,
        });

        // 重组阶段
        timeline.to(particles, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1.0,
            ease: "elastic.out(1, 0.3)",
            stagger: 0.01,
            onComplete: () => {
                // 显示目标元素
                gsap.set(toElement, { opacity: 1 });
                // 清理粒子
                particles.forEach((particle) => particle.remove());
            },
        });

        return timeline.then();
    }

    /**
     * 创建液体过渡效果
     */
    private async createLiquidTransition(
        fromElement: HTMLElement,
        toElement: HTMLElement,
        config: IPageTransitionConfig,
    ): Promise<void> {
        // 实现液体流动效果
        // 使用 Canvas 和物理引擎创建流体模拟
        const liquidBodies = this.createLiquidBodies(config);

        const timeline = gsap.timeline();

        timeline
            .to(fromElement, {
                opacity: 0,
                duration: 0.3,
            })
            .call(() => {
                // 启动液体动画
                this.animateLiquidBodies(liquidBodies, config);
            })
            .to(toElement, {
                opacity: 1,
                duration: 0.5,
                delay: 1.0,
            });

        return timeline.then();
    }

    // 辅助方法

    /**
     * 创建碰撞粒子效果
     */
    private createCollisionParticles(
        position: IPoint,
        config: {
            count: number;
            color: string;
            velocity: number;
            life: number;
        },
    ): void {
        // 实现粒子效果
        for (let i = 0; i < config.count; i++) {
            const angle = (i / config.count) * Math.PI * 2;
            const velocity = config.velocity * (0.5 + Math.random() * 0.5);

            const particle = {
                x: position.x,
                y: position.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: config.life,
                maxLife: config.life,
                color: config.color,
                size: 2 + Math.random() * 3,
            };

            this.animateParticle(particle);
        }
    }

    /**
     * 动画粒子
     */
    private animateParticle(particle: any): void {
        const animate = () => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.5; // 重力
            particle.vx *= 0.98; // 空气阻力
            particle.vy *= 0.98;
            particle.life -= 16; // 假设 60fps

            // 渲染粒子
            this.ctx.save();
            this.ctx.globalAlpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            if (particle.life > 0) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * 添加发光效果
     */
    private addGlowEffect(body: IPhysicsBody, duration: number): void {
        if (body.userData) {
            body.userData.glowIntensity = 1.0;

            gsap.to(body.userData, {
                glowIntensity: 0,
                duration: duration / 1000,
                ease: "power2.out",
            });
        }
    }

    /**
     * 创建火花效果
     */
    private createSparkleEffect(
        position: IPoint,
        config: {
            count: number;
            colors: string[];
            duration: number;
        },
    ): void {
        // 实现火花效果
        for (let i = 0; i < config.count; i++) {
            const sparkle = {
                x: position.x + (Math.random() - 0.5) * 20,
                y: position.y + (Math.random() - 0.5) * 20,
                color: config.colors[
                    Math.floor(Math.random() * config.colors.length)
                ],
                scale: 0,
                rotation: Math.random() * 360,
            };

            gsap.timeline()
                .to(sparkle, {
                    scale: 1,
                    duration: 0.1,
                    ease: "back.out(1.7)",
                })
                .to(sparkle, {
                    scale: 0,
                    rotation: sparkle.rotation + 180,
                    duration: config.duration / 1000,
                    ease: "power2.out",
                });

            this.renderSparkle(sparkle);
        }
    }

    /**
     * 渲染火花
     */
    private renderSparkle(sparkle: any): void {
        this.ctx.save();
        this.ctx.translate(sparkle.x, sparkle.y);
        this.ctx.rotate((sparkle.rotation * Math.PI) / 180);
        this.ctx.scale(sparkle.scale, sparkle.scale);
        this.ctx.fillStyle = sparkle.color;
        this.ctx.fillRect(-2, -2, 4, 4);
        this.ctx.restore();
    }

    /**
     * 添加震动效果
     */
    private addShakeEffect(body: IPhysicsBody, intensity: number): void {
        const originalPos = { ...body.position };

        gsap.to(body.position, {
            x: originalPos.x + (Math.random() - 0.5) * intensity,
            y: originalPos.y + (Math.random() - 0.5) * intensity,
            duration: 0.1,
            ease: "power2.out",
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                body.position.x = originalPos.x;
                body.position.y = originalPos.y;
            },
        });
    }

    /**
     * 播放碰撞音效
     */
    private playCollisionSound(type: string, intensity: number): void {
        // 这里可以集成 Web Audio API
        console.log(`播放${type}碰撞音效，强度: ${intensity}`);
    }

    /**
     * 创建固定约束
     */
    private createPinConstraint(body: IPhysicsBody, point: IPoint): string {
        // 这里需要与物理引擎的约束系统集成
        const constraintId = `pin-${body.id}-${Date.now()}`;
        // 实际实现会调用物理引擎的约束创建方法
        return constraintId;
    }

    /**
     * 创建弹簧约束
     */
    private createSpringConstraint(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        length: number,
        stiffness: number,
    ): string {
        // 这里需要与物理引擎的约束系统集成
        const constraintId = `spring-${bodyA.id}-${bodyB.id}-${Date.now()}`;
        // 实际实现会调用物理引擎的约束创建方法
        return constraintId;
    }

    /**
     * 创建点击效果
     */
    private createClickEffect(position: IPoint): void {
        const ripple = {
            x: position.x,
            y: position.y,
            radius: 0,
            opacity: 1,
        };

        gsap.to(ripple, {
            radius: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: () => {
                this.ctx.save();
                this.ctx.globalAlpha = ripple.opacity;
                this.ctx.strokeStyle = "#3b82f6";
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            },
        });
    }

    /**
     * 创建过渡粒子
     */
    private createTransitionParticles(
        element: HTMLElement,
        count: number,
    ): HTMLElement[] {
        const particles: HTMLElement[] = [];
        const rect = element.getBoundingClientRect();

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("div");
            particle.style.position = "absolute";
            particle.style.width = "4px";
            particle.style.height = "4px";
            particle.style.backgroundColor = "#3b82f6";
            particle.style.borderRadius = "50%";
            particle.style.left = `${rect.left + Math.random() * rect.width}px`;
            particle.style.top = `${rect.top + Math.random() * rect.height}px`;
            particle.style.pointerEvents = "none";
            particle.style.zIndex = "9999";

            document.body.appendChild(particle);
            particles.push(particle);
        }

        return particles;
    }

    /**
     * 创建液体物理体
     */
    private createLiquidBodies(config: IPageTransitionConfig): IPhysicsBody[] {
        const bodies: IPhysicsBody[] = [];

        // 创建多个小的液体粒子
        for (let i = 0; i < config.visual.particleCount; i++) {
            const body = createPhysicsBody.circle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                2 + Math.random() * 3,
                {
                    mass: 0.1,
                    restitution: 0.8,
                    friction: 0.1,
                    userData: {
                        type: "liquid",
                        color: config.visual.colorGradient[
                            Math.floor(
                                Math.random() *
                                    config.visual.colorGradient.length,
                            )
                        ],
                    },
                },
            );

            bodies.push(body);
            this.physicsEngine.addBody(body);
        }

        return bodies;
    }

    /**
     * 动画液体物理体
     */
    private animateLiquidBodies(
        bodies: IPhysicsBody[],
        config: IPageTransitionConfig,
    ): void {
        // 应用湍流效果
        bodies.forEach((body) => {
            const turbulence = config.physics.turbulence;
            body.velocity.x += (Math.random() - 0.5) * turbulence;
            body.velocity.y += (Math.random() - 0.5) * turbulence;
        });

        // 添加清理定时器
        setTimeout(() => {
            bodies.forEach((body) => {
                this.physicsEngine.removeBody(body.id);
            });
        }, 2000);
    }

    /**
     * 移除效果
     */
    removeEffect(effectId: string): void {
        const effect = this.activeEffects.get(effectId);
        if (effect) {
            // 清理物理体
            if (effect.bodies) {
                effect.bodies.forEach((body: IPhysicsBody) => {
                    this.physicsEngine.removeBody(body.id);
                });
            }

            // 清理约束
            if (effect.constraints) {
                effect.constraints.forEach((constraintId: string) => {
                    this.physicsEngine.removeConstraint(constraintId);
                });
            }

            this.activeEffects.delete(effectId);
        }
    }

    /**
     * 清理所有效果
     */
    clearAllEffects(): void {
        this.activeEffects.forEach((_, effectId) => {
            this.removeEffect(effectId);
        });
    }

    /**
     * 获取活跃效果列表
     */
    getActiveEffects(): string[] {
        return Array.from(this.activeEffects.keys());
    }
}
