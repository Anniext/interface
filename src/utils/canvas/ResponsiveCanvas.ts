/**
 * 响应式 Canvas 管理工具
 * 处理 Canvas 的响应式尺寸调整和设备适配
 */

import type { ICanvasConfig, ISize } from "@/types";

export interface IResponsiveConfig {
    /** 是否启用响应式 */
    enabled: boolean;
    /** 最小尺寸 */
    minSize: ISize;
    /** 最大尺寸 */
    maxSize: ISize;
    /** 宽高比约束 */
    aspectRatio?: number;
    /** 是否保持宽高比 */
    maintainAspectRatio: boolean;
    /** 响应式断点 */
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    /** 设备特定配置 */
    deviceConfigs: {
        mobile: Partial<ICanvasConfig>;
        tablet: Partial<ICanvasConfig>;
        desktop: Partial<ICanvasConfig>;
    };
}

export type DeviceType = "mobile" | "tablet" | "desktop";

export class ResponsiveCanvas {
    private config: IResponsiveConfig;
    private currentSize: ISize = { width: 0, height: 0 };
    private currentDevice: DeviceType = "desktop";
    private resizeObserver: ResizeObserver | null = null;
    private container: HTMLElement | null = null;

    // 回调函数
    private onResize?: (size: ISize, device: DeviceType) => void;
    private onDeviceChange?: (device: DeviceType) => void;

