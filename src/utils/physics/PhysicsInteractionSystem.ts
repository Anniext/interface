// 物理交互系统实现

import type {
    IPhysicsEngine,
    IPhysicsBody,
    IConstraint,
    ICollisionEvent,
} from "@/types/physics";
import type { IPoint } from "@/types/common";

/**
 * 鼠标/触摸交互配置
 */
export interface IInteractionConfig {
    /** 是否启用鼠标交互 */
    enableMouse: boolean;
    /** 是否启用触摸交互 */
    enableTouch: boolean;
    /** 交互力度 */
    forceStrength: number;
    /** 交互半径 */
    interactionRadius: number;
    /** 是否显示交互区域 */
    showInteractionArea: boolean;
    /** 拖拽阻尼 */
    dragDamping: number;
}

/**
 * 约束类型枚举
 */
export enum ConstraintType {
    SPRING = "spring", // 弹簧约束
    ROPE = "rope", // 绳索约束
    PIN = "pin", // 固定约束
    DISTANCE = "distance", // 距离约束
}

/**
 * 约束配置接口
 */
export interface IConstraintConfig {
    type: ConstraintType;
    bodyA: IPhysicsBody;
    bodyB?: IPhysicsBody;
    pointA?: IPoint;
    pointB?: IPoint;
    length?: number;
    stiffness: number;
    damping: number;
    render?: {
        visible: boolean;
        color: string;
        lineWidth: number;
    };
}

/**
 * 碰撞响应配置
 */
export interface ICollisionResponse {
    /** 碰撞回调函数 */
    onCollision?: (event: ICollisionEvent) => void;
    /** 碰撞音效 */
    playSound?: boolean;
    /** 粒子效果 */
    createParticles?: boolean;
    /** 震动反馈 */
    vibration?: boolean;
}

/**
 * 物理交互系统类
 * 处理鼠标/触摸交互、碰撞响应和约束系统
 */
export class PhysicsInteractionSystem {
    private physicsEngine: IPhysicsEngine;
    private config: IInteractionConfig;
    private constraints: Map<string, IConstraint> = new Map();
    private collisionResponses: Map<string, ICollisionResponse> = new Map();

    // 交互状态
    private isInteracting = false;
    private interactionPoint: IPoint = { x: 0, y: 0 };
    private draggedBody: IPhysicsBody | null = null;
    private dragConstraint: IConstraint | null = null;

    // 性能优化
    private lastInteractionTime = 0;
    private interactionThrottle = 16; // 60fps
    private spatialGrid: Map<string, IPhysicsBody[]> = new Map();
    private gridSize = 100;

    constructor(
        physicsEngine: IPhysicsEngine,
        config: Partial<IInteractionConfig> = {},
    ) {
        this.physicsEngine = physicsEngine;
        this.config = {
            enableMouse: true,
            enableTouch: true,
            forceStrength: 0.001,
            interactionRadius: 50,
            showInteractionArea: false,
            dragDamping: 0.9,
            ...config,
        };

        this.initializeInteractionSystem();
    }

    /**
     * 初始化交互系统
     */
    private initializeInteractionSystem(): void {
        // 设置碰撞事件监听
        this.setupCollisionHandling();

        // 初始化空间分割网格
        this.initializeSpatialGrid();

        console.log("物理交互系统初始化完成", this.config);
    }

    /**
     * 设置碰撞处理
     */
    private setupCollisionHandling(): void {
        // 这里需要与物理引擎的碰撞事件系统集成
        // 由于我们使用的是接口，具体实现会在物理引擎中处理
        console.log("碰撞处理系统已设置");
    }

    /**
     * 初始化空间分割网格（用于性能优化）
     */
    private initializeSpatialGrid(): void {
        this.spatialGrid.clear();
        console.log("空间分割网格已初始化");
    }

    /**
     * 更新空间网格
     */
    private updateSpatialGrid(bodies: IPhysicsBody[]): void {
        this.spatialGrid.clear();

        bodies.forEach((body) => {
            const gridX = Math.floor(body.position.x / this.gridSize);
            const gridY = Math.floor(body.position.y / this.gridSize);
            const key = `${gridX},${gridY}`;

            if (!this.spatialGrid.has(key)) {
                this.spatialGrid.set(key, []);
            }
            this.spatialGrid.get(key)!.push(body);
        });
    }

