/**
 * 粒子系统管理器
 * 管理大量粒子的创建、更新和渲染
 */

import type { IParticleSystemConfig, IPoint, ISize } from "@/types";
import { ParticleType } from "@/types";
import { Particle } from "./Particle";
// 内联工具函数以避免循环导入
const random = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

const randomInt = (min: number, max: number): number => {
    return Math.floor(random(min, max + 1));
};

export interface IEmitter {
    /** 发射器位置 */
    position: IPoint;
    /** 发射器大小 */
    size: ISize;
    /** 发射速率（每秒粒子数） */
    rate: number;
    /** 是否激活 */
    active: boolean;
    /** 发射角度范围（弧度） */
    angleRange: [number, number];
    /** 发射速度范围 */
    speedRange: [number, number];
    /** 粒子生命周期范围 */
    lifeRange: [number, number];
    /** 粒子大小范围 */
    sizeRange: [number, number];
    /** 粒子类型 */
    particleTypes: ParticleType[];
    /** 粒子颜色 */
    colors: string[];
}

export class ParticleSystem {
    private particles: Particle[] = [];
    private deadParticles: Particle[] = []; // 对象池
    private emitters: IEmitter[] = [];
    private config: IParticleSystemConfig;
    private lastEmitTime = 0;
    private bounds: ISize = { width: 800, height: 600 };

    // 性能统计
    private stats = {
        activeParticles: 0,
        pooledParticles: 0,
        emittedThisFrame: 0,
        recycledThisFrame: 0,
    };

    constructor(config: Partial<IParticleSystemConfig> = {}) {
        this.config = {
            maxParticles: 1000,
            emissionRate: 50,
            lifeRange: [1, 3],
            sizeRange: [2, 8],
            velocityRange: {
                x: [-50, 50],
                y: [-50, 50],
            },
            colors: ["#ffffff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"],
            gravity: { x: 0, y: 50 },
            enableCollision: false,
            ...config,
        };
    }

    /**
     * 设置粒子系统边界
     */
    setBounds(width: number, height: number): void {
        this.bounds = { width, height };
    }

    /**
     * 添加发射器
     */
    addEmitter(emitter: Partial<IEmitter>): void {
        const defaultEmitter: IEmitter = {
            position: { x: 0, y: 0 },
            size: { width: 10, height: 10 },
            rate: this.config.emissionRate,
            active: true,
            angleRange: [0, Math.PI * 2],
            speedRange: [20, 100],
            lifeRange: this.config.lifeRange,
            sizeRange: this.config.sizeRange,
            particleTypes: [ParticleType.CIRCLE],
            colors: this.config.colors,
        };

        this.emitters.push({ ...defaultEmitter, ...emitter });
    }

    /**
     * 移除发射器
     */
    removeEmitter(index: number): void {
        if (index >= 0 && index < this.emitters.length) {
            this.emitters.splice(index, 1);
        }
    }

    /**
     * 清空所有发射器
     */
    clearEmitters(): void {
        this.emitters = [];
    }

    /**
     * 从对象池获取粒子
     */
    private getParticleFromPool(): Particle {
        if (this.deadParticles.length > 0) {
            this.stats.recycledThisFrame++;
            return this.deadParticles.pop()!;
        }
        return new Particle();
    }

    /**
     * 将粒子返回对象池
     */
    private returnParticleToPool(particle: Particle): void {
        this.deadParticles.push(particle);
        this.stats.pooledParticles++;
    }

    /**
     * 发射粒子
     */
    private emitParticle(emitter: IEmitter): void {
        if (this.particles.length >= this.config.maxParticles) return;

        const particle = this.getParticleFromPool();

        // 设置发射位置
        const emitX =
            emitter.position.x +
            random(-emitter.size.width / 2, emitter.size.width / 2);
        const emitY =
            emitter.position.y +
            random(-emitter.size.height / 2, emitter.size.height / 2);

        // 设置发射角度和速度
        const angle = random(emitter.angleRange[0], emitter.angleRange[1]);
        const speed = random(emitter.speedRange[0], emitter.speedRange[1]);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        // 设置粒子属性
        const particleType =
            emitter.particleTypes[
                randomInt(0, emitter.particleTypes.length - 1)
            ];
        const color = emitter.colors[randomInt(0, emitter.colors.length - 1)];
        const size = random(emitter.sizeRange[0], emitter.sizeRange[1]);
        const life = random(emitter.lifeRange[0], emitter.lifeRange[1]);

        particle.reset({
            x: emitX,
            y: emitY,
            vx,
            vy,
            size,
            color,
            life,
            maxLife: life,
            type: particleType,
            alpha: 1,
            rotation: 0,
            rotationSpeed: random(-Math.PI, Math.PI),
        });

        // 设置物理属性
        particle.gravity = { ...this.config.gravity };
        particle.mass = size * 0.1;
        particle.friction = 0.99;

        this.particles.push(particle);
        this.stats.emittedThisFrame++;
    }