    constructor(config: Partial<IResponsiveConfig> = {}) {
        this.config = {
            enabled: true,
            minSize: { width: 320, height: 240 },
            maxSize: { width: 1920, height: 1080 },
            maintainAspectRatio: false,
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1920,
            },
            deviceConfigs: {
                mobile: {
                    pixelRatio: Math.min(window.devicePixelRatio, 2), // 限制移动端像素比
                    alpha: true,
                },
                tablet: {
                    pixelRatio: window.devicePixelRatio,
                    alpha: true,
                },
                desktop: {
                    pixelRatio: window.devicePixelRatio,
                    alpha: true,
                },
            },
            ...config,
        };
    }

    /**
     * 初始化响应式管理
     */
    init(container: HTMLElement): void {
        this.container = container;

        if (!this.config.enabled) return;

        // 初始化尺寸
        this.updateSize();

        // 设置 ResizeObserver
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateSize();
            });
            this.resizeObserver.observe(container);
        }

        // 监听窗口大小变化（备用方案）
        window.addEventListener("resize", this.handleWindowResize);
        window.addEventListener(
            "orientationchange",
            this.handleOrientationChange,
        );
    }

    /**
     * 更新尺寸
     */
    private updateSize(): void {
        if (!this.container) return;

        const rect = this.container.getBoundingClientRect();
        let newSize = {
            width: rect.width,
            height: rect.height,
        };

        // 应用尺寸约束
        newSize = this.applySizeConstraints(newSize);

        // 检查设备类型变化
        const newDevice = this.detectDevice();
        const deviceChanged = newDevice !== this.currentDevice;

        // 更新当前状态
        const sizeChanged =
            newSize.width !== this.currentSize.width ||
            newSize.height !== this.currentSize.height;

        this.currentSize = newSize;

        if (deviceChanged) {
            this.currentDevice = newDevice;
            this.onDeviceChange?.(newDevice);
        }

        if (sizeChanged || deviceChanged) {
            this.onResize?.(newSize, this.currentDevice);
        }
    }

    /**
     * 应用尺寸约束
     */
    private applySizeConstraints(size: ISize): ISize {
        const { minSize, maxSize, aspectRatio, maintainAspectRatio } =
            this.config;

        let { width, height } = size;

        // 应用最小/最大尺寸约束
        width = Math.max(minSize.width, Math.min(maxSize.width, width));
        height = Math.max(minSize.height, Math.min(maxSize.height, height));

        // 保持宽高比
        if (maintainAspectRatio && aspectRatio) {
            const currentRatio = width / height;

            if (currentRatio > aspectRatio) {
                // 宽度过大，调整宽度
                width = height * aspectRatio;
            } else if (currentRatio < aspectRatio) {
                // 高度过大，调整高度
                height = width / aspectRatio;
            }
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * 检测设备类型
     */
    private detectDevice(): DeviceType {
        const width = window.innerWidth;
        const { breakpoints } = this.config;

        if (width < breakpoints.mobile) {
            return "mobile";
        } else if (width < breakpoints.tablet) {
            return "tablet";
        } else {
            return "desktop";
        }
    }

    /**
     * 处理窗口大小变化
     */
    private handleWindowResize = (): void => {
        // 防抖处理
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateSize();
        }, 100);
    };

    private resizeTimeout: number | undefined;

    /**
     * 处理设备方向变化
     */
    private handleOrientationChange = (): void => {
        // 延迟处理，等待方向变化完成
        setTimeout(() => {
            this.updateSize();
        }, 200);
    };

    /**
     * 获取当前尺寸
     */
    getCurrentSize(): ISize {
        return { ...this.currentSize };
    }

    /**
     * 获取当前设备类型
     */
    getCurrentDevice(): DeviceType {
        return this.currentDevice;
    }

    /**
     * 获取设备特定配置
     */
    getDeviceConfig(device?: DeviceType): Partial<ICanvasConfig> {
        const targetDevice = device || this.currentDevice;
        return { ...this.config.deviceConfigs[targetDevice] };
    }

    /**
     * 获取完整的 Canvas 配置
     */
    getCanvasConfig(baseConfig: Partial<ICanvasConfig> = {}): ICanvasConfig {
        const deviceConfig = this.getDeviceConfig();
        const { width, height } = this.currentSize;

        return {
            width,
            height,
            pixelRatio: window.devicePixelRatio,
            alpha: true,
            backgroundColor: "transparent",
            ...baseConfig,
            ...deviceConfig,
        };
    }

    /**
     * 检查是否为移动设备
     */
    isMobile(): boolean {
        return this.currentDevice === "mobile";
    }

    /**
     * 检查是否为平板设备
     */
    isTablet(): boolean {
        return this.currentDevice === "tablet";
    }

    /**
     * 检查是否为桌面设备
     */
    isDesktop(): boolean {
        return this.currentDevice === "desktop";
    }

    /**
     * 检查是否为触摸设备
     */
    isTouchDevice(): boolean {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }

    /**
     * 获取设备像素比
     */
    getPixelRatio(): number {
        const deviceConfig = this.getDeviceConfig();
        return deviceConfig.pixelRatio || window.devicePixelRatio;
    }

    /**
     * 设置尺寸变化回调
     */
    setResizeCallback(
        callback: (size: ISize, device: DeviceType) => void,
    ): void {
        this.onResize = callback;
    }

    /**
     * 设置设备变化回调
     */
    setDeviceChangeCallback(callback: (device: DeviceType) => void): void {
        this.onDeviceChange = callback;
    }

    /**
     * 更新配置
     */
    updateConfig(config: Partial<IResponsiveConfig>): void {
        this.config = { ...this.config, ...config };

        // 重新计算尺寸
        if (this.config.enabled) {
            this.updateSize();
        }
    }

    /**
     * 启用/禁用响应式
     */
    setEnabled(enabled: boolean): void {
        this.config.enabled = enabled;

        if (enabled && this.container) {
            this.updateSize();
        }
    }

    /**
     * 手动触发尺寸更新
     */
    forceUpdate(): void {
        this.updateSize();
    }

    /**
     * 获取推荐的性能设置
     */
    getPerformanceRecommendations(): {
        maxParticles: number;
        renderQuality: "low" | "medium" | "high";
        enableOffscreen: boolean;
    } {
        const device = this.currentDevice;
        const size = this.currentSize;
        const pixelCount = size.width * size.height;

        switch (device) {
            case "mobile":
                return {
                    maxParticles: Math.min(200, pixelCount / 1000),
                    renderQuality: pixelCount > 300000 ? "low" : "medium",
                    enableOffscreen: false,
                };

            case "tablet":
                return {
                    maxParticles: Math.min(500, pixelCount / 800),
                    renderQuality: pixelCount > 500000 ? "medium" : "high",
                    enableOffscreen: true,
                };

            case "desktop":
                return {
                    maxParticles: Math.min(1000, pixelCount / 600),
                    renderQuality: "high",
                    enableOffscreen: true,
                };

            default:
                return {
                    maxParticles: 300,
                    renderQuality: "medium",
                    enableOffscreen: true,
                };
        }
    }

    /**
     * 销毁响应式管理
     */
    destroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        window.removeEventListener("resize", this.handleWindowResize);
        window.removeEventListener(
            "orientationchange",
            this.handleOrientationChange,
        );

        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        this.container = null;
        this.onResize = undefined;
        this.onDeviceChange = undefined;
    }
}