    /**
     * 获取指定区域内的物理体
     */
    private getBodiesInRadius(center: IPoint, radius: number): IPhysicsBody[] {
        const bodies: IPhysicsBody[] = [];
        const gridRadius = Math.ceil(radius / this.gridSize);
        const centerGridX = Math.floor(center.x / this.gridSize);
        const centerGridY = Math.floor(center.y / this.gridSize);

        for (
            let x = centerGridX - gridRadius;
            x <= centerGridX + gridRadius;
            x++
        ) {
            for (
                let y = centerGridY - gridRadius;
                y <= centerGridY + gridRadius;
                y++
            ) {
                const key = `${x},${y}`;
                const gridBodies = this.spatialGrid.get(key) || [];

                gridBodies.forEach((body) => {
                    const distance = this.calculateDistance(
                        center,
                        body.position,
                    );
                    if (distance <= radius) {
                        bodies.push(body);
                    }
                });
            }
        }

        return bodies;
    }

    /**
     * 计算两点间距离
     */
    private calculateDistance(pointA: IPoint, pointB: IPoint): number {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 开始鼠标交互
     */
    startMouseInteraction(position: IPoint, _event?: MouseEvent): void {
        if (!this.config.enableMouse) return;

        this.isInteracting = true;
        this.interactionPoint = { ...position };

        // 查找交互范围内的物理体
        const nearbyBodies = this.getBodiesInRadius(
            position,
            this.config.interactionRadius,
        );

        // 选择最近的非静态物理体进行拖拽
        let closestBody: IPhysicsBody | null = null;
        let closestDistance = Infinity;

        nearbyBodies.forEach((body) => {
            if (!body.isStatic) {
                const distance = this.calculateDistance(
                    position,
                    body.position,
                );
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestBody = body;
                }
            }
        });

        if (closestBody) {
            this.startDragging(closestBody, position);
        } else {
            // 如果没有找到物理体，应用推力效果
            this.applyForceAtPosition(position);
        }

        console.log("开始鼠标交互", { position, bodyFound: !!closestBody });
    }

    /**
     * 更新鼠标交互
     */
    updateMouseInteraction(position: IPoint): void {
        if (!this.isInteracting || !this.config.enableMouse) return;

        const currentTime = performance.now();
        if (currentTime - this.lastInteractionTime < this.interactionThrottle) {
            return;
        }
        this.lastInteractionTime = currentTime;

        this.interactionPoint = { ...position };

        if (this.draggedBody && this.dragConstraint) {
            // 更新拖拽约束的目标位置
            this.updateDragConstraint(position);
        } else {
            // 应用连续推力
            this.applyForceAtPosition(position);
        }
    }

    /**
     * 结束鼠标交互
     */
    endMouseInteraction(): void {
        if (!this.config.enableMouse) return;

        this.isInteracting = false;

        if (this.dragConstraint) {
            this.physicsEngine.removeConstraint(this.dragConstraint.id);
            this.dragConstraint = null;
        }

        this.draggedBody = null;

        console.log("结束鼠标交互");
    }

    /**
     * 开始触摸交互
     */
    startTouchInteraction(touches: IPoint[]): void {
        if (!this.config.enableTouch || touches.length === 0) return;

        // 处理单点触摸
        if (touches.length === 1) {
            this.startMouseInteraction(touches[0]!);
            return;
        }

        // 处理多点触摸
        this.handleMultiTouch(touches);
    }

    /**
     * 更新触摸交互
     */
    updateTouchInteraction(touches: IPoint[]): void {
        if (!this.config.enableTouch || touches.length === 0) return;

        if (touches.length === 1) {
            this.updateMouseInteraction(touches[0]!);
            return;
        }

        this.handleMultiTouch(touches);
    }

    /**
     * 结束触摸交互
     */
    endTouchInteraction(): void {
        if (!this.config.enableTouch) return;
        this.endMouseInteraction();
    }

    /**
     * 处理多点触摸
     */
    private handleMultiTouch(touches: IPoint[]): void {
        this.isInteracting = true;

        if (touches.length === 2) {
            // 双指缩放或旋转
            const center = {
                x: (touches[0]!.x + touches[1]!.x) / 2,
                y: (touches[0]!.y + touches[1]!.y) / 2,
            };

            this.interactionPoint = center;

            // 在中心点应用力
            this.applyForceAtPosition(center, this.config.forceStrength * 2);
        }
    }

