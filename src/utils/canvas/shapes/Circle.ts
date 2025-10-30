/**
 * 圆形类
 */

import type { ICircle, IPoint } from "@/types";
import { Shape } from "./Shape";

export class Circle extends Shape implements ICircle {
    public radius: number;

    constructor(
        config: Partial<ICircle> & {
            scale?: IPoint;
            origin?: IPoint;
            velocity?: IPoint;
            angularVelocity?: number;
            strokeColor?: string;
            strokeWidth?: number;
            shadow?: {
                color: string;
                blur: number;
                offsetX: number;
                offsetY: number;
            };
        } = {},
    ) {
        super(config);
        this.radius = config.radius ?? 10;
    }

    /**
     * 绘制圆形
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);

        // 填充
        this.setFillStyle(ctx);
        ctx.fill();

        // 描边
        if (this.strokeWidth > 0) {
            this.setStrokeStyle(ctx);
            ctx.stroke();
        }
    }

    /**
     * 检查点是否在圆形内
     */
    isPointInside(x: number, y: number): boolean {
        const dx = x - this.position.x;
        const dy = y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.radius * Math.max(this.scale.x, this.scale.y);
    }

    /**
     * 获取边界框
     */
    getBounds(): { x: number; y: number; width: number; height: number } {
        const scaledRadius = this.radius * Math.max(this.scale.x, this.scale.y);
        return {
            x: this.position.x - scaledRadius,
            y: this.position.y - scaledRadius,
            width: scaledRadius * 2,
            height: scaledRadius * 2,
        };
    }

    /**
     * 设置半径
     */
    setRadius(radius: number): void {
        this.radius = radius;
    }

    /**
     * 获取周长
     */
    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }

    /**
     * 获取面积
     */
    getArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    /**
     * 检查与另一个圆形的碰撞（精确检测）
     */
    collidesWithCircle(other: Circle): boolean {
        const distance = this.distanceTo(other);
        const combinedRadius =
            this.radius * Math.max(this.scale.x, this.scale.y) +
            other.radius * Math.max(other.scale.x, other.scale.y);
        return distance < combinedRadius;
    }

    /**
     * 检查与点的碰撞
     */
    containsPoint(point: IPoint): boolean {
        return this.isPointInside(point.x, point.y);
    }

    /**
     * 获取圆上的点
     */
    getPointOnCircle(angle: number): IPoint {
        return {
            x: this.position.x + Math.cos(angle) * this.radius * this.scale.x,
            y: this.position.y + Math.sin(angle) * this.radius * this.scale.y,
        };
    }

    /**
     * 获取圆上的随机点
     */
    getRandomPointOnCircle(): IPoint {
        const angle = Math.random() * Math.PI * 2;
        return this.getPointOnCircle(angle);
    }

    /**
     * 获取圆内的随机点
     */
    getRandomPointInCircle(): IPoint {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.radius;
        return {
            x: this.position.x + Math.cos(angle) * distance * this.scale.x,
            y: this.position.y + Math.sin(angle) * distance * this.scale.y,
        };
    }

    /**
     * 创建径向渐变（适合圆形）
     */
    createRadialGradientForCircle(
        ctx: CanvasRenderingContext2D,
        colorStops: Array<{ offset: number; color: string }>,
    ): CanvasGradient {
        return this.createRadialGradient(
            ctx,
            0,
            0,
            0,
            0,
            0,
            this.radius,
            colorStops,
        );
    }

    /**
     * 克隆圆形
     */
    clone(): Circle {
        return new Circle({
            id: this.id + "_clone",
            position: { ...this.position },
            color: this.color,
            visible: this.visible,
            alpha: this.alpha,
            rotation: this.rotation,
            radius: this.radius,
            scale: { ...this.scale },
            origin: { ...this.origin },
            velocity: { ...this.velocity },
            angularVelocity: this.angularVelocity,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            shadow: this.shadow ? { ...this.shadow } : undefined,
        });
    }

    /**
     * 转换为接口对象
     */
    toInterface(): ICircle {
        return {
            ...super.toInterface(),
            radius: this.radius,
        };
    }
}