    /**
     * 更新粒子系统
     */
    update(deltaTime: number): void {
        const currentTime = Date.now();

        // 重置帧统计
        this.stats.emittedThisFrame = 0;
        this.stats.recycledThisFrame = 0;

        // 更新发射器
        this.updateEmitters(currentTime, deltaTime);

        // 更新粒子
        this.updateParticles(deltaTime);

        // 处理碰撞
        if (this.config.enableCollision) {
            this.handleCollisions();
        }

        // 清理死亡粒子
        this.cleanupDeadParticles();

        // 更新统计信息
        this.stats.activeParticles = this.particles.length;
        this.stats.pooledParticles = this.deadParticles.length;
    }

    /**
     * 更新发射器
     */
    private updateEmitters(currentTime: number, _deltaTime: number): void {
        for (const emitter of this.emitters) {
            if (!emitter.active) continue;

            // 计算应该发射的粒子数量
            const timeSinceLastEmit = currentTime - this.lastEmitTime;
            const particlesToEmit = Math.floor(
                (emitter.rate * timeSinceLastEmit) / 1000,
            );

            for (let i = 0; i < particlesToEmit; i++) {
                this.emitParticle(emitter);
            }
        }

        this.lastEmitTime = currentTime;
    }

    /**
     * 更新粒子
     */
    private updateParticles(deltaTime: number): void {
        for (const particle of this.particles) {
            particle.update(deltaTime);

            // 处理边界碰撞
            particle.handleBoundaryCollision(
                this.bounds.width,
                this.bounds.height,
                0.8,
            );
        }
    }

