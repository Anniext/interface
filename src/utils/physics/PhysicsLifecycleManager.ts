// 物理体生命周期管理器

import type { IPhysicsBody, IPhysicsEngine } from "@/types/physics";
import type { IPoint } from "@/types/common";

/**
 * 物理体生命周期配置接口
 */
export interface IPhysicsLifecycleConfig {
    /** 最大生存时间（毫秒），-1 表示永久 */
    maxLifetime: number;
    /** 最大物理体数量 */
    maxBodies: number;
    /** 边界检查 */
    boundaryCheck: {
        enabled: boolean;
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        /** 超出边界后的处理方式 */
        outOfBoundsAction: "remove" | "teleport" | "bounce";
        /** 传送目标位置（当 action 为 teleport 时） */
        teleportTarget?: IPoint;
    };
    /** 速度检查 */
    velocityCheck: {
        enabled: boolean;
        /** 最小速度阈值，低于此值的物体将被标记为静止 */
        minVelocity: number;
        /** 静止时间阈值（毫秒），超过此时间的静止物体可能被清理 */
        staticTime: number;
    };
    /** 距离检查 */
    distanceCheck: {
        enabled: boolean;
        /** 参考点 */
        referencePoint: IPoint;
        /** 最大距离 */
        maxDistance: number;
    };
}

/**
 * 物理体生命周期信息
 */
interface IPhysicsBodyLifecycle {
    /** 物理体 */
    body: IPhysicsBody;
    /** 创建时间 */
    createdAt: number;
    /** 最后更新时间 */
    lastUpdateAt: number;
    /** 静止开始时间 */
    staticSince: number;
    /** 是否标记为删除 */
    markedForRemoval: boolean;
    /** 删除原因 */
    removalReason?: string;
}

/**
 * 物理体生命周期管理器
 * 负责管理物理体的创建、更新和销毁
 */
export class PhysicsLifecycleManager {
    private bodies: Map<string, IPhysicsBodyLifecycle> = new Map();
    private config: IPhysicsLifecycleConfig;
    private physicsEngine: IPhysicsEngine;
    private lastCleanupTime = 0;
    private cleanupInterval = 1000; // 清理间隔（毫秒）

    constructor(
        physicsEngine: IPhysicsEngine,
        config: Partial<IPhysicsLifecycleConfig> = {},
    ) {
        this.physicsEngine = physicsEngine;
        this.config = {
            maxLifetime: -1,
            maxBodies: 1000,
            boundaryCheck: {
                enabled: true,
                bounds: { x: 0, y: 0, width: 800, height: 600 },
                outOfBoundsAction: "remove",
            },
            velocityCheck: {
                enabled: true,
                minVelocity: 0.1,
                staticTime: 5000,
            },
            distanceCheck: {
                enabled: false,
                referencePoint: { x: 0, y: 0 },
                maxDistance: 1000,
            },
            ...config,
        };
    }

    /**
     * 添加物理体到生命周期管理
     * @param body 物理体
     */
    addBody(body: IPhysicsBody): void {
        const now = Date.now();
        const lifecycle: IPhysicsBodyLifecycle = {
            body,
            createdAt: now,
            lastUpdateAt: now,
            staticSince: now,
            markedForRemoval: false,
        };

        this.bodies.set(body.id, lifecycle);

        // 添加到物理引擎
        this.physicsEngine.addBody(body);

        // 检查是否超过最大数量限制
        this.enforceMaxBodies();

        console.log(`物理体 ${body.id} 已添加到生命周期管理`);
    }

    /**
     * 移除物理体
     * @param bodyId 物理体 ID
     * @param reason 移除原因
     */
    removeBody(bodyId: string, reason: string = "manual"): void {
        const lifecycle = this.bodies.get(bodyId);
        if (lifecycle) {
            lifecycle.markedForRemoval = true;
            lifecycle.removalReason = reason;
            console.log(`物理体 ${bodyId} 标记为删除: ${reason}`);
        }
    }

    /**
     * 更新生命周期管理
     * @param deltaTime 时间步长
     */
    update(deltaTime: number): void {
        const now = Date.now();

        // 更新所有物理体的生命周期信息
        for (const [bodyId, lifecycle] of this.bodies) {
            if (lifecycle.markedForRemoval) continue;

            // 从物理引擎获取最新状态
            const currentBody = this.physicsEngine.getBody(bodyId);
            if (!currentBody) {
                lifecycle.markedForRemoval = true;
                lifecycle.removalReason = "not_found_in_engine";
                continue;
            }

            lifecycle.body = currentBody;
            lifecycle.lastUpdateAt = now;

            // 检查各种生命周期条件
            this.checkLifetime(lifecycle, now);
            this.checkBoundary(lifecycle);
            this.checkVelocity(lifecycle, now);
            this.checkDistance(lifecycle);
        }

        // 定期清理
        if (now - this.lastCleanupTime > this.cleanupInterval) {
            this.cleanup();
            this.lastCleanupTime = now;
        }
    }

    /**
     * 检查生存时间
     */
    private checkLifetime(lifecycle: IPhysicsBodyLifecycle, now: number): void {
        if (this.config.maxLifetime > 0) {
            const age = now - lifecycle.createdAt;
            if (age > this.config.maxLifetime) {
                lifecycle.markedForRemoval = true;
                lifecycle.removalReason = "lifetime_exceeded";
            }
        }
    }

