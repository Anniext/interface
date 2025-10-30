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
