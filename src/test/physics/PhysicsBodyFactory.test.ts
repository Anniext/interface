// 物理体工厂测试

import { describe, it, expect } from "vitest";
import {
    PhysicsBodyFactory,
    createPhysicsBody,
    PhysicsMaterials,
} from "@/utils/physics/PhysicsBodyFactory";
import { PhysicsBodyType } from "@/types/physics";

describe("PhysicsBodyFactory", () => {
    const factory = new PhysicsBodyFactory();

    describe("圆形物理体创建", () => {
        it("应该能够创建基本圆形物理体", () => {
            const circle = factory.createCircle(100, 200, 25);

            expect(circle.type).toBe(PhysicsBodyType.CIRCLE);
            expect(circle.position.x).toBe(100);
            expect(circle.position.y).toBe(200);
            expect(circle.radius).toBe(25);
            expect(circle.id).toBeTruthy();
        });

        it("应该能够创建带选项的圆形物理体", () => {
            const circle = factory.createCircle(50, 75, 15, {
                id: "custom-circle",
                mass: 2,
                restitution: 0.8,
                friction: 0.2,
                isStatic: true,
            });

            expect(circle.id).toBe("custom-circle");
            expect(circle.mass).toBe(2);
            expect(circle.restitution).toBe(0.8);
            expect(circle.friction).toBe(0.2);
            expect(circle.isStatic).toBe(true);
        });

        it("应该能够应用材质属性", () => {
            const circle = factory.createCircle(100, 100, 20, {
                material: "bouncy" as any,
            });

            expect(circle.restitution).toBe(
                PhysicsMaterials.bouncy.restitution,
            );
            expect(circle.friction).toBe(PhysicsMaterials.bouncy.friction);
        });
    });

    describe("矩形物理体创建", () => {
        it("应该能够创建基本矩形物理体", () => {
            const rectangle = factory.createRectangle(150, 250, 40, 60);

            expect(rectangle.type).toBe(PhysicsBodyType.RECTANGLE);
            expect(rectangle.position.x).toBe(150);
            expect(rectangle.position.y).toBe(250);
            expect(rectangle.width).toBe(40);
            expect(rectangle.height).toBe(60);
            expect(rectangle.id).toBeTruthy();
        });

        it("应该能够创建带选项的矩形物理体", () => {
            const rectangle = factory.createRectangle(100, 100, 30, 30, {
                id: "custom-rectangle",
                angle: Math.PI / 4,
                velocity: { x: 10, y: -5 },
            });

            expect(rectangle.id).toBe("custom-rectangle");
            expect(rectangle.angle).toBe(Math.PI / 4);
            expect(rectangle.velocity.x).toBe(10);
            expect(rectangle.velocity.y).toBe(-5);
        });
    });

    describe("多边形物理体创建", () => {
        it("应该能够创建基本多边形物理体", () => {
            const vertices = [
                { x: 0, y: -10 },
                { x: 10, y: 10 },
                { x: -10, y: 10 },
            ];

            const polygon = factory.createPolygon(200, 300, vertices);

            expect(polygon.type).toBe(PhysicsBodyType.POLYGON);
            expect(polygon.position.x).toBe(200);
            expect(polygon.position.y).toBe(300);
            expect(polygon.vertices).toEqual(vertices);
            expect(polygon.id).toBeTruthy();
        });

        it("应该能够创建三角形", () => {
            const triangle = factory.createTriangle(100, 100, 30);

            expect(triangle.type).toBe(PhysicsBodyType.POLYGON);
            expect(triangle.vertices).toHaveLength(3);
            expect(triangle.id).toContain("triangle");
        });

        it("应该能够创建正六边形", () => {
            const hexagon = factory.createHexagon(150, 150, 25);

            expect(hexagon.type).toBe(PhysicsBodyType.POLYGON);
            expect(hexagon.vertices).toHaveLength(6);
            expect(hexagon.id).toContain("hexagon");
        });

        it("应该能够创建星形", () => {
            const star = factory.createStar(200, 200, 30, 15, 5);

            expect(star.type).toBe(PhysicsBodyType.POLYGON);
            expect(star.vertices).toHaveLength(10); // 5 个外点 + 5 个内点
            expect(star.id).toContain("star");
        });
    });

    describe("边界墙体创建", () => {
        it("应该能够创建边界墙体", () => {
            const bounds = factory.createBounds(800, 600, 50);

            expect(bounds).toHaveLength(4); // 上下左右四面墙
            bounds.forEach((bound) => {
                expect(bound.isStatic).toBe(true);
                expect(bound.type).toBe(PhysicsBodyType.RECTANGLE);
                expect(bound.id).toContain("bound_");
            });
        });

        it("边界墙体应该有正确的位置", () => {
            const width = 800;
            const height = 600;
            const thickness = 50;
            const bounds = factory.createBounds(width, height, thickness);

            // 检查上边界
            const topBound = bounds.find((b) => b.id === "bound_top");
            expect(topBound?.position.x).toBe(width / 2);
            expect(topBound?.position.y).toBe(-thickness / 2);

            // 检查下边界
            const bottomBound = bounds.find((b) => b.id === "bound_bottom");
            expect(bottomBound?.position.x).toBe(width / 2);
            expect(bottomBound?.position.y).toBe(height + thickness / 2);

            // 检查左边界
            const leftBound = bounds.find((b) => b.id === "bound_left");
            expect(leftBound?.position.x).toBe(-thickness / 2);
            expect(leftBound?.position.y).toBe(height / 2);

            // 检查右边界
            const rightBound = bounds.find((b) => b.id === "bound_right");
            expect(rightBound?.position.x).toBe(width + thickness / 2);
            expect(rightBound?.position.y).toBe(height / 2);
        });
    });

    describe("复合物理体创建", () => {
        it("应该能够创建复合物理体", () => {
            const circle = factory.createCircle(0, 0, 10);
            const rectangle = factory.createRectangle(20, 0, 15, 15);
            const bodies = [circle, rectangle];

            const compound = factory.createCompound(bodies, {
                id: "test-compound",
                offset: { x: 100, y: 100 },
            });

            expect(compound).toHaveLength(2);
            expect(compound[0].id).toContain("test-compound_part_0");
            expect(compound[1].id).toContain("test-compound_part_1");

            // 检查偏移是否正确应用
            expect(compound[0].position.x).toBe(100);
            expect(compound[0].position.y).toBe(100);
            expect(compound[1].position.x).toBe(120);
            expect(compound[1].position.y).toBe(100);
        });
    });

    describe("便捷创建函数", () => {
        it("createPhysicsBody 应该提供便捷的创建方法", () => {
            const circle = createPhysicsBody.circle(100, 100, 20);
            const rectangle = createPhysicsBody.rectangle(200, 200, 30, 40);
            const triangle = createPhysicsBody.triangle(300, 300, 25);

            expect(circle.type).toBe(PhysicsBodyType.CIRCLE);
            expect(rectangle.type).toBe(PhysicsBodyType.RECTANGLE);
            expect(triangle.type).toBe(PhysicsBodyType.POLYGON);
        });
    });

    describe("材质系统", () => {
        it("应该包含预定义的材质", () => {
            expect(PhysicsMaterials.default).toBeTruthy();
            expect(PhysicsMaterials.bouncy).toBeTruthy();
            expect(PhysicsMaterials.ice).toBeTruthy();
            expect(PhysicsMaterials.rubber).toBeTruthy();
            expect(PhysicsMaterials.metal).toBeTruthy();
            expect(PhysicsMaterials.wood).toBeTruthy();
        });

        it("材质应该有正确的属性", () => {
            const bouncy = PhysicsMaterials.bouncy;
            expect(bouncy.name).toBe("bouncy");
            expect(bouncy.restitution).toBeGreaterThan(0.8);
            expect(typeof bouncy.density).toBe("number");
            expect(typeof bouncy.friction).toBe("number");
            expect(typeof bouncy.frictionAir).toBe("number");
        });
    });
});
