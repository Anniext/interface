/**
 * Canvas 基础功能测试
 */

import { describe, it, expect } from "vitest";
import { ParticleType } from "@/types";

describe("Canvas 基础功能", () => {
    describe("类型定义", () => {
        it("应该正确定义粒子类型", () => {
            expect(ParticleType.CIRCLE).toBe("circle");
            expect(ParticleType.SQUARE).toBe("square");
            expect(ParticleType.TRIANGLE).toBe("triangle");
            expect(ParticleType.STAR).toBe("star");
        });
    });

    describe("模块导入", () => {
        it("应该能够导入 Canvas 工具", async () => {
            const canvasModule = await import("@/utils/canvas");

            expect(canvasModule).toBeDefined();
            expect(canvasModule.CanvasRenderer).toBeDefined();
            expect(canvasModule.ParticleSystem).toBeDefined();
            expect(canvasModule.Particle).toBeDefined();
            expect(canvasModule.ShapeManager).toBeDefined();
            expect(canvasModule.Circle).toBeDefined();
            expect(canvasModule.Rectangle).toBeDefined();
            expect(canvasModule.Polygon).toBeDefined();
        });
    });

    describe("工具函数", () => {
        it("应该能够导入工具函数", async () => {
            const canvasModule = await import("@/utils/canvas");

            expect(canvasModule.random).toBeDefined();
            expect(canvasModule.randomInt).toBeDefined();
            expect(canvasModule.distance).toBeDefined();
            expect(canvasModule.angle).toBeDefined();
            expect(canvasModule.lerp).toBeDefined();
            expect(canvasModule.clamp).toBeDefined();
        });

        it("应该正确计算距离", async () => {
            const { distance } = await import("@/utils/canvas");

            expect(distance(0, 0, 3, 4)).toBe(5); // 3-4-5 三角形
            expect(distance(0, 0, 0, 0)).toBe(0);
            expect(distance(-1, -1, 1, 1)).toBeCloseTo(2.828, 2);
        });

        it("应该正确进行线性插值", async () => {
            const { lerp } = await import("@/utils/canvas");

            expect(lerp(0, 10, 0.5)).toBe(5);
            expect(lerp(0, 10, 0)).toBe(0);
            expect(lerp(0, 10, 1)).toBe(10);
            expect(lerp(-5, 5, 0.5)).toBe(0);
        });

        it("应该正确限制数值范围", async () => {
            const { clamp } = await import("@/utils/canvas");

            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(15, 0, 10)).toBe(10);
        });

        it("应该生成指定范围内的随机数", async () => {
            const { random, randomInt } = await import("@/utils/canvas");

            for (let i = 0; i < 10; i++) {
                const value = random(5, 10);
                expect(value).toBeGreaterThanOrEqual(5);
                expect(value).toBeLessThanOrEqual(10);
            }

            for (let i = 0; i < 10; i++) {
                const value = randomInt(1, 5);
                expect(value).toBeGreaterThanOrEqual(1);
                expect(value).toBeLessThanOrEqual(5);
                expect(Number.isInteger(value)).toBe(true);
            }
        });
    });
});
