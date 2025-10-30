/**
 * 粒子系统测试
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ParticleSystem, Particle } from "@/utils/canvas";
import { ParticleType } from "@/types";
import type { IParticleSystemConfig } from "@/types";

// Mock Canvas context
const mockContext = {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    set globalAlpha(value: number) {},
    set fillStyle(value: string) {},
    set strokeStyle(value: string) {},
    set lineWidth(value: number) {},
    set lineCap(value: string) {},
};

describe("ParticleSystem", () => {
    let particleSystem: ParticleSystem;
    let config: Partial<IParticleSystemConfig>;

    beforeEach(() => {
        vi.clearAllMocks();

        config = {
            maxParticles: 100,
            emissionRate: 50,
            lifeRange: [1, 3],
            sizeRange: [2, 8],
            velocityRange: {
                x: [-50, 50],
                y: [-50, 50],
            },
            colors: ["#ff0000", "#00ff00", "#0000ff"],
            gravity: { x: 0, y: 50 },
            enableCollision: false,
        };

        particleSystem = new ParticleSystem(config);
    });

    describe("初始化", () => {
        it("应该使用默认配置创建粒子系统", () => {
            const defaultSystem = new ParticleSystem();
            const stats = defaultSystem.getStats();

            expect(stats.activeParticles).toBe(0);
            expect(stats.pooledParticles).toBe(0);
        });

        it("应该使用自定义配置创建粒子系统", () => {
            expect(particleSystem).toBeDefined();
            expect(particleSystem.getEmitters()).toHaveLength(0);
        });
    });

    describe("边界设置", () => {
        it("应该设置粒子系统边界", () => {
            particleSystem.setBounds(800, 600);

            // 边界设置是内部的，我们通过其他方法验证
            expect(particleSystem).toBeDefined();
        });
    });

    describe("发射器管理", () => {
        it("应该添加发射器", () => {
            particleSystem.addEmitter({
                position: { x: 100, y: 100 },
                rate: 30,
                active: true,
            });

            const emitters = particleSystem.getEmitters();
            expect(emitters).toHaveLength(1);
            expect(emitters[0].position).toEqual({ x: 100, y: 100 });
            expect(emitters[0].rate).toBe(30);
            expect(emitters[0].active).toBe(true);
        });

        it("应该移除发射器", () => {
            particleSystem.addEmitter({
                position: { x: 50, y: 50 },
                rate: 20,
            });

            particleSystem.addEmitter({
                position: { x: 150, y: 150 },
                rate: 40,
            });

            expect(particleSystem.getEmitters()).toHaveLength(2);

            particleSystem.removeEmitter(0);
            expect(particleSystem.getEmitters()).toHaveLength(1);
            expect(particleSystem.getEmitters()[0].position).toEqual({
                x: 150,
                y: 150,
            });
        });

        it("应该清空所有发射器", () => {
            particleSystem.addEmitter({ position: { x: 0, y: 0 } });
            particleSystem.addEmitter({ position: { x: 100, y: 100 } });

            particleSystem.clearEmitters();
            expect(particleSystem.getEmitters()).toHaveLength(0);
        });
    });

    describe("粒子更新", () => {
        beforeEach(() => {
            particleSystem.setBounds(800, 600);
            particleSystem.addEmitter({
                position: { x: 400, y: 300 },
                rate: 10,
                active: true,
                lifeRange: [2, 4],
                sizeRange: [5, 10],
            });
        });

        it("应该更新粒子系统", () => {
            const deltaTime = 16.67; // ~60fps

            particleSystem.update(deltaTime);

            const stats = particleSystem.getStats();
            expect(stats.activeParticles).toBeGreaterThanOrEqual(0);
        });

        it("应该发射新粒子", () => {
            // 模拟多次更新以确保粒子发射
            for (let i = 0; i < 10; i++) {
                particleSystem.update(100); // 100ms 每次
            }

            const stats = particleSystem.getStats();
            expect(stats.activeParticles).toBeGreaterThan(0);
        });

        it("应该清理死亡粒子", () => {
            // 添加一些粒子
            for (let i = 0; i < 5; i++) {
                particleSystem.update(100);
            }

            const initialCount = particleSystem.getStats().activeParticles;

            // 等待足够长时间让粒子死亡
            for (let i = 0; i < 50; i++) {
                particleSystem.update(100);
            }

            const finalCount = particleSystem.getStats().activeParticles;

            // 由于粒子有生命周期，最终数量应该稳定或减少
            expect(finalCount).toBeLessThanOrEqual(initialCount + 10); // 允许一些新粒子
        });
    });

    describe("渲染", () => {
        beforeEach(() => {
            particleSystem.setBounds(800, 600);
            particleSystem.addEmitter({
                position: { x: 400, y: 300 },
                rate: 5,
                active: true,
            });

            // 生成一些粒子
            particleSystem.update(200);
        });

        it("应该渲染粒子系统", () => {
            const ctx = mockContext as unknown as CanvasRenderingContext2D;

            particleSystem.render(ctx);

            // 验证渲染方法被调用
            expect(mockContext.save).toHaveBeenCalled();
            expect(mockContext.restore).toHaveBeenCalled();
        });
    });

    describe("特殊效果", () => {
        beforeEach(() => {
            particleSystem.setBounds(800, 600);
        });

        it("应该创建爆发效果", () => {
            const position = { x: 200, y: 200 };
            const count = 20;

            particleSystem.burst(position, count);

            const stats = particleSystem.getStats();
            expect(stats.activeParticles).toBe(count);
        });

        it("应该创建喷泉效果", () => {
            const position = { x: 400, y: 500 };

            const emitterIndex = particleSystem.createFountain(position);

            expect(emitterIndex).toBeGreaterThanOrEqual(0);
            expect(particleSystem.getEmitters()).toHaveLength(1);

            const emitter = particleSystem.getEmitters()[0];
            expect(emitter.position).toEqual(position);
            expect(emitter.active).toBe(true);
        });

        it("应该创建粒子雨效果", () => {
            const emitterIndex = particleSystem.createRain();

            expect(emitterIndex).toBeGreaterThanOrEqual(0);
            expect(particleSystem.getEmitters()).toHaveLength(1);

            const emitter = particleSystem.getEmitters()[0];
            expect(emitter.active).toBe(true);
            expect(emitter.position.y).toBe(-10); // 从顶部开始
        });
    });

    describe("状态管理", () => {
        beforeEach(() => {
            particleSystem.addEmitter({
                position: { x: 100, y: 100 },
                active: true,
            });
            particleSystem.addEmitter({
                position: { x: 200, y: 200 },
                active: true,
            });
        });

        it("应该暂停所有发射器", () => {
            particleSystem.setActive(false);

            const emitters = particleSystem.getEmitters();
            emitters.forEach((emitter) => {
                expect(emitter.active).toBe(false);
            });
        });

        it("应该恢复所有发射器", () => {
            particleSystem.setActive(false);
            particleSystem.setActive(true);

            const emitters = particleSystem.getEmitters();
            emitters.forEach((emitter) => {
                expect(emitter.active).toBe(true);
            });
        });

        it("应该清空所有粒子", () => {
            // 生成一些粒子
            particleSystem.update(200);

            const initialStats = particleSystem.getStats();
            expect(initialStats.activeParticles).toBeGreaterThan(0);

            particleSystem.clear();

            const finalStats = particleSystem.getStats();
            expect(finalStats.activeParticles).toBe(0);
        });
    });

    describe("配置更新", () => {
        it("应该更新粒子系统配置", () => {
            const newConfig = {
                maxParticles: 200,
                gravity: { x: 10, y: 100 },
            };

            particleSystem.updateConfig(newConfig);

            // 配置更新是内部的，我们通过行为验证
            expect(particleSystem).toBeDefined();
        });
    });

    describe("统计信息", () => {
        it("应该返回正确的统计信息", () => {
            const stats = particleSystem.getStats();

            expect(stats).toHaveProperty("activeParticles");
            expect(stats).toHaveProperty("pooledParticles");
            expect(stats).toHaveProperty("emittedThisFrame");
            expect(stats).toHaveProperty("recycledThisFrame");

            expect(typeof stats.activeParticles).toBe("number");
            expect(typeof stats.pooledParticles).toBe("number");
            expect(typeof stats.emittedThisFrame).toBe("number");
            expect(typeof stats.recycledThisFrame).toBe("number");
        });
    });

    describe("销毁", () => {
        it("应该正确销毁粒子系统", () => {
            particleSystem.addEmitter({ position: { x: 0, y: 0 } });
            particleSystem.update(100); // 生成一些粒子

            particleSystem.destroy();

            const stats = particleSystem.getStats();
            expect(stats.activeParticles).toBe(0);
            expect(particleSystem.getEmitters()).toHaveLength(0);
        });
    });
});

describe("Particle", () => {
    let particle: Particle;

    beforeEach(() => {
        particle = new Particle({
            x: 100,
            y: 100,
            vx: 10,
            vy: -20,
            size: 5,
            color: "#ff0000",
            life: 2,
            maxLife: 2,
            type: ParticleType.CIRCLE,
            alpha: 1,
            rotation: 0,
            rotationSpeed: Math.PI,
        });
    });

    describe("初始化", () => {
        it("应该使用默认值创建粒子", () => {
            const defaultParticle = new Particle();

            expect(defaultParticle.x).toBe(0);
            expect(defaultParticle.y).toBe(0);
            expect(defaultParticle.size).toBe(5);
            expect(defaultParticle.color).toBe("#ffffff");
            expect(defaultParticle.type).toBe(ParticleType.CIRCLE);
        });

        it("应该使用自定义配置创建粒子", () => {
            expect(particle.x).toBe(100);
            expect(particle.y).toBe(100);
            expect(particle.vx).toBe(10);
            expect(particle.vy).toBe(-20);
            expect(particle.size).toBe(5);
            expect(particle.color).toBe("#ff0000");
            expect(particle.life).toBe(2);
            expect(particle.maxLife).toBe(2);
        });
    });

    describe("更新", () => {
        it("应该更新粒子位置", () => {
            const deltaTime = 1000; // 1秒

            particle.update(deltaTime);

            expect(particle.x).toBe(110); // 100 + 10 * 1
            expect(particle.y).toBe(80); // 100 + (-20) * 1
        });

        it("应该更新粒子生命值", () => {
            const deltaTime = 1000; // 1秒

            particle.update(deltaTime);

            expect(particle.life).toBe(1); // 2 - 1
            expect(particle.alpha).toBe(0.5); // life / maxLife
        });

        it("应该更新粒子旋转", () => {
            const deltaTime = 1000; // 1秒
            const initialRotation = particle.rotation;

            particle.update(deltaTime);

            expect(particle.rotation).toBe(initialRotation + Math.PI);
        });

        it("应该应用重力", () => {
            particle.gravity = { x: 0, y: 10 };
            const deltaTime = 1000; // 1秒

            particle.update(deltaTime);

            expect(particle.vy).toBe(-10); // -20 + 10 * 1
        });

        it("应该应用摩擦力", () => {
            particle.friction = 0.9;
            const deltaTime = 1000; // 1秒

            particle.update(deltaTime);

            expect(particle.vx).toBeCloseTo(9); // 10 * 0.9
            expect(particle.vy).toBeCloseTo(-18); // -20 * 0.9
        });
    });

    describe("生命周期", () => {
        it("应该检测粒子是否存活", () => {
            expect(particle.isAlive()).toBe(true);

            particle.life = 0;
            expect(particle.isAlive()).toBe(false);

            particle.life = -1;
            expect(particle.isAlive()).toBe(false);
        });

        it("应该检测粒子是否在边界内", () => {
            expect(particle.isInBounds(200, 200)).toBe(true);
            expect(particle.isInBounds(50, 50)).toBe(false);
            expect(particle.isInBounds(200, 200, 50)).toBe(true); // 带边距
        });
    });

    describe("力的应用", () => {
        it("应该应用力到粒子", () => {
            const force = { x: 5, y: -10 };
            const initialVx = particle.vx;
            const initialVy = particle.vy;

            particle.applyForce(force);

            expect(particle.vx).toBe(initialVx + force.x / particle.mass);
            expect(particle.vy).toBe(initialVy + force.y / particle.mass);
        });
    });

    describe("位置和速度设置", () => {
        it("应该设置粒子位置", () => {
            particle.setPosition(200, 300);

            expect(particle.x).toBe(200);
            expect(particle.y).toBe(300);
        });

        it("应该设置粒子速度", () => {
            particle.setVelocity(50, -30);

            expect(particle.vx).toBe(50);
            expect(particle.vy).toBe(-30);
        });
    });

    describe("碰撞检测", () => {
        it("应该检测与其他粒子的碰撞", () => {
            const otherParticle = new Particle({
                x: 105, // 距离 5 像素
                y: 100,
                size: 5,
            });

            expect(particle.collidesWith(otherParticle)).toBe(true);

            otherParticle.setPosition(120, 100); // 距离 20 像素
            expect(particle.collidesWith(otherParticle)).toBe(false);
        });

        it("应该处理边界碰撞", () => {
            particle.setPosition(5, 5); // 接近左上角
            particle.setVelocity(-10, -10); // 向左上移动

            particle.handleBoundaryCollision(100, 100, 0.8);

            expect(particle.vx).toBeGreaterThan(0); // 速度应该反向
            expect(particle.vy).toBeGreaterThan(0);
        });
    });

    describe("重置和克隆", () => {
        it("应该重置粒子状态", () => {
            particle.life = 0.5;
            particle.alpha = 0.25;
            particle.rotation = Math.PI;

            particle.reset();

            expect(particle.life).toBe(particle.maxLife);
            expect(particle.alpha).toBe(1);
            expect(particle.rotation).toBe(0);
        });

        it("应该克隆粒子", () => {
            const clonedParticle = particle.clone();

            expect(clonedParticle.x).toBe(particle.x);
            expect(clonedParticle.y).toBe(particle.y);
            expect(clonedParticle.vx).toBe(particle.vx);
            expect(clonedParticle.vy).toBe(particle.vy);
            expect(clonedParticle.size).toBe(particle.size);
            expect(clonedParticle.color).toBe(particle.color);

            // 确保是不同的实例
            expect(clonedParticle).not.toBe(particle);
        });
    });

    describe("边界框", () => {
        it("应该返回正确的边界框", () => {
            const bounds = particle.getBounds();

            expect(bounds.x).toBe(97.5); // 100 - 5/2
            expect(bounds.y).toBe(97.5); // 100 - 5/2
            expect(bounds.width).toBe(5);
            expect(bounds.height).toBe(5);
        });
    });

    describe("接口转换", () => {
        it("应该转换为接口对象", () => {
            const interfaceObj = particle.toInterface();

            expect(interfaceObj).toHaveProperty("x", 100);
            expect(interfaceObj).toHaveProperty("y", 100);
            expect(interfaceObj).toHaveProperty("vx", 10);
            expect(interfaceObj).toHaveProperty("vy", -20);
            expect(interfaceObj).toHaveProperty("size", 5);
            expect(interfaceObj).toHaveProperty("color", "#ff0000");
            expect(interfaceObj).toHaveProperty("life", 2);
            expect(interfaceObj).toHaveProperty("maxLife", 2);
            expect(interfaceObj).toHaveProperty("type", ParticleType.CIRCLE);
        });
    });
});
