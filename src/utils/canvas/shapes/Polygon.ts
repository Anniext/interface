/**
 * 多边形类
 */

import type { IPolygon, IPoint } from "@/types";
import { Shape } from "./Shape";

export class Polygon extends Shape implements IPolygon {
    public vertices: IPoint[];

    constructor(
        config: Partial<IPolygon> & {
            scale?: IPoint;
            origin?: IPoint;
            velocity?: IPoint;
            angularVelocity?: number;
            strokeColor?: string;
            strokeWidth?: number;
            shadow?: {
                color: string;
                blur: number;
                offsetX: number;
                offsetY: number;
            };
        } = {},
    ) {
        super(config);
        this.vertices = config.vertices ?? [];
    }

    /**
     * 绘制多边形
     */
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.vertices.length < 3) return;

        ctx.beginPath();

        const firstVertex = this.vertices[0];
        if (firstVertex) {
            ctx.moveTo(firstVertex.x, firstVertex.y);
        }

        for (let i = 1; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            if (vertex) {
                ctx.lineTo(vertex.x, vertex.y);
            }
        }

        ctx.closePath();

        // 填充
        this.setFillStyle(ctx);
        ctx.fill();

        // 描边
        if (this.strokeWidth > 0) {
            this.setStrokeStyle(ctx);
            ctx.stroke();
        }
    }

    /**
     * 检查点是否在多边形内（射线投射算法）
     */
    isPointInside(x: number, y: number): boolean {
        // 将点转换到多边形的本地坐标系
        const localPoint = this.worldToLocal({ x, y });

        return this.pointInPolygon(localPoint, this.vertices);
    }

    /**
     * 点在多边形内检测（射线投射算法）
     */
    private pointInPolygon(point: IPoint, vertices: IPoint[]): boolean {
        let inside = false;
        const n = vertices.length;

        for (let i = 0, j = n - 1; i < n; j = i++) {
            const vi = vertices[i];
            const vj = vertices[j];

            if (!vi || !vj) continue;

            if (
                vi.y > point.y !== vj.y > point.y &&
                point.x <
                    ((vj.x - vi.x) * (point.y - vi.y)) / (vj.y - vi.y) + vi.x
            ) {
                inside = !inside;
            }
        }

        return inside;
    }

    /**
     * 世界坐标转本地坐标
     */
    private worldToLocal(worldPoint: IPoint): IPoint {
        // 平移
        let x = worldPoint.x - this.position.x;
        let y = worldPoint.y - this.position.y;

        // 旋转（逆变换）
        if (this.rotation !== 0) {
            const cos = Math.cos(-this.rotation);
            const sin = Math.sin(-this.rotation);
            const newX = x * cos - y * sin;
            const newY = x * sin + y * cos;
            x = newX;
            y = newY;
        }

        // 缩放（逆变换）
        x /= this.scale.x;
        y /= this.scale.y;

        return { x, y };
    }

    /**
     * 本地坐标转世界坐标
     */
    private localToWorld(localPoint: IPoint): IPoint {
        let x = localPoint.x;
        let y = localPoint.y;

        // 缩放
        x *= this.scale.x;
        y *= this.scale.y;

        // 旋转
        if (this.rotation !== 0) {
            const cos = Math.cos(this.rotation);
            const sin = Math.sin(this.rotation);
            const newX = x * cos - y * sin;
            const newY = x * sin + y * cos;
            x = newX;
            y = newY;
        }

        // 平移
        x += this.position.x;
        y += this.position.y;

        return { x, y };
    }

    /**
     * 获取边界框
     */
    getBounds(): { x: number; y: number; width: number; height: number } {
        if (this.vertices.length === 0) {
            return {
                x: this.position.x,
                y: this.position.y,
                width: 0,
                height: 0,
            };
        }

        // 获取变换后的顶点
        const transformedVertices = this.vertices.map((vertex) =>
            this.localToWorld(vertex),
        );

        const xs = transformedVertices.map((vertex) => vertex.x);
        const ys = transformedVertices.map((vertex) => vertex.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }

    /**
     * 获取变换后的顶点（世界坐标）
     */
    getTransformedVertices(): IPoint[] {
        return this.vertices.map((vertex) => this.localToWorld(vertex));
    }

    /**
     * 设置顶点
     */
    setVertices(vertices: IPoint[]): void {
        this.vertices = vertices;
    }

    /**
     * 添加顶点
     */
    addVertex(vertex: IPoint): void {
        this.vertices.push(vertex);
    }

    /**
     * 移除顶点
     */
    removeVertex(index: number): void {
        if (index >= 0 && index < this.vertices.length) {
            this.vertices.splice(index, 1);
        }
    }

    /**
     * 获取周长
     */
    getPerimeter(): number {
        if (this.vertices.length < 2) return 0;

        let perimeter = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % this.vertices.length];

            if (current && next) {
                const dx = next.x - current.x;
                const dy = next.y - current.y;
                perimeter += Math.sqrt(dx * dx + dy * dy);
            }
        }

        return perimeter;
    }

    /**
     * 获取面积（使用鞋带公式）
     */
    getArea(): number {
        if (this.vertices.length < 3) return 0;

        let area = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % this.vertices.length];

            if (current && next) {
                area += current.x * next.y - next.x * current.y;
            }
        }

        return Math.abs(area) / 2;
    }

    /**
     * 获取重心
     */
    getCentroid(): IPoint {
        if (this.vertices.length === 0) return { x: 0, y: 0 };

        let x = 0;
        let y = 0;
        for (const vertex of this.vertices) {
            x += vertex.x;
            y += vertex.y;
        }

        return {
            x: x / this.vertices.length,
            y: y / this.vertices.length,
        };
    }

    /**
     * 检查是否为凸多边形
     */
    isConvex(): boolean {
        if (this.vertices.length < 3) return false;

        let sign = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            const p1 = this.vertices[i];
            const p2 = this.vertices[(i + 1) % this.vertices.length];
            const p3 = this.vertices[(i + 2) % this.vertices.length];

            if (!p1 || !p2 || !p3) continue;

            const cross =
                (p2.x - p1.x) * (p3.y - p2.y) - (p2.y - p1.y) * (p3.x - p2.x);

            if (cross !== 0) {
                if (sign === 0) {
                    sign = cross > 0 ? 1 : -1;
                } else if ((cross > 0 ? 1 : -1) !== sign) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 创建正多边形
     */
    static createRegular(
        sides: number,
        radius: number,
        config?: Partial<IPolygon>,
    ): Polygon {
        const vertices: IPoint[] = [];
        const angleStep = (Math.PI * 2) / sides;

        for (let i = 0; i < sides; i++) {
            const angle = i * angleStep - Math.PI / 2; // 从顶部开始
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            });
        }

        return new Polygon({
            ...config,
            vertices,
        });
    }

    /**
     * 创建三角形
     */
    static createTriangle(size: number, config?: Partial<IPolygon>): Polygon {
        return Polygon.createRegular(3, size, config);
    }

    /**
     * 创建五角星
     */
    static createStar(
        outerRadius: number,
        innerRadius: number,
        points: number = 5,
        config?: Partial<IPolygon>,
    ): Polygon {
        const vertices: IPoint[] = [];
        const angleStep = Math.PI / points;

        for (let i = 0; i < points * 2; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            });
        }

        return new Polygon({
            ...config,
            vertices,
        });
    }

    /**
     * 创建箭头
     */
    static createArrow(
        length: number,
        width: number,
        headLength: number,
        headWidth: number,
        config?: Partial<IPolygon>,
    ): Polygon {
        const halfWidth = width / 2;
        const halfHeadWidth = headWidth / 2;
        const bodyLength = length - headLength;

        const vertices: IPoint[] = [
            { x: -length / 2, y: -halfWidth },
            { x: -length / 2 + bodyLength, y: -halfWidth },
            { x: -length / 2 + bodyLength, y: -halfHeadWidth },
            { x: length / 2, y: 0 },
            { x: -length / 2 + bodyLength, y: halfHeadWidth },
            { x: -length / 2 + bodyLength, y: halfWidth },
            { x: -length / 2, y: halfWidth },
        ];

        return new Polygon({
            ...config,
            vertices,
        });
    }

    /**
     * 获取多边形上的随机点
     */
    getRandomPointOnPolygon(): IPoint {
        if (this.vertices.length < 2) return { x: 0, y: 0 };

        const perimeter = this.getPerimeter();
        const targetDistance = Math.random() * perimeter;

        let currentDistance = 0;
        for (let i = 0; i < this.vertices.length; i++) {
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % this.vertices.length];

            if (!current || !next) continue;

            const dx = next.x - current.x;
            const dy = next.y - current.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            if (currentDistance + segmentLength >= targetDistance) {
                const t = (targetDistance - currentDistance) / segmentLength;
                const point = {
                    x: current.x + dx * t,
                    y: current.y + dy * t,
                };
                return this.localToWorld(point);
            }

            currentDistance += segmentLength;
        }

        return this.localToWorld(this.vertices[0] || { x: 0, y: 0 });
    }

    /**
     * 克隆多边形
     */
    clone(): Polygon {
        return new Polygon({
            id: this.id + "_clone",
            position: { ...this.position },
            color: this.color,
            visible: this.visible,
            alpha: this.alpha,
            rotation: this.rotation,
            vertices: this.vertices.map((vertex) => ({ ...vertex })),
            scale: { ...this.scale },
            origin: { ...this.origin },
            velocity: { ...this.velocity },
            angularVelocity: this.angularVelocity,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            shadow: this.shadow ? { ...this.shadow } : undefined,
        });
    }

    /**
     * 转换为接口对象
     */
    toInterface(): IPolygon {
        return {
            ...super.toInterface(),
            vertices: this.vertices.map((vertex) => ({ ...vertex })),
        };
    }
}
