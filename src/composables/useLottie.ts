import { ref, onMounted, onBeforeUnmount, type Ref } from "vue";
import {
    lottieManager,
    type LottieAnimationConfig,
} from "@/utils/lottie/LottieManager";
import {
    getAnimationConfig,
    type AnimationId,
} from "@/utils/lottie/lottie-config";
import type { AnimationItem } from "lottie-web";

/**
 * Lottie 动画控制选项
 */
export interface UseLottieOptions {
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean | number;
    /** 播放速度 */
    speed?: number;
    /** 渲染器类型 */
    renderer?: "svg" | "canvas" | "html";
    /** 是否启用悬停播放 */
    hoverPlay?: boolean;
    /** 播放方向 */
    direction?: 1 | -1;
    /** 播放段落 */
    segments?: [number, number];
    /** 是否预加载 */
    preload?: boolean;
}

/**
 * Lottie 动画状态
 */
export interface LottieState {
    /** 动画实例 */
    animation: Ref<AnimationItem | null>;
    /** 是否正在加载 */
    isLoading: Ref<boolean>;
    /** 是否正在播放 */
    isPlaying: Ref<boolean>;
    /** 当前帧数 */
    currentFrame: Ref<number>;
    /** 总帧数 */
    totalFrames: Ref<number>;
    /** 动画数据 */
    animationData: Ref<object | null>;
    /** 错误信息 */
    error: Ref<string | null>;
}

/**
 * Lottie 动画控制方法
 */
export interface LottieControls {
    /** 播放动画 */
    play: () => void;
    /** 暂停动画 */
    pause: () => void;
    /** 停止动画 */
    stop: () => void;
    /** 跳转到指定帧并停止 */
    goToAndStop: (frame: number) => void;
    /** 跳转到指定帧并播放 */
    goToAndPlay: (frame: number) => void;
    /** 设置播放速度 */
    setSpeed: (speed: number) => void;
    /** 设置播放方向 */
    setDirection: (direction: 1 | -1) => void;
    /** 播放指定段落 */
    playSegments: (segments: [number, number], forceFlag?: boolean) => void;
    /** 重新加载动画 */
    reload: () => Promise<void>;
    /** 销毁动画 */
    destroy: () => void;
}

/**
 * useLottie 返回值类型
 */
export type UseLottieReturn = LottieState & LottieControls;

/**
 * Lottie 动画组合式函数
 * @param animationId 动画 ID 或配置对象
 * @param options 动画选项
 */
export function useLottie(
    animationId:
        | AnimationId
        | LottieAnimationConfig
        | Ref<AnimationId | LottieAnimationConfig>,
    options: UseLottieOptions = {},
): UseLottieReturn {
    // 响应式状态
    const animation = ref<AnimationItem | null>(null);
    const isLoading = ref(false);
    const isPlaying = ref(false);
    const currentFrame = ref(0);
    const totalFrames = ref(0);
    const animationData = ref<object | null>(null);
    const error = ref<string | null>(null);

    // 默认选项
    const defaultOptions: UseLottieOptions = {
        autoplay: true,
        loop: true,
        speed: 1,
        renderer: "svg",
        hoverPlay: false,
        direction: 1,
        preload: false,
    };

    const finalOptions = { ...defaultOptions, ...options };

    /**
     * 获取动画配置
     */
    const getConfig = (): LottieAnimationConfig => {
        const id =
            typeof animationId === "object" && "value" in animationId
                ? animationId.value
                : animationId;

        if (typeof id === "string") {
            const config = getAnimationConfig(id);
            if (!config) {
                throw new Error(`未找到动画配置: ${id}`);
            }
            return config;
        }

        return id as LottieAnimationConfig;
    };

    /**
     * 加载动画数据
     */
    const loadAnimationData = async (): Promise<object> => {
        try {
            isLoading.value = true;
            error.value = null;

            const config = getConfig();
            const data = await lottieManager.loadAnimation(config);

            animationData.value = data;
            return data;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "加载动画失败";
            error.value = errorMessage;
            console.error("Lottie 动画加载失败:", err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * 预加载动画
     */
    const preloadAnimation = async (): Promise<void> => {
        if (finalOptions.preload) {
            try {
                await loadAnimationData();
            } catch (err) {
                console.warn("预加载动画失败:", err);
            }
        }
    };

    // 控制方法
    const play = () => {
        if (animation.value) {
            animation.value.play();
            isPlaying.value = true;
        }
    };

    const pause = () => {
        if (animation.value) {
            animation.value.pause();
            isPlaying.value = false;
        }
    };

    const stop = () => {
        if (animation.value) {
            animation.value.stop();
            isPlaying.value = false;
            currentFrame.value = 0;
        }
    };

    const goToAndStop = (frame: number) => {
        if (animation.value) {
            animation.value.goToAndStop(frame, true);
            currentFrame.value = frame;
            isPlaying.value = false;
        }
    };

    const goToAndPlay = (frame: number) => {
        if (animation.value) {
            animation.value.goToAndPlay(frame, true);
            currentFrame.value = frame;
            isPlaying.value = true;
        }
    };

    const setSpeed = (speed: number) => {
        if (animation.value) {
            animation.value.setSpeed(speed);
        }
    };

    const setDirection = (direction: 1 | -1) => {
        if (animation.value) {
            animation.value.setDirection(direction);
        }
    };

    const playSegments = (segments: [number, number], forceFlag?: boolean) => {
        if (animation.value) {
            animation.value.playSegments(segments, forceFlag);
            isPlaying.value = true;
        }
    };

    const reload = async (): Promise<void> => {
        destroy();
        await loadAnimationData();
    };

    const destroy = () => {
        if (animation.value) {
            animation.value.destroy();
            animation.value = null;
            isPlaying.value = false;
            currentFrame.value = 0;
            totalFrames.value = 0;
        }
    };

    // 生命周期
    onMounted(() => {
        preloadAnimation();
    });

    onBeforeUnmount(() => {
        destroy();
    });

    return {
        // 状态
        animation,
        isLoading,
        isPlaying,
        currentFrame,
        totalFrames,
        animationData,
        error,

        // 控制方法
        play,
        pause,
        stop,
        goToAndStop,
        goToAndPlay,
        setSpeed,
        setDirection,
        playSegments,
        reload,
        destroy,
    };
}

/**
 * 批量预加载动画
 * @param animationIds 动画 ID 数组
 */
export async function preloadLottieAnimations(
    animationIds: AnimationId[],
): Promise<void> {
    const configs = animationIds
        .map((id) => getAnimationConfig(id))
        .filter(Boolean) as LottieAnimationConfig[];

    await lottieManager.preloadAnimations(configs);
}

/**
 * 获取 Lottie 缓存统计信息
 */
export function getLottieCacheStats() {
    return lottieManager.getCacheStats();
}

/**
 * 清理 Lottie 缓存
 */
export function clearLottieCache(): void {
    lottieManager.clearCache();
}
