// 碰撞检测和响应系统

import type {
    IPhysicsBody,
    ICollisionEvent,
    IPhysicsEngine,
} from "@/types/physics";
import type { IPoint } from "@/types/common";

/**
 * 碰撞检测配置
 */
export interface ICollisionConfig {
    /** 是否启用碰撞检测 */
    enabled: boolean;
    /** 碰撞检测精度 */
    precision: "low" | "medium" | "high";
    /** 是否启用连续碰撞检测 */
    continuousDetection: boolean;
    /** 最大碰撞检测距离 */
    maxDetectionDistance: number;
    /** 碰撞响应强度 */
    responseStrength: number;
}

/**
 * 碰撞类型枚举
 */
export enum CollisionType {
    CIRCLE_CIRCLE = "circle-circle",
    CIRCLE_RECTANGLE = "circle-rectangle",
    RECTANGLE_RECTANGLE = "rectangle-rectangle",
    CIRCLE_POLYGON = "circle-polygon",
    RECTANGLE_POLYGON = "rectangle-polygon",
    POLYGON_POLYGON = "polygon-polygon",
}

/**
 * 碰撞检测结果
 */
export interface ICollisionResult {
    /** 是否发生碰撞 */
    hasCollision: boolean;
    /** 碰撞点 */
    contactPoint: IPoint;
    /** 碰撞法向量 */
    normal: IPoint;
    /** 穿透深度 */
    penetration: number;
    /** 碰撞类型 */
    type: CollisionType;
}

/**
 * 碰撞响应类型
 */
export interface ICollisionResponseConfig {
    /** 弹性系数 */
    restitution: number;
    /** 摩擦系数 */
    friction: number;
    /** 是否分离物体 */
    separate: boolean;
    /** 分离强度 */
    separationStrength: number;
}

/**
 * 碰撞系统类
 * 处理高效的碰撞检测和物理响应
 */
export class CollisionSystem {
    private config: ICollisionConfig;
    private physicsEngine: IPhysicsEngine;
    private collisionPairs: Map<string, ICollisionEvent> = new Map();
    private spatialHash: Map<string, IPhysicsBody[]> = new Map();
    private cellSize: number = 64;

    constructor(
        physicsEngine: IPhysicsEngine,
        config: Partial<ICollisionConfig> = {},
    ) {
        this.physicsEngine = physicsEngine;
        this.config = {
            enabled: true,
            precision: "medium",
            continuousDetection: false,
            maxDetectionDistance: 100,
            responseStrength: 1.0,
            ...config,
        };

        console.log("碰撞系统初始化完成", this.config);
    }

    /**
     * 更新空间哈希表
     */
    private updateSpatialHash(bodies: IPhysicsBody[]): void {
        this.spatialHash.clear();

        bodies.forEach((body) => {
            const cells = this.getBodyCells(body);
            cells.forEach((cell) => {
                if (!this.spatialHash.has(cell)) {
                    this.spatialHash.set(cell, []);
                }
                this.spatialHash.get(cell)!.push(body);
            });
        });
    }

    /**
     * 获取物理体占用的网格单元
     */
    private getBodyCells(body: IPhysicsBody): string[] {
        const cells: string[] = [];
        const bounds = this.getBodyBounds(body);

        const minCellX = Math.floor(bounds.minX / this.cellSize);
        const maxCellX = Math.floor(bounds.maxX / this.cellSize);
        const minCellY = Math.floor(bounds.minY / this.cellSize);
        const maxCellY = Math.floor(bounds.maxY / this.cellSize);

        for (let x = minCellX; x <= maxCellX; x++) {
            for (let y = minCellY; y <= maxCellY; y++) {
                cells.push(`${x},${y}`);
            }
        }

        return cells;
    }