    /**
     * 检查边界
     */
    private checkBoundary(lifecycle: IPhysicsBodyLifecycle): void {
        if (!this.config.boundaryCheck.enabled) return;

        const { bounds, outOfBoundsAction, teleportTarget } =
            this.config.boundaryCheck;
        const { position } = lifecycle.body;

        const isOutOfBounds =
            position.x < bounds.x ||
            position.x > bounds.x + bounds.width ||
            position.y < bounds.y ||
            position.y > bounds.y + bounds.height;

        if (isOutOfBounds) {
            switch (outOfBoundsAction) {
                case "remove":
                    lifecycle.markedForRemoval = true;
                    lifecycle.removalReason = "out_of_bounds";
                    break;

                case "teleport":
                    if (teleportTarget) {
                        // 更新物理体位置（需要通过物理引擎）
                        lifecycle.body.position = { ...teleportTarget };
                        // 重置速度
                        lifecycle.body.velocity = { x: 0, y: 0 };
                    }
                    break;

                case "bounce":
                    // 反转速度
                    if (
                        position.x < bounds.x ||
                        position.x > bounds.x + bounds.width
                    ) {
                        lifecycle.body.velocity.x *= -1;
                    }
                    if (
                        position.y < bounds.y ||
                        position.y > bounds.y + bounds.height
                    ) {
                        lifecycle.body.velocity.y *= -1;
                    }
                    break;
            }
        }
    }

    /**
     * 检查速度
     */
    private checkVelocity(lifecycle: IPhysicsBodyLifecycle, now: number): void {
        if (!this.config.velocityCheck.enabled) return;

        const { velocity } = lifecycle.body;
        const speed = Math.sqrt(
            velocity.x * velocity.x + velocity.y * velocity.y,
        );

        if (speed < this.config.velocityCheck.minVelocity) {
            // 物体静止
            if (lifecycle.staticSince === 0) {
                lifecycle.staticSince = now;
            } else {
                const staticDuration = now - lifecycle.staticSince;
                if (staticDuration > this.config.velocityCheck.staticTime) {
                    lifecycle.markedForRemoval = true;
                    lifecycle.removalReason = "static_too_long";
                }
            }
        } else {
            // 物体运动
            lifecycle.staticSince = 0;
        }
    }

    /**
     * 检查距离
     */
    private checkDistance(lifecycle: IPhysicsBodyLifecycle): void {
        if (!this.config.distanceCheck.enabled) return;

        const { position } = lifecycle.body;
        const { referencePoint, maxDistance } = this.config.distanceCheck;

        const dx = position.x - referencePoint.x;
        const dy = position.y - referencePoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxDistance) {
            lifecycle.markedForRemoval = true;
            lifecycle.removalReason = "too_far_from_reference";
        }
    }

    /**
     * 强制执行最大物理体数量限制
     */
    private enforceMaxBodies(): void {
        if (this.bodies.size <= this.config.maxBodies) return;

        // 按创建时间排序，移除最老的物理体
        const sortedBodies = Array.from(this.bodies.entries()).sort(
            ([, a], [, b]) => a.createdAt - b.createdAt,
        );

        const excessCount = this.bodies.size - this.config.maxBodies;
        for (let i = 0; i < excessCount; i++) {
            const [bodyId, lifecycle] = sortedBodies[i];
            lifecycle.markedForRemoval = true;
            lifecycle.removalReason = "max_bodies_exceeded";
        }
    }

    /**
     * 清理标记为删除的物理体
     */
    private cleanup(): void {
        const toRemove: string[] = [];

        for (const [bodyId, lifecycle] of this.bodies) {
            if (lifecycle.markedForRemoval) {
                toRemove.push(bodyId);
            }
        }

        for (const bodyId of toRemove) {
            const lifecycle = this.bodies.get(bodyId);
            if (lifecycle) {
                // 从物理引擎移除
                this.physicsEngine.removeBody(bodyId);
                // 从生命周期管理移除
                this.bodies.delete(bodyId);
                console.log(
                    `物理体 ${bodyId} 已清理，原因: ${lifecycle.removalReason}`,
                );
            }
        }

        if (toRemove.length > 0) {
            console.log(`清理了 ${toRemove.length} 个物理体`);
        }
    }

    /**
     * 获取生命周期统计信息
     */
    getStats(): {
        totalBodies: number;
        markedForRemoval: number;
        averageAge: number;
        oldestBody: number;
        staticBodies: number;
    } {
        const now = Date.now();
        let totalAge = 0;
        let oldestAge = 0;
        let markedCount = 0;
        let staticCount = 0;

        for (const lifecycle of this.bodies.values()) {
            const age = now - lifecycle.createdAt;
            totalAge += age;
            oldestAge = Math.max(oldestAge, age);

            if (lifecycle.markedForRemoval) markedCount++;
            if (lifecycle.staticSince > 0) staticCount++;
        }

        return {
            totalBodies: this.bodies.size,
            markedForRemoval: markedCount,
            averageAge: this.bodies.size > 0 ? totalAge / this.bodies.size : 0,
            oldestBody: oldestAge,
            staticBodies: staticCount,
        };
    }

    /**
     * 更新配置
     * @param newConfig 新配置
     */
    updateConfig(newConfig: Partial<IPhysicsLifecycleConfig>): void {
        this.config = { ...this.config, ...newConfig };
        console.log("生命周期管理配置已更新", this.config);
    }

    /**
     * 清空所有物理体
     */
    clear(): void {
        for (const bodyId of this.bodies.keys()) {
            this.physicsEngine.removeBody(bodyId);
        }
        this.bodies.clear();
        console.log("所有物理体已清空");
    }

    /**
     * 获取所有活跃的物理体
     */
    getActiveBodies(): IPhysicsBody[] {
        return Array.from(this.bodies.values())
            .filter((lifecycle) => !lifecycle.markedForRemoval)
            .map((lifecycle) => lifecycle.body);
    }

    /**
     * 销毁生命周期管理器
     */
    destroy(): void {
        this.clear();
        console.log("物理体生命周期管理器已销毁");
    }
}
