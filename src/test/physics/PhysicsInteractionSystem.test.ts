// 物理交互系统测试

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PhysicsInteractionSystem } from "@/utils/physics/PhysicsInteractionSystem";
import { MatterPhysicsEngine } from "@/utils/physics/MatterPhysicsEngine";
import { createPhysicsBody } from "@/utils/physics/PhysicsBodyFactory";

describe("PhysicsInteractionSystem", () => {
    let physicsEngine: MatterPhysicsEngine;
    let interactionSystem: PhysicsInteractionSystem;

    beforeEach(() => {
        // 初始化物理引擎
        physicsEngine = new MatterPhysicsEngine();
        physicsEngine.init({
            gravity: { x: 0, y: 1 },
            enableCollision: true,
            timeStep: 16.67,
        });

        // 初始化交互系统
        interactionSystem = new PhysicsInteractionSystem(physicsEngine, {
            enableMouse: true,
            enableTouch: true,
            forceStrength: 0.001,
            interactionRadius: 50,
            dragDamping: 0.9,
        });
    });

    afterEach(() => {
        interactionSystem.destroy();
        physicsEngine.destroy();
    });

    describe("初始化", () => {
        it("应该能够初始化交互系统", () => {
            expect(interactionSystem).toBeDefined();

            const config = interactionSystem.getConfig();
            expect(config.enableMouse).toBe(true);
            expect(config.enableTouch).toBe(true);
            expect(config.forceStrength).toBe(0.001);
            expect(config.interactionRadius).toBe(50);
        });

        it("应该能够更新配置", () => {
            interactionSystem.updateConfig({
                forceStrength: 0.002,
                interactionRadius: 100,
            });

            const config = interactionSystem.getConfig();
            expect(config.forceStrength).toBe(0.002);
            expect(config.interactionRadius).toBe(100);
        });
    });

    describe("鼠标交互", () => {
        it("应该能够开始鼠标交互", () => {
            const position = { x: 100, y: 100 };

            interactionSystem.startMouseInteraction(position);

            const state = interactionSystem.getInteractionState();
            expect(state.isInteracting).toBe(true);
            expect(state.interactionPoint).toEqual(position);
        });

        it("应该能够更新鼠标交互", () => {
            const startPosition = { x: 100, y: 100 };
            const updatePosition = { x: 150, y: 150 };

            interactionSystem.startMouseInteraction(startPosition);
            interactionSystem.updateMouseInteraction(updatePosition);

            const state = interactionSystem.getInteractionState();
            expect(state.interactionPoint).toEqual(updatePosition);
        });

        it("应该能够结束鼠标交互", () => {
            const position = { x: 100, y: 100 };

            interactionSystem.startMouseInteraction(position);
            interactionSystem.endMouseInteraction();

            const state = interactionSystem.getInteractionState();
            expect(state.isInteracting).toBe(false);
            expect(state.draggedBody).toBeNull();
        });
    });

    describe("触摸交互", () => {
        it("应该能够处理单点触摸", () => {
            const touches = [{ x: 100, y: 100 }];

            interactionSystem.startTouchInteraction(touches);

            const state = interactionSystem.getInteractionState();
            expect(state.isInteracting).toBe(true);
        });

        it("应该能够处理多点触摸", () => {
            const touches = [
                { x: 100, y: 100 },
                { x: 200, y: 200 },
            ];

            interactionSystem.startTouchInteraction(touches);

            const state = interactionSystem.getInteractionState();
            expect(state.isInteracting).toBe(true);
        });

        it("应该能够结束触摸交互", () => {
            const touches = [{ x: 100, y: 100 }];

            interactionSystem.startTouchInteraction(touches);
            interactionSystem.endTouchInteraction();

            const state = interactionSystem.getInteractionState();
            expect(state.isInteracting).toBe(false);
        });
    });

    describe("约束创建", () => {
        it("应该能够创建弹簧约束", () => {
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA",
            });
            const bodyB = createPhysicsBody.circle(200, 200, 20, {
                id: "bodyB",
            });

            physicsEngine.addBody(bodyA);
            physicsEngine.addBody(bodyB);

            const constraintId = interactionSystem.createConstraint({
                type: "spring" as any,
                bodyA,
                bodyB,
                stiffness: 0.5,
                damping: 0.1,
            });

            expect(constraintId).toBeDefined();
            expect(typeof constraintId).toBe("string");
        });

        it("应该能够移除约束", () => {
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA",
            });
            const bodyB = createPhysicsBody.circle(200, 200, 20, {
                id: "bodyB",
            });

            physicsEngine.addBody(bodyA);
            physicsEngine.addBody(bodyB);

            const constraintId = interactionSystem.createConstraint({
                type: "spring" as any,
                bodyA,
                bodyB,
                stiffness: 0.5,
                damping: 0.1,
            });

            // 移除约束应该不会抛出错误
            expect(() => {
                interactionSystem.removeConstraint(constraintId);
            }).not.toThrow();
        });

        it("应该能够创建弹簧约束的便捷方法", () => {
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA",
            });
            const bodyB = createPhysicsBody.circle(200, 200, 20, {
                id: "bodyB",
            });

            physicsEngine.addBody(bodyA);
            physicsEngine.addBody(bodyB);

            const constraintId = interactionSystem.createSpringConstraint(
                bodyA,
                bodyB,
                undefined, // 使用默认长度
                0.5, // 刚度
                0.1, // 阻尼
            );

            expect(constraintId).toBeDefined();
            expect(typeof constraintId).toBe("string");
        });

        it("应该能够创建绳索约束的便捷方法", () => {
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA",
            });
            const bodyB = createPhysicsBody.circle(200, 200, 20, {
                id: "bodyB",
            });

            physicsEngine.addBody(bodyA);
            physicsEngine.addBody(bodyB);

            const constraintId = interactionSystem.createRopeConstraint(
                bodyA,
                bodyB,
                150, // 最大长度
                1.0, // 刚度
                0.05, // 阻尼
            );

            expect(constraintId).toBeDefined();
            expect(typeof constraintId).toBe("string");
        });
    });

    describe("碰撞响应", () => {
        it("应该能够注册碰撞响应", () => {
            const bodyId = "test-body";
            let collisionCalled = false;

            const response = {
                onCollision: () => {
                    collisionCalled = true;
                },
                playSound: false,
                createParticles: false,
                vibration: false,
            };

            interactionSystem.registerCollisionResponse(bodyId, response);

            // 模拟碰撞事件
            const mockCollisionEvent = {
                bodyA: { id: bodyId } as any,
                bodyB: { id: "other-body" } as any,
                contactPoint: { x: 100, y: 100 },
                normal: { x: 1, y: 0 },
                impulse: 0.5,
            };

            interactionSystem.handleCollision(mockCollisionEvent);

            expect(collisionCalled).toBe(true);
        });

        it("应该能够移除碰撞响应", () => {
            const bodyId = "test-body";

            const response = {
                onCollision: () => {},
                playSound: false,
                createParticles: false,
                vibration: false,
            };

            interactionSystem.registerCollisionResponse(bodyId, response);

            // 移除响应应该不会抛出错误
            expect(() => {
                interactionSystem.removeCollisionResponse(bodyId);
            }).not.toThrow();
        });
    });

    describe("更新和状态", () => {
        it("应该能够更新交互系统", () => {
            const bodies = [
                createPhysicsBody.circle(100, 100, 20, { id: "body1" }),
                createPhysicsBody.circle(200, 200, 20, { id: "body2" }),
            ];

            // 更新应该不会抛出错误
            expect(() => {
                interactionSystem.update(bodies);
            }).not.toThrow();
        });

        it("应该能够获取交互状态", () => {
            const state = interactionSystem.getInteractionState();

            expect(state).toHaveProperty("isInteracting");
            expect(state).toHaveProperty("interactionPoint");
            expect(state).toHaveProperty("draggedBody");
            expect(state).toHaveProperty("constraintCount");

            expect(typeof state.isInteracting).toBe("boolean");
            expect(typeof state.interactionPoint).toBe("object");
            expect(typeof state.constraintCount).toBe("number");
        });
    });

    describe("销毁", () => {
        it("应该能够正确销毁交互系统", () => {
            // 添加一些约束和响应
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "bodyA",
            });
            const bodyB = createPhysicsBody.circle(200, 200, 20, {
                id: "bodyB",
            });

            physicsEngine.addBody(bodyA);
            physicsEngine.addBody(bodyB);

            interactionSystem.createSpringConstraint(bodyA, bodyB);
            interactionSystem.registerCollisionResponse("bodyA", {
                onCollision: () => {},
            });

            // 销毁应该不会抛出错误
            expect(() => {
                interactionSystem.destroy();
            }).not.toThrow();

            // 销毁后状态应该被重置
            const state = interactionSystem.getInteractionState();
            expect(state.isInteracting).toBe(false);
            expect(state.constraintCount).toBe(0);
        });
    });
});
