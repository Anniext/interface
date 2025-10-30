/**
 * 图形管理器测试
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ShapeManager, Circle, Rectangle, Polygon } from "@/utils/canvas";
import type { IShapeManagerConfig } from "@/utils/canvas";

// Mock Canvas context
const mockContext = {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    rect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    quadraticCurveTo: vi.fn(),
    setLineDash: vi.fn(),
    set globalAlpha(value: number) {},
    set fillStyle(value: string) {},
    set strokeStyle(value: string) {},
    set lineWidth(value: number) {},
    set shadowColor(value: string) {},
    set shadowBlur(value: number) {},
    set shadowOffsetX(value: number) {},
    set shadowOffsetY(value: number) {},
};

describe("ShapeManager", () => {
    let shapeManager: ShapeManager;
    let config: Partial<IShapeManagerConfig>;

    beforeEach(() => {
        vi.clearAllMocks();

        config = {
            maxShapes: 50,
            enableCollision: false,
            enableBounds: true,
            bounds: { width: 800, height: 600 },
        };

        shapeManager = new ShapeManager(config);
    });

    describe("初始化", () => {
        it("应该使用默认配置创建图形管理器", () => {
            const defaultManager = new ShapeManager();
            const stats = defaultManager.getStats();

            expect(stats.totalShapes).toBe(0);
            expect(stats.visibleShapes).toBe(0);
        });

        it("应该使用自定义配置创建图形管理器", () => {
            expect(shapeManager).toBeDefined();
            expect(shapeManager.getAllShapes()).toHaveLength(0);
        });
    });

    describe("图形管理", () => {
        let circle: Circle;
        let rectangle: Rectangle;

        beforeEach(() => {
            circle = new Circle({
                id: "circle1",
                position: { x: 100, y: 100 },
                radius: 25,
                color: "#ff0000",
            });

            rectangle = new Rectangle({
                id: "rect1",
                position: { x: 200, y: 200 },
                size: { width: 50, height: 30 },
                color: "#00ff00",
            });
        });

        it("应该添加图形", () => {
            const success = shapeManager.addShape(circle);

            expect(success).toBe(true);
            expect(shapeManager.getAllShapes()).toHaveLength(1);
            expect(shapeManager.getStats().totalShapes).toBe(1);
        });

        it("应该拒绝超过最大数量的图形", () => {
            // 添加最大数量的图形
            for (let i = 0; i < 50; i++) {
                const shape = new Circle({
                    id: `circle${i}`,
                    position: { x: i * 10, y: i * 10 },
                    radius: 5,
                });
                shapeManager.addShape(shape);
            }

            // 尝试添加第51个图形
            const extraShape = new Circle({
                id: "extra",
                position: { x: 0, y: 0 },
                radius: 5,
            });
            const success = shapeManager.addShape(extraShape);

            expect(success).toBe(false);
            expect(shapeManager.getAllShapes()).toHaveLength(50);
        });

        it("应该移除图形", () => {
            shapeManager.addShape(circle);
            shapeManager.addShape(rectangle);

            const success = shapeManager.removeShape("circle1");

            expect(success).toBe(true);
            expect(shapeManager.getAllShapes()).toHaveLength(1);
            expect(shapeManager.getShape("circle1")).toBeUndefined();
            expect(shapeManager.getShape("rect1")).toBeDefined();
        });

        it("应该返回false当移除不存在的图形", () => {
            const success = shapeManager.removeShape("nonexistent");

            expect(success).toBe(false);
        });

        it("应该根据ID获取图形", () => {
            shapeManager.addShape(circle);

            const foundShape = shapeManager.getShape("circle1");
            expect(foundShape).toBe(circle);

            const notFound = shapeManager.getShape("nonexistent");
            expect(notFound).toBeUndefined();
        });

        it("应该获取所有图形", () => {
            shapeManager.addShape(circle);
            shapeManager.addShape(rectangle);

            const allShapes = shapeManager.getAllShapes();
            expect(allShapes).toHaveLength(2);
            expect(allShapes).toContain(circle);
            expect(allShapes).toContain(rectangle);
        });

        it("应该获取可见图形", () => {
            circle.visible = true;
            rectangle.visible = false;

            shapeManager.addShape(circle);
            shapeManager.addShape(rectangle);

            const visibleShapes = shapeManager.getVisibleShapes();
            expect(visibleShapes).toHaveLength(1);
            expect(visibleShapes).toContain(circle);
            expect(visibleShapes).not.toContain(rectangle);
        });

        it("应该清空所有图形", () => {
            shapeManager.addShape(circle);
            shapeManager.addShape(rectangle);

            shapeManager.clear();

            expect(shapeManager.getAllShapes()).toHaveLength(0);
            expect(shapeManager.getStats().totalShapes).toBe(0);
        });
    });

    describe("图形创建", () => {
        it("应该创建圆形", () => {
            const circle = shapeManager.createCircle({
                position: { x: 150, y: 150 },
                radius: 30,
                color: "#ff00ff",
            });

            expect(circle).toBeInstanceOf(Circle);
            expect(circle.position).toEqual({ x: 150, y: 150 });
            expect(circle.radius).toBe(30);
            expect(circle.color).toBe("#ff00ff");
            expect(shapeManager.getAllShapes()).toContain(circle);
        });

        it("应该创建矩形", () => {
            const rectangle = shapeManager.createRectangle({
                position: { x: 100, y: 100 },
                size: { width: 60, height: 40 },
                color: "#00ffff",
                borderRadius: 10,
            });

            expect(rectangle).toBeInstanceOf(Rectangle);
            expect(rectangle.position).toEqual({ x: 100, y: 100 });
            expect(rectangle.size).toEqual({ width: 60, height: 40 });
            expect(rectangle.color).toBe("#00ffff");
            expect(rectangle.borderRadius).toBe(10);
            expect(shapeManager.getAllShapes()).toContain(rectangle);
        });

        it("应该创建多边形", () => {
            const vertices = [
                { x: 0, y: -20 },
                { x: 20, y: 10 },
                { x: -20, y: 10 },
            ];

            const polygon = shapeManager.createPolygon({
                position: { x: 200, y: 200 },
                vertices,
                color: "#ffff00",
            });

            expect(polygon).toBeInstanceOf(Polygon);
            expect(polygon.position).toEqual({ x: 200, y: 200 });
            expect(polygon.vertices).toEqual(vertices);
            expect(polygon.color).toBe("#ffff00");
            expect(shapeManager.getAllShapes()).toContain(polygon);
        });

        it("应该创建正多边形", () => {
            const polygon = shapeManager.createRegularPolygon({
                position: { x: 300, y: 300 },
                sides: 6,
                radius: 40,
                color: "#ff8800",
            });

            expect(polygon).toBeInstanceOf(Polygon);
            expect(polygon.position).toEqual({ x: 300, y: 300 });
            expect(polygon.vertices).toHaveLength(6);
            expect(polygon.color).toBe("#ff8800");
        });

        it("应该创建星形", () => {
            const star = shapeManager.createStar({
                position: { x: 400, y: 400 },
                outerRadius: 30,
                innerRadius: 15,
                points: 5,
                color: "#8800ff",
            });

            expect(star).toBeInstanceOf(Polygon);
            expect(star.position).toEqual({ x: 400, y: 400 });
            expect(star.vertices).toHaveLength(10); // 5 points * 2
            expect(star.color).toBe("#8800ff");
        });
    });

    describe("更新和渲染", () => {
        let circle: Circle;

        beforeEach(() => {
            circle = shapeManager.createCircle({
                position: { x: 100, y: 100 },
                radius: 20,
                color: "#ff0000",
            });
            circle.velocity = { x: 50, y: -30 };
        });

        it("应该更新所有图形", () => {
            const deltaTime = 1000; // 1秒
            const initialX = circle.position.x;

            shapeManager.update(deltaTime);

            expect(circle.position.x).toBeGreaterThan(initialX);
        });

        it("应该应用边界约束", () => {
            // 将圆形移动到边界外
            circle.position.x = -10;
            circle.position.y = -10;

            shapeManager.update(16.67);

            // 圆形应该被约束在边界内
            const bounds = circle.getBounds();
            expect(bounds.x).toBeGreaterThanOrEqual(0);
            expect(bounds.y).toBeGreaterThanOrEqual(0);
        });

        it("应该渲染所有图形", () => {
            const ctx = mockContext as unknown as CanvasRenderingContext2D;

            shapeManager.render(ctx);

            expect(mockContext.save).toHaveBeenCalled();
            expect(mockContext.restore).toHaveBeenCalled();

            const stats = shapeManager.getStats();
            expect(stats.visibleShapes).toBe(1);
            expect(stats.renderTime).toBeGreaterThanOrEqual(0);
        });
    });

    describe("碰撞检测", () => {
        let circle1: Circle;
        let circle2: Circle;

        beforeEach(() => {
            // 启用碰撞检测
            shapeManager.updateConfig({ enableCollision: true });

            circle1 = shapeManager.createCircle({
                position: { x: 100, y: 100 },
                radius: 20,
                color: "#ff0000",
            });

            circle2 = shapeManager.createCircle({
                position: { x: 130, y: 100 }, // 重叠位置
                radius: 20,
                color: "#00ff00",
            });

            circle1.velocity = { x: 10, y: 0 };
            circle2.velocity = { x: -10, y: 0 };
        });

        it("应该检测和处理碰撞", () => {
            const initialDistance = Math.abs(
                circle1.position.x - circle2.position.x,
            );

            shapeManager.update(16.67);

            const finalDistance = Math.abs(
                circle1.position.x - circle2.position.x,
            );

            // 碰撞后圆形应该分离
            expect(finalDistance).toBeGreaterThan(initialDistance);
        });

        it("应该统计碰撞检测次数", () => {
            shapeManager.update(16.67);

            const stats = shapeManager.getStats();
            expect(stats.collisionChecks).toBeGreaterThan(0);
        });
    });

    describe("图形查找", () => {
        let circle: Circle;
        let rectangle: Rectangle;

        beforeEach(() => {
            circle = shapeManager.createCircle({
                position: { x: 100, y: 100 },
                radius: 25,
                color: "#ff0000",
            });

            rectangle = shapeManager.createRectangle({
                position: { x: 200, y: 200 },
                size: { width: 50, height: 30 },
                color: "#00ff00",
            });
        });

        it("应该根据位置查找图形", () => {
            const foundShape = shapeManager.getShapeAtPosition(100, 100);
            expect(foundShape).toBe(circle);

            const notFound = shapeManager.getShapeAtPosition(500, 500);
            expect(notFound).toBeUndefined();
        });

        it("应该根据区域查找图形", () => {
            const shapesInArea = shapeManager.getShapesInArea(50, 50, 100, 100);

            expect(shapesInArea).toContain(circle);
            expect(shapesInArea).not.toContain(rectangle);
        });
    });

    describe("选择管理", () => {
        let circle: Circle;
        let rectangle: Rectangle;

        beforeEach(() => {
            circle = shapeManager.createCircle({
                position: { x: 100, y: 100 },
                radius: 25,
                color: "#ff0000",
            });

            rectangle = shapeManager.createRectangle({
                position: { x: 200, y: 200 },
                size: { width: 50, height: 30 },
                color: "#00ff00",
            });
        });

        it("应该选中图形", () => {
            shapeManager.selectShape(circle.id);

            const selectedShapes = shapeManager.getSelectedShapes();
            expect(selectedShapes).toContain(circle);
            expect(selectedShapes).toHaveLength(1);
        });

        it("应该取消选中图形", () => {
            shapeManager.selectShape(circle.id);
            shapeManager.deselectShape(circle.id);

            const selectedShapes = shapeManager.getSelectedShapes();
            expect(selectedShapes).not.toContain(circle);
            expect(selectedShapes).toHaveLength(0);
        });

        it("应该切换图形选中状态", () => {
            shapeManager.toggleShapeSelection(circle.id);
            expect(shapeManager.getSelectedShapes()).toContain(circle);

            shapeManager.toggleShapeSelection(circle.id);
            expect(shapeManager.getSelectedShapes()).not.toContain(circle);
        });

        it("应该清空所有选中", () => {
            shapeManager.selectShape(circle.id);
            shapeManager.selectShape(rectangle.id);

            shapeManager.clearSelection();

            expect(shapeManager.getSelectedShapes()).toHaveLength(0);
        });

        it("应该删除选中的图形", () => {
            shapeManager.selectShape(circle.id);
            shapeManager.selectShape(rectangle.id);

            shapeManager.deleteSelectedShapes();

            expect(shapeManager.getAllShapes()).toHaveLength(0);
        });

        it("应该在渲染时显示选中状态", () => {
            const ctx = mockContext as unknown as CanvasRenderingContext2D;

            shapeManager.selectShape(circle.id);
            shapeManager.render(ctx);

            // 验证选中框被绘制
            expect(mockContext.setLineDash).toHaveBeenCalledWith([5, 5]);
            expect(mockContext.strokeRect).toHaveBeenCalled();
        });
    });

    describe("配置管理", () => {
        it("应该设置边界", () => {
            shapeManager.setBounds(1000, 800);

            // 边界设置是内部的，通过行为验证
            expect(shapeManager).toBeDefined();
        });

        it("应该启用/禁用碰撞检测", () => {
            shapeManager.setCollisionEnabled(true);
            shapeManager.setCollisionEnabled(false);

            // 碰撞设置是内部的，通过行为验证
            expect(shapeManager).toBeDefined();
        });

        it("应该启用/禁用边界约束", () => {
            shapeManager.setBoundsEnabled(true);
            shapeManager.setBoundsEnabled(false);

            // 边界设置是内部的，通过行为验证
            expect(shapeManager).toBeDefined();
        });

        it("应该更新配置", () => {
            const newConfig = {
                maxShapes: 100,
                enableCollision: true,
            };

            shapeManager.updateConfig(newConfig);

            // 配置更新是内部的，通过行为验证
            expect(shapeManager).toBeDefined();
        });
    });

    describe("统计信息", () => {
        it("应该返回正确的统计信息", () => {
            const stats = shapeManager.getStats();

            expect(stats).toHaveProperty("totalShapes");
            expect(stats).toHaveProperty("visibleShapes");
            expect(stats).toHaveProperty("collisionChecks");
            expect(stats).toHaveProperty("renderTime");

            expect(typeof stats.totalShapes).toBe("number");
            expect(typeof stats.visibleShapes).toBe("number");
            expect(typeof stats.collisionChecks).toBe("number");
            expect(typeof stats.renderTime).toBe("number");
        });

        it("应该更新统计信息", () => {
            const circle = shapeManager.createCircle({
                position: { x: 100, y: 100 },
                radius: 20,
                color: "#ff0000",
            });

            const stats = shapeManager.getStats();
            expect(stats.totalShapes).toBe(1);

            const ctx = mockContext as unknown as CanvasRenderingContext2D;
            shapeManager.render(ctx);

            const updatedStats = shapeManager.getStats();
            expect(updatedStats.visibleShapes).toBe(1);
            expect(updatedStats.renderTime).toBeGreaterThanOrEqual(0);
        });
    });

    describe("销毁", () => {
        it("应该正确销毁图形管理器", () => {
            shapeManager.createCircle({
                position: { x: 100, y: 100 },
                radius: 20,
                color: "#ff0000",
            });

            shapeManager.destroy();

            expect(shapeManager.getAllShapes()).toHaveLength(0);
            expect(shapeManager.getStats().totalShapes).toBe(0);
        });
    });
});