    /**
     * 开始拖拽物理体
     */
    private startDragging(body: IPhysicsBody, _position: IPoint): void {
        this.draggedBody = body;

        // 创建拖拽约束
        this.dragConstraint = {
            id: `drag_${Date.now()}`,
            bodyA: body,
            bodyB: body, // 临时设置，实际会连接到鼠标位置
            length: 0,
            stiffness: 0.8,
            damping: this.config.dragDamping,
        };

        this.physicsEngine.addConstraint(this.dragConstraint);

        console.log("开始拖拽物理体", body.id);
    }

    /**
     * 更新拖拽约束
     */
    private updateDragConstraint(_position: IPoint): void {
        if (!this.dragConstraint || !this.draggedBody) return;

        // 这里需要更新约束的目标位置
        // 具体实现取决于物理引擎的约束系统
        console.log("更新拖拽约束", _position);
    }

    /**
     * 在指定位置应用力
     */
    private applyForceAtPosition(
        position: IPoint,
        forceMultiplier: number = 1,
    ): void {
        const nearbyBodies = this.getBodiesInRadius(
            position,
            this.config.interactionRadius,
        );

        nearbyBodies.forEach((body) => {
            if (body.isStatic) return;

            const distance = this.calculateDistance(position, body.position);
            const maxDistance = this.config.interactionRadius;

            if (distance < maxDistance) {
                // 计算力的方向和强度
                const forceDirection = {
                    x: body.position.x - position.x,
                    y: body.position.y - position.y,
                };

                // 归一化方向向量
                const magnitude = Math.sqrt(
                    forceDirection.x * forceDirection.x +
                        forceDirection.y * forceDirection.y,
                );

                if (magnitude > 0) {
                    forceDirection.x /= magnitude;
                    forceDirection.y /= magnitude;

                    // 计算力的强度（距离越近力越大）
                    const forceStrength =
                        (1 - distance / maxDistance) *
                        this.config.forceStrength *
                        forceMultiplier;

                    // 应用力到物理体
                    const force = {
                        x: forceDirection.x * forceStrength,
                        y: forceDirection.y * forceStrength,
                    };

                    this.applyForceToBody(body, force);
                }
            }
        });
    }

    /**
     * 对物理体应用力
     */
    private applyForceToBody(body: IPhysicsBody, force: IPoint): void {
        // 更新物理体的速度
        body.velocity.x += force.x / body.mass;
        body.velocity.y += force.y / body.mass;

        // 限制最大速度
        const maxVelocity = 500;
        const velocityMagnitude = Math.sqrt(
            body.velocity.x * body.velocity.x +
                body.velocity.y * body.velocity.y,
        );

        if (velocityMagnitude > maxVelocity) {
            const scale = maxVelocity / velocityMagnitude;
            body.velocity.x *= scale;
            body.velocity.y *= scale;
        }
    }