    /**
     * 处理粒子间碰撞
     */
    private handleCollisions(): void {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particleA = this.particles[i];
                const particleB = this.particles[j];

                if (
                    particleA &&
                    particleB &&
                    particleA.collidesWith(particleB)
                ) {
                    particleA.handleCollision(particleB);
                }
            }
        }
    }

    /**
     * 清理死亡粒子
     */
    private cleanupDeadParticles(): void {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            if (
                particle &&
                (!particle.isAlive() ||
                    !particle.isInBounds(
                        this.bounds.width,
                        this.bounds.height,
                        100,
                    ))
            ) {
                // 移除粒子并返回对象池
                this.particles.splice(i, 1);
                this.returnParticleToPool(particle);
            }
        }
    }

    /**
     * 渲染粒子系统
     */
    render(ctx: CanvasRenderingContext2D): void {
        for (const particle of this.particles) {
            this.renderParticle(ctx, particle);
        }
    }

    /**
     * 渲染单个粒子
     */
    private renderParticle(
        ctx: CanvasRenderingContext2D,
        particle: Particle,
    ): void {
        ctx.save();

        // 设置透明度
        ctx.globalAlpha = particle.alpha;

        // 移动到粒子位置
        ctx.translate(particle.x, particle.y);

        // 旋转
        if (particle.rotation !== 0) {
            ctx.rotate(particle.rotation);
        }

        // 设置颜色
        ctx.fillStyle = particle.color;
        ctx.strokeStyle = particle.color;

        // 根据类型绘制粒子
        this.drawParticleShape(ctx, particle);

        // 绘制轨迹
        if (particle.trail.length > 1) {
            this.drawParticleTrail(ctx, particle);
        }

        ctx.restore();
    }

    /**
     * 绘制粒子形状
     */
    private drawParticleShape(
        ctx: CanvasRenderingContext2D,
        particle: Particle,
    ): void {
        const halfSize = particle.size / 2;

        switch (particle.type) {
            case ParticleType.CIRCLE:
                ctx.beginPath();
                ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
                ctx.fill();
                break;

            case ParticleType.SQUARE:
                ctx.fillRect(
                    -halfSize,
                    -halfSize,
                    particle.size,
                    particle.size,
                );
                break;

            case ParticleType.TRIANGLE:
                const height = particle.size * 0.866; // √3/2
                ctx.beginPath();
                ctx.moveTo(0, -height / 2);
                ctx.lineTo(-halfSize, height / 2);
                ctx.lineTo(halfSize, height / 2);
                ctx.closePath();
                ctx.fill();
                break;

            case ParticleType.STAR:
                this.drawStar(ctx, halfSize);
                break;

            default:
                // 默认绘制圆形
                ctx.beginPath();
                ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    /**
     * 绘制星形
     */
    private drawStar(ctx: CanvasRenderingContext2D, radius: number): void {
        const outerRadius = radius;
        const innerRadius = radius * 0.4;
        const spikes = 5;

        ctx.beginPath();

        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fill();
    }

    /**
     * 绘制粒子轨迹
     */
    private drawParticleTrail(
        ctx: CanvasRenderingContext2D,
        particle: Particle,
    ): void {
        if (particle.trail.length < 2) return;

        ctx.save();
        ctx.globalAlpha = particle.alpha * 0.3;
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";

        ctx.beginPath();
        const firstPoint = particle.trail[0];
        if (firstPoint) {
            ctx.moveTo(firstPoint.x - particle.x, firstPoint.y - particle.y);
        }

        for (let i = 1; i < particle.trail.length; i++) {
            const point = particle.trail[i];
            if (point) {
                ctx.lineTo(point.x - particle.x, point.y - particle.y);
            }
        }

        ctx.stroke();
        ctx.restore();
    }

    /**
     * 添加粒子爆发效果
     */
    burst(position: IPoint, count = 20, config?: Partial<IEmitter>): void {
        const burstEmitter: IEmitter = {
            position,
            size: { width: 0, height: 0 },
            rate: count * 1000, // 高发射率以立即发射所有粒子
            active: true,
            angleRange: [0, Math.PI * 2],
            speedRange: [50, 150],
            lifeRange: [0.5, 2],
            sizeRange: [3, 8],
            particleTypes: [ParticleType.CIRCLE, ParticleType.STAR],
            colors: this.config.colors,
            ...config,
        };

        // 临时添加发射器
        this.addEmitter(burstEmitter);

        // 立即发射粒子
        for (let i = 0; i < count; i++) {
            this.emitParticle(burstEmitter);
        }

        // 移除临时发射器
        this.removeEmitter(this.emitters.length - 1);
    }

    /**
     * 创建粒子喷泉效果
     */
    createFountain(position: IPoint, config?: Partial<IEmitter>): number {
        const fountainEmitter: IEmitter = {
            position,
            size: { width: 20, height: 5 },
            rate: 100,
            active: true,
            angleRange: [-Math.PI / 3, (-Math.PI * 2) / 3], // 向上喷射
            speedRange: [100, 200],
            lifeRange: [2, 4],
            sizeRange: [2, 6],
            particleTypes: [ParticleType.CIRCLE],
            colors: ["#4ecdc4", "#45b7d1", "#96ceb4"],
            ...config,
        };

        this.addEmitter(fountainEmitter);
        return this.emitters.length - 1; // 返回发射器索引
    }

    /**
     * 创建粒子雨效果
     */
    createRain(config?: Partial<IEmitter>): number {
        const rainEmitter: IEmitter = {
            position: { x: this.bounds.width / 2, y: -10 },
            size: { width: this.bounds.width, height: 10 },
            rate: 200,
            active: true,
            angleRange: [Math.PI / 2 - 0.2, Math.PI / 2 + 0.2], // 向下
            speedRange: [100, 300],
            lifeRange: [3, 6],
            sizeRange: [1, 3],
            particleTypes: [ParticleType.CIRCLE],
            colors: ["#87ceeb", "#b0e0e6", "#add8e6"],
            ...config,
        };

        this.addEmitter(rainEmitter);
        return this.emitters.length - 1;
    }

    /**
     * 获取粒子数组（只读）
     */
    getParticles(): readonly Particle[] {
        return this.particles;
    }

    /**
     * 获取发射器数组
     */
    getEmitters(): IEmitter[] {
        return this.emitters;
    }

    /**
     * 获取性能统计
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * 清空所有粒子
     */
    clear(): void {
        // 将所有活跃粒子返回对象池
        for (const particle of this.particles) {
            this.returnParticleToPool(particle);
        }
        this.particles = [];
    }

    /**
     * 暂停/恢复所有发射器
     */
    setActive(active: boolean): void {
        for (const emitter of this.emitters) {
            emitter.active = active;
        }
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<IParticleSystemConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * 销毁粒子系统
     */
    destroy(): void {
        this.clear();
        this.clearEmitters();
        this.deadParticles = [];
    }
}
