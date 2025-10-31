// Matter.js 物理引擎实现

import {
    Engine,
    World,
    Bodies,
    Body,
    Constraint,
    Events,
    type IEngineDefinition,
    type IWorldDefinition,
} from "matter-js";
import type {
    IPhysicsEngine,
    IPhysicsWorldConfig,
    IPhysicsBody,
    ICollisionEvent,
    IConstraint,
    IPhysicsDebugInfo,
} from "@/types/physics";
import { PhysicsBodyType } from "@/types/physics";
import type { IPoint } from "@/types/common";

/**
 * Matter.js 物理引擎实现类
 * 提供完整的 2D 物理模拟功能
 */
export class MatterPhysicsEngine implements IPhysicsEngine {
    private engine: Engine | null = null;
    private world: World | null = null;
    private bodies: Map<string, Body> = new Map();
    private constraints: Map<string, Constraint> = new Map();
    private collisionEvents: ICollisionEvent[] = [];
    private debugInfo: IPhysicsDebugInfo = {
        bodyCount: 0,
        constraintCount: 0,
        collisionCount: 0,
        updateTime: 0,
        sleepingBodies: 0,
    };

    /**
     * 初始化物理引擎
     * @param config 物理世界配置
     */
    init(config: IPhysicsWorldConfig): void {
        // 创建物理引擎
        this.engine = Engine.create();
        this.world = this.engine.world;

        // 配置重力
        this.engine.world.gravity.x = config.gravity.x;
        this.engine.world.gravity.y = config.gravity.y;
        this.engine.world.gravity.scale = 0.001; // Matter.js 重力缩放

        // 配置引擎参数
        this.engine.timing.timeScale = 1;
        this.engine.velocityIterations = config.velocityIterations || 4;
        this.engine.positionIterations = config.positionIterations || 6;

        // 启用碰撞检测事件
        if (config.enableCollision) {
            this.setupCollisionEvents();
        }

        console.log("物理引擎初始化完成", config);
    }

    /**
     * 设置碰撞检测事件
     */
    private setupCollisionEvents(): void {
        if (!this.engine) return;

        // 碰撞开始事件
        Events.on(this.engine, "collisionStart", (event) => {
            this.collisionEvents = [];
            event.pairs.forEach((pair) => {
                const bodyA = this.findBodyById(pair.bodyA.id.toString());
                const bodyB = this.findBodyById(pair.bodyB.id.toString());

                if (bodyA && bodyB) {
                    const collisionEvent: ICollisionEvent = {
                        bodyA,
                        bodyB,
                        contactPoint: {
                            x: pair.collision.supports[0]?.x || 0,
                            y: pair.collision.supports[0]?.y || 0,
                        },
                        normal: {
                            x: pair.collision.normal.x,
                            y: pair.collision.normal.y,
                        },
                        impulse: pair.collision.penetration || 0,
                    };
                    this.collisionEvents.push(collisionEvent);
                }
            });
        });

        // 碰撞结束事件
        Events.on(this.engine, "collisionEnd", (event) => {
            // 处理碰撞结束逻辑
            console.log("碰撞结束", event.pairs.length);
        });
    }

    /**
     * 根据 ID 查找物理体
     */
    private findBodyById(id: string): IPhysicsBody | null {
        const matterBody = this.bodies.get(id);
        if (!matterBody) return null;

        return this.convertMatterBodyToInterface(matterBody, id);
    }

    /**
     * 将 Matter.js Body 转换为接口格式
     */
    private convertMatterBodyToInterface(body: Body, id: string): IPhysicsBody {
        return {
            id,
            type: this.getBodyType(body),
            position: { x: body.position.x, y: body.position.y },
            velocity: { x: body.velocity.x, y: body.velocity.y },
            mass: body.mass,
            restitution: body.restitution,
            friction: body.friction,
            isStatic: body.isStatic,
            isSleeping: body.isSleeping,
            angle: body.angle,
            angularVelocity: body.angularVelocity,
        };
    }

    /**
     * 获取物理体类型
     */
    private getBodyType(body: Body): PhysicsBodyType {
        // 根据 Matter.js body 的形状判断类型
        if (body.circleRadius && body.circleRadius > 0) {
            return PhysicsBodyType.CIRCLE;
        }
        if (body.vertices.length === 4) {
            return PhysicsBodyType.RECTANGLE;
        }
        return PhysicsBodyType.POLYGON;
    }