    /**
     * 创建约束
     */
    createConstraint(config: IConstraintConfig): string {
        const constraintId = `constraint_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const constraint: IConstraint = {
            id: constraintId,
            bodyA: config.bodyA,
            bodyB: config.bodyB || config.bodyA,
            length: config.length || 0,
            stiffness: config.stiffness,
            damping: config.damping,
        };

        this.constraints.set(constraintId, constraint);
        this.physicsEngine.addConstraint(constraint);

        console.log(`创建约束: ${constraintId} (${config.type})`);
        return constraintId;
    }

    /**
     * 移除约束
     */
    removeConstraint(constraintId: string): void {
        const constraint = this.constraints.get(constraintId);
        if (constraint) {
            this.physicsEngine.removeConstraint(constraintId);
            this.constraints.delete(constraintId);
            console.log(`移除约束: ${constraintId}`);
        }
    }

    /**
     * 创建弹簧约束
     */
    createSpringConstraint(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        restLength?: number,
        stiffness: number = 0.5,
        damping: number = 0.1,
    ): string {
        const distance = this.calculateDistance(bodyA.position, bodyB.position);

        return this.createConstraint({
            type: ConstraintType.SPRING,
            bodyA,
            bodyB,
            length: restLength || distance,
            stiffness,
            damping,
            render: {
                visible: true,
                color: "#3182ce",
                lineWidth: 2,
            },
        });
    }

    /**
     * 创建绳索约束
     */
    createRopeConstraint(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        maxLength?: number,
        stiffness: number = 1.0,
        damping: number = 0.05,
    ): string {
        const distance = this.calculateDistance(bodyA.position, bodyB.position);

        return this.createConstraint({
            type: ConstraintType.ROPE,
            bodyA,
            bodyB,
            length: maxLength || distance,
            stiffness,
            damping,
            render: {
                visible: true,
                color: "#d69e2e",
                lineWidth: 3,
            },
        });
    }

    /**
     * 注册碰撞响应
     */
    registerCollisionResponse(
        bodyId: string,
        response: ICollisionResponse,
    ): void {
        this.collisionResponses.set(bodyId, response);
        console.log(`注册碰撞响应: ${bodyId}`);
    }

    /**
     * 移除碰撞响应
     */
    removeCollisionResponse(bodyId: string): void {
        this.collisionResponses.delete(bodyId);
        console.log(`移除碰撞响应: ${bodyId}`);
    }

    /**
     * 处理碰撞事件
     */
    handleCollision(event: ICollisionEvent): void {
        const responseA = this.collisionResponses.get(event.bodyA.id);
        const responseB = this.collisionResponses.get(event.bodyB.id);

        // 执行碰撞回调
        if (responseA?.onCollision) {
            responseA.onCollision(event);
        }
        if (responseB?.onCollision) {
            responseB.onCollision(event);
        }

        // 播放音效
        if (responseA?.playSound || responseB?.playSound) {
            this.playCollisionSound(event);
        }

        // 创建粒子效果
        if (responseA?.createParticles || responseB?.createParticles) {
            this.createCollisionParticles(event);
        }

        // 震动反馈
        if (responseA?.vibration || responseB?.vibration) {
            this.triggerVibration(event);
        }
    }

    /**
     * 播放碰撞音效
     */
    private playCollisionSound(event: ICollisionEvent): void {
        // 根据碰撞强度选择音效
        const intensity = Math.min(event.impulse, 1.0);
        console.log(`播放碰撞音效，强度: ${intensity}`);

        // 这里可以集成 Web Audio API 或音频库
    }

    /**
     * 创建碰撞粒子效果
     */
    private createCollisionParticles(event: ICollisionEvent): void {
        const particleCount = Math.floor(event.impulse * 10) + 5;
        console.log(
            `创建碰撞粒子效果，数量: ${particleCount}`,
            event.contactPoint,
        );

        // 这里可以集成粒子系统
    }

    /**
     * 触发震动反馈
     */
    private triggerVibration(event: ICollisionEvent): void {
        if ("vibrate" in navigator) {
            const intensity = Math.floor(event.impulse * 100) + 50;
            navigator.vibrate(intensity);
        }
    }

    /**
     * 更新交互系统
     */
    update(bodies: IPhysicsBody[]): void {
        // 更新空间网格
        this.updateSpatialGrid(bodies);

        // 处理约束渲染等
        this.updateConstraints();
    }

    /**
     * 更新约束系统
     */
    private updateConstraints(): void {
        // 这里可以添加约束的更新逻辑
        // 比如检查约束是否需要断裂等
    }

    /**
     * 获取交互配置
     */
    getConfig(): IInteractionConfig {
        return { ...this.config };
    }

    /**
     * 更新交互配置
     */
    updateConfig(newConfig: Partial<IInteractionConfig>): void {
        this.config = { ...this.config, ...newConfig };
        console.log("交互配置已更新", this.config);
    }

    /**
     * 获取当前交互状态
     */
    getInteractionState() {
        return {
            isInteracting: this.isInteracting,
            interactionPoint: { ...this.interactionPoint },
            draggedBody: this.draggedBody?.id || null,
            constraintCount: this.constraints.size,
        };
    }

    /**
     * 销毁交互系统
     */
    destroy(): void {
        // 清理所有约束
        this.constraints.forEach((_constraint, id) => {
            this.physicsEngine.removeConstraint(id);
        });
        this.constraints.clear();

        // 清理碰撞响应
        this.collisionResponses.clear();

        // 重置状态
        this.isInteracting = false;
        this.draggedBody = null;
        this.dragConstraint = null;
        this.spatialGrid.clear();

        console.log("物理交互系统已销毁");
    }
}
