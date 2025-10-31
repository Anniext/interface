// 物理体工厂函数

import type {
    IPhysicsBodyFactory,
    ICircleBody,
    IRectangleBody,
    IPolygonBody,
    IPhysicsBody,
    IPhysicsMaterial,
} from "@/types/physics";
import { PhysicsBodyType } from "@/types/physics";
import type { IPoint } from "@/types/common";

/**
 * 预定义的物理材质
 */
export const PhysicsMaterials: Record<string, IPhysicsMaterial> = {
    // 默认材质
    default: {
        name: "default",
        density: 0.001,
        restitution: 0.3,
        friction: 0.1,
        frictionAir: 0.01,
    },
    // 弹性球材质
    bouncy: {
        name: "bouncy",
        density: 0.001,
        restitution: 0.9,
        friction: 0.1,
        frictionAir: 0.01,
    },
    // 冰面材质（低摩擦）
    ice: {
        name: "ice",
        density: 0.001,
        restitution: 0.1,
        friction: 0.001,
        frictionAir: 0.01,
    },
    // 橡胶材质
    rubber: {
        name: "rubber",
        density: 0.002,
        restitution: 0.8,
        friction: 0.8,
        frictionAir: 0.02,
    },
    // 金属材质
    metal: {
        name: "metal",
        density: 0.005,
        restitution: 0.2,
        friction: 0.3,
        frictionAir: 0.01,
    },
    // 木材材质
    wood: {
        name: "wood",
        density: 0.003,
        restitution: 0.4,
        friction: 0.6,
        frictionAir: 0.02,
    },
};

/**
 * 物理体工厂实现类
 * 提供创建各种物理体的便捷方法
 */
export class PhysicsBodyFactory implements IPhysicsBodyFactory {
    private static idCounter = 0;

    /**
     * 生成唯一 ID
     */
    private static generateId(prefix: string = "body"): string {
        return `${prefix}_${++this.idCounter}_${Date.now()}`;
    }

    /**
     * 应用材质属性到物理体
     */
    private static applyMaterial(
        body: Partial<IPhysicsBody>,
        material: IPhysicsMaterial,
    ): void {
        body.mass = body.mass || material.density * 100; // 简化质量计算
        body.restitution = body.restitution ?? material.restitution;
        body.friction = body.friction ?? material.friction;
    }

    /**
     * 创建圆形物理体
     * @param x X 坐标
     * @param y Y 坐标
     * @param radius 半径
     * @param options 可选配置
     */
    createCircle(
        x: number,
        y: number,
        radius: number,
        options: Partial<ICircleBody> = {},
    ): ICircleBody {
        const id = options.id || PhysicsBodyFactory.generateId("circle");

        // 先检查是否有材质需要应用
        const materialName = (options as any).material;
        const material = materialName ? PhysicsMaterials[materialName] : null;

        const circleBody: ICircleBody = {
            id,
            type: PhysicsBodyType.CIRCLE,
            position: { x, y },
            velocity: { x: 0, y: 0 },
            mass: material ? material.density * 100 : 1,
            restitution: material ? material.restitution : 0.3,
            friction: material ? material.friction : 0.1,
            isStatic: false,
            isSleeping: false,
            angle: 0,
            angularVelocity: 0,
            radius,
            ...options,
        };

        return circleBody;
    }

