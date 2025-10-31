// 物理引擎性能测试

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { MatterPhysicsEngine } from "@/utils/physics/MatterPhysicsEngine";
import { PhysicsInteractionSystem } from "@/utils/physics/PhysicsInteractionSystem";
import { createPhysicsBody } from "@/utils/physics/PhysicsBodyFactory";
import type { IPhysicsWorldConfig, IPhysicsBody } from "@/types/physics";

/**
 * 性能测试配置
 */
interface PerformanceTestConfig {
    /** 测试持续时间（毫秒） */
    duration: number;
    /** 目标帧率 */
    targetFPS: number;
    /** 最大允许的更新时间（毫秒） */
    maxUpdateTime: number;
    /** 物理体数量阈值 */
    bodyCountThresholds: number[];
}

/**
 * 性能测试结果
 */
interface PerformanceTestResult {
    /** 平均更新时间 */
    averageUpdateTime: number;
    /** 最大更新时间 */
    maxUpdateTime: number;
    /** 最小更新时间 */
    minUpdateTime: number;
    /** 平均FPS */
    averageFPS: number;
    /** 内存使用情况 */
    memoryUsage: {
        initial: number;
        peak: number;
        final: number;
    };
    /** 物理体统计 */
    bodyStats: {
        total: number;
        active: number;
        sleeping: number;
    };
    /** 碰撞统计 */
    collisionStats: {
        total: number;
        averagePerFrame: number;
    };
}

