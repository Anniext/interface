/**
 * Canvas 渲染器测试
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { CanvasRenderer } from "@/utils/canvas";
import { ParticleType } from "@/types";
import type { ICanvasConfig, IParticle, ICircle } from "@/types";

// Mock Canvas API
const mockCanvas = {
    getContext: vi.fn(),
    width: 800,
    height: 600,
    style: {},
};

const mockContext = {
    scale: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    rect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    set fillStyle(value: string) {},
    set strokeStyle(value: string) {},
    set lineWidth(value: number) {},
    set globalAlpha(value: number) {},
    set imageSmoothingEnabled(value: boolean) {},
    set imageSmoothingQuality(value: string) {},
};

describe("CanvasRenderer", () => {
    let renderer: CanvasRenderer;
    let canvas: HTMLCanvasElement;
    let config: ICanvasConfig;

    beforeEach(() => {
        // 重置 mocks
        vi.clearAllMocks();

        // 设置 mock 返回值
        mockCanvas.getContext.mockReturnValue(mockContext);

        // 创建 canvas 和配置
        canvas = mockCanvas as unknown as HTMLCanvasElement;
        config = {
            width: 800,
            height: 600,
            pixelRatio: 1,
            alpha: true,
            backgroundColor: "transparent",
        };

        renderer = new CanvasRenderer();
    });

    describe("初始化", () => {
        it("应该正确初始化渲染器", () => {
            renderer.init(canvas, config);

            expect(mockCanvas.getContext).toHaveBeenCalledWith("2d", {
                alpha: true,
                desynchronized: true,
            });
            expect(mockContext.scale).toHaveBeenCalledWith(1, 1);
        });

        it("应该设置高分辨率适配", () => {
            const highDPIConfig = { ...config, pixelRatio: 2 };
            renderer.init(canvas, highDPIConfig);

            expect(canvas.width).toBe(1600); // 800 * 2
            expect(canvas.height).toBe(1200); // 600 * 2
            expect(mockContext.scale).toHaveBeenCalledWith(2, 2);
        });

        it("应该在无法获取上下文时抛出错误", () => {
            mockCanvas.getContext.mockReturnValue(null);

            expect(() => {
                renderer.init(canvas, config);
            }).toThrow("无法获取 Canvas 2D 渲染上下文");
        });
    });

    describe("清空画布", () => {
        beforeEach(() => {
            renderer.init(canvas, config);
        });

        it("应该使用 clearRect 清空透明背景", () => {
            renderer.clear();

            expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
            expect(mockContext.fillRect).not.toHaveBeenCalled();
        });

        it("应该使用 fillRect 填充背景色", () => {
            const colorConfig = { ...config, backgroundColor: "#000000" };
            renderer.init(canvas, colorConfig);
            renderer.clear();

            expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
        });
    });

    describe("粒子渲染", () => {
        beforeEach(() => {
            renderer.init(canvas, config);
        });

        it("应该渲染圆形粒子", () => {
            const particle: IParticle = {
                x: 100,
                y: 100,
                vx: 0,
                vy: 0,
                size: 10,
                color: "#ff0000",
                life: 1,
                maxLife: 1,
                type: ParticleType.CIRCLE,
                alpha: 1,
                rotation: 0,
                rotationSpeed: 0,
            };

            renderer.renderParticle(particle);

            expect(mockContext.save).toHaveBeenCalled();
            expect(mockContext.translate).toHaveBeenCalledWith(100, 100);
            expect(mockContext.beginPath).toHaveBeenCalled();
            expect(mockContext.arc).toHaveBeenCalledWith(
                0,
                0,
                5,
                0,
                Math.PI * 2,
            );
            expect(mockContext.fill).toHaveBeenCalled();
            expect(mockContext.restore).toHaveBeenCalled();
        });

        it("应该渲染方形粒子", () => {
            const particle: IParticle = {
                x: 50,
                y: 50,
                vx: 0,
                vy: 0,
                size: 20,
                color: "#00ff00",
                life: 1,
                maxLife: 1,
                type: ParticleType.SQUARE,
                alpha: 0.8,
                rotation: Math.PI / 4,
                rotationSpeed: 0,
            };

            renderer.renderParticle(particle);

            expect(mockContext.globalAlpha).toBe(0.8);
            expect(mockContext.rotate).toHaveBeenCalledWith(Math.PI / 4);
            expect(mockContext.fillRect).toHaveBeenCalledWith(-10, -10, 20, 20);
        });

        it("应该渲染三角形粒子", () => {
            const particle: IParticle = {
                x: 200,
                y: 200,
                vx: 0,
                vy: 0,
                size: 30,
                color: "#0000ff",
                life: 1,
                maxLife: 1,
                type: ParticleType.TRIANGLE,
                alpha: 1,
                rotation: 0,
                rotationSpeed: 0,
            };

            renderer.renderParticle(particle);

            expect(mockContext.beginPath).toHaveBeenCalled();
            expect(mockContext.moveTo).toHaveBeenCalled();
            expect(mockContext.lineTo).toHaveBeenCalledTimes(2);
            expect(mockContext.closePath).toHaveBeenCalled();
            expect(mockContext.fill).toHaveBeenCalled();
        });

        it("应该渲染星形粒子", () => {
            const particle: IParticle = {
                x: 300,
                y: 300,
                vx: 0,
                vy: 0,
                size: 40,
                color: "#ffff00",
                life: 1,
                maxLife: 1,
                type: ParticleType.STAR,
                alpha: 1,
                rotation: 0,
                rotationSpeed: 0,
            };

            renderer.renderParticle(particle);

            expect(mockContext.beginPath).toHaveBeenCalled();
            expect(mockContext.moveTo).toHaveBeenCalled();
            expect(mockContext.lineTo).toHaveBeenCalledTimes(9); // 5 * 2 - 1
            expect(mockContext.closePath).toHaveBeenCalled();
            expect(mockContext.fill).toHaveBeenCalled();
        });
    });

    describe("图形渲染", () => {
        beforeEach(() => {
            renderer.init(canvas, config);
        });

        it("应该渲染圆形", () => {
            const circle: ICircle = {
                id: "circle1",
                position: { x: 150, y: 150 },
                color: "#ff00ff",
                visible: true,
                alpha: 1,
                rotation: 0,
                radius: 25,
            };

            renderer.renderShape(circle);

            expect(mockContext.save).toHaveBeenCalled();
            expect(mockContext.translate).toHaveBeenCalledWith(150, 150);
            expect(mockContext.beginPath).toHaveBeenCalled();
            expect(mockContext.arc).toHaveBeenCalledWith(
                0,
                0,
                25,
                0,
                Math.PI * 2,
            );
            expect(mockContext.fill).toHaveBeenCalled();
            expect(mockContext.restore).toHaveBeenCalled();
        });

        it("应该跳过不可见的图形", () => {
            const circle: ICircle = {
                id: "circle2",
                position: { x: 100, y: 100 },
                color: "#00ffff",
                visible: false,
                alpha: 1,
                rotation: 0,
                radius: 20,
            };

            renderer.renderShape(circle);

            expect(mockContext.save).not.toHaveBeenCalled();
            expect(mockContext.translate).not.toHaveBeenCalled();
        });

        it("应该应用旋转变换", () => {
            const circle: ICircle = {
                id: "circle3",
                position: { x: 200, y: 200 },
                color: "#ffffff",
                visible: true,
                alpha: 1,
                rotation: Math.PI / 2,
                radius: 30,
            };

            renderer.renderShape(circle);

            expect(mockContext.rotate).toHaveBeenCalledWith(Math.PI / 2);
        });
    });

    describe("渲染循环", () => {
        beforeEach(() => {
            renderer.init(canvas, config);
            // Mock requestAnimationFrame
            global.requestAnimationFrame = vi.fn((callback) => {
                setTimeout(callback, 16);
                return 1;
            });
            global.cancelAnimationFrame = vi.fn();
        });

        it("应该启动渲染循环", () => {
            renderer.startRenderLoop();

            expect(global.requestAnimationFrame).toHaveBeenCalled();
        });

        it("应该停止渲染循环", () => {
            renderer.startRenderLoop();
            renderer.stopRenderLoop();

            expect(global.cancelAnimationFrame).toHaveBeenCalled();
        });

        it("应该防止重复启动渲染循环", () => {
            renderer.startRenderLoop();
            renderer.startRenderLoop();

            // 应该只调用一次
            expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
        });
    });

    describe("性能监控", () => {
        beforeEach(() => {
            renderer.init(canvas, config);
            // Mock performance.now
            global.performance.now = vi
                .fn()
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(16.67);
        });

        it("应该返回当前帧率", () => {
            // 模拟一些帧率更新
            renderer.startRenderLoop();

            const fps = renderer.getFPS();
            expect(typeof fps).toBe("number");
            expect(fps).toBeGreaterThanOrEqual(0);
        });

        it("应该返回渲染统计信息", () => {
            const stats = renderer.getRenderStats();

            expect(stats).toHaveProperty("fps");
            expect(stats).toHaveProperty("particleCount");
            expect(stats).toHaveProperty("shapeCount");
            expect(stats).toHaveProperty("renderTime");
            expect(stats).toHaveProperty("memoryUsage");
        });
    });

    describe("渲染质量", () => {
        beforeEach(() => {
            renderer.init(canvas, config);
        });

        it("应该设置低质量渲染", () => {
            renderer.setQuality("low");

            expect(mockContext.imageSmoothingEnabled).toBe(false);
        });

        it("应该设置中等质量渲染", () => {
            renderer.setQuality("medium");

            expect(mockContext.imageSmoothingEnabled).toBe(true);
            expect(mockContext.imageSmoothingQuality).toBe("medium");
        });

        it("应该设置高质量渲染", () => {
            renderer.setQuality("high");

            expect(mockContext.imageSmoothingEnabled).toBe(true);
            expect(mockContext.imageSmoothingQuality).toBe("high");
        });
    });

    describe("销毁", () => {
        it("应该正确清理资源", () => {
            renderer.init(canvas, config);
            renderer.startRenderLoop();

            renderer.destroy();

            expect(global.cancelAnimationFrame).toHaveBeenCalled();
        });
    });
});