    /**
     * 获取物理体的边界框
     */
    private getBodyBounds(body: IPhysicsBody): {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    } {
        switch (body.type) {
            case "circle": {
                const circleBody = body as any;
                const radius = circleBody.radius || 10;
                return {
                    minX: body.position.x - radius,
                    maxX: body.position.x + radius,
                    minY: body.position.y - radius,
                    maxY: body.position.y + radius,
                };
            }
            case "rectangle": {
                const rectBody = body as any;
                const halfWidth = (rectBody.width || 20) / 2;
                const halfHeight = (rectBody.height || 20) / 2;
                return {
                    minX: body.position.x - halfWidth,
                    maxX: body.position.x + halfWidth,
                    minY: body.position.y - halfHeight,
                    maxY: body.position.y + halfHeight,
                };
            }
            case "polygon": {
                const polyBody = body as any;
                const vertices = polyBody.vertices || [];
                if (vertices.length === 0) {
                    return {
                        minX: body.position.x - 10,
                        maxX: body.position.x + 10,
                        minY: body.position.y - 10,
                        maxY: body.position.y + 10,
                    };
                }

                let minX = Infinity,
                    maxX = -Infinity;
                let minY = Infinity,
                    maxY = -Infinity;

                vertices.forEach((vertex: IPoint) => {
                    const worldX = body.position.x + vertex.x;
                    const worldY = body.position.y + vertex.y;
                    minX = Math.min(minX, worldX);
                    maxX = Math.max(maxX, worldX);
                    minY = Math.min(minY, worldY);
                    maxY = Math.max(maxY, worldY);
                });

                return { minX, maxX, minY, maxY };
            }
            default:
                return {
                    minX: body.position.x - 10,
                    maxX: body.position.x + 10,
                    minY: body.position.y - 10,
                    maxY: body.position.y + 10,
                };
        }
    }

    /**
     * 检测两个物理体之间的碰撞
     */
    detectCollision(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
    ): ICollisionResult {
        // 首先进行粗略的边界框检测
        if (!this.boundingBoxTest(bodyA, bodyB)) {
            return {
                hasCollision: false,
                contactPoint: { x: 0, y: 0 },
                normal: { x: 0, y: 0 },
                penetration: 0,
                type: this.getCollisionType(bodyA, bodyB),
            };
        }

        // 根据物理体类型进行精确碰撞检测
        return this.performDetailedCollisionDetection(bodyA, bodyB);
    }

    /**
     * 边界框测试
     */
    private boundingBoxTest(bodyA: IPhysicsBody, bodyB: IPhysicsBody): boolean {
        const boundsA = this.getBodyBounds(bodyA);
        const boundsB = this.getBodyBounds(bodyB);

        return !(
            boundsA.maxX < boundsB.minX ||
            boundsA.minX > boundsB.maxX ||
            boundsA.maxY < boundsB.minY ||
            boundsA.minY > boundsB.maxY
        );
    }

    /**
     * 执行详细的碰撞检测
     */
    private performDetailedCollisionDetection(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
    ): ICollisionResult {
        const collisionType = this.getCollisionType(bodyA, bodyB);

        switch (collisionType) {
            case CollisionType.CIRCLE_CIRCLE:
                return this.detectCircleCircleCollision(
                    bodyA as any,
                    bodyB as any,
                );
            case CollisionType.CIRCLE_RECTANGLE:
                return this.detectCircleRectangleCollision(
                    bodyA as any,
                    bodyB as any,
                );
            case CollisionType.RECTANGLE_RECTANGLE:
                return this.detectRectangleRectangleCollision(
                    bodyA as any,
                    bodyB as any,
                );
            case CollisionType.CIRCLE_POLYGON:
                return this.detectCirclePolygonCollision(
                    bodyA as any,
                    bodyB as any,
                );
            case CollisionType.RECTANGLE_POLYGON:
                return this.detectRectanglePolygonCollision(
                    bodyA as any,
                    bodyB as any,
                );
            case CollisionType.POLYGON_POLYGON:
                return this.detectPolygonPolygonCollision(
                    bodyA as any,
                    bodyB as any,
                );
            default:
                return {
                    hasCollision: false,
                    contactPoint: { x: 0, y: 0 },
                    normal: { x: 0, y: 0 },
                    penetration: 0,
                    type: collisionType,
                };
        }
    }