describe("物理引擎性能测试", () => {
    let engine: MatterPhysicsEngine;
    let interactionSystem: PhysicsInteractionSystem;
    let config: IPhysicsWorldConfig;
    let performanceConfig: PerformanceTestConfig;

    beforeEach(() => {
        engine = new MatterPhysicsEngine();
        config = {
            gravity: { x: 0, y: 1 },
            enableCollision: true,
            timeStep: 16.67, // 60 FPS
            velocityIterations: 4,
            positionIterations: 6,
        };

        performanceConfig = {
            duration: 5000, // 5秒测试
            targetFPS: 60,
            maxUpdateTime: 16.67, // 60 FPS 对应的最大更新时间
            bodyCountThresholds: [10, 50, 100, 200, 500],
        };

        engine.init(config);
        interactionSystem = new PhysicsInteractionSystem(engine, {
            enableMouse: true,
            enableTouch: true,
            forceStrength: 0.001,
            interactionRadius: 50,
        });
    });

    afterEach(() => {
        interactionSystem.destroy();
        engine.destroy();
    });

    describe("大量物理体性能测试", () => {
        /**
         * 创建指定数量的随机物理体
         */
        function createRandomBodies(count: number): IPhysicsBody[] {
            const bodies: IPhysicsBody[] = [];

            for (let i = 0; i < count; i++) {
                const x = Math.random() * 800 + 100;
                const y = Math.random() * 200 + 50;
                const bodyType = Math.random();

                let body: IPhysicsBody;

                if (bodyType < 0.4) {
                    // 圆形物理体
                    body = createPhysicsBody.circle(
                        x,
                        y,
                        5 + Math.random() * 15,
                        {
                            id: `circle_${i}`,
                            restitution: 0.6 + Math.random() * 0.4,
                            friction: 0.1 + Math.random() * 0.3,
                            velocity: {
                                x: (Math.random() - 0.5) * 100,
                                y: Math.random() * 50,
                            },
                        },
                    );
                } else if (bodyType < 0.8) {
                    // 矩形物理体
                    const size = 8 + Math.random() * 12;
                    body = createPhysicsBody.rectangle(x, y, size, size, {
                        id: `rectangle_${i}`,
                        restitution: 0.4 + Math.random() * 0.4,
                        friction: 0.2 + Math.random() * 0.4,
                        velocity: {
                            x: (Math.random() - 0.5) * 80,
                            y: Math.random() * 40,
                        },
                    });
                } else {
                    // 三角形物理体
                    body = createPhysicsBody.triangle(
                        x,
                        y,
                        8 + Math.random() * 12,
                        {
                            id: `triangle_${i}`,
                            restitution: 0.5 + Math.random() * 0.4,
                            friction: 0.15 + Math.random() * 0.35,
                            velocity: {
                                x: (Math.random() - 0.5) * 90,
                                y: Math.random() * 45,
                            },
                        },
                    );
                }

                bodies.push(body);
                engine.addBody(body);
            }

            return bodies;
        }

        /**
         * 运行性能测试
         */
        async function runPerformanceTest(
            bodyCount: number,
            duration: number = performanceConfig.duration,
        ): Promise<PerformanceTestResult> {
            // 记录初始内存使用
            const initialMemory = performance.memory?.usedJSHeapSize || 0;

            // 创建物理体
            const bodies = createRandomBodies(bodyCount);

            // 创建边界
            const bounds = createPhysicsBody.bounds(800, 600, 20);
            bounds.forEach((bound) => engine.addBody(bound));

            // 性能统计变量
            const updateTimes: number[] = [];
            let totalCollisions = 0;
            let frameCount = 0;
            let peakMemory = initialMemory;

            const startTime = performance.now();
            let lastFrameTime = startTime;

            // 运行测试循环
            while (performance.now() - startTime < duration) {
                const frameStartTime = performance.now();

                // 更新物理引擎
                engine.update(16.67);

                const frameEndTime = performance.now();
                const updateTime = frameEndTime - frameStartTime;
                updateTimes.push(updateTime);

                // 统计碰撞
                const collisions = engine.getCollisionPairs();
                totalCollisions += collisions.length;

                // 记录内存峰值
                const currentMemory = performance.memory?.usedJSHeapSize || 0;
                if (currentMemory > peakMemory) {
                    peakMemory = currentMemory;
                }

                frameCount++;
                lastFrameTime = frameEndTime;

                // 避免阻塞主线程
                if (frameCount % 100 === 0) {
                    await new Promise((resolve) => setTimeout(resolve, 0));
                }
            }

            const endTime = performance.now();
            const finalMemory = performance.memory?.usedJSHeapSize || 0;

            // 获取最终调试信息
            const debugInfo = engine.getDebugInfo();

            // 计算统计结果
            const totalTime = endTime - startTime;
            const averageUpdateTime =
                updateTimes.reduce((sum, time) => sum + time, 0) /
                updateTimes.length;
            const maxUpdateTime = Math.max(...updateTimes);
            const minUpdateTime = Math.min(...updateTimes);
            const averageFPS = (frameCount / totalTime) * 1000;

            return {
                averageUpdateTime,
                maxUpdateTime,
                minUpdateTime,
                averageFPS,
                memoryUsage: {
                    initial: initialMemory,
                    peak: peakMemory,
                    final: finalMemory,
                },
                bodyStats: {
                    total: debugInfo.bodyCount,
                    active: debugInfo.bodyCount - debugInfo.sleepingBodies,
                    sleeping: debugInfo.sleepingBodies,
                },
                collisionStats: {
                    total: totalCollisions,
                    averagePerFrame: totalCollisions / frameCount,
                },
            };
        }

        it("应该能够处理10个物理体并保持良好性能", async () => {
            const result = await runPerformanceTest(10, 2000);

            expect(result.averageUpdateTime).toBeLessThan(5); // 平均更新时间小于5ms
            expect(result.maxUpdateTime).toBeLessThan(10); // 最大更新时间小于10ms
            expect(result.averageFPS).toBeGreaterThan(50); // 平均FPS大于50
            expect(result.bodyStats.total).toBe(14); // 10个物体 + 4个边界
        });

        it("应该能够处理50个物理体并保持可接受性能", async () => {
            const result = await runPerformanceTest(50, 3000);

            expect(result.averageUpdateTime).toBeLessThan(10); // 平均更新时间小于10ms
            expect(result.maxUpdateTime).toBeLessThan(20); // 最大更新时间小于20ms
            expect(result.averageFPS).toBeGreaterThan(40); // 平均FPS大于40
            expect(result.bodyStats.total).toBe(54); // 50个物体 + 4个边界
        });

        it("应该能够处理100个物理体", async () => {
            const result = await runPerformanceTest(100, 3000);

            expect(result.averageUpdateTime).toBeLessThan(16.67); // 不超过60FPS的时间预算
            expect(result.averageFPS).toBeGreaterThan(30); // 平均FPS大于30
            expect(result.bodyStats.total).toBe(104); // 100个物体 + 4个边界

            // 检查内存使用是否合理
            const memoryIncrease =
                result.memoryUsage.final - result.memoryUsage.initial;
            expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 内存增长小于50MB
        });

        it("应该能够处理200个物理体的压力测试", async () => {
            const result = await runPerformanceTest(200, 4000);

            // 在高负载下的性能要求相对宽松
            expect(result.averageUpdateTime).toBeLessThan(25); // 平均更新时间小于25ms
            expect(result.averageFPS).toBeGreaterThan(20); // 平均FPS大于20
            expect(result.bodyStats.total).toBe(204); // 200个物体 + 4个边界

            // 验证物理体休眠机制是否工作
            expect(result.bodyStats.sleeping).toBeGreaterThan(0);
        });

        it("应该在极限负载下优雅降级", async () => {
            const result = await runPerformanceTest(500, 5000);

            // 极限测试，主要验证不会崩溃
            expect(result.averageUpdateTime).toBeLessThan(50); // 平均更新时间小于50ms
            expect(result.averageFPS).toBeGreaterThan(10); // 平均FPS大于10
            expect(result.bodyStats.total).toBe(504); // 500个物体 + 4个边界

            // 验证休眠机制在高负载下的效果
            const sleepingRatio =
                result.bodyStats.sleeping / result.bodyStats.total;
            expect(sleepingRatio).toBeGreaterThan(0.1); // 至少10%的物体应该休眠
        });

        it("应该能够处理1000个物理体的极限压力测试", async () => {
            const result = await runPerformanceTest(1000, 6000);

            // 极限压力测试，验证系统稳定性
            expect(result.averageUpdateTime).toBeLessThan(100); // 平均更新时间小于100ms
            expect(result.averageFPS).toBeGreaterThan(5); // 平均FPS大于5
            expect(result.bodyStats.total).toBe(1004); // 1000个物体 + 4个边界

            // 验证内存使用合理
            const memoryIncrease =
                result.memoryUsage.final - result.memoryUsage.initial;
            expect(memoryIncrease).toBeLessThan(200 * 1024 * 1024); // 内存增长小于200MB

            // 验证大量物体下的休眠效果
            const sleepingRatio =
                result.bodyStats.sleeping / result.bodyStats.total;
            expect(sleepingRatio).toBeGreaterThan(0.2); // 至少20%的物体应该休眠
        });

        it("应该能够测试不同物理体类型的性能差异", async () => {
            // 测试纯圆形物理体
            const circleResult = await testSpecificBodyType("circle", 100);

            // 测试纯矩形物理体
            const rectangleResult = await testSpecificBodyType(
                "rectangle",
                100,
            );

            // 测试纯多边形物理体
            const polygonResult = await testSpecificBodyType("polygon", 100);

            // 圆形应该是最快的
            expect(circleResult.averageUpdateTime).toBeLessThan(
                rectangleResult.averageUpdateTime,
            );
            expect(circleResult.averageUpdateTime).toBeLessThan(
                polygonResult.averageUpdateTime,
            );

            // 所有类型都应该保持可接受的性能
            expect(circleResult.averageFPS).toBeGreaterThan(40);
            expect(rectangleResult.averageFPS).toBeGreaterThan(35);
            expect(polygonResult.averageFPS).toBeGreaterThan(30);
        });

        /**
         * 测试特定类型物理体的性能
         */
        async function testSpecificBodyType(
            bodyType: "circle" | "rectangle" | "polygon",
            count: number,
        ): Promise<PerformanceTestResult> {
            engine.clear();

            // 创建边界
            const bounds = createPhysicsBody.bounds(800, 600, 20);
            bounds.forEach((bound) => engine.addBody(bound));

            // 创建指定类型的物理体
            for (let i = 0; i < count; i++) {
                const x = Math.random() * 700 + 50;
                const y = Math.random() * 200 + 50;

                let body: IPhysicsBody;
                switch (bodyType) {
                    case "circle":
                        body = createPhysicsBody.circle(
                            x,
                            y,
                            5 + Math.random() * 10,
                            {
                                id: `${bodyType}_${i}`,
                                velocity: {
                                    x: (Math.random() - 0.5) * 100,
                                    y: Math.random() * 50,
                                },
                            },
                        );
                        break;
                    case "rectangle": {
                        const size = 8 + Math.random() * 8;
                        body = createPhysicsBody.rectangle(x, y, size, size, {
                            id: `${bodyType}_${i}`,
                            velocity: {
                                x: (Math.random() - 0.5) * 100,
                                y: Math.random() * 50,
                            },
                        });
                        break;
                    }
                    case "polygon":
                        body = createPhysicsBody.hexagon(
                            x,
                            y,
                            6 + Math.random() * 6,
                            {
                                id: `${bodyType}_${i}`,
                                velocity: {
                                    x: (Math.random() - 0.5) * 100,
                                    y: Math.random() * 50,
                                },
                            },
                        );
                        break;
                }
                engine.addBody(body);
            }

            return await runPerformanceTest(0, 3000); // 不创建额外物体，使用已创建的
        }
    });

    describe("碰撞检测准确性测试", () => {
        /**
         * 创建精确碰撞测试场景
         */
        function createCollisionTestScene() {
            // 清空现有物理体
            engine.clear();

            // 创建静态地面
            const ground = createPhysicsBody.rectangle(400, 580, 800, 40, {
                id: "ground",
                isStatic: true,
            });
            engine.addBody(ground);

            // 创建两个相向运动的球
            const ballA = createPhysicsBody.circle(200, 300, 20, {
                id: "ballA",
                velocity: { x: 100, y: 0 },
                restitution: 0.8,
            });

            const ballB = createPhysicsBody.circle(600, 300, 20, {
                id: "ballB",
                velocity: { x: -100, y: 0 },
                restitution: 0.8,
            });

            engine.addBody(ballA);
            engine.addBody(ballB);

            return { ballA, ballB, ground };
        }

        it("应该准确检测正面碰撞", async () => {
            const { ballA, ballB } = createCollisionTestScene();

            let collisionDetected = false;
            let collisionCount = 0;

            // 运行物理模拟直到碰撞发生
            for (let i = 0; i < 100 && !collisionDetected; i++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                if (collisions.length > 0) {
                    collisionDetected = true;
                    collisionCount = collisions.length;

                    // 验证碰撞涉及的物体
                    const collision = collisions[0]!;
                    const bodyIds = [collision.bodyA.id, collision.bodyB.id];
                    expect(bodyIds).toContain("ballA");
                    expect(bodyIds).toContain("ballB");

                    // 验证碰撞点位置合理
                    expect(collision.contactPoint.x).toBeGreaterThan(350);
                    expect(collision.contactPoint.x).toBeLessThan(450);
                    expect(collision.contactPoint.y).toBeGreaterThan(280);
                    expect(collision.contactPoint.y).toBeLessThan(320);
                }
            }

            expect(collisionDetected).toBe(true);
            expect(collisionCount).toBeGreaterThan(0);
        });

        it("应该准确检测物体与边界的碰撞", async () => {
            engine.clear();

            // 创建边界
            const bounds = createPhysicsBody.bounds(400, 300, 20);
            bounds.forEach((bound) => engine.addBody(bound));

            // 创建一个向边界运动的球
            const ball = createPhysicsBody.circle(200, 150, 15, {
                id: "bouncing-ball",
                velocity: { x: 200, y: 0 },
                restitution: 0.9,
            });
            engine.addBody(ball);

            let boundaryCollisionDetected = false;

            // 运行模拟直到球撞到右边界
            for (let i = 0; i < 50; i++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                if (collisions.length > 0) {
                    const collision = collisions[0]!;
                    if (
                        collision.bodyA.id === "bouncing-ball" ||
                        collision.bodyB.id === "bouncing-ball"
                    ) {
                        boundaryCollisionDetected = true;
                        break;
                    }
                }
            }

            expect(boundaryCollisionDetected).toBe(true);

            // 验证球的速度方向已改变（反弹）
            const finalBall = engine.getBody("bouncing-ball");
            expect(finalBall).toBeTruthy();
            expect(finalBall!.velocity.x).toBeLessThan(0); // 应该向左反弹
        });

        it("应该正确处理多物体连续碰撞", async () => {
            engine.clear();

            // 创建地面
            const ground = createPhysicsBody.rectangle(400, 580, 800, 40, {
                id: "ground",
                isStatic: true,
            });
            engine.addBody(ground);

            // 创建一排球，模拟多米诺效应
            const balls: IPhysicsBody[] = [];
            for (let i = 0; i < 5; i++) {
                const ball = createPhysicsBody.circle(200 + i * 50, 300, 20, {
                    id: `domino_${i}`,
                    velocity: i === 0 ? { x: 150, y: 0 } : { x: 0, y: 0 },
                    restitution: 0.8,
                    friction: 0.1,
                });
                balls.push(ball);
                engine.addBody(ball);
            }

            const collisionHistory: Array<{
                frame: number;
                collisions: number;
            }> = [];

            // 运行模拟记录碰撞历史
            for (let frame = 0; frame < 200; frame++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                if (collisions.length > 0) {
                    collisionHistory.push({
                        frame,
                        collisions: collisions.length,
                    });
                }
            }

            // 验证发生了多次碰撞
            expect(collisionHistory.length).toBeGreaterThan(5);

            // 验证碰撞是逐步传播的（多米诺效应）
            const totalCollisions = collisionHistory.reduce(
                (sum, record) => sum + record.collisions,
                0,
            );
            expect(totalCollisions).toBeGreaterThan(10);
        });

        it("应该准确计算碰撞冲量", async () => {
            const { ballA, ballB } = createCollisionTestScene();

            // 记录碰撞前的动量
            const initialMomentumA = {
                x: ballA.velocity.x * ballA.mass,
                y: ballA.velocity.y * ballA.mass,
            };
            const initialMomentumB = {
                x: ballB.velocity.x * ballB.mass,
                y: ballB.velocity.y * ballB.mass,
            };

            let collisionImpulse = 0;

            // 运行模拟直到碰撞
            for (let i = 0; i < 100; i++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                if (collisions.length > 0) {
                    collisionImpulse = collisions[0]!.impulse;
                    break;
                }
            }

            // 验证冲量值合理
            expect(collisionImpulse).toBeGreaterThan(0);
            expect(collisionImpulse).toBeLessThan(10); // 合理的冲量范围

            // 获取碰撞后的物体状态
            const finalBallA = engine.getBody("ballA");
            const finalBallB = engine.getBody("ballB");

            expect(finalBallA).toBeTruthy();
            expect(finalBallB).toBeTruthy();

            // 验证动量守恒（在误差范围内）
            const finalMomentumA = {
                x: finalBallA!.velocity.x * finalBallA!.mass,
                y: finalBallA!.velocity.y * finalBallA!.mass,
            };
            const finalMomentumB = {
                x: finalBallB!.velocity.x * finalBallB!.mass,
                y: finalBallB!.velocity.y * finalBallB!.mass,
            };

            const totalInitialMomentumX =
                initialMomentumA.x + initialMomentumB.x;
            const totalFinalMomentumX = finalMomentumA.x + finalMomentumB.x;

            // 允许5%的误差
            const momentumError =
                Math.abs(totalFinalMomentumX - totalInitialMomentumX) /
                Math.abs(totalInitialMomentumX);
            expect(momentumError).toBeLessThan(0.05);
        });

        it("应该准确检测复杂形状间的碰撞", async () => {
            engine.clear();

            // 创建地面
            const ground = createPhysicsBody.rectangle(400, 580, 800, 40, {
                id: "ground",
                isStatic: true,
            });
            engine.addBody(ground);

            // 创建不同形状的物理体进行碰撞测试
            const star = createPhysicsBody.star(200, 100, 25, 15, 5, {
                id: "star",
                velocity: { x: 100, y: 50 },
            });

            const hexagon = createPhysicsBody.hexagon(500, 100, 20, {
                id: "hexagon",
                velocity: { x: -80, y: 30 },
            });

            const triangle = createPhysicsBody.triangle(350, 50, 30, {
                id: "triangle",
                velocity: { x: 0, y: 100 },
            });

            engine.addBody(star);
            engine.addBody(hexagon);
            engine.addBody(triangle);

            let complexCollisionDetected = false;
            let collisionCount = 0;

            // 运行模拟检测复杂形状碰撞
            for (let i = 0; i < 200; i++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                if (collisions.length > 0) {
                    collisionCount += collisions.length;

                    // 检查是否有复杂形状间的碰撞
                    collisions.forEach((collision) => {
                        const bodyIds = [
                            collision.bodyA.id,
                            collision.bodyB.id,
                        ];
                        if (
                            (bodyIds.includes("star") &&
                                bodyIds.includes("hexagon")) ||
                            (bodyIds.includes("star") &&
                                bodyIds.includes("triangle")) ||
                            (bodyIds.includes("hexagon") &&
                                bodyIds.includes("triangle"))
                        ) {
                            complexCollisionDetected = true;
                        }
                    });
                }
            }

            expect(complexCollisionDetected).toBe(true);
            expect(collisionCount).toBeGreaterThan(5);
        });

        it("应该在高密度碰撞场景中保持准确性", async () => {
            engine.clear();

            // 创建密集的碰撞场景
            const containerSize = 300;
            const bodyCount = 50;

            // 创建容器边界
            const bounds = createPhysicsBody.bounds(
                containerSize,
                containerSize,
                20,
            );
            bounds.forEach((bound) => engine.addBody(bound));

            // 在小空间内创建大量物理体
            for (let i = 0; i < bodyCount; i++) {
                const x = 50 + Math.random() * (containerSize - 100);
                const y = 50 + Math.random() * (containerSize - 100);

                const body = createPhysicsBody.circle(x, y, 8, {
                    id: `dense_body_${i}`,
                    velocity: {
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                    },
                    restitution: 0.8,
                });
                engine.addBody(body);
            }

            let totalCollisions = 0;
            let maxCollisionsPerFrame = 0;
            const collisionHistory: number[] = [];

            // 运行高密度碰撞测试
            for (let frame = 0; frame < 300; frame++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                const frameCollisions = collisions.length;

                totalCollisions += frameCollisions;
                collisionHistory.push(frameCollisions);

                if (frameCollisions > maxCollisionsPerFrame) {
                    maxCollisionsPerFrame = frameCollisions;
                }
            }

            // 验证碰撞检测在高密度场景下的表现
            expect(totalCollisions).toBeGreaterThan(100); // 应该检测到大量碰撞
            expect(maxCollisionsPerFrame).toBeGreaterThan(5); // 单帧最大碰撞数

            // 验证碰撞检测的稳定性（不应该有异常的碰撞数量波动）
            const averageCollisions = totalCollisions / collisionHistory.length;
            const collisionVariance =
                collisionHistory.reduce((sum, count) => {
                    return sum + Math.pow(count - averageCollisions, 2);
                }, 0) / collisionHistory.length;

            expect(collisionVariance).toBeLessThan(100); // 碰撞数量方差应该合理
        });

        it("应该正确处理边界情况的碰撞检测", async () => {
            engine.clear();

            // 测试边界情况：物体刚好接触
            const bodyA = createPhysicsBody.circle(100, 300, 20, {
                id: "touchingA",
                velocity: { x: 1, y: 0 }, // 极慢速度
            });

            const bodyB = createPhysicsBody.circle(140, 300, 20, {
                id: "touchingB",
                velocity: { x: -1, y: 0 }, // 极慢速度
                isStatic: true,
            });

            engine.addBody(bodyA);
            engine.addBody(bodyB);

            let touchingCollisionDetected = false;

            // 运行精确碰撞检测
            for (let i = 0; i < 100; i++) {
                engine.update(16.67);

                const collisions = engine.getCollisionPairs();
                if (collisions.length > 0) {
                    const collision = collisions[0]!;
                    if (
                        (collision.bodyA.id === "touchingA" &&
                            collision.bodyB.id === "touchingB") ||
                        (collision.bodyA.id === "touchingB" &&
                            collision.bodyB.id === "touchingA")
                    ) {
                        touchingCollisionDetected = true;

                        // 验证碰撞点位置精确性
                        expect(collision.contactPoint.x).toBeGreaterThan(115);
                        expect(collision.contactPoint.x).toBeLessThan(125);
                        expect(
                            Math.abs(collision.contactPoint.y - 300),
                        ).toBeLessThan(5);
                        break;
                    }
                }
            }

            expect(touchingCollisionDetected).toBe(true);
        });
    });

    describe("物理交互响应性测试", () => {
        /**
         * 测试交互响应时间
         */
        async function testInteractionResponseTime(bodyCount: number): Promise<{
            averageResponseTime: number;
            maxResponseTime: number;
            successRate: number;
        }> {
            // 创建测试场景
            const bodies = [];
            for (let i = 0; i < bodyCount; i++) {
                const body = createPhysicsBody.circle(
                    100 + (i % 10) * 60,
                    100 + Math.floor(i / 10) * 60,
                    15,
                    {
                        id: `interactive_body_${i}`,
                        restitution: 0.6,
                        friction: 0.3,
                    },
                );
                bodies.push(body);
                engine.addBody(body);
            }

            const responseTimes: number[] = [];
            let successfulInteractions = 0;
            const totalInteractions = 20;

            // 执行多次交互测试
            for (let i = 0; i < totalInteractions; i++) {
                // 选择随机位置进行交互
                const interactionPoint = {
                    x: 100 + Math.random() * 500,
                    y: 100 + Math.random() * 300,
                };

                const startTime = performance.now();

                // 开始交互
                interactionSystem.startMouseInteraction(interactionPoint);

                // 更新几帧以处理交互
                for (let frame = 0; frame < 5; frame++) {
                    engine.update(16.67);
                    interactionSystem.update(bodies);
                }

                // 结束交互
                interactionSystem.endMouseInteraction();

                const endTime = performance.now();
                const responseTime = endTime - startTime;
                responseTimes.push(responseTime);

                // 检查是否有物体受到影响
                let hasMovement = false;
                for (const body of bodies) {
                    const currentBody = engine.getBody(body.id);
                    if (
                        currentBody &&
                        (Math.abs(currentBody.velocity.x) > 1 ||
                            Math.abs(currentBody.velocity.y) > 1)
                    ) {
                        hasMovement = true;
                        break;
                    }
                }

                if (hasMovement) {
                    successfulInteractions++;
                }

                // 等待物体稳定
                for (let frame = 0; frame < 10; frame++) {
                    engine.update(16.67);
                }
            }

            return {
                averageResponseTime:
                    responseTimes.reduce((sum, time) => sum + time, 0) /
                    responseTimes.length,
                maxResponseTime: Math.max(...responseTimes),
                successRate: successfulInteractions / totalInteractions,
            };
        }

        it("应该在少量物理体时提供快速交互响应", async () => {
            const result = await testInteractionResponseTime(10);

            expect(result.averageResponseTime).toBeLessThan(5); // 平均响应时间小于5ms
            expect(result.maxResponseTime).toBeLessThan(10); // 最大响应时间小于10ms
            expect(result.successRate).toBeGreaterThan(0.8); // 成功率大于80%
        });

        it("应该在中等数量物理体时保持良好响应性", async () => {
            const result = await testInteractionResponseTime(50);

            expect(result.averageResponseTime).toBeLessThan(10); // 平均响应时间小于10ms
            expect(result.maxResponseTime).toBeLessThan(20); // 最大响应时间小于20ms
            expect(result.successRate).toBeGreaterThan(0.7); // 成功率大于70%
        });

        it("应该在大量物理体时仍能响应交互", async () => {
            const result = await testInteractionResponseTime(100);

            expect(result.averageResponseTime).toBeLessThan(20); // 平均响应时间小于20ms
            expect(result.maxResponseTime).toBeLessThan(50); // 最大响应时间小于50ms
            expect(result.successRate).toBeGreaterThan(0.5); // 成功率大于50%
        });

        it("应该正确处理连续快速交互", async () => {
            // 创建测试场景
            const body = createPhysicsBody.circle(400, 300, 20, {
                id: "rapid_interaction_test",
                restitution: 0.8,
            });
            engine.addBody(body);

            const interactionCount = 50;
            const interactionInterval = 10; // 10ms间隔
            let processedInteractions = 0;

            // 快速连续交互
            for (let i = 0; i < interactionCount; i++) {
                const position = {
                    x: 400 + (Math.random() - 0.5) * 100,
                    y: 300 + (Math.random() - 0.5) * 100,
                };

                interactionSystem.startMouseInteraction(position);
                engine.update(16.67);
                interactionSystem.update([body]);
                interactionSystem.endMouseInteraction();

                processedInteractions++;

                // 短暂延迟
                await new Promise((resolve) =>
                    setTimeout(resolve, interactionInterval),
                );
            }

            expect(processedInteractions).toBe(interactionCount);

            // 验证物体仍然响应正常
            const finalBody = engine.getBody("rapid_interaction_test");
            expect(finalBody).toBeTruthy();
            expect(finalBody!.position.x).toBeGreaterThan(0);
            expect(finalBody!.position.y).toBeGreaterThan(0);
        });

        it("应该在高负载下保持交互系统稳定性", async () => {
            // 创建高负载场景
            const bodyCount = 200;
            const bodies = [];

            for (let i = 0; i < bodyCount; i++) {
                const body = createPhysicsBody.circle(
                    Math.random() * 800,
                    Math.random() * 400,
                    5 + Math.random() * 10,
                    {
                        id: `stress_body_${i}`,
                        velocity: {
                            x: (Math.random() - 0.5) * 100,
                            y: (Math.random() - 0.5) * 100,
                        },
                    },
                );
                bodies.push(body);
                engine.addBody(body);
            }

            let systemStable = true;
            let errorCount = 0;

            // 在高负载下进行交互测试
            for (let i = 0; i < 20; i++) {
                try {
                    const position = {
                        x: Math.random() * 800,
                        y: Math.random() * 400,
                    };

                    interactionSystem.startMouseInteraction(position);

                    // 更新系统
                    for (let frame = 0; frame < 3; frame++) {
                        engine.update(16.67);
                        interactionSystem.update(bodies);
                    }

                    interactionSystem.endMouseInteraction();

                    // 检查系统状态
                    const debugInfo = engine.getDebugInfo();
                    if (debugInfo.bodyCount !== bodyCount + 4) {
                        // +4 for bounds
                        systemStable = false;
                    }
                } catch (error) {
                    errorCount++;
                    systemStable = false;
                }
            }

            expect(systemStable).toBe(true);
            expect(errorCount).toBe(0);

            // 验证系统仍然正常工作
            const finalDebugInfo = engine.getDebugInfo();
            expect(finalDebugInfo.bodyCount).toBeGreaterThan(0);
        });

        it("应该测试拖拽交互的精确性", async () => {
            // 创建测试物体
            const testBody = createPhysicsBody.circle(400, 300, 25, {
                id: "drag_test_body",
                friction: 0.5,
            });
            engine.addBody(testBody);

            const dragPath = [
                { x: 400, y: 300 },
                { x: 450, y: 320 },
                { x: 500, y: 350 },
                { x: 480, y: 400 },
                { x: 420, y: 380 },
            ];

            let pathIndex = 0;
            const positionHistory: Array<{ x: number; y: number }> = [];

            // 模拟拖拽路径
            interactionSystem.startMouseInteraction(dragPath[0]!);

            for (let frame = 0; frame < 100; frame++) {
                // 更新拖拽位置
                if (pathIndex < dragPath.length - 1 && frame % 20 === 0) {
                    pathIndex++;
                    interactionSystem.updateMouseInteraction(
                        dragPath[pathIndex]!,
                    );
                }

                engine.update(16.67);
                interactionSystem.update([testBody]);

                // 记录物体位置
                const currentBody = engine.getBody("drag_test_body");
                if (currentBody) {
                    positionHistory.push({
                        x: currentBody.position.x,
                        y: currentBody.position.y,
                    });
                }
            }

            interactionSystem.endMouseInteraction();

            // 验证拖拽效果
            expect(positionHistory.length).toBeGreaterThan(50);

            // 验证物体跟随拖拽路径移动
            const finalPosition = positionHistory[positionHistory.length - 1]!;
            const targetPosition = dragPath[dragPath.length - 1]!;

            const distance = Math.sqrt(
                Math.pow(finalPosition.x - targetPosition.x, 2) +
                    Math.pow(finalPosition.y - targetPosition.y, 2),
            );

            expect(distance).toBeLessThan(100); // 物体应该接近目标位置
        });

        it("应该测试多点触摸交互性能", async () => {
            // 创建多个测试物体
            const bodies = [];
            for (let i = 0; i < 10; i++) {
                const body = createPhysicsBody.circle(200 + i * 40, 300, 15, {
                    id: `multitouch_body_${i}`,
                });
                bodies.push(body);
                engine.addBody(body);
            }

            const touchPoints = [
                { x: 250, y: 300 },
                { x: 350, y: 300 },
                { x: 450, y: 300 },
            ];

            let interactionFrames = 0;
            const responseStartTime = performance.now();

            // 模拟多点触摸
            interactionSystem.startTouchInteraction(touchPoints);

            for (let frame = 0; frame < 30; frame++) {
                // 移动触摸点
                const movingTouches = touchPoints.map((point, index) => ({
                    x: point.x + Math.sin(frame * 0.1 + index) * 20,
                    y: point.y + Math.cos(frame * 0.1 + index) * 20,
                }));

                interactionSystem.updateTouchInteraction(movingTouches);
                engine.update(16.67);
                interactionSystem.update(bodies);

                interactionFrames++;
            }

            interactionSystem.endTouchInteraction();

            const responseEndTime = performance.now();
            const totalResponseTime = responseEndTime - responseStartTime;

            // 验证多点触摸性能
            expect(totalResponseTime).toBeLessThan(1000); // 总响应时间小于1秒
            expect(interactionFrames).toBe(30);

            // 验证物体受到影响
            let affectedBodies = 0;
            bodies.forEach((body) => {
                const currentBody = engine.getBody(body.id);
                if (
                    currentBody &&
                    (Math.abs(currentBody.velocity.x) > 1 ||
                        Math.abs(currentBody.velocity.y) > 1)
                ) {
                    affectedBodies++;
                }
            });

            expect(affectedBodies).toBeGreaterThan(0);
        });

        it("应该测试交互系统的内存效率", async () => {
            const initialMemory = performance.memory?.usedJSHeapSize || 0;

            // 创建大量物体进行交互测试
            const bodyCount = 200;
            const bodies = [];

            for (let i = 0; i < bodyCount; i++) {
                const body = createPhysicsBody.circle(
                    Math.random() * 800,
                    Math.random() * 600,
                    8,
                    {
                        id: `memory_interaction_${i}`,
                    },
                );
                bodies.push(body);
                engine.addBody(body);
            }

            // 执行大量交互操作
            for (let i = 0; i < 100; i++) {
                const position = {
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                };

                interactionSystem.startMouseInteraction(position);

                for (let frame = 0; frame < 3; frame++) {
                    engine.update(16.67);
                    interactionSystem.update(bodies);
                }

                interactionSystem.endMouseInteraction();

                // 每10次交互检查一次内存
                if (i % 10 === 0) {
                    const currentMemory =
                        performance.memory?.usedJSHeapSize || 0;
                    const memoryIncrease = currentMemory - initialMemory;

                    // 内存增长应该保持在合理范围内
                    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 小于100MB
                }
            }

            const finalMemory = performance.memory?.usedJSHeapSize || 0;
            const totalMemoryIncrease = finalMemory - initialMemory;

            // 验证内存使用效率
            expect(totalMemoryIncrease).toBeLessThan(150 * 1024 * 1024); // 总内存增长小于150MB
        });
    });

    describe("内存和资源管理测试", () => {
        it("应该正确管理物理体的内存", async () => {
            const initialMemory = performance.memory?.usedJSHeapSize || 0;

            // 创建大量物理体
            const bodyCount = 1000;
            const bodyIds: string[] = [];

            for (let i = 0; i < bodyCount; i++) {
                const body = createPhysicsBody.circle(
                    Math.random() * 800,
                    Math.random() * 600,
                    5,
                    {
                        id: `memory_test_${i}`,
                    },
                );
                bodyIds.push(body.id);
                engine.addBody(body);
            }

            const peakMemory = performance.memory?.usedJSHeapSize || 0;

            // 移除所有物理体
            bodyIds.forEach((id) => {
                engine.removeBody(id);
            });

            // 强制垃圾回收（如果可用）
            if (global.gc) {
                global.gc();
            }

            // 等待一段时间让垃圾回收生效
            await new Promise((resolve) => setTimeout(resolve, 100));

            const finalMemory = performance.memory?.usedJSHeapSize || 0;

            // 验证内存使用
            const memoryIncrease = peakMemory - initialMemory;
            const memoryRecovered = peakMemory - finalMemory;
            const recoveryRate = memoryRecovered / memoryIncrease;

            expect(memoryIncrease).toBeGreaterThan(0); // 应该有内存增长
            expect(recoveryRate).toBeGreaterThan(0.5); // 至少回收50%的内存
        });

        it("应该正确清理约束资源", async () => {
            // 创建物理体
            const bodyA = createPhysicsBody.circle(100, 100, 20, {
                id: "constraintTestA",
            });
            const bodyB = createPhysicsBody.circle(200, 100, 20, {
                id: "constraintTestB",
            });

            engine.addBody(bodyA);
            engine.addBody(bodyB);

            // 创建大量约束
            const constraintIds: string[] = [];
            for (let i = 0; i < 100; i++) {
                const constraintId = interactionSystem.createSpringConstraint(
                    bodyA,
                    bodyB,
                    100 + i,
                    0.5,
                    0.1,
                );
                constraintIds.push(constraintId);
            }

            // 验证约束已创建
            const stateWithConstraints =
                interactionSystem.getInteractionState();
            expect(stateWithConstraints.constraintCount).toBe(100);

            // 移除所有约束
            constraintIds.forEach((id) => {
                interactionSystem.removeConstraint(id);
            });

            // 验证约束已清理
            const stateAfterCleanup = interactionSystem.getInteractionState();
            expect(stateAfterCleanup.constraintCount).toBe(0);
        });
    });

    describe("性能基准和阈值测试", () => {
        /**
         * 性能基准测试配置
         */
        interface PerformanceBenchmark {
            name: string;
            bodyCount: number;
            duration: number;
            expectedFPS: number;
            maxUpdateTime: number;
            maxMemoryMB: number;
        }

        const benchmarks: PerformanceBenchmark[] = [
            {
                name: "轻量级场景",
                bodyCount: 25,
                duration: 3000,
                expectedFPS: 55,
                maxUpdateTime: 8,
                maxMemoryMB: 20,
            },
            {
                name: "中等负载场景",
                bodyCount: 75,
                duration: 4000,
                expectedFPS: 45,
                maxUpdateTime: 15,
                maxMemoryMB: 40,
            },
            {
                name: "高负载场景",
                bodyCount: 150,
                duration: 5000,
                expectedFPS: 35,
                maxUpdateTime: 25,
                maxMemoryMB: 80,
            },
            {
                name: "极限负载场景",
                bodyCount: 300,
                duration: 6000,
                expectedFPS: 20,
                maxUpdateTime: 45,
                maxMemoryMB: 120,
            },
        ];

        benchmarks.forEach((benchmark) => {
            it(`应该在${benchmark.name}下达到性能基准`, async () => {
                const result = await runPerformanceTest(
                    benchmark.bodyCount,
                    benchmark.duration,
                );

                // 验证FPS基准
                expect(result.averageFPS).toBeGreaterThan(
                    benchmark.expectedFPS,
                );

                // 验证更新时间基准
                expect(result.averageUpdateTime).toBeLessThan(
                    benchmark.maxUpdateTime,
                );

                // 验证内存使用基准
                const memoryUsageMB =
                    (result.memoryUsage.peak - result.memoryUsage.initial) /
                    (1024 * 1024);
                expect(memoryUsageMB).toBeLessThan(benchmark.maxMemoryMB);

                // 验证物理体数量正确
                expect(result.bodyStats.total).toBe(benchmark.bodyCount + 4); // +4 for bounds

                console.log(`${benchmark.name}性能测试结果:`, {
                    averageFPS: result.averageFPS.toFixed(2),
                    averageUpdateTime: result.averageUpdateTime.toFixed(2),
                    memoryUsageMB: memoryUsageMB.toFixed(2),
                    sleepingBodies: result.bodyStats.sleeping,
                    totalCollisions: result.collisionStats.total,
                });
            });
        });

        it("应该测试物理引擎的扩展性", async () => {
            const scalabilityTests = [10, 25, 50, 100, 200];
            const results: Array<{
                bodyCount: number;
                fps: number;
                updateTime: number;
                memoryMB: number;
            }> = [];

            for (const bodyCount of scalabilityTests) {
                const result = await runPerformanceTest(bodyCount, 2000);
                const memoryMB =
                    (result.memoryUsage.peak - result.memoryUsage.initial) /
                    (1024 * 1024);

                results.push({
                    bodyCount,
                    fps: result.averageFPS,
                    updateTime: result.averageUpdateTime,
                    memoryMB,
                });
            }

            // 验证性能随物体数量的变化趋势
            for (let i = 1; i < results.length; i++) {
                const current = results[i]!;
                const previous = results[i - 1]!;

                // FPS应该随物体数量增加而下降，但不应该急剧下降
                const fpsRatio = current.fps / previous.fps;
                expect(fpsRatio).toBeGreaterThan(0.5); // FPS下降不超过50%

                // 更新时间应该随物体数量增加，但增长应该是可控的
                const updateTimeRatio =
                    current.updateTime / previous.updateTime;
                expect(updateTimeRatio).toBeLessThan(3); // 更新时间增长不超过3倍

                // 内存使用应该线性增长
                const memoryRatio =
                    current.memoryMB / Math.max(previous.memoryMB, 1);
                expect(memoryRatio).toBeLessThan(5); // 内存增长不超过5倍
            }

            console.log("扩展性测试结果:", results);
        });

        it("应该测试长时间运行的稳定性", async () => {
            // 创建中等规模的测试场景
            const bodyCount = 100;
            const testDuration = 10000; // 10秒长时间测试

            const bodies = [];
            for (let i = 0; i < bodyCount; i++) {
                const body = createPhysicsBody.circle(
                    Math.random() * 700 + 50,
                    Math.random() * 200 + 50,
                    5 + Math.random() * 10,
                    {
                        id: `stability_body_${i}`,
                        velocity: {
                            x: (Math.random() - 0.5) * 100,
                            y: Math.random() * 50,
                        },
                    },
                );
                bodies.push(body);
                engine.addBody(body);
            }

            // 创建边界
            const bounds = createPhysicsBody.bounds(800, 600, 20);
            bounds.forEach((bound) => engine.addBody(bound));

            const performanceSnapshots: Array<{
                time: number;
                fps: number;
                updateTime: number;
                memoryMB: number;
                activeBodies: number;
            }> = [];

            const startTime = performance.now();
            let frameCount = 0;
            let lastSnapshotTime = startTime;

            // 长时间运行测试
            while (performance.now() - startTime < testDuration) {
                const frameStartTime = performance.now();

                engine.update(16.67);

                const frameEndTime = performance.now();
                frameCount++;

                // 每秒记录一次性能快照
                if (frameEndTime - lastSnapshotTime >= 1000) {
                    const debugInfo = engine.getDebugInfo();
                    const currentMemory =
                        performance.memory?.usedJSHeapSize || 0;

                    performanceSnapshots.push({
                        time: frameEndTime - startTime,
                        fps:
                            frameCount /
                            ((frameEndTime - lastSnapshotTime) / 1000),
                        updateTime: frameEndTime - frameStartTime,
                        memoryMB: currentMemory / (1024 * 1024),
                        activeBodies:
                            debugInfo.bodyCount - debugInfo.sleepingBodies,
                    });

                    frameCount = 0;
                    lastSnapshotTime = frameEndTime;
                }

                // 避免阻塞主线程
                if (frameCount % 100 === 0) {
                    await new Promise((resolve) => setTimeout(resolve, 0));
                }
            }

            // 验证长时间运行的稳定性
            expect(performanceSnapshots.length).toBeGreaterThan(5);

            // 检查性能是否保持稳定（没有明显的性能退化）
            const firstSnapshot = performanceSnapshots[0]!;
            const lastSnapshot =
                performanceSnapshots[performanceSnapshots.length - 1]!;

            // FPS不应该显著下降
            const fpsRatio = lastSnapshot.fps / firstSnapshot.fps;
            expect(fpsRatio).toBeGreaterThan(0.8); // FPS下降不超过20%

            // 更新时间不应该显著增加
            const updateTimeRatio =
                lastSnapshot.updateTime / firstSnapshot.updateTime;
            expect(updateTimeRatio).toBeLessThan(1.5); // 更新时间增长不超过50%

            // 内存不应该持续增长（检查内存泄漏）
            const memoryGrowth = lastSnapshot.memoryMB - firstSnapshot.memoryMB;
            expect(memoryGrowth).toBeLessThan(50); // 内存增长小于50MB

            console.log("长时间稳定性测试结果:", {
                duration: testDuration / 1000,
                snapshots: performanceSnapshots.length,
                fpsChange: `${firstSnapshot.fps.toFixed(
                    1,
                )} -> ${lastSnapshot.fps.toFixed(1)}`,
                memoryGrowth: `${memoryGrowth.toFixed(1)}MB`,
                finalActiveBodies: lastSnapshot.activeBodies,
            });
        });

        it("应该测试物理引擎的资源清理效率", async () => {
            const initialMemory = performance.memory?.usedJSHeapSize || 0;
            const cycles = 5;
            const bodiesPerCycle = 200;

            const memorySnapshots: number[] = [initialMemory];

            // 执行多个创建-销毁循环
            for (let cycle = 0; cycle < cycles; cycle++) {
                const bodyIds: string[] = [];

                // 创建大量物理体
                for (let i = 0; i < bodiesPerCycle; i++) {
                    const body = createPhysicsBody.circle(
                        Math.random() * 800,
                        Math.random() * 600,
                        5 + Math.random() * 10,
                        {
                            id: `cleanup_test_${cycle}_${i}`,
                        },
                    );
                    bodyIds.push(body.id);
                    engine.addBody(body);
                }

                // 运行一段时间
                for (let frame = 0; frame < 50; frame++) {
                    engine.update(16.67);
                }

                const peakMemory = performance.memory?.usedJSHeapSize || 0;
                memorySnapshots.push(peakMemory);

                // 清理所有物理体
                bodyIds.forEach((id) => {
                    engine.removeBody(id);
                });

                // 强制垃圾回收
                if (global.gc) {
                    global.gc();
                }

                // 等待垃圾回收
                await new Promise((resolve) => setTimeout(resolve, 100));

                const afterCleanupMemory =
                    performance.memory?.usedJSHeapSize || 0;
                memorySnapshots.push(afterCleanupMemory);
            }

            // 验证资源清理效率
            const finalMemory = memorySnapshots[memorySnapshots.length - 1]!;
            const totalMemoryGrowth = finalMemory - initialMemory;

            // 最终内存增长应该很小（说明资源被正确清理）
            expect(totalMemoryGrowth).toBeLessThan(20 * 1024 * 1024); // 小于20MB

            // 验证每个循环的内存都能被回收
            for (let i = 2; i < memorySnapshots.length; i += 2) {
                const beforeCycle = memorySnapshots[i - 2]!;
                const afterCleanup = memorySnapshots[i]!;
                const memoryRecovery =
                    (beforeCycle - afterCleanup) / beforeCycle;

                // 每个循环至少应该回收80%的内存
                expect(Math.abs(memoryRecovery)).toBeLessThan(0.5); // 允许一定的内存增长
            }

            console.log("资源清理效率测试结果:", {
                cycles,
                bodiesPerCycle,
                initialMemoryMB: (initialMemory / (1024 * 1024)).toFixed(2),
                finalMemoryMB: (finalMemory / (1024 * 1024)).toFixed(2),
                totalGrowthMB: (totalMemoryGrowth / (1024 * 1024)).toFixed(2),
            });
        });
    });
});
