import type { AnimationItem } from "lottie-web";

/**
 * Lottie 动画配置接口
 */
export interface LottieAnimationConfig {
    /** 动画唯一标识 */
    id: string;
    /** 动画文件路径 */
    path?: string;
    /** 动画数据 */
    data?: object;
    /** 是否预加载 */
    preload?: boolean;
    /** 缓存优先级 */
    priority?: "high" | "medium" | "low";
    /** 动画描述 */
    description?: string;
}

/**
 * 缓存的动画数据
 */
interface CachedAnimation {
    id: string;
    data: object;
    loadTime: number;
    accessCount: number;
    lastAccess: number;
    size: number;
}

/**
 * Lottie 动画管理器
 * 负责动画资源的加载、缓存和优化
 */
export class LottieManager {
    private static instance: LottieManager;
    private cache = new Map<string, CachedAnimation>();
    private loadingPromises = new Map<string, Promise<object>>();
    private maxCacheSize = 50 * 1024 * 1024; // 50MB 缓存限制
    private currentCacheSize = 0;

    private constructor() {}

    /**
     * 获取单例实例
     */
    static getInstance(): LottieManager {
        if (!LottieManager.instance) {
            LottieManager.instance = new LottieManager();
        }
        return LottieManager.instance;
    }

    /**
     * 加载动画数据
     */
    async loadAnimation(config: LottieAnimationConfig): Promise<object> {
        const { id, path, data } = config;

        // 如果提供了数据，直接返回
        if (data) {
            this.cacheAnimation(id, data);
            return data;
        }

        // 检查缓存
        const cached = this.getFromCache(id);
        if (cached) {
            return cached.data;
        }

        // 检查是否正在加载
        if (this.loadingPromises.has(id)) {
            return this.loadingPromises.get(id)!;
        }

        // 开始加载
        if (!path) {
            throw new Error(`动画 ${id} 缺少路径或数据`);
        }

        const loadPromise = this.fetchAnimationData(path)
            .then((animationData) => {
                this.cacheAnimation(id, animationData);
                this.loadingPromises.delete(id);
                return animationData;
            })
            .catch((error) => {
                this.loadingPromises.delete(id);
                throw error;
            });

        this.loadingPromises.set(id, loadPromise);
        return loadPromise;
    }

    /**
     * 预加载动画
     */
    async preloadAnimations(configs: LottieAnimationConfig[]): Promise<void> {
        const preloadConfigs = configs.filter((config) => config.preload);

        // 按优先级排序
        preloadConfigs.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (
                priorityOrder[b.priority || "medium"] -
                priorityOrder[a.priority || "medium"]
            );
        });

        // 并发加载高优先级动画
        const highPriorityConfigs = preloadConfigs.filter(
            (config) => config.priority === "high",
        );
        const mediumPriorityConfigs = preloadConfigs.filter(
            (config) => config.priority === "medium",
        );
        const lowPriorityConfigs = preloadConfigs.filter(
            (config) => config.priority === "low",
        );

        try {
            // 高优先级动画并发加载
            await Promise.all(
                highPriorityConfigs.map((config) => this.loadAnimation(config)),
            );

            // 中优先级动画并发加载
            await Promise.all(
                mediumPriorityConfigs.map((config) =>
                    this.loadAnimation(config),
                ),
            );

            // 低优先级动画顺序加载
            for (const config of lowPriorityConfigs) {
                try {
                    await this.loadAnimation(config);
                } catch (error) {
                    console.warn(`预加载动画 ${config.id} 失败:`, error);
                }
            }
        } catch (error) {
            console.error("预加载动画失败:", error);
        }
    }

    /**
     * 获取缓存的动画数据
     */
    getCachedAnimation(id: string): object | null {
        const cached = this.getFromCache(id);
        return cached ? cached.data : null;
    }

    /**
     * 清理缓存
     */
    clearCache(): void {
        this.cache.clear();
        this.currentCacheSize = 0;
    }

    /**
     * 获取缓存统计信息
     */
    getCacheStats() {
        return {
            totalAnimations: this.cache.size,
            totalSize: this.currentCacheSize,
            maxSize: this.maxCacheSize,
            usage: (this.currentCacheSize / this.maxCacheSize) * 100,
        };
    }

    /**
     * 从网络获取动画数据
     */
    private async fetchAnimationData(path: string): Promise<object> {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`,
                );
            }

            const animationData = await response.json();

            // 验证动画数据格式
            if (!this.isValidLottieData(animationData)) {
                throw new Error("无效的 Lottie 动画数据格式");
            }

            return animationData;
        } catch (error) {
            throw new Error(`加载动画失败: ${error}`);
        }
    }

    /**
     * 验证 Lottie 数据格式
     */
    private isValidLottieData(data: any): boolean {
        return (
            data &&
            typeof data === "object" &&
            data.v && // 版本号
            data.fr && // 帧率
            data.ip !== undefined && // 开始帧
            data.op !== undefined && // 结束帧
            Array.isArray(data.layers) // 图层数组
        );
    }

    /**
     * 缓存动画数据
     */
    private cacheAnimation(id: string, data: object): void {
        const size = this.calculateDataSize(data);
        const now = Date.now();

        // 检查缓存空间
        this.ensureCacheSpace(size);

        const cached: CachedAnimation = {
            id,
            data,
            loadTime: now,
            accessCount: 1,
            lastAccess: now,
            size,
        };

        this.cache.set(id, cached);
        this.currentCacheSize += size;
    }

    /**
     * 从缓存获取动画数据
     */
    private getFromCache(id: string): CachedAnimation | null {
        const cached = this.cache.get(id);
        if (cached) {
            cached.accessCount++;
            cached.lastAccess = Date.now();
            return cached;
        }
        return null;
    }

    /**
     * 确保缓存空间足够
     */
    private ensureCacheSpace(requiredSize: number): void {
        if (this.currentCacheSize + requiredSize <= this.maxCacheSize) {
            return;
        }

        // 按最近最少使用 (LRU) 算法清理缓存
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);

        for (const [id, cached] of entries) {
            this.cache.delete(id);
            this.currentCacheSize -= cached.size;

            if (this.currentCacheSize + requiredSize <= this.maxCacheSize) {
                break;
            }
        }
    }

    /**
     * 计算数据大小（粗略估算）
     */
    private calculateDataSize(data: object): number {
        return JSON.stringify(data).length * 2; // 粗略估算，考虑 UTF-16 编码
    }
}

/**
 * 导出单例实例
 */
export const lottieManager = LottieManager.getInstance();
