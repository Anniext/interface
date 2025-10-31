// 导出所有 Lottie 相关的工具和类型
export { LottieManager, lottieManager } from "./LottieManager";
export type { LottieAnimationConfig } from "./LottieManager";

export {
    lottieAnimations,
    getAnimationConfig,
    getAnimationsByCategory,
    getPreloadAnimations,
    getHighPriorityAnimations,
    AnimationCategory,
    ANIMATION_IDS,
} from "./lottie-config";
export type { AnimationId } from "./lottie-config";

/**
 * Lottie 动画工具函数
 */

/**
 * 创建简单的 Lottie 动画数据
 * 用于测试或占位符
 */
export function createSimpleLottieData(
    width = 100,
    height = 100,
    duration = 60,
): object {
    return {
        v: "5.7.4",
        fr: 30,
        ip: 0,
        op: duration,
        w: width,
        h: height,
        nm: "Simple Animation",
        ddd: 0,
        assets: [],
        layers: [
            {
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Circle",
                sr: 1,
                ks: {
                    o: { a: 0, k: 100 },
                    r: {
                        a: 1,
                        k: [
                            {
                                i: { x: [0.833], y: [0.833] },
                                o: { x: [0.167], y: [0.167] },
                                t: 0,
                                s: [0],
                            },
                            { t: duration - 1, s: [360] },
                        ],
                    },
                    p: { a: 0, k: [width / 2, height / 2, 0] },
                    a: { a: 0, k: [0, 0, 0] },
                    s: { a: 0, k: [100, 100, 100] },
                },
                ao: 0,
                shapes: [
                    {
                        ty: "gr",
                        it: [
                            {
                                d: 1,
                                ty: "el",
                                s: { a: 0, k: [50, 50] },
                                p: { a: 0, k: [0, 0] },
                            },
                            {
                                ty: "fl",
                                c: { a: 0, k: [0.2, 0.6, 1, 1] },
                                o: { a: 0, k: 100 },
                            },
                            {
                                ty: "tr",
                                p: { a: 0, k: [0, 0] },
                                a: { a: 0, k: [0, 0] },
                                s: { a: 0, k: [100, 100] },
                                r: { a: 0, k: 0 },
                                o: { a: 0, k: 100 },
                            },
                        ],
                    },
                ],
                ip: 0,
                op: duration,
                st: 0,
                bm: 0,
            },
        ],
        markers: [],
    };
}

/**
 * 验证 Lottie 动画数据格式
 */
export function validateLottieData(data: any): boolean {
    if (!data || typeof data !== "object") {
        return false;
    }

    // 检查必需的属性
    const requiredProps = ["v", "fr", "ip", "op", "layers"];
    for (const prop of requiredProps) {
        if (!(prop in data)) {
            return false;
        }
    }

    // 检查图层数组
    if (!Array.isArray(data.layers)) {
        return false;
    }

    return true;
}

/**
 * 获取动画基本信息
 */
export function getAnimationInfo(data: any) {
    if (!validateLottieData(data)) {
        throw new Error("无效的 Lottie 动画数据");
    }

    return {
        version: data.v,
        frameRate: data.fr,
        inPoint: data.ip,
        outPoint: data.op,
        width: data.w || 100,
        height: data.h || 100,
        duration: (data.op - data.ip) / data.fr,
        totalFrames: data.op - data.ip,
        name: data.nm || "Unnamed Animation",
        layerCount: data.layers.length,
        assetCount: data.assets ? data.assets.length : 0,
    };
}

/**
 * 计算动画文件大小（字节）
 */
export function calculateAnimationSize(data: object): number {
    return new Blob([JSON.stringify(data)]).size;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * 创建动画性能监控器
 */
export class LottiePerformanceMonitor {
    private startTime = 0;
    private frameCount = 0;
    private fps = 0;
    private lastFrameTime = 0;

    start(): void {
        this.startTime = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFrameTime = this.startTime;
    }

    recordFrame(): void {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;

        if (deltaTime > 0) {
            this.fps = 1000 / deltaTime;
        }

        this.lastFrameTime = currentTime;
    }

    getStats() {
        const currentTime = performance.now();
        const totalTime = currentTime - this.startTime;
        const averageFps =
            totalTime > 0 ? (this.frameCount * 1000) / totalTime : 0;

        return {
            totalFrames: this.frameCount,
            totalTime: totalTime,
            averageFps: Math.round(averageFps * 100) / 100,
            currentFps: Math.round(this.fps * 100) / 100,
        };
    }

    reset(): void {
        this.start();
    }
}

/**
 * 动画质量等级
 */
export enum AnimationQuality {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

/**
 * 根据设备性能调整动画质量
 */
export function getOptimalAnimationQuality(): AnimationQuality {
    // 检测设备性能指标
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;

    // 基于硬件信息判断
    if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
        return AnimationQuality.HIGH;
    }

    if (hardwareConcurrency >= 4 && deviceMemory >= 4) {
        return AnimationQuality.MEDIUM;
    }

    // 检查网络连接
    if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
            return AnimationQuality.LOW;
        }
    }

    return AnimationQuality.MEDIUM;
}

/**
 * 根据质量等级调整动画配置
 */
export function getQualityConfig(quality: AnimationQuality) {
    const configs = {
        [AnimationQuality.LOW]: {
            renderer: "canvas" as const,
            rendererSettings: {
                clearCanvas: true,
                progressiveLoad: true,
                hideOnTransparent: true,
            },
        },
        [AnimationQuality.MEDIUM]: {
            renderer: "svg" as const,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
                progressiveLoad: true,
                hideOnTransparent: true,
            },
        },
        [AnimationQuality.HIGH]: {
            renderer: "svg" as const,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid meet",
                progressiveLoad: false,
                hideOnTransparent: false,
            },
        },
    };

    return configs[quality];
}
