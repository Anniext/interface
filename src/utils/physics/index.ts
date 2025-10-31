// 物理引擎模块导出

export { MatterPhysicsEngine } from "./MatterPhysicsEngine";
export {
    PhysicsBodyFactory,
    physicsBodyFactory,
    createPhysicsBody,
    PhysicsMaterials,
} from "./PhysicsBodyFactory";
export {
    PhysicsLifecycleManager,
    type IPhysicsLifecycleConfig,
} from "./PhysicsLifecycleManager";
export { PhysicsInteractionSystem } from "./PhysicsInteractionSystem";
export { CollisionSystem } from "./CollisionSystem";
export { ConstraintSystem, ConstraintType } from "./ConstraintSystem";

// 重新导出类型定义
export type {
    IPhysicsEngine,
    IPhysicsWorldConfig,
    IPhysicsBody,
    ICircleBody,
    IRectangleBody,
    IPolygonBody,
    ICollisionEvent,
    IConstraint,
    IPhysicsDebugInfo,
    IPhysicsMaterial,
    IPhysicsBodyFactory,
    PhysicsBodyType,
} from "@/types/physics";

/**
 * 创建默认的物理引擎实例
 * @param config 物理世界配置
 * @returns 物理引擎实例
 */
export function createPhysicsEngine(config?: any) {
    const engine = new MatterPhysicsEngine();

    const defaultConfig = {
        gravity: { x: 0, y: 1 },
        enableCollision: true,
        timeStep: 16.67, // 60 FPS
        velocityIterations: 4,
        positionIterations: 6,
        ...config,
    };

    engine.init(defaultConfig);
    return engine;
}

/**
 * 创建带生命周期管理的物理引擎
 * @param worldConfig 物理世界配置
 * @param lifecycleConfig 生命周期配置
 * @returns 物理引擎和生命周期管理器
 */
export function createManagedPhysicsEngine(
    worldConfig?: any,
    lifecycleConfig?: any,
) {
    const engine = createPhysicsEngine(worldConfig);
    const lifecycleManager = new PhysicsLifecycleManager(
        engine,
        lifecycleConfig,
    );

    return {
        engine,
        lifecycleManager,
        factory: physicsBodyFactory,
    };
}

/**
 * 创建完整的物理交互系统
 * @param worldConfig 物理世界配置
 * @param lifecycleConfig 生命周期配置
 * @param interactionConfig 交互配置
 * @returns 完整的物理系统
 */
export function createPhysicsInteractionSystem(
    worldConfig?: any,
    lifecycleConfig?: any,
    interactionConfig?: any,
) {
    const engine = createPhysicsEngine(worldConfig);
    const lifecycleManager = new PhysicsLifecycleManager(
        engine,
        lifecycleConfig,
    );
    const interactionSystem = new PhysicsInteractionSystem(
        engine,
        interactionConfig,
    );
    const collisionSystem = new CollisionSystem(engine);
    const constraintSystem = new ConstraintSystem(engine);

    return {
        engine,
        lifecycleManager,
        interactionSystem,
        collisionSystem,
        constraintSystem,
        factory: physicsBodyFactory,
    };
}

/**
 * 物理引擎工具函数
 */
export const PhysicsUtils = {
    /**
     * 计算两点间距离
     */
    distance(
        p1: { x: number; y: number },
        p2: { x: number; y: number },
    ): number {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * 计算向量长度
     */
    vectorLength(vector: { x: number; y: number }): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    },

    /**
     * 归一化向量
     */
    normalize(vector: { x: number; y: number }): { x: number; y: number } {
        const length = this.vectorLength(vector);
        if (length === 0) return { x: 0, y: 0 };
        return { x: vector.x / length, y: vector.y / length };
    },

    /**
     * 向量点积
     */
    dotProduct(
        v1: { x: number; y: number },
        v2: { x: number; y: number },
    ): number {
        return v1.x * v2.x + v1.y * v2.y;
    },

    /**
     * 向量叉积（2D 中返回标量）
     */
    crossProduct(
        v1: { x: number; y: number },
        v2: { x: number; y: number },
    ): number {
        return v1.x * v2.y - v1.y * v2.x;
    },

    /**
     * 角度转弧度
     */
    degToRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    },

    /**
     * 弧度转角度
     */
    radToDeg(radians: number): number {
        return radians * (180 / Math.PI);
    },

    /**
     * 限制值在指定范围内
     */
    clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * 线性插值
     */
    lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    },

    /**
     * 检查点是否在矩形内
     */
    pointInRect(
        point: { x: number; y: number },
        rect: { x: number; y: number; width: number; height: number },
    ): boolean {
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    },

    /**
     * 检查点是否在圆内
     */
    pointInCircle(
        point: { x: number; y: number },
        circle: { x: number; y: number; radius: number },
    ): boolean {
        const distance = this.distance(point, circle);
        return distance <= circle.radius;
    },

    /**
     * 生成随机位置
     */
    randomPosition(bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): { x: number; y: number } {
        return {
            x: bounds.x + Math.random() * bounds.width,
            y: bounds.y + Math.random() * bounds.height,
        };
    },

    /**
     * 生成随机速度
     */
    randomVelocity(
        minSpeed: number,
        maxSpeed: number,
    ): { x: number; y: number } {
        const angle = Math.random() * 2 * Math.PI;
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
        };
    },
};
