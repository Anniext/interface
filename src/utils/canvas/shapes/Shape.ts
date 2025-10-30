/**
 * 基础图形类
 * 所有几何图形的基类
 */

import type { IShape, IPoint } from "@/types";

export abstract class Shape implements IShape {
    public id: string;
    public position: IPoint;
    public color: string;
    public visible: boolean;
    public alpha: number;
    public rotation: number;

    // 变换属性
    public scale: IPoint = { x: 1, y: 1 };
    public origin: IPoint = { x: 0.5, y: 0.5 }; // 变换原点 (0-1)

    // 动画属性
    public velocity: IPoint = { x: 0, y: 0 };
    public angularVelocity: number = 0;

    // 样式属性
    public strokeColor?: string;
    public strokeWidth: number = 0;
    public fillGradient?: CanvasGradient;
    public strokeGradient?: CanvasGradient;
    public shadow?: {
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };

    constructor(
        config: Partial<IShape> & {
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
        this.id = config.id ?? this.generateId();
        this.position = config.position ?? { x: 0, y: 0 };
        this.color = config.color ?? "#ffffff";
        this.visible = config.visible ?? true;
        this.alpha = config.alpha ?? 1;
        this.rotation = config.rotation ?? 0;

        // 扩展属性
        if (config.scale) this.scale = config.scale;
        if (config.origin) this.origin = config.origin;
        if (config.velocity) this.velocity = config.velocity;
        if (config.angularVelocity)
            this.angularVelocity = config.angularVelocity;
        if (config.strokeColor) this.strokeColor = config.strokeColor;
        if (config.strokeWidth) this.strokeWidth = config.strokeWidth;
        if (config.shadow) this.shadow = config.shadow;
    }

    /**
     * 生成唯一ID
     */
    private generateId(): string {
        return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 抽象方法：绘制图形
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;

    /**
     * 抽象方法：检查点是否在图形内
     */
    abstract isPointInside(x: number, y: number): boolean;

    /**
     * 抽象方法：获取边界框
     */
    abstract getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    /**
     * 更新图形状态
     */
    update(deltaTime: number): void {
        // 更新位置
        this.position.x += (this.velocity.x * deltaTime) / 1000;
        this.position.y += (this.velocity.y * deltaTime) / 1000;

        // 更新旋转
        this.rotation += (this.angularVelocity * deltaTime) / 1000;
    }

    /**
     * 渲染图形
     */
    render(ctx: CanvasRenderingContext2D): void {
        if (!this.visible || this.alpha <= 0) return;

        ctx.save();

        // 设置透明度
        ctx.globalAlpha = this.alpha;

        // 移动到图形位置
        ctx.translate(this.position.x, this.position.y);

        // 应用缩放
        if (this.scale.x !== 1 || this.scale.y !== 1) {
            ctx.scale(this.scale.x, this.scale.y);
        }

        // 应用旋转
        if (this.rotation !== 0) {
            ctx.rotate(this.rotation);
        }

        // 设置阴影
        if (this.shadow) {
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur;
            ctx.shadowOffsetX = this.shadow.offsetX;
            ctx.shadowOffsetY = this.shadow.offsetY;
        }

        // 绘制图形
        this.draw(ctx);

        ctx.restore();
    }

    /**
     * 设置填充样式
     */
    protected setFillStyle(ctx: CanvasRenderingContext2D): void {
        if (this.fillGradient) {
            ctx.fillStyle = this.fillGradient;
        } else {
            ctx.fillStyle = this.color;
        }
    }

    /**
     * 设置描边样式
     */
    protected setStrokeStyle(ctx: CanvasRenderingContext2D): void {
        if (this.strokeWidth > 0) {
            if (this.strokeGradient) {
                ctx.strokeStyle = this.strokeGradient;
            } else {
                ctx.strokeStyle = this.strokeColor || this.color;
            }
            ctx.lineWidth = this.strokeWidth;
        }
    }

    /**
     * 移动图形
     */
    moveTo(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    /**
     * 相对移动图形
     */
    moveBy(dx: number, dy: number): void {
        this.position.x += dx;
        this.position.y += dy;
    }

    /**
     * 设置旋转角度
     */
    rotateTo(angle: number): void {
        this.rotation = angle;
    }

    /**
     * 相对旋转
     */
    rotateBy(angle: number): void {
        this.rotation += angle;
    }

    /**
     * 设置缩放
     */
    scaleTo(scaleX: number, scaleY?: number): void {
        this.scale.x = scaleX;
        this.scale.y = scaleY ?? scaleX;
    }

    /**
     * 相对缩放
     */
    scaleBy(scaleX: number, scaleY?: number): void {
        this.scale.x *= scaleX;
        this.scale.y *= scaleY ?? scaleX;
    }

    /**
     * 设置速度
     */
    setVelocity(vx: number, vy: number): void {
        this.velocity.x = vx;
        this.velocity.y = vy;
    }

    /**
     * 设置角速度
     */
    setAngularVelocity(angularVelocity: number): void {
        this.angularVelocity = angularVelocity;
    }

    /**
     * 创建线性渐变
     */
    createLinearGradient(
        ctx: CanvasRenderingContext2D,
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        colorStops: Array<{ offset: number; color: string }>,
    ): CanvasGradient {
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        colorStops.forEach((stop) => {
            gradient.addColorStop(stop.offset, stop.color);
        });
        return gradient;
    }

    /**
     * 创建径向渐变
     */
    createRadialGradient(
        ctx: CanvasRenderingContext2D,
        x0: number,
        y0: number,
        r0: number,
        x1: number,
        y1: number,
        r1: number,
        colorStops: Array<{ offset: number; color: string }>,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        colorStops.forEach((stop) => {
            gradient.addColorStop(stop.offset, stop.color);
        });
        return gradient;
    }

    /**
     * 设置阴影
     */
    setShadow(
        color: string,
        blur: number,
        offsetX: number,
        offsetY: number,
    ): void {
        this.shadow = { color, blur, offsetX, offsetY };
    }

    /**
     * 清除阴影
     */
    clearShadow(): void {
        this.shadow = undefined;
    }

    /**
     * 检查与另一个图形的碰撞（边界框检测）
     */
    collidesWith(other: Shape): boolean {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();

        return !(
            bounds1.x + bounds1.width < bounds2.x ||
            bounds2.x + bounds2.width < bounds1.x ||
            bounds1.y + bounds1.height < bounds2.y ||
            bounds2.y + bounds2.height < bounds1.y
        );
    }

    /**
     * 获取到另一个图形的距离
     */
    distanceTo(other: Shape): number {
        const dx = this.position.x - other.position.x;
        const dy = this.position.y - other.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 获取到另一个图形的角度
     */
    angleTo(other: Shape): number {
        return Math.atan2(
            other.position.y - this.position.y,
            other.position.x - this.position.x,
        );
    }

    /**
     * 克隆图形
     */
    abstract clone(): Shape;

    /**
     * 转换为接口对象
     */
    toInterface(): IShape {
        return {
            id: this.id,
            position: { ...this.position },
            color: this.color,
            visible: this.visible,
            alpha: this.alpha,
            rotation: this.rotation,
        };
    }

    /**
     * 销毁图形
     */
    destroy(): void {
        // 清理资源
        this.fillGradient = undefined;
        this.strokeGradient = undefined;
        this.shadow = undefined;
    }
}
