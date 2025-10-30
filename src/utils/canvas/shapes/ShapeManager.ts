/**
 * 图形管理器
 * 管理多个图形的创建、更新、渲染和交互
 */

import type { IPoint, ISize } from "@/types";
import { Shape } from "./Shape";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Polygon } from "./Polygon";

export interface IShapeManagerConfig {
    /** 最大图形数量 */
    maxShapes: number;
    /** 是否启用碰撞检测 */
    enableCollision: boolean;
    /** 是否启用边界约束 */
    enableBounds: boolean;
    /** 边界尺寸 */
    bounds: ISize;
}

export class ShapeManager {
    private shapes: Shape[] = [];
    private config: IShapeManagerConfig;
    private selectedShapes: Set<string> = new Set();

    // 性能统计
    private stats = {
        totalShapes: 0,
        visibleShapes: 0,
        collisionChecks: 0,
        renderTime: 0,
    };

    constructor(config: Partial<IShapeManagerConfig> = {}) {
        this.config = {
            maxShapes: 1000,
            enableCollision: false,
            enableBounds: true,
            bounds: { width: 800, height: 600 },
            ...config,
        };
    }

    /**
     * 添加图形
     */
    addShape(shape: Shape): boolean {
        if (this.shapes.length >= this.config.maxShapes) {
            return false;
        }

        this.shapes.push(shape);
        this.stats.totalShapes = this.shapes.length;
        return true;
    }

    /**
     * 移除图形
     */
    removeShape(shapeId: string): boolean {
        const index = this.shapes.findIndex((shape) => shape.id === shapeId);
        if (index !== -1) {
            const shape = this.shapes[index];
            if (shape) {
                shape.destroy();
            }
            this.shapes.splice(index, 1);
            this.selectedShapes.delete(shapeId);
            this.stats.totalShapes = this.shapes.length;
            return true;
        }
        return false;
    }

    /**
     * 根据ID获取图形
     */
    getShape(shapeId: string): Shape | undefined {
        return this.shapes.find((shape) => shape.id === shapeId);
    }

    /**
     * 获取所有图形
     */
    getAllShapes(): readonly Shape[] {
        return this.shapes;
    }

    /**
     * 获取可见图形
     */
    getVisibleShapes(): Shape[] {
        return this.shapes.filter((shape) => shape.visible);
    }

    /**
     * 清空所有图形
     */
    clear(): void {
        this.shapes.forEach((shape) => shape.destroy());
        this.shapes = [];
        this.selectedShapes.clear();
        this.stats.totalShapes = 0;
    }

    /**
     * 更新所有图形
     */
    update(deltaTime: number): void {
        for (const shape of this.shapes) {
            if (shape.visible) {
                shape.update(deltaTime);

                // 边界约束
                if (this.config.enableBounds) {
                    this.applyBounds(shape);
                }
            }
        }

        // 碰撞检测
        if (this.config.enableCollision) {
            this.handleCollisions();
        }
    }

    /**
     * 应用边界约束
     */
    private applyBounds(shape: Shape): void {
        const bounds = shape.getBounds();
        const { width, height } = this.config.bounds;

        // 左边界
        if (bounds.x < 0) {
            shape.position.x += -bounds.x;
        }
        // 右边界
        else if (bounds.x + bounds.width > width) {
            shape.position.x -= bounds.x + bounds.width - width;
        }

        // 上边界
        if (bounds.y < 0) {
            shape.position.y += -bounds.y;
        }
        // 下边界
        else if (bounds.y + bounds.height > height) {
            shape.position.y -= bounds.y + bounds.height - height;
        }
    }

    /**
     * 处理碰撞
     */
    private handleCollisions(): void {
        this.stats.collisionChecks = 0;

        for (let i = 0; i < this.shapes.length; i++) {
            for (let j = i + 1; j < this.shapes.length; j++) {
                const shapeA = this.shapes[i];
                const shapeB = this.shapes[j];

                if (shapeA && shapeB && shapeA.visible && shapeB.visible) {
                    this.stats.collisionChecks++;

                    if (shapeA.collidesWith(shapeB)) {
                        this.handleCollision(shapeA, shapeB);
                    }
                }
            }
        }
    }

    /**
     * 处理两个图形的碰撞
     */
    private handleCollision(shapeA: Shape, shapeB: Shape): void {
        // 简单的弹性碰撞处理
        const dx = shapeB.position.x - shapeA.position.x;
        const dy = shapeB.position.y - shapeA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        // 标准化碰撞向量
        const nx = dx / distance;
        const ny = dy / distance;

        // 分离图形
        const overlap = 1; // 最小分离距离
        const separationX = nx * overlap * 0.5;
        const separationY = ny * overlap * 0.5;

        shapeA.position.x -= separationX;
        shapeA.position.y -= separationY;
        shapeB.position.x += separationX;
        shapeB.position.y += separationY;

        // 交换速度（简化的弹性碰撞）
        const tempVx = shapeA.velocity.x;
        const tempVy = shapeA.velocity.y;
        shapeA.velocity.x = shapeB.velocity.x * 0.8;
        shapeA.velocity.y = shapeB.velocity.y * 0.8;
        shapeB.velocity.x = tempVx * 0.8;
        shapeB.velocity.y = tempVy * 0.8;
    }

    /**
     * 渲染所有图形
     */
    render(ctx: CanvasRenderingContext2D): void {
        const startTime = performance.now();
        let visibleCount = 0;

        for (const shape of this.shapes) {
            if (shape.visible) {
                shape.render(ctx);
                visibleCount++;

                // 绘制选中状态
                if (this.selectedShapes.has(shape.id)) {
                    this.drawSelection(ctx, shape);
                }
            }
        }

        this.stats.visibleShapes = visibleCount;
        this.stats.renderTime = performance.now() - startTime;
    }

