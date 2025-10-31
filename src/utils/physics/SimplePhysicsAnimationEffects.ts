// 简化的物理动画效果系统
import { gsap } from "gsap";

/** 技能掉落配置接口 */
export interface ISkillDropConfig {
    /** 技能数据 */
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
    /** 物理参数 */
    physics: {
        gravity: number;
        bounce: number;
        friction: number;
        mass: number;
    };
    /** 动画参数 */
    animation: {
        staggerDelay: number;
        fallDuration: number;
        bounceCount: number;
    };
}

/** 动画效果接口 */
export interface IAnimationEffect {
    id: string;
    type: string;
    isActive: boolean;
    timeline?: gsap.core.Timeline;
}

/**
 * 简化的物理动画效果系统
 * 使用 GSAP 模拟物理效果，而不是真正的物理引擎
 */
export class PhysicsAnimationEffects {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private effects: Map<string, IAnimationEffect> = new Map();
    private animationId: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.initCanvas();
    }

    /**
     * 初始化画布
     */
    private initCanvas() {
        if (!this.ctx) return;

        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    /**
     * 创建技能掉落效果
     */
    createSkillDropEffect(config: ISkillDropConfig): string {
        const effectId = `skill-drop-${Date.now()}`;

        // 创建时间轴
        const timeline = gsap.timeline();

        // 为每个技能创建掉落动画
        config.skills.forEach((skill, index) => {
            const delay = index * (config.animation.staggerDelay / 1000);

            // 模拟物理掉落效果
            timeline.to(
                {},
                {
                    duration: config.animation.fallDuration / 1000,
                    delay,
                    ease: "bounce.out",
                    onStart: () => {
                        console.log(`技能 ${skill.name} 开始掉落`);
                    },
                    onComplete: () => {
                        console.log(`技能 ${skill.name} 掉落完成`);
                    },
                },
                0,
            );
        });

        // 存储效果
        const effect: IAnimationEffect = {
            id: effectId,
            type: "skill-drop",
            isActive: true,
            timeline,
        };

        this.effects.set(effectId, effect);

        return effectId;
    }

    /**
     * 移除效果
     */
    removeEffect(effectId: string): boolean {
        const effect = this.effects.get(effectId);
        if (!effect) return false;

        // 停止时间轴
        if (effect.timeline) {
            effect.timeline.kill();
        }

        // 从映射中移除
        this.effects.delete(effectId);

        return true;
    }

    /**
     * 清理所有效果
     */
    clearAllEffects(): void {
        this.effects.forEach((effect) => {
            if (effect.timeline) {
                effect.timeline.kill();
            }
        });
        this.effects.clear();
    }

    /**
     * 获取活跃效果数量
     */
    getActiveEffectsCount(): number {
        return Array.from(this.effects.values()).filter(
            (effect) => effect.isActive,
        ).length;
    }

    /**
     * 销毁系统
     */
    destroy(): void {
        this.clearAllEffects();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