    /**
     * 添加物理体到世界
     * @param physicsBody 物理体接口
     */
    addBody(physicsBody: IPhysicsBody): void {
        if (!this.world) {
            console.error("物理世界未初始化");
            return;
        }

        let matterBody: Body;

        // 根据类型创建对应的 Matter.js 物理体
        switch (physicsBody.type) {
            case PhysicsBodyType.CIRCLE:
                const circleBody = physicsBody as any;
                matterBody = Bodies.circle(
                    physicsBody.position.x,
                    physicsBody.position.y,
                    circleBody.radius || 10,
                    {
                        mass: physicsBody.mass,
                        restitution: physicsBody.restitution,
                        friction: physicsBody.friction,
                        isStatic: physicsBody.isStatic,
                        angle: physicsBody.angle,
                    },
                );
                break;

            case PhysicsBodyType.RECTANGLE:
                const rectBody = physicsBody as any;
                matterBody = Bodies.rectangle(
                    physicsBody.position.x,
                    physicsBody.position.y,
                    rectBody.width || 20,
                    rectBody.height || 20,
                    {
                        mass: physicsBody.mass,
                        restitution: physicsBody.restitution,
                        friction: physicsBody.friction,
                        isStatic: physicsBody.isStatic,
                        angle: physicsBody.angle,
                    },
                );
                break;

            case PhysicsBodyType.POLYGON:
                const polyBody = physicsBody as any;
                matterBody = Bodies.fromVertices(
                    physicsBody.position.x,
                    physicsBody.position.y,
                    polyBody.vertices || [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                    ],
                    {
                        mass: physicsBody.mass,
                        restitution: physicsBody.restitution,
                        friction: physicsBody.friction,
                        isStatic: physicsBody.isStatic,
                        angle: physicsBody.angle,
                    },
                );
                break;

            default:
                console.error("不支持的物理体类型", physicsBody.type);
                return;
        }

        // 设置初始速度
        Body.setVelocity(matterBody, physicsBody.velocity);
        Body.setAngularVelocity(matterBody, physicsBody.angularVelocity);

        // 添加到世界和缓存
        World.add(this.world, matterBody);
        this.bodies.set(physicsBody.id, matterBody);

        console.log(`添加物理体: ${physicsBody.id} (${physicsBody.type})`);
    }

    /**
     * 从世界中移除物理体
     * @param bodyId 物理体 ID
     */
    removeBody(bodyId: string): void {
        if (!this.world) return;

        const body = this.bodies.get(bodyId);
        if (body) {
            World.remove(this.world, body);
            this.bodies.delete(bodyId);
            console.log(`移除物理体: ${bodyId}`);
        }
    }

    /**
     * 获取物理体
     * @param bodyId 物理体 ID
     */
    getBody(bodyId: string): IPhysicsBody | null {
        const body = this.bodies.get(bodyId);
        if (!body) return null;

        return this.convertMatterBodyToInterface(body, bodyId);
    }

    /**
     * 添加约束
     * @param constraint 约束配置
     */
    addConstraint(constraint: IConstraint): void {
        if (!this.world) return;

        const bodyA = this.bodies.get(constraint.bodyA.id);
        const bodyB = this.bodies.get(constraint.bodyB.id);

        if (!bodyA || !bodyB) {
            console.error("约束的物理体不存在");
            return;
        }

        const matterConstraint = Constraint.create({
            bodyA,
            bodyB,
            length: constraint.length,
            stiffness: constraint.stiffness,
            damping: constraint.damping,
        });

        World.add(this.world, matterConstraint);
        this.constraints.set(constraint.id, matterConstraint);

        console.log(`添加约束: ${constraint.id}`);
    }

    /**
     * 移除约束
     * @param constraintId 约束 ID
     */
    removeConstraint(constraintId: string): void {
        if (!this.world) return;

        const constraint = this.constraints.get(constraintId);
        if (constraint) {
            World.remove(this.world, constraint);
            this.constraints.delete(constraintId);
            console.log(`移除约束: ${constraintId}`);
        }
    }

    /**
     * 更新物理世界
     * @param deltaTime 时间步长（毫秒）
     */
    update(deltaTime: number): void {
        if (!this.engine) return;

        const startTime = performance.now();

        // 更新物理引擎
        Engine.update(this.engine, deltaTime);

        // 更新调试信息
        this.updateDebugInfo(performance.now() - startTime);
    }

    /**
     * 更新调试信息
     */
    private updateDebugInfo(updateTime: number): void {
        this.debugInfo = {
            bodyCount: this.bodies.size,
            constraintCount: this.constraints.size,
            collisionCount: this.collisionEvents.length,
            updateTime,
            sleepingBodies: Array.from(this.bodies.values()).filter(
                (body) => body.isSleeping,
            ).length,
        };
    }

    /**
     * 清空物理世界
     */
    clear(): void {
        if (!this.world) return;

        // 清空所有物理体和约束
        World.clear(this.world, false);
        this.bodies.clear();
        this.constraints.clear();
        this.collisionEvents = [];

        console.log("物理世界已清空");
    }

    /**
     * 设置重力
     * @param gravity 重力向量
     */
    setGravity(gravity: IPoint): void {
        if (!this.engine) return;

        this.engine.world.gravity.x = gravity.x;
        this.engine.world.gravity.y = gravity.y;

        console.log("重力已更新", gravity);
    }

    /**
     * 获取碰撞对
     */
    getCollisionPairs(): ICollisionEvent[] {
        return [...this.collisionEvents];
    }

    /**
     * 获取调试信息
     */
    getDebugInfo(): IPhysicsDebugInfo {
        return { ...this.debugInfo };
    }

    /**
     * 销毁物理引擎
     */
    destroy(): void {
        if (this.engine) {
            Events.off(this.engine, "collisionStart");
            Events.off(this.engine, "collisionEnd");
            Engine.clear(this.engine);
            this.engine = null;
            this.world = null;
        }

        this.bodies.clear();
        this.constraints.clear();
        this.collisionEvents = [];

        console.log("物理引擎已销毁");
    }
}