    /**
     * 获取碰撞类型
     */
    private getCollisionType(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
    ): CollisionType {
        const typeA = bodyA.type;
        const typeB = bodyB.type;

        if (typeA === "circle" && typeB === "circle") {
            return CollisionType.CIRCLE_CIRCLE;
        } else if (
            (typeA === "circle" && typeB === "rectangle") ||
            (typeA === "rectangle" && typeB === "circle")
        ) {
            return CollisionType.CIRCLE_RECTANGLE;
        } else if (typeA === "rectangle" && typeB === "rectangle") {
            return CollisionType.RECTANGLE_RECTANGLE;
        } else if (
            (typeA === "circle" && typeB === "polygon") ||
            (typeA === "polygon" && typeB === "circle")
        ) {
            return CollisionType.CIRCLE_POLYGON;
        } else if (
            (typeA === "rectangle" && typeB === "polygon") ||
            (typeA === "polygon" && typeB === "rectangle")
        ) {
            return CollisionType.RECTANGLE_POLYGON;
        } else {
            return CollisionType.POLYGON_POLYGON;
        }
    }

    /**
     * 圆形与圆形碰撞检测
     */
    private detectCircleCircleCollision(
        circleA: any,
        circleB: any,
    ): ICollisionResult {
        const radiusA = circleA.radius || 10;
        const radiusB = circleB.radius || 10;
        const totalRadius = radiusA + radiusB;

        const dx = circleB.position.x - circleA.position.x;
        const dy = circleB.position.y - circleA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < totalRadius) {
            const penetration = totalRadius - distance;
            const normal =
                distance > 0
                    ? { x: dx / distance, y: dy / distance }
                    : { x: 1, y: 0 };
            const contactPoint = {
                x: circleA.position.x + normal.x * radiusA,
                y: circleA.position.y + normal.y * radiusA,
            };

            return {
                hasCollision: true,
                contactPoint,
                normal,
                penetration,
                type: CollisionType.CIRCLE_CIRCLE,
            };
        }

