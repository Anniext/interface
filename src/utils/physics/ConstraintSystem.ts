// 约束系统实现

import type {
    IPhysicsBody,
    IConstraint,
    IPhysicsEngine,
} from "@/types/physics";
import type { IPoint } from "@/types/common";

/**
 * 约束类型枚举
 */
export enum ConstraintType {
    DISTANCE = "distance", // 距离约束
    SPRING = "spring", // 弹簧约束
    ROPE = "rope", // 绳索约束
    PIN = "pin", // 固定约束
    REVOLUTE = "revolute", // 旋转约束
    PRISMATIC = "prismatic", // 滑动约束
    WELD = "weld", // 焊接约束
}

/**
 * 约束配置接口
 */
export interface IConstraintConfig {
    /** 约束类型 */
    type: ConstraintType;
    /** 约束的第一个物理体 */
    bodyA: IPhysicsBody;
    /** 约束的第二个物理体（可选，用于固定约束） */
    bodyB?: IPhysicsBody;
    /** 在物理体A上的连接点 */
    pointA?: IPoint;
    /** 在物理体B上的连接点 */
    pointB?: IPoint;
    /** 约束长度 */
    length?: number;
    /** 刚度系数 */
    stiffness: number;
    /** 阻尼系数 */
    damping: number;
    /** 最小长度（用于绳索约束） */
    minLength?: number;
    /** 最大长度（用于弹簧约束） */
    maxLength?: number;
    /** 是否可断裂 */
    breakable?: boolean;
    /** 断裂力阈值 */
    breakForce?: number;
    /** 渲染配置 */
    render?: {
        visible: boolean;
        color: string;
        lineWidth: number;
        showAnchors?: boolean;
    };
}

/**
 * 约束状态
 */
export interface IConstraintState {
    /** 当前长度 */
    currentLength: number;
    /** 当前力 */
    currentForce: number;
    /** 是否已断裂 */
    broken: boolean;
    /** 约束能量 */
    energy: number;
}

/**
 * 约束系统类
 * 处理各种物理约束的创建、更新和渲染
 */
export class ConstraintSystem {
    private physicsEngine: IPhysicsEngine;
    private constraints: Map<string, IConstraint & IConstraintConfig> =
        new Map();
    private constraintStates: Map<string, IConstraintState> = new Map();
    private brokenConstraints: Set<string> = new Set();

    constructor(physicsEngine: IPhysicsEngine) {
        this.physicsEngine = physicsEngine;
        console.log("约束系统初始化完成");
    }

