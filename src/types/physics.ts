// 物理引擎相关类型定义

import type { IPoint } from "./common";

/** 物理体类型枚举 */
export enum PhysicsBodyType {
    RECTANGLE = "rectangle",
    CIRCLE = "circle",
    POLYGON = "polygon",
}

/** 物理体接口 */
export interface IPhysicsBody {
    /** 物理体 ID */
    id: string;
    /** 物理体类型 */
    type: PhysicsBodyType;
    /** 位置 */
    position: IPoint;
    /** 速度 */
    velocity: IPoint;
    /** 质量 */
    mass: number;
    /** 弹性系数 */
    restitution: number;
    /** 摩擦系数 */
    friction: number;
    /** 是否静态 */
    isStatic: boolean;
    /** 是否休眠 */
    isSleeping: boolean;
    /** 角度 */
    angle: number;
    /** 角速度 */
    angularVelocity: number;
}

/** 圆形物理体接口 */
export interface ICircleBody extends IPhysicsBody {
    type: PhysicsBodyType.CIRCLE;
    /** 半径 */
    radius: number;
}

/** 矩形物理体接口 */
export interface IRectangleBody extends IPhysicsBody {
    type: PhysicsBodyType.RECTANGLE;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
}

/** 多边形物理体接口 */
export interface IPolygonBody extends IPhysicsBody {
    type: PhysicsBodyType.POLYGON;
    /** 顶点数组 */
    vertices: IPoint[];
}

/** 物理世界配置接口 */
export interface IPhysicsWorldConfig {
    /** 重力 */
    gravity: IPoint;
    /** 是否启用碰撞检测 */
    enableCollision: boolean;
    /** 时间步长 */
    timeStep: number;
    /** 速度迭代次数 */
    velocityIterations: number;
    /** 位置迭代次数 */
    positionIterations: number;
}

/** 碰撞事件接口 */
export interface ICollisionEvent {
    /** 碰撞的物理体 A */
    bodyA: IPhysicsBody;
    /** 碰撞的物理体 B */
    bodyB: IPhysicsBody;
    /** 碰撞点 */
    contactPoint: IPoint;
    /** 碰撞法向量 */
    normal: IPoint;
    /** 碰撞冲量 */
    impulse: number;
}

/** 约束接口 */
export interface IConstraint {
    /** 约束 ID */
    id: string;
    /** 约束的物理体 A */
    bodyA: IPhysicsBody;
    /** 约束的物理体 B */
    bodyB: IPhysicsBody;
    /** 约束长度 */
    length: number;
    /** 约束刚度 */
    stiffness: number;
    /** 约束阻尼 */
    damping: number;
}

/** 物理引擎接口 */
export interface IPhysicsEngine {
    /** 初始化物理引擎 */
    init(config: IPhysicsWorldConfig): void;
    /** 添加物理体 */
    addBody(body: IPhysicsBody): void;
    /** 移除物理体 */
    removeBody(bodyId: string): void;
    /** 获取物理体 */
    getBody(bodyId: string): IPhysicsBody | null;
    /** 添加约束 */
    addConstraint(constraint: IConstraint): void;
    /** 移除约束 */
    removeConstraint(constraintId: string): void;
    /** 更新物理世界 */
    update(deltaTime: number): void;
    /** 清空物理世界 */
    clear(): void;
    /** 设置重力 */
    setGravity(gravity: IPoint): void;
    /** 获取碰撞对 */
    getCollisionPairs(): ICollisionEvent[];
}

/** 物理材质接口 */
export interface IPhysicsMaterial {
    /** 材质名称 */
    name: string;
    /** 密度 */
    density: number;
    /** 弹性系数 */
    restitution: number;
    /** 摩擦系数 */
    friction: number;
    /** 空气阻力 */
    frictionAir: number;
}

/** 物理体工厂配置接口 */
export interface IPhysicsBodyFactory {
    /** 创建圆形物理体 */
    createCircle(
        x: number,
        y: number,
        radius: number,
        options?: Partial<ICircleBody>,
    ): ICircleBody;
    /** 创建矩形物理体 */
    createRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        options?: Partial<IRectangleBody>,
    ): IRectangleBody;
    /** 创建多边形物理体 */
    createPolygon(
        x: number,
        y: number,
        vertices: IPoint[],
        options?: Partial<IPolygonBody>,
    ): IPolygonBody;
    /** 创建边界墙体 */
    createBounds(
        width: number,
        height: number,
        thickness: number,
    ): IPhysicsBody[];
}

/** 物理调试信息接口 */
export interface IPhysicsDebugInfo {
    /** 物理体数量 */
    bodyCount: number;
    /** 约束数量 */
    constraintCount: number;
    /** 碰撞对数量 */
    collisionCount: number;
    /** 物理更新时间（毫秒） */
    updateTime: number;
    /** 休眠物体数量 */
    sleepingBodies: number;
}
