/**
 * Canvas 2D 渲染器
 * 提供高性能的 Canvas 渲染功能
 */

import type {
    ICanvasConfig,
    IRenderer,
    IParticle,
    IShape,
    ICircle,
    IRectangle,
    IPolygon,
    IRenderStats,
} from "@/types";
import { ParticleType } from "@/types";

export class CanvasRenderer implements IRenderer {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private config: ICanvasConfig | null = null;
    private animationId: number | null = null;
    private isRendering = false;

    // 性能监控
    private frameCount = 0;
    private lastFpsUpdate = 0;
    private currentFps = 0;
    private renderStartTime = 0;

    // 渲染质量设置
    private quality: "low" | "medium" | "high" = "high";

    // 离屏 Canvas 用于优化
    private offscreenCanvas: HTMLCanvasElement | null = null;
    private offscreenCtx: CanvasRenderingContext2D | null = null;

    /**
     * 初始化渲染器
     */
    init(canvas: HTMLCanvasElement, config: ICanvasConfig): void {
        this.canvas = canvas;
        this.config = config;

        // 获取 2D 上下文
        this.ctx = canvas.getContext("2d", {
            alpha: config.alpha,
            desynchronized: true, // 提高性能
        });

        if (!this.ctx) {
            throw new Error("无法获取 Canvas 2D 渲染上下文");
        }

        // 设置高分辨率适配
        this.setupHighDPI();

        // 创建离屏 Canvas
        this.createOffscreenCanvas();

        // 设置渲染质量
        this.applyQualitySettings();
    }

    /**
     * 设置高分辨率适配
     */
    private setupHighDPI(): void {
        if (!this.canvas || !this.ctx || !this.config) return;

        const { width, height, pixelRatio } = this.config;

        // 设置实际画布大小
        this.canvas.width = width * pixelRatio;
        this.canvas.height = height * pixelRatio;

        // 设置显示大小
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        // 缩放上下文
        this.ctx.scale(pixelRatio, pixelRatio);
    }

    /**
     * 创建离屏 Canvas
     */
    private createOffscreenCanvas(): void {
        if (!this.config) return;

        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = this.config.width * this.config.pixelRatio;
        this.offscreenCanvas.height =
            this.config.height * this.config.pixelRatio;

        this.offscreenCtx = this.offscreenCanvas.getContext("2d");

        if (this.offscreenCtx) {
            this.offscreenCtx.scale(
                this.config.pixelRatio,
                this.config.pixelRatio,
            );
        }
    }

    /**
     * 应用渲染质量设置
     */
    private applyQualitySettings(): void {
        if (!this.ctx) return;

        switch (this.quality) {
            case "low":
                this.ctx.imageSmoothingEnabled = false;
                break;
            case "medium":
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.imageSmoothingQuality = "medium";
                break;
            case "high":
                this.ctx.imageSmoothingEnabled = true;
                this.ctx.imageSmoothingQuality = "high";
                break;
        }
    }