    /**
     * 绘制选中状态
     */
    private drawSelection(ctx: CanvasRenderingContext2D, shape: Shape): void {
        const bounds = shape.getBounds();

        ctx.save();
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
        ctx.restore();
    }

    /**
     * 根据位置查找图形
     */
    getShapeAtPosition(x: number, y: number): Shape | undefined {
        // 从后往前查找（后添加的图形在上层）
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            const shape = this.shapes[i];
            if (shape && shape.visible && shape.isPointInside(x, y)) {
                return shape;
            }
        }
        return undefined;
    }

    /**
     * 根据区域查找图形
     */
    getShapesInArea(
        x: number,
        y: number,
        width: number,
        height: number,
    ): Shape[] {
        const result: Shape[] = [];
        const area = { x, y, width, height };

        for (const shape of this.shapes) {
            if (shape.visible) {
                const bounds = shape.getBounds();

                // 检查边界框是否相交
                if (
                    !(
                        bounds.x + bounds.width < area.x ||
                        area.x + area.width < bounds.x ||
                        bounds.y + bounds.height < area.y ||
                        area.y + area.height < bounds.y
                    )
                ) {
                    result.push(shape);
                }
            }
        }

        return result;
    }

    /**
     * 选中图形
     */
    selectShape(shapeId: string): void {
        this.selectedShapes.add(shapeId);
    }

    /**
     * 取消选中图形
     */
    deselectShape(shapeId: string): void {
        this.selectedShapes.delete(shapeId);
    }

    /**
     * 切换图形选中状态
     */
    toggleShapeSelection(shapeId: string): void {
        if (this.selectedShapes.has(shapeId)) {
            this.selectedShapes.delete(shapeId);
        } else {
            this.selectedShapes.add(shapeId);
        }
    }

    /**
     * 清空选中
     */
    clearSelection(): void {
        this.selectedShapes.clear();
    }

    /**
     * 获取选中的图形
     */
    getSelectedShapes(): Shape[] {
        return this.shapes.filter((shape) => this.selectedShapes.has(shape.id));
    }

    /**
     * 删除选中的图形
     */
    deleteSelectedShapes(): void {
        const selectedIds = Array.from(this.selectedShapes);
        selectedIds.forEach((id) => this.removeShape(id));
    }

    /**
     * 创建圆形
     */
    createCircle(config: {
        position: IPoint;
        radius: number;
        color?: string;
        strokeColor?: string;
        strokeWidth?: number;
    }): Circle {
        const circle = new Circle({
            position: config.position,
            radius: config.radius,
            color: config.color || "#ffffff",
            strokeColor: config.strokeColor,
            strokeWidth: config.strokeWidth || 0,
        });

        this.addShape(circle);
        return circle;
    }

    /**
     * 创建矩形
     */
    createRectangle(config: {
        position: IPoint;
        size: ISize;
        color?: string;
        strokeColor?: string;
        strokeWidth?: number;
        borderRadius?: number;
    }): Rectangle {
        const rectangle = new Rectangle({
            position: config.position,
            size: config.size,
            color: config.color || "#ffffff",
            strokeColor: config.strokeColor,
            strokeWidth: config.strokeWidth || 0,
            borderRadius: config.borderRadius || 0,
        });

        this.addShape(rectangle);
        return rectangle;
    }

    /**
     * 创建多边形
     */
    createPolygon(config: {
        position: IPoint;
        vertices: IPoint[];
        color?: string;
        strokeColor?: string;
        strokeWidth?: number;
    }): Polygon {
        const polygon = new Polygon({
            position: config.position,
            vertices: config.vertices,
            color: config.color || "#ffffff",
            strokeColor: config.strokeColor,
            strokeWidth: config.strokeWidth || 0,
        });

        this.addShape(polygon);
        return polygon;
    }

    /**
     * 创建正多边形
     */
    createRegularPolygon(config: {
        position: IPoint;
        sides: number;
        radius: number;
        color?: string;
        strokeColor?: string;
        strokeWidth?: number;
    }): Polygon {
        const polygon = Polygon.createRegular(config.sides, config.radius, {
            position: config.position,
            color: config.color || "#ffffff",
        });

        // 设置描边属性
        if (config.strokeColor) {
            polygon.strokeColor = config.strokeColor;
        }
        if (config.strokeWidth) {
            polygon.strokeWidth = config.strokeWidth;
        }

        this.addShape(polygon);
        return polygon;
    }

    /**
     * 创建星形
     */
    createStar(config: {
        position: IPoint;
        outerRadius: number;
        innerRadius: number;
        points?: number;
        color?: string;
        strokeColor?: string;
        strokeWidth?: number;
    }): Polygon {
        const star = Polygon.createStar(
            config.outerRadius,
            config.innerRadius,
            config.points || 5,
            {
                position: config.position,
                color: config.color || "#ffffff",
            },
        );

        // 设置描边属性
        if (config.strokeColor) {
            star.strokeColor = config.strokeColor;
        }
        if (config.strokeWidth) {
            star.strokeWidth = config.strokeWidth;
        }

        this.addShape(star);
        return star;
    }

    /**
     * 设置边界
     */
    setBounds(width: number, height: number): void {
        this.config.bounds = { width, height };
    }

    /**
     * 启用/禁用碰撞检测
     */
    setCollisionEnabled(enabled: boolean): void {
        this.config.enableCollision = enabled;
    }

    /**
     * 启用/禁用边界约束
     */
    setBoundsEnabled(enabled: boolean): void {
        this.config.enableBounds = enabled;
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<IShapeManagerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * 销毁管理器
     */
    destroy(): void {
        this.clear();
    }
}
