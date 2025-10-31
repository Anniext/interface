// SVG 动画工具函数测试

import { describe, it, expect, beforeEach, vi } from "vitest";
import { JSDOM } from "jsdom";
import {
    createPathDrawAnimation,
    createMorphAnimation,
    createGlowAnimation,
    createBounceAnimation,
    createSpinAnimation,
    createPulseAnimation,
    createShakeAnimation,
    createFlipAnimation,
    createFadeInAnimation,
    createSlideInAnimation,
    ANIMATION_PRESETS,
} from "@/utils/svg-animations";

// Mock GSAP
vi.mock("gsap", () => ({
    gsap: {
        timeline: vi.fn(() => ({
            to: vi.fn().mockReturnThis(),
            fromTo: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            add: vi.fn().mockReturnThis(),
        })),
        set: vi.fn(),
        to: vi.fn(),
        fromTo: vi.fn(),
    },
}));

describe("SVG 动画工具函数", () => {
    let mockElement: HTMLElement;
    let mockSvgElement: SVGElement;

    beforeEach(() => {
        // 设置 DOM 环境
        const dom = new JSDOM(`
      <html>
        <body>
          <div id="test-element"></div>
          <svg id="test-svg">
            <path d="M10,10 L20,20" />
            <path d="M20,10 L10,20" />
          </svg>
        </body>
      </html>
    `);

        global.document = dom.window.document;
        global.window = dom.window as any;

        mockElement = document.getElementById("test-element") as HTMLElement;
        mockSvgElement = document.getElementById("test-svg") as SVGElement;

        // Mock SVG path methods
        const mockPath = {
            getTotalLength: vi.fn(() => 100),
        };

        vi.spyOn(mockSvgElement, "querySelectorAll").mockReturnValue([
            mockPath as any,
            mockPath as any,
        ]);
    });

    describe("createPathDrawAnimation", () => {
        it("应该创建路径描边动画", () => {
            const animation = createPathDrawAnimation(mockSvgElement);
            expect(animation).toBeDefined();
        });

        it("应该处理没有路径的 SVG", () => {
            const emptySvg = document.createElement("svg");
            vi.spyOn(emptySvg, "querySelectorAll").mockReturnValue([]);

            const animation = createPathDrawAnimation(emptySvg);
            expect(animation).toBeDefined();
        });

        it("应该支持自定义配置", () => {
            const config = {
                duration: 3,
                ease: "power3.out",
                stagger: 0.2,
            };

            const animation = createPathDrawAnimation(mockSvgElement, config);
            expect(animation).toBeDefined();
        });
    });

    describe("createMorphAnimation", () => {
        it("应该创建变形动画", () => {
            const animation = createMorphAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该支持自定义配置", () => {
            const config = {
                duration: 2,
                ease: "back.out(1.7)",
            };

            const animation = createMorphAnimation(mockElement, config);
            expect(animation).toBeDefined();
        });
    });

    describe("createGlowAnimation", () => {
        it("应该创建发光动画", () => {
            const animation = createGlowAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该支持无限循环", () => {
            const config = {
                repeat: -1,
                yoyo: true,
            };

            const animation = createGlowAnimation(mockElement, config);
            expect(animation).toBeDefined();
        });
    });

    describe("createBounceAnimation", () => {
        it("应该创建弹跳动画", () => {
            const animation = createBounceAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该从正确的起始位置开始", () => {
            const animation = createBounceAnimation(mockElement);
            expect(animation).toBeDefined();
        });
    });

    describe("createSpinAnimation", () => {
        it("应该创建旋转动画", () => {
            const animation = createSpinAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该支持无限旋转", () => {
            const config = {
                repeat: -1,
            };

            const animation = createSpinAnimation(mockElement, config);
            expect(animation).toBeDefined();
        });
    });

    describe("createPulseAnimation", () => {
        it("应该创建脉冲动画", () => {
            const animation = createPulseAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该支持往返动画", () => {
            const config = {
                yoyo: true,
                repeat: -1,
            };

            const animation = createPulseAnimation(mockElement, config);
            expect(animation).toBeDefined();
        });
    });

    describe("createShakeAnimation", () => {
        it("应该创建摇摆动画", () => {
            const animation = createShakeAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该回到原始位置", () => {
            const animation = createShakeAnimation(mockElement);
            expect(animation).toBeDefined();
        });
    });

    describe("createFlipAnimation", () => {
        it("应该创建翻转动画", () => {
            const animation = createFlipAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该支持 Y 轴翻转", () => {
            const animation = createFlipAnimation(mockElement);
            expect(animation).toBeDefined();
        });
    });

    describe("createFadeInAnimation", () => {
        it("应该创建淡入动画", () => {
            const animation = createFadeInAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该从透明到不透明", () => {
            const animation = createFadeInAnimation(mockElement);
            expect(animation).toBeDefined();
        });
    });

    describe("createSlideInAnimation", () => {
        it("应该创建滑入动画", () => {
            const animation = createSlideInAnimation(mockElement);
            expect(animation).toBeDefined();
        });

        it("应该支持不同方向", () => {
            const directions = ["left", "right", "top", "bottom"] as const;

            directions.forEach((direction) => {
                const animation = createSlideInAnimation(
                    mockElement,
                    direction,
                );
                expect(animation).toBeDefined();
            });
        });
    });

    describe("ANIMATION_PRESETS", () => {
        it("应该包含所有预设动画配置", () => {
            expect(ANIMATION_PRESETS.hover).toBeDefined();
            expect(ANIMATION_PRESETS.click).toBeDefined();
            expect(ANIMATION_PRESETS.loading).toBeDefined();
            expect(ANIMATION_PRESETS.success).toBeDefined();
            expect(ANIMATION_PRESETS.error).toBeDefined();
            expect(ANIMATION_PRESETS.warning).toBeDefined();
        });

        it("应该有正确的配置结构", () => {
            Object.values(ANIMATION_PRESETS).forEach((preset) => {
                expect(preset).toHaveProperty("duration");
                expect(preset).toHaveProperty("ease");
            });
        });
    });
});