    /**
     * 创建约束
     */
    createConstraint(config: IConstraintConfig): string {
        const constraintId = `constraint_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        // 计算初始长度
        const initialLength =
            config.length ||
            this.calculateDistance(
                this.getWorldPoint(
                    config.bodyA,
                    config.pointA || { x: 0, y: 0 },
                ),
                config.bodyB
                    ? this.getWorldPoint(
                          config.bodyB,
                          config.pointB || { x: 0, y: 0 },
                      )
                    : config.pointB || { x: 0, y: 0 },
            );

        const constraint: IConstraint & IConstraintConfig = {
            id: constraintId,
            bodyA: config.bodyA,
            bodyB: config.bodyB,
            length: initialLength,
            stiffness: config.stiffness,
            damping: config.damping,
            ...config,
        };

        // 初始化约束状态
        const state: IConstraintState = {
            currentLength: initialLength,
            currentForce: 0,
            broken: false,
            energy: 0,
        };

        this.constraints.set(constraintId, constraint);
        this.constraintStates.set(constraintId, state);

        // 添加到物理引擎
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
            this.constraintStates.delete(constraintId);
            this.brokenConstraints.delete(constraintId);
            console.log(`移除约束: ${constraintId}`);
        }
    }

    /**
     * 获取世界坐标点
     */
    private getWorldPoint(body: IPhysicsBody, localPoint: IPoint): IPoint {
        const cos = Math.cos(body.angle);
        const sin = Math.sin(body.angle);

        return {
            x: body.position.x + localPoint.x * cos - localPoint.y * sin,
            y: body.position.y + localPoint.x * sin + localPoint.y * cos,
        };
    }

    /**
     * 计算两点间距离
     */
    private calculateDistance(pointA: IPoint, pointB: IPoint): number {
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 更新约束系统
     */
    update(deltaTime: number): void {
        this.constraints.forEach((constraint, constraintId) => {
            if (this.brokenConstraints.has(constraintId)) return;

            const state = this.constraintStates.get(constraintId)!;

            // 更新约束状态
            this.updateConstraintState(constraint, state);

            // 检查是否需要断裂
            if (
                constraint.breakable &&
                state.currentForce > (constraint.breakForce || 1000)
            ) {
                this.breakConstraint(constraintId);
                return;
            }

            // 应用约束力
            this.applyConstraintForces(constraint, state, deltaTime);
        });
    }

    /**
     * 更新约束状态
     */
    private updateConstraintState(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
    ): void {
        const pointA = this.getWorldPoint(
            constraint.bodyA,
            constraint.pointA || { x: 0, y: 0 },
        );
        const pointB = constraint.bodyB
            ? this.getWorldPoint(
                  constraint.bodyB,
                  constraint.pointB || { x: 0, y: 0 },
              )
            : constraint.pointB || { x: 0, y: 0 };

        state.currentLength = this.calculateDistance(pointA, pointB);

        // 计算约束力（基于胡克定律）
        const lengthDifference = state.currentLength - constraint.length;
        state.currentForce = Math.abs(lengthDifference * constraint.stiffness);

        // 计算约束能量
        state.energy =
            0.5 * constraint.stiffness * lengthDifference * lengthDifference;
    }

    /**
     * 应用约束力
     */
    private applyConstraintForces(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        switch (constraint.type) {
            case ConstraintType.DISTANCE:
                this.applyDistanceConstraint(constraint, state, deltaTime);
                break;
            case ConstraintType.SPRING:
                this.applySpringConstraint(constraint, state, deltaTime);
                break;
            case ConstraintType.ROPE:
                this.applyRopeConstraint(constraint, state, deltaTime);
                break;
            case ConstraintType.PIN:
                this.applyPinConstraint(constraint, state, deltaTime);
                break;
            case ConstraintType.REVOLUTE:
                this.applyRevoluteConstraint(constraint, state, deltaTime);
                break;
            case ConstraintType.PRISMATIC:
                this.applyPrismaticConstraint(constraint, state, deltaTime);
                break;
            case ConstraintType.WELD:
                this.applyWeldConstraint(constraint, state, deltaTime);
                break;
        }
    }

    /**
     * 应用距离约束
     */
    private applyDistanceConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        const pointA = this.getWorldPoint(
            constraint.bodyA,
            constraint.pointA || { x: 0, y: 0 },
        );
        const pointB = constraint.bodyB
            ? this.getWorldPoint(
                  constraint.bodyB,
                  constraint.pointB || { x: 0, y: 0 },
              )
            : constraint.pointB || { x: 0, y: 0 };

        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (currentDistance === 0) return;

        const difference = currentDistance - constraint.length;
        const percent = difference / currentDistance / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        // 应用位置修正
        if (!constraint.bodyA.isStatic) {
            constraint.bodyA.position.x += offsetX / constraint.bodyA.mass;
            constraint.bodyA.position.y += offsetY / constraint.bodyA.mass;
        }

        if (constraint.bodyB && !constraint.bodyB.isStatic) {
            constraint.bodyB.position.x -= offsetX / constraint.bodyB.mass;
            constraint.bodyB.position.y -= offsetY / constraint.bodyB.mass;
        }
    }

    /**
     * 应用弹簧约束
     */
    private applySpringConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        const pointA = this.getWorldPoint(
            constraint.bodyA,
            constraint.pointA || { x: 0, y: 0 },
        );
        const pointB = constraint.bodyB
            ? this.getWorldPoint(
                  constraint.bodyB,
                  constraint.pointB || { x: 0, y: 0 },
              )
            : constraint.pointB || { x: 0, y: 0 };

        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        // 计算弹簧力
        const springForce =
            (distance - constraint.length) * constraint.stiffness;
        const forceX = (dx / distance) * springForce;
        const forceY = (dy / distance) * springForce;

        // 计算阻尼力
        const relativeVelocityX = constraint.bodyB
            ? constraint.bodyB.velocity.x - constraint.bodyA.velocity.x
            : -constraint.bodyA.velocity.x;
        const relativeVelocityY = constraint.bodyB
            ? constraint.bodyB.velocity.y - constraint.bodyA.velocity.y
            : -constraint.bodyA.velocity.y;

        const dampingForceX = relativeVelocityX * constraint.damping;
        const dampingForceY = relativeVelocityY * constraint.damping;

        const totalForceX = forceX + dampingForceX;
        const totalForceY = forceY + dampingForceY;

        // 应用力到物理体
        if (!constraint.bodyA.isStatic) {
            constraint.bodyA.velocity.x +=
                ((totalForceX / constraint.bodyA.mass) * deltaTime) / 1000;
            constraint.bodyA.velocity.y +=
                ((totalForceY / constraint.bodyA.mass) * deltaTime) / 1000;
        }

        if (constraint.bodyB && !constraint.bodyB.isStatic) {
            constraint.bodyB.velocity.x -=
                ((totalForceX / constraint.bodyB.mass) * deltaTime) / 1000;
            constraint.bodyB.velocity.y -=
                ((totalForceY / constraint.bodyB.mass) * deltaTime) / 1000;
        }
    }

    /**
     * 应用绳索约束
     */
    private applyRopeConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        // 绳索约束只在拉伸时起作用
        if (state.currentLength <= constraint.length) return;

        // 应用距离约束
        this.applyDistanceConstraint(constraint, state, deltaTime);
    }

    /**
     * 应用固定约束
     */
    private applyPinConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        const targetPoint = constraint.pointB || { x: 0, y: 0 };
        const currentPoint = this.getWorldPoint(
            constraint.bodyA,
            constraint.pointA || { x: 0, y: 0 },
        );

        const dx = targetPoint.x - currentPoint.x;
        const dy = targetPoint.y - currentPoint.y;

        // 强制位置修正
        const correctionStrength = (constraint.stiffness * deltaTime) / 1000;

        if (!constraint.bodyA.isStatic) {
            constraint.bodyA.position.x += dx * correctionStrength;
            constraint.bodyA.position.y += dy * correctionStrength;

            // 应用阻尼
            constraint.bodyA.velocity.x *=
                1 - (constraint.damping * deltaTime) / 1000;
            constraint.bodyA.velocity.y *=
                1 - (constraint.damping * deltaTime) / 1000;
        }
    }

    /**
     * 应用旋转约束
     */
    private applyRevoluteConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        // 旋转约束允许旋转但限制位移
        this.applyDistanceConstraint(constraint, state, deltaTime);
    }

    /**
     * 应用滑动约束
     */
    private applyPrismaticConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        // 滑动约束允许沿特定轴移动
        // 这里简化为距离约束
        this.applyDistanceConstraint(constraint, state, deltaTime);
    }

    /**
     * 应用焊接约束
     */
    private applyWeldConstraint(
        constraint: IConstraint & IConstraintConfig,
        state: IConstraintState,
        deltaTime: number,
    ): void {
        // 焊接约束固定位置和角度
        this.applyDistanceConstraint(constraint, state, deltaTime);

        // 同步角度
        if (
            constraint.bodyB &&
            !constraint.bodyA.isStatic &&
            !constraint.bodyB.isStatic
        ) {
            const angleDiff = constraint.bodyB.angle - constraint.bodyA.angle;
            const angleCorrection =
                (angleDiff * constraint.stiffness * deltaTime) / 1000;

            constraint.bodyA.angularVelocity +=
                angleCorrection / constraint.bodyA.mass;
            constraint.bodyB.angularVelocity -=
                angleCorrection / constraint.bodyB.mass;
        }
    }

    /**
     * 断裂约束
     */
    private breakConstraint(constraintId: string): void {
        this.brokenConstraints.add(constraintId);
        const state = this.constraintStates.get(constraintId);
        if (state) {
            state.broken = true;
        }

        console.log(`约束断裂: ${constraintId}`);

        // 可以在这里添加断裂效果，如粒子、音效等
        this.onConstraintBreak(constraintId);
    }

    /**
     * 约束断裂回调
     */
    private onConstraintBreak(constraintId: string): void {
        // 可以触发粒子效果、音效等
        console.log(`约束断裂效果: ${constraintId}`);
    }

    /**
     * 创建弹簧约束
     */
    createSpring(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        options: {
            length?: number;
            stiffness?: number;
            damping?: number;
            pointA?: IPoint;
            pointB?: IPoint;
        } = {},
    ): string {
        return this.createConstraint({
            type: ConstraintType.SPRING,
            bodyA,
            bodyB,
            stiffness: options.stiffness || 0.5,
            damping: options.damping || 0.1,
            length: options.length,
            pointA: options.pointA,
            pointB: options.pointB,
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
    createRope(
        bodyA: IPhysicsBody,
        bodyB: IPhysicsBody,
        options: {
            maxLength?: number;
            stiffness?: number;
            damping?: number;
            pointA?: IPoint;
            pointB?: IPoint;
        } = {},
    ): string {
        return this.createConstraint({
            type: ConstraintType.ROPE,
            bodyA,
            bodyB,
            stiffness: options.stiffness || 1.0,
            damping: options.damping || 0.05,
            length: options.maxLength,
            pointA: options.pointA,
            pointB: options.pointB,
            render: {
                visible: true,
                color: "#d69e2e",
                lineWidth: 3,
            },
        });
    }

    /**
     * 创建固定约束
     */
    createPin(
        body: IPhysicsBody,
        worldPoint: IPoint,
        options: {
            stiffness?: number;
            damping?: number;
            localPoint?: IPoint;
        } = {},
    ): string {
        return this.createConstraint({
            type: ConstraintType.PIN,
            bodyA: body,
            pointB: worldPoint,
            stiffness: options.stiffness || 1.0,
            damping: options.damping || 0.1,
            pointA: options.localPoint,
            render: {
                visible: true,
                color: "#e53e3e",
                lineWidth: 4,
                showAnchors: true,
            },
        });
    }

    /**
     * 获取约束信息
     */
    getConstraint(
        constraintId: string,
    ): (IConstraint & IConstraintConfig) | null {
        return this.constraints.get(constraintId) || null;
    }

    /**
     * 获取约束状态
     */
    getConstraintState(constraintId: string): IConstraintState | null {
        return this.constraintStates.get(constraintId) || null;
    }

    /**
     * 获取所有约束
     */
    getAllConstraints(): Map<string, IConstraint & IConstraintConfig> {
        return new Map(this.constraints);
    }

    /**
     * 获取约束统计信息
     */
    getStats() {
        return {
            totalConstraints: this.constraints.size,
            brokenConstraints: this.brokenConstraints.size,
            activeConstraints:
                this.constraints.size - this.brokenConstraints.size,
            totalEnergy: Array.from(this.constraintStates.values()).reduce(
                (sum, state) => sum + state.energy,
                0,
            ),
        };
    }

    /**
     * 渲染约束
     */
    render(ctx: CanvasRenderingContext2D): void {
        this.constraints.forEach((constraint, constraintId) => {
            if (this.brokenConstraints.has(constraintId)) return;
            if (!constraint.render?.visible) return;

            const pointA = this.getWorldPoint(
                constraint.bodyA,
                constraint.pointA || { x: 0, y: 0 },
            );
            const pointB = constraint.bodyB
                ? this.getWorldPoint(
                      constraint.bodyB,
                      constraint.pointB || { x: 0, y: 0 },
                  )
                : constraint.pointB || { x: 0, y: 0 };

            ctx.save();

            // 设置样式
            ctx.strokeStyle = constraint.render.color;
            ctx.lineWidth = constraint.render.lineWidth;

            // 根据约束类型绘制不同样式
            switch (constraint.type) {
                case ConstraintType.SPRING:
                    this.renderSpring(ctx, pointA, pointB);
                    break;
                case ConstraintType.ROPE:
                    this.renderRope(ctx, pointA, pointB);
                    break;
                default:
                    this.renderLine(ctx, pointA, pointB);
                    break;
            }

            // 绘制锚点
            if (constraint.render.showAnchors) {
                this.renderAnchor(ctx, pointA);
                this.renderAnchor(ctx, pointB);
            }

            ctx.restore();
        });
    }

    /**
     * 渲染弹簧
     */
    private renderSpring(
        ctx: CanvasRenderingContext2D,
        pointA: IPoint,
        pointB: IPoint,
    ): void {
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const coils = 8;
        const amplitude = 5;

        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);

        for (let i = 0; i <= coils * 4; i++) {
            const t = i / (coils * 4);
            const x = pointA.x + dx * t;
            const y = pointA.y + dy * t;

            // 添加波浪效果
            const perpX =
                (-dy / distance) * amplitude * Math.sin((i * Math.PI) / 2);
            const perpY =
                (dx / distance) * amplitude * Math.sin((i * Math.PI) / 2);

            ctx.lineTo(x + perpX, y + perpY);
        }

        ctx.stroke();
    }

    /**
     * 渲染绳索
     */
    private renderRope(
        ctx: CanvasRenderingContext2D,
        pointA: IPoint,
        pointB: IPoint,
    ): void {
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    /**
     * 渲染直线
     */
    private renderLine(
        ctx: CanvasRenderingContext2D,
        pointA: IPoint,
        pointB: IPoint,
    ): void {
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
    }

    /**
     * 渲染锚点
     */
    private renderAnchor(ctx: CanvasRenderingContext2D, point: IPoint): void {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
    }

    /**
     * 销毁约束系统
     */
    destroy(): void {
        // 移除所有约束
        this.constraints.forEach((_, constraintId) => {
            this.physicsEngine.removeConstraint(constraintId);
        });

        this.constraints.clear();
        this.constraintStates.clear();
        this.brokenConstraints.clear();

        console.log("约束系统已销毁");
    }
}