        return {
            hasCollision: false,
            contactPoint: { x: 0, y: 0 },
            normal: { x: 0, y: 0 },
            penetration: 0,
            type: CollisionType.CIRCLE_CIRCLE,
        };
    }

    /**
     * 圆形与矩形碰撞检测
     */
    private detectCircleRectangleCollision(
        circle: any,
        rectangle: any,
    ): ICollisionResult {
        const radius = circle.radius || 10;
        const halfWidth = (rectangle.width || 20) / 2;
        const halfHeight = (rectangle.height || 20) / 2;

        // 计算圆心到矩形的最近点
        const closestX = Math.max(
            rectangle.position.x - halfWidth,
            Math.min(circle.position.x, rectangle.position.x + halfWidth),
        );
        const closestY = Math.max(
            rectangle.position.y - halfHeight,
            Math.min(circle.position.y, rectangle.position.y + halfHeight),
        );

        const dx = circle.position.x - closestX;
        const dy = circle.position.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
            const penetration = radius - distance;
            const normal =
                distance > 0
                    ? { x: dx / distance, y: dy / distance }
                    : { x: 0, y: -1 };
            const contactPoint = { x: closestX, y: closestY };

            return {
                hasCollision: true,
                contactPoint,
                normal,
                penetration,
                type: CollisionType.CIRCLE_RECTANGLE,
            };
        }

        return {
            hasCollision: false,
            contactPoint: { x: 0, y: 0 },
            normal: { x: 0, y: 0 },
            penetration: 0,
            type: CollisionType.CIRCLE_RECTANGLE,
        };
    }

    /**
     * 矩形与矩形碰撞检测（简化版本）
     */
    private detectRectangleRectangleCollision(
        rectA: any,
        rectB: any,
    ): ICollisionResult {
        const halfWidthA = (rectA.width || 20) / 2;
        const halfHeightA = (rectA.height || 20) / 2;
        const halfWidthB = (rectB.width || 20) / 2;
        const halfHeightB = (rectB.height || 20) / 2;

        const dx = rectB.position.x - rectA.position.x;
        const dy = rectB.position.y - rectA.position.y;

        const overlapX = halfWidthA + halfWidthB - Math.abs(dx);
        const overlapY = halfHeightA + halfHeightB - Math.abs(dy);

        if (overlapX > 0 && overlapY > 0) {
            // 选择较小的重叠作为分离方向
            let normal: IPoint;
            let penetration: number;
            let contactPoint: IPoint;

            if (overlapX < overlapY) {
                normal = { x: dx > 0 ? 1 : -1, y: 0 };
                penetration = overlapX;
                contactPoint = {
                    x: rectA.position.x + (dx > 0 ? halfWidthA : -halfWidthA),
                    y: rectB.position.y,
                };
            } else {
                normal = { x: 0, y: dy > 0 ? 1 : -1 };
                penetration = overlapY;
                contactPoint = {
                    x: rectB.position.x,
                    y: rectA.position.y + (dy > 0 ? halfHeightA : -halfHeightA),
                };
            }

            return {
                hasCollision: true,
                contactPoint,
                normal,
                penetration,
                type: CollisionType.RECTANGLE_RECTANGLE,
            };
        }

        return {
            hasCollision: false,
            contactPoint: { x: 0, y: 0 },
            normal: { x: 0, y: 0 },
            penetration: 0,
            type: CollisionType.RECTANGLE_RECTANGLE,
        };
    }

    /**
     * 圆形与多边形碰撞检测（简化版本）
     */
    private detectCirclePolygonCollision(
        circle: any,
        polygon: any,
    ): ICollisionResult {
        // 简化实现：将多边形视为其边界框
        const bounds = this.getBodyBounds(polygon);
        const fakeRect = {
            position: {
                x: (bounds.minX + bounds.maxX) / 2,
                y: (bounds.minY + bounds.maxY) / 2,
            },
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY,
        };

        const result = this.detectCircleRectangleCollision(circle, fakeRect);
        return {
            ...result,
            type: CollisionType.CIRCLE_POLYGON,
        };
    }

    /**
     * 矩形与多边形碰撞检测（简化版本）
     */
    private detectRectanglePolygonCollision(
        rectangle: any,
        polygon: any,
    ): ICollisionResult {
        // 简化实现：将多边形视为其边界框
        const bounds = this.getBodyBounds(polygon);
        const fakeRect = {
            position: {
                x: (bounds.minX + bounds.maxX) / 2,
                y: (bounds.minY + bounds.maxY) / 2,
            },
            width: bounds.maxX - bounds.minX,
            height: bounds.maxY - bounds.minY,
        };

        const result = this.detectRectangleRectangleCollision(
            rectangle,
            fakeRect,
        );
        return {
            ...result,
            type: CollisionType.RECTANGLE_POLYGON,
        };
    }

    /**
     * 多边形与多边形碰撞检测（简化版本）
     */
    private detectPolygonPolygonCollision(
        polygonA: any,
        polygonB: any,
    ): ICollisionResult {
        // 简化实现：使用边界框检测
        const boundsA = this.getBodyBounds(polygonA);
        const boundsB = this.getBodyBounds(polygonB);

        const fakeRectA = {
            position: {
                x: (boundsA.minX + boundsA.maxX) / 2,
                y: (boundsA.minY + boundsA.maxY) / 2,
            },
            width: boundsA.maxX - boundsA.minX,
            height: boundsA.maxY - boundsA.minY,
        };

        const fakeRectB = {
            position: {
                x: (boundsB.minX + boundsB.maxX) / 2,
                y: (boundsB.minY + boundsB.maxY) / 2,
            },
            width: boundsB.maxX - boundsB.minX,
            height: boundsB.maxY - boundsB.minY,
        };

        const result = this.detectRectangleRectangleCollision(
            fakeRectA,
            fakeRectB,
        );
        return {
            ...result,
            type: CollisionType.POLYGON_POLYGON,
        };
    }

    /**
     * 应用碰撞响应
     */
    applyCollisionResponse(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        collision: ICollisionResult,
        config: ICollisionResponseConfig,
    ): void {
        if (!collision.hasCollision) return;

        // 分离物体
        if (config.separate) {
            this.separateBodies(
                bodyA,
                bodyB,
                collision,
                config.separationStrength,
            );
        }

        // 计算相对速度
        const relativeVelocity = {
            x: bodyB.velocity.x - bodyA.velocity.x,
            y: bodyB.velocity.y - bodyA.velocity.y,
        };

        // 计算相对速度在法向量上的投影
        const velocityAlongNormal =
            relativeVelocity.x * collision.normal.x +
            relativeVelocity.y * collision.normal.y;

        // 如果物体正在分离，不需要应用冲量
        if (velocityAlongNormal > 0) return;

        // 计算弹性系数
        const restitution =
            Math.min(bodyA.restitution, bodyB.restitution) * config.restitution;

        // 计算冲量大小
        const impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
        const totalInverseMass = 1 / bodyA.mass + 1 / bodyB.mass;
        const impulse = impulseMagnitude / totalInverseMass;

        // 应用冲量
        const impulseVector = {
            x: impulse * collision.normal.x,
            y: impulse * collision.normal.y,
        };

        if (!bodyA.isStatic) {
            bodyA.velocity.x -= impulseVector.x / bodyA.mass;
            bodyA.velocity.y -= impulseVector.y / bodyA.mass;
        }

        if (!bodyB.isStatic) {
            bodyB.velocity.x += impulseVector.x / bodyB.mass;
            bodyB.velocity.y += impulseVector.y / bodyB.mass;
        }

        // 应用摩擦力
        this.applyFriction(bodyA, bodyB, collision, config.friction);
    }

    /**
     * 分离物体
     */
    private separateBodies(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        collision: ICollisionResult,
        strength: number,
    ): void {
        const separation = collision.penetration * strength;
        const totalInverseMass = 1 / bodyA.mass + 1 / bodyB.mass;

        const separationA = (separation * (1 / bodyA.mass)) / totalInverseMass;
        const separationB = (separation * (1 / bodyB.mass)) / totalInverseMass;

        if (!bodyA.isStatic) {
            bodyA.position.x -= collision.normal.x * separationA;
            bodyA.position.y -= collision.normal.y * separationA;
        }

        if (!bodyB.isStatic) {
            bodyB.position.x += collision.normal.x * separationB;
            bodyB.position.y += collision.normal.y * separationB;
        }
    }

    /**
     * 应用摩擦力
     */
    private applyFriction(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        collision: ICollisionResult,
        frictionCoeff: number,
    ): void {
        const relativeVelocity = {
            x: bodyB.velocity.x - bodyA.velocity.x,
            y: bodyB.velocity.y - bodyA.velocity.y,
        };

        // 计算切向量
        const tangent = {
            x:
                relativeVelocity.x -
                (relativeVelocity.x * collision.normal.x +
                    relativeVelocity.y * collision.normal.y) *
                    collision.normal.x,
            y:
                relativeVelocity.y -
                (relativeVelocity.x * collision.normal.x +
                    relativeVelocity.y * collision.normal.y) *
                    collision.normal.y,
        };

        const tangentLength = Math.sqrt(
            tangent.x * tangent.x + tangent.y * tangent.y,
        );
        if (tangentLength < 0.001) return;

        // 归一化切向量
        tangent.x /= tangentLength;
        tangent.y /= tangentLength;

        // 计算摩擦冲量
        const frictionMagnitude = -(
            relativeVelocity.x * tangent.x +
            relativeVelocity.y * tangent.y
        );
        const totalInverseMass = 1 / bodyA.mass + 1 / bodyB.mass;
        const frictionImpulse =
            (frictionMagnitude / totalInverseMass) * frictionCoeff;

        const frictionVector = {
            x: frictionImpulse * tangent.x,
            y: frictionImpulse * tangent.y,
        };

        if (!bodyA.isStatic) {
            bodyA.velocity.x -= frictionVector.x / bodyA.mass;
            bodyA.velocity.y -= frictionVector.y / bodyA.mass;
        }

        if (!bodyB.isStatic) {
            bodyB.velocity.x += frictionVector.x / bodyB.mass;
            bodyB.velocity.y += frictionVector.y / bodyB.mass;
        }
    }

    /**
     * 检测所有碰撞
     */
    detectAllCollisions(bodies: IPhysicsBody[]): ICollisionEvent[] {
        if (!this.config.enabled) return [];

        this.updateSpatialHash(bodies);
        const collisions: ICollisionEvent[] = [];
        const checkedPairs = new Set<string>();

        // 遍历空间哈希表中的每个单元
        this.spatialHash.forEach((cellBodies) => {
            // 检测同一单元内的物体碰撞
            for (let i = 0; i < cellBodies.length; i++) {
                for (let j = i + 1; j < cellBodies.length; j++) {
                    const bodyA = cellBodies[i];
                    const bodyB = cellBodies[j];

                    // 避免重复检测
                    const pairKey = `${Math.min(bodyA.id, bodyB.id)}-${Math.max(
                        bodyA.id,
                        bodyB.id,
                    )}`;
                    if (checkedPairs.has(pairKey)) continue;
                    checkedPairs.add(pairKey);

                    // 跳过两个静态物体
                    if (bodyA.isStatic && bodyB.isStatic) continue;

                    const collision = this.detectCollision(bodyA, bodyB);
                    if (collision.hasCollision) {
                        const collisionEvent: ICollisionEvent = {
                            bodyA,
                            bodyB,
                            contactPoint: collision.contactPoint,
                            normal: collision.normal,
                            impulse: collision.penetration,
                        };
                        collisions.push(collisionEvent);
                    }
                }
            }
        });

        return collisions;
    }

    /**
     * 更新碰撞系统
     */
    update(bodies: IPhysicsBody[]): ICollisionEvent[] {
        const collisions = this.detectAllCollisions(bodies);

        // 应用默认碰撞响应
        collisions.forEach((collision) => {
            this.applyCollisionResponse(
                collision.bodyA,
                collision.bodyB,
                {
                    hasCollision: true,
                    contactPoint: collision.contactPoint,
                    normal: collision.normal,
                    penetration: collision.impulse,
                    type: this.getCollisionType(
                        collision.bodyA,
                        collision.bodyB,
                    ),
                },
                {
                    restitution: this.config.responseStrength,
                    friction: 0.3,
                    separate: true,
                    separationStrength: 0.8,
                },
            );
        });

        return collisions;
    }

    /**
     * 获取配置
     */
    getConfig(): ICollisionConfig {
        return { ...this.config };
    }

    /**
     * 更新配置
     */
    updateConfig(newConfig: Partial<ICollisionConfig>): void {
        this.config = { ...this.config, ...newConfig };
        console.log("碰撞系统配置已更新", this.config);
    }

    /**
     * 销毁碰撞系统
     */
    destroy(): void {
        this.collisionPairs.clear();
        this.spatialHash.clear();
        console.log("碰撞系统已销毁");
    }
}