    /**
     * 创建矩形物理体
     * @param x X 坐标
     * @param y Y 坐标
     * @param width 宽度
     * @param height 高度
     * @param options 可选配置
     */
    createRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        options: Partial<IRectangleBody> = {},
    ): IRectangleBody {
        const id = options.id || PhysicsBodyFactory.generateId("rectangle");

        // 先检查是否有材质需要应用
        const materialName = (options as any).material;
        const material = materialName ? PhysicsMaterials[materialName] : null;

        const rectangleBody: IRectangleBody = {
            id,
            type: PhysicsBodyType.RECTANGLE,
            position: { x, y },
            velocity: { x: 0, y: 0 },
            mass: material ? material.density * 100 : 1,
            restitution: material ? material.restitution : 0.3,
            friction: material ? material.friction : 0.1,
            isStatic: false,
            isSleeping: false,
            angle: 0,
            angularVelocity: 0,
            width,
            height,
            ...options,
        };

        return rectangleBody;
    }

    /**
     * 创建多边形物理体
     * @param x X 坐标
     * @param y Y 坐标
     * @param vertices 顶点数组
     * @param options 可选配置
     */
    createPolygon(
        x: number,
        y: number,
        vertices: IPoint[],
        options: Partial<IPolygonBody> = {},
    ): IPolygonBody {
        const id = options.id || PhysicsBodyFactory.generateId("polygon");

        // 先检查是否有材质需要应用
        const materialName = (options as any).material;
        const material = materialName ? PhysicsMaterials[materialName] : null;

        const polygonBody: IPolygonBody = {
            id,
            type: PhysicsBodyType.POLYGON,
            position: { x, y },
            velocity: { x: 0, y: 0 },
            mass: material ? material.density * 100 : 1,
            restitution: material ? material.restitution : 0.3,
            friction: material ? material.friction : 0.1,
            isStatic: false,
            isSleeping: false,
            angle: 0,
            angularVelocity: 0,
            vertices: [...vertices],
            ...options,
        };

        return polygonBody;
    }

    /**
     * 创建边界墙体
     * @param width 世界宽度
     * @param height 世界高度
     * @param thickness 墙体厚度
     */
    createBounds(
        width: number,
        height: number,
        thickness: number = 50,
    ): IPhysicsBody[] {
        const bounds: IPhysicsBody[] = [];

        // 上边界
        bounds.push(
            this.createRectangle(width / 2, -thickness / 2, width, thickness, {
                id: "bound_top",
                isStatic: true,
                restitution: 0.8,
                friction: 0.1,
            }),
        );

        // 下边界
        bounds.push(
            this.createRectangle(
                width / 2,
                height + thickness / 2,
                width,
                thickness,
                {
                    id: "bound_bottom",
                    isStatic: true,
                    restitution: 0.8,
                    friction: 0.1,
                },
            ),
        );

        // 左边界
        bounds.push(
            this.createRectangle(
                -thickness / 2,
                height / 2,
                thickness,
                height,
                {
                    id: "bound_left",
                    isStatic: true,
                    restitution: 0.8,
                    friction: 0.1,
                },
            ),
        );

        // 右边界
        bounds.push(
            this.createRectangle(
                width + thickness / 2,
                height / 2,
                thickness,
                height,
                {
                    id: "bound_right",
                    isStatic: true,
                    restitution: 0.8,
                    friction: 0.1,
                },
            ),
        );

        return bounds;
    }

    /**
     * 创建三角形物理体
     * @param x X 坐标
     * @param y Y 坐标
     * @param size 大小
     * @param options 可选配置
     */
    createTriangle(
        x: number,
        y: number,
        size: number,
        options: Partial<IPolygonBody> = {},
    ): IPolygonBody {
        const vertices: IPoint[] = [
            { x: 0, y: -size / 2 }, // 顶点
            { x: -size / 2, y: size / 2 }, // 左下
            { x: size / 2, y: size / 2 }, // 右下
        ];

        return this.createPolygon(x, y, vertices, {
            id: options.id || PhysicsBodyFactory.generateId("triangle"),
            ...options,
        });
    }

    /**
     * 创建正六边形物理体
     * @param x X 坐标
     * @param y Y 坐标
     * @param radius 外接圆半径
     * @param options 可选配置
     */
    createHexagon(
        x: number,
        y: number,
        radius: number,
        options: Partial<IPolygonBody> = {},
    ): IPolygonBody {
        const vertices: IPoint[] = [];
        const sides = 6;

        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            vertices.push({
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle),
            });
        }

        return this.createPolygon(x, y, vertices, {
            id: options.id || PhysicsBodyFactory.generateId("hexagon"),
            ...options,
        });
    }

    /**
     * 创建星形物理体
     * @param x X 坐标
     * @param y Y 坐标
     * @param outerRadius 外半径
     * @param innerRadius 内半径
     * @param points 星形点数
     * @param options 可选配置
     */
    createStar(
        x: number,
        y: number,
        outerRadius: number,
        innerRadius: number,
        points: number = 5,
        options: Partial<IPolygonBody> = {},
    ): IPolygonBody {
        const vertices: IPoint[] = [];

        for (let i = 0; i < points * 2; i++) {
            const angle = (i * Math.PI) / points;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            vertices.push({
                x: radius * Math.cos(angle - Math.PI / 2),
                y: radius * Math.sin(angle - Math.PI / 2),
            });
        }

        return this.createPolygon(x, y, vertices, {
            id: options.id || PhysicsBodyFactory.generateId("star"),
            ...options,
        });
    }

    /**
     * 创建复合物理体（多个物理体组合）
     * @param bodies 物理体数组
     * @param options 可选配置
     */
    createCompound(
        bodies: IPhysicsBody[],
        options: { id?: string; offset?: IPoint } = {},
    ): IPhysicsBody[] {
        const offset = options.offset || { x: 0, y: 0 };
        const compoundId =
            options.id || PhysicsBodyFactory.generateId("compound");

        return bodies.map((body, index) => ({
            ...body,
            id: `${compoundId}_part_${index}`,
            position: {
                x: body.position.x + offset.x,
                y: body.position.y + offset.y,
            },
        }));
    }
}

/**
 * 默认物理体工厂实例
 */
export const physicsBodyFactory = new PhysicsBodyFactory();

/**
 * 便捷的物理体创建函数
 */
export const createPhysicsBody = {
    circle: physicsBodyFactory.createCircle.bind(physicsBodyFactory),
    rectangle: physicsBodyFactory.createRectangle.bind(physicsBodyFactory),
    polygon: physicsBodyFactory.createPolygon.bind(physicsBodyFactory),
    triangle: physicsBodyFactory.createTriangle.bind(physicsBodyFactory),
    hexagon: physicsBodyFactory.createHexagon.bind(physicsBodyFactory),
    star: physicsBodyFactory.createStar.bind(physicsBodyFactory),
    bounds: physicsBodyFactory.createBounds.bind(physicsBodyFactory),
    compound: physicsBodyFactory.createCompound.bind(physicsBodyFactory),
};
