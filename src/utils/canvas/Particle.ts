/**
 * 粒子类
 * 表示单个粒子的属性和行为
 */

import type { IParticle, IPoint } from "@/types";
import { ParticleType } from "@/types";

export class Particle implements IParticle {
    public x: number;
    public y: number;
    public vx: number;
    public vy: number;
    public size: number;
    public color: string;
    public life: number;
    public maxLife: number;
    public type: ParticleType;
    public alpha: number;
    public rotation: number;
    public rotationSpeed: number;

    // 物理属性
    public mass: number;
    public friction: number;
    public gravity: IPoint;

    // 渲染属性
    public trail: IPoint[];
    public maxTrailLength: number;

    constructor(
        config: Partial<IParticle> & {
            position?: IPoint;
            velocity?: IPoint;
            mass?: number;
            friction?: number;
            gravity?: IPoint;
            maxTrailLength?: number;
        } = {},
    ) {
        // 基础属性
        this.x = config.x ?? config.position?.x ?? 0;
        this.y = config.y ?? config.position?.y ?? 0;
        this.vx = config.vx ?? config.velocity?.x ?? 0;
        this.vy = config.vy ?? config.velocity?.y ?? 0;
        this.size = config.size ?? 5;
        this.color = config.color ?? "#ffffff";
        this.life = config.life ?? config.maxLife ?? 1;
        this.maxLife = config.maxLife ?? 1;
        this.type = config.type ?? ParticleType.CIRCLE;
        this.alpha = config.alpha ?? 1;
        this.rotation = config.rotation ?? 0;
        this.rotationSpeed = config.rotationSpeed ?? 0;

        // 物理属性
        this.mass = config.mass ?? 1;
        this.friction = config.friction ?? 0.99;
        this.gravity = config.gravity ?? { x: 0, y: 0 };

        // 轨迹属性
        this.trail = [];
        this.maxTrailLength = config.maxTrailLength ?? 10;
    }

    /**
     * 更新粒子状态
     */
    update(deltaTime: number): void {
        // 更新生命值
        this.life -= deltaTime / 1000;

        // 应用重力
        this.vx += (this.gravity.x * deltaTime) / 1000;
        this.vy += (this.gravity.y * deltaTime) / 1000;

        // 应用摩擦力
        this.vx *= this.friction;
        this.vy *= this.friction;

        // 更新位置
        this.x += (this.vx * deltaTime) / 1000;
        this.y += (this.vy * deltaTime) / 1000;

        // 更新旋转
        this.rotation += (this.rotationSpeed * deltaTime) / 1000;

        // 更新透明度（基于生命值）
        this.alpha = Math.max(0, this.life / this.maxLife);

        // 更新轨迹
        this.updateTrail();
    }

    /**
     * 更新粒子轨迹
     */
    private updateTrail(): void {
        // 添加当前位置到轨迹
        this.trail.push({ x: this.x, y: this.y });

        // 限制轨迹长度
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    /**
     * 检查粒子是否存活
     */
    isAlive(): boolean {
        return this.life > 0;
    }

    /**
     * 检查粒子是否在指定区域内
     */
    isInBounds(width: number, height: number, margin = 0): boolean {
        return (
            this.x >= -margin &&
            this.x <= width + margin &&
            this.y >= -margin &&
            this.y <= height + margin
        );
    }

    /**
     * 应用力到粒子
     */
    applyForce(force: IPoint): void {
        this.vx += force.x / this.mass;
        this.vy += force.y / this.mass;
    }

    /**
     * 设置位置
     */
    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /**
     * 设置速度
     */
    setVelocity(vx: number, vy: number): void {
        this.vx = vx;
        this.vy = vy;
    }

    /**
     * 重置粒子到初始状态
     */
    reset(config?: Partial<IParticle>): void {
        if (config) {
            Object.assign(this, config);
        }
        this.life = this.maxLife;
        this.alpha = 1;
        this.rotation = 0;
        this.trail = [];
    }

    /**
     * 克隆粒子
     */
    clone(): Particle {
        return new Particle({
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            size: this.size,
            color: this.color,
            life: this.life,
            maxLife: this.maxLife,
            type: this.type,
            alpha: this.alpha,
            rotation: this.rotation,
            rotationSpeed: this.rotationSpeed,
            mass: this.mass,
            friction: this.friction,
            gravity: { ...this.gravity },
            maxTrailLength: this.maxTrailLength,
        });
    }

    /**
     * 获取粒子的边界框
     */
    getBounds(): { x: number; y: number; width: number; height: number } {
        const halfSize = this.size / 2;
        return {
            x: this.x - halfSize,
            y: this.y - halfSize,
            width: this.size,
            height: this.size,
        };
    }

    /**
     * 检查与另一个粒子的碰撞
     */
    collidesWith(other: Particle): boolean {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (this.size + other.size) / 2;

        return distance < minDistance;
    }

    /**
     * 处理与另一个粒子的碰撞
     */
    handleCollision(other: Particle): void {
        // 计算碰撞向量
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        // 标准化碰撞向量
        const nx = dx / distance;
        const ny = dy / distance;

        // 计算相对速度
        const dvx = other.vx - this.vx;
        const dvy = other.vy - this.vy;

        // 计算相对速度在碰撞法线方向的分量
        const dvn = dvx * nx + dvy * ny;

        // 如果粒子正在分离，不处理碰撞
        if (dvn > 0) return;

        // 计算碰撞冲量
        const totalMass = this.mass + other.mass;
        const impulse = (2 * dvn) / totalMass;

        // 应用冲量
        this.vx += impulse * other.mass * nx;
        this.vy += impulse * other.mass * ny;
        other.vx -= impulse * this.mass * nx;
        other.vy -= impulse * this.mass * ny;

        // 分离粒子以避免重叠
        const overlap = (this.size + other.size) / 2 - distance;
        if (overlap > 0) {
            const separationX = nx * overlap * 0.5;
            const separationY = ny * overlap * 0.5;

            this.x -= separationX;
            this.y -= separationY;
            other.x += separationX;
            other.y += separationY;
        }
    }

    /**
     * 处理边界碰撞
     */
    handleBoundaryCollision(
        width: number,
        height: number,
        restitution = 0.8,
    ): void {
        const halfSize = this.size / 2;

        // 左右边界
        if (this.x - halfSize < 0) {
            this.x = halfSize;
            this.vx = -this.vx * restitution;
        } else if (this.x + halfSize > width) {
            this.x = width - halfSize;
            this.vx = -this.vx * restitution;
        }

        // 上下边界
        if (this.y - halfSize < 0) {
            this.y = halfSize;
            this.vy = -this.vy * restitution;
        } else if (this.y + halfSize > height) {
            this.y = height - halfSize;
            this.vy = -this.vy * restitution;
        }
    }

    /**
     * 转换为 IParticle 接口
     */
    toInterface(): IParticle {
        return {
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy,
            size: this.size,
            color: this.color,
            life: this.life,
            maxLife: this.maxLife,
            type: this.type,
            alpha: this.alpha,
            rotation: this.rotation,
            rotationSpeed: this.rotationSpeed,
        };
    }
}