    /**
     * 清空画布
     */
    clear(): void {
        if (!this.ctx || !this.config) return;

        const { width, height, backgroundColor } = this.config;

        if (backgroundColor && backgroundColor !== "transparent") {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, width, height);
        } else {
            this.ctx.clearRect(0, 0, width, height);
        }
    }

    /**
     * 渲染粒子
     */
    renderParticle(particle: IParticle): void {
        if (!this.ctx) return;

        const ctx = this.ctx;
        const { x, y, size, color, alpha = 1, rotation = 0, type } = particle;

        ctx.save();

        // 设置透明度
        ctx.globalAlpha = alpha;

        // 移动到粒子位置
        ctx.translate(x, y);

        // 旋转
        if (rotation !== 0) {
            ctx.rotate(rotation);
        }

        // 设置颜色
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        // 根据类型绘制不同形状
        switch (type) {
            case ParticleType.CIRCLE:
                this.drawCircleParticle(ctx, size);
                break;
            case ParticleType.SQUARE:
                this.drawSquareParticle(ctx, size);
                break;
            case ParticleType.TRIANGLE:
                this.drawTriangleParticle(ctx, size);
                break;
            case ParticleType.STAR:
                this.drawStarParticle(ctx, size);
                break;
            default:
                this.drawCircleParticle(ctx, size);
        }

        ctx.restore();
    }

    /**
     * 绘制圆形粒子
     */
    private drawCircleParticle(
        ctx: CanvasRenderingContext2D,
        size: number,
    ): void {
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 绘制方形粒子
     */
    private drawSquareParticle(
        ctx: CanvasRenderingContext2D,
        size: number,
    ): void {
        const halfSize = size / 2;
        ctx.fillRect(-halfSize, -halfSize, size, size);
    }

    /**
     * 绘制三角形粒子
     */
    private drawTriangleParticle(
        ctx: CanvasRenderingContext2D,
        size: number,
    ): void {
        const height = size * 0.866; // √3/2

        ctx.beginPath();
        ctx.moveTo(0, -height / 2);
        ctx.lineTo(-size / 2, height / 2);
        ctx.lineTo(size / 2, height / 2);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * 绘制星形粒子
     */
    private drawStarParticle(
        ctx: CanvasRenderingContext2D,
        size: number,
    ): void {
        const outerRadius = size / 2;
        const innerRadius = outerRadius * 0.4;
        const spikes = 5;

        ctx.beginPath();

        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fill();
    }

    /**
     * 渲染图形
     */
    renderShape(shape: IShape): void {
        if (!this.ctx || !shape.visible) return;

        const ctx = this.ctx;
        const { position, color, alpha, rotation } = shape;

        ctx.save();

        // 设置透明度
        ctx.globalAlpha = alpha;

        // 移动到图形位置
        ctx.translate(position.x, position.y);

        // 旋转
        if (rotation !== 0) {
            ctx.rotate(rotation);
        }

        // 设置颜色
        ctx.fillStyle = color;
        ctx.strokeStyle = color;

        // 根据图形类型进行渲染
        if ("radius" in shape) {
            this.renderCircle(ctx, shape as ICircle);
        } else if ("size" in shape) {
            this.renderRectangle(ctx, shape as IRectangle);
        } else if ("vertices" in shape) {
            this.renderPolygon(ctx, shape as IPolygon);
        }

        ctx.restore();
    }

    /**
     * 渲染圆形
     */
    private renderCircle(ctx: CanvasRenderingContext2D, circle: ICircle): void {
        ctx.beginPath();
        ctx.arc(0, 0, circle.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * 渲染矩形
     */
    private renderRectangle(
        ctx: CanvasRenderingContext2D,
        rectangle: IRectangle,
    ): void {
        const { width, height } = rectangle.size;
        ctx.fillRect(-width / 2, -height / 2, width, height);
    }

    /**
     * 渲染多边形
     */
    private renderPolygon(
        ctx: CanvasRenderingContext2D,
        polygon: IPolygon,
    ): void {
        const { vertices } = polygon;

        if (vertices.length < 3) return;

        ctx.beginPath();
        const firstVertex = vertices[0];
        if (firstVertex) {
            ctx.moveTo(firstVertex.x, firstVertex.y);
        }

        for (let i = 1; i < vertices.length; i++) {
            const vertex = vertices[i];
            if (vertex) {
                ctx.lineTo(vertex.x, vertex.y);
            }
        }

        ctx.closePath();
        ctx.fill();
    }

    /**
     * 开始渲染循环
     */
    startRenderLoop(): void {
        if (this.isRendering) return;

        this.isRendering = true;
        this.lastFpsUpdate = performance.now();
        this.frameCount = 0;

        const renderLoop = (currentTime: number) => {
            if (!this.isRendering) return;

            this.renderStartTime = performance.now();

            // 更新帧率统计
            this.updateFpsStats(currentTime);

            // 继续下一帧
            this.animationId = requestAnimationFrame(renderLoop);
        };

        this.animationId = requestAnimationFrame(renderLoop);
    }

    /**
     * 停止渲染循环
     */
    stopRenderLoop(): void {
        this.isRendering = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 更新帧率统计
     */
    private updateFpsStats(currentTime: number): void {
        this.frameCount++;

        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
    }

    /**
     * 获取当前帧率
     */
    getFPS(): number {
        return this.currentFps;
    }

    /**
     * 设置渲染质量
     */
    setQuality(quality: "low" | "medium" | "high"): void {
        this.quality = quality;
        this.applyQualitySettings();
    }

    /**
     * 获取渲染统计信息
     */
    getRenderStats(): IRenderStats {
        return {
            fps: this.currentFps,
            particleCount: 0, // 由粒子系统提供
            shapeCount: 0, // 由图形系统提供
            renderTime: performance.now() - this.renderStartTime,
            memoryUsage: this.getMemoryUsage(),
        };
    }

    /**
     * 获取内存使用量（估算）
     */
    private getMemoryUsage(): number {
        // 简单的内存使用量估算
        if ("memory" in performance && (performance as any).memory) {
            return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
        }
        return 0;
    }

    /**
     * 销毁渲染器
     */
    destroy(): void {
        this.stopRenderLoop();

        this.canvas = null;
        this.ctx = null;
        this.config = null;
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
    }
}
