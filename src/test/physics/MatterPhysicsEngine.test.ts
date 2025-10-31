// Matter.js 物理引擎测试

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MatterPhysicsEngine } from "@/utils/physics/MatterPhysicsEngine";
import { createPhysicsBody } from "@/utils/physics/PhysicsBodyFactory";
import type { IPhysicsWorldConfig } from "@/types/physics";

describe("MatterPhysicsEngine", () => {
    let engine: MatterPhysicsEngine;
    let config: IPhysicsWorldConfig;

    beforeEach(() => {
        engine = new MatterPhysicsEngine();
        config = {
            gravity: { x: 0, y: 1 },
            enableCollision: true,
            timeStep: 16.67,
            velocityIterations: 4,
            positionIterations: 6,
        };
    });

    afterEach(() => {
        if (engine) {
            engine.destroy();
        }
    });

    describe("初始化", () => {
        it("应该能够初始化物理引擎", () => {
            expect(() => {
                engine.init(config);
            }).not.toThrow();
        });

        it("应该能够设置重力", () => {
            engine.init(config);

            expect(() => {
                engine.setGravity({ x: 0, y: 2 });
            }).not.toThrow();
        });
    });

    describe("物理体管理", () => {
        beforeEach(() => {
            engine.init(config);
        });

        it("应该能够添加圆形物理体", () => {
            const circle = createPhysicsBody.circle(100, 100, 20, {
                id: "test-circle",
            });

            expect(() => {
                engine.addBody(circle);
            }).not.toThrow();

            const retrievedBody = engine.getBody("test-circle");
            expect(retrievedBody).toBeTruthy();
            expect(retrievedBody?.type).toBe("circle");
        });

        it("应该能够添加矩形物理体", () => {
            const rectangle = createPhysicsBody.rectangle(100, 100, 40, 30, {
                id: "test-rectangle",
            });

            expect(() => {
                engine.addBody(rectangle);
            }).not.toThrow();

            const retrievedBody = engine.getBody("test-rectangle");
            expect(retrievedBody).toBeTruthy();
            expect(retrievedBody?.type).toBe("rectangle");
        });

        it("应该能够移除物理体", () => {
            const circle = createPhysicsBody.circle(100, 100, 20, {
                id: "test-circle-remove",
            });

            engine.addBody(circle);
            expect(engine.getBody("test-circle-remove")).toBeTruthy();

            engine.removeBody("test-circle-remove");
            expect(engine.getBody("test-circle-remove")).toBeNull();
        });

        it("应该能够清空所有物理体", () => {
            const circle1 = createPhysicsBody.circle(100, 100, 20, {
                id: "circle1",
            });
            const circle2 = createPhysicsBody.circle(200, 100, 20, {
                id: "circle2",
            });

            engine.addBody(circle1);
            engine.addBody(circle2);

            expect(engine.getBody("circle1")).toBeTruthy();
            expect(engine.getBody("circle2")).toBeTruthy();

            engine.clear();

            expect(engine.getBody("circle1")).toBeNull();
            expect(engine.getBody("circle2")).toBeNull();
        });
    });

    describe("物理更新", () => {
        beforeEach(() => {
            engine.init(config);
        });

        it("应该能够更新物理世界", () => {
            const circle = createPhysicsBody.circle(100, 50, 20, {
                id: "falling-circle",
                velocity: { x: 0, y: 0 },
            });

            engine.addBody(circle);

            // 获取初始位置
            const initialBody = engine.getBody("falling-circle");
            const initialY = initialBody?.position.y || 0;

            // 更新物理世界几次
            for (let i = 0; i < 10; i++) {
                engine.update(16.67);
            }

            // 检查物体是否因重力下落
            const updatedBody = engine.getBody("falling-circle");
            const finalY = updatedBody?.position.y || 0;

            expect(finalY).toBeGreaterThan(initialY);
        });

        it("应该能够获取调试信息", () => {
            const circle = createPhysicsBody.circle(100, 100, 20);
            engine.addBody(circle);

            engine.update(16.67);

            const debugInfo = engine.getDebugInfo();
            expect(debugInfo).toBeTruthy();
            expect(debugInfo.bodyCount).toBeGreaterThan(0);
            expect(debugInfo.updateTime).toBeGreaterThanOrEqual(0);
        });
    });

    describe("约束系统", () => {
        beforeEach(() => {
            engine.init(config);
        });

        it("应该能够添加约束", () => {
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA",
            });
            const bodyB = createPhysicsBody.circle(200, 100, 20, {
                id: "bodyB",
            });

            engine.addBody(bodyA);
            engine.addBody(bodyB);

            const constraint = {
                id: "test-constraint",
                bodyA,
                bodyB,
                length: 100,
                stiffness: 0.8,
                damping: 0.1,
            };

            expect(() => {
                engine.addConstraint(constraint);
            }).not.toThrow();
        });

        it("应该能够移除约束", () => {
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA2",
            });
            const bodyB = createPhysicsBody.circle(200, 100, 20, {
                id: "bodyB2",
            });

            engine.addBody(bodyA);
            engine.addBody(bodyB);

            const constraint = {
                id: "test-constraint-remove",
                bodyA,
                bodyB,
                length: 100,
                stiffness: 0.8,
                damping: 0.1,
            };

            engine.addConstraint(constraint);

            expect(() => {
                engine.removeConstraint("test-constraint-remove");
            }).not.toThrow();
        });
    });

    describe("碰撞检测", () => {
        beforeEach(() => {
            engine.init({
                ...config,
                enableCollision: true,
            });
        });

        it("应该能够获取碰撞对", () => {
            // 创建两个相互接近的物理体
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "collisionA",
                velocity: { x: 50, y: 0 },
            });
            const bodyB = createPhysicsBody.circle(150, 100, 20, {
                id: "collisionB",
                velocity: { x: -50, y: 0 },
            });

            engine.addBody(bodyA);
            engine.addBody(bodyB);

            // 更新物理世界让它们碰撞
            for (let i = 0; i < 5; i++) {
                engine.update(16.67);
            }

            const collisionPairs = engine.getCollisionPairs();
            expect(Array.isArray(collisionPairs)).toBe(true);
        });
    });
});
