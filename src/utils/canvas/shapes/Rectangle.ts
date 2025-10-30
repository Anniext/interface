/**
 * 矩形类
 */

import type { IRectangle, IPoint, ISize } from "@/types";
import { Shape } from "./Shape";

export class Rectangle extends Shape implements IRectangle {
    public size: ISize;

    // 圆角属性
    public borderRadius: number = 0;

    constructor(
        config: Partial<IRectangle> & {
            scale?: IPoint;
            origin?: IPoint;
            velocity?: IPoint;
            angularVelocity?: number;
            strokeColor?: string;
            strokeWidth?: number;
            borderRadius?: number;
            shadow?: {
                color: string;
                blur: number;
                offsetX: number;
                offsetY: number;
            };
        } = {},
    ) {
        super(config);
        this.size = config.size ?? { width: 20, height: 20 };
        if (config.borderRadius !== undefined) {
            this.borderRadius = config.borderRadius;
        }
    }

    /**
     * 绘制矩形
     */
    draw(ctx: CanvasRenderingContext2D): void {
        const { width, height } = this.size;
        const x = -width * this.origin.x;
        const y = -height * this.origin.y;

        if (this.borderRadius > 0) {
            this.drawRoundedRect(ctx, x, y, width, height, this.borderRadius);
        } else {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
        }

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
     * 绘制圆角矩形
     */
    private drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
    ): void {
        const r = Math.min(radius, width / 2, height / 2);

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    /**
     * 检查点是否在矩形内
     */
    isPointInside(x: number, y: number): boolean {
        // 将点转换到矩形的本地坐标系
        const localPoint = this.worldToLocal({ x, y });

        const { width, height } = this.size;
        const rectX = -width * this.origin.x;
        const rectY = -height * this.origin.y;

        return (
            localPoint.x >= rectX &&
            localPoint.x <= rectX + width &&
            localPoint.y >= rectY &&
            localPoint.y <= rectY + height
        );
    }

    /**
     * 世界坐标转本地坐标
     */
    private worldToLocal(worldPoint: IPoint): IPoint {
        // 平移
        let x = worldPoint.x - this.position.x;
        let y = worldPoint.y - this.position.y;

        // 旋转（逆变换）
        if (this.rotation !== 0) {
            const cos = Math.cos(-this.rotation);
            const sin = Math.sin(-this.rotation);
            const newX = x * cos - y * sin;
            const newY = x * sin + y * cos;
            x = newX;
            y = newY;
        }

        // 缩放（逆变换）
        x /= this.scale.x;
        y /= this.scale.y;

        return { x, y };
    }

    /**
     * 获取边界框
     */
    getBounds(): { x: number; y: number; width: number; height: number } {
        const { width, height } = this.size;
        const scaledWidth = width * this.scale.x;
        const scaledHeight = height * this.scale.y;

        if (this.rotation === 0) {
            // 无旋转时的简单计算
            return {
                x: this.position.x - scaledWidth * this.origin.x,
                y: this.position.y - scaledHeight * this.origin.y,
                width: scaledWidth,
                height: scaledHeight,
            };
        }

        // 有旋转时需要计算所有顶点
        const corners = this.getCorners();
        const xs = corners.map((corner) => corner.x);
        const ys = corners.map((corner) => corner.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }

    /**
     * 获取矩形的四个顶点（世界坐标）
     */
    getCorners(): IPoint[] {
        const { width, height } = this.size;
        const x = -width * this.origin.x;
        const y = -height * this.origin.y;

        const corners = [
            { x, y }, // 左上
            { x: x + width, y }, // 右上
            { x: x + width, y: y + height }, // 右下
            { x, y: y + height }, // 左下
        ];

        // 应用变换
        return corners.map((corner) => this.localToWorld(corner));
    }

    /**
     * 本地坐标转世界坐标
     */
    private localToWorld(localPoint: IPoint): IPoint {
        let x = localPoint.x;
        let y = localPoint.y;

        // 缩放
        x *= this.scale.x;
        y *= this.scale.y;

        // 旋转
        if (this.rotation !== 0) {
            const cos = Math.cos(this.rotation);
            const sin = Math.sin(this.rotation);
            const newX = x * cos - y * sin;
            const newY = x * sin + y * cos;
            x = newX;
            y = newY;
        }

        // 平移
        x += this.position.x;
        y += this.position.y;

        return { x, y };
    }

    /**
     * 设置尺寸
     */
    setSize(width: number, height: number): void {
        this.size.width = width;
        this.size.height = height;
    }

    /**
     * 设置宽度
     */
    setWidth(width: number): void {
        this.size.width = width;
    }

    /**
     * 设置高度
     */
    setHeight(height: number): void {
        this.size.height = height;
    }

    /**
     * 设置圆角半径
     */
    setBorderRadius(radius: number): void {
        this.borderRadius = radius;
    }

    /**
     * 获取周长
     */
    getPerimeter(): number {
        return 2 * (this.size.width + this.size.height);
    }

    /**
     * 获取面积
     */
    getArea(): number {
        return this.size.width * this.size.height;
    }

    /**
     * 检查与另一个矩形的碰撞（OBB碰撞检测）
     */
    collidesWithRectangle(other: Rectangle): boolean {
        // 简化版本：使用边界框检测
        return this.collidesWith(other);
    }

    /**
     * 获取矩形上的随机点
     */
    getRandomPointOnRectangle(): IPoint {
        const { width, height } = this.size;
        const perimeter = this.getPerimeter();
        const t = Math.random() * perimeter;

        let x: number, y: number;

        if (t < width) {
            // 上边
            x = -width * this.origin.x + t;
            y = -height * this.origin.y;
        } else if (t < width + height) {
            // 右边
            x = -width * this.origin.x + width;
            y = -height * this.origin.y + (t - width);
        } else if (t < 2 * width + height) {
            // 下边
            x = -width * this.origin.x + width - (t - width - height);
            y = -height * this.origin.y + height;
        } else {
            // 左边
            x = -width * this.origin.x;
            y = -height * this.origin.y + height - (t - 2 * width - height);
        }

        return this.localToWorld({ x, y });
    }

    /**
     * 获取矩形内的随机点
     */
    getRandomPointInRectangle(): IPoint {
        const { width, height } = this.size;
        const x = -width * this.origin.x + Math.random() * width;
        const y = -height * this.origin.y + Math.random() * height;

        return this.localToWorld({ x, y });
    }

    /**
     * 创建线性渐变（适合矩形）
     */
    createLinearGradientForRectangle(
        ctx: CanvasRenderingContext2D,
        direction: "horizontal" | "vertical" | "diagonal",
        colorStops: Array<{ offset: number; color: string }>,
    ): CanvasGradient {
        const { width, height } = this.size;
        const x = -width * this.origin.x;
        const y = -height * this.origin.y;

        let x0: number, y0: number, x1: number, y1: number;

        switch (direction) {
            case "horizontal":
                x0 = x;
                y0 = y + height / 2;
                x1 = x + width;
                y1 = y + height / 2;
                break;
            case "vertical":
                x0 = x + width / 2;
                y0 = y;
                x1 = x + width / 2;
                y1 = y + height;
                break;
            case "diagonal":
                x0 = x;
                y0 = y;
                x1 = x + width;
                y1 = y + height;
                break;
        }

        return this.createLinearGradient(ctx, x0, y0, x1, y1, colorStops);
    }

    /**
     * 克隆矩形
     */
    clone(): Rectangle {
        return new Rectangle({
            id: this.id + "_clone",
            position: { ...this.position },
            color: this.color,
            visible: this.visible,
            alpha: this.alpha,
            rotation: this.rotation,
            size: { ...this.size },
            scale: { ...this.scale },
            origin: { ...this.origin },
            velocity: { ...this.velocity },
            angularVelocity: this.angularVelocity,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            borderRadius: this.borderRadius,
            shadow: this.shadow ? { ...this.shadow } : undefined,
        });
    }

    /**
     * 转换为接口对象
     */
    toInterface(): IRectangle {
        return {
            ...super.toInterface(),
            size: { ...this.size },
        };
    }
}
